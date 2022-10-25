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
      canaryNetworkAgency: {
        address: '0x139e9BA28D64da245ddB4cF9943aA34f6d5aBFc',
        name: 'Canary Network Agency',
        symbol: 'CNA',
        totalSupply: 1000,
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
}
