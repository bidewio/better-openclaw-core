import type { ServiceDefinition } from "../../types.js";

export const postizDefinition: ServiceDefinition = {
	id: "postiz",
	name: "Postiz",
	description:
		"Open-source social media scheduling and management tool with AI features. Schedule posts for X, Bluesky, Instagram, TikTok, and more.",
	category: "social-media",
	icon: "📨",

	image: "ghcr.io/gitroomhq/postiz-app",
	imageTag: "v2.19.0",
	ports: [
		{
			host: 5200,
			container: 5000,
			description: "Postiz Web UI",
			exposed: true,
		},
		{
			host: 3333,
			container: 3000,
			description: "Postiz Frontend",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "postiz-config",
			containerPath: "/config",
			description: "Postiz configuration",
		},
		{
			name: "postiz-uploads",
			containerPath: "/uploads",
			description: "Postiz uploaded media",
		},
	],
	environment: [
		{
			key: "MAIN_URL",
			defaultValue: "http://localhost:5200",
			secret: false,
			description: "Main Postiz URL",
			required: true,
		},
		{
			key: "FRONTEND_URL",
			defaultValue: "http://localhost:3333",
			secret: false,
			description: "Frontend URL",
			required: true,
		},
		{
			key: "JWT_SECRET",
			defaultValue: "",
			secret: true,
			description: "JWT secret for Postiz auth",
			required: true,
		},
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://postiz:${POSTIZ_DB_PASSWORD}@postgresql:5432/postiz",
			secret: false,
			description: "PostgreSQL connection string",
			required: true,
		},
	],
	dependsOn: ["postgresql", "redis"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.postiz.com/",
	tags: ["social-media", "scheduling", "ai", "content", "automation"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
