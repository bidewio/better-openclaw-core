import type { ServiceDefinition } from "../../types.js";

export const litellmDefinition: ServiceDefinition = {
	id: "litellm",
	name: "LiteLLM Proxy",
	description:
		"Unified gateway for 100+ LLM providers with load balancing, fallbacks, spend tracking, and caching.",
	category: "ai-platform",
	icon: "🔀",

	image: "ghcr.io/berriai/litellm",
	imageTag: "v1.81.12-stable.1",
	ports: [
		{
			host: 4000,
			container: 4000,
			description: "LiteLLM Proxy API",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "LITELLM_MASTER_KEY",
			defaultValue: "",
			secret: true,
			description: "LiteLLM admin API key",
			required: true,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.litellm.ai/",
	tags: ["llm-proxy", "gateway", "load-balancing", "multi-model", "caching"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
