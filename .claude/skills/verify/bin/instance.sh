#!/usr/bin/env bash
set -euo pipefail
bin=$(cd "$(dirname "$0")" && pwd)
docker_dir=$(cd "$bin/../docker" && pwd)
root=$(git rev-parse --show-toplevel)
main=$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")
app_dir=$root/apps/portal
state_dir=$root/.tmp/verify
image=talisman-web-verify
network=${TALISMAN_WEB_VERIFY_NETWORK:-talisman-web-verify}
label=talisman-web-verify.checkout
store_id=fijngjgcjhjmmpcmkeiomlglpeiijkld
seed=$HOME/.talisman-dev
backup=$seed/verify-backup.json
slug=$(basename "$root" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9\n' '-')-$(node -p "require('crypto').createHash('sha1').update(process.argv[1]).digest('hex').slice(0, 6)" "$root")

# shellcheck source=toolchain.sh
. "$bin/toolchain.sh"

select_instance() {
  instance_id=$1
  if [[ $instance_id == dev ]]; then
    state=$state_dir/instance.env name=talisman-web-verify-$slug
  else
    state=$state_dir/$instance_id.env name=talisman-web-verify-$slug-$instance_id
  fi
  app_socket_dir=${XDG_RUNTIME_DIR:-/tmp}/talisman-web-verify/${slug##*-}-$instance_id
  server_log=$state_dir/$instance_id.log
}

mtime() { node -p "Math.floor(require('fs').statSync(process.argv[1]).mtimeMs / 1000)" "$1"; }
state_get() { [[ -f $state ]] && sed -n "s/^$1=//p" "$state" || true; }
listener_pid() { lsof -t -nP -iTCP:"$1" -sTCP:LISTEN 2>/dev/null | head -1; }
pid_cwd() { lsof -a -p "$1" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p'; }
serves_this_checkout() {
  local pid
  pid=$(listener_pid "$1")
  [[ -n $pid && $(pid_cwd "$pid") == "$app_dir" ]]
}
group_runs_here() {
  local pid
  [[ -n $1 ]] || return 1
  for pid in $(pgrep -g "$1"); do
    [[ $(pid_cwd "$pid") == "$app_dir" ]] && return 0
  done
  return 1
}
owns_app_server() {
  local pgid=$1 pid
  [[ -n $pgid && -n $2 ]] || return 1
  pid=$(listener_pid "$2")
  while ((pid > 1)); do
    [[ $(ps -o pgid= -p "$pid" | tr -d ' ') == "$pgid" ]] && return 0
    pid=$(ps -o ppid= -p "$pid" | tr -d ' ') || return 1
  done
  return 1
}
native_linux_engine() { [[ $(uname) == Linux && $(docker info -f '{{.OperatingSystem}}') != "Docker Desktop" ]]; }
app_upstream() {
  if native_linux_engine; then echo UNIX-CONNECT:/run/app-socket/app.sock; else echo "TCP:host.docker.internal:$1"; fi
}
app_socket_answers() {
  native_linux_engine || return 0
  curl -sf -o /dev/null --max-time 5 --unix-socket "$app_socket_dir/app.sock" http://localhost/
}
usage() { echo "usage: $0 build | up | serve <id> <Worker build dir or https://host> [--no-wallet] | down | ls"; }
container_state() { docker inspect -f '{{.State.Status}}' "$name" 2>/dev/null || echo absent; }
attached_networks() { docker inspect -f '{{range $k, $v := .NetworkSettings.Networks}}{{println $k}}{{end}}' "$name" | sed '/^$/d'; }
container_env() { docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$name" | sed -n "s/^$1=//p"; }
cdp_port_of() { docker inspect -f '{{(index (index .HostConfig.PortBindings "9224/tcp") 0).HostPort}}' "$1"; }

free_port() {
  local from=$1 to=$2 taken
  taken=$(docker ps -a --filter "label=$label" --format '{{.Names}}' | while read -r other; do
    cdp_port_of "$other"
  done)
  for candidate in $(seq "$from" "$to"); do
    grep -qx "$candidate" <<<"$taken" && continue
    [[ -n $(listener_pid "$candidate") ]] && continue
    echo "$candidate"
    return
  done
  echo "no free port in $from-$to" >&2
  exit 1
}

store_version() {
  curl -fsS "https://clients2.google.com/service/update2/crx?response=updatecheck&prodversion=140.0&acceptformat=crx3&x=id%3D$store_id%26uc" |
    sed -n 's/.*<updatecheck [^>]* version="\([0-9.]*\)".*/\1/p'
}

build() {
  [[ -f $backup ]] || { echo "missing $backup: see Setup in $bin/../SKILL.md" >&2; exit 1; }
  local version backup_mtime
  version=$(store_version)
  [[ -n $version ]] || { echo "could not read Talisman's version from the Chrome Web Store" >&2; exit 1; }
  backup_mtime=$(mtime "$backup")
  docker build -t "$image" \
    --build-arg "TALISMAN_VERSION=$version" --build-arg "BACKUP_MTIME=$backup_mtime" \
    --label "talisman-web-verify.talisman-version=$version" --label "talisman-web-verify.backup-mtime=$backup_mtime" \
    --build-context seed="$seed" "$docker_dir"
  echo "image $image: Talisman $version from the Chrome Web Store, wallet restored from $backup"
}

warn_if_stale_image() {
  local baked
  baked=$(docker image inspect -f '{{index .Config.Labels "talisman-web-verify.backup-mtime"}}' "$image")
  [[ $baked == "$(mtime "$backup")" ]] ||
    echo "WARN $backup changed since the image was built: instance.sh build, then up again" >&2
}

ensure_checkout_ready() {
  [[ -d $root/node_modules ]] || install_deps "$root"
}

stop_app_server() {
  kill -- "-$1" 2>/dev/null || true
  for _ in $(seq 1 20); do pgrep -g "$1" >/dev/null || return 0; sleep 0.5; done
  kill -9 -- "-$1" 2>/dev/null || true
}

dev_server_command() {
  mkdir -p "$app_dir/node_modules/.vite-verify"
  cat > "$app_dir/node_modules/.vite-verify/vite.config.mjs" <<'CONFIG'
import { mergeConfig } from "vite"
import appConfig from "../../vite.config.ts"

export default mergeConfig(appConfig, { cacheDir: "node_modules/.vite-verify/deps" })
CONFIG
  local app_env=() pm_cmd
  [[ -f $app_dir/.env ]] || mapfile -t app_env < <(app_env_of "$root")
  mapfile -t pm_cmd < <(pm_command "$root")
  server=(env "${app_env[@]}" "${pm_cmd[@]}" exec vite dev --config node_modules/.vite-verify/vite.config.mjs --strictPort --port)
}

start_app_server() {
  mkdir -p "$app_socket_dir"
  for _ in 1 2 3 4 5; do
    launch_app_server && return
    stop_app_server "$app_pgid"
    grep -q "already in use" "$server_log" || { tail -20 "$server_log" >&2; echo "the $instance_id server exited" >&2; exit 1; }
    echo "another server took :$app_port first, picking another port"
  done
  echo "no free app port after 5 tries" >&2
  exit 1
}

launch_app_server() {
  local port pgid
  port=$(free_port 3200 3299)
  set -m
  (
    cd "$app_dir"
    if native_linux_engine; then node "$bin/app-socket.mjs" "$app_socket_dir/app.sock" "$port" > "$state_dir/$instance_id.app-socket.log" 2>&1 & fi
    exec nohup "${server[@]}" "$port" > "$server_log" 2>&1
  ) &
  pgid=$!
  set +m
  app_port=$port app_pgid=$pgid
  for _ in $(seq 1 180); do
    owns_app_server "$pgid" "$port" && curl -sf -o /dev/null "http://localhost:$port/" && return
    kill -0 "$pgid" 2>/dev/null || return 1
    sleep 1
  done
  tail -20 "$server_log" >&2
  echo "the $instance_id server did not answer on :$port within 180s" >&2
  exit 1
}

ensure_isolated_network() {
  local icc
  docker network inspect "$network" >/dev/null 2>&1 ||
    docker network create -o com.docker.network.bridge.enable_icc=false "$network" >/dev/null 2>&1 || true
  icc=$(docker network inspect -f '{{index .Options "com.docker.network.bridge.enable_icc"}}' "$network")
  [[ $icc == false ]] || {
    echo "network $network allows inter-container traffic, so other containers could reach the wallet's CDP: docker network rm $network once no container uses it, then up" >&2
    exit 1
  }
}

create_container() {
  local error
  mkdir -p "$app_socket_dir"
  for _ in 1 2 3 4 5; do
    error=$(docker run -d --init --name "$name" --label "$label=$root" --label "talisman-web-verify.instance=$instance_id" \
      --network "$network" --shm-size=2g --memory=4g --memory-swap=4g \
      -p "127.0.0.1:$(free_port 9500 9599):9224" -e "APP_PORT=$1" -e "APP_UPSTREAM=$(app_upstream "$1")" -e "WALLET=$wallet" \
      -v "$app_socket_dir:/run/app-socket" \
      --add-host=host.docker.internal:host-gateway "$image" 2>&1 >/dev/null) && return
    docker rm -f "$name" >/dev/null 2>&1
    grep -q "port is already allocated" <<<"$error" || { echo "$error" >&2; exit 1; }
  done
  echo "no free CDP port after 5 tries" >&2
  exit 1
}

close_blank_tabs() {
  node --input-type=module -e '
    const cdp = `http://127.0.0.1:${process.argv[1]}/json`
    const pages = (await (await fetch(`${cdp}/list`)).json()).filter((t) => t.type === "page")
    const blank = pages.filter((t) => t.url === "about:blank")
    const lastPageStaysOpen = blank.length === pages.length ? 1 : 0
    const stray = blank.slice(lastPageStaysOpen)
    for (const tab of stray) await fetch(`${cdp}/close/${tab.id}`)
    if (stray.length) console.log(`closed ${stray.length} about:blank tab${stray.length > 1 ? "s" : ""}`)
  ' "$1"
}

check_prerequisites() {
  local setup="see Setup in $bin/../SKILL.md"
  docker info >/dev/null 2>&1 || { echo "Docker is not running or not installed: $setup" >&2; exit 1; }
  for tool in curl lsof jq; do
    command -v "$tool" >/dev/null || { echo "$tool is not installed: $setup" >&2; exit 1; }
  done
  command -v agent-browser >/dev/null || { echo "agent-browser is not installed (npm install -g agent-browser): $setup" >&2; exit 1; }
  node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major > 22 || (major === 22 && minor >= 18) ? 0 : 1)' ||
    { echo "Node 22.18 or later is required: $setup" >&2; exit 1; }
  [[ -f $backup ]] || { echo "missing $backup: $setup" >&2; exit 1; }
  [[ -f $seed/verify-password ]] || { echo "missing $seed/verify-password: $setup" >&2; exit 1; }
}

ensure_container() {
  started=yes
  case $(container_state) in
    running | exited | created)
      if [[ $(container_env APP_PORT) != "$app_port" || $(container_env APP_UPSTREAM) != "$(app_upstream "$app_port")" ||
        $(container_env WALLET) != "$wallet" ||
        $(docker inspect -f '{{.Image}}' "$name") != $(docker image inspect -f '{{.Id}}' "$image") ||
        $(attached_networks) != "$network" ]]; then
        docker rm -f "$name" >/dev/null
        create_container "$app_port"
      elif [[ $(container_state) == running ]]; then
        started=""
      else
        docker start "$name" >/dev/null
      fi
      ;;
    *) create_container "$app_port" ;;
  esac
  local networks
  networks=$(attached_networks)
  [[ $networks == "$network" ]] || {
    echo "$name is attached to the networks [${networks//$'\n'/, }], not only $network, so other containers could reach the wallet's CDP: instance.sh down, then up" >&2
    exit 1
  }
  cdp_port=$(cdp_port_of "$name")
  for _ in $(seq 1 30); do curl -sf -o /dev/null "http://127.0.0.1:$cdp_port/json/version" && break; sleep 1; done
  [[ -n $started ]] && { agent-browser --session "talisman-web-$cdp_port" close >/dev/null 2>&1 || true; }
  close_blank_tabs "$cdp_port"
  printf 'INSTANCE=%s\nCONTAINER=%s\nCDP_PORT=%s\nAPP_PORT=%s\nAPP_PGID=%s\nSERVES=%s\nWALLET=%s\n' \
    "$instance_id" "$name" "$cdp_port" "$app_port" "$app_pgid" "$serves" "$wallet" > "$state"
}

prepare() {
  check_prerequisites
  ensure_isolated_network
  docker image inspect "$image" >/dev/null 2>&1 || build
  warn_if_stale_image
  mkdir -p "$state_dir"
}

up() {
  (($# == 0)) || { echo "unknown argument: $1" >&2; usage >&2; exit 2; }
  select_instance dev
  prepare
  ensure_checkout_ready
  local app_port app_pgid server serves=$app_dir wallet=on cdp_port started
  app_port=$(state_get APP_PORT)
  app_pgid=$(state_get APP_PGID)
  if owns_app_server "$app_pgid" "$app_port" && serves_this_checkout "$app_port" && app_socket_answers; then
    echo "reusing the verify dev server on :$app_port"
  else
    [[ -n $app_pgid ]] && stop_app_server "$app_pgid"
    dev_server_command
    start_app_server
    echo "started the dev server on :$app_port (log: $server_log)"
  fi
  ensure_container
  VERIFY_INSTANCE=dev "$bin/talisman.mjs" unlock
  local doctor_passed=yes
  VERIFY_INSTANCE=dev "$bin/doctor.mjs" || doctor_passed=""
  cat <<EOF

$name serves $root (dev server :$app_port as http://localhost:3002), CDP on :$cdp_port
drive it with: .claude/skills/verify/bin/ab <agent-browser command>
EOF
  [[ -n $doctor_passed ]] || { echo "the doctor failed: the instance is not ready" >&2; exit 1; }
}

serve() {
  (($# >= 2)) || { usage >&2; exit 2; }
  [[ $1 =~ ^[a-z0-9-]+$ && $1 != dev ]] || { echo "instance id must match [a-z0-9-]+ and not be dev: $1" >&2; exit 2; }
  select_instance "$1"
  local dir wallet=on server
  if [[ $2 =~ ^https://[^/]+/?$ ]]; then
    dir=${2%/}
    server=(node "$bin/proxy.mjs" "$dir")
  else
    dir=$(cd "$2" && pwd)
    [[ -f $dir/server/wrangler.json ]] || { echo "$dir has no server/wrangler.json: not a Worker build, nor an https://host origin" >&2; exit 1; }
    server=(node "$bin/worker.mjs" "$dir")
  fi
  [[ ${3:-} == --no-wallet ]] && wallet=off
  prepare
  local app_port app_pgid serves=$dir cdp_port started
  app_pgid=$(state_get APP_PGID)
  [[ -n $app_pgid ]] && stop_app_server "$app_pgid"
  docker rm -f "$name" >/dev/null 2>&1 || true
  start_app_server
  ensure_container
  [[ $wallet == on ]] && VERIFY_INSTANCE=$instance_id "$bin/talisman.mjs" unlock
  echo "$name serves $dir (wallet $wallet) as http://localhost:3002, CDP on :$cdp_port"
}

report_memory() {
  local cgroup peak cap oom_kills
  cgroup=$(docker exec "$1" cat /sys/fs/cgroup/memory.peak /sys/fs/cgroup/memory.max /sys/fs/cgroup/memory.events 2>/dev/null) || return 0
  peak=$(sed -n 1p <<<"$cgroup") cap=$(sed -n 2p <<<"$cgroup")
  oom_kills=$(awk '$1 == "oom_kill" { print $2 }' <<<"$cgroup")
  [[ $cap == max ]] && cap=uncapped || cap="of its $((cap / 1048576)) MiB cap"
  echo "$1 peaked at $((peak / 1048576)) MiB $cap"
  [[ ${oom_kills:-0} == 0 ]] ||
    echo "WARNING: $1 hit its memory cap and the kernel killed $oom_kills process(es) in it: a lane that ran on it may have failed for that reason alone" >&2
}

down() {
  local file cdp_port app_port app_pgid
  for file in "$state_dir"/*.env; do
    [[ -f $file ]] || continue
    state=$file
    cdp_port=$(state_get CDP_PORT) app_port=$(state_get APP_PORT) app_pgid=$(state_get APP_PGID)
    [[ -n $cdp_port ]] && { agent-browser --session "talisman-web-$cdp_port" close >/dev/null 2>&1 || true; }
    if owns_app_server "$app_pgid" "$app_port" || group_runs_here "$app_pgid"; then
      stop_app_server "$app_pgid" && echo "stopped the app server of $(state_get INSTANCE) (process group $app_pgid)"
    fi
    rm -f "$file"
  done
  docker ps -a --filter "label=$label=$root" --format '{{.Names}}' | while read -r container; do
    report_memory "$container"
    docker rm -f "$container" >/dev/null && echo "removed $container"
  done
}

case "${1:-}" in
  build) build ;;
  up) shift; up "$@" ;;
  serve) shift; serve "$@" ;;
  down) down ;;
  ls)
    docker ps -a --filter "label=$label" \
      --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Label \"$label\"}}"
    ;;
  *)
    usage
    exit 2
    ;;
esac
