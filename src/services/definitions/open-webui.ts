import type { ServiceDefinition } from "../../types.js";

export const openWebuiDefinition: ServiceDefinition = {
	id: "open-webui",
	name: "Open WebUI",
	description:
		"Beautiful ChatGPT-like web interface for Ollama and other LLM providers. Features RAG, web search, and multi-user support.",
	category: "ai-platform",
	icon: "💬",

	image: "ghcr.io/open-webui/open-webui",
	imageTag: "v0.8.5",
	ports: [
		{
			host: 3080,
			container: 8080,
			description: "Open WebUI interface",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "open-webui-data",
			containerPath: "/app/backend/data",
			description: "Open WebUI data",
		},
	],
	environment: [
		{
			key: "OLLAMA_BASE_URL",
			defaultValue: "http://ollama:11434",
			secret: false,
			description: "Ollama API URL",
			required: false,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.openwebui.com/",
	tags: ["chat-ui", "ollama", "multi-model", "rag"],
	maturity: "stable",

	requires: [],
	recommends: ["ollama"],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
