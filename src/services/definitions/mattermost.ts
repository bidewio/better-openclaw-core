import type { ServiceDefinition } from "../../types.js";

export const mattermostDefinition: ServiceDefinition = {
	id: "mattermost",
	name: "Mattermost",
	description:
		"Open-source Slack alternative for team messaging, channels, integrations, and workflows.",
	category: "communication",
	icon: "💬",

	image: "mattermost/mattermost-team-edition",
	imageTag: "11.3.0-rc3",
	ports: [
		{
			host: 8065,
			container: 8065,
			description: "Mattermost Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "mattermost-data",
			containerPath: "/mattermost/data",
			description: "Mattermost persistent data and file uploads",
		},
		{
			name: "mattermost-config",
			containerPath: "/mattermost/config",
			description: "Mattermost server configuration files",
		},
	],
	environment: [
		{
			key: "MM_SQLSETTINGS_DRIVERNAME",
			defaultValue: "postgres",
			secret: false,
			description: "Database driver for Mattermost persistence",
			required: true,
		},
		{
			key: "MM_SQLSETTINGS_DATASOURCE",
			defaultValue:
				"postgres://mattermost:${MATTERMOST_DB_PASSWORD}@postgresql:5432/mattermost?sslmode=disable",
			secret: false,
			description: "PostgreSQL connection string for Mattermost",
			required: true,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.mattermost.com/",
	tags: ["team-chat", "messaging", "slack-alternative", "channels", "integrations"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
