#!/usr/bin/env bash
set -euo pipefail
/opt/verify/start-chromium.sh > /tmp/chromium.log 2>&1 &
for _ in $(seq 1 60); do curl -sf localhost:9223/json/version > /dev/null && break; sleep 1; done
curl -sf localhost:9223/json/version > /dev/null || { cat /tmp/chromium.log; exit 1; }
node /opt/verify/restore-backup.mjs "$1"
node --input-type=module -e '
  const { webSocketDebuggerUrl } = await (await fetch("http://localhost:9223/json/version")).json()
  const socket = new WebSocket(webSocketDebuggerUrl)
  socket.onopen = () => socket.send(JSON.stringify({ id: 1, method: "Browser.close" }))
  socket.onclose = () => process.exit(0)
'
for _ in $(seq 1 30); do pgrep -f /profile > /dev/null || break; sleep 1; done
rm -f /profile/Singleton* /tmp/chromium.log
