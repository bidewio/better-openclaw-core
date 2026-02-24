import type { ServiceDefinition } from "../../types.js";

export const scraplingDefinition: ServiceDefinition = {
	id: "scrapling",
	name: "Scrapling",
	description: "Adaptive Web Scraping framework with anti-bot bypass capabilities and MCP server.",
	category: "browser",
	icon: "🕷️",

	image: "ghcr.io/d4vinci/scrapling",
	imageTag: "latest",
	ports: [
		{
			host: 8000,
			container: 8000,
			description: "Scrapling MCP Server",
			exposed: true,
		},
	],
	volumes: [],
	environment: [],
	command: "mcp",
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [{ skillId: "scrapling-scrape", autoInstall: true }],
	openclawEnvVars: [],

	docsUrl: "https://scrapling.readthedocs.io",
	tags: ["data", "scraping", "automation", "mcp"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
