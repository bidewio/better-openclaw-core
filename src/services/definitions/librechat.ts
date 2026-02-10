import type { ServiceDefinition } from "../../types.js";

export const librechatDefinition: ServiceDefinition = {
	id: "librechat",
	name: "LibreChat",
	description:
		"Enhanced ChatGPT clone supporting multiple AI providers (Claude, GPT, Gemini, local models) with agents, code interpreter, and more.",
	category: "ai-platform",
	icon: "🗨️",

	image: "ghcr.io/danny-avila/librechat",
	imageTag: "latest",
	ports: [
		{
			host: 3090,
			container: 3080,
			description: "LibreChat interface",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "librechat-data",
			containerPath: "/app/data",
			description: "LibreChat data",
		},
	],
	environment: [
		{
			key: "MONGO_URI",
			defaultValue: "mongodb://mongodb:27017/LibreChat",
			secret: false,
			description: "MongoDB connection",
			required: true,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://www.librechat.ai/docs",
	tags: ["chat-ui", "multi-model", "agents", "plugins"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
