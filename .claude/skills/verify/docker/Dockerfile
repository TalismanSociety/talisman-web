# syntax=docker/dockerfile:1.7
FROM mcr.microsoft.com/playwright:v1.63.0-noble

RUN apt-get update \
  && apt-get install -y --no-install-recommends imagemagick unzip \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g agent-browser@0.38.1 \
  && npm install --prefix /opt/smoke-tools --no-audit --no-fund @polkadot/api@16.4.1 \
  && corepack enable

ARG TALISMAN_VERSION
ARG TALISMAN_CRX_URL="https://clients2.google.com/service/update2/crx?response=redirect&prodversion=140.0&acceptformat=crx2,crx3&x=id%3Dfijngjgcjhjmmpcmkeiomlglpeiijkld%26uc"
RUN curl -fsSL -o /tmp/talisman.crx "$TALISMAN_CRX_URL" \
  && mkdir -p /opt/talisman \
  && { unzip -q /tmp/talisman.crx -d /opt/talisman || [ $? -eq 1 ]; } \
  && node -e 'const { version } = require("/opt/talisman/manifest.json"); if (version !== process.argv[1]) throw new Error(`store served ${version}, expected ${process.argv[1]}`)' "${TALISMAN_VERSION:?}" \
  && rm /tmp/talisman.crx

COPY start-chromium.sh restore-backup.mjs bake-profile.sh entrypoint.sh /opt/verify/
RUN --mount=type=bind,from=seed,source=verify-backup.json,target=/seed/backup.json \
  /opt/verify/bake-profile.sh /seed/backup.json

RUN mkdir -p /home/verify /pnpm-store /side && chmod 1777 /home/verify \
  && echo "precedence ::ffff:0:0/96 100" >> /etc/gai.conf
ENV HOME=/home/verify \
  SMOKE_TOOLS=/opt/smoke-tools \
  pnpm_config_store_dir=/pnpm-store \
  pnpm_config_update_notifier=false \
  COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  SKIP_INSTALL_SIMPLE_GIT_HOOKS=1 \
  HUSKY=0 \
  WRANGLER_SEND_METRICS=false

ENTRYPOINT ["/opt/verify/entrypoint.sh"]
