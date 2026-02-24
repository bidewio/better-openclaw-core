import type { ServiceDefinition } from "../../types.js";

export const jellyfinDefinition: ServiceDefinition = {
	id: "jellyfin",
	name: "Jellyfin",
	description:
		"The Free Software Media System. It puts you in control of managing and streaming your media.",
	category: "media",
	icon: "🎬",

	image: "jellyfin/jellyfin",
	imageTag: "latest",
	ports: [
		{
			host: 8096,
			container: 8096,
			description: "Jellyfin Web Interface",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "jellyfin_config",
			containerPath: "/config",
			description: "Jellyfin configuration storage",
		},
		{
			name: "jellyfin_cache",
			containerPath: "/cache",
			description: "Jellyfin cache storage",
		},
	],
	environment: [
		{
			key: "JELLYFIN_PublishedServerUrl",
			defaultValue: "http://localhost",
			secret: false,
			description: "Published server URL for clients",
			required: false,
		},
	],
	healthcheck: {
		test: "curl --fail http://localhost:8096/health || exit 1",
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

	docsUrl: "https://jellyfin.org/docs/",
	tags: ["media", "streaming", "movies", "tv-shows", "music"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
