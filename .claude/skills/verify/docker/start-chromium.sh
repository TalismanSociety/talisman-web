#!/usr/bin/env bash
set -euo pipefail
chromium=$(ls -d /ms-playwright/chromium-[0-9]*/chrome-linux*/chrome | head -n1)
extension=(--disable-extensions-except=/opt/talisman --load-extension=/opt/talisman)
[[ ${WALLET:-on} == off ]] && extension=(--disable-extensions)
rm -f /profile/Singleton*
exec xvfb-run --auto-servernum --server-args="-screen 0 1440x900x24" \
  "$chromium" \
  --user-data-dir=/profile \
  --remote-debugging-port=9223 \
  --no-sandbox \
  --no-first-run \
  --no-default-browser-check \
  --window-size=1440,900 \
  "${extension[@]}" \
  about:blank
