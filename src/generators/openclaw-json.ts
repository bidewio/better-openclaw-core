import type { AiProvider, ResolverOutput } from "../types.js";

const PROVIDER_CONFIGS: Record<AiProvider, any> = {
	openai: {
		baseUrl: "https://api.openai.com/v1",
		api: "openai-completions",
		auth: "api-key",
		apiKey: "${OPENAI_API_KEY}",
		models: [
			{
				id: "gpt-4o",
				name: "GPT-4o",
				api: "openai-completions",
				reasoning: false,
				input: ["text", "image"],
				cost: { input: 2.5, output: 10, cacheRead: 1.25, cacheWrite: 2.5 },
				contextWindow: 128000,
				maxTokens: 16384,
			},
			{
				id: "gpt-4o-mini",
				name: "GPT-4o Mini",
				api: "openai-completions",
				reasoning: false,
				input: ["text", "image"],
				cost: { input: 0.15, output: 0.6, cacheRead: 0.075, cacheWrite: 0.15 },
				contextWindow: 128000,
				maxTokens: 16384,
			},
		],
	},
	anthropic: {
		baseUrl: "https://api.anthropic.com/v1/messages",
		api: "anthropic-messages",
		auth: "api-key",
		apiKey: "${ANTHROPIC_API_KEY}",
		models: [
			{
				id: "claude-3-5-sonnet-latest",
				name: "Claude 3.5 Sonnet",
				api: "anthropic-messages",
				reasoning: false,
				input: ["text", "image"],
				cost: { input: 3.0, output: 15.0, cacheRead: 0.3, cacheWrite: 3.75 },
				contextWindow: 200000,
				maxTokens: 8192,
			},
			{
				id: "claude-3-5-haiku-latest",
				name: "Claude 3.5 Haiku",
				api: "anthropic-messages",
				reasoning: false,
				input: ["text", "image"],
				cost: { input: 0.8, output: 4.0, cacheRead: 0.08, cacheWrite: 1.0 },
				contextWindow: 200000,
				maxTokens: 8192,
			},
		],
	},
	google: {
		baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
		api: "openai-completions",
		auth: "api-key",
		apiKey: "${GOOGLE_API_KEY}",
		models: [
			{
				id: "gemini-2.5-pro",
				name: "Gemini 2.5 Pro",
				api: "openai-completions",
				reasoning: false,
				input: ["text", "image"],
				cost: { input: 2.0, output: 8.0, cacheRead: 0.5, cacheWrite: 2.0 },
				contextWindow: 2000000,
				maxTokens: 8192,
			},
			{
				id: "gemini-2.5-flash",
				name: "Gemini 2.5 Flash",
				api: "openai-completions",
				reasoning: false,
				input: ["text", "image"],
				cost: { input: 0.15, output: 0.6, cacheRead: 0.0375, cacheWrite: 0.15 },
				contextWindow: 1000000,
				maxTokens: 8192,
			},
		],
	},
	xai: {
		baseUrl: "https://api.x.ai/v1",
		api: "openai-completions",
		auth: "api-key",
		apiKey: "${XAI_API_KEY}",
		models: [
			{
				id: "grok-2-latest",
				name: "Grok 2",
				api: "openai-completions",
				reasoning: false,
				input: ["text", "image"],
				cost: { input: 2.0, output: 10.0, cacheRead: 1.0, cacheWrite: 2.0 },
				contextWindow: 131072,
				maxTokens: 32768,
			},
		],
	},
	deepseek: {
		baseUrl: "https://api.deepseek.com/v1",
		api: "openai-completions",
		auth: "api-key",
		apiKey: "${DEEPSEEK_API_KEY}",
		models: [
			{
				id: "deepseek-chat",
				name: "DeepSeek V3",
				api: "openai-completions",
				reasoning: false,
				input: ["text"],
				cost: { input: 0.14, output: 0.28, cacheRead: 0.014, cacheWrite: 0.14 },
				contextWindow: 65536,
				maxTokens: 8192,
			},
			{
				id: "deepseek-reasoner",
				name: "DeepSeek R1",
				api: "openai-completions",
				reasoning: true,
				input: ["text"],
				cost: { input: 0.55, output: 2.19, cacheRead: 0.14, cacheWrite: 0.55 },
				contextWindow: 65536,
				maxTokens: 8192,
			},
		],
	},
	groq: {
		baseUrl: "https://api.groq.com/openai/v1",
		api: "openai-completions",
		auth: "api-key",
		apiKey: "${GROQ_API_KEY}",
		models: [
			{
				id: "llama3-70b-8192",
				name: "LLaMA3 70B (Groq)",
				api: "openai-completions",
				reasoning: false,
				input: ["text"],
				cost: { input: 0.59, output: 0.79 },
				contextWindow: 8192,
				maxTokens: 8192,
			},
		],
	},
	openrouter: {
		baseUrl: "https://openrouter.ai/api/v1",
		api: "openai-completions",
		auth: "api-key",
		apiKey: "${OPENROUTER_API_KEY}",
		models: [
			{
				id: "anthropic/claude-3.5-sonnet",
				name: "Claude 3.5 Sonnet (OpenRouter)",
				api: "openai-completions",
				reasoning: false,
				input: ["text", "image"],
				cost: { input: 3.0, output: 15.0 },
				contextWindow: 200000,
				maxTokens: 8192,
			},
		],
	},
	mistral: {
		baseUrl: "https://api.mistral.ai/v1",
		api: "openai-completions",
		auth: "api-key",
		apiKey: "${MISTRAL_API_KEY}",
		models: [
			{
				id: "mistral-large-latest",
				name: "Mistral Large",
				api: "openai-completions",
				reasoning: false,
				input: ["text"],
				cost: { input: 2.0, output: 6.0 },
				contextWindow: 131000,
				maxTokens: 8192,
			},
		],
	},
	together: {
		baseUrl: "https://api.together.xyz/v1",
		api: "openai-completions",
		auth: "api-key",
		apiKey: "${TOGETHER_API_KEY}",
		models: [
			{
				id: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
				name: "LLaMA 3.3 70B (Together)",
				api: "openai-completions",
				reasoning: false,
				input: ["text"],
				cost: { input: 0.88, output: 0.88 },
				contextWindow: 131072,
				maxTokens: 4096,
			},
		],
	},
	ollama: {
		baseUrl: "http://host.docker.internal:11434/v1",
		api: "openai-completions",
		auth: "none",
		models: [
			{
				id: "llama3:latest",
				name: "LLaMA 3 (Local)",
				api: "openai-completions",
				reasoning: false,
				input: ["text"],
				cost: { input: 0, output: 0 },
				contextWindow: 8192,
				maxTokens: 4096,
			},
			{
				id: "deepseek-r1:latest",
				name: "DeepSeek R1 (Local)",
				api: "openai-completions",
				reasoning: true,
				input: ["text"],
				cost: { input: 0, output: 0 },
				contextWindow: 8192,
				maxTokens: 4096,
			},
		],
	},
	lmstudio: {
		baseUrl: "http://host.docker.internal:1234/v1",
		api: "openai-completions",
		auth: "none",
		models: [
			{
				id: "local-model",
				name: "LM Studio Model",
				api: "openai-completions",
				reasoning: false,
				input: ["text"],
				cost: { input: 0, output: 0 },
				contextWindow: 8192,
				maxTokens: 4096,
			},
		],
	},
	vllm: {
		baseUrl: "http://host.docker.internal:8000/v1",
		api: "openai-completions",
		auth: "none",
		models: [
			{
				id: "local-model",
				name: "vLLM Model",
				api: "openai-completions",
				reasoning: false,
				input: ["text"],
				cost: { input: 0, output: 0 },
				contextWindow: 8192,
				maxTokens: 4096,
			},
		],
	},
};

/**
 * Generates a default `openclaw/config/openclaw.json` tailored
 * to the services installed in the stack.
 */
export function generateOpenClawConfig(resolved: ResolverOutput): string {
	const defaultSkills: Record<string, { enabled: boolean }> = {};

	// Auto-enable any OpenClaw skills attached to installed companion services
	for (const { definition } of resolved.services) {
		for (const skill of definition.skills) {
			if (skill.autoInstall) {
				defaultSkills[skill.skillId] = { enabled: true };
			}
		}
	}

	const providers: Record<string, any> = {};
	const agentsModels: Record<string, { alias: string }> = {};
	let primaryModel = "";

	// Always default to empty or the first choice, fallback to openai if nothing was passed
	const selectedProviders =
		resolved.aiProviders && resolved.aiProviders.length > 0
			? resolved.aiProviders
			: (["openai"] as AiProvider[]);

	for (const provider of selectedProviders) {
		const meta = PROVIDER_CONFIGS[provider];
		if (!meta) continue;

		providers[provider] = {
			baseUrl: meta.baseUrl,
			api: meta.api,
			auth: meta.auth,
			...(meta.apiKey ? { apiKey: meta.apiKey } : {}),
			models: meta.models,
		};

		for (const m of meta.models) {
			const fullId = `${provider}/${m.id}`;
			agentsModels[fullId] = { alias: m.name };
			if (!primaryModel) primaryModel = fullId; // Use the very first model mapped as the global system default
		}
	}

	const authProfiles: Record<string, any> = {
		"local:default": {
			provider: "local",
			mode: "token",
		},
	};

	// Add provider auth profiles too
	for (const provider of Object.keys(providers)) {
		authProfiles[`${provider}:default`] = {
			provider: provider,
			mode: "api_key",
		};
	}

	const config = {
		wizard: {
			lastRunAt: new Date().toISOString(),
			lastRunVersion: "2026.2.23",
			lastRunCommand: "auto-generated-by-better-openclaw",
			lastRunMode: "local",
		},
		auth: {
			profiles: authProfiles,
		},
		models: {
			mode: "merge",
			providers,
		},
		agents: {
			defaults: {
				model: {
					primary: primaryModel,
				},
				models: agentsModels,
				workspace: "/home/node/.openclaw/workspace",
				compaction: { mode: "safeguard" },
				maxConcurrent: 4,
				subagents: { maxConcurrent: 8 },
			},
		},
		messages: {
			ackReactionScope: "group-mentions",
		},
		commands: {
			native: "auto",
			nativeSkills: "auto",
		},
		hooks: {
			internal: {
				enabled: true,
				entries: {
					"boot-md": { enabled: true },
					"bootstrap-extra-files": { enabled: true },
					"command-logger": { enabled: true },
					"session-memory": { enabled: true },
				},
			},
		},
		channels: {},
		gateway: {
			port: 18791,
			mode: "local",
			bind: "loopback",
			auth: {
				mode: "token",
				token: "${OPENCLAW_GATEWAY_TOKEN}",
			},
			tailscale: {
				mode: "serve",
				resetOnExit: true,
			},
			nodes: {
				denyCommands: ["camera.snap", "camera.clip", "screen.record"],
			},
		},
		skills: {
			install: { nodeManager: "pnpm" },
			...(Object.keys(defaultSkills).length > 0 ? { entries: defaultSkills } : {}),
		},
		plugins: {
			entries: {
				"memory-core": { enabled: true },
			},
		},
		meta: {
			lastTouchedVersion: "2026.2.23",
			lastTouchedAt: new Date().toISOString(),
		},
	};

	return JSON.stringify(config, null, 2);
}
