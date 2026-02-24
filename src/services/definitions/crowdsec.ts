import type { ServiceDefinition } from "../../types.js";

export const crowdsecDefinition: ServiceDefinition = {
	id: "crowdsec",
	name: "CrowdSec",
	description:
		"Free, open-source and collaborative IPS designed to protect servers, services, and containers.",
	category: "security",
	icon: "⚔️",

	image: "crowdsecurity/crowdsec",
	imageTag: "latest",
	ports: [
		{
			host: 8080,
			container: 8080,
			description: "CrowdSec Local API Interface",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "crowdsec_data",
			containerPath: "/v/lib/crowdsec/data",
			description: "CrowdSec persistent SQLite data",
		},
		{
			name: "crowdsec_config",
			containerPath: "/etc/crowdsec",
			description: "CrowdSec configurations",
		},
	],
	environment: [
		{
			key: "COLLECTIONS",
			defaultValue: "crowdsecurity/linux crowdsecurity/sshd",
			secret: false,
			description: "Default collections to install",
			required: false,
		},
	],
	healthcheck: {
		test: "cscli metrics || exit 1",
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

	docsUrl: "https://docs.crowdsec.net/",
	tags: ["ips", "ids", "firewall", "security", "threat-intelligence"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
