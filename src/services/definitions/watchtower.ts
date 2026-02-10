import type { ServiceDefinition } from "../../types.js";

export const watchtowerDefinition: ServiceDefinition = {
	id: "watchtower",
	name: "Watchtower",
	description: "Automatically update Docker container images when new versions are released.",
	category: "dev-tools",
	icon: "🗼",

	image: "containrrr/watchtower",
	imageTag: "latest",
	ports: [],
	volumes: [],
	environment: [
		{
			key: "WATCHTOWER_CLEANUP",
			defaultValue: "true",
			secret: false,
			description: "Remove old images after update",
			required: false,
		},
		{
			key: "WATCHTOWER_POLL_INTERVAL",
			defaultValue: "86400",
			secret: false,
			description: "Check interval in seconds (default 24h)",
			required: false,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://containrrr.dev/watchtower/",
	tags: ["auto-update", "docker", "maintenance", "devops"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 32,
	gpuRequired: false,
};
