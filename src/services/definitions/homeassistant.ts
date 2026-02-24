import type { ServiceDefinition } from "../../types.js";

export const homeassistantDefinition: ServiceDefinition = {
	id: "homeassistant",
	name: "Home Assistant",
	description: "Open source home automation that puts local control and privacy first.",
	category: "automation",
	icon: "🏠",

	image: "ghcr.io/home-assistant/home-assistant",
	imageTag: "stable",
	ports: [
		{
			host: 8123,
			container: 8123,
			description: "Home Assistant Web Interface",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "homeassistant_config",
			containerPath: "/config",
			description: "Home Assistant configuration directory",
		},
		{
			name: "/etc/localtime",
			containerPath: "/etc/localtime",
			description: "Timezone sync",
		},
	],
	environment: [
		{
			key: "TZ",
			defaultValue: "UTC",
			secret: false,
			description: "Timezone mapping",
			required: false,
		},
	],
	healthcheck: {
		test: "curl --fail http://localhost:8123/ || exit 1",
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

	docsUrl: "https://www.home-assistant.io/docs/",
	tags: ["smarthome", "automation", "iot", "local-first"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
