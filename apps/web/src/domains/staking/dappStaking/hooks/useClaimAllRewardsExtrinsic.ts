import { useExtrinsic } from '@domains/common'
import type { ApiPromise } from '@polkadot/api'
import { useCallback } from 'react'
import type { Stake } from './useStake'

export const useClaimAllRewardsExtrinsic = (stake: Stake) =>
  useExtrinsic(
    useCallback(
      (api: ApiPromise) =>
        stake.bonusRewards.length <= 0
          ? api.tx.dappStaking.claimStakerRewards()
          : api.tx.utility.batchAll([
              api.tx.dappStaking.claimStakerRewards(),
              ...stake.bonusRewards.map(x => api.tx.dappStaking.claimBonusReward(x.dapp)),
            ]),
      [stake.bonusRewards]
    )
  )
