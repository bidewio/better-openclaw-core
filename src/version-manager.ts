import { getServiceById } from "./services/registry.js";
import type { ResolverOutput, ServiceDefinition, Warning } from "./types.js";

/** Get the pinned image tag for a service */
export function getImageTag(serviceId: string): string | undefined {
	const svc = getServiceById(serviceId);
	return svc?.imageTag;
}

/** Get the full image reference (image:tag) for a service */
export function getImageReference(serviceId: string): string | undefined {
	const svc = getServiceById(serviceId);
	if (!svc) return undefined;
	return `${svc.image}:${svc.imageTag}`;
}

/** Pin all service image tags in a resolved output (returns a copy) */
export function pinImageTags(resolved: ResolverOutput): ResolverOutput {
	return {
		...resolved,
		services: resolved.services.map((s) => ({
			...s,
			definition: { ...s.definition },
		})),
	};
}

/** Check for known compatibility issues between services */
export function checkCompatibility(services: ServiceDefinition[]): Warning[] {
	const warnings: Warning[] = [];
	const ids = new Set(services.map((s) => s.id));

	// Redis + Valkey conflict (should already be caught by resolver, but double-check)
	if (ids.has("redis") && ids.has("valkey")) {
		warnings.push({
			type: "compatibility",
			message: "Redis and Valkey cannot coexist. Choose one.",
		});
	}
	// Caddy + Traefik conflict
	if (ids.has("caddy") && ids.has("traefik")) {
		warnings.push({
			type: "compatibility",
			message: "Caddy and Traefik cannot coexist. Choose one reverse proxy.",
		});
	}
	// Multiple vector DBs warning
	const vectorDbs = ["qdrant", "chromadb", "weaviate"].filter((id) => ids.has(id));
	if (vectorDbs.length > 1) {
		warnings.push({
			type: "compatibility",
			message: `Multiple vector databases selected (${vectorDbs.join(", ")}). Consider using just one to reduce resource usage.`,
		});
	}
	// GPU services without GPU
	const gpuServices = services.filter((s) => s.gpuRequired);
	if (gpuServices.length > 0) {
		warnings.push({
			type: "compatibility",
			message: `Services requiring GPU: ${gpuServices.map((s) => s.name).join(", ")}. Ensure NVIDIA Container Toolkit is installed.`,
		});
	}

	return warnings;
}
