export const DECIMALS = 18
export const SEEK_SINGLE_POOL_STAKING_ADDRESS = '0x52b8969F9C1d1EFFd4f0ABeA2104dF02B65c165C' as const
export const SEEK_TOKEN_ADDRESS = '0x07C3E739C65f81Ea79d19A88d27de4C9f15f8Df0' as const
export const SEEK_TICKER = 'SEEK'
export const CHAIN_ID = 1 // Eth mainnet
export const CHAIN_NAME = 'Ethereum'
export const SEEK_COIN_GECKO_ID = 'usd-coin' // USDT on Mainnet
export const SEEK_TOKEN_ID = '1:evm-erc20:0x07C3E739C65f81Ea79d19A88d27de4C9f15f8Df0'

export const DISCOUNT_TIERS = [
  { tier: 0, min: 0n, discount: 0 },
  { tier: 1, min: 200n * 10n ** 18n, discount: 0.05 },
  { tier: 2, min: 1_000n * 10n ** 18n, discount: 0.15 },
] as const
