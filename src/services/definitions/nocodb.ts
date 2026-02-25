import type { ServiceDefinition } from "../../types.js";

export const nocodbDefinition: ServiceDefinition = {
	id: "nocodb",
	name: "NocoDB",
	description:
		"Open-source Airtable alternative. Turn any database into a smart spreadsheet with views, forms, and automation.",
	category: "knowledge",
	icon: "📊",

	image: "nocodb/nocodb",
	imageTag: "0.260",
	ports: [
		{
			host: 8086,
			container: 8080,
			description: "NocoDB Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "nocodb-data",
			containerPath: "/usr/app/data",
			description: "NocoDB persistent data and SQLite database",
		},
	],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.nocodb.com/",
	tags: ["database", "spreadsheet", "airtable-alternative", "no-code", "forms"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
