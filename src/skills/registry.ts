import type { SkillPack } from "../types.js";

const skillPacks: SkillPack[] = [
	{
		id: "video-creator",
		name: "Video Creator",
		description:
			"Create and process videos programmatically with FFmpeg, Remotion, and MinIO storage",
		requiredServices: ["ffmpeg", "remotion", "minio"],
		skills: ["ffmpeg-process", "remotion-render", "minio-storage"],
		icon: "🎬",
		tags: ["video", "media", "rendering"],
	},
	{
		id: "research-agent",
		name: "Research Agent",
		description: "Research the web, store findings in vector memory, and scrape full pages",
		requiredServices: ["qdrant", "searxng", "browserless"],
		skills: ["qdrant-memory", "searxng-search", "browserless-browse"],
		icon: "🔬",
		tags: ["research", "rag", "web-scraping"],
	},
	{
		id: "social-media",
		name: "Social Media",
		description:
			"Process and manage social media content with video tools, caching, and asset storage",
		requiredServices: ["ffmpeg", "redis", "minio"],
		skills: ["ffmpeg-process", "redis-cache", "minio-storage"],
		icon: "📱",
		tags: ["social", "content", "scheduling"],
	},
	{
		id: "dev-ops",
		name: "DevOps",
		description: "Monitor services, automate workflows, and manage infrastructure alerts",
		requiredServices: ["n8n", "redis", "uptime-kuma", "grafana", "prometheus"],
		skills: ["n8n-trigger", "redis-cache"],
		icon: "⚙️",
		tags: ["devops", "monitoring", "automation"],
	},
	{
		id: "knowledge-base",
		name: "Knowledge Base",
		description:
			"Index documents with vector search and full-text search for comprehensive retrieval",
		requiredServices: ["qdrant", "postgresql", "meilisearch"],
		skills: ["qdrant-memory"],
		icon: "📚",
		tags: ["knowledge", "search", "indexing"],
	},
	{
		id: "local-ai",
		name: "Local AI",
		description: "Run local LLM inference and speech-to-text transcription without external APIs",
		requiredServices: ["ollama", "whisper"],
		skills: ["ollama-local-llm", "whisper-transcribe"],
		icon: "🤖",
		tags: ["local-llm", "transcription", "offline"],
	},
	{
		id: "content-creator",
		name: "Content Creator",
		description:
			"Full social media content pipeline with scheduling, media processing, analytics, and storage",
		requiredServices: ["postiz", "ffmpeg", "minio", "redis", "postgresql"],
		skills: ["ffmpeg-process", "minio-storage", "redis-cache"],
		icon: "📱",
		tags: ["social-media", "content", "scheduling", "analytics"],
	},
	{
		id: "ai-playground",
		name: "AI Playground",
		description:
			"Full AI experimentation stack with chat UIs, LLM gateway, local models, and document chat",
		requiredServices: ["ollama", "open-webui", "litellm"],
		skills: ["ollama-local-llm"],
		icon: "🧪",
		tags: ["ai", "llm", "playground", "experimentation"],
	},
	{
		id: "coding-team",
		name: "Coding Team",
		description:
			"AI-powered development environment with coding agents, Git hosting, and browser IDE",
		requiredServices: ["claude-code", "gitea", "code-server"],
		skills: [],
		icon: "💻",
		tags: ["coding", "development", "ide", "git"],
	},
	{
		id: "knowledge-hub",
		name: "Knowledge Hub",
		description:
			"Enterprise knowledge management with wiki, document processing, analytics, and vector search",
		requiredServices: ["outline", "paperless-ngx", "qdrant", "postgresql", "redis"],
		skills: ["qdrant-memory"],
		icon: "📚",
		tags: ["knowledge", "wiki", "documents", "search"],
	},
];

const packMap = new Map<string, SkillPack>();
for (const pack of skillPacks) {
	if (packMap.has(pack.id)) {
		throw new Error(`Duplicate skill pack ID: "${pack.id}"`);
	}
	packMap.set(pack.id, pack);
}

export const skillPackRegistry: ReadonlyMap<string, SkillPack> = packMap;

export function getSkillPackById(id: string): SkillPack | undefined {
	return packMap.get(id);
}

export function getAllSkillPacks(): SkillPack[] {
	return [...skillPacks];
}

/** Get skill packs whose required services are all present in the given service list */
export function getCompatibleSkillPacks(availableServiceIds: string[]): SkillPack[] {
	return skillPacks.filter((pack) =>
		pack.requiredServices.every((req) => availableServiceIds.includes(req)),
	);
}
