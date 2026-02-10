import type { ServiceDefinition } from "../../types.js";

export const lasuiteMeetBackendDefinition: ServiceDefinition = {
	id: "lasuite-meet-backend",
	name: "La Suite Meet (Backend)",
	description:
		"Django backend for La Suite Meet — open-source video conferencing from La Suite numérique. Handles API, auth, and room management.",
	category: "communication",
	icon: "📞",

	image: "lasuite/meet-backend",
	imageTag: "latest",
	ports: [
		{
			host: 8081,
			container: 8000,
			description: "Django backend API",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "DB_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL host",
			required: true,
		},
		{
			key: "DB_NAME",
			defaultValue: "meet",
			secret: false,
			description: "PostgreSQL database name",
			required: true,
		},
		{
			key: "DB_USER",
			defaultValue: "meet",
			secret: false,
			description: "PostgreSQL user",
			required: true,
		},
		{
			key: "DB_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "PostgreSQL password",
			required: true,
		},
		{
			key: "DB_PORT",
			defaultValue: "5432",
			secret: false,
			description: "PostgreSQL port",
			required: true,
		},
		{
			key: "DJANGO_SECRET_KEY",
			defaultValue: "",
			secret: true,
			description: "Django secret key",
			required: true,
		},
		{
			key: "DJANGO_SETTINGS_MODULE",
			defaultValue: "meet.settings",
			secret: false,
			description: "Django settings module",
			required: true,
		},
		{
			key: "DJANGO_ALLOWED_HOSTS",
			defaultValue: "localhost,backend",
			secret: false,
			description: "Comma-separated allowed hosts",
			required: true,
		},
		{
			key: "LIVEKIT_API_URL",
			defaultValue: "http://livekit:7880",
			secret: false,
			description: "LiveKit API URL (internal)",
			required: true,
		},
		{
			key: "LIVEKIT_API_KEY",
			defaultValue: "meet",
			secret: false,
			description: "LiveKit API key",
			required: true,
		},
		{
			key: "LIVEKIT_API_SECRET",
			defaultValue: "",
			secret: true,
			description: "LiveKit API secret",
			required: true,
		},
	],
	healthcheck: {
		test: "python manage.py check",
		interval: "15s",
		timeout: "30s",
		retries: 20,
		startPeriod: "10s",
	},
	dependsOn: ["postgresql", "redis", "livekit"],
	restartPolicy: "always",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://github.com/suitenumerique/meet",
	tags: ["lasuite", "meet", "video", "conferencing", "django"],
	maturity: "stable",

	requires: ["postgresql", "redis", "livekit"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
