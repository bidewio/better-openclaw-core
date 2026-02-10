/**
 * Generates helper shell scripts for managing the OpenClaw Docker Compose stack.
 *
 * Returns a map of file paths (relative to project root) to file contents.
 */
export function generateScripts(): Record<string, string> {
	const files: Record<string, string> = {};

	// ── scripts/start.sh ────────────────────────────────────────────────────

	files["scripts/start.sh"] = `#!/usr/bin/env bash
set -euo pipefail

# ─── OpenClaw Start Script ──────────────────────────────────────────────────
# Production-quality bootstrap: validates prerequisites, auto-generates secrets,
# creates required directories, and starts all services via Docker Compose.
# Modelled after the official docker-setup.sh patterns.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "🐾 OpenClaw — Starting services..."
echo ""

# ── Colour helpers (no-op when not a TTY) ────────────────────────────────────
if [ -t 1 ]; then
  RED='\\033[0;31m'; GREEN='\\033[0;32m'; YELLOW='\\033[1;33m'; CYAN='\\033[0;36m'; NC='\\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; CYAN=''; NC=''
fi

info()  { echo -e "\${CYAN}ℹ  $*\${NC}"; }
ok()    { echo -e "\${GREEN}✅ $*\${NC}"; }
warn()  { echo -e "\${YELLOW}⚠️  $*\${NC}"; }
err()   { echo -e "\${RED}❌ $*\${NC}" >&2; }

# ── Prerequisite checks ─────────────────────────────────────────────────────

if ! command -v docker &> /dev/null; then
  err "Docker is not installed. Please install Docker first."
  echo "   https://docs.docker.com/get-docker/"
  exit 1
fi

if ! docker compose version &> /dev/null; then
  err "Docker Compose (v2) is not available."
  echo "   https://docs.docker.com/compose/install/"
  exit 1
fi

if ! docker info &> /dev/null 2>&1; then
  err "Docker daemon is not running. Please start Docker."
  exit 1
fi

# ── Source .env if it exists ─────────────────────────────────────────────────

if [ -f ".env" ]; then
  info "Loading existing .env file..."
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
else
  warn ".env file not found — will create one from .env.example if available."
  if [ -f ".env.example" ]; then
    cp .env.example .env
    info "Created .env from .env.example"
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
  fi
fi

# ── Auto-generate OPENCLAW_GATEWAY_TOKEN if missing ──────────────────────────

if [ -z "\${OPENCLAW_GATEWAY_TOKEN:-}" ]; then
  info "Generating OPENCLAW_GATEWAY_TOKEN..."
  if command -v openssl &> /dev/null; then
    OPENCLAW_GATEWAY_TOKEN="$(openssl rand -hex 32)"
  elif command -v python3 &> /dev/null; then
    OPENCLAW_GATEWAY_TOKEN="$(python3 -c 'import secrets; print(secrets.token_hex(32))')"
  elif command -v python &> /dev/null; then
    OPENCLAW_GATEWAY_TOKEN="$(python -c 'import secrets; print(secrets.token_hex(32))')"
  else
    err "Cannot generate token: neither openssl nor python3 found."
    exit 1
  fi
  export OPENCLAW_GATEWAY_TOKEN

  # Persist into .env
  if [ -f ".env" ]; then
    if grep -q "^OPENCLAW_GATEWAY_TOKEN=" .env 2>/dev/null; then
      sed -i.bak "s|^OPENCLAW_GATEWAY_TOKEN=.*|OPENCLAW_GATEWAY_TOKEN=\${OPENCLAW_GATEWAY_TOKEN}|" .env && rm -f .env.bak
    else
      echo "OPENCLAW_GATEWAY_TOKEN=\${OPENCLAW_GATEWAY_TOKEN}" >> .env
    fi
  fi
  ok "Gateway token generated and saved."
fi

# ── Apply defaults for optional variables ────────────────────────────────────

export OPENCLAW_VERSION="\${OPENCLAW_VERSION:-latest}"
export OPENCLAW_GATEWAY_PORT="\${OPENCLAW_GATEWAY_PORT:-18789}"
export OPENCLAW_BRIDGE_PORT="\${OPENCLAW_BRIDGE_PORT:-18790}"
export OPENCLAW_GATEWAY_BIND="\${OPENCLAW_GATEWAY_BIND:-lan}"
export OPENCLAW_CONFIG_DIR="\${OPENCLAW_CONFIG_DIR:-./openclaw/config}"
export OPENCLAW_WORKSPACE_DIR="\${OPENCLAW_WORKSPACE_DIR:-./openclaw/workspace}"

# ── Create required host directories ────────────────────────────────────────

info "Ensuring host directories exist..."
mkdir -p "\${OPENCLAW_CONFIG_DIR}"
mkdir -p "\${OPENCLAW_WORKSPACE_DIR}"
ok "Directories ready: \${OPENCLAW_CONFIG_DIR}, \${OPENCLAW_WORKSPACE_DIR}"

# ── Check for empty secret values ────────────────────────────────────────────

EMPTY_SECRETS=0
while IFS='=' read -r key value; do
  [[ "$key" =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  if [[ "$key" =~ (PASSWORD|TOKEN|SECRET|SESSION_KEY|COOKIE) ]] && [[ -z "\${value:-}" ]]; then
    warn "Warning: $key is empty in .env"
    EMPTY_SECRETS=$((EMPTY_SECRETS + 1))
  fi
done < .env 2>/dev/null || true

if [ "$EMPTY_SECRETS" -gt 0 ]; then
  echo ""
  warn "$EMPTY_SECRETS secret(s) are empty. Some services may not function until they are set."
  echo ""
fi

# ── Pull and start ───────────────────────────────────────────────────────────

echo ""
info "Pulling latest images..."
docker compose pull --quiet 2>/dev/null || docker compose pull

echo ""
info "Starting services..."
docker compose up -d --remove-orphans

# ── Health-check loop ────────────────────────────────────────────────────────

echo ""
info "Waiting for services to become healthy..."
sleep 5

RETRIES=0
MAX_RETRIES=30
while [ $RETRIES -lt $MAX_RETRIES ]; do
  UNHEALTHY=$(docker compose ps --format json 2>/dev/null | grep -c '"unhealthy"' || true)
  STARTING=$(docker compose ps --format json 2>/dev/null | grep -c '"starting"' || true)

  if [ "$UNHEALTHY" -eq 0 ] && [ "$STARTING" -eq 0 ]; then
    break
  fi

  RETRIES=$((RETRIES + 1))
  sleep 2
done

echo ""
docker compose ps
echo ""

if [ $RETRIES -ge $MAX_RETRIES ]; then
  warn "Some services may still be starting. Check: docker compose ps"
else
  ok "All services are running!"
fi

# ── Print service URLs & token ───────────────────────────────────────────────

GATEWAY_HOST="localhost"
if [ "\${OPENCLAW_GATEWAY_BIND}" = "lan" ]; then
  GATEWAY_HOST="0.0.0.0"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo " 🐾 OpenClaw is ready!"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
echo "  Gateway URL:        http://\${GATEWAY_HOST}:\${OPENCLAW_GATEWAY_PORT}"
echo "  Bridge (WebSocket): ws://\${GATEWAY_HOST}:\${OPENCLAW_BRIDGE_PORT}"
echo "  Config directory:   \${OPENCLAW_CONFIG_DIR}"
echo "  Workspace directory:\${OPENCLAW_WORKSPACE_DIR}"
echo ""
echo "  Gateway Token:      \${OPENCLAW_GATEWAY_TOKEN}"
echo ""
echo "  Manage:"
echo "    Stop:   ./scripts/stop.sh"
echo "    Status: ./scripts/status.sh"
echo "    Update: ./scripts/update.sh"
echo "    Logs:   docker compose logs -f"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
`;

	// ── scripts/stop.sh ─────────────────────────────────────────────────────

	files["scripts/stop.sh"] = `#!/usr/bin/env bash
set -euo pipefail

# ─── OpenClaw Stop Script ───────────────────────────────────────────────────
# Gracefully stops all services.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "🐾 OpenClaw — Stopping services..."
echo ""

# Graceful shutdown with timeout
docker compose down --timeout 30

echo ""
echo "✅ All services stopped."
`;

	// ── scripts/update.sh ───────────────────────────────────────────────────

	files["scripts/update.sh"] = `#!/usr/bin/env bash
set -euo pipefail

# ─── OpenClaw Update Script ─────────────────────────────────────────────────
# Pulls latest images and restarts services.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "🐾 OpenClaw — Updating services..."
echo ""

# Pull latest images
echo "📦 Pulling latest images..."
docker compose pull

echo ""
echo "🔄 Restarting services with new images..."
docker compose up -d --remove-orphans

echo ""
echo "⏳ Waiting for services to stabilize..."
sleep 10

docker compose ps

echo ""
echo "✅ Update complete!"
`;

	// ── scripts/backup.sh ───────────────────────────────────────────────────

	files["scripts/backup.sh"] = `#!/usr/bin/env bash
set -euo pipefail

# ─── OpenClaw Backup Script ─────────────────────────────────────────────────
# Backs up all named Docker volumes to a timestamped directory.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$PROJECT_DIR/backups/$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

echo "🐾 OpenClaw — Backing up volumes..."
echo "   Backup directory: $BACKUP_DIR"
echo ""

# Get project name from docker compose
PROJECT_NAME=$(docker compose config --format json 2>/dev/null | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "openclaw")

# List all volumes for this project
VOLUMES=$(docker volume ls --filter "name=\${PROJECT_NAME}" --format "{{.Name}}" 2>/dev/null || true)

if [ -z "$VOLUMES" ]; then
  echo "⚠️  No volumes found for project: $PROJECT_NAME"
  echo "   Trying to list all openclaw volumes..."
  VOLUMES=$(docker volume ls --filter "name=openclaw" --format "{{.Name}}" 2>/dev/null || true)
fi

if [ -z "$VOLUMES" ]; then
  echo "❌ No volumes found to back up."
  exit 1
fi

BACKED_UP=0
for VOLUME in $VOLUMES; do
  echo "📦 Backing up: $VOLUME"
  docker run --rm \\
    -v "\${VOLUME}:/source:ro" \\
    -v "$BACKUP_DIR:/backup" \\
    alpine tar czf "/backup/\${VOLUME}.tar.gz" -C /source .

  SIZE=$(du -sh "$BACKUP_DIR/\${VOLUME}.tar.gz" | cut -f1)
  echo "   ✓ $VOLUME ($SIZE)"
  BACKED_UP=$((BACKED_UP + 1))
done

TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
echo ""
echo "✅ Backed up $BACKED_UP volume(s) ($TOTAL_SIZE total)"
echo "   Location: $BACKUP_DIR"
`;

	// ── scripts/status.sh ───────────────────────────────────────────────────

	files["scripts/status.sh"] = `#!/usr/bin/env bash
set -euo pipefail

# ─── OpenClaw Status Script ─────────────────────────────────────────────────
# Shows the current status of all services.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "🐾 OpenClaw — Service Status"
echo ""

# Show compose status
docker compose ps

echo ""
echo "── Resource Usage ──────────────────────────────────────────────────────"
echo ""

# Show resource usage
docker compose top 2>/dev/null || true

echo ""
echo "── Disk Usage ─────────────────────────────────────────────────────────"
echo ""

# Show volume sizes
docker system df -v 2>/dev/null | head -30 || docker system df 2>/dev/null || true

echo ""
echo "── Network ────────────────────────────────────────────────────────────"
echo ""

docker network ls --filter "name=openclaw" --format "table {{.Name}}\\t{{.Driver}}\\t{{.Scope}}" 2>/dev/null || true
`;

	return files;
}
