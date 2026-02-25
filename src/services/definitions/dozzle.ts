import type { ServiceDefinition } from "../../types.js";

export const dozzleDefinition: ServiceDefinition = {
	id: "dozzle",
	name: "Dozzle",
	description:
		"Real-time Docker container log viewer in the browser. Lightweight and requires no database.",
	category: "dev-tools",
	icon: "📜",

	image: "amir20/dozzle",
	imageTag: "10.0.4",
	ports: [
		{
			host: 9999,
			container: 8080,
			description: "Dozzle Web UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://dozzle.dev/",
	tags: ["logs", "docker", "monitoring", "real-time", "viewer"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 32,
	gpuRequired: false,
};
