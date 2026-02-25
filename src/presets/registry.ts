import type { Preset } from "../types.js";

const presets: Preset[] = [
	{
		id: "minimal",
		name: "Minimal",
		description: "OpenClaw + Redis for caching and session management",
		services: ["redis", "caddy"],
		skillPacks: [],
		estimatedMemoryMB: 1024,
	},
	{
		id: "creator",
		name: "Creator",
		description: "Full media creation stack with FFmpeg, Remotion, and MinIO storage",
		services: ["ffmpeg", "remotion", "minio", "redis", "caddy"],
		skillPacks: ["video-creator"],
		estimatedMemoryMB: 2048,
	},
	{
		id: "researcher",
		name: "Researcher",
		description: "Research agent with vector search, web scraping, and meta search",
		services: [
			"qdrant",
			"searxng",
			"browserless",
			"redis",
			"caddy",
			"postgresql",
		],
		skillPacks: ["research-agent"],
		estimatedMemoryMB: 2560,
	},
	{
		id: "devops",
		name: "DevOps",
		description: "Full monitoring and automation stack with n8n, Grafana, and Uptime Kuma",
		services: ["n8n", "postgresql", "redis", "uptime-kuma", "grafana", "prometheus", "caddy"],
		skillPacks: ["dev-ops"],
		estimatedMemoryMB: 3072,
	},
	{
		id: "full",
		name: "Full Stack",
		description: "Everything enabled — all services and skill packs",
		services: [
			"redis",
			"postgresql",
			"qdrant",
			"n8n",
			"ffmpeg",
			"remotion",
			"minio",
			"caddy",
			"browserless",
			"searxng",
			"meilisearch",
			"uptime-kuma",
			"grafana",
			"prometheus",
			"ollama",
			"whisper",
			"gotify",
		],
		skillPacks: [
			"video-creator",
			"research-agent",
			"social-media",
			"dev-ops",
			"knowledge-base",
			"local-ai",
		],
		estimatedMemoryMB: 8192,
	},
	{
		id: "content-creator",
		name: "Content Creator",
		description: "Social media scheduling with Postiz, media processing, and analytics",
		services: ["postiz", "ffmpeg", "minio", "redis", "postgresql", "umami", "caddy"],
		skillPacks: ["content-creator"],
		estimatedMemoryMB: 2048,
	},
	{
		id: "ai-playground",
		name: "AI Playground",
		description: "Local AI stack with Ollama, Open WebUI, LiteLLM gateway, and document chat",
		services: ["ollama", "open-webui", "litellm", "anything-llm", "redis", "caddy"],
		skillPacks: ["ai-playground"],
		estimatedMemoryMB: 4096,
	},
	{
		id: "ai-powerhouse",
		name: "AI Powerhouse",
		description: "Local AI stack with Ollama, Open WebUI, LiteLLM gateway, and document chat",
		services: [
			"ollama",
			"redis",
			"qdrant",
			"minio",
			"litellm",
			"anything-llm",
			"n8n",
			"postgresql",
			"caddy",
			"open-webui",
			"searxng",
		],
		skillPacks: ["ai-playground"],
		estimatedMemoryMB: 4096,
	},
	{
		id: "coding-team",
		name: "Coding Team",
		description: "AI development environment with coding agents, Git, and browser IDE",
		services: ["claude-code", "opencode", "gitea", "code-server", "redis", "caddy"],
		skillPacks: ["coding-team"],
		estimatedMemoryMB: 2560,
	},
	{
		id: "lasuite-meet",
		name: "La Suite Meet",
		description: "Open-source video conferencing from La Suite numérique (Django + LiveKit)",
		services: [
			"postgresql",
			"redis",
			"livekit",
			"lasuite-meet-backend",
			"lasuite-meet-frontend",
			"lasuite-meet-agents",
			"whisper",
			"ollama",
			"caddy",
		],
		skillPacks: [],
		estimatedMemoryMB: 2048,
	},
];

const presetMap = new Map<string, Preset>();
for (const preset of presets) {
	if (presetMap.has(preset.id)) {
		throw new Error(`Duplicate preset ID: "${preset.id}"`);
	}
	presetMap.set(preset.id, preset);
}

export const presetRegistry: ReadonlyMap<string, Preset> = presetMap;

export function getPresetById(id: string): Preset | undefined {
	return presetMap.get(id);
}

export function getAllPresets(): Preset[] {
	return [...presets];
}
