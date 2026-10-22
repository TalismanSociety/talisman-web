# shellcheck shell=bash
verify=$bin/verify
baseline_sha=$(git -C "$root" rev-parse --verify "${baseline_rev:?}^{commit}")
baseline_source=${BASELINE_URL:-$baseline_sha}
candidate_source=${CANDIDATE_URL:-worktree}
sub_name=${PARITY_SUB_ACCOUNT:-Guardians SUB}
evm_name=${PARITY_EVM_ACCOUNT:-Guardians EVM}
consent=${CONSENT:-reject}
[[ $consent =~ ^(reject|accept|unset)$ ]] || { echo "CONSENT must be reject, accept or unset, not \"$consent\"" >&2; exit 2; }

make_out() {
  mkdir -p "$1" && out=$(cd "$1" && pwd)
  [[ $out == "$root"/* ]] || { echo "OUT must be under $root, the only host folder the containers see: $out" >&2; exit 2; }
}

is_url() { [[ $1 == https://* ]]; }

prepare_sides() {
  local side source
  for side; do
    source=${side}_source
    "$verify" serve "$sides-$side" "${!source}" --no-wallet
  done
  [[ " $* " != *" baseline "* ]] || is_url "$baseline_source" || echo "baseline $baseline_sha"
  [[ " $* " != *" candidate "* ]] || is_url "$candidate_source" ||
    echo "candidate $(git -C "$root" rev-parse HEAD)$( [[ -n $(git -C "$root" status --porcelain -- . ':!.claude') ]] && echo ' with local changes')"
}

stop_sides() {
  local side
  for side; do VERIFY_INSTANCE=$sides-$side "$verify" stop || true; done
}

scan_for_key() {
  local side source builds status=0
  for side; do
    source=${side}_source
    builds=()
    is_url "${!source}" || builds=(/side/src/apps/portal/dist /side/install.log /side/build.log)
    VERIFY_INSTANCE=$sides-$side "$verify" exec node "$bin/tda-key.mjs" scan "$out" "$root/.tmp/verify"/*.log "${builds[@]}" || status=1
  done
  return "$status"
}

account_address() {
  VERIFY_INSTANCE=$sides-candidate "$verify" wallet accounts | jq -er --arg want "$1" \
    'map(select(.name == $want)) | if length == 1 then .[0].address else error("no single test account named \($want): talisman.mjs accounts") end'
}

browser() {
  local reply err=$scratch/$1.stderr
  reply=$(VERIFY_INSTANCE=$sides-$1 "$verify" ab --json "${@:2}" 2>"$err") || true
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
  "$verify" serve "$sides-$1" "$2" ${3:+"$3"} >/dev/null &&
    VERIFY_INSTANCE=$sides-$1 "$verify" exec node "$bin/consent.mjs" "$consent" >/dev/null
}

start_state() {
  local wallet_flag=''
  [[ $1 == signed-out ]] && wallet_flag=--no-wallet
  local baseline_pid candidate_pid started=yes
  start_side baseline "$baseline_source" "$wallet_flag" &
  baseline_pid=$!
  start_side candidate "$candidate_source" "$wallet_flag" &
  candidate_pid=$!
  wait "$baseline_pid" || started=''
  wait "$candidate_pid" || started=''
  [[ -n $started ]] || { echo "could not start the $1 browsers" >&2; exit 1; }
  if [[ $1 == connected ]]; then
    local side
    for side in baseline candidate; do
      connect_side "$side" || { echo "could not connect the $side browser: $reply" >&2; exit 1; }
    done
  fi
  echo "state $1: both browsers ready, consent $consent"
}

connect_side() {
  local side=$1 talisman=("$verify" wallet) site wanted
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
