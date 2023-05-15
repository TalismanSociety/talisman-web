import { chains } from '@domains/chains'
import { type ChainId } from '@polkawallet/bridge'
import { AcalaAdapter, KaruraAdapter } from '@polkawallet/bridge/adapters/acala'
import { AstarAdapter, ShidenAdapter } from '@polkawallet/bridge/adapters/astar'
import { BifrostAdapter } from '@polkawallet/bridge/adapters/bifrost'
import { AltairAdapter } from '@polkawallet/bridge/adapters/centrifuge'
import { ShadowAdapter } from '@polkawallet/bridge/adapters/crust'
import { CrabAdapter } from '@polkawallet/bridge/adapters/darwinia'
import { BasiliskAdapter, HydraAdapter } from '@polkawallet/bridge/adapters/hydradx'
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
import { StatemineAdapter } from '@polkawallet/bridge/adapters/statemint'
import { QuartzAdapter, UniqueAdapter } from '@polkawallet/bridge/adapters/unique'
import { type BaseCrossChainAdapter } from '@polkawallet/bridge/base-chain-adapter'

export const bridgeConfig = {
  polkadot: { adapter: new PolkadotAdapter(), rpc: chains[0].rpc, subscanUrl: 'https://polkadot.subscan.io/' },
  kusama: { adapter: new KusamaAdapter(), rpc: chains[1].rpc, subscanUrl: 'https://kusama.subscan.io/' },
  acala: { adapter: new AcalaAdapter(), subscanUrl: 'https://acala.subscan.io/' },
  karura: { adapter: new KaruraAdapter(), subscanUrl: 'https://karura.subscan.io/' },
  altair: { adapter: new AltairAdapter(), subscanUrl: 'https://altair.subscan.io/' },
  astar: { adapter: new AstarAdapter(), subscanUrl: 'https://astar.subscan.io/' },
  basilisk: { adapter: new BasiliskAdapter(), subscanUrl: 'https://basilisk.subscan.io/' },
  bifrost: { adapter: new BifrostAdapter(), subscanUrl: 'https://bifrost.subscan.io/' },
  calamari: {
    adapter: new CalamariAdapter(),
    rpc: 'wss://calamari.systems',
    subscanUrl: 'https://calamari.subscan.io/',
  },
  crab: { adapter: new CrabAdapter(), subscanUrl: 'https://crab.subscan.io/' },
  heiko: { adapter: new HeikoAdapter(), subscanUrl: 'https://parallel-heiko.subscan.io/' },
  hydradx: { adapter: new HydraAdapter(), subscanUrl: 'https://hydradx.subscan.io/' },
  integritee: { adapter: new IntegriteeAdapter(), subscanUrl: 'https://integritee.subscan.io/' },
  interlay: { adapter: new InterlayAdapter(), subscanUrl: 'https://interlay.subscan.io/' },
  khala: { adapter: new KhalaAdapter(), subscanUrl: 'https://khala.subscan.io/' },
  kintsugi: { adapter: new KintsugiAdapter(), subscanUrl: 'https://kintsugi.subscan.io/' },
  kico: { adapter: new KicoAdapter() },
  listen: { adapter: new ListenAdapter() },
  moonbeam: { adapter: new MoonbeamAdapter(), subscanUrl: 'https://moonbeam.subscan.io/' },
  moonriver: { adapter: new MoonriverAdapter(), subscanUrl: 'https://moonriver.subscan.io/' },
  parallel: { adapter: new ParallelAdapter(), subscanUrl: 'https://parallel.subscan.io/' },
  pichiu: { adapter: new PichiuAdapter() },
  quartz: { adapter: new QuartzAdapter(), subscanUrl: 'https://quartz.subscan.io/' },
  shadow: { adapter: new ShadowAdapter(), subscanUrl: 'https://shadow.subscan.io/' },
  shiden: { adapter: new ShidenAdapter(), subscanUrl: 'https://shiden.subscan.io/' },
  statemine: { adapter: new StatemineAdapter(), subscanUrl: 'https://statemine.subscan.io/' },
  statemint: undefined,
  turing: { adapter: new TuringAdapter(), subscanUrl: 'https://turing.subscan.io/' },
  unique: { adapter: new UniqueAdapter(), subscanUrl: 'https://unique.subscan.io/' },
} as const satisfies Record<
  ChainId,
  { adapter: BaseCrossChainAdapter; rpc?: string | undefined; subscanUrl?: string | undefined } | undefined
>

export const bridgeNodeList = Object.fromEntries(
  Object.entries(bridgeConfig).map(([key, value]) => [
    key,
    value !== undefined && 'rpc' in value ? [value.rpc] : undefined,
  ])
)
