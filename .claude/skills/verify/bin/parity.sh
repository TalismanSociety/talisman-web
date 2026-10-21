#!/usr/bin/env bash
set -euo pipefail
bin=$(cd "$(dirname "$0")" && pwd)
skill=$(dirname "$bin")
root=$(git -C "$bin" rev-parse --show-toplevel)
sides=parity
baseline_rev=$(tr -d '[:space:]' < "$skill/parity-baseline.sha")
# shellcheck source=sides.sh
. "$bin/sides.sh"

routes=$skill/parity-routes.tsv
make_out "${OUT:-$root/.tmp/verify/runs/$(date +%Y%m%d-%H%M%S)-parity}"
attempts=${ATTEMPTS:-3}
read -ra viewports <<<"${VIEWPORTS:-desktop mobile}"
declare -A viewport_size=([desktop]="1440 900" [mobile]="390 844")
only=("$@")
scratch=$(mktemp -d "$root/.tmp/verify/parity.XXXXXX")
trap 'rm -rf "$scratch"' EXIT

style_js() {
  cat <<JS
(() => {
  const masks = ${1:-[]}.map((mask, index) => ({ index, mask: mask.replace(/^[?]/, "") }));
  const css = masks.filter(({ mask }) => !mask.startsWith("text:")).map(({ mask }) => mask + "{visibility:hidden!important}");
  const style = document.createElement("style");
  style.textContent = "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scrollbar-width:none!important}[data-parity-mask]{visibility:hidden!important}" + css.join("");
  document.documentElement.append(style);
  const patterns = masks.filter(({ mask }) => mask.startsWith("text:")).map(({ index, mask }) => ({ index: String(index), regex: new RegExp(mask.slice(5)) }));
  const placeholder = "0000";
  const originals = (window.__parityOriginals = new Map());
  const freeze = () => {
    document.querySelectorAll("svg").forEach((svg) => {
      svg.pauseAnimations();
      svg.setCurrentTime(0);
    });
    document.getAnimations().forEach((animation) => {
      if (animation.effect?.getComputedTiming().endTime === Infinity) {
        animation.pause();
        animation.currentTime = 0;
      } else {
        animation.finish();
      }
    });
  };
  setInterval(freeze, 100);
  const tag = () => {
    if (!patterns.length) return;
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const element = node.parentElement;
      if (!element || (originals.has(node) && node.data === placeholder)) continue;
      const text = node.data.trim();
      const matched = patterns.filter(({ regex }) => regex.test(text));
      if (!matched.length) continue;
      const tags = new Set((element.getAttribute("data-parity-mask") ?? "").split(" ").filter(Boolean));
      matched.forEach(({ index }) => tags.add(index));
      element.setAttribute("data-parity-mask", [...tags].join(" "));
      originals.set(node, node.data);
      node.data = placeholder;
    }
  };
  freeze();
  tag();
  new MutationObserver(tag).observe(document.documentElement, { subtree: true, childList: true, characterData: true });
})()
JS
}

unmatched_js() {
  printf '%s.filter((mask, index) => { const bare = mask.replace(/^[?]/, ""); try { const selector = bare.startsWith("text:") ? `[data-parity-mask~="${index}"]` : bare; return document.querySelectorAll(selector).length === 0 && !mask.startsWith("?"); } catch { return true; } })' "${1:-[]}"
}

one_line() { tr '\t\n' '  ' | sed 's/  */ /g; s/^ //; s/ $//'; }

settle() {
  local png=$1 stable=0 tries=0
  step screenshot "$png" --full || return
  while ((stable < ${STABLE:-4})); do
    ((tries++ < 30)) || { echo "page did not settle within 30 captures: mask what keeps changing"; return 1; }
    step wait 500 && step diff screenshot --baseline "$png" -o "$scratch/$side.settle.png" -t 0 --full || return
    if [[ $(jq .differentPixels <<<"$reply") == 0 ]]; then
      ((++stable))
    else
      stable=0
      step screenshot "$png" --full || return
    fi
  done
}

capture() {
  local side=$1 url=$2 wait_text=$3 masks=$4 click=$5 png=$6 size=$7 reply unmatched width height
  read -r width height <<<"$size"
  bring_to_front &&
    step set viewport "$width" "$height" 1 &&
    step open about:blank &&
    step open "$url" &&
    step eval "$(style_js "$masks")" &&
    step wait --load load &&
    { [[ -z $click ]] || click_button "$click"; } &&
    wait_ready "$wait_text" &&
    step wait 3000 &&
    settle "$png" &&
    step eval "$(unmatched_js "$masks")" || return
  unmatched=$(jq -r '.result | join(", ")' <<<"$reply")
  [[ -z $unmatched ]] || { echo "mask matched nothing: $unmatched"; return 1; }
  { step eval "$header_js" > /dev/null && jq -r .result <<<"$reply"; } > "${png%.png}.header.txt" || echo unreadable > "${png%.png}.header.txt"
}

header_js='(() => { const originals = window.__parityOriginals ?? new Map(); const text = []; const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while (walker.nextNode()) text.push(originals.get(walker.currentNode) ?? walker.currentNode.data); return (text.join(" ").match(/[0-9]+\s+Connected|Connect wallet/) ?? ["none"])[0]; })()'

compare() {
  local shot=$1 path=$2 wait_text=$3 masks=$4 click=$5 size=$6 side reply failed='' pid
  declare -A pids=()
  different='' total='' detail=''
  rm -f "$out/$shot.diff.png"
  for side in baseline candidate; do
    capture "$side" "http://localhost:3002$path" "$wait_text" "$masks" "$click" "$out/$shot.$side.png" "$size" > "$scratch/$side.capture" 2>&1 &
    pids[$side]=$!
  done
  for side in baseline candidate; do
    wait "${pids[$side]}" || failed+="$side: $(one_line < "$scratch/$side.capture"); "
  done
  [[ -z $failed ]] || { detail=${failed%; }; return; }
  pixel_diff "$out/$shot.baseline.png" "$out/$shot.candidate.png" "$out/$shot.diff.png"
}

magick() { VERIFY_INSTANCE=$sides-candidate "$verify" exec "$@"; }

pixel_diff() {
  local sizes report
  mapfile -t sizes < <(magick identify -format '%wx%h\n' "$1" "$2")
  total=$(magick identify -precision 16 -format '%[fx:w*h]' "$1")
  if [[ ${sizes[0]} != "${sizes[1]}" ]]; then
    different=$total detail="size: baseline ${sizes[0]}, candidate ${sizes[1]}"
    return
  fi
  report=$(magick convert "$1" "$2" -alpha off -compose difference -composite -separate -evaluate-sequence max -threshold 0 \
    -precision 16 -format '%[fx:round(mean*w*h)]' info: 2>&1) || true
  [[ $report =~ ^[0-9]+$ ]] || { detail="magick: $report"; return; }
  different=$report
  ((different == 0)) || magick compare "$1" "$2" "$3" 2>/dev/null || true
}

route() {
  local shot=$1 path=$2
  different='' total='' detail='' counts=() failures=()
  path=${path//<sub>/$sub_address}
  path=${path//<evm>/$evm_address}
  while ((${#counts[@]} < attempts)); do
    compare "$shot" "$path" "${@:3}"
    counts+=("${different:--}")
    [[ -z $detail ]] || failures+=("attempt ${#counts[@]}: $detail")
    [[ -z $detail && $different == 0 ]] && return
    if ((${#counts[@]} < attempts)) && [[ -f $out/$shot.diff.png ]]; then
      mv "$out/$shot.diff.png" "$out/$shot.attempt${#counts[@]}.diff.png"
    fi
  done
}

selected() {
  ((${#only[@]} == 0)) && return
  local name
  for name in "${only[@]}"; do [[ $1 == "$name" ]] && return; done
  return 1
}

prepare_sides baseline candidate
sub_address=$(account_address "$sub_name")
evm_address=$(account_address "$evm_name")
echo "connected state uses \"$sub_name\" $sub_address and \"$evm_name\" $evm_address"

status=0
current_state=''
printf 'route\tviewport\tdifferent\ttotal\tattempts\tresult\tdetail\n' >"$out/summary.tsv"
while IFS= read -r line <&3 || [[ -n $line ]]; do
  line=${line%$'\r'}
  [[ -z ${line//[[:space:]]/} || $line == '#'* ]] && continue
  IFS=$'\x1f' read -r name state path wait_text masks click <<<"${line//$'\t'/$'\x1f'}"
  selected "$name" || continue
  [[ $state == "$current_state" ]] || { start_state "$state"; current_state=$state; }
  for viewport in "${viewports[@]}"; do
    route "$name.$viewport" "$path" "$wait_text" "$masks" "$click" "${viewport_size[$viewport]}"
    result=pass
    [[ $different == 0 && -z $detail ]] || { result=fail; status=1; }
    detail=$(IFS=,; printf "attempts: %s" "${counts[*]}"; ((${#failures[@]} == 0)) || { IFS=";"; printf "; %s" "${failures[*]}"; })
    detail=$(one_line <<<"$detail")
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$name" "$viewport" "$different" "$total" "${#counts[@]}" "$result" "$detail" | tee -a "$out/summary.tsv"
  done
done 3<"$routes"
scan_for_key baseline candidate || status=1
echo "summary: $out/summary.tsv"
exit "$status"
