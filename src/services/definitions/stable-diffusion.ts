import type { ServiceDefinition } from "../../types.js";

export const stableDiffusionDefinition: ServiceDefinition = {
	id: "stable-diffusion",
	name: "Stable Diffusion WebUI",
	description: "Local AI image generation with a web interface. Generate images from text prompts.",
	category: "ai",
	icon: "🎨",

	image: "ghcr.io/stable-diffusion-webui/stable-diffusion-webui",
	imageTag: "latest",
	ports: [
		{
			host: 7860,
			container: 7860,
			description: "Stable Diffusion WebUI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "sd-models",
			containerPath: "/models",
			description: "Stable Diffusion model checkpoint files",
		},
		{
			name: "sd-outputs",
			containerPath: "/outputs",
			description: "Generated images and output files",
		},
	],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
	tags: ["image-generation", "ai-art", "stable-diffusion", "text-to-image"],
	maturity: "experimental",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 4096,
	gpuRequired: true,
};
