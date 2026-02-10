import type { ServiceDefinition } from "../../types.js";

export const whisperDefinition: ServiceDefinition = {
	id: "whisper",
	name: "Faster Whisper Server",
	description:
		"Self-hosted speech-to-text transcription service using the Faster Whisper engine for high-performance audio transcription.",
	category: "ai",
	icon: "🎙️",

	image: "fedirz/faster-whisper-server",
	imageTag: "latest",
	ports: [
		{
			host: 8001,
			container: 8000,
			description: "Whisper transcription API",
			exposed: true,
		},
	],
	volumes: [],
	environment: [],
	healthcheck: {
		test: "wget -q --spider http://localhost:8000/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [{ skillId: "whisper-transcribe", autoInstall: true }],
	openclawEnvVars: [
		{
			key: "WHISPER_HOST",
			defaultValue: "whisper",
			secret: false,
			description: "Whisper hostname for OpenClaw",
			required: true,
		},
		{
			key: "WHISPER_PORT",
			defaultValue: "8000",
			secret: false,
			description: "Whisper port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://github.com/fedirz/faster-whisper-server",
	tags: ["speech-to-text", "transcription", "audio", "whisper"],
	maturity: "beta",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
