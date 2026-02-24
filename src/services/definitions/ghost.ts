import type { ServiceDefinition } from "../../types.js";

export const ghostDefinition: ServiceDefinition = {
	id: "ghost",
	name: "Ghost",
	description: "The world's most popular modern open-source publishing platform.",
	category: "social-media",
	icon: "👻",

	image: "ghost",
	imageTag: "latest",
	ports: [
		{
			host: 2368,
			container: 2368,
			description: "Ghost Public Interface",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "ghost_content",
			containerPath: "/var/lib/ghost/content",
			description: "Ghost images, themes, and content storage",
		},
	],
	environment: [
		{
			key: "url",
			defaultValue: "http://localhost:2368",
			secret: false,
			description: "The URL of the Ghost install",
			required: true,
		},
	],
	healthcheck: {
		test: "curl --fail http://localhost:2368/ghost/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://ghost.org/docs/",
	tags: ["blog", "publishing", "writing", "cms", "content"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
