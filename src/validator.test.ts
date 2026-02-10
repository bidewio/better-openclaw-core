import { describe, expect, it } from "vitest";
import { compose } from "./composer.js";
import { resolve } from "./resolver.js";
import type { ComposeOptions } from "./types.js";
import { validate } from "./validator.js";

const defaultComposeOptions: ComposeOptions = {
	projectName: "test-project",
	proxy: "none",
	gpu: false,
	platform: "linux/amd64",
	deployment: "local",
	openclawVersion: "latest",
};

describe("validate", () => {
	it("validates a valid minimal stack", () => {
		const resolved = resolve({ services: ["redis"], skillPacks: [] });
		const yaml = compose(resolved, defaultComposeOptions);
		const result = validate(resolved, yaml);

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it("detects invalid YAML", () => {
		const resolved = resolve({ services: ["redis"], skillPacks: [] });
		const brokenYaml =
			"services:\n  redis:\n    image: redis\n  bad_indent:\n- broken\n::: invalid";

		const result = validate(resolved, brokenYaml);

		const yamlErrors = result.errors.filter((e) => e.type === "yaml_invalid");
		expect(yamlErrors.length).toBeGreaterThanOrEqual(1);
	});

	it("detects invalid domain", () => {
		const resolved = resolve({ services: ["redis"], skillPacks: [] });
		const yaml = compose(resolved, defaultComposeOptions);
		const result = validate(resolved, yaml, { domain: "not-a-domain" });

		const domainErrors = result.errors.filter((e) => e.type === "invalid_domain");
		expect(domainErrors.length).toBeGreaterThanOrEqual(1);
	});

	it("accepts valid domain", () => {
		const resolved = resolve({ services: ["redis"], skillPacks: [] });
		const yaml = compose(resolved, defaultComposeOptions);
		const result = validate(resolved, yaml, { domain: "example.com" });

		const domainErrors = result.errors.filter((e) => e.type === "invalid_domain");
		expect(domainErrors).toHaveLength(0);
	});

	it("validates full stack without errors", () => {
		const resolved = resolve({
			services: ["redis", "qdrant", "n8n", "minio", "browserless", "searxng"],
			skillPacks: [],
		});
		const yaml = compose(resolved, defaultComposeOptions);
		const result = validate(resolved, yaml);

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});
});
