import type { ServiceDefinition } from "../../types.js";

export const difyDefinition: ServiceDefinition = {
	id: "dify",
	name: "Dify",
	description:
		"Open-source LLM app development platform with visual AI workflow builder, RAG pipeline, agent capabilities, and model management.",
	category: "ai-platform",
	icon: "🔮",

	image: "langgenius/dify-api",
	imageTag: "1.10.1-fix.1",
	ports: [
		{
			host: 3110,
			container: 5001,
			description: "Dify API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "dify-data",
			containerPath: "/app/api/storage",
			description: "Dify storage",
		},
	],
	environment: [
		{
			key: "DB_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL host for Dify",
			required: true,
		},
		{
			key: "DB_PORT",
			defaultValue: "5432",
			secret: false,
			description: "PostgreSQL port for Dify",
			required: true,
		},
		{
			key: "DB_DATABASE",
			defaultValue: "dify",
			secret: false,
			description: "PostgreSQL database for Dify",
			required: true,
		},
		{
			key: "DB_USERNAME",
			defaultValue: "dify",
			secret: false,
			description: "PostgreSQL user for Dify",
			required: true,
		},
		{
			key: "DB_PASSWORD",
			defaultValue: "${DIFY_DB_PASSWORD}",
			secret: true,
			description: "PostgreSQL password for Dify",
			required: true,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.dify.ai/",
	tags: ["ai-platform", "workflow", "rag", "agents", "visual-builder"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
