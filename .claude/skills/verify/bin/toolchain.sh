((BASH_VERSINFO[0] >= 4)) || { echo "Bash 4 or later is required, $BASH runs $BASH_VERSION (macOS: brew install bash): see Setup in $(dirname "${BASH_SOURCE[0]}")/../SKILL.md" >&2; exit 1; }

pm_command() {
  local root=$1 yarn_path
  if [[ -f $root/pnpm-lock.yaml ]]; then
    echo pnpm
  elif yarn_path=$(sed -n 's/^yarnPath: *//p' "$root/.yarnrc.yml" 2>/dev/null) && [[ -n $yarn_path ]]; then
    printf '%s\n' node "$root/$yarn_path"
  elif [[ -f $root/yarn.lock ]]; then
    echo yarn
  else
    echo "no pnpm-lock.yaml or yarn.lock in $root" >&2
    return 1
  fi
}

pm() {
  local root=$1 cmd
  mapfile -t cmd < <(pm_command "$root")
  (cd "$root" && "${cmd[@]}" "${@:2}")
}

install_deps() {
  local root=$1
  local -x HUSKY=0 SKIP_INSTALL_SIMPLE_GIT_HOOKS=1
  echo "installing $root with $(pm_command "$root" | tail -1 | xargs basename)"
  if [[ -f $root/pnpm-lock.yaml ]]; then
    pm "$root" install --frozen-lockfile
  else
    pm "$root" install --immutable
  fi
}

app_env_of() {
  node -e 'const { parseEnv } = require("node:util"); for (const [k, v] of Object.entries(parseEnv(require("node:fs").readFileSync(process.argv[1], "utf8")))) console.log(`${k}=${v}`)' \
    "$1/apps/portal/.env.example"
}

build_worker() {
  local root=$1 out=$2 log=$3 env_lines cmd dist=$1/apps/portal/dist started=$SECONDS
  mapfile -t env_lines < <(app_env_of "$root")
  mapfile -t cmd < <(pm_command "$root")
  rm -rf "$dist"
  if ! (cd "$root" && env "${env_lines[@]}" CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false "${cmd[@]}" run build:portal) > "$log" 2>&1; then
    tail -30 "$log" >&2
    echo "the build:portal of $root failed (log: $log)" >&2
    return 1
  fi
  [[ -f $dist/server/wrangler.json && -f $dist/client/index.html ]] || {
    echo "$root built no Worker: no apps/portal/dist/server/wrangler.json with dist/client/index.html" >&2
    return 1
  }
  [[ ! -e $dist/server/.dev.vars ]] || { echo "the build of $root wrote local secrets to $dist/server/.dev.vars" >&2; return 1; }
  rm -rf "$out" && mkdir -p "$(dirname "$out")" && cp -a "$dist" "$out"
  echo "built the Worker of $root in $((SECONDS - started))s into $out"
}
