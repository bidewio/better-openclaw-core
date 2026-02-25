import type { ServiceDefinition } from "../../types.js";

export const hexstrikeDefinition: ServiceDefinition = {
	id: "hexstrike",
	name: "HexStrike AI",
	description: "AI-Powered MCP Cybersecurity Automation Platform with 150+ pentesting tools.",
	category: "security",
	icon: "⚔️",

	image: "ghcr.io/0x4m4/hexstrike-ai",
	imageTag: "v6.1",
	ports: [
		{
			host: 8888,
			container: 8888,
			description: "HexStrike MCP Server",
			exposed: true,
		},
	],
	volumes: [],
	environment: [],
	command: "mcp", // Instructs standard Python/Docker runtime to serve the MCP endpoint
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [{ skillId: "hexstrike-mcp", autoInstall: true }],
	openclawEnvVars: [],

	docsUrl: "https://github.com/0x4m4/hexstrike-ai",
	tags: ["security", "pentesting", "mcp", "agent"],
	maturity: "experimental",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 2048,
	gpuRequired: false,
};
