#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

API_APP="apps/api-core"
HUB_APP="apps/hub-web"
PORTAL_APP="apps/portal-web"

declare -a SERVICES_PIDS=()
declare -a SERVICES_NAMES=()

info() {
  printf '\n[%s] %s\n' "$(date '+%H:%M:%S')" "$*"
}

error() {
  printf '\nERROR: %s\n' "$*" >&2
}

ensure_env_file() {
  local app_dir=$1
  if [[ ! -f "${app_dir}/.env" ]]; then
    error "Missing ${app_dir}/.env. Copy ${app_dir}/.env.example and customize it before running this script."
    exit 1
  fi
}

ensure_command() {
  local cmd=$1
  if ! command -v "$cmd" >/dev/null 2>&1; then
    error "'$cmd' is required but was not found in PATH."
    exit 1
  fi
}

cleanup() {
  if [[ ${#SERVICES_PIDS[@]} -eq 0 ]]; then
    return
  fi

  info "Shutting down services..."
  for pid in "${SERVICES_PIDS[@]}"; do
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill "$pid" >/dev/null 2>&1 || true
      wait "$pid" 2>/dev/null || true
    fi
  done
}

trap cleanup EXIT
trap 'info "Interrupted, stopping..."; exit 130' INT TERM

info "Running from ${ROOT_DIR}"

ensure_command pnpm

ensure_env_file "$API_APP"
ensure_env_file "$HUB_APP"
ensure_env_file "$PORTAL_APP"

if [[ "${SKIP_INSTALL:-0}" != "1" ]]; then
  info "Installing dependencies (set SKIP_INSTALL=1 to skip)..."
  pnpm install
else
  info "Skipping dependency installation (SKIP_INSTALL=1)."
fi

info "Generating Prisma client..."
pnpm --filter @aza8/api-core prisma:generate

if [[ "${SKIP_MIGRATIONS:-0}" != "1" ]]; then
  info "Applying Prisma migrations (set SKIP_MIGRATIONS=1 to skip)..."
  pnpm --filter @aza8/api-core prisma:migrate
else
  info "Skipping Prisma migrations (SKIP_MIGRATIONS=1)."
fi

start_service() {
  local name=$1
  shift

  info "Starting ${name}..."
  ("$@") &
  local pid=$!
  SERVICES_PIDS+=("$pid")
  SERVICES_NAMES+=("$name")
  info "${name} running with PID ${pid}"
}

start_service "API Core" pnpm --filter @aza8/api-core dev

# Give the API time to initialize before bringing up the web apps.
sleep 2

start_service "Hub Web" pnpm --filter @aza8/hub-web dev
start_service "Portal Web" pnpm --filter @aza8/portal-web dev

info "All services started. Press Ctrl+C to stop everything."

for pid in "${SERVICES_PIDS[@]}"; do
  wait "$pid"
done
