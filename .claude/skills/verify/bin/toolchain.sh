
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

static_output_of() {
  local root=$1 candidate
  for candidate in build dist/client dist; do
    [[ -f $root/apps/portal/$candidate/index.html ]] && { echo "$root/apps/portal/$candidate"; return; }
  done
  echo "no index.html under $root/apps/portal/{build,dist/client,dist} after the build" >&2
  return 1
}

build_static() {
  local root=$1 out=$2 log=$3 env_lines cmd output started=$SECONDS
  mapfile -t env_lines < <(app_env_of "$root")
  mapfile -t cmd < <(pm_command "$root")
  rm -rf "$root/apps/portal/build" "$root/apps/portal/dist"
  if ! (cd "$root/apps/portal" && env "${env_lines[@]}" NODE_OPTIONS=--max_old_space_size=10240 "${cmd[@]}" run build) > "$log" 2>&1; then
    tail -30 "$log" >&2
    echo "the build of $root failed (log: $log)" >&2
    return 1
  fi
  output=$(static_output_of "$root") || return 1
  rm -rf "$out" && mkdir -p "$(dirname "$out")" && cp -a "$output" "$out"
  echo "built $root in $((SECONDS - started))s into $out"
}
