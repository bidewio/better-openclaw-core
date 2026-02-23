import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ── Types ───────────────────────────────────────────────────────────────────

export interface SkillManifestEntry {
	/** Unique skill identifier, e.g. "gsap-animate" */
	id: string;
	/** Relative path to the SKILL.md file */
	path: string;
	/** Display emoji */
	emoji: string;
	/** Docker service IDs this skill depends on (empty for frontend-only skills) */
	services: string[];
}

interface SkillManifest {
	skills: SkillManifestEntry[];
}

// ── Manifest loader ─────────────────────────────────────────────────────────

let _cache: SkillManifestEntry[] | null = null;

function loadManifest(): SkillManifestEntry[] {
	if (_cache) return _cache;
	// Resolve the manifest relative to this file's location
	// This file is at packages/core/src/skills/skill-manifest.ts
	// The manifest is at skills/manifest.json (repo root / skills /)
	const thisDir = dirname(fileURLToPath(import.meta.url));
	const manifestPath = resolve(thisDir, "../../../../skills/manifest.json");
	const raw = readFileSync(manifestPath, "utf-8");
	const data = JSON.parse(raw) as SkillManifest;
	_cache = data.skills;
	return _cache;
}

/** Return all skills defined in the local manifest.json */
export function getAllManifestSkills(): SkillManifestEntry[] {
	return loadManifest();
}

/** Look up a single skill by ID */
export function getManifestSkillById(id: string): SkillManifestEntry | undefined {
	return loadManifest().find((s) => s.id === id);
}

/** Return the total count of curated skills */
export function getManifestSkillCount(): number {
	return loadManifest().length;
}
