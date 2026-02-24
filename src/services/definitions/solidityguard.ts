import type { ServiceDefinition } from "../../types.js";

export const solidityGuardDefinition: ServiceDefinition = {
	id: "solidityguard",
	name: "SolidityGuard",
	description: "7-Phase Deep Audit Smart Contract Security Auditor for EVM/Solidity.",
	category: "security",
	icon: "🛡️",

	image: "altresearch/solidityguard", // Presumed standard dockerhub naming format, usually ghcr.io or dockerhub
	imageTag: "latest",
	ports: [
		{
			host: 8000,
			container: 8000,
			description: "SolidityGuard Web Dashboard",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "./contracts",
			containerPath: "/audit",
			description: "Mounts local contracts for CLI deep auditing.",
		},
	],
	environment: [],
	command: "web", // Presumed default startup command for the web UI if no CLI args are given
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [{ skillId: "solidityguard-audit", autoInstall: true }],
	openclawEnvVars: [],

	docsUrl: "https://solidityguard.org",
	tags: ["security", "web3", "solidity", "evm", "audit"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 2048,
	gpuRequired: false,
};
