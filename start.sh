#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# ANSI colors (use $'..' so escape codes are interpreted correctly in printf/echo)
C_RESET=$'\033[0m'
C_TITLE=$'\033[1;36m'
C_OK=$'\033[1;32m'
C_WARN=$'\033[1;33m'
C_ERR=$'\033[1;31m'

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
MAIN_PGID=$(ps -o pgid= $$ 2>/dev/null | tr -d ' ' || echo $$)

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

# Terminal: mostrar apenas status limpo; logs completos vão para o arquivo.
console_msg "======================================== AZA8 HUB - LOG OUTPUT ========================================" "$C_TITLE"
printf -v __line 'Arquivo     : %s' "$LOG_FILE"
console_msg "$__line" "$C_TITLE"
printf -v __line 'Monitorar   : %s' "tail -f $LOG_FILE"
console_msg "$__line" "$C_TITLE"
console_msg "================================================================================" "$C_TITLE"

# Redireciona stdout/stderr para o log, removendo sequências ANSI e CR (mantém o log legível).
exec > >(awk '{ gsub(/\r/, ""); gsub(/\033\[[0-9;]*[mK]/, ""); print }' >>"$LOG_FILE") 2>&1

declare -a SERVICES_PIDS=()
declare -a SERVICES_PGIDS=()
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

run_with_session() {
  if command -v setsid >/dev/null 2>&1; then
    setsid "$@"
  elif command -v python3 >/dev/null 2>&1; then
    python3 - "$@" <<'PY'
import os
import sys

os.setsid()
os.execvp(sys.argv[1], sys.argv[1:])
PY
  else
    "$@"
  fi
}

terminate_process_tree() {
  local root_pid=$1
  local signal=${2:-TERM}
  if [[ -z "$root_pid" ]]; then
    return
  fi
  if command -v pgrep >/dev/null 2>&1; then
    local child
    while IFS= read -r child; do
      [[ -z "$child" ]] && continue
      terminate_process_tree "$child" "$signal"
    done < <(pgrep -P "$root_pid" 2>/dev/null || true)
  fi
  kill "-${signal}" "$root_pid" >/dev/null 2>&1 || true
}

cleanup() {
  if [[ ${#SERVICES_PIDS[@]} -eq 0 ]]; then
    return
  fi

  console_status "Encerrando serviços..."
  info "Shutting down services..."

  for idx in "${!SERVICES_PIDS[@]}"; do
    local pgid="${SERVICES_PGIDS[$idx]:-}"
    local pid="${SERVICES_PIDS[$idx]:-}"
    if [[ -n "$pgid" && "$pgid" != "$MAIN_PGID" ]]; then
      kill -TERM -- "-${pgid}" >/dev/null 2>&1 || true
    fi
    if [[ -n "$pid" ]]; then
      terminate_process_tree "$pid" TERM
    fi
  done

  sleep 1

  for idx in "${!SERVICES_PIDS[@]}"; do
    local pgid="${SERVICES_PGIDS[$idx]:-}"
    local pid="${SERVICES_PIDS[$idx]:-}"
    if [[ -n "$pgid" && "$pgid" != "$MAIN_PGID" ]]; then
      if ps -o pid= -g "$pgid" 2>/dev/null | grep -q '.'; then
        kill -KILL -- "-${pgid}" >/dev/null 2>&1 || true
      fi
    fi
    if [[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1; then
      terminate_process_tree "$pid" KILL
    fi
  done

  SERVICES_PIDS=()
  SERVICES_PGIDS=()
  SERVICES_NAMES=()
  console_status "Serviços finalizados. Avisos: ${WARN_COUNT} | Erros: ${ERROR_COUNT}. Log: $LOG_FILE"
}

trap cleanup EXIT
trap 'info "Interrupted, stopping..."; cleanup; exit 130' INT TERM

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
  run_with_session "$@" \
    > >(prefix_stream "${name}") \
    2> >(prefix_stream "${name}") &
  local pid=$!
  local pgid
  pgid=$(ps -o pgid= "$pid" 2>/dev/null | tr -d ' ' || true)
  pgid=${pgid:-$pid}
  if [[ "$pgid" == "$MAIN_PGID" ]]; then
    pgid=$pid
  fi
  SERVICES_PIDS+=("$pid")
  SERVICES_PGIDS+=("$pgid")
  SERVICES_NAMES+=("$name")
  info "${name} running with PID ${pid} (PGID ${pgid})"
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

# Resumo final no terminal (sem caracteres "pesados" para evitar terminal "bagunçado").
console_msg "======================================== AZA8 HUB - STATUS ========================================" "$C_OK"
console_status "Servidores iniciados com sucesso."

console_msg "======================================== ENDPOINTS ========================================" "$C_OK"
printf -v __line '%-13s: %s' "API" "http://localhost:${API_PORT}"
console_msg "$__line" "$C_OK"
printf -v __line '%-13s: %s' "Web" "http://localhost:${WEB_PORT}"
console_msg "$__line" "$C_OK"
printf -v __line '%-13s: %s' "Hub" "http://hub.localhost:${WEB_PORT}/login"
console_msg "$__line" "$C_OK"
printf -v __line '%-13s: %s' "Design System" "http://hub.localhost:${WEB_PORT}/hub/design-system"
console_msg "$__line" "$C_OK"

console_msg "======================================== TENANTS ========================================" "$C_OK"
printf -v __line '%-13s: %s' "Tenants" "alpha.localhost / beta.localhost (127.0.0.1)"
console_msg "$__line" "$C_OK"

console_msg "======================================== LOGIN MOCK =======================================" "$C_OK"
printf -v __line '%-13s: %s' "Credenciais" "owner.alpha@client.com | owner.beta@client.com (senha livre)"
console_msg "$__line" "$C_OK"

console_msg "======================================== RESUMO ========================================" "$C_OK"
printf -v __line '%-13s: %s' "Avisos/Erros" "${WARN_COUNT} / ${ERROR_COUNT}"
console_msg "$__line" "$C_OK"
printf -v __line '%-13s: %s' "Log" "${LOG_FILE}"
console_msg "$__line" "$C_OK"

# Menu interativo (somente quando houver TTY)
if [[ -t 0 && -r /dev/tty ]]; then
  console_msg "" "$C_RESET"
  console_msg "----------------------------------------" "$C_TITLE"
  console_msg "  AÇÕES" "$C_TITLE"
  console_msg "----------------------------------------" "$C_TITLE"
  console_msg "> 1) Encerrar Serviços..." "$C_TITLE"
  console_msg "" "$C_RESET"
  printf '%sEscolha [1] (Enter = continuar): %s' "$C_TITLE" "$C_RESET" >"$CONSOLE_DEVICE"
  if IFS= read -r choice </dev/tty; then
    case "${choice:-}" in
      1)
        console_status "Solicitado: Encerrar Serviços."
        cleanup
        SERVICES_PIDS=()
        SERVICES_PGIDS=()
        SERVICES_NAMES=()
        exit 0
        ;;
      2)
        console_status "Solicitado: Reiniciar."
        cleanup
        SERVICES_PIDS=()
        SERVICES_PGIDS=()
        SERVICES_NAMES=()
        exec "$0" "$@"
        ;;
      "")
        : # continuar
        ;;
      *)
        console_alert "Opção inválida: ${choice}. Continuando em modo de espera." "$C_WARN"
        ;;
    esac
  fi
fi

for pid in "${SERVICES_PIDS[@]}"; do
  wait "$pid"
done
