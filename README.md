# Talisman Portal

<img src="apps/portal/public/talisman.svg" alt="Talisman" width="15%" align="right" />

[![website-link](https://img.shields.io/website?label=app.talisman.xyz&style=flat-square&up_message=online&url=https%3A%2F%2Fapp.talisman.xyz)](https://app.talisman.xyz)
[![discord-link](https://img.shields.io/discord/858891448271634473?logo=discord&logoColor=white&style=flat-square)](https://discord.gg/talisman)

**Unlock the Paraverse** with Talisman Portal.  
A Polkadot, Kusama & Parachain dashboard for the community.

With Talisman Portal you can buy DOT and KSM, contribute to crowdloans, view NFTs and more.

**Want more?**  
[Talisman Polkadot Wallet](https://talisman.xyz) | [Blog](https://medium.com/we-are-talisman) | [Docs](https://docs.talisman.xyz) | [Twitter](https://twitter.com/wearetalisman) | [Discord](https://discord.gg/talisman)

## How to set up a development environment

1. Clone the repo:

```sh
git clone https://github.com/TalismanSociety/talisman-web.git
```

2. Use the project targeted Node version using [nvm](https://github.com/nvm-sh/nvm) (Optional but will ensure no funny business with pnpm)

```sh
nvm use
```

3. Install [pnpm](https://pnpm.io/installation). It downloads the version pinned in `package.json` on first use.

4. Install the project dependencies:

```sh
pnpm install
```

5. Copy `.env.example` to `.env` and update the values inside:

```sh
cp apps/portal/.env.example apps/portal/.env
```

6. Start the dev server:

```sh
pnpm dev
```

## Test and verify

- `pnpm test` runs the unit tests. Tests sit next to their code as `*.test.ts` or `*.test.tsx` and run in jsdom. To run the tests of one file or folder, pass its path, as in `pnpm test apps/portal/src/domains`.
- `pnpm verify` runs Biome, typecheck, knip, the tests and the portal build. Run it before you push. It needs no env file. CI's `qa / validate` job runs `pnpm verify`, then the audit gate `pnpm audit --prod --audit-level critical`.
- For a change that a user can see, drive the portal in a real browser with the verify skill, [`.claude/skills/verify/SKILL.md`](.claude/skills/verify/SKILL.md), and run its visual parity check.
- knip ignores these on purpose: `wrangler` (Cloudflare Workers Builds and the Pages deploy run it), `dotenv` (loaded by `codegen:nova` through `--require`), and `packages/react-polkadot-api` (to be removed with `@polkadot/api`).
