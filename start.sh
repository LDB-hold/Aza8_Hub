#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

API_APP="apps/api-core"
WEB_APP="apps/web"
API_PORT="${API_PORT:-3005}"
WEB_PORT="${WEB_PORT:-3000}"
LOG_FILE="${LOG_FILE:-/tmp/aza8-start.log}"

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

ensure_port_free() {
  local port=$1
  if lsof -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
    error "Port ${port} is already in use. Set API_PORT/WEB_PORT or stop the process using it."
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
ensure_command lsof

ensure_env_file "$API_APP"

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

info "Checking required ports..."
ensure_port_free "$API_PORT"
ensure_port_free "$WEB_PORT"

start_service() {
  local name=$1
  shift

  info "Starting ${name}..."
  ("$@") >>"$LOG_FILE" 2>&1 &
  local pid=$!
  SERVICES_PIDS+=("$pid")
  SERVICES_NAMES+=("$name")
  info "${name} running with PID ${pid}"
}

start_service "API Core" env PORT="$API_PORT" pnpm --filter @aza8/api-core dev

# Give the API time to initialize before bringing up the web app.
sleep 2

start_service "Web" env PORT="$WEB_PORT" NEXT_PUBLIC_API_URL="http://localhost:${API_PORT}" pnpm --filter @aza8/web dev

info "All services started. API: http://localhost:${API_PORT} | Web: http://localhost:${WEB_PORT} | Logs: ${LOG_FILE}"

for pid in "${SERVICES_PIDS[@]}"; do
  wait "$pid"
done
