import type { ServiceDefinition } from "../../types.js";

export const playwrightServerDefinition: ServiceDefinition = {
	id: "playwright-server",
	name: "Playwright Server",
	description:
		"Microsoft Playwright browser automation server for headless testing and web scraping.",
	category: "browser",
	icon: "🎭",

	image: "mcr.microsoft.com/playwright",
	imageTag: "latest",
	ports: [
		{
			host: 3040,
			container: 3000,
			description: "Playwright Server",
			exposed: true,
		},
	],
	volumes: [],
	environment: [],
	command: "npx playwright run-server --port 3000",
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://playwright.dev/docs/intro",
	tags: ["browser", "testing", "automation", "scraping", "headless"],
	maturity: "beta",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
