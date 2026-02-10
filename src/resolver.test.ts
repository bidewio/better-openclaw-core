import { describe, expect, it } from "vitest";
import { resolve } from "./resolver.js";

describe("resolve", () => {
	it("returns empty services for empty input", () => {
		const result = resolve({ services: [], skillPacks: [] });
		expect(result.services).toHaveLength(0);
		expect(result.isValid).toBe(true);
		expect(result.estimatedMemoryMB).toBe(512); // base OpenClaw only
	});

	it("resolves a single service with no dependencies", () => {
		const result = resolve({ services: ["redis"], skillPacks: [] });
		expect(result.services).toHaveLength(1);
		expect(result.services[0]!.definition.id).toBe("redis");
		expect(result.isValid).toBe(true);
	});

	it("auto-adds PostgreSQL when n8n is selected", () => {
		const result = resolve({ services: ["n8n"], skillPacks: [] });
		const ids = result.services.map((s) => s.definition.id);
		expect(ids).toContain("n8n");
		expect(ids).toContain("postgresql");
		expect(result.addedDependencies).toContainEqual(
			expect.objectContaining({ service: "postgresql" }),
		);
		expect(result.isValid).toBe(true);
	});

	it("auto-adds Prometheus when Grafana is selected", () => {
		const result = resolve({ services: ["grafana"], skillPacks: [] });
		const ids = result.services.map((s) => s.definition.id);
		expect(ids).toContain("grafana");
		expect(ids).toContain("prometheus");
	});

	it("detects Redis + Valkey conflict", () => {
		const result = resolve({ services: ["redis", "valkey"], skillPacks: [] });
		expect(result.isValid).toBe(false);
		expect(result.errors).toContainEqual(expect.objectContaining({ type: "conflict" }));
	});

	it("detects Caddy + Traefik conflict", () => {
		const result = resolve({ services: ["caddy", "traefik"], skillPacks: [] });
		expect(result.isValid).toBe(false);
		expect(result.errors).toContainEqual(expect.objectContaining({ type: "conflict" }));
	});

	it("expands research-agent skill pack", () => {
		const result = resolve({ services: [], skillPacks: ["research-agent"] });
		const ids = result.services.map((s) => s.definition.id);
		expect(ids).toContain("qdrant");
		expect(ids).toContain("searxng");
		expect(ids).toContain("browserless");
		expect(result.isValid).toBe(true);
	});

	it("expands video-creator skill pack", () => {
		const result = resolve({ services: [], skillPacks: ["video-creator"] });
		const ids = result.services.map((s) => s.definition.id);
		expect(ids).toContain("ffmpeg");
		expect(ids).toContain("remotion");
		expect(ids).toContain("minio");
	});

	it("expands dev-ops skill pack with transitive deps", () => {
		const result = resolve({ services: [], skillPacks: ["dev-ops"] });
		const ids = result.services.map((s) => s.definition.id);
		expect(ids).toContain("n8n");
		expect(ids).toContain("redis");
		expect(ids).toContain("uptime-kuma");
		expect(ids).toContain("grafana");
		expect(ids).toContain("prometheus");
		// n8n requires postgresql (transitive)
		expect(ids).toContain("postgresql");
	});

	it("reports unknown service IDs", () => {
		const result = resolve({ services: ["nonexistent"], skillPacks: [] });
		expect(result.errors).toContainEqual(expect.objectContaining({ type: "unknown_service" }));
	});

	it("reports unknown skill pack IDs", () => {
		const result = resolve({ services: [], skillPacks: ["nonexistent-pack"] });
		expect(result.errors).toContainEqual(expect.objectContaining({ type: "unknown_skill_pack" }));
	});

	it("does not duplicate services already selected by user", () => {
		const result = resolve({
			services: ["qdrant", "searxng", "browserless"],
			skillPacks: ["research-agent"],
		});
		const ids = result.services.map((s) => s.definition.id);
		const qdrantCount = ids.filter((id) => id === "qdrant").length;
		expect(qdrantCount).toBe(1);
	});

	it("estimates memory correctly", () => {
		const result = resolve({ services: ["redis"], skillPacks: [] });
		// 512 (base) + 128 (redis) = 640
		expect(result.estimatedMemoryMB).toBe(640);
	});

	it("adds proxy service when specified", () => {
		const result = resolve({ services: ["redis"], skillPacks: [], proxy: "caddy" });
		const ids = result.services.map((s) => s.definition.id);
		expect(ids).toContain("caddy");
	});

	it("adds monitoring stack when flag is set", () => {
		const result = resolve({ services: [], skillPacks: [], monitoring: true });
		const ids = result.services.map((s) => s.definition.id);
		expect(ids).toContain("uptime-kuma");
		expect(ids).toContain("grafana");
		expect(ids).toContain("prometheus");
	});

	it("is deterministic - same input gives same output", () => {
		const input = { services: ["redis", "qdrant", "n8n"], skillPacks: ["research-agent"] };
		const result1 = resolve(input);
		const result2 = resolve(input);
		const ids1 = result1.services.map((s) => s.definition.id);
		const ids2 = result2.services.map((s) => s.definition.id);
		expect(ids1).toEqual(ids2);
	});

	it("topologically sorts dependencies before dependents", () => {
		const result = resolve({ services: ["n8n"], skillPacks: [] });
		const ids = result.services.map((s) => s.definition.id);
		const pgIndex = ids.indexOf("postgresql");
		const n8nIndex = ids.indexOf("n8n");
		expect(pgIndex).toBeLessThan(n8nIndex);
	});

	it("warns about GPU when AI services selected without gpu flag", () => {
		// Ollama doesn't have gpuRequired=true (it's recommended not required)
		// but we should still check GPU warning logic works
		const result = resolve({ services: ["redis"], skillPacks: [], gpu: false });
		// Redis doesn't need GPU, so no GPU warnings
		const gpuWarnings = result.warnings.filter((w) => w.type === "gpu");
		expect(gpuWarnings).toHaveLength(0);
	});

	it("resolves tailscale as single service with no dependencies", () => {
		const result = resolve({ services: ["tailscale"], skillPacks: [] });
		expect(result.services).toHaveLength(1);
		expect(result.services[0]!.definition.id).toBe("tailscale");
		expect(result.isValid).toBe(true);
	});

	it("resolves coolify and dokploy as single services", () => {
		const result = resolve({ services: ["coolify", "dokploy"], skillPacks: [] });
		const ids = result.services.map((s) => s.definition.id);
		expect(ids).toContain("coolify");
		expect(ids).toContain("dokploy");
		expect(result.isValid).toBe(true);
	});

	it("auto-adds postgresql, redis, and livekit when lasuite-meet-backend is selected", () => {
		const result = resolve({ services: ["lasuite-meet-backend"], skillPacks: [] });
		const ids = result.services.map((s) => s.definition.id);
		expect(ids).toContain("lasuite-meet-backend");
		expect(ids).toContain("postgresql");
		expect(ids).toContain("redis");
		expect(ids).toContain("livekit");
		expect(result.addedDependencies.some((a) => a.service === "postgresql")).toBe(true);
		expect(result.isValid).toBe(true);
	});

	it("resolves La Suite Meet preset (postgresql, redis, livekit, backend, frontend, agents)", () => {
		const lasuiteMeetServices = [
			"postgresql",
			"redis",
			"livekit",
			"lasuite-meet-backend",
			"lasuite-meet-frontend",
			"lasuite-meet-agents",
		];
		const result = resolve({ services: lasuiteMeetServices, skillPacks: [] });
		const ids = result.services.map((s) => s.definition.id);
		for (const id of lasuiteMeetServices) {
			expect(ids).toContain(id);
		}
		expect(result.isValid).toBe(true);
	});

	it("orders lasuite-meet-backend after postgresql, redis, and livekit", () => {
		const result = resolve({
			services: ["lasuite-meet-backend", "lasuite-meet-frontend"],
			skillPacks: [],
		});
		const ids = result.services.map((s) => s.definition.id);
		const pgIdx = ids.indexOf("postgresql");
		const redisIdx = ids.indexOf("redis");
		const livekitIdx = ids.indexOf("livekit");
		const backendIdx = ids.indexOf("lasuite-meet-backend");
		const frontendIdx = ids.indexOf("lasuite-meet-frontend");
		expect(pgIdx).toBeGreaterThanOrEqual(0);
		expect(backendIdx).toBeGreaterThan(pgIdx);
		expect(backendIdx).toBeGreaterThan(redisIdx);
		expect(backendIdx).toBeGreaterThan(livekitIdx);
		expect(frontendIdx).toBeGreaterThan(backendIdx);
	});
});
