import type { ServiceDefinition } from "../../types.js";

export const signozDefinition: ServiceDefinition = {
	id: "signoz",
	name: "SigNoz",
	description: "Open-source observability platform serving as a lighter alternative to DataDog.",
	category: "monitoring",
	icon: "📈",

	image: "signoz/signoz-frontend",
	imageTag: "latest",
	ports: [
		{
			host: 3301,
			container: 3301,
			description: "SigNoz Web UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "FRONTEND_PUBLIC_TELEMETRY",
			defaultValue: "false",
			secret: false,
			description: "Enable anonymized usage telemetry",
			required: false,
		},
	],
	healthcheck: {
		test: "wget -q --spider http://localhost:3301 || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "15s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://signoz.io/docs/",
	tags: ["observability", "metrics", "traces", "logs", "opentelemetry"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
