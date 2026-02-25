import type { ServiceDefinition } from "../../types.js";

export const calComDefinition: ServiceDefinition = {
	id: "cal-com",
	name: "Cal.com",
	description:
		"Open-source scheduling platform for appointments, meetings, and booking management with calendar integrations and customizable workflows.",
	category: "automation",
	icon: "📅",

	image: "calcom/cal.com",
	imageTag: "v2.6.1",
	ports: [
		{
			host: 3005,
			container: 3000,
			description: "Cal.com web UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://calcom:${CALCOM_DB_PASSWORD}@postgresql:5432/calcom",
			secret: true,
			description: "PostgreSQL connection URL for Cal.com",
			required: true,
		},
		{
			key: "NEXTAUTH_SECRET",
			defaultValue: "",
			secret: true,
			description: "NextAuth.js session encryption secret",
			required: true,
		},
		{
			key: "CALENDSO_ENCRYPTION_KEY",
			defaultValue: "",
			secret: true,
			description: "Encryption key for calendar data at rest",
			required: true,
		},
		{
			key: "NEXT_PUBLIC_WEBAPP_URL",
			defaultValue: "http://localhost:3005",
			secret: false,
			description: "Public URL of the Cal.com instance",
			required: true,
		},
	],
	healthcheck: {
		test: "wget -q --spider http://localhost:3000 || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "60s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "CALCOM_HOST",
			defaultValue: "cal-com",
			secret: false,
			description: "Cal.com hostname for OpenClaw",
			required: true,
		},
		{
			key: "CALCOM_PORT",
			defaultValue: "3000",
			secret: false,
			description: "Cal.com port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://cal.com/docs",
	tags: ["calendar", "scheduling", "booking", "appointments"],
	maturity: "beta",

	requires: ["postgresql"],
	recommends: ["redis"],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
