import type { ServiceDefinition } from "../../types.js";

export const kimiDefinition: ServiceDefinition = {
	id: "kimi",
	name: "Kimi CLI",
	description:
		"Moonshot AI's command-line coding agent powered by the Kimi model. Provides AI-assisted coding with strong multilingual and long-context capabilities.",
	category: "coding-agent",
	icon: "🌙",

	image: "node",
	imageTag: "24-alpine",
	ports: [],
	volumes: [
		{
			name: "kimi-config",
			containerPath: "/home/node/.kimi",
			description: "Kimi CLI configuration and cache",
		},
	],
	environment: [
		{
			key: "KIMI_API_KEY",
			defaultValue: "",
			secret: true,
			description: "Kimi/Moonshot API key",
			required: true,
		},
	],
	command: "npx kimi-cli@latest",
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://github.com/anthropics/kimi-cli",
	tags: ["ai-coding", "kimi", "moonshot", "agent"],
	maturity: "experimental",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
