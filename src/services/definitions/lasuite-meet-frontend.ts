import type { ServiceDefinition } from "../../types.js";

export const lasuiteMeetFrontendDefinition: ServiceDefinition = {
	id: "lasuite-meet-frontend",
	name: "La Suite Meet (Frontend)",
	description:
		"Nginx-served frontend for La Suite Meet. Serves the web client and proxies API/admin/static to the backend.",
	category: "communication",
	icon: "🖥️",

	image: "lasuite/meet-frontend",
	imageTag: "latest",
	ports: [
		{ host: 8082, container: 8080, description: "Frontend HTTP", exposed: true },
		{ host: 8083, container: 8083, description: "Frontend alternate (e.g. nginx)", exposed: true },
	],
	volumes: [],
	environment: [],
	entrypoint: "/docker-entrypoint.sh",
	command: "nginx -g daemon off;",
	dependsOn: ["lasuite-meet-backend"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://github.com/suitenumerique/meet",
	tags: ["lasuite", "meet", "video", "conferencing", "nginx"],
	maturity: "stable",

	requires: ["lasuite-meet-backend"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
