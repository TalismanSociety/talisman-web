# Talisman Web

<img src="apps/web/public/talisman.svg" alt="Talisman" width="15%" align="right" />

[![website-link](https://img.shields.io/website?label=app.talisman.xyz&style=flat-square&up_message=online&url=https%3A%2F%2Fapp.talisman.xyz)](https://app.talisman.xyz)
[![discord-link](https://img.shields.io/discord/858891448271634473?logo=discord&logoColor=white&style=flat-square)](https://discord.gg/talisman)

**Unlock the Paraverse** with Talisman Web.  
A Polkadot, Kusama & Parachain dashboard for the community.

With Talisman Web you can buy DOT and KSM, contribute to crowdloans, view NFTs and more.

**Want more?**  
[Talisman Polkadot Wallet](https://talisman.xyz) | [Blog](https://talisman.xyz/blog) | [Docs](https://docs.talisman.xyz) | [Twitter](https://twitter.com/wearetalisman) | [Discord](https://discord.gg/talisman)

## How to set up a development environment

1. Clone the repo:

```sh
git clone https://github.com/TalismanSociety/talisman-web.git
```

2. Use the project targeted Node version using [nvm](https://github.com/nvm-sh/nvm) (Optional but will ensure no funny business with Yarn)

```sh
nvm use
```

3. Install the project dependencies:

```sh
yarn
```

4. Copy `.env.example` to `.env` and update the values inside:

```sh
cp apps/web/.env.example apps/web/.env
```

5. Start the dev server:

```sh
yarn dev
```
