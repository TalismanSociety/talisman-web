// a list of additional tokens to enable swaps for, which might not be available from lifi by default
export const lifiTalismanTokens: string[] = [
  '1-evm-erc20-0x1fb35614aa19c80eb997adad5f71520e915003c0', // SEEK on Eth
  // '137-evm-erc20-0x2a69b0383759572081c09f0a68d3a8a955751dde', // DEEK on Polygon

  '1-evm-erc20-0x92f419fb7a750aed295b0ddf536276bf5a40124f', // TATSU on Eth
]

// these tokens are shown in the `🔥 Popular` section
export const curatedTokens: string[] = [
  'btc-native', // BTC on Bitcoin (destination only)
  'polkadot-substrate-native', // DOT on Polkadot
  'bittensor-substrate-native', // TAO on Bittensor
  'kusama-substrate-native', // KSM on Kusama
  '1-evm-native', // ETH on Eth
  '1-evm-erc20-0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC on Eth
  '1-evm-erc20-0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT on Eth
  '1-evm-erc20-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC on Eth
  '1-evm-erc20-0x77e06c9eccf2e797fd462a92b6d7642ef85b0a44', // WTAO on Eth
  '1-evm-erc20-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH on Eth
  '8453-evm-native', // ETH on Base
  '8453-evm-erc20-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USDC on Base
  '10-evm-native', // ETH on OP
  '42161-evm-native', // ETH on Arb
  '42161-evm-erc20-0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f', // WBTC on Arb
  '42161-evm-erc20-0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // USDT on Arb
  '42161-evm-erc20-0xaf88d065e77c8cc2239327c5edb3a432268e5831', // USDC on Arb
  '143-evm-native', // MON on Monad
  '1284-evm-native', // GLMR on Moonbeam
  'moonbeam-substrate-native', // GLMR on Moonbeam
  'polkadot-asset-hub-substrate-assets-1984-usdt', // USDT on AssetHub
  'polkadot-asset-hub-substrate-assets-1337-usdc', // USDC on AssetHub

  '1-evm-erc20-0x1fb35614aa19c80eb997adad5f71520e915003c0', // SEEK on Eth
  // '137-evm-erc20-0x2a69b0383759572081c09f0a68d3a8a955751dde', // DEEK on Polygon
]

// these tokens are always shown at the top of the `All tokens` and `🔥 Popular` sections
export const promotedBuyTokens: string[] = [
  '1-evm-erc20-0x1fb35614aa19c80eb997adad5f71520e915003c0', // SEEK on Eth
  // '137-evm-erc20-0x2a69b0383759572081c09f0a68d3a8a955751dde', // DEEK on Polygon
]
export const promotedSellTokens: string[] = [
  '1-evm-erc20-0x1fb35614aa19c80eb997adad5f71520e915003c0', // SEEK on Eth
  // '137-evm-erc20-0x2a69b0383759572081c09f0a68d3a8a955751dde', // DEEK on Polygon
]
