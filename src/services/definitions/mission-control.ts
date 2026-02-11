import type { ServiceDefinition } from "../../types.js";

export const missionControlDefinition: ServiceDefinition = {
	id: "mission-control",
	name: "Mission Control",
	description:
		"Real-time agent oversight dashboard for OpenClaw. Kanban task board, live activity feed, document browser, and message threads — powered by Convex.",
	category: "dev-tools",
	icon: "🛸",

	image: "ghcr.io/bidewio/mission-control",
	imageTag: "latest",
	ports: [
		{
			host: 3660,
			container: 3660,
			description: "Mission Control Web UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "VITE_CONVEX_URL",
			defaultValue: "http://127.0.0.1:3210",
			secret: false,
			description:
				"Convex backend URL as seen from the browser (build-time, embedded in JS bundle)",
			required: true,
		},
		{
			key: "CONVEX_SELF_HOSTED_URL",
			defaultValue: "http://convex:3210",
			secret: false,
			description:
				"Internal Docker URL for pushing Convex functions during build",
			required: true,
		},
		{
			key: "CONVEX_SELF_HOSTED_ADMIN_KEY",
			defaultValue: "",
			secret: true,
			description:
				"Admin key for the self-hosted Convex backend. Generate with: docker compose exec convex ./generate_admin_key.sh",
			required: true,
		},
	],
	dependsOn: ["convex"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl:
		"https://github.com/bidewio/better-openclaw/tree/main/packages/mission-control",
	selfHostedDocsUrl:
		"https://github.com/bidewio/better-openclaw/tree/main/packages/mission-control",
	tags: ["openclaw", "dashboard", "monitoring", "agents", "analytics", "convex"],
	maturity: "stable",

	requires: ["convex"],
	recommends: ["convex-dashboard"],
	conflictsWith: [],
	mandatory: true,
	removalWarning:
		"Mission Control is the primary dashboard for monitoring your OpenClaw agents. Removing it will eliminate real-time agent oversight, task management, and activity tracking.",

	minMemoryMB: 128,
	gpuRequired: false,
};
