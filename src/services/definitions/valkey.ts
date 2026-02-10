import type { ServiceDefinition } from "../../types.js";

export const valkeyDefinition: ServiceDefinition = {
	id: "valkey",
	name: "Valkey",
	description:
		"Open-source, high-performance key-value store and Redis-compatible fork maintained by the Linux Foundation for caching and data structures.",
	category: "database",
	icon: "🔑",

	image: "valkey/valkey",
	imageTag: "8-alpine",
	ports: [
		{
			host: 6379,
			container: 6379,
			description: "Valkey server port",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "valkey-data",
			containerPath: "/data",
			description: "Persistent Valkey data",
		},
	],
	environment: [],
	healthcheck: {
		test: "valkey-cli ping",
		interval: "10s",
		timeout: "5s",
		retries: 3,
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "REDIS_HOST",
			defaultValue: "valkey",
			secret: false,
			description: "Redis-compatible hostname for OpenClaw (points to Valkey)",
			required: true,
		},
		{
			key: "REDIS_PORT",
			defaultValue: "6379",
			secret: false,
			description: "Redis-compatible port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://valkey.io/docs/",
	tags: ["cache", "key-value", "redis-compatible"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: ["redis"],

	minMemoryMB: 128,
	gpuRequired: false,
};
