import type { ServiceDefinition } from "../../types.js";

export const motionCanvasDefinition: ServiceDefinition = {
	id: "motion-canvas",
	name: "Motion Canvas",
	description:
		"TypeScript library for creating animated videos using code, featuring a visual editor for real-time preview and timeline scrubbing.",
	category: "media",
	icon: "✨",

	image: "motion-canvas/studio",
	imageTag: "3.17.2",
	ports: [
		{
			host: 9010,
			container: 9000,
			description: "Motion Canvas Studio web interface",
			exposed: true,
		},
	],
	volumes: [],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "MOTION_CANVAS_HOST",
			defaultValue: "motion-canvas",
			secret: false,
			description: "Motion Canvas hostname for OpenClaw",
			required: true,
		},
		{
			key: "MOTION_CANVAS_PORT",
			defaultValue: "9000",
			secret: false,
			description: "Motion Canvas port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://motioncanvas.io/docs/",
	tags: ["animation", "typescript", "video", "motion-graphics"],
	maturity: "experimental",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
