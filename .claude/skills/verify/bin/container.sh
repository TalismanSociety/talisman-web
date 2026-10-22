#!/usr/bin/env bash
set -euo pipefail
bin=$(cd "$(dirname "$0")" && pwd)
root=${VERIFY_WORKTREE:?}
src=/side/src
log=$root/.tmp/verify/${VERIFY_INSTANCE:?}.log

pm_command() {
  local dir=$1 yarn_path
  if [[ -f $dir/pnpm-lock.yaml ]]; then
    echo pnpm
  elif yarn_path=$(sed -n 's/^yarnPath: *//p' "$dir/.yarnrc.yml" 2>/dev/null) && [[ -n $yarn_path ]]; then
    printf '%s\n' node "$dir/$yarn_path"
  elif [[ -f $dir/yarn.lock ]]; then
    echo yarn
  else
    echo "no pnpm-lock.yaml or yarn.lock in $dir" >&2
    return 1
  fi
}

pm() {
  local dir=$1 cmd
  mapfile -t cmd < <(pm_command "$dir")
  (cd "$dir" && "${cmd[@]}" "${@:2}")
}

install_deps() {
  local dir=$1
  if [[ -f $dir/pnpm-lock.yaml ]]; then pm "$dir" install --frozen-lockfile; else pm "$dir" install --immutable; fi
}

app_env_of() {
  node -e 'const { parseEnv } = require("node:util"); for (const [k, v] of Object.entries(parseEnv(require("node:fs").readFileSync(process.argv[1], "utf8")))) console.log(`${k}=${v}`)' \
    "$1/apps/portal/.env.example"
}

replace_source() {
  local next=/side/next dir
  rm -rf "$next" && mkdir -p "$next"
  "$@" | tar -x -C "$next"
  if [[ -d $src ]]; then
    while IFS= read -r dir; do
      mkdir -p "$next/$(dirname "$dir")"
      mv "$src/$dir" "$next/$dir"
    done < <(cd "$src" && find . -name node_modules -type d -prune)
  fi
  rm -rf "$src" /side/fingerprint && mv "$next" "$src"
}

build_worker() {
  local fingerprint=$1 env_lines cmd dist=$src/apps/portal/dist started=$SECONDS
  install_deps "$src" > /side/install.log 2>&1 || {
    tail -20 /side/install.log >&2
    echo "installing $fingerprint failed (log: /side/install.log in $VERIFY_INSTANCE)" >&2
    return 1
  }
  mapfile -t env_lines < <(app_env_of "$src")
  mapfile -t cmd < <(pm_command "$src")
  rm -rf "$dist"
  if ! (cd "$src" && env "${env_lines[@]}" CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false "${cmd[@]}" run build:portal) > /side/build.log 2>&1; then
    tail -30 /side/build.log >&2
    echo "the build:portal of $fingerprint failed (log: /side/build.log in $VERIFY_INSTANCE)" >&2
    return 1
  fi
  [[ -f $dist/server/wrangler.json && -f $dist/client/index.html ]] || {
    echo "$fingerprint built no Worker: no apps/portal/dist/server/wrangler.json with dist/client/index.html" >&2
    return 1
  }
  [[ ! -e $dist/server/.dev.vars ]] || { echo "the build of $fingerprint wrote local secrets to $dist/server/.dev.vars" >&2; return 1; }
  echo "$fingerprint" > /side/fingerprint
  echo "built the Worker of $fingerprint in $((SECONDS - started))s"
}

serve() {
  exec > "$log" 2>&1
  local status=0
  "$@" || status=$?
  echo "[verify] the server exited with status $status"
}

dev_server() {
  local app_env=()
  [[ -f $root/apps/portal/.env ]] || mapfile -t app_env < <(app_env_of "$root")
  cd "$root/apps/portal"
  env "${app_env[@]}" pnpm exec vite dev --strictPort --port 3002 --host 127.0.0.1
}

case ${1:-} in
  install) install_deps "$2" ;;
  sync-commit) replace_source cat ;;
  sync-worktree) replace_source tar -C "$root" --null --ignore-failed-read -T - -cf - ;;
  build) build_worker "$2" ;;
  dev) serve dev_server ;;
  worker) cd "$src" && serve node "$bin/worker.mjs" "$src" ;;
  proxy) serve node "$bin/proxy.mjs" "$2" ;;
  *)
    echo "usage: container.sh install <dir> | sync-commit | sync-worktree | build <fingerprint> | dev | worker | proxy <https://host>" >&2
    exit 2
    ;;
esac
