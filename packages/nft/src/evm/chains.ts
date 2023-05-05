import { type Chain } from 'viem'
import { moonbeam, moonriver, polygon } from 'viem/chains'

type NftChain = {
  chain: Chain
  erc721ContractAddress: Record<string, `0x${string}`>
}

export default [
  {
    chain: moonriver,
    erc721ContractAddress: {
      damnedPiratesSociety: '0xB6E9e605AA159017173CAa6181C522Db455F6661',
      neonCrisis: '0x2d4A19B306A496be628469de820F0367A13178e5',
      zoombies: '0x08716e418e68564C96b68192E985762740728018',
      moonriverNFTQuest: '0x79c8C73F85ec794f570aa7B768568a7fEdB294f8',
      zombieStories: '0x29a9E4AfE66f2Ceb453F3e5ebe4f09287CF3c793',
    },
  },
  {
    chain: moonbeam,
    erc721ContractAddress: {
      talismanghosts: '0xDF67E64DC198E5287a6a625a4733841bD147E584',
      exiledRacerPilots: '0x515e20e6275ceefe19221fc53e77e38cc32b80fb',
      exiledRacers: '0x104b904e19fBDa76bb864731A2C9E01E6b41f855',
      canaryNetworkAgency: '0x139e9BA28D64da245ddB4cF9943aA34f6d5aBFc5',
      crest: '0x8417F77904a86436223942a516f00F8aDF933B70',
      moonFitMintPass: '0x6758053c0b27E478edE1E4882adFF708Fc4FA72D',
      moonfitBeastAndBeauty: '0x02a6dec99b2ca768d638fcd87a96f6069f91287c',
      moonMonkeys: '0xCc1A7573C8f10d0df7Ee4d57cc958C8Df4a5Aca9',
      moonDaoNFT: '0xc6342EAB8B7cC405Fc35ebA7F7401fc400aC0709',
      glimmerApes: '0x8fbe243d898e7c88a6724bb9eb13d746614d23d6',
      glimmerJungle: '0xcB13945Ca8104f813992e4315F8fFeFE64ac49cA',
      moonbeamPunks: '0xFD86D63748a6390E4a80739e776463088811774D',
      glmrPunks: '0x25714FcBc4bE731B95AE86483EF97ef6C3deB5Ce',
      moonbeamZuki: '0xC36D971c11CEbbCc20eE2C2910e07e2b1Be3790d',
      glimmerKongsClub: '0x62E413D4b097b474999CF33d336cD74881084ba5',
      moonbeamNameService: '0x9576167Eb03141F041ccAf57D4D0bd40Abb2b583',
      athosNFT: '0xcf82ddcca84d0e419bccd7a540e807c114250ded',
      moonPets: '0x2159762693C629C5A44Fc9baFD484f8B96713467',
      moonbeamBAYC: '0x15380599b39a020378146c0714d628f14731f0a6',
    },
  },
  {
    chain: polygon,
    erc721ContractAddress: {
      snookNFT: '0x4372597f1c600D86598675DCB6cF5713bB7525Cf',
    },
  },
  {
    chain: {
      id: 592,
      name: 'Astar',
      network: 'astar',
      nativeCurrency: {
        decimals: 18,
        name: 'Astar',
        symbol: 'ASTR',
      },
      rpcUrls: {
        public: { http: ['https://astar.api.onfinality.io/public', 'https://astar-rpc.dwellir.com'] },
        default: { http: ['https://astar.api.onfinality.io/public', 'https://astar-rpc.dwellir.com'] },
      },
      blockExplorers: {
        blockscout: { name: 'BlockScout', url: 'https://blockscout.com/astar/' },
        default: { name: 'BlockScout', url: 'https://blockscout.com/astar/' },
      },
      contracts: {
        multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11', blockCreated: 761794 },
      },
    },
    erc721ContractAddress: {
      astarGhost: '0xb4bd85893d6f66869d7766ace1b1eb4d867d963e',
      astarPunks: '0x1b57C69838cDbC59c8236DDa73287a4780B4831F',
      astarDegends: '0xd59fc6bfd9732ab19b03664a45dc29b8421bda9a',
      astarnaut: '0xf008371a7EeD0AB54FDd975fE0d0f66fEFBA3415',
      astarcats: '0x8b5d62f396Ca3C6cF19803234685e693733f9779',
      astarSignWitch: '0x7b2152E51130439374672AF463b735a59a47ea85',
    },
  },
] as const satisfies readonly NftChain[]
