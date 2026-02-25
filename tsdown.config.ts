import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "src/**/*.ts",
	format: ["esm", "cjs"],
	sourcemap: true,
	clean: true,
	dts: true,
	inlineOnly: false,
});
