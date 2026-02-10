import type { ServiceDefinition } from "../../types.js";

export const gotifyDefinition: ServiceDefinition = {
	id: "gotify",
	name: "Gotify",
	description:
		"Simple, self-hosted push notification server with a REST API and real-time WebSocket delivery for sending and receiving messages.",
	category: "communication",
	icon: "🔔",

	image: "gotify/server",
	imageTag: "latest",
	ports: [
		{
			host: 8083,
			container: 80,
			description: "Gotify web interface and API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "gotify-data",
			containerPath: "/app/data",
			description: "Persistent Gotify data and message storage",
		},
	],
	environment: [],
	healthcheck: {
		test: "wget -q --spider http://localhost:80/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "GOTIFY_HOST",
			defaultValue: "gotify",
			secret: false,
			description: "Gotify hostname for OpenClaw",
			required: true,
		},
		{
			key: "GOTIFY_PORT",
			defaultValue: "8080",
			secret: false,
			description: "Gotify port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://gotify.net/docs/",
	tags: ["notifications", "push", "websocket", "messaging"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 64,
	gpuRequired: false,
};
