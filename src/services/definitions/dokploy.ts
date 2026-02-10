import type { ServiceDefinition } from "../../types.js";

export const dokployDefinition: ServiceDefinition = {
	id: "dokploy",
	name: "Dokploy",
	description:
		"All-in-one platform for deploying containerized apps and databases. Supports Docker Compose, Dockerfiles, Nixpacks, and multi-server deployment.",
	category: "dev-tools",
	icon: "🚀",

	image: "dokploy/dokploy",
	imageTag: "latest",
	ports: [
		{
			host: 3000,
			container: 3000,
			description: "Dokploy web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "dokploy-docker-sock",
			containerPath: "/var/run/docker.sock",
			description: "Docker socket for managing containers",
		},
		{
			name: "dokploy-data",
			containerPath: "/data",
			description: "Dokploy data and configuration",
		},
	],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.dokploy.com",
	tags: ["paas", "deployment", "docker", "docker-compose", "self-hosted"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
