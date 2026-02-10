import type { NativePlatform, ResolvedService } from "../types.js";

export interface NativeServicesGeneratorOptions {
	nativeServices: ResolvedService[];
	platform: NativePlatform;
	projectName: string;
}

/**
 * Generates native install/run scripts for services that have a native recipe.
 * Returns e.g. native/install-linux.sh (or native/install.ps1 for Windows).
 * Scripts source .env and run install steps then start commands in dependency order.
 */
export function generateNativeInstallScripts(
	options: NativeServicesGeneratorOptions,
): Record<string, string> {
	const { nativeServices, platform } = options;
	const files: Record<string, string> = {};

	if (platform === "linux") {
		files["native/install-linux.sh"] = buildLinuxNativeScript(nativeServices);
	} else if (platform === "windows") {
		files["native/install-windows.ps1"] = buildWindowsNativeScript(nativeServices);
	} else {
		// macos: use bash script similar to linux
		files["native/install-macos.sh"] = buildLinuxNativeScript(nativeServices);
	}

	return files;
}

function buildLinuxNativeScript(nativeServices: ResolvedService[]): string {
	const lines: string[] = [
		"#!/usr/bin/env bash",
		"set -euo pipefail",
		"# OpenClaw native services — install and start (Linux). Run from project root. Source .env first.",
		"",
		'SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"',
		'PROJECT_DIR="$(dirname "$SCRIPT_DIR")"',
		'cd "$PROJECT_DIR"',
		"",
		"if [ -f .env ]; then set -a; source .env; set +a; fi",
		"",
	];

	for (const { definition: def } of nativeServices) {
		const recipe = def.nativeRecipes?.find((r) => r.platform === "linux");
		if (!recipe) continue;

		lines.push(`# ─── ${def.icon} ${def.name} ─────────────────────────────────────────`);
		lines.push("");

		if (recipe.configPath && recipe.configTemplate) {
			const delim = `ENDOF_${def.id.toUpperCase().replace(/-/g, "_")}_CONF`;
			lines.push(`# Write config for ${def.id}`);
			lines.push(`sudo mkdir -p "$(dirname "${recipe.configPath}")" 2>/dev/null || true`);
			lines.push(`sudo tee "${recipe.configPath}" > /dev/null << ${delim}`);
			lines.push(recipe.configTemplate.trim());
			lines.push(delim);
			lines.push("");
		}

		for (const step of recipe.installSteps) {
			lines.push(`# Install: ${def.id}`);
			lines.push(step);
			lines.push("");
		}

		lines.push(`# Start: ${def.id}`);
		lines.push(recipe.startCommand);
		lines.push("");
	}

	lines.push("echo 'Native services started.'");
	return lines.join("\n");
}

function buildWindowsNativeScript(nativeServices: ResolvedService[]): string {
	const lines: string[] = [
		"# OpenClaw native services — install and start (Windows). Run from project root.",
		"$ErrorActionPreference = 'Stop'",
		"$ProjectDir = (Get-Item $PSScriptRoot).Parent.FullName",
		"Set-Location $ProjectDir",
		"",
		"if (Test-Path .env) { Get-Content .env | ForEach-Object { if ($_ -match '^([^#=]+)=(.*)$') { [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process') } } }",
		"",
	];

	for (const { definition: def } of nativeServices) {
		const recipe = def.nativeRecipes?.find((r) => r.platform === "windows");
		if (!recipe) continue;

		lines.push(`# ${def.name}`);
		for (const step of recipe.installSteps) {
			lines.push(`Invoke-Expression "${step.replace(/"/g, '`"')}"`);
		}
		lines.push(recipe.startCommand);
		lines.push("");
	}

	lines.push("Write-Host 'Native services started.'");
	return lines.join("\n");
}
