import type { ServiceDefinition } from "../../types.js";

export const temporalDefinition: ServiceDefinition = {
	id: "temporal",
	name: "Temporal",
	description:
		"Durable workflow execution platform for long-running, reliable tasks. OpenClaw can trigger and monitor Temporal workflows for complex multi-step operations.",
	category: "automation",
	icon: "⏱️",

	image: "temporalio/auto-setup",
	imageTag: "latest",
	ports: [
		{
			host: 7233,
			container: 7233,
			description: "Temporal gRPC frontend",
			exposed: true,
		},
		{
			host: 8233,
			container: 8233,
			description: "Temporal Web UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "DB",
			defaultValue: "postgresql",
			secret: false,
			description: "Database type for Temporal persistence",
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
			key: "POSTGRES_USER",
			defaultValue: "temporal",
			secret: false,
			description: "PostgreSQL user for Temporal",
			required: true,
		},
		{
			key: "POSTGRES_PWD",
			defaultValue: "${TEMPORAL_DB_PASSWORD}",
			secret: true,
			description: "PostgreSQL password for Temporal",
			required: true,
		},
		{
			key: "POSTGRES_SEEDS",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL host(s) for Temporal",
			required: true,
		},
	],
	healthcheck: {
		test: "temporal operator cluster health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "60s",
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "TEMPORAL_HOST",
			defaultValue: "temporal",
			secret: false,
			description: "Temporal server hostname for OpenClaw",
			required: true,
		},
		{
			key: "TEMPORAL_PORT",
			defaultValue: "7233",
			secret: false,
			description: "Temporal gRPC port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://docs.temporal.io/",
	tags: ["workflow", "durable-execution", "orchestration", "long-running-tasks"],
	maturity: "beta",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
