import type { ServiceDefinition } from "../../types.js";

export const rocketchatDefinition: ServiceDefinition = {
	id: "rocketchat",
	name: "Rocket.Chat",
	description:
		"Open-source team chat platform with AI features, channels, DMs, video calls, and integrations.",
	category: "communication",
	icon: "🚀",

	image: "rocket.chat",
	imageTag: "latest",
	ports: [
		{
			host: 3200,
			container: 3000,
			description: "Rocket.Chat Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "rocketchat-uploads",
			containerPath: "/app/uploads",
			description: "Rocket.Chat file uploads and attachments",
		},
	],
	environment: [
		{
			key: "ROOT_URL",
			defaultValue: "http://localhost:3200",
			secret: false,
			description: "Public root URL for Rocket.Chat",
			required: true,
		},
		{
			key: "MONGO_URL",
			defaultValue: "mongodb://mongodb:27017/rocketchat",
			secret: false,
			description: "MongoDB connection string for Rocket.Chat",
			required: true,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.rocket.chat/",
	tags: ["team-chat", "messaging", "video-calls", "ai", "slack-alternative"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
