---
name: verify
description: Drive the Talisman Portal (apps/portal, staking dashboard) the way a user does, in Docker containers of this worktree's own, which run the app server beside a browser with the Chrome Web Store Talisman wallet and the developer's test accounts, and prove that a change renders every portal route pixel-identical to the parity baseline and builds the same staking transactions. Use to verify a UI or flow change, reproduce a bug, connect a wallet, run the visual parity gate, the staking smoke lane or the CSP violation check before a PR, or sign a test transaction with a Guardians account, from the main checkout or any git worktree.
---

# Verify the Talisman Portal

The user surface is the Vite SPA in `apps/portal`. A connected visitor lands on `/staking/providers`; a visitor with no account stays on `/staking` behind the "Welcome to the Talisman Portal" guard. With Talisman installed, the portal asks the wallet for its Substrate accounts on every load, and the visitor connects an Ethereum account from the wallet side sheet. There is no backend and no sign-in.

Each worktree, the main checkout included, verifies in containers of its own, and nothing it verifies runs on the host. An instance is one container `talisman-web-verify-<worktree>-<instance>` from the image `talisman-web-verify:<hash of docker/ and the backup>`. It holds Chromium with the production Talisman from the Chrome Web Store, the developer's wallet backup already restored and auto-lock off, agent-browser, and the app server. The browser loads the app server as `http://localhost:3002` from the container's own loopback, so every browser sees the same origin.

- **dev** (`verify up`): the container installs the worktree into node_modules volumes of its own and runs `vite dev` with HMR on the bind-mounted worktree.
- **a side** (`verify serve <id> <source>`, run by the lanes): the container copies its source into a build volume, installs and builds it as the Worker that Workers Builds ships, and serves it with `wrangler dev`, or relays a deployed site.

**Never run `vite dev`, `vite preview` or `wrangler dev` on the host for verification.** A server on the host outlives the session that forgot to stop it. Every server of this skill runs inside its container and dies with it.

No container publishes a port. `bin/verify` reaches each one through `docker exec`. The worktree is mounted at its own absolute path, so a host path under the worktree names the same file inside, such as a screenshot or an out dir. A path outside the worktree does not exist in the container.

Several sessions can verify at once, each in its own worktree. Across worktrees they share the image, the Docker network, the on-chain test accounts and one volume, `talisman-web-verify-pnpm-store`: pnpm's content-addressed store, a cache that only speeds up installs. Everything else, node_modules and builds included, lives in volumes of the worktree.

Run every command from the worktree root. `verify` below stands for `.claude/skills/verify/bin/verify`.

## Setup (once per machine)

A developer does this once, by hand. `verify up` checks each item and names the one that is missing. An agent that hits a missing item reports it and stops: it never creates accounts, backups or passwords.

1. **Tools**: Docker (Docker Engine on Linux, Docker Desktop or OrbStack on macOS), Bash 4 or later (macOS ships 3.2: `brew install bash`), git, curl and jq. Node, pnpm, ImageMagick and agent-browser run inside the image. A baseline commit from before pnpm runs yarn from its `.yarnrc.yml`'s `yarnPath` through node.
2. **Test wallet**: in your browser's Talisman, use a recovery phrase made for testing only. It needs a Substrate account and an Ethereum account named so that `verify wallet accounts` lists `Guardians SUB` and `Guardians EVM`, or set `PARITY_SUB_ACCOUNT` and `PARITY_EVM_ACCOUNT` to your names. Parity never signs anything.
3. **Backup**: open `chrome-extension://fijngjgcjhjmmpcmkeiomlglpeiijkld/support.html` in the browser where Talisman is installed, click **Backup**, then **Save**. Then:

   ```sh
   mkdir -p ~/.talisman-dev
   mv ~/Downloads/backup.talisman.*.json ~/.talisman-dev/verify-backup.json
   chmod 600 ~/.talisman-dev/verify-backup.json
   ```

   The Signet and Talisman repositories' verify skills read the same file.

4. **Wallet password**, read only by `verify wallet unlock`:

   ```sh
   (umask 177; printf '%s' 'the wallet password' > ~/.talisman-dev/verify-password)
   ```

5. **Image**: `verify build`. It takes about a minute, and `up` and `serve` run it when the image is missing. The image holds your restored wallet: never push it to a registry.

### Test accounts

A test account is an account of `~/.talisman-dev/verify-backup.json`, and nothing else. Read the names with `verify wallet accounts`; never write or assume one. `verify wallet connect --account <name>` and `approve --signer <name>` refuse any name that is not a test account.

`Guardians SUB` still holds nomination pool stakes on Cere and Analog Timechain. The portal dropped both chains in #1484, so no providers or positions row shows them, and a Cere or Analog row is a regression. A baseline older than #1484 still shows both rows, so `providers` and `positions` differ against it.

## 1. Launch

```sh
.claude/skills/verify/bin/verify up
```

It starts the dev container or reuses it, installs the worktree with `--frozen-lockfile` into the container's node_modules volumes, starts `vite dev`, closes leftover `about:blank` tabs, unlocks the wallet and runs the doctor. Ready means the doctor printed only `PASS` lines: `up` exits 1 when the doctor fails. The volumes are mounted over the worktree's `node_modules` folders, so the container never runs the host's binaries and the host's own `node_modules` stay untouched. A container whose image or run arguments changed is recreated, which resets its wallet to the baked state. Containers run on the Docker network `talisman-web-verify`, created with inter-container traffic off. Each container is capped at 6 GiB of memory with no swap. Measured peaks: about 5.6 GiB for the dev container during its first install, of which about 3.7 GiB stays in use once `vite dev` runs, and up to 3 GiB for a side while it builds or runs a lane. A side keeps running after its lane, for reruns and `verify exec`, until `verify down`. The three containers of a lane with the dev instance up stay under 18 GiB.

Without a local `apps/portal/.env`, the dev server runs with the committed `apps/portal/.env.example`. With a local `.env`, Vite reads that file alone.

When `up` reports that it reused the container, write `reused` in `$RUN/notes.md`: cleanup then leaves it for the next run of this worktree.

## 2. Doctor

```sh
.claude/skills/verify/bin/verify doctor
```

Read-only, apart from a Talisman popup tab and a portal tab it opens and closes. One `PASS`/`FAIL` line per check, exit 1 on any `FAIL`: the container runs and belongs to this worktree, the browser reaches `http://localhost:3002`, CDP answers, the Talisman service worker runs, the wallet holds every backup account, the wallet is unlocked, and the portal renders without its error boundary ("Sorry, an error occurred in Talisman"). An instance served with `--no-wallet` skips the wallet checks. `VERIFY_INSTANCE=<id>` points `doctor`, `ab`, `wallet`, `exec` and `shell` at another instance of this worktree, such as `parity-candidate`. A `WARN` line means the container runs an older image than `docker/` and the backup now hash to, or that the image's Talisman is older than the Chrome Web Store's: see [Maintenance](#maintenance).

## 3. Drive

```sh
RUN=.tmp/verify/runs/$(date +%Y%m%d-%H%M%S)-<feature>; mkdir -p "$RUN"
```

- **The page**: `verify ab <agent-browser command>` drives the instance's browser. Open pages with `verify ab tab new http://localhost:3002/<route>`, then `verify ab wait --text "<heading>"`. `verify ab snapshot -i` lists the clickable elements with refs.
- **Talisman popups**: agent-browser cannot see them. `verify wallet text` prints `popup <id>`, then the pending request. `connect --account <name>` approves a connection request for exactly the named accounts (repeat `--account`), `site` prints the accounts the wallet connected to `localhost:3002`, `approve --signer <name> --popup <id>` signs that popup only when it is a signing request and that test account is its signer, `reject [--popup <id>]` cancels. Read the request (`text`) before approving.
- **Connecting like a user**: until the wallet has authorised `localhost:3002`, the portal opens a Substrate connect popup on load; answer it with `verify wallet connect --account "Guardians SUB"`. For Ethereum, click the header's `Connected` button, then the Ethereum wallets' `Connect`, then `verify wallet connect --account "Guardians EVM"`.

## 4. Evidence

Everything goes in `$RUN`, under the gitignored `.tmp/`. Cleanup never deletes it.

- Screenshots: `verify ab screenshot "$PWD/$RUN/<nn>-<step>.png"`. Give an absolute path under the worktree: agent-browser writes a relative path into its own temp folder, and a path outside the worktree stays inside the container.
- Capture each user action and the state after it.
- Save each Talisman request you approve: `verify wallet approve … > "$RUN/<nn>-<what>-request.txt"`.
- `$RUN/notes.md`: what you verified, the entry point you used, `reused` or `started`, and each entry point you skipped with the reason.
- Never capture the wallet's recovery phrase or private key screens.

## 5. Cleanup

1. Close the tabs the run opened: `verify ab tab list`, then `verify ab tab close <id>`.
2. If this run started the instance: `verify down`. It removes every container and volume of this worktree: the dev instance, the lanes' sides, the node_modules volumes and the build volumes. The servers lived in those containers, so nothing the worktree started is left running. It never touches the shared pnpm store or another worktree's containers. Before removing a running container it prints the container's memory peak against its cap, and a WARNING when the kernel killed a process in it at the cap: say so in your report, since a lane that ran on it may have failed for that reason alone.
3. Leave `$RUN` in place and name it in your report.

`verify prune` removes the containers and volumes of every worktree whose directory no longer exists. Run it after you delete a worktree without `down`; it never touches a worktree that still exists. `verify ls` lists every worktree's containers and volumes.

## Visual parity

`bin/parity.sh` proves that a change leaves the pixels alone. It builds the parity baseline and this checkout as the Worker that Workers Builds ships, serves each in a browser of its own, captures every route of `parity-routes.tsv` in both browsers at the same moment, and counts the pixels that differ.

```sh
.claude/skills/verify/bin/parity.sh                 # every route, desktop and mobile
.claude/skills/verify/bin/parity.sh providers positions   # only these routes
```

**The baseline.** `parity-baseline.sha` names the baseline commit: `3d313190` (main with the Swap tab back as a disabled page and without Cere and Analog, served as a Worker). The earlier pin `d248b311` has no Swap entry in the desktop nav and still lists Analog Timechain among the providers and Cere and Analog among the positions, so its desktop rows and its connected staking rows no longer match main. A migration unit never edits it: only the program coordinator moves it, and only to a main commit whose rendering is the reference. Each side runs in a container of its own, `parity-baseline` and `parity-candidate`. The baseline's source is that commit's `git archive`, copied into the build volume `talisman-web-verify-<worktree>-build-<sha>` and installed there with that commit's own toolchain (`--frozen-lockfile`). Later runs reuse its build. The candidate is this worktree's tracked and untracked files outside `.claude/`, copied into the build volume `talisman-web-verify-<worktree>-build-worktree` and installed with the toolchain it declares. Its build is reused only while `HEAD`, the diff and the untracked files outside `.claude/` are unchanged, so a stale build is never compared. `down` removes both volumes.

**The build.** Each side runs the root `build:portal`, the command Workers Builds runs, with its own committed `apps/portal/.env.example` exported so that a local `.env` cannot override a value it sets, and with `CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false` so that the Cloudflare Vite plugin does not copy the local `.env` secrets into `dist/server/.dev.vars`. The build fails when `apps/portal/dist` lacks `server/wrangler.json` or `client/index.html`, or holds a `server/.dev.vars`. A commit older than the Worker cannot be a side.

**Serving.** `bin/worker.mjs` runs the side's own `wrangler dev` on its `dist/server/wrangler.json`: the Worker script, its static assets with their `_headers` rules, and the `/_serverFn/` routes, in workerd, on `localhost:3002` inside the side's container. Server function calls are same-origin, as on a deployed Worker.

**The TDA key.** The Bittensor server functions call tda.talisman.xyz with the `TDA_API_KEY` Worker secret. Without it every Bittensor row breaks on both sides. `worker.mjs` takes it from `TDA_API_KEY` in the host's environment, which `verify` passes into the container by name, or else from the main checkout's gitignored `apps/portal/.env` (the main checkout even when parity runs in a worktree), which `verify` mounts read-only at its own path. It hands wrangler the key through wrangler's process environment (`CLOUDFLARE_INCLUDE_PROCESS_ENV=true`, with only `PATH` and `HOME` beside it), never through an argument or a file. Wrangler lists every binding as `(hidden)`. `worker.mjs` also replaces the key with `<TDA_API_KEY>` in every line it writes to the server log (`.tmp/verify/<instance>.log`), and keeps wrangler's own debug log and local state in a folder under the container's `/tmp`, which it deletes when wrangler exits. Before any build, a lane that builds a side runs `bin/tda-key.mjs check`, which stops the lane with the reason when no key is found. At the end, every lane runs `bin/tda-key.mjs scan` in each side's container over its out dir, the instance logs, the side's install and build logs and its served build, and fails when any file holds the key value. Never print the key, and never pass it as an argument.

**Deployed sides.** `BASELINE_URL=https://<host>` or `CANDIDATE_URL=https://<host>` serves that side from a deployed site instead of a build, such as a Workers preview. Set one or both: a side given as a URL is not installed or built, and needs no key. Its browser reaches the site through `proxy.mjs`, so it still loads `http://localhost:3002` and the routes, waits, masks and compare run unchanged. The proxy forwards each request to the origin as sent and returns the reply bytes and headers as received. A redirect to an absolute URL leaves the proxy, so a route that is itself a redirect belongs to a curl check, not to parity.

**States.** Each route row names its wallet state:

- `signed-out`: Chromium without Talisman (`verify serve <id> <commit, worktree or https://host> --no-wallet`), a visitor with no wallet. The portal shows its "Welcome to the Talisman Portal" guard on staking and transport.
- `connected`: Talisman loaded and unlocked, the Substrate account `Guardians SUB` and the Ethereum account `Guardians EVM` connected through the wallet's own popups, as a user does. Parity checks `verify wallet site` before the first connected route and stops if the wallet connected anything else. After a reload the portal restores both accounts, and the header reads `2 Connected`. The rows wait for the header's `Connected`, and `providers` waits for the account picker's `My accounts`, which it shows only while two or more accounts are connected. Parity writes the header's state of each capture to `<route>.<viewport>.<side>.header.txt`: a connected capture that reads other than `2 Connected` lost a reconnect.

Rows run in file order. Parity recreates both containers whenever the state changes from one row to the next, so every state starts from the baked wallet and an origin that holds only the consent seed. Keep the rows of one state together.

**Consent seed.** The portal shows a consent banner at the bottom of the page until the visitor decides. Every lane decides for it, on both sides, each time it starts a container: before any portal page loads, `bin/consent.mjs` opens `http://localhost:3002/` with the request answered by an empty page through CDP `Fetch`, so no app script runs, then writes the `analytics-consent` localStorage key into the browser profile, reads it back, and returns to `about:blank`. It writes that one key only. A baseline older than the banner never reads it. `CONSENT` picks the value:

- `reject`, the default: `{"analytics":false,"errors":false}`. No banner, and the analytics SDK never loads.
- `accept`: `{"analytics":true,"errors":true}`. No banner. The SDK loads only when the build has `VITE_POSTHOG_AUTH_TOKEN` and `VITE_ANALYTICS_LOCAL=true`, because the portal treats `localhost` as development. The `.env.example` build has neither, and a `CANDIDATE_URL` site still runs at `localhost:3002`, so `accept` loads the SDK only on a build made with both.
- `unset`: the key is removed, so both sides show the banner. Use it to check the banner itself.

`CONSENT=unset .claude/skills/verify/bin/parity.sh providers-signed-out` compares the banner on one route. `verify up` does not seed the dev instance: run `verify exec node .claude/skills/verify/bin/consent.mjs` after `up` when the banner is in the way.

**Per route, viewport and side**, in parallel on both sides: bring the tab to the front, set the viewport at scale 1 (`desktop` 1440x900, `mobile` 390x844), open `about:blank` then the path, inject at once a script that turns off CSS animations, transitions, the caret and scrollbars, holds SVG and script animations at their first frame, finishes finite script animations, and applies the masks on every DOM change, wait for `load`, click the row's button if it has one, wait up to 2 minutes for each wait item, then up to 1 minute for every image to load, wait 3 s, then take full-page screenshots every 500 ms until `STABLE` (default 4) in a row match the first. Then ImageMagick, in the candidate's container, counts the pixels whose colour differs at all between the two sides' captures. A route that differs or whose capture fails is captured again, up to `ATTEMPTS` (default 3) times in all, because a live chain query can land between the two sides' captures or outlast a wait. A real change differs on every attempt.

The out dir (default `.tmp/verify/runs/<stamp>-parity`, or `OUT`) gets `summary.tsv` with `route`, `viewport`, `different`, `total`, `attempts`, `result` and `detail` (each attempt's differing pixels, then any failure), `<route>.<viewport>.baseline.png` and `.candidate.png`, a `.baseline.header.txt` and `.candidate.header.txt` with the header's wallet state in that capture (`2 Connected`, `Connect wallet`), and `.diff.png` for a route that differs. The script exits 1 when any route differs or fails.

**Pass rule.** 0 differing pixels on every route and viewport, after masks. A nonzero route fails the unit. Never edit the baseline sha, the harness, a mask or a route row to make a diff pass: stop and report the route with its `diff.png`.

### The route file

`parity-routes.tsv` has one row per route, tab-separated. Lines starting with `#` are skipped; the first one names the columns.

| Column     | Holds                                                                                                                                                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name       | the route's id in the summary and file names                                                                                                                                                                                                                                                            |
| state      | `signed-out` or `connected`                                                                                                                                                                                                                                                                             |
| path       | the path and query; `<sub>` and `<evm>` become the connected accounts' addresses                                                                                                                                                                                                                        |
| wait items | separated by `\|`, each ready when any of its `\|\|` alternatives is: a text node containing the text, `css:<selector>` matching an element, `path:<path and query>` equal to the page's location (for redirects), or `count:<n>:<regex>` matching at least n trimmed text nodes; an item holds no `\|` |
| masks      | a JSON list: a CSS selector hides its elements; `text:<regex>` replaces each text node whose trimmed text matches with the placeholder `0000` and hides its element; a `?` prefix allows the mask to match nothing                                                                                      |
| button     | optional: a button to click first, matched by role and part of its accessible name                                                                                                                                                                                                                      |

A wait item names content that appears only once the page has loaded: the frozen stylesheet also stops spinners and skeletons, so a page that is still loading can look settled. Count the values a table loads (`count:`) rather than waiting for one of them. Masked text still satisfies a wait and a count: they read the text before its placeholder.

A text mask swaps the value for a fixed placeholder, so a live value whose width changes cannot move its neighbours, and a value that a chain query fills in later cannot either: both sides lay out `0000`.

Not covered: the signed-out nomination-pools sheet (`/staking/providers?action=stake&type=nomination-pools&chain=polkadot-asset-hub` without a wallet). On desktop it crashes into the error boundary on some loads and stays on its skeleton on others; on mobile it never settles. Both sides behave the same way, but not on the same load.

### Adding a route

1. Add the row next to the rows of its state.
2. Run `parity.sh <name>` on an unmodified checkout of the baseline commit. It must report 0 on every viewport, twice in a row.
3. If it differs, open its `diff.png`. Mask only the element whose value legitimately moves between two fetches, as narrowly as the DOM allows, and add it to the mask table below with its reason. Then repeat step 2.
4. Prove the route can fail: change one visible string on that page in a scratch edit, run `parity.sh <name>`, see it fail, then revert.

### Mask rules

- A mask hides a live value that differs between two fetches a few seconds apart: a price, a fiat total, a balance, an APY, a TVL, a block-derived countdown. Nothing else.
- A mask is as narrow as the DOM allows: the text node's element, never its row, card, table or page. A mask over a whole card or page is a fail.
- Prefer structure, roles and stable attributes. Emotion class names (`css-*`) are hashes of style content and change with any styling migration.
- A mask selector that matches no element fails its route, so a stale mask cannot hide a regression without notice. Use `?` only for an element that is absent in some loads, and say why in the table.
- A masked region is not compared. When a change touches a masked element, capture it by hand on both sides.

| Selector                                                              | Routes                                                                                       | Why                                                                                                                                                                                                                                                       |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text:^\$\s?[0-9][0-9,.]*[kKmMbB]?$`                                  | connected providers, positions, stake sheets, unknown                                        | a fiat value: a balance times a live price                                                                                                                                                                                                                |
| `text:^[0-9][0-9,.]*%$`                                               | connected providers, stake sheets, unknown; `stake-dapp-signed-out`, `stake-seek-signed-out` | an APR, estimated return, staked share or commission, recomputed from chain and price data on every load                                                                                                                                                  |
| `text:^[0-9][0-9,.]*\s(DOT\|KSM\|…\|\S)$`                             | connected providers, positions, stake sheets, unknown                                        | a token balance or staked amount, which rewards and chain state move                                                                                                                                                                                      |
| `text:^[0-9][0-9,.]*\s\S+ / Year( \(\$[0-9,.]+\))?$`                  | `stake-pools`                                                                                | the estimated yearly earning, from the live APR and price                                                                                                                                                                                                 |
| `text:^(about )?[0-9]+ (minutes?\|hours?\|days?)$`                    | `stake-pools`, `stake-dapp`, `stake-dapp-signed-out`                                         | an era or unbonding countdown, which moves with the block clock                                                                                                                                                                                           |
| `iframe[src^="https://stake.lido.fi"]`                                | `stake-lido`, `stake-lido-signed-out`                                                        | Lido's cross-origin staking widget: third-party content with live rates, not portal code                                                                                                                                                                  |
| `div.truncate > span:last-child > span:first-child > div > div:empty` | `positions`                                                                                  | the 8 px reward-status dots of the desktop position rows. The era-reward query of validator staking rows never resolves on some loads, so a dot stays grey on one side at random, and nothing in the DOM sets a validator row's dot apart from the others |

## Staking smoke lane

`bin/smoke.sh` proves that a change builds the same transactions. Pixels cannot show a wrong extrinsic. It builds and serves the baseline and this checkout as Workers, as parity does, connects `Guardians SUB` and `Guardians EVM` in both browsers, then runs every flow of `smoke-flows.json` on both sides at the same moment. A flow drives the UI up to the wallet's signing request, records the payload the portal hands to Talisman, and cancels the request in the wallet. Nothing is signed by default.

```sh
.claude/skills/verify/bin/smoke.sh                        # every flow, every request cancelled
.claude/skills/verify/bin/smoke.sh pools-claim seek-claim # only these flows
.claude/skills/verify/bin/smoke.sh --submit               # then sign and submit the flows marked "submit" on the candidate
```

`SMOKE_BASELINE` names the baseline revision (default: `parity-baseline.sha`), `BASELINE_URL` and `CANDIDATE_URL` serve a side from a deployed site as in parity, and `SMOKE_FLOWS` another flow file, such as one-off flows that put an account back in shape. `OUT`, `ATTEMPTS` (default 3), `CONSENT` (default `reject`, see the consent seed in [Visual parity](#visual-parity)) and `SMOKE_STEP_TIMEOUT` (seconds per step, default 90) work as in parity. The flows click by coordinates, so a banner left on the page by `CONSENT=unset` can take a click meant for a row near the bottom of the page.

**What is compared.** `bin/smoke-page.js` loads in the page before the app. It records each `pub(extrinsic.sign)` and `eth_sendTransaction` message that the page sends to Talisman through `window.postMessage`, so it sees what any signing library hands the wallet. For Substrate the lane compares the signer's public key, the genesis hash, the call data (`method`), the tip, and `appId` or `assetId` when set. For Ethereum it compares `from`, `to`, `data`, `value` and `chainId`. Nonce, era, block hash, spec and transaction versions, signed extension list and gas are left out.

**Results.** The out dir (default `.tmp/verify/runs/<stamp>-smoke`) gets `summary.tsv` with `flow`, `result`, `attempts` and `detail`, a `<flow>.<side>.json` per side with the payload, the raw request and the wallet popup's text, and a `<flow>.<side>.png` for a side that did not reach the wallet.

- `same`: both sides reached the wallet with equal payloads.
- `differ`: the payloads differ, or only one side reached the wallet. The detail names each differing field. A flow that differs runs again, up to `ATTEMPTS` in all, because a dTAO limit price follows the live pool price. The script exits 1.
- `unavailable`: neither side reached the wallet, usually because the account has no such position right now (no pending rewards, nothing to withdraw). It does not fail the run, but nothing was compared: read the detail and the screenshots.
- A detail `the wallet refused without a popup` means the payload was captured but its signer is not connected to the portal. The validator flows sign with the legacy controller `Guardians SUB 2`.

**`--submit`.** After the compare pass, each flow with a `submit` note whose result is `same` runs once more on the candidate only. `verify wallet approve` signs it only when the popup's signer is the flow's account, and the lane refuses any account whose name lacks `Guardians`. `bin/smoke-chain.mjs` then finds the extrinsic in a block and reads its events with `@polkadot/api` 16.4.1, which the image holds, or waits for the Ethereum receipt. `submitted.tsv` lists each hash, block, fee, transfers and explorer link, and the script exits 1 when a submission fails. Submitting changes the account's state: a claim leaves nothing to claim until rewards accrue again, and `pools-bond-extra` pays out the pending rewards as it bonds, so `pools-claim` and `pools-restake` read `unavailable` right after a submit run. The flows run in file order, so a pair that undoes itself, such as `subtensor-unstake` then `subtensor-stake`, leaves the account as it found it.

**The flow file.** Each flow names `account`, `path` and `steps`, plus `submit`, the cost note of a flow that is cheap and reversible enough to sign. Steps run in order, each retried until it succeeds or times out:

| Step                           | Does                                                                                                                                                                                                |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `["row", text…]`               | scopes the next steps to the position row holding every text: the smallest element around them that holds exactly one actions menu                                                                  |
| `["dialog"]`, `["page"]`       | scopes to the topmost open modal dialog, or to the whole page                                                                                                                                       |
| `["press", name]`              | clicks, with the mouse, the first enabled button whose text is `name` or starts with `name `; `=name` exact, `~name` contains, `#icon` an icon-only button, `#menu` the actions menu, `a\|b` either |
| `["see", name]`                | waits for such a button without clicking                                                                                                                                                            |
| `["fill", placeholder, value]` | types the value into the input with that placeholder                                                                                                                                                |
| `["wait", text]`               | waits for visible text                                                                                                                                                                              |

An Ethereum flow first waits for the header's `2 Connected`, and connects the Ethereum account through the wallet sheet when the portal did not restore it after the page load.

| Flow                                                   | Builds                                                                                                                | `--submit` cost                                                                                                                                |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `pools-join`                                           | `utility.batchAll[nominationPools.join, setClaimPermission]` on Polkadot Asset Hub                                    | calldata only: locks 1 DOT for 28 days                                                                                                         |
| `pools-bond-extra`                                     | `nominationPools.bondExtra(FreeBalance 0.001 KSM)` on Kusama Asset Hub                                                | network fee; the 0.001 KSM stays bonded in the pool                                                                                            |
| `pools-claim`                                          | `nominationPools.claimPayout` on Kusama Asset Hub                                                                     | network fee                                                                                                                                    |
| `pools-restake`                                        | `nominationPools.bondExtra(Rewards)` on Kusama Asset Hub                                                              | calldata only: `pools-claim` already submits the same pending rewards                                                                          |
| `pools-unbond`, `pools-withdraw`                       | `nominationPools.unbond`, `withdrawUnbonded`                                                                          | calldata only: unbonding takes 7 days, a withdrawal happens once                                                                               |
| `validator-unbond`, `validator-withdraw`               | `staking.unbond` on Kusama Asset Hub, `staking.withdrawUnbonded` on Vara                                              | calldata only: the controller is `Guardians SUB 2`                                                                                             |
| `subtensor-unstake`, `subtensor-stake`                 | root `removeStake` of 0.1 TAO, then `addStake` of 0.1 TAO from the stake sheet, each batched with the Talisman remark | network fees; the pair restores the root stake, which must stay at 0.2 TAO or more so that 0.1 TAO remains above the portal's minimum          |
| `subtensor-dtao-stake`, `subtensor-dtao-unstake`       | SN46 `addStakeLimit` 0.01 TAO / `removeStakeLimit` 1 alpha, batched with the Talisman fee and remark                  | calldata only: besides the fees and slippage, a partial unstake can remove the whole position, as it did to an SN2 position on 15 October 2026 |
| `dapp-stake`, `dapp-unlock`                            | `dappStaking.stake` 500 ASTR, `dappStaking.unlock`                                                                    | calldata only: unlocking takes days                                                                                                            |
| `seek-stake`                                           | SEEK `approve` (or `stake` once approved)                                                                             | calldata only                                                                                                                                  |
| `seek-claim`                                           | `getReward`                                                                                                           | Ethereum gas, about 0.00002 ETH at 0.25 gwei                                                                                                   |
| `seek-unstake`, `seek-cancel-unstake`, `seek-withdraw` | `requestWithdrawal`, `cancelWithdrawal`, `completeWithdrawal`                                                         | calldata only                                                                                                                                  |
| `pools-join-avail`                                     | the Avail join with its `CheckAppId` extension                                                                        | calldata only: the account holds no AVAIL                                                                                                      |

Not covered: Lido, whose every write happens inside the `stake.lido.fi` iframe, so the portal builds no Lido transaction; and dApp staking claim, unstake and withdraw, which need a staked position the account does not hold. `pools-join-avail` and `seek-unstake` report `unavailable` today: `Guardians SUB` holds no AVAIL, so the Avail form reads "Insufficient balance" and keeps Stake disabled, and Seek disables Unstake while a withdrawal is pending.

**Adding a flow.** Add it next to its product, run `smoke.sh <flow>` twice on an unmodified checkout, and see `same` both times. Then change one argument of its transaction builder in a scratch edit, see `differ` naming the flow, and revert.

## CSP violation check

`bin/csp.sh` proves that the portal stays inside its Content Security Policy. The build appends a `Content-Security-Policy-Report-Only` line to `dist/client/_headers` (`apps/portal/scripts/csp-headers.ts`). A report-only policy blocks nothing, so this check is what shows it is safe to enforce. The enforced `Content-Security-Policy` beside it holds only `frame-ancestors` (`apps/portal/scripts/frame-ancestors.ts`).

```sh
.claude/skills/verify/bin/csp.sh                          # every parity route, both viewports, then every smoke flow
.claude/skills/verify/bin/csp.sh providers pools-claim    # only these routes and flows
CANDIDATE_URL=https://<preview host> .claude/skills/verify/bin/csp.sh   # a deployed Worker, with its own headers and env
```

It seeds consent as parity does (`CONSENT`, default `reject`; `accept` loads the SDK only on a build with a token and `VITE_ANALYTICS_LOCAL=true`). It serves only the candidate, in its `csp-candidate` container: this worktree's Worker through `worker.mjs`, whose static assets send the build's `_headers` rules, or `CANDIDATE_URL` through `proxy.mjs`. Once the candidate serves, it fetches `/` from it and stops when no `Content-Security-Policy` or `Content-Security-Policy-Report-Only` header with a `default-src` comes back. The routes and flows load the Bittensor data through the Worker's `/_serverFn/` calls, so those requests are under the same watch. It loads every row of `parity-routes.tsv` in its wallet state (`VIEWPORTS` as in parity) and waits for the row's wait items, then runs every flow of `smoke-flows.json` through `smoke.mjs`, which cancels each signing request. For each step, `bin/csp.mjs` watches the tab through CDP: a `securitypolicyviolation` listener in every new document, and the console of the page and of its workers. Violations inside a cross-origin frame, such as Lido's, belong to that frame's own policy and are not read.

The out dir (default `.tmp/verify/runs/<stamp>-csp`, or `OUT`) gets `summary.tsv` with `step`, `kind`, `violations`, `result` and `detail`, and a `<step>.jsonl` per step with each violation. A step fails on any violation, and when its route did not load or its watcher died. A step that did not load and recorded no violation runs again, up to `ATTEMPTS` (default 3) times in all; a violation in any attempt fails it. A flow that reads `unavailable` still loaded the portal, so it passes on 0 violations; a flow that ends in `error` fails. `violations` counts distinct violations: a page violation appears once, from its event, though the console logs it too. The script exits 1 when any step fails.

**Changing the policy.** Edit `apps/portal/scripts/csp-headers.ts` and its test, then run `csp.sh`, which rebuilds. To prove the check can fail, remove a source from the candidate's built headers with `VERIFY_INSTANCE=csp-candidate verify exec sed -i "s/ 'wasm-unsafe-eval'//" /side/src/apps/portal/dist/client/_headers`, run `csp.sh providers-signed-out`, see it fail, then run `VERIFY_INSTANCE=csp-candidate verify exec rm /side/fingerprint` so the next run rebuilds.

## Helpers

All in `.claude/skills/verify/bin/`. `verify` runs on the host. Every other helper runs inside a container, as your user: through `verify wallet`, `verify doctor`, or `verify exec node .claude/skills/verify/bin/<helper>`, with `VERIFY_INSTANCE=<id>` for an instance other than dev.

| Helper            | Invocation                                                                                                                                           | Does                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `verify`          | `build`, `up`, `serve <id> <commit, worktree or https://host> [--no-wallet]`, `doctor`, `ab <args…>`, `wallet <args…>`, `exec [-i] <cmd…>`, `shell`, `down`, `prune`, `ls` | the image, this worktree's containers and volumes, and the way into them               |
| `container.sh`    | `install <dir>`, `sync-commit`, `sync-worktree`, `build <fingerprint>`, `dev`, `worker`, `proxy <https://host>`, run by `verify` inside the container | install with the source's own toolchain, the side's source and Worker build (`build:portal`), the servers |
| `doctor.mjs`      | run by `verify doctor`                                                                                                                               | `PASS`/`FAIL` per check, exit 1 on any `FAIL`                                         |
| `talisman.mjs`    | `verify wallet` with `unlock`, `accounts`, `list`, `text`, `connect [--account <name>]…`, `site [host]`, `approve --signer <name> --popup <id>`, `reject [--popup <id>]` | Talisman popups; exit 2 when it refused, 3 when the wallet is locked                  |
| `parity.sh`       | `parity.sh [route …]`, with `OUT`, `VIEWPORTS`, `ATTEMPTS`, `STABLE`, `CONSENT`, `PARITY_SUB_ACCOUNT`, `PARITY_EVM_ACCOUNT`, `BASELINE_URL` and `CANDIDATE_URL` | the parity gate; see [Visual parity](#visual-parity)                                  |
| `smoke.sh`        | `smoke.sh [--submit] [flow …]`, with `SMOKE_BASELINE`, `BASELINE_URL`, `CANDIDATE_URL`, `SMOKE_FLOWS`, `OUT`, `ATTEMPTS`, `CONSENT` and `SMOKE_STEP_TIMEOUT`                                     | the staking smoke lane; see [Staking smoke lane](#staking-smoke-lane)                 |
| `smoke.mjs`       | `smoke.mjs <flow> <out.json> [--submit]`                                                                                                             | one flow on one browser: drive, capture, cancel or sign                               |
| `smoke-page.js`   | loaded in the page by `smoke.mjs`                                                                                                                    | records the signing requests and submissions, runs the flow steps                     |
| `smoke-chain.mjs` | `smoke-chain.mjs <submission json> <signer>`                                                                                                         | finds a submitted transaction on chain, with its result and fee                       |
| `csp.sh`          | `csp.sh [route or flow …]`, with `OUT`, `VIEWPORTS`, `ATTEMPTS`, `CONSENT`, `CANDIDATE_URL` and `SMOKE_FLOWS`                                                               | the CSP violation check; see [CSP violation check](#csp-violation-check)              |
| `csp.mjs`         | `csp.mjs <out.jsonl>`, until its stdin closes                                                                                                        | records every CSP violation of the open tabs                                          |
| `consent.mjs`     | `consent.mjs [reject\|accept\|unset]`                                                                                                                | writes or removes the `analytics-consent` key in the browser profile before the portal loads; see [Consent seed](#visual-parity) |
| `sides.sh`        | sourced by `parity.sh`, `smoke.sh` and `csp.sh`                                                                                                      | serves and connects the baseline and candidate browsers                               |
| `worker.mjs`      | `worker.mjs <source dir>`, run by `container.sh worker`                                                                                              | the build's Worker in `wrangler dev`, with the TDA key from the environment or the main checkout's `.env`, log redacted |
| `tda-key.mjs`     | `check`, `scan <path>…`                                                                                                                              | whether a TDA key is found; which files hold its value (exit 1 on any)                 |
| `proxy.mjs`       | `proxy.mjs <https://host>`, run by `container.sh proxy`                                                                                              | a deployed site, request by request                                                   |
| `lib.mjs`         | imported by the `.mjs` helpers                                                                                                                       | CDP targets and evaluation, the backup's test accounts                                |

`docker/` holds the image: `Dockerfile`, `bake-profile.sh` and `restore-backup.mjs` (restore at build), `entrypoint.sh` (hands the profile and volumes to your uid, then drops to it) and `start-chromium.sh` (CDP on `127.0.0.1:9223` inside the container; `WALLET=off` starts Chromium without Talisman).

## Maintenance

The image pins the Talisman version the Chrome Web Store served when it was built:

```sh
.claude/skills/verify/bin/verify build    # rebuilds the extension and wallet layers when the store version or the backup changed
.claude/skills/verify/bin/verify up       # recreates this worktree's dev container on the new image
```

Rebuild after you replace `~/.talisman-dev/verify-backup.json` too; `up` and `serve` build the new tag themselves, since the tag hashes `docker/` and the backup. Old tags stay until you remove them (`docker image ls talisman-web-verify`). A Talisman update can move pixels inside the wallet's own UI only; parity captures the portal page, which both sides render with the same image.

## Gotchas

- **The doctor fails "the portal renders" with a blank page on the dev server**: read the page errors (`verify ab errors`) and the server log (`.tmp/verify/dev.log`).
- **Bittensor positions show validator addresses instead of names (`Yuma`) on the dev instance**: under `vite dev` the client calls each server function at `<page path>/undefined<id>` instead of `/_serverFn/<id>`, so no TDA data loads, key or not. Check Bittensor rows on a Worker instance (`verify serve <id> worktree`) or with the lanes.
- **Wallet locked** (`verify wallet` exits 3, or the doctor fails "wallet is unlocked"): `verify wallet unlock`. Restarting a container locks the wallet; `up` and `serve` unlock it.
- **A click reports `✓ Done` and nothing happens**: agent-browser drives the newest tab, so a tab that a script opened through CDP takes every later `ab` command. `verify ab tab list` marks the tab it drives with `→`. Switch back with `verify ab tab <id>`, or close the stray tab.
- **The first `verify build` fails with `ReferenceError: chrome is not defined`**: Talisman's service worker had not finished starting. `restore-backup.mjs` now waits for it; run `build` again if it still happens.
- **The VARA row of `providers` never loads on either side**, and the page's chain socket answers `Maximum number of chainHead_follow has been reached`: the Vara RPC caps follow subscriptions per public IP, and every Talisman in a container, or in your own browser, holds some. With the dev instance up beside a lane's two sides, the cap is reached. Stop the dev instance (`docker stop talisman-web-verify-<worktree>-dev`, or `verify down`) before a connected lane, and expect the same when another worktree runs a connected lane at the same time.
- **Run one lane at a time per worktree**: the sides of parity, smoke and csp share the worktree's build volumes, so two lanes at once would rebuild the same volume under each other.
