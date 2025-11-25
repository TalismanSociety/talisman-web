import type { ApiPromise } from '@polkadot/api'
import type { Option } from '@polkadot/types'
import type { ActiveEraInfo } from '@polkadot/types/interfaces'
import type { ChainId } from '@talismn/chaindata-provider'
import { useQueryState } from '@talismn/react-polkadot-api'
import { range } from 'lodash'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { calculateStakingApr } from '../utils/helpers'
import { useBabeApi } from './useBabeApi'

const MAX_ERAS_TO_CHECK = 15

export const useKusamaApr = ({
  activeEra,
  stakingApi,
  chainId,
}: {
  activeEra: Option<ActiveEraInfo>
  stakingApi: ApiPromise
  chainId: ChainId
}) => {
  const babeApi = useBabeApi(chainId)

  const currentEra = activeEra.unwrapOrDefault().index.toNumber()
  const historyDepth = stakingApi.consts.staking.historyDepth.toNumber()
  const maxErasToCheck = Math.min(MAX_ERAS_TO_CHECK, historyDepth)

  const eras = range(currentEra - maxErasToCheck, currentEra - 1).filter(era => era >= 0)

  const [rewardsKsm, eraTotalStakes] = useRecoilValue(
    waitForAll([
      useQueryState('staking', 'erasValidatorReward.multi', eras),
      useQueryState('staking', 'erasTotalStake.multi', eras),
    ])
  )

  const apr = useMemo(() => {
    if (!babeApi) return 0

    const eraRewards = rewardsKsm.map(reward => reward.unwrapOrDefault().toBigInt())
    const eraStakes = eraTotalStakes.map(stake => stake.toBigInt())

    return calculateStakingApr(eraRewards, eraStakes, babeApi)
  }, [babeApi, rewardsKsm, eraTotalStakes])

  return apr
}
