#!/usr/bin/env bash
set -euo pipefail
for owned in /pnpm-store /side ${VERIFY_VOLUMES:-}; do
  [[ -d $owned ]] && chown "$HOST_UID:$HOST_GID" "$owned"
done
chown -R "$HOST_UID:$HOST_GID" /profile
exec setpriv --reuid="$HOST_UID" --regid="$HOST_GID" --clear-groups -- /opt/verify/start-chromium.sh
