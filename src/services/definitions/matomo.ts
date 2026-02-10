import type { ServiceDefinition } from "../../types.js";

export const matomoDefinition: ServiceDefinition = {
	id: "matomo",
	name: "Matomo",
	description:
		"Privacy-focused open-source web analytics platform. Self-hosted alternative to Google Analytics with full data ownership and GDPR compliance.",
	category: "analytics",
	icon: "📊",

	image: "matomo",
	imageTag: "latest",
	ports: [
		{
			host: 8090,
			container: 80,
			description: "Matomo Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "matomo-data",
			containerPath: "/var/www/html",
			description: "Matomo installation data and plugins",
		},
	],
	environment: [
		{
			key: "MATOMO_DATABASE_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "Database host for Matomo",
			required: true,
		},
		{
			key: "MATOMO_DATABASE_PORT",
			defaultValue: "5432",
			secret: false,
			description: "Database port for Matomo",
			required: true,
		},
		{
			key: "MATOMO_DATABASE_DBNAME",
			defaultValue: "matomo",
			secret: false,
			description: "Database name for Matomo",
			required: true,
		},
		{
			key: "MATOMO_DATABASE_USERNAME",
			defaultValue: "matomo",
			secret: false,
			description: "Database username for Matomo",
			required: true,
		},
		{
			key: "MATOMO_DATABASE_PASSWORD",
			defaultValue: "${MATOMO_DB_PASSWORD}",
			secret: true,
			description: "Database password for Matomo",
			required: true,
		},
	],
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://matomo.org/docs/",
	tags: ["analytics", "privacy", "web-analytics", "tracking"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
