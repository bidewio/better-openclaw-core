import type { ServiceDefinition } from "../../types.js";

export const supabaseDefinition: ServiceDefinition = {
	id: "supabase",
	name: "Supabase",
	description: "The open source Firebase alternative. Build production-grade backends instantly.",
	category: "database",
	icon: "⚡",

	image: "supabase/studio",
	imageTag: "2026.02.16-sha-26c615c",
	ports: [
		{
			host: 3000,
			container: 3000,
			description: "Supabase Studio Web Dashboard",
			exposed: true,
		},
		{
			host: 8000,
			container: 8000,
			description: "Supabase API Gateway",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "supabase_db",
			containerPath: "/var/lib/postgresql/data",
			description: "Supabase Postgres database storage",
		},
	],
	environment: [
		{
			key: "STUDIO_DEFAULT_ORGANIZATION",
			defaultValue: "Default Organization",
			secret: false,
			description: "Default organization name",
			required: false,
		},
		{
			key: "STUDIO_DEFAULT_PROJECT",
			defaultValue: "Default Project",
			secret: false,
			description: "Default project name",
			required: false,
		},
	],
	healthcheck: {
		test: "wget -q --spider http://localhost:3000/api/profile || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://supabase.com/docs/guides/self-hosting",
	tags: ["database", "auth", "storage", "realtime", "edge-functions"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 2048,
	gpuRequired: false,
};
