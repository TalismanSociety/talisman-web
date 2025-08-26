export const DECIMALS = 18
export const DEEK_SINGLE_POOL_STAKING_ADDRESS = '0xaddc8f61a5509655c31ed9c1dcb66a2b905841be' as const
export const DEEK_TOKEN_ADDRESS = '0x2a69b0383759572081c09f0a68d3a8a955751dde' as const
export const DEEK_TICKER = 'DEEK'
export const CHAIN_ID = 137 // Polygon

export const DISCOUNT_TIERS = [
  { tier: 0, min: 0n, discount: 0 },
  { tier: 1, min: 100n * 10n ** 18n, discount: 0.25 },
  { tier: 2, min: 1_000n * 10n ** 18n, discount: 0.5 },
  { tier: 3, min: 10_000n * 10n ** 18n, discount: 0.75 },
] as const
