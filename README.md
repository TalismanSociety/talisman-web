# Signet

## How to start Signet locally

1. Clone the repo:

```sh
git clone https://github.com/TalismanSociety/talisman-web.git
```

2. Switch to `multisig` branch

```sh
git checkout multisig
```

3. Copy `.env.example` to `.env` and update the values inside:

```sh
cp .env.example .env
```

4. Start the docker instance:

```sh
docker compose up --build
```

## Configuring the Networks

In some cases, you may want to configure the networks allowed in your self hosted Signet. Signet allows customising the networks that appear on your frontend using the `REACT_APP_NETWORKS` environment variable.

Note: Use `NETWORKS` as your docker arg when running with docker.

There are 4 modes when using the `REACT_APP_NETWORKS` flag:

- Testnets only: Use `testnet` to show Westend and Rococo networks only
- Non testnets: Use `non-testnet` to show Polkadot, Kusama, Polkadot AssetHub and Kusama AssetHub
- Custom filter: Alternatively, you can also filter only the list of chains you want to display using their names, separated by comma with no space. For example: `polkadot,kusama`. For the list of chains supported, check `apps/multisig/src/domains/chains/supported-chains.ts#L3`
- Show everything: Omit the flag if you want to show every supported chains.
