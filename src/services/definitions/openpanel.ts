import type { ServiceDefinition } from "../../types.js";

export const openpanelDefinition: ServiceDefinition = {
	id: "openpanel",
	name: "OpenPanel",
	description:
		"Open-source analytics platform with real-time dashboards and event tracking. Modern alternative for tracking user behavior and application metrics.",
	category: "analytics",
	icon: "📉",

	image: "ghcr.io/openpanel-dev/openpanel",
	imageTag: "1.6.1",
	ports: [
		{
			host: 3060,
			container: 3000,
			description: "OpenPanel Web UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://openpanel:${OPENPANEL_DB_PASSWORD}@postgresql:5432/openpanel",
			secret: false,
			description: "PostgreSQL connection string for OpenPanel",
			required: true,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://openpanel.dev/docs",
	tags: ["analytics", "events", "real-time", "dashboards"],
	maturity: "beta",

	requires: [],
	recommends: ["postgresql"],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
