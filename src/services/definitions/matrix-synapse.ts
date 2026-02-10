import type { ServiceDefinition } from "../../types.js";

export const matrixSynapseDefinition: ServiceDefinition = {
	id: "matrix-synapse",
	name: "Matrix Synapse",
	description:
		"Decentralized messaging server. OpenClaw has a native Matrix plugin for channel integration.",
	category: "communication",
	icon: "🔗",

	image: "matrixdotorg/synapse",
	imageTag: "latest",
	ports: [
		{
			host: 8008,
			container: 8008,
			description: "Matrix Synapse API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "synapse-data",
			containerPath: "/data",
			description: "Synapse persistent data including signing keys and media",
		},
	],
	environment: [
		{
			key: "SYNAPSE_SERVER_NAME",
			defaultValue: "localhost",
			secret: false,
			description: "Matrix server name/domain used in user IDs and room aliases",
			required: true,
		},
		{
			key: "SYNAPSE_REPORT_STATS",
			defaultValue: "no",
			secret: false,
			description: "Report anonymous usage statistics to Matrix.org",
			required: false,
		},
		{
			key: "SYNAPSE_DATABASE_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL host for Synapse",
			required: true,
		},
		{
			key: "SYNAPSE_DATABASE_NAME",
			defaultValue: "synapse",
			secret: false,
			description: "PostgreSQL database for Synapse",
			required: true,
		},
		{
			key: "SYNAPSE_DATABASE_USER",
			defaultValue: "synapse",
			secret: false,
			description: "PostgreSQL user for Synapse",
			required: true,
		},
		{
			key: "SYNAPSE_DATABASE_PASSWORD",
			defaultValue: "${SYNAPSE_DB_PASSWORD}",
			secret: true,
			description: "PostgreSQL password for Synapse",
			required: true,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://element-hq.github.io/synapse/",
	tags: ["messaging", "decentralized", "federation", "chat", "matrix"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
