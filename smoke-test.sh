#!/usr/bin/env bash
# Smoke test for Launchpad self-hosted stack
set -u

START_TS=$(date +%Y-%m-%d-%H-%M-%S)
REPORT="smoke-test-report-${START_TS}.txt"
MAX_TOTAL_SECONDS=300  # 5 minutes
SECONDS=0

PASS=true

log() {
  echo "$(date +%H:%M:%S) - $*" | tee -a "$REPORT"
}

run_cmd() {
  local desc="$1"; shift
  log "RUN: ${desc}"
  { "$@" 2>&1 | tee -a "$REPORT"; } || {
    log "ERROR: command failed: ${desc}"
    PASS=false
    return 1
  }
}

wait_for_health() {
  # args: name url expected_code timeout_seconds
  local name="$1" url="$2" expected="${3:-200}" timeout="${4:-180}"
  local start=$SECONDS
  while true; do
    # global timeout
    if (( SECONDS >= MAX_TOTAL_SECONDS )); then
      log "ERROR: Global timeout (${MAX_TOTAL_SECONDS}s) reached while waiting for ${name}"
      PASS=false
      return 1
    fi
    if (( SECONDS - start > timeout )); then
      log "ERROR: Timeout (${timeout}s) waiting for ${name} at ${url}"
      PASS=false
      return 1
    fi
    code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || true)
    if [[ "$code" == "$expected" ]]; then
      log "OK: ${name} is responding with ${code}"
      return 0
    fi
    sleep 3
  done
}

section() {
  echo "" | tee -a "$REPORT"
  echo "===== $* =====" | tee -a "$REPORT"
}

section "Starting stack"
run_cmd "make up" make up

section "Waiting for containers to be up"
run_cmd "docker compose ps" docker compose ps

# Wait for MySQL health (container has a healthcheck)
if docker inspect -f '{{.State.Health.Status}}' lp-mysql >/dev/null 2>&1; then
  start=$SECONDS
  while true; do
    status=$(docker inspect -f '{{.State.Health.Status}}' lp-mysql 2>/dev/null || echo "unknown")
    log "lp-mysql health: $status"
    [[ "$status" == "healthy" ]] && break
    if (( SECONDS - start > 180 )) || (( SECONDS > MAX_TOTAL_SECONDS )); then
      log "ERROR: MySQL did not become healthy in time"
      PASS=false
      break
    fi
    sleep 3
  done
else
  log "WARN: Could not find lp-mysql container health; continuing"
fi

section "Applying DB migrations"
run_cmd "make migrate" make migrate || true

section "Health checks (direct)"
# Backend direct
curl -s -i http://localhost:9000/health | tee -a "$REPORT" >/dev/null || true
wait_for_health "Backend health" "http://localhost:9000/health" 200 120 || true

# Frontend direct
curl -s -i http://localhost:3000/ | head -n 20 | tee -a "$REPORT" >/dev/null || true
wait_for_health "Frontend" "http://localhost:3000/" 200 120 || true

section "Health checks (reverse proxy)"
# Reverse proxy health
curl -s -i http://localhost/health | tee -a "$REPORT" >/dev/null || true
wait_for_health "Reverse proxy health" "http://localhost/health" 200 120 || true

# Reverse proxy frontend
curl -s -i http://localhost/ | head -n 20 | tee -a "$REPORT" >/dev/null || true
wait_for_health "Reverse proxy frontend" "http://localhost/" 200 120 || true

section "Final service status"
run_cmd "docker compose ps" docker compose ps || true

# Summarize
section "Summary"
if $PASS; then
  log "SMOKE TEST: SUCCESS"
  exit 0
else
  log "SMOKE TEST: FAILURE"
  exit 1
fi

