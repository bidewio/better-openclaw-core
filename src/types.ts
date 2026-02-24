import type { z } from "zod";
import type {
	AddedDependencySchema,
	AiProviderSchema,
	ApiErrorSchema,
	ComposeOptionsSchema,
	DeploymentTargetSchema,
	DeploymentTypeSchema,
	DeploySchema,
	EnvVariableSchema,
	ErrorSchema,
	GenerationInputSchema,
	GsdRuntimeSchema,
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

// ─── Inferred Types ─────────────────────────────────────────────────────────

export type AiProvider = z.infer<typeof AiProviderSchema>;
export type GsdRuntime = z.infer<typeof GsdRuntimeSchema>;
export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;
export type Maturity = z.infer<typeof MaturitySchema>;
export type Platform = z.infer<typeof PlatformSchema>;
export type RestartPolicy = z.infer<typeof RestartPolicySchema>;
export type ProxyType = z.infer<typeof ProxyTypeSchema>;
export type DeploymentTarget = z.infer<typeof DeploymentTargetSchema>;
export type DeploymentType = z.infer<typeof DeploymentTypeSchema>;
export type NativePlatform = z.infer<typeof NativePlatformSchema>;
export type NativeRecipe = z.infer<typeof NativeRecipeSchema>;
export type OutputFormat = z.infer<typeof OutputFormatSchema>;

export type PortMapping = z.infer<typeof PortMappingSchema>;
export type VolumeMapping = z.infer<typeof VolumeMappingSchema>;
export type EnvVariable = z.infer<typeof EnvVariableSchema>;
export type HealthCheck = z.infer<typeof HealthCheckSchema>;
export type ResourceLimits = z.infer<typeof ResourceLimitsSchema>;
export type Deploy = z.infer<typeof DeploySchema>;
export type SkillBinding = z.infer<typeof SkillBindingSchema>;

export type ServiceDefinition = z.infer<typeof ServiceDefinitionSchema>;
export type SkillPack = z.infer<typeof SkillPackSchema>;
export type Preset = z.infer<typeof PresetSchema>;

export type GenerationInput = z.infer<typeof GenerationInputSchema>;
export type ComposeOptions = z.infer<typeof ComposeOptionsSchema> & {
	/** Dynamic Traefik labels per service, computed by the Traefik generator. */
	traefikLabels?: Map<string, Record<string, string>>;
};
export type ResolvedService = z.infer<typeof ResolvedServiceSchema>;
export type AddedDependency = z.infer<typeof AddedDependencySchema>;
export type Warning = z.infer<typeof WarningSchema>;
export type ResolverError = z.infer<typeof ErrorSchema>;
export type ResolverOutput = z.infer<typeof ResolverOutputSchema>;

export type ValidateRequest = z.infer<typeof ValidateRequestSchema>;
export type ValidateResponse = z.infer<typeof ValidateResponseSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;

// ─── Additional Types ───────────────────────────────────────────────────────

export interface ResolverInput {
	services: string[];
	skillPacks: string[];
	aiProviders?: AiProvider[];
	gsdRuntimes?: GsdRuntime[];
	proxy?: ProxyType;
	gpu?: boolean;
	platform?: Platform;
	monitoring?: boolean;
	memoryThresholds?: { info: number; warning: number; critical: number };
}

export interface GeneratedFiles {
	[path: string]: string;
}

export interface GenerationMetadata {
	serviceCount: number;
	skillCount: number;
	estimatedMemoryMB: number;
	generatedAt: string;
}

export interface GenerationResult {
	files: GeneratedFiles;
	metadata: GenerationMetadata;
}

export interface CategoryInfo {
	id: ServiceCategory;
	name: string;
	icon: string;
}

export const SERVICE_CATEGORIES: CategoryInfo[] = [
	{ id: "coding-agent", name: "AI Coding Agents", icon: "💻" },
	{ id: "ai-platform", name: "AI Platforms & Chat UIs", icon: "🧪" },
	{ id: "ai", name: "AI / Local Models", icon: "🤖" },
	{ id: "automation", name: "Automation & Workflows", icon: "🔄" },
	{ id: "vector-db", name: "Vector Databases", icon: "🧠" },
	{ id: "media", name: "Media & Video", icon: "🎬" },
	{ id: "social-media", name: "Social Media", icon: "📱" },
	{ id: "analytics", name: "Analytics", icon: "📊" },
	{ id: "knowledge", name: "Knowledge & Documents", icon: "📚" },
	{ id: "storage", name: "Object Storage", icon: "💾" },
	{ id: "database", name: "Databases & Caching", icon: "🗄️" },
	{ id: "dev-tools", name: "Developer Tools", icon: "🛠️" },
	{ id: "proxy", name: "Reverse Proxy", icon: "🌐" },
	{ id: "monitoring", name: "Monitoring", icon: "📡" },
	{ id: "browser", name: "Browser Automation", icon: "🌐" },
	{ id: "search", name: "Search", icon: "🔍" },
	{ id: "communication", name: "Notifications", icon: "🔔" },
	{ id: "desktop", name: "Desktop Environment", icon: "🖥️" },
	{ id: "streaming", name: "Streaming & Relay", icon: "📺" },
	{ id: "security", name: "Security & Pentesting", icon: "🛡️" },
];
