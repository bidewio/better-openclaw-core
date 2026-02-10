import type { ServiceDefinition } from "../../types.js";

export const appflowyDefinition: ServiceDefinition = {
	id: "appflowy",
	name: "AppFlowy",
	description:
		"Open-source Notion alternative focused on privacy and extensibility. Self-hosted collaborative workspace.",
	category: "knowledge",
	icon: "🍃",

	image: "appflowyio/appflowy-cloud",
	imageTag: "latest",
	ports: [
		{
			host: 8087,
			container: 8025,
			description: "AppFlowy Cloud API and Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "appflowy-data",
			containerPath: "/data",
			description: "AppFlowy persistent application data",
		},
	],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.appflowy.io/",
	tags: ["notion-alternative", "workspace", "notes", "wiki", "collaboration"],
	maturity: "beta",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
