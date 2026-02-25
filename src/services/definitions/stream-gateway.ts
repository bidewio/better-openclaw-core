import type { ServiceDefinition } from "../../types.js";

export const streamGatewayDefinition: ServiceDefinition = {
	id: "stream-gateway",
	name: "Stream Gateway",
	description:
		"NGINX-RTMP relay server that receives a local RTMP stream (e.g. from OBS in the desktop-environment) and fans it out to YouTube, Twitch, TikTok, and Telegram simultaneously. Also serves an HLS preview on HTTP for local viewing.",
	category: "streaming",
	icon: "📺",

	image: "tiangolo/nginx-rtmp",
	imageTag: "latest-2026-02-23",
	ports: [
		{
			host: 1935,
			container: 1935,
			description: "RTMP ingest (receives stream from OBS or ffmpeg)",
			exposed: true,
		},
		{
			host: 8080,
			container: 8080,
			description: "HTTP server for HLS preview and stats",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "stream-gateway-hls",
			containerPath: "/tmp/hls",
			description: "HLS segment storage for live preview playback",
		},
	],
	environment: [
		{
			key: "YOUTUBE_STREAM_KEY",
			defaultValue: "",
			secret: true,
			description: "YouTube Live stream key (leave empty to skip YouTube relay)",
			required: false,
		},
		{
			key: "TWITCH_STREAM_KEY",
			defaultValue: "",
			secret: true,
			description: "Twitch stream key (leave empty to skip Twitch relay)",
			required: false,
		},
		{
			key: "TIKTOK_STREAM_URL",
			defaultValue: "",
			secret: true,
			description: "Full TikTok RTMP URL from TikTok Studio (leave empty to skip TikTok relay)",
			required: false,
		},
		{
			key: "TELEGRAM_STREAM_URL",
			defaultValue: "",
			secret: true,
			description:
				"Full Telegram RTMPS URL including stream key (leave empty to skip Telegram relay)",
			required: false,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8080/health || exit 1",
		interval: "15s",
		timeout: "5s",
		retries: 3,
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	deploy: {
		resources: {
			limits: { cpus: "2.0", memory: "2G" },
			reservations: { cpus: "0.5", memory: "512M" },
		},
	},

	skills: [],
	openclawEnvVars: [
		{
			key: "STREAM_GATEWAY_HOST",
			defaultValue: "stream-gateway",
			secret: false,
			description: "Hostname of the stream-gateway container",
			required: true,
		},
		{
			key: "STREAM_GATEWAY_RTMP_PORT",
			defaultValue: "1935",
			secret: false,
			description: "RTMP ingest port on the stream-gateway",
			required: true,
		},
		{
			key: "STREAM_GATEWAY_HLS_PORT",
			defaultValue: "8080",
			secret: false,
			description: "HTTP port for HLS preview on the stream-gateway",
			required: true,
		},
	],

	docsUrl: "https://github.com/tiangolo/nginx-rtmp-docker",
	tags: [
		"streaming",
		"rtmp",
		"hls",
		"relay",
		"youtube",
		"twitch",
		"tiktok",
		"telegram",
		"obs",
		"nginx",
	],
	maturity: "experimental",

	requires: [],
	recommends: ["desktop-environment"],
	conflictsWith: [],

	removalWarning:
		"⚠️ STREAMING KEYS REQUIRED: To relay to platforms you must provide at least one stream key. Without any keys configured the gateway will still accept RTMP input and serve HLS locally but nothing will be forwarded.",
	minMemoryMB: 512,
	gpuRequired: false,

	nativeSupported: true,
	nativeRecipes: [
		{
			platform: "linux",
			installSteps: [
				"command -v nginx >/dev/null 2>&1 || (command -v apt-get >/dev/null 2>&1 && sudo apt-get update -qq && sudo apt-get install -y -qq nginx libnginx-mod-rtmp ffmpeg)",
				"command -v nginx >/dev/null 2>&1 || (command -v dnf >/dev/null 2>&1 && sudo dnf install -y nginx nginx-mod-rtmp ffmpeg)",
			],
			startCommand: "sudo systemctl start nginx",
			stopCommand: "sudo systemctl stop nginx",
			configPath: "/etc/nginx/nginx.conf",
			configTemplate:
				'# Generated for OpenClaw bare-metal\nworker_processes auto;\nrtmp_auto_push on;\n\nevents { worker_connections 1024; }\n\nrtmp {\n  server {\n    listen 1935;\n    chunk_size 4096;\n    application live {\n      live on;\n      record off;\n      hls on;\n      hls_path /tmp/hls;\n      hls_fragment 3;\n      hls_playlist_length 60;\n    }\n  }\n}\n\nhttp {\n  server {\n    listen 8080;\n    location /hls { types { application/vnd.apple.mpegurl m3u8; video/mp2t ts; } root /tmp; add_header Cache-Control no-cache; }\n    location /health { return 200 "OK"; }\n  }\n}\n',
			systemdUnit: "nginx",
		},
	],
};
