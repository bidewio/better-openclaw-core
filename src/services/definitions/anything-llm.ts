import type { ServiceDefinition } from "../../types.js";

export const anythingLlmDefinition: ServiceDefinition = {
	id: "anything-llm",
	name: "AnythingLLM",
	description:
		"All-in-one Desktop & Docker AI application with built-in RAG, AI agents, document chat, and multi-user support.",
	category: "ai-platform",
	icon: "📖",

	image: "mintplexlabs/anythingllm",
	imageTag: "latest",
	ports: [
		{
			host: 3100,
			container: 3001,
			description: "AnythingLLM interface",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "anythingllm-data",
			containerPath: "/app/server/storage",
			description: "AnythingLLM storage",
		},
	],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.anythingllm.com/",
	tags: ["rag", "documents", "chat", "knowledge-base"],
	maturity: "stable",

	requires: [],
	recommends: ["ollama"],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
