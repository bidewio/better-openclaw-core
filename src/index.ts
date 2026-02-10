// ─── Schemas ────────────────────────────────────────────────────────────────

// ─── Core Engines ───────────────────────────────────────────────────────────
export {
	partitionBareMetal,
	platformToNativePlatform,
	resolvedWithOnlyServices,
} from "./bare-metal-partition.js";
export type { ComposeResult } from "./composer.js";
export { compose, composeMultiFile } from "./composer.js";
export { generate } from "./generate.js";
export { generateCaddyfile } from "./generators/caddy.js";
export type { EnvVarGroup } from "./generators/env.js";
export { generateEnvFiles, getStructuredEnvVars } from "./generators/env.js";
export { generateGrafanaConfig, generateGrafanaDashboard } from "./generators/grafana.js";
export { generateN8nWorkflows } from "./generators/n8n-workflows.js";
export { generatePostgresInit, getDbRequirements } from "./generators/postgres-init.js";
export { generatePrometheusConfig } from "./generators/prometheus.js";
export { generateReadme } from "./generators/readme.js";
export { generateScripts } from "./generators/scripts.js";
export { generateSkillFiles } from "./generators/skills.js";
// ─── Presets ────────────────────────────────────────────────────────────────
export { getAllPresets, getPresetById, presetRegistry } from "./presets/registry.js";
export { resolve } from "./resolver.js";
export {
	AddedDependencySchema,
	ApiErrorSchema,
	ComposeOptionsSchema,
	DeploymentTargetSchema,
	DeploymentTypeSchema,
	DeploySchema,
	EnvVariableSchema,
	ErrorSchema,
	GenerationInputSchema,
	HealthCheckSchema,
	MaturitySchema,
	NativePlatformSchema,
	NativeRecipeSchema,
	OutputFormatSchema,
	PlatformSchema,
	PortMappingSchema,
	PresetSchema,
	ProxyTypeSchema,
	ResolvedServiceSchema,
	ResolverOutputSchema,
	ResourceLimitsSchema,
	RestartPolicySchema,
	ServiceCategorySchema,
	ServiceDefinitionSchema,
	SkillBindingSchema,
	SkillPackSchema,
	ValidateRequestSchema,
	ValidateResponseSchema,
	VolumeMappingSchema,
	WarningSchema,
} from "./schema.js";
// ─── Service Registry ───────────────────────────────────────────────────────
export {
	getAllServices,
	getServiceById,
	getServicesByCategory,
	serviceRegistry,
} from "./services/registry.js";
// ─── Skill Packs ────────────────────────────────────────────────────────────
export {
	getAllSkillPacks,
	getCompatibleSkillPacks,
	getSkillPackById,
	skillPackRegistry,
} from "./skills/registry.js";
// ─── Types ──────────────────────────────────────────────────────────────────
export type {
	AddedDependency,
	ApiError,
	CategoryInfo,
	ComposeOptions,
	Deploy,
	DeploymentTarget,
	DeploymentType,
	EnvVariable,
	GeneratedFiles,
	GenerationInput,
	GenerationMetadata,
	GenerationResult,
	HealthCheck,
	Maturity,
	NativePlatform,
	NativeRecipe,
	OutputFormat,
	Platform,
	PortMapping,
	Preset,
	ProxyType,
	ResolvedService,
	ResolverError,
	ResolverInput,
	ResolverOutput,
	ResourceLimits,
	RestartPolicy,
	ServiceCategory,
	ServiceDefinition,
	SkillBinding,
	SkillPack,
	ValidateRequest,
	ValidateResponse,
	VolumeMapping,
	Warning,
} from "./types.js";
export { SERVICE_CATEGORIES } from "./types.js";
export { validate } from "./validator.js";

// ─── Version Manager ────────────────────────────────────────────────────────
export {
	checkCompatibility,
	getImageReference,
	getImageTag,
	pinImageTags,
} from "./version-manager.js";
