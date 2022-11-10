import { EVMChain } from '@libs/@talisman-nft/types'

export const EVMChains: { [key: string]: EVMChain } = {
  moonriver: {
    contracts: {
      damnedPiratesSociety: {
        address: '0xB6E9e605AA159017173CAa6181C522Db455F6661',
        name: 'Damned Pirates Society',
        symbol: 'DPS',
      },
      neonCrisis: {
        address: '0x2d4A19B306A496be628469de820F0367A13178e5',
        name: 'Neon Crisis V2',
        symbol: 'NEON',
      },
      zoombies: {
        address: '0x08716e418e68564C96b68192E985762740728018',
        name: 'Zoombies',
        symbol: 'ZMB',
      },
      moonriverNFTQuest: {
        address: '0x79c8C73F85ec794f570aa7B768568a7fEdB294f8',
        name: 'Moonriver NFT Quest',
        symbol: 'MNQ',
      },
      zombieStories: {
        address: '0x29a9E4AfE66f2Ceb453F3e5ebe4f09287CF3c793',
        name: 'Zombie Stories: Project Infecticide',
        symbol: 'ZSPIF',
      },
    },
    name: 'Moonriver',
    chainId: 1285,
    tokenCurrency: 'MOVR',
    rpc: [
      'https://moonriver.api.onfinality.io/public',
      'https://moonriver-rpc.dwellir.com',
      'https://moonriver.public.blastapi.io',
    ],
    platformUri: 'https://moonriver.moonscan.io/address/',
    other: {},
  },
  moonbeam: {
    contracts: {
      exiledRacerPilots: {
        address: '0x515e20e6275ceefe19221fc53e77e38cc32b80fb',
        name: 'Exiled Racer Pilots',
        symbol: 'ERP',
      },
      exiledRacers: {
        address: '0x104b904e19fBDa76bb864731A2C9E01E6b41f855',
        name: 'Exiled Racers',
        symbol: 'EXR',
      },
      canaryNetworkAgency: {
        address: '0x139e9BA28D64da245ddB4cF9943aA34f6d5aBFc5',
        name: 'Canary Network Agency',
        symbol: 'CNA',
      },
      moonFitMintPass: {
        address: '0x6758053c0b27E478edE1E4882adFF708Fc4FA72D',
        name: 'MoonFit Mint Pass',
        symbol: 'MFP',
      },
      moonfitBeastAndBeauty: {
        address: '0x02a6dec99b2ca768d638fcd87a96f6069f91287c',
        name: 'MoonFit Beast and Beauty',
        symbol: 'MBB',
      },
      moonMonkeys: {
        address: '0xCc1A7573C8f10d0df7Ee4d57cc958C8Df4a5Aca9',
        name: 'Moon Monkeys',
        symbol: 'MM',
      },
      moonDaoNFT: {
        address: '0xc6342EAB8B7cC405Fc35ebA7F7401fc400aC0709',
        name: 'Moon DAO NFT',
        symbol: 'MDN',
      },
      glimmerApes: {
        address: '0x8fbe243d898e7c88a6724bb9eb13d746614d23d6',
        name: 'Glimmer Apes',
        symbol: 'GA',
      },
      glimmerJungle: {
        address: '0xcB13945Ca8104f813992e4315F8fFeFE64ac49cA',
        name: 'Glimmer Jungle',
        symbol: 'GJ',
      },
      moonbeamPunks: {
        address: '0xFD86D63748a6390E4a80739e776463088811774D',
        name: 'Moonbeam Punks',
        symbol: 'MBP',
      },
      glmrPunks: {
        address: '0x25714FcBc4bE731B95AE86483EF97ef6C3deB5Ce',
        name: 'GLMR Punks',
        symbol: 'GP',
      },
      moonbeamZuki: {
        address: '0xC36D971c11CEbbCc20eE2C2910e07e2b1Be3790d',
        name: 'Moonbeam Zuki',
        symbol: 'MZ',
      },
      glimmerKongsClub: {
        address: '0x62E413D4b097b474999CF33d336cD74881084ba5',
        name: 'Glimmer Kongs Club',
        symbol: 'GKC',
      },
      moonbeamNameService: {
        address: '0x9576167Eb03141F041ccAf57D4D0bd40Abb2b583',
        name: 'Moonbeam Name Service (.moon)',
        symbol: 'MNS',
      },
      athosNFT: {
        address: '0xcf82ddcca84d0e419bccd7a540e807c114250ded',
        name: 'Athos NFT',
        symbol: 'ANFT',
      },
      moonPets: {
        address: '0x2159762693C629C5A44Fc9baFD484f8B96713467',
        name: 'Moon Pets',
        symbol: 'MP',
      },
      moonbeamBAYC: {
        address: '0x15380599b39a020378146c0714d628f14731f0a6',
        name: 'Moonbeam BAYC',
        symbol: 'BAYC',
      },
    },
    name: 'Moonbeam',
    chainId: 1284,
    tokenCurrency: 'GLMR',
    rpc: ['https://moonbeam.api.onfinality.io/public'],
    platformUri: 'https://moonbeam.moonscan.io/address/',
    other: {},
  },
  polygon: {
    contracts: {
      snookNFT: {
        address: '0x4372597f1c600D86598675DCB6cF5713bB7525Cf',
        name: 'Snook NFT',
        symbol: 'SNK',
      },
    },
    name: 'Polygon',
    chainId: 137,
    tokenCurrency: 'ETH',
    rpc: ['https://polygon-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    platformUri: 'https://polygonscan.com/address/',
    other: {},
  },
  astar: {
    contracts: {
      astarGhost: {
        address: '0xb4bd85893d6f66869d7766ace1b1eb4d867d963e',
        name: 'Astar Ghost',
        symbol: 'GHOST',
      },
      astarPunks: {
        address: '0x1b57C69838cDbC59c8236DDa73287a4780B4831F',
        name: 'Astar Punks',
        symbol: 'APUNK',
      },
      astarDegends: {
        address: '0xd59fc6bfd9732ab19b03664a45dc29b8421bda9a',
        name: 'Astar Degends',
        symbol: 'ADEG',
      },
      astarnaut: {
        address: '0xf008371a7EeD0AB54FDd975fE0d0f66fEFBA3415',
        name: 'AstarNaut',
        symbol: 'ASTARNAUT',
      },
      astarcats: {
        address: '0x8b5d62f396Ca3C6cF19803234685e693733f9779',
        name: 'AstarCats',
        symbol: 'ASTARCATS',
      },
      astarSignWitch: {
        address: '0x7b2152E51130439374672AF463b735a59a47ea85',
        name: 'Astar Sign Witch',
        symbol: 'ASW',
      },
    },
    name: 'Astar',
    chainId: 592,
    tokenCurrency: 'ASTR',
    rpc: ['https://astar.api.onfinality.io/public', 'https://astar-rpc.dwellir.com'],
    platformUri: 'https://blockscout.com/astar/token/',
    other: {},
  },
}
