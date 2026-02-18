import type { ServiceDefinition } from "../../types.js";

export const xyopsDefinition: ServiceDefinition = {
	id: "xyops",
	name: "xyOps",
	description:
		"Job scheduling, workflow automation, server monitoring, alerting, and incident response platform with a visual workflow editor and fleet management.",
	category: "automation",
	icon: "⚙️",

	image: "ghcr.io/pixlcore/xyops",
	imageTag: "latest",
	ports: [
		{
			host: 5522,
			container: 5522,
			description: "xyOps web interface",
			exposed: true,
		},
		{
			host: 5523,
			container: 5523,
			description: "xyOps secondary service",
			exposed: false,
		},
	],
	volumes: [
		{
			name: "xyops-data",
			containerPath: "/opt/xyops/data",
			description: "Persistent xyOps data and configuration",
		},
		{
			name: "/var/run/docker.sock",
			containerPath: "/var/run/docker.sock",
			description: "Docker socket for container management",
		},
	],
	environment: [
		{
			key: "TZ",
			defaultValue: "UTC",
			secret: false,
			description: "Timezone for xyOps",
			required: false,
		},
		{
			key: "XYOPS_xysat_local",
			defaultValue: "1",
			secret: false,
			description: "Enable local satellite mode for monitoring the host",
			required: false,
		},
	],
	healthcheck: {
		test: "wget -q --spider http://localhost:5522 || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "XYOPS_HOST",
			defaultValue: "xyops",
			secret: false,
			description: "xyOps hostname for OpenClaw",
			required: true,
		},
		{
			key: "XYOPS_PORT",
			defaultValue: "5522",
			secret: false,
			description: "xyOps port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://github.com/pixlcore/xyops",
	tags: ["scheduling", "automation", "monitoring", "alerting", "incident-response", "workflow"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
