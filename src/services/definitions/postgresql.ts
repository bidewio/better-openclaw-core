import type { ServiceDefinition } from "../../types.js";

export const postgresqlDefinition: ServiceDefinition = {
	id: "postgresql",
	name: "PostgreSQL",
	description:
		"Powerful open-source relational database for structured data, supporting advanced SQL features, JSONB, and full-text search.",
	category: "database",
	icon: "🐘",

	image: "postgres",
	imageTag: "16-alpine",
	ports: [
		{
			host: 5432,
			container: 5432,
			description: "PostgreSQL server port",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "postgres-data",
			containerPath: "/var/lib/postgresql/data",
			description: "Persistent PostgreSQL data",
		},
	],
	environment: [
		{
			key: "POSTGRES_USER",
			defaultValue: "openclaw",
			secret: false,
			description: "PostgreSQL superuser name",
			required: true,
		},
		{
			key: "POSTGRES_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "PostgreSQL superuser password",
			required: true,
		},
		{
			key: "POSTGRES_DB",
			defaultValue: "openclaw",
			secret: false,
			description: "Default database to create on first run",
			required: true,
		},
	],
	healthcheck: {
		test: "pg_isready -U openclaw",
		interval: "10s",
		timeout: "5s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "POSTGRES_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL hostname for OpenClaw",
			required: true,
		},
		{
			key: "POSTGRES_PORT",
			defaultValue: "5432",
			secret: false,
			description: "PostgreSQL port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://www.postgresql.org/docs/",
	tags: ["relational", "sql", "structured-data"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
