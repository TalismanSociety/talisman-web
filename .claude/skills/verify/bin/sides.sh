# shellcheck shell=bash
# shellcheck source=toolchain.sh
. "$bin/toolchain.sh"

baseline_sha=$(git -C "$root" rev-parse --verify "${baseline_rev:?}^{commit}")
cache=$root/.tmp/verify/parity
baseline_src=$cache/baseline-src
baseline_app=${BASELINE_URL:-$cache/baseline-$baseline_sha}
candidate_app=${CANDIDATE_URL:-$cache/candidate}
sub_name=${PARITY_SUB_ACCOUNT:-Guardians SUB}
evm_name=${PARITY_EVM_ACCOUNT:-Guardians EVM}
consent=${CONSENT:-reject}
[[ $consent =~ ^(reject|accept|unset)$ ]] || { echo "CONSENT must be reject, accept or unset, not \"$consent\"" >&2; exit 2; }

ensure_baseline() {
  [[ -f $baseline_app/server/wrangler.json ]] && { echo "baseline $baseline_sha: cached Worker build $baseline_app"; return; }
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
  build_worker "$baseline_src" "$baseline_app" "$cache/baseline-build.log"
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
  if [[ -f $candidate_app/server/wrangler.json && $(cat "$cache/candidate.fingerprint" 2>/dev/null) == "$fingerprint" ]]; then
    echo "candidate: the checkout is unchanged since the last build, reusing $candidate_app"
    return
  fi
  install_deps "$root" > "$cache/candidate-install.log" 2>&1 || {
    tail -20 "$cache/candidate-install.log" >&2
    echo "installing the candidate failed (log: $cache/candidate-install.log)" >&2
    exit 1
  }
  rm -f "$cache/candidate.fingerprint"
  build_worker "$root" "$candidate_app" "$cache/candidate-build.log"
  echo "$fingerprint" > "$cache/candidate.fingerprint"
}

is_url() { [[ $1 == https://* ]]; }

prepare_sides() {
  local side app
  for side; do
    app=${side}_app
    is_url "${!app}" || { node "$bin/tda-key.mjs" check >/dev/null || exit 1; break; }
  done
  mkdir -p "$cache"
  for side; do
    app=${side}_app
    if is_url "${!app}"; then echo "$side ${!app}: served from its URL"; else "ensure_$side"; fi
  done
  [[ " $* " != *" baseline "* ]] || is_url "$baseline_app" || echo "baseline $baseline_sha"
  [[ " $* " != *" candidate "* ]] || is_url "$candidate_app" ||
    echo "candidate $(git -C "$root" rev-parse HEAD)$( [[ -n $(git -C "$root" status --porcelain -- . ':!.claude') ]] && echo ' with local changes')"
}

scan_for_key() {
  local built=() side app
  for side in baseline candidate; do
    app=${side}_app
    is_url "${!app}" || built+=("${!app}")
  done
  node "$bin/tda-key.mjs" scan "$out" "$root/.tmp/verify"/*.log "$cache"/*.log "${built[@]}"
}

account_address() {
  VERIFY_INSTANCE=$sides-candidate "$bin/talisman.mjs" accounts | jq -er --arg want "$1" \
    'map(select(.name == $want)) | if length == 1 then .[0].address else error("no single test account named \($want): talisman.mjs accounts") end'
}

browser() {
  local reply err=$scratch/$1.stderr
  reply=$(VERIFY_INSTANCE=$sides-$1 "$bin/ab" --json "${@:2}" 2>"$err") || true
  if jq -e '.success == true' <<<"$reply" >/dev/null 2>&1; then
    jq -c .data <<<"$reply"
  else
    jq -er .error <<<"$reply" 2>/dev/null || printf '%s %s\n' "$reply" "$(<"$err")"
    return 1
  fi
}

step() { reply=$(browser "$side" "$@") || { echo "$reply"; return 1; }; }

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

start_side() {
  "$bin/instance.sh" serve "$sides-$1" "$2" ${3:+"$3"} >/dev/null &&
    VERIFY_INSTANCE=$sides-$1 "$bin/consent.mjs" "$consent" >/dev/null
}

start_state() {
  local wallet_flag=''
  [[ $1 == signed-out ]] && wallet_flag=--no-wallet
  local baseline_pid candidate_pid
  start_side baseline "$baseline_app" "$wallet_flag" &
  baseline_pid=$!
  start_side candidate "$candidate_app" "$wallet_flag" &
  candidate_pid=$!
  wait "$baseline_pid" && wait "$candidate_pid" || { echo "could not start the $1 browsers" >&2; exit 1; }
  if [[ $1 == connected ]]; then
    local side
    for side in baseline candidate; do
      connect_side "$side" || { echo "could not connect the $side browser: $reply" >&2; exit 1; }
    done
  fi
  echo "state $1: both browsers ready, consent $consent"
}

connect_side() {
  local side=$1 talisman=("$bin/talisman.mjs") site wanted
  wanted=$(jq -cn --arg sub "$sub_name" --arg evm "$evm_name" '{host: "localhost:3002", substrate: [$sub], ethereum: [$evm]}')
  bring_to_front && step open http://localhost:3002/staking/providers || return
  reply=$(VERIFY_INSTANCE=$sides-$side "${talisman[@]}" connect --account "$sub_name" 2>&1) || return
  click_button Connected || return
  local tries=0
  until step find role button click --name Connect --exact &&
    reply=$(VERIFY_INSTANCE=$sides-$side "${talisman[@]}" connect --account "$evm_name" --timeout 10 2>&1); do
    ((++tries < 6)) || return 1
  done
  site=$(VERIFY_INSTANCE=$sides-$side "${talisman[@]}" site)
  [[ $(jq -c . <<<"$site") == "$wanted" ]] || { reply="the wallet connected $site, not $wanted"; return 1; }
  echo "$side: connected $site"
}

ready_js() {
  printf '(() => { const text = []; const originals = window.__parityOriginals ?? new Map(); const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: (node) => ["SCRIPT", "STYLE", "TEMPLATE"].includes(node.parentElement?.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT }); while (walker.nextNode()) text.push(originals.get(walker.currentNode) ?? walker.currentNode.data); const counted = (spec) => { const [, n, ...regex] = spec.split(":"); const re = new RegExp(regex.join(":")); return text.filter((data) => re.test(data.trim())).length >= Number(n); }; return %s.some((wanted) => wanted.startsWith("css:") ? document.querySelector(wanted.slice(4)) !== null : wanted.startsWith("path:") ? location.pathname + location.search === wanted.slice(5) : wanted.startsWith("count:") ? counted(wanted) : text.some((data) => data.includes(wanted))); })()' "$1"
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
