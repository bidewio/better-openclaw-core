import type { NativePlatform, Platform, ResolvedService, ResolverOutput } from "./types.js";

/**
 * Maps Platform (e.g. linux/amd64) to NativePlatform (linux, windows, macos).
 */
export function platformToNativePlatform(platform: Platform): NativePlatform {
	if (platform.startsWith("linux/")) return "linux";
	if (platform.startsWith("windows/")) return "windows";
	if (platform.startsWith("macos/")) return "macos";
	return "linux";
}

export interface BareMetalPartitionResult {
	nativeServices: ResolvedService[];
	dockerOnlyServices: ResolvedService[];
	nativeIds: Set<string>;
}

/**
 * Partitions resolved services into native (run on host via scripts) vs Docker-only.
 * Gateway and CLI are never native; services with nativeSupported and a matching
 * nativeRecipe for the platform go to native, rest to Docker.
 */
export function partitionBareMetal(
	resolved: ResolverOutput,
	platform: Platform,
): BareMetalPartitionResult {
	const nativePlatform = platformToNativePlatform(platform);
	const nativeServices: ResolvedService[] = [];
	const dockerOnlyServices: ResolvedService[] = [];
	const nativeIds = new Set<string>();

	for (const entry of resolved.services) {
		const def = entry.definition;
		const hasNativeRecipe =
			def.nativeSupported === true &&
			def.nativeRecipes?.length &&
			def.nativeRecipes.some((r) => r.platform === nativePlatform);

		if (hasNativeRecipe) {
			nativeServices.push(entry);
			nativeIds.add(def.id);
		} else {
			dockerOnlyServices.push(entry);
		}
	}

	return { nativeServices, dockerOnlyServices, nativeIds };
}

/**
 * Returns a new ResolverOutput containing only the given service list (same order).
 * Used to build compose for Docker-only subset when bare-metal has native services.
 */
export function resolvedWithOnlyServices(
	resolved: ResolverOutput,
	services: ResolvedService[],
): ResolverOutput {
	const idSet = new Set(services.map((s) => s.definition.id));
	return {
		...resolved,
		services: resolved.services.filter((s) => idSet.has(s.definition.id)),
	};
}
