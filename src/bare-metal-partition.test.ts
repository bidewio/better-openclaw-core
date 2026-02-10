import { describe, expect, it } from "vitest";
import {
	partitionBareMetal,
	platformToNativePlatform,
	resolvedWithOnlyServices,
} from "./bare-metal-partition.js";
import { resolve } from "./resolver.js";

describe("bare-metal partition", () => {
	it("platformToNativePlatform maps platform to native", () => {
		expect(platformToNativePlatform("linux/amd64")).toBe("linux");
		expect(platformToNativePlatform("linux/arm64")).toBe("linux");
		expect(platformToNativePlatform("windows/amd64")).toBe("windows");
		expect(platformToNativePlatform("macos/arm64")).toBe("macos");
	});

	it("partitions redis as native on Linux when redis has native recipe", () => {
		const resolved = resolve({
			services: ["redis"],
			skillPacks: [],
			proxy: "none",
			gpu: false,
			platform: "linux/amd64",
			monitoring: false,
		});
		const result = partitionBareMetal(resolved, "linux/amd64");
		expect(result.nativeIds.has("redis")).toBe(true);
		expect(result.nativeServices.length).toBe(1);
		expect(result.nativeServices[0].definition.id).toBe("redis");
		expect(result.dockerOnlyServices.length).toBe(0);
	});

	it("partitions n8n as Docker-only (no native recipe)", () => {
		const resolved = resolve({
			services: ["n8n"],
			skillPacks: [],
			proxy: "none",
			gpu: false,
			platform: "linux/amd64",
			monitoring: false,
		});
		const result = partitionBareMetal(resolved, "linux/amd64");
		expect(result.nativeIds.has("n8n")).toBe(false);
		expect(result.nativeServices.length).toBe(0);
		expect(result.dockerOnlyServices.length).toBeGreaterThanOrEqual(1);
		expect(result.dockerOnlyServices.some((s) => s.definition.id === "n8n")).toBe(true);
	});

	it("resolvedWithOnlyServices filters to given service list", () => {
		const resolved = resolve({
			services: ["redis", "n8n"],
			skillPacks: [],
			proxy: "none",
			gpu: false,
			platform: "linux/amd64",
			monitoring: false,
		});
		const partition = partitionBareMetal(resolved, "linux/amd64");
		const filtered = resolvedWithOnlyServices(resolved, partition.dockerOnlyServices);
		expect(filtered.services.every((s) => s.definition.id !== "redis")).toBe(true);
		expect(filtered.services.some((s) => s.definition.id === "n8n")).toBe(true);
	});
});
