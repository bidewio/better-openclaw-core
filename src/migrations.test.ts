import { describe, expect, it } from "vitest";
import { CURRENT_CONFIG_VERSION, migrateConfig, needsMigration } from "./migrations.js";

describe("config migrations", () => {
	it("migrates v1 config to current version", () => {
		const v1 = { projectName: "test", services: ["redis"], skillPacks: [] };
		const result = migrateConfig(v1);
		expect(result.configVersion).toBe(CURRENT_CONFIG_VERSION);
		expect(result.deploymentType).toBe("docker");
	});

	it("preserves existing deploymentType during migration", () => {
		const v1 = { configVersion: 1, deploymentType: "bare-metal" };
		const result = migrateConfig(v1);
		expect(result.deploymentType).toBe("bare-metal");
	});

	it("passes through current version unchanged", () => {
		const current = { configVersion: CURRENT_CONFIG_VERSION, projectName: "test" };
		const result = migrateConfig(current);
		expect(result).toEqual(current);
	});

	it("needsMigration returns true for old configs", () => {
		expect(needsMigration({ configVersion: 1 })).toBe(true);
		expect(needsMigration({})).toBe(true); // no version = v1
	});

	it("needsMigration returns false for current configs", () => {
		expect(needsMigration({ configVersion: CURRENT_CONFIG_VERSION })).toBe(false);
	});

	it("throws for unknown version with no migration path", () => {
		expect(() => migrateConfig({ configVersion: 99 })).toThrow("No migration path");
	});
});
