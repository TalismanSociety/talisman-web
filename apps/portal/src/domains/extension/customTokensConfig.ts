import { CHAIN_ID, DEEK_TICKER, DEEK_TOKEN_ADDRESS } from '../staking/seek/constants'

export type CustomTokensConfig = CustomTokenConfig[]
export type CustomTokenConfig = {
  evmChainId: string
  contractAddress: string
  symbol: string
  decimals: number
  coingeckoId?: string
  logo?: string
}

export const customTokensConfig: CustomTokensConfig = [
  {
    coingeckoId: 'usd1-wlfi',
    contractAddress: '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d',
    decimals: 18,
    evmChainId: '1',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/coingecko/usd1-wlfi.webp',
    symbol: 'USD1',
  },
  {
    coingeckoId: 'usd1-wlfi',
    contractAddress: '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d',
    decimals: 18,
    evmChainId: '56',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/coingecko/usd1-wlfi.webp',
    symbol: 'USD1',
  },
  {
    coingeckoId: 'manta-network',
    contractAddress: '0x95CeF13441Be50d20cA4558CC0a27B601aC544E5',
    decimals: 18,
    evmChainId: '169',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/chains/manta.svg',
    symbol: 'MANTA',
  },
  {
    coingeckoId: 'bifrost-voucher-manta',
    contractAddress: '0x7746ef546d562b443AE4B4145541a3b1a3D75717',
    decimals: 18,
    evmChainId: '169',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/coingecko/bifrost-voucher-manta.webp',
    symbol: 'vMANTA',
  },
  {
    coingeckoId: '',
    contractAddress: DEEK_TOKEN_ADDRESS,
    decimals: 18,
    evmChainId: CHAIN_ID.toString(),
    logo: '',
    symbol: DEEK_TICKER,
  },
]
