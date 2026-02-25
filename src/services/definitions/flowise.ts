import type { ServiceDefinition } from "../../types.js";

export const flowiseDefinition: ServiceDefinition = {
	id: "flowise",
	name: "Flowise",
	description: "Drag & drop UI to build customized LLM flows, chatbots, and AI agents.",
	category: "ai-platform",
	icon: "🌊",

	image: "flowiseai/flowise",
	imageTag: "1.8.2",
	ports: [
		{
			host: 3120,
			container: 3000,
			description: "Flowise Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "flowise-data",
			containerPath: "/root/.flowise",
			description: "Flowise data",
		},
	],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.flowiseai.com/",
	tags: ["flow-builder", "chatbot", "llm", "visual", "drag-drop"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
