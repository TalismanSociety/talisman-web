import type { DeriveCustom } from '@polkadot/api/types'
import * as crowdloanAtBlock from './crowdloanAtBlock'

export const customDerives: DeriveCustom = {
  crowdloanAtBlock: crowdloanAtBlock as unknown as DeriveCustom[string],
}

// Add our custom derives to the types for `api`
declare module '@polkadot/api-derive/derive' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface ExactDerive {
    crowdloanAtBlock: {
      childKey: ReturnType<(typeof crowdloanAtBlock)['childKey']>
      contributions: ReturnType<(typeof crowdloanAtBlock)['contributions']>
      ownContributions: ReturnType<(typeof crowdloanAtBlock)['ownContributions']>
    }
  }
}
