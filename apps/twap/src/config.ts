import type { Asset, Chain } from '@chainflip/sdk/swap'

export const assetIcons = {
  BTC: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg',
  DOT: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/dot.svg',
  ETH: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/eth.svg',
  FLIP: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg',
  USDC: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/coingecko/usd-coin.webp',
  USDT: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/usdt.svg',
} satisfies Record<Asset, string>

export const assetCoingeckoIds = {
  BTC: 'bitcoin',
  DOT: 'polkadot',
  ETH: 'ethereum',
  FLIP: 'chainflip',
  USDC: 'usd-coin',
  USDT: 'tether',
} satisfies Record<Asset, string>

export const chainIcons = {
  Arbitrum: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/chains/42161.svg',
  Bitcoin: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/chains/unknown.svg',
  Ethereum: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/chains/1.svg',
  Polkadot: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/chains/polkadot.svg',
} satisfies Record<Chain, string>
