import type { ServiceDefinition } from "../../types.js";

export const ffmpegDefinition: ServiceDefinition = {
	id: "ffmpeg",
	name: "FFmpeg Sidecar",
	description:
		"FFmpeg sidecar container for media processing, transcoding, and format conversion. Runs as a long-lived sidecar sharing a volume with OpenClaw.",
	category: "media",
	icon: "🎬",

	image: "linuxserver/ffmpeg",
	imageTag: "8.0.1-cli-ls58",
	ports: [],
	volumes: [
		{
			name: "ffmpeg-shared",
			containerPath: "/data",
			description: "Shared volume with OpenClaw for media files",
		},
	],
	environment: [
		{
			key: "PUID",
			defaultValue: "1000",
			secret: false,
			description: "User ID for file permissions",
			required: true,
		},
		{
			key: "PGID",
			defaultValue: "1000",
			secret: false,
			description: "Group ID for file permissions",
			required: true,
		},
	],
	command: "tail -f /dev/null",
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [{ skillId: "ffmpeg-process", autoInstall: true }],
	openclawEnvVars: [
		{
			key: "FFMPEG_SHARED_DIR",
			defaultValue: "/home/node/.openclaw/workspace/media",
			secret: false,
			description: "Shared media directory path inside the OpenClaw container",
			required: true,
		},
	],
	openclawVolumeMounts: [
		{
			name: "ffmpeg-shared",
			containerPath: "/home/node/.openclaw/workspace/media",
			description: "Shared media volume with FFmpeg",
		},
	],

	docsUrl: "https://ffmpeg.org/documentation.html",
	tags: ["video", "audio", "transcoding", "media-processing"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
