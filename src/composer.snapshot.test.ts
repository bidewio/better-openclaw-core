import { describe, expect, it } from "vitest";
import { composeMultiFile } from "./composer.js";
import { resolve } from "./resolver.js";

function generateForPreset(services: string[], skillPacks: string[] = []) {
	const resolved = resolve({ services, skillPacks });
	return composeMultiFile(resolved, {
		projectName: "test-stack",
		proxy: "none",
		gpu: false,
		platform: "linux/amd64",
		deployment: "local",
		openclawVersion: "latest",
	});
}

describe("compose snapshot tests", () => {
	it("minimal preset (redis only)", () => {
		const result = generateForPreset(["redis"]);
		expect(result.files["docker-compose.yml"]).toMatchSnapshot();
	});

	it("creator preset (ffmpeg + remotion + minio + redis)", () => {
		const result = generateForPreset(["ffmpeg", "remotion", "minio", "redis"], ["video-creator"]);
		expect(result.files["docker-compose.yml"]).toMatchSnapshot();
		if (result.files["docker-compose.media.yml"]) {
			expect(result.files["docker-compose.media.yml"]).toMatchSnapshot();
		}
	});

	it("researcher preset (qdrant + searxng + browserless + redis)", () => {
		const result = generateForPreset(
			["qdrant", "searxng", "browserless", "redis"],
			["research-agent"],
		);
		expect(result.files["docker-compose.yml"]).toMatchSnapshot();
	});

	it("devops preset (n8n + postgresql + redis + monitoring)", () => {
		const result = generateForPreset(
			["n8n", "postgresql", "redis", "uptime-kuma", "grafana", "prometheus"],
			["dev-ops"],
		);
		expect(result.files["docker-compose.yml"]).toMatchSnapshot();
		if (result.files["docker-compose.monitoring.yml"]) {
			expect(result.files["docker-compose.monitoring.yml"]).toMatchSnapshot();
		}
	});

	it("full preset (many services)", () => {
		const result = generateForPreset([
			"redis",
			"postgresql",
			"qdrant",
			"n8n",
			"ffmpeg",
			"remotion",
			"minio",
			"caddy",
			"browserless",
			"searxng",
			"meilisearch",
			"uptime-kuma",
			"grafana",
			"prometheus",
			"ollama",
			"whisper",
			"gotify",
		]);
		expect(result.files["docker-compose.yml"]).toMatchSnapshot();
		expect(result.profiles.length).toBeGreaterThan(0);
		// Verify multiple compose files were created
		expect(Object.keys(result.files).length).toBeGreaterThan(1);
	});

	it("multi-file output has correct profile assignments", () => {
		const result = generateForPreset(["redis", "ollama", "open-webui", "grafana", "prometheus"]);
		// AI services should be in the ai profile file
		if (result.files["docker-compose.ai.yml"]) {
			expect(result.files["docker-compose.ai.yml"]).toContain("profiles:");
		}
		// Monitoring should be in the monitoring profile file
		if (result.files["docker-compose.monitoring.yml"]) {
			expect(result.files["docker-compose.monitoring.yml"]).toContain("profiles:");
		}
	});
});
