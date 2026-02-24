import type { ServiceDefinition } from "../../types.js";

export const immichDefinition: ServiceDefinition = {
	id: "immich",
	name: "Immich",
	description: "High performance self-hosted photo and video management solution.",
	category: "media",
	icon: "📸",

	image: "ghcr.io/immich-app/immich-server",
	imageTag: "release",
	ports: [
		{
			host: 2283,
			container: 2283,
			description: "Immich Web Interface",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "immich_upload",
			containerPath: "/usr/src/app/upload",
			description: "Persistent Immich photos/videos storage",
		},
		{
			name: "/etc/localtime",
			containerPath: "/etc/localtime",
			description: "Host timezone synchronization",
		},
	],
	environment: [
		{
			key: "DB_HOSTNAME",
			defaultValue: "postgres",
			secret: false,
			description: "Database hostname",
			required: true,
		},
		{
			key: "DB_USERNAME",
			defaultValue: "postgres",
			secret: false,
			description: "Database user",
			required: true,
		},
		{
			key: "DB_PASSWORD",
			defaultValue: "postgres",
			secret: true,
			description: "Database password",
			required: true,
		},
		{
			key: "DB_DATABASE_NAME",
			defaultValue: "immich",
			secret: false,
			description: "Database name",
			required: true,
		},
		{
			key: "REDIS_HOSTNAME",
			defaultValue: "redis",
			secret: false,
			description: "Redis hostname",
			required: true,
		},
	],
	healthcheck: {
		test: "curl --fail http://localhost:2283/api/server-info/ping || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: ["postgresql", "redis"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://immich.app/docs/overview/introduction",
	tags: ["media", "photos", "videos", "gallery", "backup"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
