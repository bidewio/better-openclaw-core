import type { ServiceDefinition } from "../../types.js";

export const lasuiteMeetAgentsDefinition: ServiceDefinition = {
	id: "lasuite-meet-agents",
	name: "La Suite Meet (Agents)",
	description:
		"Background agents for La Suite Meet (e.g. room lifecycle, recording). Shares env with backend; run alongside the Meet stack.",
	category: "communication",
	icon: "⚙️",

	image: "lasuite/meet-agents",
	imageTag: "latest",
	ports: [],
	volumes: [],
	environment: [],
	dependsOn: ["lasuite-meet-backend"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://github.com/suitenumerique/meet",
	tags: ["lasuite", "meet", "video", "conferencing", "agents"],
	maturity: "stable",

	requires: ["lasuite-meet-backend"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
