import type { ServiceDefinition } from "../../types.js";

export const pentagiDefinition: ServiceDefinition = {
	id: "pentagi",
	name: "PentAGI",
	description:
		"Fully autonomous AI Agents system capable of performing complex penetration testing tasks.",
	category: "security",
	icon: "🕵️",

	image: "vxcontrol/pentagi",
	imageTag: "latest",
	ports: [
		{
			host: 8080, // Assuming default or common port for web UI, might need adjustment based on their docker-compose
			container: 8080,
			description: "PentAGI Interface",
			exposed: true,
		},
	],
	volumes: [],
	environment: [],
	command: "", // Leave empty to use default image command
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [{ skillId: "pentagi-orchestrator", autoInstall: true }],
	openclawEnvVars: [],

	docsUrl: "https://pentagi.com",
	tags: ["security", "pentesting", "autonomous", "agents"],
	maturity: "experimental",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 4096, // Documentation explicitly asks for Minimum 4GB RAM
	gpuRequired: false,
};
