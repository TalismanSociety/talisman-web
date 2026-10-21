#!/usr/bin/env bash
set -euo pipefail
IFS=: read -ra volumes <<<"${VERIFY_VOLUMES:-}"
for owned in /pnpm-store /side "${volumes[@]}"; do
  [[ -d $owned ]] && chown "$HOST_UID:$HOST_GID" "$owned"
done
chown -R "$HOST_UID:$HOST_GID" /profile
exec setpriv --reuid="$HOST_UID" --regid="$HOST_GID" --clear-groups -- /opt/verify/start-chromium.sh
