import { stringify } from "yaml";
import type { ComposeOptions, ResolverOutput, ServiceCategory } from "./types.js";

// ── Public Types ────────────────────────────────────────────────────────────

export interface ComposeResult {
	files: Record<string, string>; // filename -> YAML content
	mainFile: string; // "docker-compose.yml"
	profiles: string[]; // list of profiles used
}

// ── Category → Profile Mapping ──────────────────────────────────────────────

const CATEGORY_PROFILE_MAP: Partial<Record<ServiceCategory, { file: string; profile: string }>> = {
	ai: { file: "docker-compose.ai.yml", profile: "ai" },
	"ai-platform": { file: "docker-compose.ai.yml", profile: "ai" },
	media: { file: "docker-compose.media.yml", profile: "media" },
	monitoring: { file: "docker-compose.monitoring.yml", profile: "monitoring" },
	analytics: { file: "docker-compose.monitoring.yml", profile: "monitoring" },
	"dev-tools": { file: "docker-compose.tools.yml", profile: "tools" },
	"coding-agent": { file: "docker-compose.tools.yml", profile: "tools" },
	"social-media": { file: "docker-compose.social.yml", profile: "social" },
	knowledge: { file: "docker-compose.knowledge.yml", profile: "knowledge" },
	communication: { file: "docker-compose.communication.yml", profile: "communication" },
};

const YAML_OPTIONS = { lineWidth: 120, nullStr: "" };

// ── Shared Gateway Builder ──────────────────────────────────────────────────

interface GatewayBuildResult {
	gatewayService: Record<string, unknown>;
	cliService: Record<string, unknown>;
	allVolumes: Set<string>;
}

/**
 * Builds the OpenClaw gateway and CLI service entries.
 * Matches the real OpenClaw docker-compose.yml structure:
 * - Bridge port 18790 for ACP/WebSocket
 * - Bind-mount volumes (not named volumes)
 * - Claude web-provider session env vars
 * - Gateway bind mode (--bind lan)
 * - CLI companion service with stdin/tty
 */
function buildGatewayServices(
	resolved: ResolverOutput,
	options: ComposeOptions,
	dependsOn?: Record<string, { condition: string }>,
): GatewayBuildResult {
	const allVolumes = new Set<string>();

	// Gateway environment
	const gatewayEnv: Record<string, string> = {
		HOME: "/home/node",
		TERM: "xterm-256color",
		OPENCLAW_GATEWAY_TOKEN: "${OPENCLAW_GATEWAY_TOKEN}",
		// Claude web-provider session vars (optional, user fills in .env)
		CLAUDE_AI_SESSION_KEY: "${CLAUDE_AI_SESSION_KEY}",
		CLAUDE_WEB_SESSION_KEY: "${CLAUDE_WEB_SESSION_KEY}",
		CLAUDE_WEB_COOKIE: "${CLAUDE_WEB_COOKIE}",
	};

	// Gateway volumes (bind-mount style matching real docker-setup.sh)
	const gatewayVolumes: string[] = [
		"${OPENCLAW_CONFIG_DIR:-./openclaw/config}:/home/node/.openclaw",
		"${OPENCLAW_WORKSPACE_DIR:-./openclaw/workspace}:/home/node/.openclaw/workspace",
	];

	// Collect env vars and volume mounts from companion services
	for (const { definition: def } of resolved.services) {
		for (const env of def.openclawEnvVars) {
			gatewayEnv[env.key] = env.secret ? `\${${env.key}}` : env.defaultValue;
		}
		if (def.openclawVolumeMounts) {
			for (const vol of def.openclawVolumeMounts) {
				allVolumes.add(vol.name);
				gatewayVolumes.push(`${vol.name}:${vol.containerPath}`);
			}
		}
	}

	// Gateway service
	const gateway: Record<string, unknown> = {
		image: `\${OPENCLAW_IMAGE:-ghcr.io/openclaw/openclaw:${options.openclawVersion}}`,
		environment: gatewayEnv,
		volumes: gatewayVolumes,
		ports: ["${OPENCLAW_GATEWAY_PORT:-18789}:18789", "${OPENCLAW_BRIDGE_PORT:-18790}:18790"],
		networks: ["openclaw-network"],
		init: true,
		restart: "unless-stopped",
		command: [
			"node",
			"dist/index.js",
			"gateway",
			"--bind",
			"${OPENCLAW_GATEWAY_BIND:-lan}",
			"--port",
			"18789",
		],
	};

	if (options.bareMetalNativeHost) {
		gateway.extra_hosts = ["host.docker.internal:host-gateway"];
	}

	if (dependsOn && Object.keys(dependsOn).length > 0) {
		gateway.depends_on = dependsOn;
	}

	// CLI companion service (matching real OpenClaw docker-compose.yml)
	const cliService: Record<string, unknown> = {
		image: `\${OPENCLAW_IMAGE:-ghcr.io/openclaw/openclaw:${options.openclawVersion}}`,
		environment: {
			HOME: "/home/node",
			TERM: "xterm-256color",
			OPENCLAW_GATEWAY_TOKEN: "${OPENCLAW_GATEWAY_TOKEN}",
			BROWSER: "echo",
			CLAUDE_AI_SESSION_KEY: "${CLAUDE_AI_SESSION_KEY}",
			CLAUDE_WEB_SESSION_KEY: "${CLAUDE_WEB_SESSION_KEY}",
			CLAUDE_WEB_COOKIE: "${CLAUDE_WEB_COOKIE}",
		},
		volumes: [
			"${OPENCLAW_CONFIG_DIR:-./openclaw/config}:/home/node/.openclaw",
			"${OPENCLAW_WORKSPACE_DIR:-./openclaw/workspace}:/home/node/.openclaw/workspace",
		],
		stdin_open: true,
		tty: true,
		init: true,
		networks: ["openclaw-network"],
		entrypoint: ["node", "dist/index.js"],
	};

	return { gatewayService: gateway, cliService: cliService, allVolumes };
}

// ── Shared Companion Service Builder ────────────────────────────────────────

function buildCompanionService(
	def: ResolverOutput["services"][number]["definition"],
	resolved: ResolverOutput,
	options: ComposeOptions,
	allVolumes: Set<string>,
): { entry: Record<string, unknown>; volumeNames: string[] } {
	const svc: Record<string, unknown> = {};
	const volumeNames: string[] = [];

	svc.image = `${def.image}:${def.imageTag}`;

	if (def.environment.length > 0) {
		const env: Record<string, string> = {};
		for (const e of def.environment) {
			env[e.key] = e.secret ? `\${${e.key}}` : e.defaultValue;
		}
		svc.environment = env;
	}

	const exposedPorts = def.ports.filter((p) => p.exposed);
	if (exposedPorts.length > 0) {
		const prefix = def.id.toUpperCase().replace(/-/g, "_");
		svc.ports = exposedPorts.map((p, i) => {
			const suffix = exposedPorts.length > 1 ? `_${i}` : "";
			return `\${${prefix}_PORT${suffix}:-${p.host}}:${p.container}`;
		});
	}

	if (def.volumes.length > 0) {
		svc.volumes = def.volumes.map((v) => {
			allVolumes.add(v.name);
			volumeNames.push(v.name);
			return `${v.name}:${v.containerPath}`;
		});
	}

	// PostgreSQL: mount the init script for creating per-service databases
	if (def.id === "postgresql") {
		if (!svc.volumes) svc.volumes = [];
		(svc.volumes as string[]).push(
			"./postgres/init-databases.sh:/docker-entrypoint-initdb.d/init-databases.sh:ro",
		);
	}

	if (def.healthcheck) {
		const hc: Record<string, unknown> = {
			test: ["CMD-SHELL", def.healthcheck.test],
			interval: def.healthcheck.interval,
			timeout: def.healthcheck.timeout,
			retries: def.healthcheck.retries,
		};
		if (def.healthcheck.startPeriod) {
			hc.start_period = def.healthcheck.startPeriod;
		}
		svc.healthcheck = hc;
	}

	svc.restart = def.restartPolicy;
	svc.networks = def.networks;

	if (def.command) svc.command = def.command;
	if (def.entrypoint) svc.entrypoint = def.entrypoint;
	if (def.labels && Object.keys(def.labels).length > 0) svc.labels = def.labels;

	let deploy: Record<string, unknown> | undefined;
	if (def.deploy) {
		deploy = JSON.parse(JSON.stringify(def.deploy)) as Record<string, unknown>;
	}
	if (options.gpu && def.gpuRequired) {
		const base = deploy ?? {};
		const resources = (base.resources ?? {}) as Record<string, unknown>;
		deploy = {
			...base,
			resources: {
				...resources,
				reservations: {
					...((resources.reservations as Record<string, unknown>) ?? {}),
					devices: [{ driver: "nvidia", count: "all", capabilities: ["gpu"] }],
				},
			},
		};
	}
	if (deploy) svc.deploy = deploy;

	// Merge both dependsOn and requires to ensure proper Docker startup ordering
	const depIds = [...new Set([...def.dependsOn, ...def.requires])].filter((id) =>
		resolved.services.some((s) => s.definition.id === id),
	);
	if (depIds.length > 0) {
		const dependsOn: Record<string, { condition: string }> = {};
		for (const depId of depIds) {
			const dep = resolved.services.find((s) => s.definition.id === depId);
			dependsOn[depId] = {
				condition: dep?.definition.healthcheck ? "service_healthy" : "service_started",
			};
		}
		svc.depends_on = dependsOn;
	}

	return { entry: svc, volumeNames };
}

// ── Single-File Compose ─────────────────────────────────────────────────────

/**
 * Generates a single Docker Compose YAML string with ALL services.
 * Backward-compatible signature.
 */
export function compose(resolved: ResolverOutput, options: ComposeOptions): string {
	// Build depends_on for ALL companion services
	const gatewayDependsOn: Record<string, { condition: string }> = {};
	for (const { definition: def } of resolved.services) {
		gatewayDependsOn[def.id] = {
			condition: def.healthcheck ? "service_healthy" : "service_started",
		};
	}

	const { gatewayService, cliService, allVolumes } = buildGatewayServices(
		resolved,
		options,
		gatewayDependsOn,
	);

	const services: Record<string, Record<string, unknown>> = {
		"openclaw-gateway": gatewayService,
	};

	for (const { definition: def } of resolved.services) {
		const { entry } = buildCompanionService(def, resolved, options, allVolumes);
		services[def.id] = entry;
	}

	// Add CLI service
	services["openclaw-cli"] = cliService;

	const volumes: Record<string, null> = {};
	for (const v of [...allVolumes].sort()) {
		volumes[v] = null;
	}

	const networks = { "openclaw-network": { driver: "bridge" } };

	return stringify({ services, volumes, networks }, YAML_OPTIONS);
}

// ── Multi-File Compose ──────────────────────────────────────────────────────

interface ServiceInfo {
	id: string;
	category: ServiceCategory;
	entry: Record<string, unknown>;
	volumeNames: string[];
}

/**
 * Generates multiple Docker Compose files, splitting services into profile-based
 * override files by category.
 */
export function composeMultiFile(resolved: ResolverOutput, options: ComposeOptions): ComposeResult {
	const allVolumes = new Set<string>();

	// Build all companion service entries & classify by category
	const serviceInfos: ServiceInfo[] = [];

	for (const { definition: def } of resolved.services) {
		const { entry, volumeNames } = buildCompanionService(def, resolved, options, allVolumes);
		serviceInfos.push({ id: def.id, category: def.category, entry, volumeNames });
	}

	// Partition services into base vs. profile files
	const baseServiceIds = new Set<string>();
	const profileFileMap: Record<string, { profile: string; services: ServiceInfo[] }> = {};

	for (const info of serviceInfos) {
		const mapping = CATEGORY_PROFILE_MAP[info.category];
		if (mapping) {
			if (!profileFileMap[mapping.file]) {
				profileFileMap[mapping.file] = { profile: mapping.profile, services: [] };
			}
			profileFileMap[mapping.file]!.services.push(info);
		} else {
			baseServiceIds.add(info.id);
		}
	}

	// Gateway depends_on (only base services)
	const gatewayDependsOn: Record<string, { condition: string }> = {};
	for (const { definition: def } of resolved.services) {
		if (baseServiceIds.has(def.id)) {
			gatewayDependsOn[def.id] = {
				condition: def.healthcheck ? "service_healthy" : "service_started",
			};
		}
	}

	const {
		gatewayService,
		cliService,
		allVolumes: gwVolumes,
	} = buildGatewayServices(resolved, options, gatewayDependsOn);

	// Merge gateway volumes into allVolumes
	for (const v of gwVolumes) allVolumes.add(v);

	// Base file: gateway + CLI + core services + ALL volumes + networks
	const baseServices: Record<string, Record<string, unknown>> = {
		"openclaw-gateway": gatewayService,
	};

	for (const info of serviceInfos) {
		if (baseServiceIds.has(info.id)) {
			baseServices[info.id] = info.entry;
		}
	}

	baseServices["openclaw-cli"] = cliService;

	const sortedAllVolumes: Record<string, null> = {};
	for (const v of [...allVolumes].sort()) {
		sortedAllVolumes[v] = null;
	}

	const networks = { "openclaw-network": { driver: "bridge" } };

	const files: Record<string, string> = {};
	files["docker-compose.yml"] = stringify(
		{ services: baseServices, volumes: sortedAllVolumes, networks },
		YAML_OPTIONS,
	);

	// Profile override files
	const usedProfiles = new Set<string>();

	for (const [fileName, { profile, services }] of Object.entries(profileFileMap)) {
		usedProfiles.add(profile);

		const profileServices: Record<string, Record<string, unknown>> = {};
		const profileVolumes = new Set<string>();

		for (const info of services) {
			profileServices[info.id] = { ...info.entry, profiles: [profile] };
			for (const vName of info.volumeNames) {
				profileVolumes.add(vName);
			}
		}

		const fileContent: Record<string, unknown> = { services: profileServices };

		if (profileVolumes.size > 0) {
			const sortedProfileVolumes: Record<string, null> = {};
			for (const v of [...profileVolumes].sort()) {
				sortedProfileVolumes[v] = null;
			}
			fileContent.volumes = sortedProfileVolumes;
		}

		files[fileName] = stringify(fileContent, YAML_OPTIONS);
	}

	return {
		files,
		mainFile: "docker-compose.yml",
		profiles: [...usedProfiles].sort(),
	};
}
