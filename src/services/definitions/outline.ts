import type { ServiceDefinition } from "../../types.js";

export const outlineDefinition: ServiceDefinition = {
	id: "outline",
	name: "Outline",
	description:
		"Modern team wiki and knowledge base. Beautiful, fast, and collaborative. Self-hosted Notion alternative.",
	category: "knowledge",
	icon: "📝",

	image: "outlinewiki/outline",
	imageTag: "latest",
	ports: [
		{
			host: 3140,
			container: 3000,
			description: "Outline Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "outline-data",
			containerPath: "/var/lib/outline/data",
			description: "Outline file storage",
		},
	],
	environment: [
		{
			key: "SECRET_KEY",
			defaultValue: "",
			secret: true,
			description: "Outline secret key for encrypting sessions and tokens",
			required: true,
		},
		{
			key: "UTILS_SECRET",
			defaultValue: "",
			secret: true,
			description: "Outline utils secret for internal cryptographic operations",
			required: true,
		},
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://outline:${OUTLINE_DB_PASSWORD}@postgresql:5432/outline",
			secret: false,
			description: "PostgreSQL connection string for Outline",
			required: true,
		},
		{
			key: "REDIS_URL",
			defaultValue: "redis://:${REDIS_PASSWORD}@redis:6379",
			secret: false,
			description: "Redis connection string for caching and background jobs",
			required: true,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://www.getoutline.com/developers",
	tags: ["wiki", "knowledge-base", "documentation", "team", "notion-alternative"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
