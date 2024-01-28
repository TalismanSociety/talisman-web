import { type StatemintAdapter } from '@polkawallet/bridge/adapters/statemint'
import { type ParallelAdapter } from '@polkawallet/bridge/adapters/parallel'
import { type CentrifugeAdapter } from '@polkawallet/bridge/adapters/centrifuge'

declare function createRouteConfigs(from: string, routes: any[]): any[] // TODO: Change to actual type

declare class ExtendedStatemintAdapter extends StatemintAdapter {
  constructor()
  addRouters(): void
  addTokens(): void
}

declare class ExtendedParallelAdapter extends ParallelAdapter {
  constructor()
  addRouters(): void
  addTokens(): void
}

declare class ExtendedCentrifugeAdapter extends CentrifugeAdapter {
  constructor()
  addRouters(): void
  addTokens(): void
}

export { ExtendedStatemintAdapter, ExtendedParallelAdapter, ExtendedCentrifugeAdapter }
