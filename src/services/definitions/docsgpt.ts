import type { ServiceDefinition } from "../../types.js";

export const docsgptDefinition: ServiceDefinition = {
	id: "docsgpt",
	name: "DocsGPT",
	description: "AI-powered documentation assistant. Upload documents and chat with them using RAG.",
	category: "knowledge",
	icon: "📄",

	image: "arc53/docsgpt",
	imageTag: "latest",
	ports: [
		{
			host: 7071,
			container: 7091,
			description: "DocsGPT Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "docsgpt-data",
			containerPath: "/app/data",
			description: "DocsGPT uploaded documents and vector store data",
		},
	],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.docsgpt.cloud/",
	tags: ["documents", "rag", "qa", "ai-assistant", "knowledge"],
	maturity: "stable",

	requires: [],
	recommends: ["ollama"],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
