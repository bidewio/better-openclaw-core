import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "src/**/*.ts",
	format: ["esm"],
	sourcemap: true,
	clean: true,
	dts: true, // Turn off dts generation if not needed for an app, speeds up build
	inlineOnly: false,
});
