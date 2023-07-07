import { chains } from '@domains/chains'
import { type ChainId } from '@polkawallet/bridge'
import { AcalaAdapter, KaruraAdapter } from '@polkawallet/bridge/adapters/acala'
import { AstarAdapter, ShidenAdapter } from '@polkawallet/bridge/adapters/astar'
import { BifrostAdapter } from '@polkawallet/bridge/adapters/bifrost'
import { AltairAdapter, CentrifugeAdapter } from '@polkawallet/bridge/adapters/centrifuge'
import { ShadowAdapter } from '@polkawallet/bridge/adapters/crust'
import { CrabAdapter } from '@polkawallet/bridge/adapters/darwinia'
import { BasiliskAdapter, HydraDxAdapter } from '@polkawallet/bridge/adapters/hydradx'
import { IntegriteeAdapter } from '@polkawallet/bridge/adapters/integritee'
import { InterlayAdapter, KintsugiAdapter } from '@polkawallet/bridge/adapters/interlay'
import { KicoAdapter } from '@polkawallet/bridge/adapters/kico'
import { PichiuAdapter } from '@polkawallet/bridge/adapters/kylin'
import { ListenAdapter } from '@polkawallet/bridge/adapters/listen'
import { CalamariAdapter } from '@polkawallet/bridge/adapters/manta'
import { MoonbeamAdapter, MoonriverAdapter } from '@polkawallet/bridge/adapters/moonbeam'
import { TuringAdapter } from '@polkawallet/bridge/adapters/oak'
import { HeikoAdapter, ParallelAdapter } from '@polkawallet/bridge/adapters/parallel'
import { KhalaAdapter } from '@polkawallet/bridge/adapters/phala'
import { KusamaAdapter, PolkadotAdapter } from '@polkawallet/bridge/adapters/polkadot'
import { RobonomicsAdapter } from '@polkawallet/bridge/adapters/robonomics'
import { StatemineAdapter, StatemintAdapter } from '@polkawallet/bridge/adapters/statemint'
import { TinkernetAdapter } from '@polkawallet/bridge/adapters/tinkernet'
import { QuartzAdapter, UniqueAdapter } from '@polkawallet/bridge/adapters/unique'
import { ZeitgeistAdapter } from '@polkawallet/bridge/adapters/zeitgeist'
import { type BaseCrossChainAdapter } from '@polkawallet/bridge/base-chain-adapter'

export const bridgeConfig = {
  polkadot: {
    adapter: new PolkadotAdapter(),
    rpc: chains[0].rpc,
    subscanUrl: 'https://polkadot.subscan.io/',
  },
  kusama: {
    adapter: new KusamaAdapter(),
    rpc: chains[1].rpc,
    subscanUrl: 'https://kusama.subscan.io/',
  },
  acala: {
    adapter: new AcalaAdapter(),
    rpc: 'wss://acala-rpc.dwellir.com',
    subscanUrl: 'https://acala.subscan.io/',
  },
  karura: {
    adapter: new KaruraAdapter(),
    rpc: 'wss://karura-rpc.dwellir.com',
    subscanUrl: 'https://karura.subscan.io/',
  },
  altair: {
    adapter: new AltairAdapter(),
    rpc: 'wss://fullnode.altair.centrifuge.io',
    subscanUrl: 'https://altair.subscan.io/',
  },
  astar: {
    adapter: new AstarAdapter(),
    rpc: 'wss://rpc.astar.network',
    subscanUrl: 'https://astar.subscan.io/',
  },
  basilisk: {
    adapter: new BasiliskAdapter(),
    rpc: 'wss://rpc-01.basilisk.hydradx.io',
    subscanUrl: 'https://basilisk.subscan.io/',
  },
  bifrost: {
    adapter: new BifrostAdapter(),
    rpc: 'wss://bifrost-parachain.api.onfinality.io/public-ws',
    subscanUrl: 'https://bifrost.subscan.io/',
  },
  calamari: {
    adapter: new CalamariAdapter(),
    rpc: 'wss://calamari.systems',
    subscanUrl: 'https://calamari.subscan.io/',
  },
  centrifuge: {
    adapter: new CentrifugeAdapter(),
    rpc: 'wss://fullnode.centrifuge.io',
    subscanUrl: 'https://centrifuge.subscan.io/',
  },
  crab: {
    adapter: new CrabAdapter(),
    rpc: 'wss://crab-rpc.darwinia.network',
    subscanUrl: 'https://crab.subscan.io/',
  },
  heiko: {
    adapter: new HeikoAdapter(),
    rpc: 'wss://heiko-rpc.parallel.fi',
    subscanUrl: 'https://parallel-heiko.subscan.io/',
  },
  hydradx: {
    adapter: new HydraDxAdapter(),
    rpc: 'wss://rpc.hydradx.cloud',
    subscanUrl: 'https://hydradx.subscan.io/',
  },
  integritee: {
    adapter: new IntegriteeAdapter(),
    rpc: 'wss://kusama.api.integritee.network',
    subscanUrl: 'https://integritee.subscan.io/',
  },
  interlay: {
    adapter: new InterlayAdapter(),
    rpc: 'wss://api.interlay.io/parachain',
    subscanUrl: 'https://interlay.subscan.io/',
  },
  khala: {
    adapter: new KhalaAdapter(),
    rpc: 'wss://khala-api.phala.network/ws',
    subscanUrl: 'https://khala.subscan.io/',
  },
  kintsugi: {
    adapter: new KintsugiAdapter(),
    rpc: 'wss://api-kusama.interlay.io/parachain',
    subscanUrl: 'https://kintsugi.subscan.io/',
  },
  kico: {
    adapter: new KicoAdapter(),
    rpc: 'wss://rpc.kico.dico.io',
  },
  listen: {
    adapter: new ListenAdapter(),
    rpc: 'wss://rpc.mainnet.listen.io',
  },
  moonbeam: {
    adapter: new MoonbeamAdapter(),
    rpc: 'wss://wss.api.moonbeam.network',
    subscanUrl: 'https://moonbeam.subscan.io/',
  },
  moonriver: {
    adapter: new MoonriverAdapter(),
    rpc: 'wss://wss.api.moonriver.moonbeam.network',
    subscanUrl: 'https://moonriver.subscan.io/',
  },
  parallel: {
    adapter: new ParallelAdapter(),
    rpc: 'wss://rpc.parallel.fi',
    subscanUrl: 'https://parallel.subscan.io/',
  },
  pichiu: {
    adapter: new PichiuAdapter(),
    rpc: 'wss://kusama.kylin-node.co.uk',
  },
  quartz: {
    adapter: new QuartzAdapter(),
    rpc: 'wss://ws-quartz.unique.network',
    subscanUrl: 'https://quartz.subscan.io/',
  },
  robonomics: {
    adapter: new RobonomicsAdapter(),
    rpc: 'wss://kusama.rpc.robonomics.network',
    subscanUrl: 'https://robonomics.subscan.io/',
  },
  shadow: {
    adapter: new ShadowAdapter(),
    rpc: 'wss://rpc-shadow.crust.network/',
    subscanUrl: 'https://shadow.subscan.io/',
  },
  shiden: {
    adapter: new ShidenAdapter(),
    rpc: 'wss://rpc.shiden.astar.network',
    subscanUrl: 'https://shiden.subscan.io/',
  },
  statemine: {
    adapter: new StatemineAdapter(),
    rpc: 'wss://statemine-rpc.polkadot.io',
    subscanUrl: 'https://statemine.subscan.io/',
  },
  statemint: {
    adapter: new StatemintAdapter(),
    rpc: 'wss://statemint-rpc.polkadot.io',
    subscanUrl: 'https://statemint.subscan.io/',
  },
  tinkernet: {
    adapter: new TinkernetAdapter(),
    rpc: 'wss://invarch-tinkernet.api.onfinality.io/public-ws',
    subscanUrl: undefined,
  },
  turing: {
    adapter: new TuringAdapter(),
    rpc: 'wss://rpc.turing.oak.tech',
    subscanUrl: 'https://turing.subscan.io/',
  },
  unique: {
    adapter: new UniqueAdapter(),
    rpc: 'wss://ws.unique.network',
    subscanUrl: 'https://unique.subscan.io/',
  },
  zeitgeist: {
    adapter: new ZeitgeistAdapter(),
    rpc: 'wss://main.rpc.zeitgeist.pm/ws',
    subscanUrl: 'https://zeitgeist.subscan.io/',
  },
} as const satisfies Record<
  ChainId,
  { adapter: BaseCrossChainAdapter; rpc: string; subscanUrl?: string | undefined } | undefined
>
