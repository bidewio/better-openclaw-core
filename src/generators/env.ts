import { randomBytes } from "node:crypto";
import type { ResolverOutput } from "../types.js";
import { getDbRequirements } from "./postgres-init.js";

/**
 * Options for environment file generation.
 */
export interface EnvGeneratorOptions {
	generateSecrets: boolean;
	domain?: string;
	openclawVersion?: string;
	/** When set, host-like vars (e.g. REDIS_HOST) for these services use host.docker.internal so gateway in Docker can reach native services on host. */
	nativeServiceIds?: Set<string>;
}

/**
 * Generates `.env.example` and `.env` file contents from resolved services.
 *
 * - `.env.example`: every env var with descriptive comments, placeholders for secrets
 * - `.env`: same vars but secrets filled with cryptographically random values when generateSecrets is true
 */
export function generateEnvFiles(
	resolved: ResolverOutput,
	options: EnvGeneratorOptions,
): { envExample: string; env: string } {
	const version = options.openclawVersion ?? "latest";
	const lines: { comment: string; key: string; exampleValue: string; actualValue: string }[] = [];

	// ── Base OpenClaw Variables ──────────────────────────────────────────────

	lines.push({
		comment: formatComment("OpenClaw version to deploy", "OpenClaw Core", true, false),
		key: "OPENCLAW_VERSION",
		exampleValue: version,
		actualValue: version,
	});

	const gatewayToken = options.generateSecrets ? randomBytes(24).toString("hex") : "";

	lines.push({
		comment: formatComment(
			"Authentication token for the OpenClaw gateway API",
			"OpenClaw Core",
			true,
			true,
		),
		key: "OPENCLAW_GATEWAY_TOKEN",
		exampleValue: "your_gateway_token_here",
		actualValue: gatewayToken,
	});

	lines.push({
		comment: formatComment("Port the OpenClaw gateway listens on", "OpenClaw Core", true, false),
		key: "OPENCLAW_GATEWAY_PORT",
		exampleValue: "18789",
		actualValue: "18789",
	});

	lines.push({
		comment: formatComment(
			"Port for the OpenClaw ACP bridge (WebSocket)",
			"OpenClaw Core",
			false,
			false,
		),
		key: "OPENCLAW_BRIDGE_PORT",
		exampleValue: "18790",
		actualValue: "18790",
	});

	lines.push({
		comment: formatComment(
			"Gateway network bind mode (lan for Docker networking, loopback for local-only)",
			"OpenClaw Core",
			false,
			false,
		),
		key: "OPENCLAW_GATEWAY_BIND",
		exampleValue: "lan",
		actualValue: "lan",
	});

	lines.push({
		comment: formatComment(
			"Host path to OpenClaw configuration directory",
			"OpenClaw Core",
			true,
			false,
		),
		key: "OPENCLAW_CONFIG_DIR",
		exampleValue: "./openclaw/config",
		actualValue: "./openclaw/config",
	});

	lines.push({
		comment: formatComment(
			"Host path to OpenClaw workspace directory",
			"OpenClaw Core",
			true,
			false,
		),
		key: "OPENCLAW_WORKSPACE_DIR",
		exampleValue: "./openclaw/workspace",
		actualValue: "./openclaw/workspace",
	});

	lines.push({
		comment: formatComment(
			"OpenClaw Docker image override (default uses ghcr.io/openclaw/openclaw)",
			"OpenClaw Core",
			false,
			false,
		),
		key: "OPENCLAW_IMAGE",
		exampleValue: "",
		actualValue: "",
	});

	if (options.domain) {
		lines.push({
			comment: formatComment("Primary domain for service routing", "OpenClaw Core", false, false),
			key: "OPENCLAW_DOMAIN",
			exampleValue: "example.com",
			actualValue: options.domain,
		});
	}

	// ── AI Provider API Keys ─────────────────────────────────────────────────

	if (resolved.aiProviders && resolved.aiProviders.length > 0) {
		lines.push({
			comment:
				"\n# ═══════════════════════════════════════════════════════════════════════════════\n# AI Provider API Keys\n# ═══════════════════════════════════════════════════════════════════════════════",
			key: "",
			exampleValue: "",
			actualValue: "",
		});

		for (const provider of resolved.aiProviders) {
			if (provider === "ollama" || provider === "lmstudio" || provider === "vllm") continue;

			const envKey = `${provider.toUpperCase()}_API_KEY`;
			lines.push({
				comment: formatComment(`API Key for ${provider} AI models`, "OpenClaw Core", true, true),
				key: envKey,
				exampleValue: `your_${provider.toLowerCase()}_api_key_here`,
				actualValue: "",
			});
		}
	}

	// Claude web-provider session variables (optional)
	lines.push({
		comment:
			"\n# ═══════════════════════════════════════════════════════════════════════════════\n# Claude Web Provider (optional)\n# ═══════════════════════════════════════════════════════════════════════════════",
		key: "",
		exampleValue: "",
		actualValue: "",
	});

	lines.push({
		comment: formatComment(
			"Claude AI session key for web provider authentication",
			"OpenClaw Core",
			false,
			true,
		),
		key: "CLAUDE_AI_SESSION_KEY",
		exampleValue: "your_claude_ai_session_key_here",
		actualValue: "",
	});

	lines.push({
		comment: formatComment(
			"Claude web session key for web provider authentication",
			"OpenClaw Core",
			false,
			true,
		),
		key: "CLAUDE_WEB_SESSION_KEY",
		exampleValue: "your_claude_web_session_key_here",
		actualValue: "",
	});

	lines.push({
		comment: formatComment(
			"Claude web cookie for web provider authentication",
			"OpenClaw Core",
			false,
			true,
		),
		key: "CLAUDE_WEB_COOKIE",
		exampleValue: "your_claude_web_cookie_here",
		actualValue: "",
	});

	// ── Per-Service Database Passwords ──────────────────────────────────────

	const dbReqs = getDbRequirements(resolved);

	if (dbReqs.length > 0) {
		lines.push({
			comment:
				"\n# ═══════════════════════════════════════════════════════════════════════════════\n# Per-Service Database Passwords\n# Each service gets its own PostgreSQL database and credentials\n# ═══════════════════════════════════════════════════════════════════════════════",
			key: "",
			exampleValue: "",
			actualValue: "",
		});

		for (const req of dbReqs) {
			const secretValue = options.generateSecrets ? randomBytes(24).toString("hex") : "";

			lines.push({
				comment: formatComment(
					`PostgreSQL password for ${req.serviceName} (database: ${req.dbName}, user: ${req.dbUser})`,
					req.serviceName,
					true,
					true,
				),
				key: req.passwordEnvVar,
				exampleValue: `your_${req.passwordEnvVar.toLowerCase()}_here`,
				actualValue: secretValue,
			});
		}
	}

	// ── Service-Specific Variables ───────────────────────────────────────────

	const dbPasswordKeys = dbReqs.map((r) => r.passwordEnvVar);
	const aiProviderKeys = (resolved.aiProviders || []).map((p) => `${p.toUpperCase()}_API_KEY`);
	const seenKeys = new Set<string>([
		"OPENCLAW_VERSION",
		"OPENCLAW_GATEWAY_TOKEN",
		"OPENCLAW_GATEWAY_PORT",
		"OPENCLAW_BRIDGE_PORT",
		"OPENCLAW_GATEWAY_BIND",
		"OPENCLAW_CONFIG_DIR",
		"OPENCLAW_WORKSPACE_DIR",
		"OPENCLAW_IMAGE",
		"OPENCLAW_DOMAIN",
		"CLAUDE_AI_SESSION_KEY",
		"CLAUDE_WEB_SESSION_KEY",
		"CLAUDE_WEB_COOKIE",
		...dbPasswordKeys,
		...aiProviderKeys,
	]);

	for (const { definition } of resolved.services) {
		const allEnvVars = [...definition.environment, ...definition.openclawEnvVars];

		if (allEnvVars.length === 0) continue;

		// Section separator for this service
		lines.push({
			comment: `\n# ═══════════════════════════════════════════════════════════════════════════════\n# ${definition.icon} ${definition.name}\n# ═══════════════════════════════════════════════════════════════════════════════`,
			key: "",
			exampleValue: "",
			actualValue: "",
		});

		const isNative = options.nativeServiceIds?.has(definition.id);

		for (const envVar of allEnvVars) {
			if (seenKeys.has(envVar.key)) continue;
			seenKeys.add(envVar.key);

			const secretValue = options.generateSecrets ? randomBytes(24).toString("hex") : "";

			// For native services, host-like vars must point to host so gateway (in Docker) can reach them
			const isHostVar = envVar.key.endsWith("_HOST");
			const hostValue = isNative && isHostVar ? "host.docker.internal" : null;

			const exampleValue = hostValue
				? hostValue
				: envVar.secret
					? `your_${envVar.key.toLowerCase()}_here`
					: envVar.defaultValue;

			let actualValue: string;
			if (hostValue) {
				actualValue = hostValue;
			} else if (envVar.secret) {
				actualValue = envVar.defaultValue.startsWith("${") ? envVar.defaultValue : secretValue;
			} else {
				actualValue = envVar.defaultValue;
			}

			lines.push({
				comment: formatComment(envVar.description, definition.name, envVar.required, envVar.secret),
				key: envVar.key,
				exampleValue,
				actualValue,
			});
		}
	}

	// ── Build output strings ────────────────────────────────────────────────

	const header = [
		"# ═══════════════════════════════════════════════════════════════════════════════",
		"# OpenClaw Environment Configuration",
		`# Generated at ${new Date().toISOString()}`,
		"# ═══════════════════════════════════════════════════════════════════════════════",
		"",
	].join("\n");

	let envExample = header;
	let env = header;

	for (const line of lines) {
		if (line.key === "") {
			// Section comment
			envExample += `${line.comment}\n`;
			env += `${line.comment}\n`;
		} else {
			envExample += `${line.comment}\n${line.key}=${line.exampleValue}\n\n`;
			env += `${line.comment}\n${line.key}=${line.actualValue}\n\n`;
		}
	}

	return { envExample, env };
}

/**
 * Format a descriptive comment block for an environment variable.
 */
function formatComment(
	description: string,
	serviceName: string,
	required: boolean,
	secret: boolean,
): string {
	return [
		`# ${description}`,
		`# Service: ${serviceName} | Required: ${required ? "Yes" : "No"} | Secret: ${secret ? "Yes" : "No"}`,
	].join("\n");
}

// ── Structured Env Vars ─────────────────────────────────────────────────────

export interface EnvVarGroup {
	serviceName: string;
	serviceIcon: string;
	serviceId: string;
	vars: {
		key: string;
		description: string;
		secret: boolean;
		required: boolean;
		defaultValue: string;
	}[];
}

/**
 * Returns environment variables grouped by service, suitable for UI rendering.
 *
 * - First group is always "OpenClaw Core" with base variables.
 * - Subsequent groups correspond to each resolved service.
 * - Variables are deduplicated across groups (first occurrence wins).
 */
export function getStructuredEnvVars(resolved: ResolverOutput): EnvVarGroup[] {
	const groups: EnvVarGroup[] = [];
	const seenKeys = new Set<string>();

	// ── OpenClaw Core group ──────────────────────────────────────────────────
	const coreVars: EnvVarGroup["vars"] = [
		{
			key: "OPENCLAW_VERSION",
			description: "OpenClaw version to deploy",
			secret: false,
			required: true,
			defaultValue: "latest",
		},
		{
			key: "OPENCLAW_GATEWAY_TOKEN",
			description: "Authentication token for the OpenClaw gateway API",
			secret: true,
			required: true,
			defaultValue: "",
		},
		{
			key: "OPENCLAW_GATEWAY_PORT",
			description: "Port the OpenClaw gateway listens on",
			secret: false,
			required: true,
			defaultValue: "18789",
		},
	];

	for (const v of coreVars) {
		seenKeys.add(v.key);
	}

	groups.push({
		serviceName: "OpenClaw Core",
		serviceIcon: "⚙️",
		serviceId: "openclaw-core",
		vars: coreVars,
	});

	// ── Per-service groups ───────────────────────────────────────────────────
	for (const { definition } of resolved.services) {
		const allEnvVars = [...definition.environment, ...definition.openclawEnvVars];

		const vars: EnvVarGroup["vars"] = [];

		for (const envVar of allEnvVars) {
			if (seenKeys.has(envVar.key)) continue;
			seenKeys.add(envVar.key);

			vars.push({
				key: envVar.key,
				description: envVar.description,
				secret: envVar.secret,
				required: envVar.required,
				defaultValue: envVar.defaultValue,
			});
		}

		if (vars.length === 0) continue;

		groups.push({
			serviceName: definition.name,
			serviceIcon: definition.icon,
			serviceId: definition.id,
			vars,
		});
	}

	return groups;
}
