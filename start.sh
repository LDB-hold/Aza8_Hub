#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

C_RESET="\033[0m"
C_TITLE="\033[1;36m"
C_OK="\033[1;32m"
C_WARN="\033[1;33m"
C_ERR="\033[1;31m"

API_APP="apps/api-core"
WEB_APP="apps/web"
API_PORT="${API_PORT:-3001}"
WEB_PORT="${WEB_PORT:-3000}"
LOG_DIR="${LOG_DIR:-.Temp-logs}"
mkdir -p "$LOG_DIR"
START_TS="$(date '+%Y%m%d-%H%M%S')"
LOG_FILE="${LOG_FILE:-${LOG_DIR}/start-${START_TS}.log}"
mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"

CONSOLE_DEVICE="/dev/null"
if [[ -t 1 && -w /dev/tty ]]; then
  CONSOLE_DEVICE="/dev/tty"
fi

console_msg() {
  if [[ "$CONSOLE_DEVICE" == "/dev/null" ]]; then
    return
  fi
  local text="$1"
  local color="${2:-$C_RESET}"
  printf '%s%s%s\n' "$color" "$text" "$C_RESET" >"$CONSOLE_DEVICE"
}

console_divider() {
  local color="${1:-$C_RESET}"
  console_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "$color"
}

console_section() {
  local title=$1
  local color="${2:-$C_RESET}"
  console_msg "" "$C_RESET"
  console_divider "$color"
  console_msg "  $title" "$color"
  console_divider "$color"
}

console_msg_list_item() {
  local label=$1
  local value=$2
  local color="${3:-$C_RESET}"
  console_msg "  • ${label}: ${value}" "$color"
}

console_section "LOG OUTPUT" "$C_TITLE"
console_msg_list_item "Arquivo" "$LOG_FILE" "$C_TITLE"
console_msg_list_item "Monitorar" "tail -f $LOG_FILE" "$C_TITLE"

exec >>"$LOG_FILE" 2>&1

declare -a SERVICES_PIDS=()
declare -a SERVICES_NAMES=()
WARN_COUNT=0
ERROR_COUNT=0

console_status() {
  console_msg "[status] $*" "$C_OK"
}

console_alert() {
  console_msg "[alerta] $*" "$C_WARN"
}

ts() {
  date '+%Y-%m-%d %H:%M:%S'
}

banner() {
  printf "${C_TITLE}══════════════════════════════════════════${C_RESET}\n"
  printf "${C_TITLE}  Aza8 Hub – Inicialização (${START_TS})${C_RESET}\n"
  printf "${C_TITLE}  Log: %s${C_RESET}\n" "$LOG_FILE"
  printf "${C_TITLE}══════════════════════════════════════════${C_RESET}\n"
}

meta() {
  local node_ver pnpm_ver git_rev
  node_ver=$(command -v node >/dev/null 2>&1 && node -v || echo '-')
  pnpm_ver=$(command -v pnpm >/dev/null 2>&1 && pnpm -v || echo '-')
  git_rev=$(git rev-parse --short HEAD 2>/dev/null || echo '-')
  printf '[META][%s] node=%s | pnpm=%s | git=%s\n' "$(ts)" "$node_ver" "$pnpm_ver" "$git_rev"
  printf '[META][%s] TENANCY_ENFORCEMENT_MODE=%s | AUTH_MODE=%s\n' "$(ts)" "${TENANCY_ENFORCEMENT_MODE:-unknown}" "${AUTH_MODE:-mock}"
  printf '[META][%s] Ports api=%s web=%s\n' "$(ts)" "$API_PORT" "$WEB_PORT"
  printf '[META][%s] os=%s | shell=%s\n' "$(ts)" "$(uname -srv)" "${SHELL:-unknown}"
  printf '[META][%s] cwd=%s | user=%s\n' "$(ts)" "$ROOT_DIR" "${USER:-unknown}"
}

info() {
  printf '\n%s[%s][INFO]%s %s\n' "$C_OK" "$(ts)" "$C_RESET" "$*"
}

warn() {
  ((WARN_COUNT++))
  printf '\n%s[%s][WARN]%s %s\n' "$C_WARN" "$(ts)" "$C_RESET" "$*"
}

error() {
  ((ERROR_COUNT++))
  printf '\n%s[%s][ERROR]%s %s\n' "$C_ERR" "$(ts)" "$C_RESET" "$*" >&2
}

prefix_stream() {
  local tag=$1
  while IFS= read -r line; do
    printf '[%s][%s] %s\n' "$(ts)" "$tag" "$line"
  done
}

banner
meta

ensure_env_file() {
  local app_dir=$1
  shift
  local files=("$@")

  for f in "${files[@]}"; do
    if [[ -f "${app_dir}/${f}" ]]; then
      return
    fi
  done

  if [[ -f "${app_dir}/.env.example" ]]; then
    error "Missing env file in ${app_dir}. Copy ${app_dir}/.env.example to ${files[0]} and customize it before running this script."
  else
    error "Missing env file in ${app_dir}. Create ${files[0]} before running this script."
  fi
  exit 1
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

  console_status "Encerrando serviços..."
  info "Shutting down services..."
  for pid in "${SERVICES_PIDS[@]}"; do
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill "$pid" >/dev/null 2>&1 || true
      wait "$pid" 2>/dev/null || true
    fi
  done
  console_status "Serviços finalizados. Avisos: ${WARN_COUNT} | Erros: ${ERROR_COUNT}. Log: $LOG_FILE"
}

trap cleanup EXIT
trap 'info "Interrupted, stopping..."; exit 130' INT TERM

info "Running from ${ROOT_DIR}"

ensure_command pnpm
ensure_command lsof

ensure_env_file "$API_APP" ".env" ".env.local"

# Web can run with defaults, but warn if no env file is present.
if [[ ! -f "${WEB_APP}/.env" && ! -f "${WEB_APP}/.env.local" ]]; then
  warn "${WEB_APP}/.env.local not found. Defaults will be used. Copy ${WEB_APP}/.env.example to .env.local to customize."
fi

if [[ "${SKIP_INSTALL:-0}" != "1" ]]; then
  info "Installing dependencies (set SKIP_INSTALL=1 to skip)..."
  pnpm install
else
  info "Skipping dependency installation (SKIP_INSTALL=1)."
fi

info "Generating Prisma client..."
pnpm --filter @aza8/api-core prisma:generate

if [[ "${SKIP_MIGRATIONS:-0}" != "1" ]]; then
  info "Applying Prisma schema (set SKIP_MIGRATIONS=1 to skip)..."
  pnpm --filter @aza8/api-core prisma db push
else
  info "Skipping Prisma migrations (SKIP_MIGRATIONS=1)."
fi

if [[ "${SKIP_SEED:-0}" != "1" ]]; then
  info "Seeding deterministic data (tenants alpha/beta, roles/perms, installs)..."
  pnpm --filter @aza8/api-core prisma db seed
else
  info "Skipping seed (SKIP_SEED=1)."
fi

info "Checking required ports..."
ensure_port_free "$API_PORT"
ensure_port_free "$WEB_PORT"

start_service() {
  local name=$1
  shift

  info "Starting ${name}..."
  (
    "$@" \
      > >(prefix_stream "${name}") \
      2> >(prefix_stream "${name}")
  ) &
  local pid=$!
  SERVICES_PIDS+=("$pid")
  SERVICES_NAMES+=("$name")
  info "${name} running with PID ${pid}"
  console_status "${name} pronto (PID ${pid})"
}

start_service "API Core" env PORT="$API_PORT" pnpm --filter @aza8/api-core dev

# Give the API time to initialize before bringing up the web app.
sleep 2

NEXT_PUBLIC_API_URL_VALUE="${NEXT_PUBLIC_API_URL:-http://localhost:${API_PORT}}"
NEXT_PUBLIC_APP_URL_VALUE="${NEXT_PUBLIC_APP_URL:-http://localhost:${WEB_PORT}}"
NEXT_PUBLIC_APP_ENV_VALUE="${NEXT_PUBLIC_APP_ENV:-local}"
AUTH_MODE_VALUE="${AUTH_MODE:-mock}"

info "Web will start with AUTH_MODE=${AUTH_MODE_VALUE}, NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL_VALUE}, NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL_VALUE}"
info "Local tenants: map hub.localhost, alpha.localhost e beta.localhost para 127.0.0.1 em /etc/hosts."

start_service "Web" env \
  PORT="$WEB_PORT" \
  NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL_VALUE" \
  NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL_VALUE" \
  NEXT_PUBLIC_APP_ENV="$NEXT_PUBLIC_APP_ENV_VALUE" \
  AUTH_MODE="$AUTH_MODE_VALUE" \
  pnpm --filter @aza8/web dev

info "All services started. API: http://localhost:${API_PORT} | Web: http://localhost:${WEB_PORT} | Logs: ${LOG_FILE}"
info "Test links:"
info " - Hub:   http://hub.localhost:${WEB_PORT}/login"
info " - Tenant alpha: http://alpha.localhost:${WEB_PORT}/login"
info " - Tenant beta:  http://beta.localhost:${WEB_PORT}/login"
info "Mock login: use seeded emails (e.g., owner.alpha@client.com). Password field is ignored in mock mode (AUTH_MODE=mock)."

console_section "STATUS HUB" "$C_OK"
console_status "Servidores iniciados com sucesso."
console_msg_list_item "API" "http://localhost:${API_PORT}" "$C_OK"
console_msg_list_item "Web" "http://localhost:${WEB_PORT}" "$C_OK"
console_msg_list_item "Hub" "http://hub.localhost:${WEB_PORT}/login" "$C_OK"
console_msg_list_item "Tenants" "alpha.localhost / beta.localhost (127.0.0.1)" "$C_OK"
console_msg_list_item "Login mock" "owner.alpha@client.com | owner.beta@client.com (senha livre)" "$C_OK"
console_msg_list_item "Avisos/Erros" "${WARN_COUNT} / ${ERROR_COUNT}" "$C_OK"
console_msg_list_item "Log" "${LOG_FILE}" "$C_OK"

for pid in "${SERVICES_PIDS[@]}"; do
  wait "$pid"
done
