#!/usr/bin/env bash
set -euo pipefail
bin=$(cd "$(dirname "$0")" && pwd)
skill=$(dirname "$bin")
root=$(git -C "$bin" rev-parse --show-toplevel)
# shellcheck source=toolchain.sh
. "$bin/toolchain.sh"

routes=$skill/parity-routes.tsv
baseline_sha=$(git -C "$root" rev-parse --verify "$(tr -d '[:space:]' < "$skill/parity-baseline.sha")^{commit}")
cache=$root/.tmp/verify/parity
baseline_src=$cache/baseline-src
baseline_static=$cache/baseline-$baseline_sha
candidate_static=$cache/candidate
out=${OUT:-$root/.tmp/verify/runs/$(date +%Y%m%d-%H%M%S)-parity}
mkdir -p "$out" && out=$(cd "$out" && pwd)
attempts=${ATTEMPTS:-3}
read -ra viewports <<<"${VIEWPORTS:-desktop mobile}"
declare -A viewport_size=([desktop]="1440 900" [mobile]="390 844")
only=("$@")
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT

ensure_baseline() {
  [[ -f $baseline_static/index.html ]] && { echo "baseline $baseline_sha: cached build $baseline_static"; return; }
  if [[ ! -e $baseline_src/.git ]]; then
    git -C "$root" worktree add --detach "$baseline_src" "$baseline_sha" >/dev/null
  elif [[ $(git -C "$baseline_src" rev-parse HEAD) != "$baseline_sha" ]]; then
    git -C "$baseline_src" checkout --detach "$baseline_sha" >/dev/null 2>&1 || {
      echo "the baseline worktree $baseline_src has local changes and is not at $baseline_sha: remove it (git worktree remove --force $baseline_src)" >&2
      exit 1
    }
    rm -rf "$baseline_src/node_modules"
  fi
  [[ -d $baseline_src/node_modules ]] || install_deps "$baseline_src" > "$cache/baseline-install.log" 2>&1 || {
    tail -20 "$cache/baseline-install.log" >&2
    echo "installing the baseline $baseline_sha failed (log: $cache/baseline-install.log)" >&2
    exit 1
  }
  build_static "$baseline_src" "$baseline_static" "$cache/baseline-build.log"
}

checkout_fingerprint() {
  {
    git -C "$root" rev-parse HEAD
    git -C "$root" diff HEAD -- . ':!.claude'
    git -C "$root" ls-files --others --exclude-standard -- . ':!.claude' | (cd "$root" && while IFS= read -r file; do
      if [[ -f $file ]]; then sha1sum "$file"; fi
    done)
  } | sha1sum | cut -d' ' -f1
}

ensure_candidate() {
  local fingerprint
  fingerprint=$(checkout_fingerprint)
  if [[ -f $candidate_static/index.html && $(cat "$cache/candidate.fingerprint" 2>/dev/null) == "$fingerprint" ]]; then
    echo "candidate: the checkout is unchanged since the last build, reusing $candidate_static"
    return
  fi
  install_deps "$root" > "$cache/candidate-install.log" 2>&1 || {
    tail -20 "$cache/candidate-install.log" >&2
    echo "installing the candidate failed (log: $cache/candidate-install.log)" >&2
    exit 1
  }
  rm -f "$cache/candidate.fingerprint"
  build_static "$root" "$candidate_static" "$cache/candidate-build.log"
  echo "$fingerprint" > "$cache/candidate.fingerprint"
}

account_address() {
  VERIFY_INSTANCE=parity-candidate "$bin/talisman.mjs" accounts | jq -er --arg want "$1" \
    'map(select(.name == $want)) | if length == 1 then .[0].address else error("no single test account named \($want): talisman.mjs accounts") end'
}

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

ready_js() {
  printf '(() => { const text = []; const originals = window.__parityOriginals ?? new Map(); const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: (node) => ["SCRIPT", "STYLE", "TEMPLATE"].includes(node.parentElement?.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT }); while (walker.nextNode()) text.push(originals.get(walker.currentNode) ?? walker.currentNode.data); const counted = (spec) => { const [, n, ...regex] = spec.split(":"); const re = new RegExp(regex.join(":")); return text.filter((data) => re.test(data.trim())).length >= Number(n); }; return %s.some((wanted) => wanted.startsWith("css:") ? document.querySelector(wanted.slice(4)) !== null : wanted.startsWith("path:") ? location.pathname + location.search === wanted.slice(5) : wanted.startsWith("count:") ? counted(wanted) : text.some((data) => data.includes(wanted))); })()' "$1"
}

unmatched_js() {
  printf '%s.filter((mask, index) => { const bare = mask.replace(/^[?]/, ""); try { const selector = bare.startsWith("text:") ? `[data-parity-mask~="${index}"]` : bare; return document.querySelectorAll(selector).length === 0 && !mask.startsWith("?"); } catch { return true; } })' "${1:-[]}"
}

one_line() { tr '\t\n' '  ' | sed 's/  */ /g; s/^ //; s/ $//'; }

browser() {
  local reply err=$scratch/$1.stderr
  reply=$(VERIFY_INSTANCE=parity-$1 "$bin/ab" --json "${@:2}" 2>"$err") || true
  if jq -e '.success == true' <<<"$reply" >/dev/null 2>&1; then
    jq -c .data <<<"$reply"
  else
    jq -er .error <<<"$reply" 2>/dev/null || printf '%s %s\n' "$reply" "$(<"$err")"
    return 1
  fi
}

step() { reply=$(browser "$side" "$@") || { echo "$reply"; return 1; }; }

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

wait_ready() {
  local items item
  mapfile -t items < <(jq -cR 'select(length > 0) | gsub("[|][|]"; "\u001e") | split("|")[] | split("\u001e")' <<<"$1")
  for item in "${items[@]}"; do
    step wait --fn "$(ready_js "$item")" --timeout 120000 || { echo "while waiting for $item"; return 1; }
  done
  step wait --fn 'Array.from(document.images).every((image) => image.complete || image.loading === "lazy")' --timeout 60000 ||
    { echo "while waiting for the images to load"; return 1; }
}

click_button() {
  local tries=0
  until step find role button click --name "$1"; do
    ((++tries < 60)) || return 1
    sleep 1
  done
}

bring_to_front() {
  step tab list && step tab "$(jq -r '.tabs[] | select(.active) | .tabId' <<<"$reply")"
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
}

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

pixel_diff() {
  local sizes report
  mapfile -t sizes < <(magick identify -format '%wx%h\n' "$1" "$2")
  total=$(magick identify -precision 16 -format '%[fx:w*h]' "$1")
  if [[ ${sizes[0]} != "${sizes[1]}" ]]; then
    different=$total detail="size: baseline ${sizes[0]}, candidate ${sizes[1]}"
    return
  fi
  report=$(magick "$1" "$2" -alpha off -compose difference -composite -separate -evaluate-sequence max -threshold 0 \
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

start_side() {
  "$bin/instance.sh" serve "parity-$1" "$2" ${3:+"$3"} >/dev/null
}

start_state() {
  local wallet_flag=''
  [[ $1 == signed-out ]] && wallet_flag=--no-wallet
  local baseline_pid candidate_pid
  start_side baseline "$baseline_static" "$wallet_flag" &
  baseline_pid=$!
  start_side candidate "$candidate_static" "$wallet_flag" &
  candidate_pid=$!
  wait "$baseline_pid" && wait "$candidate_pid" || { echo "could not start the $1 browsers" >&2; exit 1; }
  if [[ $1 == connected ]]; then
    local side
    for side in baseline candidate; do
      connect_side "$side" || { echo "could not connect the $side browser: $reply" >&2; exit 1; }
    done
  fi
  echo "state $1: both browsers ready"
}

connect_side() {
  local side=$1 talisman=("$bin/talisman.mjs") site wanted
  wanted=$(jq -cn --arg sub "$sub_name" --arg evm "$evm_name" '{host: "localhost:3002", substrate: [$sub], ethereum: [$evm]}')
  bring_to_front && step open http://localhost:3002/staking/providers || return
  reply=$(VERIFY_INSTANCE=parity-$side "${talisman[@]}" connect --account "$sub_name" 2>&1) || return
  click_button Connected || return
  local tries=0
  until step find role button click --name Connect --exact &&
    reply=$(VERIFY_INSTANCE=parity-$side "${talisman[@]}" connect --account "$evm_name" --timeout 10 2>&1); do
    ((++tries < 6)) || return 1
  done
  site=$(VERIFY_INSTANCE=parity-$side "${talisman[@]}" site)
  [[ $(jq -c . <<<"$site") == "$wanted" ]] || { reply="the wallet connected $site, not $wanted"; return 1; }
  echo "$side: connected $site"
}

command -v magick >/dev/null || { echo "ImageMagick 7 (magick) is required: see Setup in $skill/SKILL.md" >&2; exit 1; }
mkdir -p "$cache"
if [[ -n ${BASELINE_URL:-}${CANDIDATE_URL:-} ]]; then
  [[ -n ${BASELINE_URL:-} && -n ${CANDIDATE_URL:-} ]] || { echo "BASELINE_URL and CANDIDATE_URL go together: both sides are served from a URL, or neither" >&2; exit 1; }
  baseline_static=$BASELINE_URL candidate_static=$CANDIDATE_URL
  echo "baseline $baseline_static, candidate $candidate_static: both served from their URL"
else
  ensure_baseline
  ensure_candidate
  echo "baseline $baseline_sha, candidate $(git -C "$root" rev-parse HEAD)$( [[ -n $(git -C "$root" status --porcelain -- . ':!.claude') ]] && echo ' with local changes')"
fi
sub_name=${PARITY_SUB_ACCOUNT:-Guardians SUB}
evm_name=${PARITY_EVM_ACCOUNT:-Guardians EVM}
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
echo "summary: $out/summary.tsv"
exit "$status"
