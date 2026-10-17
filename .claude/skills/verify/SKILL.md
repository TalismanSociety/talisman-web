---
name: verify
description: Drive the Talisman Portal (apps/portal, staking dashboard) the way a user does, in a Docker browser of this checkout's own with the Chrome Web Store Talisman wallet and the developer's test accounts, and prove that a change renders every portal route pixel-identical to the parity baseline and builds the same staking transactions. Use to verify a UI or flow change, reproduce a bug, connect a wallet, run the visual parity gate, the staking smoke lane or the CSP violation check before a PR, or sign a test transaction with a Guardians account, from the main checkout or any git worktree.
---

# Verify the Talisman Portal

The user surface is the Vite SPA in `apps/portal`. A visitor lands on `/staking/providers`. With Talisman installed, the portal asks the wallet for its Substrate accounts on every load, and the visitor connects an Ethereum account from the wallet side sheet. There is no backend and no sign-in.

Each checkout, main or worktree, gets instances of its own. An instance is two things:

- an app server on the host, on a free port in 3200-3299. The dev instance runs `vite dev` with its own optimizer cache. A parity instance serves the built Worker with `bin/worker.mjs`, or a deployed site with `bin/proxy.mjs`.
- a container `talisman-web-verify-<checkout>[-<instance>]` from image `talisman-web-verify`: Chromium with the production Talisman from the Chrome Web Store, the developer's wallet backup already restored, auto-lock off. The container serves its app server as `http://localhost:3002`, so every browser sees the same origin. CDP is published on a free port in 9500-9599.

Several sessions can verify at once, each in its own worktree. They share the on-chain test accounts only.

Run every command from the checkout root.

## Setup (once per machine)

A developer does this once, by hand. `instance.sh up` checks each item and names the one that is missing. An agent that hits a missing item reports it and stops: it never creates accounts, backups or passwords.

1. **Tools**: Docker (Docker Engine on Linux, Docker Desktop or OrbStack on macOS), Node 22 or later, curl, lsof, jq, ImageMagick 7 (`magick`, for parity's pixel count), and the agent-browser CLI (`npm install -g agent-browser`). The checkout's own package manager runs from the checkout: yarn from `.yarnrc.yml`'s `yarnPath` through node, so corepack is not needed, or pnpm once the repo has a `pnpm-lock.yaml`.
2. **Test wallet**: in your browser's Talisman, use a recovery phrase made for testing only. It needs a Substrate account and an Ethereum account named so that `bin/talisman.mjs accounts` lists `Guardians SUB` and `Guardians EVM`, or set `PARITY_SUB_ACCOUNT` and `PARITY_EVM_ACCOUNT` to your names. Parity never signs anything.
3. **Backup**: open `chrome-extension://fijngjgcjhjmmpcmkeiomlglpeiijkld/support.html` in the browser where Talisman is installed, click **Backup**, then **Save**. Then:

   ```sh
   mkdir -p ~/.talisman-dev
   mv ~/Downloads/backup.talisman.*.json ~/.talisman-dev/verify-backup.json
   chmod 600 ~/.talisman-dev/verify-backup.json
   ```

   The Signet and Talisman repositories' verify skills read the same file.

4. **Wallet password**, read only by `talisman.mjs unlock`:

   ```sh
   (umask 177; printf '%s' 'the wallet password' > ~/.talisman-dev/verify-password)
   ```

5. **Image**: `.claude/skills/verify/bin/instance.sh build`. It takes a few minutes, and `up` runs it when the image is missing. The image holds your restored wallet: never push it to a registry.

On Linux with Docker Engine, `host.docker.internal` is the Docker bridge, where the app server does not listen and the host firewall drops the container's connection. There `instance.sh` serves each app server through a unix socket under `$XDG_RUNTIME_DIR/talisman-web-verify/`, which the container mounts. Docker Desktop and OrbStack take the `host.docker.internal` path.

### Test accounts

A test account is an account of `~/.talisman-dev/verify-backup.json`, and nothing else. Read the names with `bin/talisman.mjs accounts`; never write or assume one. `talisman.mjs connect --account <name>` and `approve --signer <name>` refuse any name that is not a test account.

## 1. Launch

```sh
.claude/skills/verify/bin/instance.sh up
```

It installs the checkout when `node_modules` is missing, starts the dev server (or reuses the one it started before), starts or reuses the container, closes leftover `about:blank` tabs, unlocks the wallet, runs the doctor, and records the instance in `.tmp/verify/instance.env`. Ready means the doctor printed only `PASS` lines: `up` exits 1 when the doctor fails. A container whose image, app server port, upstream or network changed is recreated, which resets its wallet to the baked state. Containers run on the Docker network `talisman-web-verify`, created with inter-container traffic off, so only the port published on the host's loopback reaches CDP. Each container is capped at 4 GB of memory with no swap (peak seen: 2.6 GB), so a lane pair never takes more than 8 GB plus its two host app servers (about 0.5 GB each).

Without a local `apps/portal/.env`, the dev server runs with the committed `apps/portal/.env.example`. With a local `.env`, Vite reads that file alone.

When `up` reports that it reused the dev server or container, write `reused` in `$RUN/notes.md`: cleanup then leaves them for the next run of this checkout.

## 2. Doctor

```sh
.claude/skills/verify/bin/doctor.mjs
```

Read-only, apart from a Talisman popup tab and a portal tab it opens and closes. One `PASS`/`FAIL` line per check, exit 1 on any `FAIL`: instance recorded, container runs for this checkout, the app server listening runs from this checkout, the browser reaches `http://localhost:3002`, CDP answers, the Talisman service worker runs, the wallet holds every backup account, the wallet is unlocked, and the portal renders without its error boundary ("Sorry, an error occurred in Talisman"). An instance started with `--no-wallet` skips the wallet checks. `VERIFY_INSTANCE=<id>` points the doctor, `ab` and `talisman.mjs` at another instance of this checkout, such as `parity-candidate`. A `WARN` line means the image's Talisman is older than the Chrome Web Store's: see [Maintenance](#maintenance).

## 3. Drive

```sh
RUN=.tmp/verify/runs/$(date +%Y%m%d-%H%M%S)-<feature>; mkdir -p "$RUN"
```

- **The page**: `.claude/skills/verify/bin/ab <agent-browser command>` drives this checkout's browser. Open pages with `ab tab new http://localhost:3002/<route>`, then `ab wait --text "<heading>"`. `ab snapshot -i` lists the clickable elements with refs.
- **Talisman popups**: agent-browser cannot see them. `bin/talisman.mjs text` prints `popup <id>`, then the pending request. `connect --account <name>` approves a connection request for exactly the named accounts (repeat `--account`), `site` prints the accounts the wallet connected to `localhost:3002`, `approve --signer <name> --popup <id>` signs that popup only when it is a signing request and that test account is its signer, `reject [--popup <id>]` cancels. Read the request (`text`) before approving.
- **Connecting like a user**: the portal opens a Substrate connect popup on load; answer it with `talisman.mjs connect --account "Guardians SUB"`. For Ethereum, click the header's `Connected` button, then the Ethereum wallets' `Connect`, then `talisman.mjs connect --account "Guardians EVM"`.

## 4. Evidence

Everything goes in `$RUN`, under the gitignored `.tmp/`. Cleanup never deletes it.

- Screenshots: `ab screenshot "$PWD/$RUN/<nn>-<step>.png"`. Give an absolute path: agent-browser writes a relative path into its own temp folder.
- Capture each user action and the state after it.
- Save each Talisman request you approve: `talisman.mjs approve … > "$RUN/<nn>-<what>-request.txt"`.
- `$RUN/notes.md`: what you verified, the entry point you used, `reused` or `started`, and each entry point you skipped with the reason.
- Never capture the wallet's recovery phrase or private key screens.

## 5. Cleanup

1. Close the tabs the run opened: `ab tab list`, then `ab tab close <id>`.
2. If this run started the instance: `.claude/skills/verify/bin/instance.sh down`. It removes every container of this checkout and stops the app servers its instances started, by process group, when the process listening on the recorded port still belongs to that group or when a process of that group still runs from this checkout's `apps/portal`, such as the socket relay of a server that died. It never touches another checkout's container or a server it did not start. Before removing a container it prints the container's memory peak against its cap, and a WARNING when the kernel killed a process in it at the cap: say so in your report, since a lane that ran on it may have failed for that reason alone.
3. Leave `$RUN` in place and name it in your report.

## Visual parity

`bin/parity.sh` proves that a change leaves the pixels alone. It builds the parity baseline and this checkout as the Worker that Workers Builds ships, serves each in a browser of its own, captures every route of `parity-routes.tsv` in both browsers at the same moment, and counts the pixels that differ.

```sh
.claude/skills/verify/bin/parity.sh                 # every route, desktop and mobile
.claude/skills/verify/bin/parity.sh providers positions   # only these routes
```

**The baseline.** `parity-baseline.sha` names the baseline commit: `d248b311` (main with React 19 and a reliable Ethereum reconnect, served as a Worker). The earlier pin `f7ab488e` lost the Ethereum reconnect on most loads, so its connected rows no longer match main. A migration unit never edits it: only the program coordinator moves it, and only to a main commit whose rendering is the reference. On first use, parity adds a detached git worktree of that commit at `.tmp/verify/parity/baseline-src`, installs it with that commit's own toolchain (`--frozen-lockfile`), builds it, and caches the build at `.tmp/verify/parity/baseline-<sha>/`. Later runs reuse that build. The candidate is this checkout, built with the toolchain it declares. Its build is reused only while `HEAD`, the diff and the untracked files outside `.claude/` are unchanged, so a stale build is never compared.

**The build.** Each side runs the root `build:portal`, the command Workers Builds runs, with its own committed `apps/portal/.env.example` exported so that a local `.env` cannot override a value it sets, and with `CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false` so that the Cloudflare Vite plugin does not copy the local `.env` secrets into `dist/server/.dev.vars`. The build fails when `apps/portal/dist` lacks `server/wrangler.json` or `client/index.html`, or holds a `server/.dev.vars`. The whole `dist` is cached. A commit older than the Worker cannot be a side.

**Serving.** `bin/worker.mjs` runs this checkout's `wrangler dev` on the side's `dist/server/wrangler.json`: the Worker script, its static assets with their `_headers` rules, and the `/_serverFn/` routes, in workerd, on the instance's app port. The container relays `http://localhost:3002` to it, so server function calls are same-origin, as on a deployed Worker.

**The TDA key.** The Bittensor server functions call tda.talisman.xyz with the `TDA_API_KEY` Worker secret. Without it every Bittensor row breaks on both sides. `worker.mjs` takes it from `TDA_API_KEY` in the environment, or else from the main checkout's gitignored `apps/portal/.env` (the main checkout even when parity runs in a worktree). It hands wrangler the key through wrangler's process environment (`CLOUDFLARE_INCLUDE_PROCESS_ENV=true`, with only `PATH` and `HOME` beside it), never through an argument or a file. Wrangler lists every binding as `(hidden)`. `worker.mjs` also replaces the key with `<TDA_API_KEY>` in every line it writes to the server log (`.tmp/verify/<instance>.log`), and keeps wrangler's own debug log and local state in `.tmp/verify/worker/<port>-*`, which it deletes when wrangler exits. Before any build, a lane that builds a side runs `bin/tda-key.mjs check`, which stops the lane with the reason when no key is found. At the end, every lane runs `bin/tda-key.mjs scan` over its out dir, the instance logs, the build logs and the served builds, and fails when any file holds the key value. Never print the key, and never pass it as an argument.

**Deployed sides.** `BASELINE_URL=https://<host>` or `CANDIDATE_URL=https://<host>` serves that side from a deployed site instead of a build, such as a Workers preview. Set one or both: a side given as a URL is not installed or built, and needs no key. Its browser reaches the site through `proxy.mjs`, so it still loads `http://localhost:3002` and the routes, waits, masks and compare run unchanged. The proxy forwards each request to the origin as sent and returns the reply bytes and headers as received. A redirect to an absolute URL leaves the proxy, so a route that is itself a redirect belongs to a curl check, not to parity.

**States.** Each route row names its wallet state:

- `signed-out`: Chromium without Talisman (`instance.sh serve <id> <build or URL> --no-wallet`), a visitor with no wallet. The portal shows its "Welcome to the Talisman Portal" guard on staking and transport.
- `connected`: Talisman loaded and unlocked, the Substrate account `Guardians SUB` and the Ethereum account `Guardians EVM` connected through the wallet's own popups, as a user does. Parity checks `talisman.mjs site` before the first connected route and stops if the wallet connected anything else. After a reload the portal restores both accounts, and the header reads `2 Connected`. The rows wait for the header's `Connected`, and `providers` waits for the account picker's `My accounts`, which it shows only while two or more accounts are connected. Parity writes the header's state of each capture to `<route>.<viewport>.<side>.header.txt`: a connected capture that reads other than `2 Connected` lost a reconnect.

Rows run in file order. Parity recreates both containers whenever the state changes from one row to the next, so every state starts from the baked wallet and an origin that holds only the consent seed. Keep the rows of one state together.

**Consent seed.** The portal shows a consent banner at the bottom of the page until the visitor decides. Every lane decides for it, on both sides, each time it starts a container: before any portal page loads, `bin/consent.mjs` opens `http://localhost:3002/` with the request answered by an empty page through CDP `Fetch`, so no app script runs, then writes the `analytics-consent` localStorage key into the browser profile, reads it back, and returns to `about:blank`. It writes that one key only. A baseline older than the banner never reads it. `CONSENT` picks the value:

- `reject`, the default: `{"analytics":false,"errors":false}`. No banner, and the analytics SDK never loads.
- `accept`: `{"analytics":true,"errors":true}`. No banner. The SDK loads only when the build has `VITE_POSTHOG_AUTH_TOKEN` and `VITE_ANALYTICS_LOCAL=true`, because the portal treats `localhost` as development. The `.env.example` build has neither, and a `CANDIDATE_URL` site still runs at `localhost:3002`, so `accept` loads the SDK only on a build made with both.
- `unset`: the key is removed, so both sides show the banner. Use it to check the banner itself.

`CONSENT=unset .claude/skills/verify/bin/parity.sh providers-signed-out` compares the banner on one route. `instance.sh up` does not seed the dev instance: run `bin/consent.mjs` after `up` when the banner is in the way.

**Per route, viewport and side**, in parallel on both sides: bring the tab to the front, set the viewport at scale 1 (`desktop` 1440x900, `mobile` 390x844), open `about:blank` then the path, inject at once a script that turns off CSS animations, transitions, the caret and scrollbars, holds SVG and script animations at their first frame, finishes finite script animations, and applies the masks on every DOM change, wait for `load`, click the row's button if it has one, wait up to 2 minutes for each wait item, then up to 1 minute for every image to load, wait 3 s, then take full-page screenshots every 500 ms until `STABLE` (default 4) in a row match the first. Then ImageMagick counts the pixels whose colour differs at all between the two sides' captures. A route that differs or whose capture fails is captured again, up to `ATTEMPTS` (default 3) times in all, because a live chain query can land between the two sides' captures or outlast a wait. A real change differs on every attempt.

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

**`--submit`.** After the compare pass, each flow with a `submit` note whose result is `same` runs once more on the candidate only. `talisman.mjs approve` signs it only when the popup's signer is the flow's account, and the lane refuses any account whose name lacks `Guardians`. `bin/smoke-chain.mjs` then finds the extrinsic in a block and reads its events with `@polkadot/api` 16.4.1, which the lane installs once under `.tmp/verify/parity/smoke-tools`, or waits for the Ethereum receipt. `submitted.tsv` lists each hash, block, fee, transfers and explorer link, and the script exits 1 when a submission fails. Submitting changes the account's state: a claim leaves nothing to claim until rewards accrue again, and `pools-bond-extra` pays out the pending rewards as it bonds, so `pools-claim` reads `unavailable` right after a submit run. The flows run in file order, so a pair that undoes itself, such as `subtensor-unstake` then `subtensor-stake`, leaves the account as it found it.

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
| `pools-claim-cere`                                     | `nominationPools.claimPayout` on Cere                                                                                 | calldata only: Cere's node refuses the signed claim with `UnknownTransaction::CannotLookup`                                                    |
| `pools-restake`                                        | `nominationPools.bondExtra(Rewards)` on Cere                                                                          | calldata only: Cere is never submitted, so its rewards stay pending for both Cere flows                                                        |
| `pools-unbond`, `pools-withdraw`                       | `nominationPools.unbond`, `withdrawUnbonded`                                                                          | calldata only: unbonding takes 7 days, a withdrawal happens once                                                                               |
| `validator-unbond`, `validator-withdraw`               | `staking.unbond` on Kusama Asset Hub, `staking.withdrawUnbonded` on Vara                                              | calldata only: the controller is `Guardians SUB 2`                                                                                             |
| `subtensor-unstake`, `subtensor-stake`                 | root `removeStake` of 0.1 TAO, then `addStake` of 0.1 TAO from the stake sheet, each batched with the Talisman remark | network fees; the pair restores the root stake, which must stay at 0.2 TAO or more so that 0.1 TAO remains above the portal's minimum          |
| `subtensor-dtao-stake`, `subtensor-dtao-unstake`       | SN46 `addStakeLimit` 0.01 TAO / `removeStakeLimit` 1 alpha, batched with the Talisman fee and remark                  | calldata only: besides the fees and slippage, a partial unstake can remove the whole position, as it did to an SN2 position on 15 October 2026 |
| `dapp-stake`, `dapp-unlock`                            | `dappStaking.stake` 500 ASTR, `dappStaking.unlock`                                                                    | calldata only: unlocking takes days                                                                                                            |
| `seek-stake`                                           | SEEK `approve` (or `stake` once approved)                                                                             | calldata only                                                                                                                                  |
| `seek-claim`                                           | `getReward`                                                                                                           | Ethereum gas, about 0.00002 ETH at 0.25 gwei                                                                                                   |
| `seek-unstake`, `seek-cancel-unstake`, `seek-withdraw` | `requestWithdrawal`, `cancelWithdrawal`, `completeWithdrawal`                                                         | calldata only                                                                                                                                  |
| `pools-join-avail`                                     | the Avail join with its `CheckAppId` extension                                                                        | calldata only: the account holds no AVAIL                                                                                                      |

Not covered: Lido, whose every write happens inside the `stake.lido.fi` iframe, so the portal builds no Lido transaction; and dApp staking claim, unstake and withdraw, which need a staked position the account does not hold. `pools-join-avail` and `seek-unstake` report `unavailable` today: Avail's chaindata RPC is dead, so its form never renders, and Seek disables Unstake while a withdrawal is pending.

**Adding a flow.** Add it next to its product, run `smoke.sh <flow>` twice on an unmodified checkout, and see `same` both times. Then change one argument of its transaction builder in a scratch edit, see `differ` naming the flow, and revert.

## CSP violation check

`bin/csp.sh` proves that the portal stays inside its Content Security Policy. The build appends a `Content-Security-Policy-Report-Only` line to `dist/client/_headers` (`apps/portal/scripts/csp-headers.ts`). A report-only policy blocks nothing, so this check is what shows it is safe to enforce.

```sh
.claude/skills/verify/bin/csp.sh                          # every parity route, both viewports, then every smoke flow
.claude/skills/verify/bin/csp.sh providers pools-claim    # only these routes and flows
CANDIDATE_URL=https://<preview host> .claude/skills/verify/bin/csp.sh   # a deployed Worker, with its own headers and env
```

It seeds consent as parity does (`CONSENT`, default `reject`; `accept` loads the SDK only on a build with a token and `VITE_ANALYTICS_LOCAL=true`). It serves only the candidate: this checkout's Worker through `worker.mjs`, whose static assets send the build's `_headers` rules, or `CANDIDATE_URL` through `proxy.mjs`. Once the candidate serves, it fetches `/` from it and stops when no `Content-Security-Policy` or `Content-Security-Policy-Report-Only` header with a `default-src` comes back. The routes and flows load the Bittensor data through the Worker's `/_serverFn/` calls, so those requests are under the same watch. It loads every row of `parity-routes.tsv` in its wallet state (`VIEWPORTS` as in parity) and waits for the row's wait items, then runs every flow of `smoke-flows.json` through `smoke.mjs`, which cancels each signing request. For each step, `bin/csp.mjs` watches the tab through CDP: a `securitypolicyviolation` listener in every new document, and the console of the page and of its workers. Violations inside a cross-origin frame, such as Lido's, belong to that frame's own policy and are not read.

The out dir (default `.tmp/verify/runs/<stamp>-csp`, or `OUT`) gets `summary.tsv` with `step`, `kind`, `violations`, `result` and `detail`, and a `<step>.jsonl` per step with each violation. A step fails on any violation, and when its route did not load or its watcher died. A step that did not load and recorded no violation runs again, up to `ATTEMPTS` (default 3) times in all; a violation in any attempt fails it. A flow that reads `unavailable` still loaded the portal, so it passes on 0 violations; a flow that ends in `error` fails. `violations` counts distinct violations: a page violation appears once, from its event, though the console logs it too. The script exits 1 when any step fails.

**Changing the policy.** Edit `apps/portal/scripts/csp-headers.ts` and its test, rebuild, then run `csp.sh`. To prove the check can fail, remove a source from the built `.tmp/verify/parity/candidate/client/_headers` (for example `'wasm-unsafe-eval'`), run `csp.sh providers-signed-out`, see it fail, then delete `.tmp/verify/parity/candidate.fingerprint` so the next run rebuilds.

## Helpers

All in `.claude/skills/verify/bin/`. Each finds this checkout's instance from `.tmp/verify/instance.env`, or `.tmp/verify/<id>.env` with `VERIFY_INSTANCE=<id>`.

| Helper            | Invocation                                                                                                                                           | Does                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `instance.sh`     | `build`, `up`, `serve <id> <Worker build dir or https://host> [--no-wallet]`, `down`, `ls`                                                                        | image, this checkout's instances, every checkout's containers                         |
| `doctor.mjs`      | `doctor.mjs`                                                                                                                                         | `PASS`/`FAIL` per check, exit 1 on any `FAIL`                                         |
| `ab`              | `ab <agent-browser command>`                                                                                                                         | agent-browser on this checkout's browser                                              |
| `talisman.mjs`    | `unlock`, `accounts`, `list`, `text`, `connect [--account <name>]…`, `site [host]`, `approve --signer <name> --popup <id>`, `reject [--popup <id>]`  | Talisman popups; exit 2 when it refused, 3 when the wallet is locked                  |
| `parity.sh`       | `parity.sh [route …]`, with `OUT`, `VIEWPORTS`, `ATTEMPTS`, `STABLE`, `CONSENT`, `PARITY_SUB_ACCOUNT`, `PARITY_EVM_ACCOUNT`, `BASELINE_URL` and `CANDIDATE_URL` | the parity gate; see [Visual parity](#visual-parity)                                  |
| `smoke.sh`        | `smoke.sh [--submit] [flow …]`, with `SMOKE_BASELINE`, `BASELINE_URL`, `CANDIDATE_URL`, `SMOKE_FLOWS`, `OUT`, `ATTEMPTS`, `CONSENT` and `SMOKE_STEP_TIMEOUT`                                     | the staking smoke lane; see [Staking smoke lane](#staking-smoke-lane)                 |
| `smoke.mjs`       | `smoke.mjs <flow> <out.json> [--submit]`, with `VERIFY_INSTANCE`                                                                                     | one flow on one browser: drive, capture, cancel or sign                               |
| `smoke-page.js`   | loaded in the page by `smoke.mjs`                                                                                                                    | records the signing requests and submissions, runs the flow steps                     |
| `smoke-chain.mjs` | `smoke-chain.mjs <submission json> <signer>`                                                                                                         | finds a submitted transaction on chain, with its result and fee                       |
| `csp.sh`          | `csp.sh [route or flow …]`, with `OUT`, `VIEWPORTS`, `ATTEMPTS`, `CONSENT`, `CANDIDATE_URL` and `SMOKE_FLOWS`                                                               | the CSP violation check; see [CSP violation check](#csp-violation-check)              |
| `csp.mjs`         | `csp.mjs <out.jsonl>`, with `VERIFY_INSTANCE`                                                                                                        | records every CSP violation of the open tabs until it is stopped                      |
| `consent.mjs`     | `consent.mjs [reject\|accept\|unset]`, with `VERIFY_INSTANCE`                                                                                         | writes or removes the `analytics-consent` key in the browser profile before the portal loads; see [Consent seed](#visual-parity) |
| `sides.sh`        | sourced by `parity.sh`, `smoke.sh` and `csp.sh`                                                                                                      | builds, serves and connects the baseline and candidate browsers                       |
| `worker.mjs`      | `worker.mjs <Worker build dir> <port>`, started by `instance.sh serve` with a build                                                                  | the build's Worker in `wrangler dev`, with the TDA key from the environment or the main checkout's `.env`, log redacted |
| `tda-key.mjs`     | `check`, `scan <path>…`                                                                                                                              | whether a TDA key is found; which files hold its value (exit 1 on any)                 |
| `proxy.mjs`       | `proxy.mjs <https://host> <port>`, started by `instance.sh serve` with an origin                                                                     | a deployed site, request by request                                                   |
| `toolchain.sh`    | sourced                                                                                                                                              | install, env and Worker build (`build:portal`) of a checkout with its own toolchain   |
| `app-socket.mjs`  | `app-socket.mjs <socket> <port>`, started by `instance.sh`                                                                                           | on a native Linux engine, the app server through the unix socket the container mounts |

`docker/` holds the image: `Dockerfile`, `bake-profile.sh` and `restore-backup.mjs` (restore at build), `start-chromium.sh` and `entrypoint.sh` (runtime relays: CDP on 9224, `localhost:3002` to the app server through `APP_UPSTREAM`; `WALLET=off` starts Chromium without Talisman).

## Maintenance

The image pins the Talisman version the Chrome Web Store served when it was built:

```sh
.claude/skills/verify/bin/instance.sh build    # rebuilds the extension and wallet layers when the store version or the backup changed
.claude/skills/verify/bin/instance.sh up       # recreates this checkout's container on the new image
```

Rebuild after you replace `~/.talisman-dev/verify-backup.json` too. A Talisman update can move pixels inside the wallet's own UI only; parity captures the portal page, which both sides render with the same image.

## Gotchas

- **The doctor fails "the portal renders" with a blank page on the dev server**: read the page errors (`ab errors`). `Error: env var VITE_SIMPLESWAP_API_KEY not set` means a local `apps/portal/.env` lacks the key: add it, then `instance.sh down` and `up`.
- **Wallet locked** (`talisman.mjs` exits 3, or the doctor fails "wallet is unlocked"): `talisman.mjs unlock`. Restarting a container locks the wallet; `up` and `serve` unlock it.
- **A click reports `✓ Done` and nothing happens**: agent-browser drives the newest tab, so a tab that a script opened through CDP takes every later `ab` command. `ab tab list` marks the tab it drives with `→`. Switch back with `ab tab <id>`, or close the stray tab.
- **The first `instance.sh build` fails with `ReferenceError: chrome is not defined`**: Talisman's service worker had not finished starting. `restore-backup.mjs` now waits for it; run `build` again if it still happens.
- **A worktree whose path is long**: unix sockets live under `$XDG_RUNTIME_DIR` (or `/tmp`) because a socket path must fit in 108 bytes.
- **Parity says the baseline worktree has local changes**: someone edited `.tmp/verify/parity/baseline-src`. Remove it with `git worktree remove --force .tmp/verify/parity/baseline-src` and rerun.
