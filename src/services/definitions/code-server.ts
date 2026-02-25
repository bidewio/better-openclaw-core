import type { ServiceDefinition } from "../../types.js";

export const codeServerDefinition: ServiceDefinition = {
	id: "code-server",
	name: "code-server",
	description: "Run VS Code in the browser. Full IDE experience accessible from anywhere.",
	category: "dev-tools",
	icon: "🖥️",

	image: "lscr.io/linuxserver/code-server",
	imageTag: "4.96.4",
	ports: [
		{
			host: 8443,
			container: 8443,
			description: "code-server Web IDE",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "code-server-config",
			containerPath: "/config",
			description: "code-server config and extensions",
		},
	],
	environment: [
		{
			key: "PASSWORD",
			defaultValue: "",
			secret: true,
			description: "code-server login password",
			required: true,
		},
		{
			key: "PUID",
			defaultValue: "1000",
			secret: false,
			description: "User ID",
			required: false,
		},
		{
			key: "PGID",
			defaultValue: "1000",
			secret: false,
			description: "Group ID",
			required: false,
		},
	],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://coder.com/docs/code-server/latest",
	tags: ["ide", "vscode", "browser", "remote-development"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
