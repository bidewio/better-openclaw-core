import type { ServiceDefinition } from "../../types.js";

export const umamiDefinition: ServiceDefinition = {
	id: "umami",
	name: "Umami",
	description:
		"Simple, fast, privacy-focused alternative to Google Analytics. Lightweight and easy to deploy with a clean, modern dashboard.",
	category: "analytics",
	icon: "📈",

	image: "ghcr.io/umami-software/umami",
	imageTag: "postgresql-latest",
	ports: [
		{
			host: 3050,
			container: 3000,
			description: "Umami Web UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://umami:${UMAMI_DB_PASSWORD}@postgresql:5432/umami",
			secret: false,
			description: "PostgreSQL connection string for Umami",
			required: true,
		},
	],
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://umami.is/docs",
	tags: ["analytics", "privacy", "web-analytics", "lightweight"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
