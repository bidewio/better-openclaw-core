import type { ServiceDefinition } from "../../types.js";

export const nextcloudDefinition: ServiceDefinition = {
	id: "nextcloud",
	name: "Nextcloud",
	description: "Self-hosted productivity platform that keeps you in control.",
	category: "storage",
	icon: "☁️",

	image: "nextcloud",
	imageTag: "32.0.6",
	ports: [
		{
			host: 8080,
			container: 80,
			description: "Nextcloud Web Interface",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "nextcloud_data",
			containerPath: "/var/www/html",
			description: "Persistent Nextcloud data storage",
		},
	],
	environment: [
		{
			key: "MYSQL_DATABASE",
			defaultValue: "nextcloud",
			secret: false,
			description: "Database name",
			required: false,
		},
		{
			key: "MYSQL_USER",
			defaultValue: "nextcloud",
			secret: false,
			description: "Database user",
			required: false,
		},
		{
			key: "MYSQL_PASSWORD",
			defaultValue: "nextcloud_secret",
			secret: true,
			description: "Database password",
			required: false,
		},
		{
			key: "MYSQL_HOST",
			defaultValue: "postgres",
			secret: false,
			description: "Database hostname",
			required: false,
		},
	],
	healthcheck: {
		test: "curl --fail http://localhost:80/status.php || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://nextcloud.com/",
	tags: ["storage", "cloud", "productivity", "collaboration"],
	maturity: "stable",

	requires: [],
	recommends: ["postgresql"],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
