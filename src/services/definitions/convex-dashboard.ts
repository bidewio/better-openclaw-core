import type { ServiceDefinition } from "../../types.js";

export const convexDashboardDefinition: ServiceDefinition = {
	id: "convex-dashboard",
	name: "Convex Dashboard",
	description:
		"Web dashboard for the self-hosted Convex backend. Browse data, run functions, view logs, and manage your deployment.",
	category: "dev-tools",
	icon: "📊",

	image: "ghcr.io/get-convex/convex-dashboard",
	imageTag: "latest",
	ports: [
		{
			host: 6791,
			container: 6791,
			description: "Convex Dashboard Web UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "NEXT_PUBLIC_DEPLOYMENT_URL",
			defaultValue: "http://convex:3210",
			secret: false,
			description: "URL of the Convex backend (use Docker service name)",
			required: true,
		},
	],
	dependsOn: ["convex"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://github.com/get-convex/convex-backend",
	tags: ["convex", "dashboard", "admin", "database-ui"],
	maturity: "stable",

	requires: ["convex"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
