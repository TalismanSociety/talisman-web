import { BN } from '@polkadot/util'
import { useQueryMultiState, useQueryState } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import { hoursToMilliseconds } from 'date-fns'
import { range } from 'lodash'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { useChainState } from '@/domains/chains/hooks'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { expectedEraTime } from '@/domains/common/utils/substratePolyfills'

export const useApr = () => {
  const chain = useRecoilValue(useChainState())

  const [api, activeEra] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useQueryState('staking', 'activeEra', [])])
  )

  const erasPerDay = useMemo(() => hoursToMilliseconds(24) / expectedEraTime(api), [api])

  const numberOfErasToCheck = useMemo(() => {
    const maxSupportedDays = Math.round(api.consts.staking.historyDepth.toNumber() / erasPerDay)
    const daysToCheck = maxSupportedDays >= 30 ? 30 : 15
    return Math.round(hoursToMilliseconds(daysToCheck * 24) / expectedEraTime(api))
  }, [api, erasPerDay])

  const erasToCheck = useMemo(
    () =>
      range(
        Math.max(
          activeEra.unwrapOrDefault().index.subn(numberOfErasToCheck).toNumber(),
          Math.max(0, activeEra.unwrapOrDefault().index.sub(api.consts.staking.historyDepth).toNumber())
        ),
        activeEra.unwrapOrDefault().index.toNumber()
      ),
    [activeEra, api.consts.staking.historyDepth, numberOfErasToCheck]
  )

  const lastEra = useMemo(() => {
    if (activeEra.isNone) return new BN(0)
    const index = activeEra.unwrapOrDefault().index
    if (index.eq(0)) return new BN(0)
    return index.subn(1)
  }, [activeEra])

  const [rewards, [lastEraTotalStaked, totalIssuance]] = useRecoilValue(
    waitForAll([
      useQueryState('staking', 'erasValidatorReward.multi', erasToCheck),
      useQueryMultiState([['staking.erasTotalStake', lastEra], ['balances.totalIssuance']]),
    ])
  )

  return useMemo(() => {
    if (chain.id === 'analog-timechain') return 0.55

    const averageValidatorReward = rewards
      .reduce((prev, curr) => prev.plus(curr.unwrapOrDefault().toString()), new BigNumber(0))
      .dividedBy(rewards.length)

    const supplyStaked =
      lastEraTotalStaked.isZero() || totalIssuance.isZero()
        ? 0
        : new BigNumber(lastEraTotalStaked.toString()).div(totalIssuance.toString())

    const averageRewardPerDay = averageValidatorReward.multipliedBy(erasPerDay)

    const dayRewardRate = averageRewardPerDay.dividedBy(new BigNumber(totalIssuance.toString()))

    const inflationToStakers = dayRewardRate.multipliedBy(365)

    return inflationToStakers.dividedBy(supplyStaked).toNumber() || 0
  }, [chain.id, erasPerDay, lastEraTotalStaked, rewards, totalIssuance])
}

export const useApy = (compoundingPeriodCount: number = 365) => {
  const apr = useApr()
  return Math.pow(1 + apr / compoundingPeriodCount, compoundingPeriodCount) - 1
}
