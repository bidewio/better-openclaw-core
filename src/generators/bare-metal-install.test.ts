import { describe, expect, it } from "vitest";
import { generateBareMetalInstall } from "./bare-metal-install.js";

describe("generateBareMetalInstall", () => {
	it("returns install.ps1 for windows/amd64", () => {
		const result = generateBareMetalInstall({
			platform: "windows/amd64",
			projectName: "my-stack",
		});
		expect(result).toHaveProperty("install.ps1");
		expect(Object.keys(result)).toHaveLength(1);
		expect(result["install.ps1"]).toContain("docker compose");
		expect(result["install.ps1"]).toContain("PowerShell");
	});

	it("returns install.sh for linux/amd64", () => {
		const result = generateBareMetalInstall({
			platform: "linux/amd64",
			projectName: "my-stack",
		});
		expect(result).toHaveProperty("install.sh");
		expect(Object.keys(result)).toHaveLength(1);
		expect(result["install.sh"]).toContain("docker");
		expect(result["install.sh"]).toContain("compose");
	});

	it("returns install.sh for linux/arm64", () => {
		const result = generateBareMetalInstall({
			platform: "linux/arm64",
			projectName: "my-stack",
		});
		expect(result).toHaveProperty("install.sh");
		expect(result["install.sh"]).toContain("docker");
	});

	it("returns install.sh for macos/amd64 and macos/arm64", () => {
		for (const platform of ["macos/amd64", "macos/arm64"] as const) {
			const result = generateBareMetalInstall({ platform, projectName: "my-stack" });
			expect(result).toHaveProperty("install.sh");
			expect(result["install.sh"]).toContain("Docker");
		}
	});
});
