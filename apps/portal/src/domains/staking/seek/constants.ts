export const DECIMALS = 18
export const SEEK_SINGLE_POOL_STAKING_ADDRESS = '0xaddc8f61a5509655c31ed9c1dcb66a2b905841be' as const
export const SEEK_TOKEN_ADDRESS = '0x2a69b0383759572081c09f0a68d3a8a955751dde' as const
export const SEEK_TICKER = 'SEEK'
export const CHAIN_ID = 137 // Polygon
export const CHAIN_NAME = 'Polygon'
export const SEEK_COIN_GECKO_ID = 'usd-coin'
export const SEEK_TOKEN_ID = '137:evm-erc20:0x2a69b0383759572081c09f0a68d3a8a955751dde' // USDT on Mainnet

export const DISCOUNT_TIERS = [
  { tier: 0, min: 0n, discount: 0 },
  { tier: 1, min: 200n * 10n ** 18n, discount: 0.05 },
  { tier: 2, min: 1_000n * 10n ** 18n, discount: 0.15 },
] as const
