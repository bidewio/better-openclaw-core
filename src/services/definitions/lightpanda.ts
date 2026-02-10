import type { ServiceDefinition } from "../../types.js";

export const lightpandaDefinition: ServiceDefinition = {
	id: "lightpanda",
	name: "LightPanda",
	description:
		"Ultra-fast open-source headless browser built in Zig. 9x less memory and 11x faster than Chrome. CDP-compatible with Puppeteer and Playwright for web scraping and AI agent automation.",
	category: "browser",
	icon: "🐼",
	image: "lightpanda/browser",
	imageTag: "nightly",
	ports: [
		{
			host: 9222,
			container: 9222,
			description: "CDP WebSocket protocol",
			exposed: true,
		},
	],
	volumes: [],
	environment: [],
	// No command -- the image's default ENTRYPOINT+CMD starts the CDP server
	// on port 9222 bound to all interfaces automatically
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],
	skills: [{ skillId: "lightpanda-browse", autoInstall: true }],
	openclawEnvVars: [
		{
			key: "LIGHTPANDA_HOST",
			defaultValue: "lightpanda",
			secret: false,
			description: "LightPanda hostname for OpenClaw",
			required: true,
		},
		{
			key: "LIGHTPANDA_PORT",
			defaultValue: "9222",
			secret: false,
			description: "LightPanda CDP port for OpenClaw",
			required: true,
		},
	],
	docsUrl: "https://github.com/lightpanda-io/browser",
	tags: [
		"headless-browser",
		"cdp",
		"zig",
		"fast",
		"low-memory",
		"scraping",
		"puppeteer",
		"playwright",
	],
	maturity: "beta",
	requires: [],
	recommends: [],
	conflictsWith: [],
	minMemoryMB: 64,
	gpuRequired: false,
};
