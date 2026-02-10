import type { ServiceDefinition } from "../../types.js";

export const beszelDefinition: ServiceDefinition = {
	id: "beszel",
	name: "Beszel",
	description:
		"Lightweight server monitoring dashboard with Docker stats, alerts, and historical data.",
	category: "dev-tools",
	icon: "📟",

	image: "henrygd/beszel",
	imageTag: "latest",
	ports: [
		{
			host: 8099,
			container: 8090,
			description: "Beszel Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "beszel-data",
			containerPath: "/beszel_data",
			description: "Beszel data",
		},
	],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://beszel.dev/",
	tags: ["monitoring", "server", "dashboard", "docker-stats", "alerts"],
	maturity: "beta",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 64,
	gpuRequired: false,
};
