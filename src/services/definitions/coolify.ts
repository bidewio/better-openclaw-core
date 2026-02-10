import type { ServiceDefinition } from "../../types.js";

export const coolifyDefinition: ServiceDefinition = {
	id: "coolify",
	name: "Coolify",
	description:
		"Self-hosted PaaS to deploy and manage applications, databases, and services. Heroku/Netlify alternative with Git integration and one-click apps.",
	category: "dev-tools",
	icon: "☁️",

	image: "coollabsio/coolify",
	imageTag: "latest",
	ports: [
		{
			host: 8000,
			container: 8000,
			description: "Coolify web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "coolify-docker-sock",
			containerPath: "/var/run/docker.sock",
			description: "Docker socket for managing containers",
		},
		{
			name: "coolify-data",
			containerPath: "/data",
			description: "Coolify data and configuration",
		},
	],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://coolify.io/docs",
	tags: ["paas", "deployment", "docker", "git", "self-hosted"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 2048,
	gpuRequired: false,
};
