#!/usr/bin/env bash
set -euo pipefail
bin=$(cd "$(dirname "$0")" && pwd)
skill=$(dirname "$bin")
root=$(git -C "$bin" rev-parse --show-toplevel)
sides=csp
baseline_rev=$(tr -d '[:space:]' < "$skill/parity-baseline.sha")
# shellcheck source=sides.sh
. "$bin/sides.sh"

routes=$skill/parity-routes.tsv
flows_file=${SMOKE_FLOWS:-$skill/smoke-flows.json}
export SMOKE_FLOWS=$flows_file
out=${OUT:-$root/.tmp/verify/runs/$(date +%Y%m%d-%H%M%S)-csp}
mkdir -p "$out" && out=$(cd "$out" && pwd)
read -ra viewports <<<"${VIEWPORTS:-desktop mobile}"
declare -A viewport_size=([desktop]="1440 900" [mobile]="390 844")
attempts=${ATTEMPTS:-3}
only=("$@")
side=candidate
scratch=$(mktemp -d)
watcher=''
trap '[[ -z $watcher ]] || kill "$watcher" 2>/dev/null || true; rm -rf "$scratch"' EXIT

selected() {
  ((${#only[@]} == 0)) && return
  local name
  for name in "${only[@]}"; do [[ $1 == "$name" ]] && return; done
  return 1
}

one_line() { tr '\t\n' '  ' | sed 's/  */ /g; s/^ //; s/ $//'; }

start_candidate() {
  local wallet_flag=''
  [[ $1 == signed-out ]] && wallet_flag=--no-wallet
  start_side candidate "$candidate_static" "$wallet_flag" || { echo "could not start the $1 browser" >&2; exit 1; }
  if [[ $1 == connected ]]; then
    connect_side candidate || { echo "could not connect the browser: $reply" >&2; exit 1; }
  fi
  echo "state $1: browser ready, consent $consent"
}

watch() {
  : > "$scratch/watch.out"
  VERIFY_INSTANCE=$sides-candidate node "$bin/csp.mjs" "$out/$1.jsonl" > "$scratch/watch.out" 2>&1 &
  watcher=$!
  local tries=0
  until grep -q '^ready' "$scratch/watch.out"; do
    kill -0 "$watcher" 2>/dev/null && ((++tries < 100)) || {
      echo "the CSP watcher did not start: $(one_line < "$scratch/watch.out")"
      kill "$watcher" 2>/dev/null || true
      wait "$watcher" 2>/dev/null || true
      watcher=''
      return 1
    }
    sleep 0.1
  done
}

unwatch() {
  local alive=yes
  kill -0 "$watcher" 2>/dev/null || alive=''
  kill "$watcher" 2>/dev/null || true
  wait "$watcher" 2>/dev/null || true
  watcher=''
  [[ -n $alive ]] || { echo "the CSP watcher died during the step: $(one_line < "$scratch/watch.out")"; return 1; }
}

load_route() {
  local path=$1 wait_text=$2 click=$3 size=$4 width height
  read -r width height <<<"$size"
  step set viewport "$width" "$height" 1 &&
    step open "http://localhost:3002$path" &&
    step wait --load load &&
    { [[ -z $click ]] || click_button "$click"; } &&
    wait_ready "$wait_text" &&
    step wait 3000
}

run_flow() {
  step set viewport 1440 900 1 || return
  VERIFY_INSTANCE=$sides-candidate "$bin/smoke.mjs" "$1" "$out/$1.flow.json" > "$scratch/flow.log" 2>&1 || true
  [[ -f $out/$1.flow.json ]] || { echo "smoke.mjs wrote no result: $(tail -3 "$scratch/flow.log" | one_line)"; return 1; }
  echo "flow $(jq -r '.status + (if .detail then ": " + .detail else "" end)' "$out/$1.flow.json")"
  jq -e '.status == "captured" or .status == "unavailable"' "$out/$1.flow.json" >/dev/null
}

violations_of() {
  jq -rs '(map(select(.channel == "event")) | length) as $events
    | map(select(.channel == "event" or .context != "page" or $events == 0))
    | map(if .channel == "event" then "\(.directive) \(.blocked) (\(.disposition))" else "\(.context): \(.text[0:160])" end)
    | unique' "$1"
}

record_step() {
  local name=$1 kind=$2 loaded=$3 detail=$4 count found result=pass
  count=$(violations_of "$out/$name.jsonl" | jq length)
  found=$(violations_of "$out/$name.jsonl" | jq -r 'join("; ")')
  if ((count > 0)); then result=fail detail="$found${detail:+; $detail}"; fi
  [[ $loaded == yes ]] || result=fail
  [[ $result == pass ]] || status=1
  printf '%s\t%s\t%s\t%s\t%s\n' "$name" "$kind" "$count" "$result" "$(one_line <<<"$detail")" | tee -a "$out/summary.tsv"
}

step_run() {
  local name=$1 kind=$2 loaded tries=0 earlier=''
  shift 2
  : > "$out/$name.jsonl"
  while :; do
    ((++tries))
    loaded=yes
    : > "$scratch/step.out"
    if { bring_to_front && { [[ $kind == flow ]] || step open about:blank; } && watch "$name"; } >> "$scratch/step.out"; then
      "$@" >> "$scratch/step.out" 2>&1 || loaded=no
      unwatch >> "$scratch/step.out" || loaded=no
    else
      loaded=no
    fi
    [[ $loaded == no && -z $(<"$out/$name.jsonl") && $tries -lt $attempts ]] || break
    earlier+="attempt $tries: $(one_line < "$scratch/step.out"); "
  done
  record_step "$name" "$kind" "$loaded" "$earlier$(one_line < "$scratch/step.out")"
}

mkdir -p "$cache"
if [[ -n ${CANDIDATE_URL:-} ]]; then
  candidate_static=$CANDIDATE_URL
  echo "candidate $candidate_static: served from its URL"
else
  ensure_candidate
  echo "candidate $(git -C "$root" rev-parse HEAD)$( [[ -n $(git -C "$root" status --porcelain -- . ':!.claude') ]] && echo ' with local changes')"
fi
if [[ -n ${CANDIDATE_URL:-} ]]; then policy=$(curl -sS -D - -o /dev/null "$CANDIDATE_URL/"); else policy=$(cat "$candidate_static/_headers"); fi
grep -qi '^ *content-security-policy' <<<"$policy" ||
  { echo "the candidate sends no Content-Security-Policy header, so no violation could be reported" >&2; exit 1; }
sub_address=$(account_address "$sub_name")
evm_address=$(account_address "$evm_name")

status=0
current_state=''
printf 'step\tkind\tviolations\tresult\tdetail\n' > "$out/summary.tsv"
while IFS= read -r line <&3 || [[ -n $line ]]; do
  line=${line%$'\r'}
  [[ -z ${line//[[:space:]]/} || $line == '#'* ]] && continue
  IFS=$'\x1f' read -r name state path wait_text _masks click <<<"${line//$'\t'/$'\x1f'}"
  selected "$name" || continue
  [[ $state == "$current_state" ]] || { start_candidate "$state"; current_state=$state; }
  path=${path//<sub>/$sub_address}
  path=${path//<evm>/$evm_address}
  for viewport in "${viewports[@]}"; do
    step_run "$name.$viewport" "route $state" load_route "$path" "$wait_text" "$click" "${viewport_size[$viewport]}"
  done
done 3<"$routes"

mapfile -t flows < <(jq -r '.[].name' "$flows_file")
for flow in "${flows[@]}"; do
  selected "$flow" || continue
  [[ $current_state == connected ]] || { start_candidate connected; current_state=connected; }
  step_run "$flow" "flow" run_flow "$flow"
done
[[ $(wc -l < "$out/summary.tsv") -gt 1 ]] || { echo "no route or flow matched: ${only[*]}" >&2; exit 1; }
echo "summary: $out/summary.tsv"
exit "$status"
