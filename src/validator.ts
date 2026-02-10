import { parse } from "yaml";
import type { ResolverError, ResolverOutput, Warning } from "./types.js";

export interface ValidationResult {
	valid: boolean;
	errors: ResolverError[];
	warnings: Warning[];
}

/**
 * Validates a complete generated stack before writing files.
 * Checks for port conflicts, volume uniqueness, env completeness,
 * dependency ordering, YAML validity, and more.
 */
export function validate(
	resolved: ResolverOutput,
	composedYaml: string,
	options: { domain?: string; generateSecrets?: boolean } = {},
): ValidationResult {
	const errors: ResolverError[] = [];
	const warnings: Warning[] = [];

	checkPortConflicts(resolved, errors);
	checkVolumeUniqueness(resolved, errors);
	checkEnvCompleteness(resolved, errors, warnings, options.generateSecrets ?? true);
	checkNetworkConsistency(resolved, warnings);
	checkDependencyDAG(resolved, errors);
	checkYamlValidity(composedYaml, errors);

	if (options.domain) {
		checkDomainFormat(options.domain, errors);
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}

function checkPortConflicts(resolved: ResolverOutput, errors: ResolverError[]): void {
	const hostPorts = new Map<number, string>();
	for (const svc of resolved.services) {
		for (const port of svc.definition.ports) {
			if (!port.exposed) continue;
			const existing = hostPorts.get(port.host);
			if (existing) {
				errors.push({
					type: "port_conflict",
					message: `Port ${port.host} is used by both "${existing}" and "${svc.definition.name}"`,
				});
			} else {
				hostPorts.set(port.host, svc.definition.name);
			}
		}
	}
}

function checkVolumeUniqueness(resolved: ResolverOutput, errors: ResolverError[]): void {
	const volumeNames = new Map<string, string>();
	for (const svc of resolved.services) {
		for (const vol of svc.definition.volumes) {
			const existing = volumeNames.get(vol.name);
			if (existing && existing !== svc.definition.id) {
				errors.push({
					type: "volume_conflict",
					message: `Volume name "${vol.name}" is used by both "${existing}" and "${svc.definition.id}"`,
				});
			} else {
				volumeNames.set(vol.name, svc.definition.id);
			}
		}
	}
}

function checkEnvCompleteness(
	resolved: ResolverOutput,
	errors: ResolverError[],
	warnings: Warning[],
	generateSecrets: boolean,
): void {
	for (const svc of resolved.services) {
		for (const envVar of svc.definition.environment) {
			if (envVar.required && !envVar.defaultValue && !envVar.secret) {
				errors.push({
					type: "missing_env",
					message: `Required environment variable "${envVar.key}" for "${svc.definition.name}" has no default value`,
				});
			}
			if (envVar.secret && !generateSecrets && !envVar.defaultValue) {
				warnings.push({
					type: "secret_needed",
					message: `Secret "${envVar.key}" for "${svc.definition.name}" needs to be configured manually`,
				});
			}
		}
	}
}

function checkNetworkConsistency(resolved: ResolverOutput, warnings: Warning[]): void {
	for (const svc of resolved.services) {
		if (!svc.definition.networks.includes("openclaw-network")) {
			warnings.push({
				type: "network",
				message: `Service "${svc.definition.name}" is not on openclaw-network — it may not be reachable from OpenClaw`,
			});
		}
	}
}

function checkDependencyDAG(resolved: ResolverOutput, errors: ResolverError[]): void {
	const ids = new Set(resolved.services.map((s) => s.definition.id));
	const visited = new Set<string>();
	const inStack = new Set<string>();

	const adjList = new Map<string, string[]>();
	for (const svc of resolved.services) {
		const deps = [...svc.definition.requires, ...svc.definition.dependsOn].filter((d) =>
			ids.has(d),
		);
		adjList.set(svc.definition.id, deps);
	}

	function hasCycle(node: string): boolean {
		if (inStack.has(node)) return true;
		if (visited.has(node)) return false;
		visited.add(node);
		inStack.add(node);
		for (const dep of adjList.get(node) ?? []) {
			if (hasCycle(dep)) return true;
		}
		inStack.delete(node);
		return false;
	}

	for (const id of ids) {
		if (hasCycle(id)) {
			errors.push({
				type: "cycle",
				message: `Circular dependency detected involving "${id}"`,
			});
			break;
		}
	}
}

function checkYamlValidity(yaml: string, errors: ResolverError[]): void {
	try {
		parse(yaml);
	} catch (e) {
		errors.push({
			type: "yaml_invalid",
			message: `Generated YAML is not valid: ${e instanceof Error ? e.message : String(e)}`,
		});
	}
}

function checkDomainFormat(domain: string, errors: ResolverError[]): void {
	const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
	if (!domainRegex.test(domain)) {
		errors.push({
			type: "invalid_domain",
			message: `"${domain}" is not a valid domain name`,
		});
	}
}
