import type { ServiceDefinition } from "../../types.js";

export const comfyuiDefinition: ServiceDefinition = {
	id: "comfyui",
	name: "ComfyUI",
	description:
		"Node-based visual workflow editor for Stable Diffusion and other generative AI models. Design complex image/video generation pipelines with a drag-and-drop graph UI and a powerful REST API.",
	category: "ai",
	icon: "🎨",

	image: "ghcr.io/ai-dock/comfyui",
	imageTag: "latest",
	ports: [
		{
			host: 8188,
			container: 8188,
			description: "ComfyUI Web UI & API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "comfyui-models",
			containerPath: "/opt/ComfyUI/models",
			description: "Model checkpoint, LoRA, VAE, and ControlNet files",
		},
		{
			name: "comfyui-output",
			containerPath: "/opt/ComfyUI/output",
			description: "Generated images and output files",
		},
		{
			name: "comfyui-custom-nodes",
			containerPath: "/opt/ComfyUI/custom_nodes",
			description: "Community custom node extensions",
		},
	],
	environment: [],
	healthcheck: {
		test: "curl -f http://localhost:8188/system_stats || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "60s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [{ skillId: "comfyui-generate", autoInstall: true }],
	openclawEnvVars: [
		{
			key: "COMFYUI_HOST",
			defaultValue: "comfyui",
			secret: false,
			description: "ComfyUI hostname for OpenClaw",
			required: true,
		},
		{
			key: "COMFYUI_PORT",
			defaultValue: "8188",
			secret: false,
			description: "ComfyUI API port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://github.com/comfyanonymous/ComfyUI",
	selfHostedDocsUrl: "https://github.com/comfyanonymous/ComfyUI",
	tags: [
		"image-generation",
		"ai-art",
		"stable-diffusion",
		"workflow",
		"node-editor",
		"text-to-image",
		"comfyui",
	],
	maturity: "experimental",

	requires: [],
	recommends: ["ollama"],
	conflictsWith: [],

	removalWarning:
		"⚠️ GPU INFRASTRUCTURE REQUIRED: ComfyUI requires an NVIDIA GPU with CUDA support and the NVIDIA Container Toolkit (nvidia-docker2) installed on the host. Without GPU acceleration, image generation will be extremely slow (minutes per image). Ensure your deployment target has adequate GPU resources (minimum 4 GB VRAM, 8 GB+ recommended) before adding this service.",

	minMemoryMB: 4096,
	gpuRequired: true,
};
