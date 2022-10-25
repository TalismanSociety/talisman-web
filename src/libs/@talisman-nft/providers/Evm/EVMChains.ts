import { EVMChain } from '@libs/@talisman-nft/types'

export const EVMChains: { [key: string]: EVMChain } = {
  moonriver: {
    contracts: {
      damnedpiratessociety: {
        address: '0xB6E9e605AA159017173CAa6181C522Db455F6661',
        name: 'Damned Pirates Society',
        symbol: 'DPS',
        totalSupply: 3000,
      },
      neoncrisis: {
        address: '0x2d4A19B306A496be628469de820F0367A13178e5',
        name: 'Neon Crisis V2',
        symbol: 'NEON',
        totalSupply: 6008,
      },
    },
    name: 'moonriver',
    rpc: [
      'https://moonriver.api.onfinality.io/public',
      'https://moonriver.public.blastapi.io',
      'https://moonriver-rpc.dwellir.com',
    ],
    other: {},
  },
}
