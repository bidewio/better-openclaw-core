# @better-openclaw/core

The core engine responsible for parsing configurations, resolving dependencies, formatting outputs, and generating production-ready OpenClaw Docker Compose stacks.

## Features

- **Service Registry:** A unified, expandable catalog of pre-configured Docker services (e.g., Traefik, PostgreSQL, Qdrant, Ollama, N8N, SearXNG, Scrapling, etc.) categorized by function (databases, models, scrapers, tools).
- **Dependency Resolution Engine:** Automatically detects and resolves required services. If you select a Postgres-dependent service, Postgres is automatically injected into the generation plan.
- **Skill Injection (`SKILL.md`):** Deep integration with AI agent workflows. Packages specialized `SKILL.md` instructions into volume mounts for AI tools like the `browser` integration or `tinyfish`.
- **Intelligent Networking & Proxies:** Fully integrated reverse proxy generation (Caddy and Traefik) and auto-SSL domain generation.
- **Cross-Platform & Heterogeneous Topologies:** Supports generating stacks for `local` (Docker Desktop), `vps` (cloud), and `homelab` deployments. It explicitly supports a hybrid native-docker model via `deploymentType: "bare-metal"`.
- **GPU Passthrough Support:** Automatically injects NVIDIA or AMD runtime flags to AI services if the `gpuRequired` flag is detected on the requested service and enabled by the user.

## Programmatic API

You can use the generation engine programmatically within any Node.js or TypeScript application:

```typescript
import { generate, type GenerationInput } from "@better-openclaw/core";

const input: GenerationInput = {
	projectName: "my-openclaw-stack",
	services: ["postgres-database", "ollama-local-llm", "n8n-workflow"],
	skillPacks: ["ollama-local-llm", "n8n-workflows"],
	proxy: "caddy",
	domain: "my-ai.example.com",
	gpu: true,
	platform: "linux/amd64",
	deployment: "vps",
	deploymentType: "docker", // or "bare-metal"
	generateSecrets: true,
	openclawVersion: "latest",
	monitoring: true,
};

// Generates the Compose YAML, configs, skills, and .env securely.
const result = generate(input);

console.log(result.files["docker-compose.yaml"]); 
console.log(result.metadata.estimatedMemoryMB);
```

## Service Definition Format

The Core reads from `src/services/definitions/`. New services should expose a standardized `ServiceDefinition`:

```typescript
export const myCoolService: ServiceDefinition = {
	id: "my-cool-service",
	name: "Cool AI Service",
	description: "Provides an API for cool operations.",
	category: "tools",
	image: "cool/service:latest",
	ports: [{ port: 8080, public: true }],
	environment: { API_KEY: "${SECRET_KEY}" },
	dependsOn: ["postgres-database"],
};
```

## Adding Skills

Skills are markdown instructions or code bundles mapped to specific tools. They are defined in `skills/manifest.json`. During generation, if a `SkillPack` is explicitly selected or implicitly included via an auto-installing service, the Core locates the corresponding files and mounts them into the generated stack's Volume pathways.

## Development

```bash
pnpm build  # Compiles TypeScript via tsdown
pnpm test   # Executes integration tests verifying generating valid stacks
pnpm lint   # Executes Biome linting rules
```
