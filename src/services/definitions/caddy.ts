import type { ServiceDefinition } from "../../types.js";

export const caddyDefinition: ServiceDefinition = {
	id: "caddy",
	name: "Caddy",
	description:
		"Modern, fast reverse proxy and web server with automatic HTTPS via Let's Encrypt, HTTP/3 support, and simple configuration.",
	category: "proxy",
	icon: "🔒",

	image: "caddy",
	imageTag: "2-alpine",
	ports: [
		{
			host: 80,
			container: 80,
			description: "HTTP traffic",
			exposed: true,
		},
		{
			host: 443,
			container: 443,
			description: "HTTPS traffic",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "caddy-data",
			containerPath: "/data",
			description: "Caddy TLS certificates and persistent data",
		},
		{
			name: "caddy-config",
			containerPath: "/config",
			description: "Caddy configuration storage",
		},
	],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://caddyserver.com/docs/",
	tags: ["reverse-proxy", "auto-https", "ssl"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: ["traefik"],

	minMemoryMB: 64,
	gpuRequired: false,
};
