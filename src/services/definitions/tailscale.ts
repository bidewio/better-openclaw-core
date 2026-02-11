import type { ServiceDefinition } from "../../types.js";

export const tailscaleDefinition: ServiceDefinition = {
	id: "tailscale",
	name: "Tailscale",
	description:
		"Zero-config VPN and secure mesh network for private access to your stack. Uses WireGuard; connect devices and users without opening ports.",
	category: "dev-tools",
	icon: "🔒",

	image: "tailscale/tailscale",
	imageTag: "latest",
	ports: [],
	volumes: [
		{
			name: "tailscale-state",
			containerPath: "/var/lib",
			description: "Tailscale state and identity",
		},
	],
	environment: [
		{
			key: "TS_AUTHKEY",
			defaultValue: "",
			secret: true,
			description: "Auth key for headless login (create at admin.tailscale.com)",
			required: true,
		},
		{
			key: "TS_HOSTNAME",
			defaultValue: "openclaw-tailscale",
			secret: false,
			description: "Hostname for this node in the Tailscale network",
			required: false,
		},
		{
			key: "TS_ACCEPT_DNS",
			defaultValue: "true",
			secret: false,
			description: "Accept DNS configuration from Tailscale",
			required: false,
		},
		{
			key: "TS_AUTH_ONCE",
			defaultValue: "true",
			secret: false,
			description: "Exit after initial auth (for ephemeral nodes)",
			required: false,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://tailscale.com/kb/1282/docker",
	tags: ["vpn", "wireguard", "networking", "secure-access"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],
	mandatory: true,
	removalWarning:
		"Tailscale provides secure VPN access to your stack via WireGuard. Without it, services will be directly exposed to the network and accessible without authentication.",

	minMemoryMB: 64,
	gpuRequired: false,
};
