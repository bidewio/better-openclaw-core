import type { ServiceDefinition } from "../../types.js";

export const livekitDefinition: ServiceDefinition = {
	id: "livekit",
	name: "LiveKit",
	description:
		"Real-time video and audio server for WebRTC. Powers video conferencing and live streaming; used by La Suite Meet. Bind-mount your livekit-server.yaml to /config.yaml.",
	category: "communication",
	icon: "📹",

	image: "livekit/livekit-server",
	imageTag: "latest",
	ports: [
		{ host: 7880, container: 7880, description: "LiveKit HTTP/API", exposed: true },
		{ host: 7881, container: 7881, description: "LiveKit TCP", exposed: true },
		{ host: 7882, container: 7882, description: "LiveKit UDP (RTP)", exposed: true },
	],
	volumes: [],
	environment: [],
	command: "--config /config.yaml",
	dependsOn: ["redis"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.livekit.io/",
	tags: ["webrtc", "video", "conferencing", "streaming", "lasuite"],
	maturity: "stable",

	requires: ["redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
