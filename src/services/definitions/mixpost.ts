import type { ServiceDefinition } from "../../types.js";

export const mixpostDefinition: ServiceDefinition = {
	id: "mixpost",
	name: "Mixpost",
	description:
		"Self-hosted social media management tool for scheduling, publishing, and analytics. Supports multiple social platforms from a single dashboard.",
	category: "social-media",
	icon: "📮",

	image: "inovector/mixpost",
	imageTag: "2.4.0",
	ports: [
		{
			host: 9191,
			container: 80,
			description: "Mixpost Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "mixpost-storage",
			containerPath: "/var/www/html/storage/app",
			description: "Mixpost storage for uploads and generated content",
		},
	],
	environment: [
		{
			key: "APP_KEY",
			defaultValue: "",
			secret: true,
			description: "Laravel app key for encryption",
			required: true,
		},
		{
			key: "DB_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "Database host",
			required: true,
		},
		{
			key: "DB_PORT",
			defaultValue: "5432",
			secret: false,
			description: "Database port",
			required: true,
		},
		{
			key: "DB_DATABASE",
			defaultValue: "mixpost",
			secret: false,
			description: "Database name for Mixpost",
			required: true,
		},
		{
			key: "DB_USERNAME",
			defaultValue: "mixpost",
			secret: false,
			description: "Database username for Mixpost",
			required: true,
		},
		{
			key: "DB_PASSWORD",
			defaultValue: "${MIXPOST_DB_PASSWORD}",
			secret: true,
			description: "Database password for Mixpost",
			required: true,
		},
	],
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://mixpost.app/docs/",
	tags: ["social-media", "scheduling", "publishing", "analytics"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
