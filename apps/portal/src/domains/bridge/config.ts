import {
  ExtendedCentrifugeAdapter,
  ExtendedParallelAdapter,
  ExtendedAssetHubPolkadotAdapter,
  ExtendedAstarAdapter,
} from './extendedRoutes'
import { type ChainId } from '@polkawallet/bridge'
import { AcalaAdapter, KaruraAdapter } from '@polkawallet/bridge/adapters/acala'
import { AssetHubKusamaAdapter } from '@polkawallet/bridge/adapters/assethub'
import { ShidenAdapter } from '@polkawallet/bridge/adapters/astar'
import { BifrostAdapter, BifrostPolkadotAdapter } from '@polkawallet/bridge/adapters/bifrost'
import { AltairAdapter } from '@polkawallet/bridge/adapters/centrifuge'
import { ShadowAdapter } from '@polkawallet/bridge/adapters/crust'
import { CrabAdapter } from '@polkawallet/bridge/adapters/darwinia'
import { BasiliskAdapter, HydraDxAdapter } from '@polkawallet/bridge/adapters/hydradx'
import { IntegriteeAdapter } from '@polkawallet/bridge/adapters/integritee'
import { InterlayAdapter, KintsugiAdapter } from '@polkawallet/bridge/adapters/interlay'
import { CalamariAdapter } from '@polkawallet/bridge/adapters/manta'
import { MoonbeamAdapter, MoonriverAdapter } from '@polkawallet/bridge/adapters/moonbeam'
import { TuringAdapter } from '@polkawallet/bridge/adapters/oak'
import { HeikoAdapter } from '@polkawallet/bridge/adapters/parallel'
import { KhalaAdapter } from '@polkawallet/bridge/adapters/phala'
import { KusamaAdapter, PolkadotAdapter } from '@polkawallet/bridge/adapters/polkadot'
import { RobonomicsAdapter } from '@polkawallet/bridge/adapters/robonomics'
import { SubsocialAdapter } from '@polkawallet/bridge/adapters/subsocial'
import { TinkernetAdapter } from '@polkawallet/bridge/adapters/tinkernet'
import { QuartzAdapter, UniqueAdapter } from '@polkawallet/bridge/adapters/unique'
import { ZeitgeistAdapter } from '@polkawallet/bridge/adapters/zeitgeist'
import { type BaseCrossChainAdapter } from '@polkawallet/bridge/base-chain-adapter'

export const bridgeConfig = {
  polkadot: {
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
    adapter: new PolkadotAdapter(),
  },
  kusama: {
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
    adapter: new KusamaAdapter(),
  },
  acala: {
    genesisHash: '0xfc41b9bd8ef8fe53d58c7ea67c794c7ec9a73daf05e6d54b14ff6342c99ba64c',
    adapter: new AcalaAdapter(),
  },
  karura: {
    genesisHash: '0xbaf5aabe40646d11f0ee8abbdc64f4a4b7674925cba08e4a05ff9ebed6e2126b',
    adapter: new KaruraAdapter(),
  },
  altair: {
    genesisHash: '0xaa3876c1dc8a1afcc2e9a685a49ff7704cfd36ad8c90bf2702b9d1b00cc40011',
    adapter: new AltairAdapter(),
  },
  astar: {
    genesisHash: '0x9eb76c5184c4ab8679d2d5d819fdf90b9c001403e9e17da2e14b6d8aec4029c6',
    adapter: new ExtendedAstarAdapter(),
  },
  basilisk: {
    genesisHash: '0xa85cfb9b9fd4d622a5b28289a02347af987d8f73fa3108450e2b4a11c1ce5755',
    adapter: new BasiliskAdapter(),
  },
  bifrost: {
    genesisHash: '0x9f28c6a68e0fc9646eff64935684f6eeeece527e37bbe1f213d22caa1d9d6bed',
    adapter: new BifrostAdapter(),
  },
  bifrostPolkadot: {
    genesisHash: '0x262e1b2ad728475fd6fe88e62d34c200abe6fd693931ddad144059b1eb884e5b',
    adapter: new BifrostPolkadotAdapter(),
  },
  calamari: {
    genesisHash: '0x4ac80c99289841dd946ef92765bf659a307d39189b3ce374a92b5f0415ee17a1',
    adapter: new CalamariAdapter(),
  },
  centrifuge: {
    genesisHash: '0xb3db41421702df9a7fcac62b53ffeac85f7853cc4e689e0b93aeb3db18c09d82',
    adapter: new ExtendedCentrifugeAdapter(),
  },
  crab: {
    genesisHash: '0x86e49c195aeae7c5c4a86ced251f1a28c67b3c35d8289c387ede1776cdd88b24',
    adapter: new CrabAdapter(),
  },
  heiko: {
    genesisHash: '0x64a1c658a48b2e70a7fb1ad4c39eea35022568c20fc44a6e2e3d0a57aee6053b',
    adapter: new HeikoAdapter(),
  },
  hydradx: {
    genesisHash: '0xafdc188f45c71dacbaa0b62e16a91f726c7b8699a9748cdf715459de6b7f366d',
    adapter: new HydraDxAdapter(),
  },
  integritee: {
    genesisHash: '0xcdedc8eadbfa209d3f207bba541e57c3c58a667b05a2e1d1e86353c9000758da',
    adapter: new IntegriteeAdapter(),
  },
  interlay: {
    genesisHash: '0xbf88efe70e9e0e916416e8bed61f2b45717f517d7f3523e33c7b001e5ffcbc72',
    adapter: new InterlayAdapter(),
  },
  khala: {
    genesisHash: '0xd43540ba6d3eb4897c28a77d48cb5b729fea37603cbbfc7a86a73b72adb3be8d',
    adapter: new KhalaAdapter(),
  },
  kintsugi: {
    genesisHash: '0x9af9a64e6e4da8e3073901c3ff0cc4c3aad9563786d89daf6ad820b6e14a0b8b',
    adapter: new KintsugiAdapter(),
  },
  kico: undefined,
  listen: undefined,
  moonbeam: {
    genesisHash: '0xfe58ea77779b7abda7da4ec526d14db9b1e9cd40a217c34892af80a9b332b76d',
    adapter: new MoonbeamAdapter(),
  },
  moonriver: {
    genesisHash: '0x401a1f9dca3da46f5c4091016c8a2f26dcea05865116b286f60f668207d1474b',
    adapter: new MoonriverAdapter(),
  },
  parallel: {
    genesisHash: '0xe61a41c53f5dcd0beb09df93b34402aada44cb05117b71059cce40a2723a4e97',
    adapter: new ExtendedParallelAdapter(),
  },
  pichiu: undefined,
  quartz: {
    genesisHash: '0xcd4d732201ebe5d6b014edda071c4203e16867305332301dc8d092044b28e554',
    adapter: new QuartzAdapter(),
  },
  robonomics: {
    genesisHash: '0x631ccc82a078481584041656af292834e1ae6daab61d2875b4dd0c14bb9b17bc',
    adapter: new RobonomicsAdapter(),
  },
  shadow: {
    genesisHash: '0xd4c0c08ca49dc7c680c3dac71a7c0703e5b222f4b6c03fe4c5219bb8f22c18dc',
    adapter: new ShadowAdapter(),
  },
  shiden: {
    genesisHash: '0xf1cf9022c7ebb34b162d5b5e34e705a5a740b2d0ecc1009fb89023e62a488108',
    adapter: new ShidenAdapter(),
  },
  assetHubKusama: {
    genesisHash: '0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a',
    adapter: new AssetHubKusamaAdapter(),
  },
  assetHubPolkadot: {
    genesisHash: '0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f',
    adapter: new ExtendedAssetHubPolkadotAdapter(),
  },
  tinkernet: {
    genesisHash: '0xd42e9606a995dfe433dc7955dc2a70f495f350f373daa200098ae84437816ad2',
    adapter: new TinkernetAdapter(),
  },
  turing: {
    genesisHash: '0x0f62b701fb12d02237a33b84818c11f621653d2b1614c777973babf4652b535d',
    adapter: new TuringAdapter(),
  },
  unique: {
    genesisHash: '0x84322d9cddbf35088f1e54e9a85c967a41a56a4f43445768125e61af166c7d31',
    adapter: new UniqueAdapter(),
  },
  zeitgeist: {
    genesisHash: '0x1bf2a2ecb4a868de66ea8610f2ce7c8c43706561b6476031315f6640fe38e060',
    adapter: new ZeitgeistAdapter(),
  },
  subsocial: {
    genesisHash: '0x4a12be580bb959937a1c7a61d5cf24428ed67fa571974b4007645d1886e7c89f',
    adapter: new SubsocialAdapter(),
  },
} as const satisfies Record<ChainId, { genesisHash: `0x${string}`; adapter: BaseCrossChainAdapter } | undefined>
