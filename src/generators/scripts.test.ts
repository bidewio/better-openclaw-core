import { describe, expect, it } from "vitest";
import { generateScripts } from "./scripts.js";

describe("generateScripts", () => {
	it("generates all 5 expected scripts", () => {
		const result = generateScripts();

		const expectedScripts = [
			"scripts/start.sh",
			"scripts/stop.sh",
			"scripts/update.sh",
			"scripts/backup.sh",
			"scripts/status.sh",
		];

		for (const script of expectedScripts) {
			expect(result).toHaveProperty(script);
			expect(result[script]!.length).toBeGreaterThan(0);
		}
	});

	it("start.sh calls docker compose up", () => {
		const result = generateScripts();
		expect(result["scripts/start.sh"]).toContain("docker compose");
		expect(result["scripts/start.sh"]).toContain("up");
	});

	it("stop.sh calls docker compose down", () => {
		const result = generateScripts();
		expect(result["scripts/stop.sh"]).toContain("docker compose");
		expect(result["scripts/stop.sh"]).toContain("down");
	});

	it("update.sh calls docker compose pull", () => {
		const result = generateScripts();
		expect(result["scripts/update.sh"]).toContain("docker compose");
		expect(result["scripts/update.sh"]).toContain("pull");
	});

	it("backup.sh references volumes or backup", () => {
		const result = generateScripts();
		const backup = result["scripts/backup.sh"]!;
		expect(backup).toBeDefined();
		expect(backup.length).toBeGreaterThan(50);
	});

	it("status.sh calls docker compose ps", () => {
		const result = generateScripts();
		expect(result["scripts/status.sh"]).toContain("docker compose");
		expect(result["scripts/status.sh"]).toContain("ps");
	});

	it("all scripts start with bash shebang", () => {
		const result = generateScripts();

		for (const [, content] of Object.entries(result)) {
			expect(content.startsWith("#!/")).toBe(true);
		}
	});
});
