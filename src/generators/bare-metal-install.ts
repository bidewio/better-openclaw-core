/**
 * Generates platform-specific installer scripts for bare-metal (VPS, computer) deployment.
 * Each script ensures Docker and Docker Compose are installed, then runs the stack.
 * Returns a map of one file: install.sh (Linux/macOS) or install.ps1 (Windows).
 */
import type { Platform } from "../types.js";

const LINUX_SCRIPT_PREFIX_NATIVE = `
# Native services (install/start on host first)
if [ -f "native/install-linux.sh" ]; then
  info "Installing and starting native services..."
  bash native/install-linux.sh
  ok "Native services ready."
fi
`;

const LINUX_SCRIPT = `#!/usr/bin/env bash
set -euo pipefail

# OpenClaw bare-metal installer (Linux)
# Optionally runs native services script, then Docker + Compose.
# Idempotent: safe to re-run.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ -t 1 ]; then
  RED='\\033[0;31m'; GREEN='\\033[0;32m'; YELLOW='\\033[1;33m'; CYAN='\\033[0;36m'; NC='\\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; CYAN=''; NC=''
fi
info()  { echo -e "\${CYAN}ℹ  $*\${NC}"; }
ok()    { echo -e "\${GREEN}✅ $*\${NC}"; }
warn()  { echo -e "\${YELLOW}⚠️  $*\${NC}"; }
err()   { echo -e "\${RED}❌ $*\${NC}" >&2; }
__NATIVE_BLOCK__
# Install Docker if missing
if ! command -v docker &> /dev/null; then
  info "Installing Docker..."
  if command -v apt-get &> /dev/null; then
    sudo apt-get update -qq
    sudo apt-get install -y -qq ca-certificates curl
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker "$USER" 2>/dev/null || true
    ok "Docker installed. You may need to log out and back in for group changes."
  elif command -v dnf &> /dev/null || command -v yum &> /dev/null; then
    sudo dnf install -y dnf-plugins-core 2>/dev/null || sudo yum install -y yum-utils
    sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo 2>/dev/null || sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin 2>/dev/null || sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo systemctl enable --now docker
    sudo usermod -aG docker "$USER" 2>/dev/null || true
    ok "Docker installed."
  else
    err "Unsupported package manager. Install Docker manually: https://docs.docker.com/engine/install/"
    exit 1
  fi
else
  ok "Docker already installed."
fi

if ! docker compose version &> /dev/null; then
  err "Docker Compose (v2) plugin not found. Install it: https://docs.docker.com/compose/install/"
  exit 1
fi

if ! docker info &> /dev/null 2>&1; then
  err "Docker daemon not running. Start it (e.g. sudo systemctl start docker) and re-run this script."
  exit 1
fi

# Use project start script if present, else docker compose up
if [ -f "scripts/start.sh" ]; then
  info "Starting stack via scripts/start.sh..."
  bash scripts/start.sh
else
  if [ -f ".env.example" ] && [ ! -f ".env" ]; then cp .env.example .env; fi
  info "Starting stack..."
  docker compose up -d --remove-orphans
  echo ""
  ok "Stack started. Gateway: http://localhost:\${OPENCLAW_GATEWAY_PORT:-18789}"
fi
`;

const MACOS_SCRIPT_PREFIX_NATIVE = `
if [ -f "native/install-macos.sh" ]; then
  info "Installing and starting native services..."
  bash native/install-macos.sh
  ok "Native services ready."
fi
`;

const MACOS_SCRIPT = `#!/usr/bin/env bash
set -euo pipefail

# OpenClaw bare-metal installer (macOS)
# Optionally runs native services, then Docker Desktop + compose.
# Idempotent: safe to re-run.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ -t 1 ]; then
  RED='\\033[0;31m'; GREEN='\\033[0;32m'; YELLOW='\\033[1;33m'; CYAN='\\033[0;36m'; NC='\\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; CYAN=''; NC=''
fi
info()  { echo -e "\${CYAN}ℹ  $*\${NC}"; }
ok()    { echo -e "\${GREEN}✅ $*\${NC}"; }
warn()  { echo -e "\${YELLOW}⚠️  $*\${NC}"; }
err()   { echo -e "\${RED}❌ $*\${NC}" >&2; }
__NATIVE_BLOCK__
if ! command -v docker &> /dev/null; then
  if command -v brew &> /dev/null; then
    info "Installing Docker via Homebrew..."
    brew install --cask docker
    warn "Docker Desktop was installed. Please open Docker from Applications, then re-run this script."
    exit 0
  else
    err "Docker not found. Install Docker Desktop from https://docs.docker.com/desktop/install/mac-install/ or run: brew install --cask docker"
    exit 1
  fi
fi

if ! docker info &> /dev/null 2>&1; then
  err "Docker daemon not running. Open Docker Desktop from Applications, then re-run this script."
  exit 1
fi

if ! docker compose version &> /dev/null; then
  err "Docker Compose (v2) not available. Ensure Docker Desktop is up to date."
  exit 1
fi

if [ -f "scripts/start.sh" ]; then
  info "Starting stack via scripts/start.sh..."
  bash scripts/start.sh
else
  if [ -f ".env.example" ] && [ ! -f ".env" ]; then cp .env.example .env; fi
  info "Starting stack..."
  docker compose up -d --remove-orphans
  echo ""
  ok "Stack started. Gateway: http://localhost:\${OPENCLAW_GATEWAY_PORT:-18789}"
fi
`;

const WINDOWS_SCRIPT_PREFIX_NATIVE = `
if (Test-Path "native/install-windows.ps1") {
  Info "Installing and starting native services..."
  & .\\native\\install-windows.ps1
  Ok "Native services ready."
}
`;

const WINDOWS_SCRIPT = `# OpenClaw bare-metal installer (Windows PowerShell)
# Optionally runs native services, then Docker Desktop + compose.
# Idempotent: safe to re-run. Run in PowerShell as Administrator if installing Docker.

$ErrorActionPreference = "Stop"
$ProjectDir = $PSScriptRoot
Set-Location $ProjectDir

function Info { Write-Host "  $args" -ForegroundColor Cyan }
function Ok   { Write-Host "  $args" -ForegroundColor Green }
function Warn { Write-Host "  $args" -ForegroundColor Yellow }
function Err  { Write-Host "  $args" -ForegroundColor Red; exit 1 }
__NATIVE_BLOCK__
# Check Docker
$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
  Write-Host ""
  Write-Host "  Docker not found." -ForegroundColor Red
  Write-Host "  Install Docker Desktop from: https://docs.docker.com/desktop/install/windows-install/"
  Write-Host "  Then restart PowerShell and run this script again."
  exit 1
}

try { docker info 2>$null | Out-Null } catch {
  Write-Host ""
  Write-Host "  Docker daemon is not running." -ForegroundColor Red
  Write-Host "  Start Docker Desktop from the Start menu, then run this script again."
  exit 1
}

try { docker compose version 2>$null | Out-Null } catch {
  Write-Host ""
  Write-Host "  Docker Compose (v2) not available. Update Docker Desktop." -ForegroundColor Red
  exit 1
}

Ok "Docker is ready."

# Prepare .env
if (-not (Test-Path ".env")) {
  if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env"
    Info "Created .env from .env.example"
  }
}

# Create dirs
$configDir = if ($env:OPENCLAW_CONFIG_DIR) { $env:OPENCLAW_CONFIG_DIR } else { "./openclaw/config" }
$workspaceDir = if ($env:OPENCLAW_WORKSPACE_DIR) { $env:OPENCLAW_WORKSPACE_DIR } else { "./openclaw/workspace" }
New-Item -ItemType Directory -Force -Path $configDir | Out-Null
New-Item -ItemType Directory -Force -Path $workspaceDir | Out-Null
Ok "Directories ready."

# Start stack
Info "Starting stack..."
docker compose up -d --remove-orphans

$port = if ($env:OPENCLAW_GATEWAY_PORT) { $env:OPENCLAW_GATEWAY_PORT } else { "18789" }
Write-Host ""
Ok "Stack started. Gateway: http://localhost:$port"
`;

export interface BareMetalInstallOptions {
	platform: Platform;
	projectName: string;
	/** When true, top-level script runs native/install-*.sh|ps1 first, then Docker + compose. */
	hasNativeServices?: boolean;
}

/**
 * Returns one file: install.sh (Linux/macOS) or install.ps1 (Windows).
 * When hasNativeServices is true, the script runs the native installer first, then Docker + compose.
 */
export function generateBareMetalInstall(options: BareMetalInstallOptions): Record<string, string> {
	const { platform, hasNativeServices } = options;
	const files: Record<string, string> = {};

	if (platform === "windows/amd64") {
		const script = hasNativeServices
			? WINDOWS_SCRIPT.replace("__NATIVE_BLOCK__", WINDOWS_SCRIPT_PREFIX_NATIVE)
			: WINDOWS_SCRIPT.replace("__NATIVE_BLOCK__", "");
		files["install.ps1"] = script;
		return files;
	}

	const isMac = platform.startsWith("macos/");
	const baseScript = isMac ? MACOS_SCRIPT : LINUX_SCRIPT;
	const prefix = hasNativeServices
		? isMac
			? MACOS_SCRIPT_PREFIX_NATIVE
			: LINUX_SCRIPT_PREFIX_NATIVE
		: "";
	const script = baseScript.replace("__NATIVE_BLOCK__", prefix);
	files["install.sh"] = script;
	return files;
}
