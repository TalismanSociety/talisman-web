import { EVMChain } from '@libs/@talisman-nft/types'

export const EVMChains: { [key: string]: EVMChain } = {
  moonriver: {
    contracts: {
      damnedPiratesSociety: {
        address: '0xB6E9e605AA159017173CAa6181C522Db455F6661',
        name: 'Damned Pirates Society',
        symbol: 'DPS',
        totalSupply: 3000,
      },
      neonCrisis: {
        address: '0x2d4A19B306A496be628469de820F0367A13178e5',
        name: 'Neon Crisis V2',
        symbol: 'NEON',
        totalSupply: 6008,
      },
    },
    name: 'moonriver',
    rpc: [
      'https://moonriver-rpc.dwellir.com',
      'https://moonriver.api.onfinality.io/public',
      'https://moonriver.public.blastapi.io',
    ],
    other: {},
  },
  moonbeam: {
    contracts: {
      exiledRacers: {
        address: '0x104b904e19fBDa76bb864731A2C9E01E6b41f855',
        name: 'Exiled Racers',
        symbol: 'EXR',
        totalSupply: 1541,
      },
      canaryNetworkAgency: {
        address: '0x139e9BA28D64da245ddB4cF9943aA34f6d5aBFc5',
        name: 'Canary Network Agency',
        symbol: 'CNA',
        totalSupply: 5000,
      },
    },
    name: 'moonbeam',
    rpc: ['https://moonbeam.api.onfinality.io/public'],
    other: {},
  },
  polygon: {
    contracts: {
      snookNFT: {
        address: '0x4372597f1c600D86598675DCB6cF5713bB7525Cf',
        name: 'Snook NFT',
        symbol: 'SNK',
        totalSupply: 99999,
      },
    },
    name: 'polygon',
    rpc: ['https://polygon-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    other: {},
  },
}
