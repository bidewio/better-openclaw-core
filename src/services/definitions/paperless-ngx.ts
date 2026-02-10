import type { ServiceDefinition } from "../../types.js";

export const paperlessNgxDefinition: ServiceDefinition = {
	id: "paperless-ngx",
	name: "Paperless-ngx",
	description:
		"Document management system with OCR, AI-powered classification, and full-text search.",
	category: "knowledge",
	icon: "🗃️",

	image: "ghcr.io/paperless-ngx/paperless-ngx",
	imageTag: "latest",
	ports: [
		{
			host: 8010,
			container: 8000,
			description: "Paperless-ngx Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "paperless-data",
			containerPath: "/usr/src/paperless/data",
			description: "Paperless application data and database",
		},
		{
			name: "paperless-media",
			containerPath: "/usr/src/paperless/media",
			description: "Paperless stored and processed documents",
		},
		{
			name: "paperless-consume",
			containerPath: "/usr/src/paperless/consume",
			description: "Paperless intake folder for automatic document ingestion",
		},
	],
	environment: [
		{
			key: "PAPERLESS_SECRET_KEY",
			defaultValue: "",
			secret: true,
			description: "Django secret key for cryptographic signing",
			required: true,
		},
		{
			key: "PAPERLESS_DBHOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL host for Paperless-ngx",
			required: true,
		},
		{
			key: "PAPERLESS_DBUSER",
			defaultValue: "paperless",
			secret: false,
			description: "PostgreSQL user for Paperless-ngx",
			required: true,
		},
		{
			key: "PAPERLESS_DBPASS",
			defaultValue: "${PAPERLESS_DB_PASSWORD}",
			secret: true,
			description: "PostgreSQL password for Paperless-ngx",
			required: true,
		},
		{
			key: "PAPERLESS_DBNAME",
			defaultValue: "paperless",
			secret: false,
			description: "PostgreSQL database name for Paperless-ngx",
			required: true,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.paperless-ngx.com/",
	tags: ["documents", "ocr", "classification", "archive", "search"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: ["redis"],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
