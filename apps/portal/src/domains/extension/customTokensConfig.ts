import { CustomTokensConfig } from '../../hooks/useSetCustomTokens'

export const customTokensConfig: CustomTokensConfig = [
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
]
