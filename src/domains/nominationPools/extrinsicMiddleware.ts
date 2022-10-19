import { ExtrinsicMiddleware } from '@domains/common/extrinsicMiddleware'

import { allPendingPoolRewardsState } from './recoils'

export const nominationPoolsExtrinsicMiddleWare: ExtrinsicMiddleware = (module, section, result, { refresh }) => {
  switch (`${module}.${String(section)}`) {
    case 'nominationPools.claimPayout':
      if (result.isFinalized) {
        refresh(allPendingPoolRewardsState)
      }
      break
  }
}
