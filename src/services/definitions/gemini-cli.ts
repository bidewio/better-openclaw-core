import type { ServiceDefinition } from "../../types.js";

export const geminiCliDefinition: ServiceDefinition = {
	id: "gemini-cli",
	name: "Gemini CLI",
	description:
		"Google's AI-powered command-line coding agent. Leverages Gemini models for code understanding, generation, and multi-file editing directly in the terminal.",
	category: "coding-agent",
	icon: "💎",

	image: "node",
	imageTag: "24-alpine",
	ports: [],
	volumes: [
		{
			name: "gemini-cli-config",
			containerPath: "/home/node/.gemini",
			description: "Gemini CLI configuration and cache",
		},
	],
	environment: [
		{
			key: "GOOGLE_API_KEY",
			defaultValue: "",
			secret: true,
			description: "Google API key for Gemini CLI",
			required: true,
		},
	],
	command: "npx @anthropic-ai/gemini-cli@latest",
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://github.com/google-gemini/gemini-cli",
	tags: ["ai-coding", "google", "gemini", "agent"],
	maturity: "beta",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
