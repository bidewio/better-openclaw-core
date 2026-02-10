import type { ServiceDefinition } from "../../types.js";

export const opencodeDefinition: ServiceDefinition = {
	id: "opencode",
	name: "OpenCode",
	description:
		"Open-source AI coding agent supporting 75+ LLM providers with a terminal-based UI and web interface for collaborative AI-assisted development.",
	category: "coding-agent",
	icon: "🐙",

	image: "ghcr.io/opencode-ai/opencode",
	imageTag: "latest",
	ports: [
		{
			host: 3030,
			container: 3000,
			description: "OpenCode Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "opencode-config",
			containerPath: "/home/coder/.opencode",
			description: "OpenCode configuration and session data",
		},
	],
	environment: [
		{
			key: "OPENCODE_SERVER_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "OpenCode server password",
			required: false,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://opencode.ai/docs",
	tags: ["ai-coding", "open-source", "multi-model", "agent"],
	maturity: "beta",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
