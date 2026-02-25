import type { ServiceDefinition } from "../../types.js";

export const redisDefinition: ServiceDefinition = {
	id: "redis",
	name: "Redis",
	description:
		"In-memory data store used for caching, session management, pub/sub messaging, and as a high-performance key-value database.",
	category: "database",
	icon: "🔴",

	image: "redis",
	imageTag: "8-alpine",
	ports: [
		{
			host: 6379,
			container: 6379,
			description: "Redis server port",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "redis-data",
			containerPath: "/data",
			description: "Persistent Redis data",
		},
	],
	environment: [
		{
			key: "REDIS_PASSWORD",
			defaultValue: "changeme",
			secret: true,
			description: "Password for Redis authentication",
			required: true,
		},
	],
	healthcheck: {
		test: "redis-cli ping",
		interval: "10s",
		timeout: "5s",
		retries: 3,
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [{ skillId: "redis-cache", autoInstall: true }],
	openclawEnvVars: [
		{
			key: "REDIS_HOST",
			defaultValue: "redis",
			secret: false,
			description: "Redis hostname for OpenClaw",
			required: true,
		},
		{
			key: "REDIS_PORT",
			defaultValue: "6379",
			secret: false,
			description: "Redis port for OpenClaw",
			required: true,
		},
		{
			key: "REDIS_PASSWORD",
			defaultValue: "${REDIS_PASSWORD}",
			secret: true,
			description: "Redis password for OpenClaw (references service password)",
			required: true,
		},
	],

	docsUrl: "https://redis.io/docs",
	tags: ["cache", "pubsub", "message-bus", "session-store"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: ["valkey"],

	minMemoryMB: 128,
	gpuRequired: false,

	nativeSupported: true,
	nativeRecipes: [
		{
			platform: "linux",
			installSteps: [
				"command -v redis-server >/dev/null 2>&1 || (command -v apt-get >/dev/null 2>&1 && sudo apt-get update -qq && sudo apt-get install -y -qq redis-server)",
				"command -v redis-server >/dev/null 2>&1 || (command -v dnf >/dev/null 2>&1 && sudo dnf install -y redis)",
			],
			startCommand: "sudo systemctl start redis-server 2>/dev/null || sudo systemctl start redis",
			stopCommand: "sudo systemctl stop redis-server 2>/dev/null || sudo systemctl stop redis",
			configPath: "/etc/redis/redis.conf",
			configTemplate:
				"# Generated for OpenClaw bare-metal\nport 6379\nrequirepass ${REDIS_PASSWORD}\nbind 127.0.0.1 ::1\n",
			systemdUnit: "redis-server",
		},
	],
};
