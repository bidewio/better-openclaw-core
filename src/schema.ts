import { z } from "zod";

// ─── Enums ──────────────────────────────────────────────────────────────────

export const ServiceCategorySchema = z.enum([
	"automation",
	"vector-db",
	"media",
	"storage",
	"database",
	"proxy",
	"monitoring",
	"browser",
	"search",
	"ai",
	"communication",
	"coding-agent",
	"social-media",
	"analytics",
	"ai-platform",
	"dev-tools",
	"knowledge",
	"desktop",
	"streaming",
]);

export const MaturitySchema = z.enum(["stable", "beta", "experimental"]);

export const PlatformSchema = z.enum([
	"linux/amd64",
	"linux/arm64",
	"windows/amd64",
	"macos/amd64",
	"macos/arm64",
]);

/** Platform for Docker image arch only (used by resolver/compose). */
export const ComposePlatformSchema = z.enum(["linux/amd64", "linux/arm64"]);

export const DeploymentTypeSchema = z.enum(["docker", "bare-metal"]);

export const RestartPolicySchema = z.enum(["unless-stopped", "always", "on-failure", "no"]);

export const ProxyTypeSchema = z.enum(["none", "caddy", "traefik"]);

export const DeploymentTargetSchema = z.enum(["local", "vps", "homelab", "clawexa"]);

export const OutputFormatSchema = z.enum(["directory", "tar", "zip"]);

// ─── Sub-Schemas ────────────────────────────────────────────────────────────

export const PortMappingSchema = z.object({
	host: z.number().int().min(1).max(65535),
	container: z.number().int().min(1).max(65535),
	description: z.string(),
	exposed: z.boolean().default(true),
});

export const VolumeMappingSchema = z.object({
	name: z.string().min(1),
	containerPath: z.string().min(1),
	description: z.string(),
	driver: z.string().optional(),
});

export const EnvVariableSchema = z.object({
	key: z.string().min(1),
	defaultValue: z.string(),
	secret: z.boolean().default(false),
	description: z.string(),
	required: z.boolean().default(true),
	validation: z.string().optional(),
});

export const HealthCheckSchema = z.object({
	test: z.string().min(1),
	interval: z.string().default("30s"),
	timeout: z.string().default("10s"),
	retries: z.number().int().min(1).default(3),
	startPeriod: z.string().optional(),
});

export const ResourceLimitsSchema = z.object({
	cpus: z.string().optional(),
	memory: z.string().optional(),
});

export const DeploySchema = z.object({
	resources: z
		.object({
			limits: ResourceLimitsSchema.optional(),
			reservations: ResourceLimitsSchema.optional(),
		})
		.optional(),
});

export const SkillBindingSchema = z.object({
	skillId: z.string().min(1),
	autoInstall: z.boolean().default(true),
	configOverrides: z.record(z.string(), z.string()).optional(),
});

/** Platform for native install (linux, windows, macos — no arch). */
export const NativePlatformSchema = z.enum(["linux", "windows", "macos"]);

export const NativeRecipeSchema = z.object({
	platform: NativePlatformSchema,
	installSteps: z.array(z.string()).min(1),
	startCommand: z.string(),
	stopCommand: z.string().optional(),
	configPath: z.string().optional(),
	configTemplate: z.string().optional(),
	systemdUnit: z.string().optional(),
});

// ─── Service Definition ─────────────────────────────────────────────────────

export const ServiceDefinitionSchema = z.object({
	// Identity
	id: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/),
	name: z.string().min(1),
	description: z.string(),
	category: ServiceCategorySchema,
	icon: z.string(),

	// Docker
	image: z.string().min(1),
	imageTag: z.string().min(1),
	ports: z.array(PortMappingSchema).default([]),
	volumes: z.array(VolumeMappingSchema).default([]),
	environment: z.array(EnvVariableSchema).default([]),
	healthcheck: HealthCheckSchema.optional(),
	command: z.string().optional(),
	entrypoint: z.string().optional(),
	dependsOn: z.array(z.string()).default([]),
	restartPolicy: RestartPolicySchema.default("unless-stopped"),
	networks: z.array(z.string()).default(["openclaw-network"]),
	labels: z.record(z.string(), z.string()).optional(),
	deploy: DeploySchema.optional(),

	// OpenClaw Integration
	skills: z.array(SkillBindingSchema).default([]),
	openclawEnvVars: z.array(EnvVariableSchema).default([]),
	openclawVolumeMounts: z.array(VolumeMappingSchema).optional(),

	// Metadata
	docsUrl: z.string().url(),
	selfHostedDocsUrl: z.string().url().optional(),
	tags: z.array(z.string()).default([]),
	maturity: MaturitySchema.default("stable"),

	// Dependencies & Conflicts
	requires: z.array(z.string()).default([]),
	recommends: z.array(z.string()).default([]),
	conflictsWith: z.array(z.string()).default([]),
	mandatory: z.boolean().default(false).optional(),
	removalWarning: z.string().optional(),

	// Platform Constraints
	platforms: z.array(PlatformSchema).optional(),
	minMemoryMB: z.number().int().min(0).optional(),
	gpuRequired: z.boolean().default(false),

	// Bare-metal native (install/run on host when no Docker)
	nativeSupported: z.boolean().optional(),
	nativeRecipes: z.array(NativeRecipeSchema).optional(),
});

// ─── Skill Pack ─────────────────────────────────────────────────────────────

export const SkillPackSchema = z.object({
	id: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/),
	name: z.string().min(1),
	description: z.string(),
	requiredServices: z.array(z.string()).min(1),
	skills: z.array(z.string()),
	icon: z.string().optional(),
	tags: z.array(z.string()).default([]),
});

// ─── Preset ─────────────────────────────────────────────────────────────────

export const PresetSchema = z.object({
	id: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/),
	name: z.string().min(1),
	description: z.string(),
	services: z.array(z.string()),
	skillPacks: z.array(z.string()).default([]),
	estimatedMemoryMB: z.number().int().min(0).optional(),
});

// ─── Generation Input ───────────────────────────────────────────────────────

export const GenerationInputSchema = z.object({
	projectName: z
		.string()
		.min(1)
		.max(64)
		.regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/, {
			message:
				"Project name must be lowercase alphanumeric with hyphens, cannot start or end with hyphen",
		}),
	services: z.array(z.string()).default([]),
	skillPacks: z.array(z.string()).default([]),
	proxy: ProxyTypeSchema.default("none"),
	domain: z.string().optional(),
	gpu: z.boolean().default(false),
	platform: PlatformSchema.default("linux/amd64"),
	deployment: DeploymentTargetSchema.default("local"),
	deploymentType: DeploymentTypeSchema.default("docker"),
	generateSecrets: z.boolean().default(true),
	openclawVersion: z.string().default("latest"),
	monitoring: z.boolean().default(false),
});

// ─── Resolver Output ────────────────────────────────────────────────────────

export const ResolvedServiceSchema = z.object({
	definition: ServiceDefinitionSchema,
	addedBy: z.enum(["user", "dependency", "skill-pack", "proxy", "monitoring"]).default("user"),
});

export const AddedDependencySchema = z.object({
	service: z.string(),
	reason: z.string(),
});

export const WarningSchema = z.object({
	type: z.string(),
	message: z.string(),
});

export const ErrorSchema = z.object({
	type: z.string(),
	message: z.string(),
});

export const ResolverOutputSchema = z.object({
	services: z.array(ResolvedServiceSchema),
	addedDependencies: z.array(AddedDependencySchema),
	removedConflicts: z.array(z.object({ service: z.string(), reason: z.string() })),
	warnings: z.array(WarningSchema),
	errors: z.array(ErrorSchema),
	isValid: z.boolean(),
	estimatedMemoryMB: z.number().int().min(0),
});

// ─── Compose Options ────────────────────────────────────────────────────────

export const ComposeOptionsSchema = z.object({
	projectName: z.string(),
	proxy: ProxyTypeSchema.default("none"),
	domain: z.string().optional(),
	gpu: z.boolean().default(false),
	platform: PlatformSchema.default("linux/amd64"),
	deployment: DeploymentTargetSchema.default("local"),
	openclawVersion: z.string().default("latest"),
	/** When true, gateway gets extra_hosts so it can reach host-run (native) services. */
	bareMetalNativeHost: z.boolean().optional(),
});

// ─── API Request/Response ───────────────────────────────────────────────────

export const ValidateRequestSchema = z.object({
	services: z.array(z.string()),
	skillPacks: z.array(z.string()).default([]),
	proxy: ProxyTypeSchema.default("none"),
	domain: z.string().optional(),
	gpu: z.boolean().default(false),
	platform: PlatformSchema.default("linux/amd64"),
});

export const ValidateResponseSchema = z.object({
	valid: z.boolean(),
	resolvedServices: z.array(z.string()),
	addedDependencies: z.array(AddedDependencySchema),
	warnings: z.array(WarningSchema),
	conflicts: z.array(ErrorSchema),
	estimatedMemoryMB: z.number(),
});

export const ApiErrorSchema = z.object({
	error: z.object({
		code: z.enum([
			"VALIDATION_ERROR",
			"CONFLICT_ERROR",
			"GENERATION_ERROR",
			"RATE_LIMITED",
			"INTERNAL_ERROR",
		]),
		message: z.string(),
		details: z
			.array(
				z.object({
					field: z.string().optional(),
					message: z.string(),
				}),
			)
			.optional(),
	}),
});
