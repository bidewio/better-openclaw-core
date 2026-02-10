import type { ServiceCategory, ServiceDefinition } from "../types.js";
import { allServiceDefinitions } from "./definitions/index.js";

// Build the registry map and validate no duplicates
const registryMap = new Map<string, ServiceDefinition>();

for (const def of allServiceDefinitions) {
	if (registryMap.has(def.id)) {
		throw new Error(
			`Duplicate service definition ID: "${def.id}". Each service must have a unique ID.`,
		);
	}
	registryMap.set(def.id, def);
}

/** Readonly map of all registered services indexed by ID */
export const serviceRegistry: ReadonlyMap<string, ServiceDefinition> = registryMap;

/** Look up a service by its unique ID */
export function getServiceById(id: string): ServiceDefinition | undefined {
	return registryMap.get(id);
}

/** Get all services in a given category */
export function getServicesByCategory(category: ServiceCategory): ServiceDefinition[] {
	return allServiceDefinitions.filter((s) => s.category === category);
}

/** Get all registered services */
export function getAllServices(): ServiceDefinition[] {
	return [...allServiceDefinitions];
}

/** Get services matching a specific tag */
export function getServicesByTag(tag: string): ServiceDefinition[] {
	return allServiceDefinitions.filter((s) => s.tags.includes(tag));
}
