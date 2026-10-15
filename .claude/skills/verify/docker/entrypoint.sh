#!/usr/bin/env bash
set -euo pipefail
mkdir -p /tmp/logs
/opt/verify/start-chromium.sh > /tmp/logs/chromium.log 2>&1 &
socat TCP-LISTEN:9224,fork,reuseaddr TCP:127.0.0.1:9223 > /tmp/logs/cdp-relay.log 2>&1 &
socat TCP-LISTEN:3002,bind=127.0.0.1,fork,reuseaddr "${APP_UPSTREAM:?}" > /tmp/logs/app-relay.log 2>&1 &
wait -n
