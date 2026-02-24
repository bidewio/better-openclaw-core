import type { ServiceDefinition } from "../../types.js";

export const authentikDefinition: ServiceDefinition = {
	id: "authentik",
	name: "Authentik",
	description: "The open-source Identity Provider that unifies your identity infrastructure.",
	category: "security",
	icon: "🛡️",

	image: "ghcr.io/goauthentik/server",
	imageTag: "latest",
	ports: [
		{
			host: 9000,
			container: 9000,
			description: "Authentik HTTP Interface",
			exposed: true,
		},
		{
			host: 9443,
			container: 9443,
			description: "Authentik HTTPS Interface",
			exposed: false,
		},
	],
	volumes: [
		{
			name: "authentik_media",
			containerPath: "/media",
			description: "Authentik media storage",
		},
		{
			name: "authentik_custom_templates",
			containerPath: "/templates",
			description: "Authentik custom templates",
		},
	],
	environment: [
		{
			key: "AUTHENTIK_REDIS__HOST",
			defaultValue: "redis",
			secret: false,
			description: "Redis server hostname",
			required: true,
		},
		{
			key: "AUTHENTIK_POSTGRESQL__HOST",
			defaultValue: "postgres",
			secret: false,
			description: "Postgres database hostname",
			required: true,
		},
		{
			key: "AUTHENTIK_POSTGRESQL__USER",
			defaultValue: "postgres",
			secret: false,
			description: "Postgres database user",
			required: true,
		},
		{
			key: "AUTHENTIK_POSTGRESQL__NAME",
			defaultValue: "authentik",
			secret: false,
			description: "Postgres database name",
			required: true,
		},
		{
			key: "AUTHENTIK_POSTGRESQL__PASSWORD",
			defaultValue: "postgres",
			secret: true,
			description: "Postgres database password",
			required: true,
		},
		{
			key: "AUTHENTIK_SECRET_KEY",
			defaultValue: "authentik_secret_replace_me_in_production",
			secret: true,
			description: "Secret key used for cookie signing",
			required: true,
		},
	],
	healthcheck: {
		test: "curl --fail http://localhost:9000/-/health/live/ || exit 1",
		interval: "30s",
		timeout: "5s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: ["postgresql", "redis"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.goauthentik.io/",
	tags: ["identity", "sso", "saml", "oidc", "oauth2", "security"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 2048,
	gpuRequired: false,
};
