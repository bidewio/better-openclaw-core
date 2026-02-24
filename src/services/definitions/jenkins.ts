import type { ServiceDefinition } from "../../types.js";

export const jenkinsDefinition: ServiceDefinition = {
	id: "jenkins",
	name: "Jenkins",
	description:
		"The leading open source automation server, Jenkins provides hundreds of plugins to support building, deploying and automating any project.",
	category: "dev-tools",
	icon: "🏗️",

	image: "jenkins/jenkins",
	imageTag: "lts",
	ports: [
		{
			host: 8080,
			container: 8080,
			description: "Jenkins Web Interface",
			exposed: true,
		},
		{
			host: 50000,
			container: 50000,
			description: "Jenkins inbound agent port",
			exposed: false,
		},
	],
	volumes: [
		{
			name: "jenkins_home",
			containerPath: "/var/jenkins_home",
			description: "Persistent Jenkins home directory",
		},
	],
	environment: [
		{
			key: "JAVA_OPTS",
			defaultValue: "-Djenkins.install.runSetupWizard=false",
			secret: false,
			description: "Optional setup wrapper arguments",
			required: false,
		},
	],
	healthcheck: {
		test: "curl --fail http://localhost:8080/login || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "60s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://www.jenkins.io/doc/",
	tags: ["ci-cd", "automation", "build", "pipeline"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
