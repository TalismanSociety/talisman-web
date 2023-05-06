import { ApiProvider, Bridge } from '@polkawallet/bridge'
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
import { atom, selector } from 'recoil'

export const availableAdapters = {
  polkadot: new PolkadotAdapter(),
  kusama: new KusamaAdapter(),
  acala: new AcalaAdapter(),
  karura: new KaruraAdapter(),
  altair: new AltairAdapter(),
  astar: new AstarAdapter(),
  basilisk: new BasiliskAdapter(),
  bifrost: new BifrostAdapter(),
  calamari: new CalamariAdapter(),
  crab: new CrabAdapter(),
  heiko: new HeikoAdapter(),
  hydra: new HydraAdapter(),
  integritee: new IntegriteeAdapter(),
  interlay: new InterlayAdapter(),
  khala: new KhalaAdapter(),
  kintsugi: new KintsugiAdapter(),
  kico: new KicoAdapter(),
  listen: new ListenAdapter(),
  moonbeam: new MoonbeamAdapter(),
  moonriver: new MoonriverAdapter(),
  parallel: new ParallelAdapter(),
  pichiu: new PichiuAdapter(),
  quartz: new QuartzAdapter(),
  shadow: new ShadowAdapter(),
  shiden: new ShidenAdapter(),
  statemine: new StatemineAdapter(),
  turing: new TuringAdapter(),
  unique: new UniqueAdapter(),
} as const

export const bridgeApiProvider = new ApiProvider()

export const includeDisabledRoutesState = atom({
  key: 'IncludeDisabledRoutes',
  default: false,
})

export const bridgeState = selector({
  key: 'Bridge',
  get: async ({ get }) => {
    const bridge = new Bridge({
      adapters: Object.values(availableAdapters),
      disabledRouters: get(includeDisabledRoutesState)
        ? undefined
        : [
            // TODO: re-enable once we have custom recipient address, to target EVM addresses
            { to: 'moonbeam' },
            { to: 'moonriver' },
            // These has not passed testing
            { from: 'astar', to: 'acala', token: 'LDOT' },
            { from: 'parallel', to: 'acala', token: 'PARA' },
            { from: 'bifrost', to: 'karura', token: 'KAR' },
            { from: 'khala', to: 'karura', token: 'PHA' },
            { from: 'turing', to: 'karura', token: 'TUR' },
            { from: 'bifrost', to: 'karura', token: 'BNC' },
            { from: 'listen', to: 'karura', token: 'LKSM' },
            { from: 'calamari', to: 'karura', token: 'LKSM' },
            { from: 'acala', to: 'hydradx', token: 'DAI' },
            { from: 'karura', to: 'basilisk', token: 'DAI' },
          ],
    })
    await bridge.isReady
    return bridge
  },
  dangerouslyAllowMutability: true,
})
