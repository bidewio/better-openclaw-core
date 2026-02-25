import type { ServiceDefinition } from "../../types.js";

export const remotionDefinition: ServiceDefinition = {
	id: "remotion",
	name: "Remotion Studio",
	description:
		"Programmatic video creation framework for React that lets you create motion graphics and render videos using code.",
	category: "media",
	icon: "🎥",

	image: "remotion-dev/studio",
	imageTag: "4",
	ports: [
		{
			host: 3020,
			container: 3000,
			description: "Remotion Studio web interface",
			exposed: true,
		},
	],
	volumes: [],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [{ skillId: "remotion-render", autoInstall: true }],
	openclawEnvVars: [
		{
			key: "REMOTION_HOST",
			defaultValue: "remotion",
			secret: false,
			description: "Remotion hostname for OpenClaw",
			required: true,
		},
		{
			key: "REMOTION_PORT",
			defaultValue: "3000",
			secret: false,
			description: "Remotion port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://www.remotion.dev/docs/",
	tags: ["video", "react", "motion-graphics", "rendering"],
	maturity: "beta",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
