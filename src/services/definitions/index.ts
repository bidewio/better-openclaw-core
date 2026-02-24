export { anythingLlmDefinition } from "./anything-llm.js";
export { appflowyDefinition } from "./appflowy.js";
export { beszelDefinition } from "./beszel.js";
export { browserlessDefinition } from "./browserless.js";
export { caddyDefinition } from "./caddy.js";
export { calComDefinition } from "./cal-com.js";
export { chromadbDefinition } from "./chromadb.js";
export { claudeCodeDefinition } from "./claude-code.js";
export { codeServerDefinition } from "./code-server.js";
export { codexDefinition } from "./codex.js";
export { comfyuiDefinition } from "./comfyui.js";
export { convexDefinition } from "./convex.js";
export { convexDashboardDefinition } from "./convex-dashboard.js";
export { coolifyDefinition } from "./coolify.js";
export { desktopEnvironmentDefinition } from "./desktop-environment.js";
export { difyDefinition } from "./dify.js";
export { docsgptDefinition } from "./docsgpt.js";
export { dokployDefinition } from "./dokploy.js";
export { dozzleDefinition } from "./dozzle.js";
export { ffmpegDefinition } from "./ffmpeg.js";
export { flowiseDefinition } from "./flowise.js";
export { geminiCliDefinition } from "./gemini-cli.js";
export { giteaDefinition } from "./gitea.js";
export { gotifyDefinition } from "./gotify.js";
export { grafanaDefinition } from "./grafana.js";
export { kimiDefinition } from "./kimi.js";
export { lasuiteMeetAgentsDefinition } from "./lasuite-meet-agents.js";
export { lasuiteMeetBackendDefinition } from "./lasuite-meet-backend.js";
export { lasuiteMeetFrontendDefinition } from "./lasuite-meet-frontend.js";
export { librechatDefinition } from "./librechat.js";
export { lightpandaDefinition } from "./lightpanda.js";
export { litellmDefinition } from "./litellm.js";
export { livekitDefinition } from "./livekit.js";
export { matomoDefinition } from "./matomo.js";
export { matrixSynapseDefinition } from "./matrix-synapse.js";
export { mattermostDefinition } from "./mattermost.js";
export { meilisearchDefinition } from "./meilisearch.js";
export { minioDefinition } from "./minio.js";
export { missionControlDefinition } from "./mission-control.js";
export { mixpostDefinition } from "./mixpost.js";
export { motionCanvasDefinition } from "./motion-canvas.js";
export { n8nDefinition } from "./n8n.js";
export { neo4jDefinition } from "./neo4j.js";
export { nocodbDefinition } from "./nocodb.js";
export { ntfyDefinition } from "./ntfy.js";
export { ollamaDefinition } from "./ollama.js";
export { openWebuiDefinition } from "./open-webui.js";
export { opencodeDefinition } from "./opencode.js";
export { openpanelDefinition } from "./openpanel.js";
export { outlineDefinition } from "./outline.js";
export { paperlessNgxDefinition } from "./paperless-ngx.js";
export { playwrightServerDefinition } from "./playwright-server.js";
export { portainerDefinition } from "./portainer.js";
export { postgresqlDefinition } from "./postgresql.js";
export { postizDefinition } from "./postiz.js";
export { prometheusDefinition } from "./prometheus.js";
export { qdrantDefinition } from "./qdrant.js";
export { redisDefinition } from "./redis.js";
export { remotionDefinition } from "./remotion.js";
export { rocketchatDefinition } from "./rocketchat.js";
export { scraplingDefinition } from "./scrapling.js";
export { searxngDefinition } from "./searxng.js";
export { stableDiffusionDefinition } from "./stable-diffusion.js";
export { steelBrowserDefinition } from "./steel-browser.js";
export { streamGatewayDefinition } from "./stream-gateway.js";
export { tailscaleDefinition } from "./tailscale.js";
export { temporalDefinition } from "./temporal.js";
export { traefikDefinition } from "./traefik.js";
export { umamiDefinition } from "./umami.js";
export { uptimeKumaDefinition } from "./uptime-kuma.js";
export { usesendDefinition } from "./usesend.js";
export { valkeyDefinition } from "./valkey.js";
export { watchtowerDefinition } from "./watchtower.js";
export { weaviateDefinition } from "./weaviate.js";
export { whisperDefinition } from "./whisper.js";
export { xyopsDefinition } from "./xyops.js";

import type { ServiceDefinition } from "../../types.js";
import { anythingLlmDefinition } from "./anything-llm.js";
import { appflowyDefinition } from "./appflowy.js";
import { beszelDefinition } from "./beszel.js";
import { browserlessDefinition } from "./browserless.js";
import { caddyDefinition } from "./caddy.js";
import { calComDefinition } from "./cal-com.js";
import { chromadbDefinition } from "./chromadb.js";
import { claudeCodeDefinition } from "./claude-code.js";
import { codeServerDefinition } from "./code-server.js";
import { codexDefinition } from "./codex.js";
import { comfyuiDefinition } from "./comfyui.js";
import { convexDefinition } from "./convex.js";
import { convexDashboardDefinition } from "./convex-dashboard.js";
import { coolifyDefinition } from "./coolify.js";
import { desktopEnvironmentDefinition } from "./desktop-environment.js";
import { difyDefinition } from "./dify.js";
import { docsgptDefinition } from "./docsgpt.js";
import { dokployDefinition } from "./dokploy.js";
import { dozzleDefinition } from "./dozzle.js";
import { ffmpegDefinition } from "./ffmpeg.js";
import { flowiseDefinition } from "./flowise.js";
import { geminiCliDefinition } from "./gemini-cli.js";
import { giteaDefinition } from "./gitea.js";
import { gotifyDefinition } from "./gotify.js";
import { grafanaDefinition } from "./grafana.js";
import { kimiDefinition } from "./kimi.js";
import { lasuiteMeetAgentsDefinition } from "./lasuite-meet-agents.js";
import { lasuiteMeetBackendDefinition } from "./lasuite-meet-backend.js";
import { lasuiteMeetFrontendDefinition } from "./lasuite-meet-frontend.js";
import { librechatDefinition } from "./librechat.js";
import { lightpandaDefinition } from "./lightpanda.js";
import { litellmDefinition } from "./litellm.js";
import { livekitDefinition } from "./livekit.js";
import { matomoDefinition } from "./matomo.js";
import { matrixSynapseDefinition } from "./matrix-synapse.js";
import { mattermostDefinition } from "./mattermost.js";
import { meilisearchDefinition } from "./meilisearch.js";
import { minioDefinition } from "./minio.js";
import { missionControlDefinition } from "./mission-control.js";
import { mixpostDefinition } from "./mixpost.js";
import { motionCanvasDefinition } from "./motion-canvas.js";
import { n8nDefinition } from "./n8n.js";
import { neo4jDefinition } from "./neo4j.js";
import { nocodbDefinition } from "./nocodb.js";
import { ntfyDefinition } from "./ntfy.js";
import { ollamaDefinition } from "./ollama.js";
import { openWebuiDefinition } from "./open-webui.js";
import { opencodeDefinition } from "./opencode.js";
import { openpanelDefinition } from "./openpanel.js";
import { outlineDefinition } from "./outline.js";
import { paperlessNgxDefinition } from "./paperless-ngx.js";
import { playwrightServerDefinition } from "./playwright-server.js";
import { portainerDefinition } from "./portainer.js";
import { postgresqlDefinition } from "./postgresql.js";
import { postizDefinition } from "./postiz.js";
import { prometheusDefinition } from "./prometheus.js";
import { qdrantDefinition } from "./qdrant.js";
import { redisDefinition } from "./redis.js";
import { remotionDefinition } from "./remotion.js";
import { rocketchatDefinition } from "./rocketchat.js";
import { scraplingDefinition } from "./scrapling.js";
import { searxngDefinition } from "./searxng.js";
import { stableDiffusionDefinition } from "./stable-diffusion.js";
import { steelBrowserDefinition } from "./steel-browser.js";
import { streamGatewayDefinition } from "./stream-gateway.js";
import { tailscaleDefinition } from "./tailscale.js";
import { temporalDefinition } from "./temporal.js";
import { traefikDefinition } from "./traefik.js";
import { umamiDefinition } from "./umami.js";
import { uptimeKumaDefinition } from "./uptime-kuma.js";
import { usesendDefinition } from "./usesend.js";
import { valkeyDefinition } from "./valkey.js";
import { watchtowerDefinition } from "./watchtower.js";
import { weaviateDefinition } from "./weaviate.js";
import { whisperDefinition } from "./whisper.js";
import { xyopsDefinition } from "./xyops.js";

export const allServiceDefinitions: ServiceDefinition[] = [
	redisDefinition,
	qdrantDefinition,
	n8nDefinition,
	ffmpegDefinition,
	minioDefinition,
	postgresqlDefinition,
	caddyDefinition,
	traefikDefinition,
	uptimeKumaDefinition,
	grafanaDefinition,
	prometheusDefinition,
	browserlessDefinition,
	searxngDefinition,
	meilisearchDefinition,
	ollamaDefinition,
	whisperDefinition,
	chromadbDefinition,
	weaviateDefinition,
	valkeyDefinition,
	gotifyDefinition,
	ntfyDefinition,
	remotionDefinition,
	motionCanvasDefinition,
	temporalDefinition,
	outlineDefinition,
	docsgptDefinition,
	paperlessNgxDefinition,
	nocodbDefinition,
	appflowyDefinition,
	matrixSynapseDefinition,
	rocketchatDefinition,
	mattermostDefinition,
	stableDiffusionDefinition,
	comfyuiDefinition,
	playwrightServerDefinition,
	openWebuiDefinition,
	librechatDefinition,
	anythingLlmDefinition,
	difyDefinition,
	flowiseDefinition,
	litellmDefinition,
	giteaDefinition,
	codeServerDefinition,
	portainerDefinition,
	watchtowerDefinition,
	dozzleDefinition,
	beszelDefinition,
	convexDefinition,
	convexDashboardDefinition,
	claudeCodeDefinition,
	opencodeDefinition,
	codexDefinition,
	geminiCliDefinition,
	kimiDefinition,
	postizDefinition,
	mixpostDefinition,
	matomoDefinition,
	umamiDefinition,
	usesendDefinition,
	missionControlDefinition,
	openpanelDefinition,
	lightpandaDefinition,
	steelBrowserDefinition,
	coolifyDefinition,
	dokployDefinition,
	tailscaleDefinition,
	livekitDefinition,
	lasuiteMeetBackendDefinition,
	lasuiteMeetFrontendDefinition,
	lasuiteMeetAgentsDefinition,
	desktopEnvironmentDefinition,
	streamGatewayDefinition,
	neo4jDefinition,
	calComDefinition,
	xyopsDefinition,
	scraplingDefinition,
];
