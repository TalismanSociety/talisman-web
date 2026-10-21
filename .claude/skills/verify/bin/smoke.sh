#!/usr/bin/env bash
set -euo pipefail
bin=$(cd "$(dirname "$0")" && pwd)
skill=$(dirname "$bin")
root=$(git -C "$bin" rev-parse --show-toplevel)
sides=smoke
baseline_rev=${SMOKE_BASELINE:-$(tr -d '[:space:]' < "$skill/parity-baseline.sha")}
# shellcheck source=sides.sh
. "$bin/sides.sh"

flows_file=${SMOKE_FLOWS:-$skill/smoke-flows.json}
export SMOKE_FLOWS=$flows_file
make_out "${OUT:-$root/.tmp/verify/runs/$(date +%Y%m%d-%H%M%S)-smoke}"
attempts=${ATTEMPTS:-3}
submit=''
only=()
for arg in "$@"; do
  if [[ $arg == --submit ]]; then submit=yes; else only+=("$arg"); fi
done
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT

selected() {
  ((${#only[@]} == 0)) && return
  local name
  for name in "${only[@]}"; do [[ $1 == "$name" ]] && return; done
  return 1
}

run_side() {
  VERIFY_INSTANCE=$sides-$1 "$verify" exec node "$bin/smoke.mjs" "$2" "$out/$2.$3.json" "${@:4}" > "$scratch/$3.log" 2>&1
}

compare_flow() {
  local flow=$1 side pid
  declare -A pids=()
  for side in baseline candidate; do
    run_side "$side" "$flow" "$side" &
    pids[$side]=$!
  done
  for side in baseline candidate; do wait "${pids[$side]}" || true; done
  jq -rn --slurpfile baseline "$out/$flow.baseline.json" --slurpfile candidate "$out/$flow.candidate.json" '
    ($baseline[0]) as $b | ($candidate[0]) as $c |
    if $b.status == "captured" and $c.status == "captured" then
      if $b.payload == $c.payload then "same\t\($c.detail // "")"
      else "differ\t" + ([($b.payload | keys_unsorted[]), ($c.payload | keys_unsorted[])] | unique | map(select($b.payload[.] != $c.payload[.])) | map("\(.): baseline \($b.payload[.]) candidate \($c.payload[.])") | join("; "))
      end
    elif $b.status != "captured" and $c.status != "captured" then "unavailable\tbaseline \($b.status): \($b.detail // ""); candidate \($c.status): \($c.detail // "")"
    else "differ\tbaseline \($b.status)\(if $b.detail then ": " + $b.detail else "" end); candidate \($c.status)\(if $c.detail then ": " + $c.detail else "" end)"
    end'
}

one_line() { tr '\t\n' '  ' | sed 's/  */ /g; s/^ //; s/ $//'; }

prepare_sides baseline candidate
start_state connected

status=0
printf 'flow\tresult\tattempts\tdetail\n' > "$out/summary.tsv"
mapfile -t flows < <(jq -r '.[].name' "$flows_file")
same=()
for flow in "${flows[@]}"; do
  selected "$flow" || continue
  tries=0 earlier=''
  while :; do
    ((++tries))
    IFS=$'\t' read -r result detail < <(compare_flow "$flow")
    [[ $result == differ && $tries -lt $attempts ]] || break
    earlier+="attempt $tries differ: $detail; "
  done
  [[ $result == differ ]] && status=1
  [[ $result == same ]] && same+=("$flow")
  printf '%s\t%s\t%s\t%s\n' "$flow" "$result" "$tries" "$(one_line <<<"$earlier$detail")" | tee -a "$out/summary.tsv"
done

if [[ -n $submit ]]; then
  printf 'flow\tresult\thash\tblock\tfee\ttransfers\texplorer\tcost\n' > "$out/submitted.tsv"
  for flow in "${same[@]}"; do
    cost=$(jq -r --arg flow "$flow" '.[] | select(.name == $flow) | .submit // empty' "$flows_file")
    [[ -n $cost ]] || continue
    run_side candidate "$flow" submit --submit || true
    jq -r --arg cost "$cost" '[.flow, .status, (.onchain.hash // ""), (.onchain.block // "" | tostring), (.onchain.fee // ""), ((.onchain.transfers // []) | join(", ")), (.onchain.explorer // ""), $cost + (if .detail then " (" + .detail + ")" elif .onchain.error then " (" + .onchain.error + ")" else "" end)] | @tsv' \
      "$out/$flow.submit.json" | tee -a "$out/submitted.tsv"
    [[ $(jq -r .status "$out/$flow.submit.json") == submitted ]] || status=1
  done
  echo "submitted: $out/submitted.tsv"
fi
scan_for_key baseline candidate || status=1
echo "summary: $out/summary.tsv"
exit "$status"
