import { chainQueryState, chainQueryMultiState } from '@/domains/common'
import { substrateApiState, expectedEraTime } from '@/domains/common'
import { BN } from '@polkadot/util'
import BigNumber from 'bignumber.js'
import { hoursToMilliseconds } from 'date-fns'
import { range } from 'lodash'
import { useMemo } from 'react'
import { useRecoilValue, RecoilValue } from 'recoil'

const useApr = ({ rpcId }: { rpcId: string }) => {
  const activeEra = useRecoilValue(chainQueryState(rpcId, 'staking', 'activeEra', []))
  const api = useRecoilValue(substrateApiState(rpcId))
  const erasPerDay = hoursToMilliseconds(24) / expectedEraTime(api)

  const numberOfErasToCheck = useMemo(() => {
    const maxSupportedDays = Math.round(api.consts.staking.historyDepth.toNumber() / (erasPerDay ?? 0))
    const daysToCheck = maxSupportedDays >= 30 ? 30 : 15
    return Math.round(hoursToMilliseconds(daysToCheck * 24) / expectedEraTime(api))
  }, [api, erasPerDay])

  const erasToCheck = useMemo(() => {
    return range(
      Math.max(
        activeEra
          .unwrapOrDefault()
          .index.subn(numberOfErasToCheck ?? 0)
          .toNumber(),
        Math.max(
          0,
          activeEra
            .unwrapOrDefault()
            .index.sub(api?.consts.staking.historyDepth ?? new BN(0))
            .toNumber()
        )
      ),
      activeEra.unwrapOrDefault().index.toNumber()
    )
  }, [activeEra, api, numberOfErasToCheck])

  const rewards = useRecoilValue(chainQueryState(rpcId, 'staking', 'erasValidatorReward.multi', erasToCheck ?? []))

  const lastEraTotalStakedTotalIssuance = useRecoilValue(
    chainQueryMultiState(rpcId, [
      ['staking.erasTotalStake', activeEra.unwrapOrDefault().index.subn(1) ?? []],
      ['balances.totalIssuance'],
    ]) as RecoilValue<[BN, BN]>
  )

  const apr = useMemo(() => {
    const averageValidatorReward = rewards
      .reduce((prev, curr) => prev.plus(curr.unwrapOrDefault().toString()), new BigNumber(0))
      .dividedBy(rewards.length)

    const [lastEraTotalStaked, totalIssuance] = lastEraTotalStakedTotalIssuance ?? [new BN(0), new BN(0)]

    const supplyStaked =
      lastEraTotalStaked.isZero() || totalIssuance.isZero()
        ? 0
        : new BigNumber(lastEraTotalStaked.toString()).div(totalIssuance.toString())

    const averageRewardPerDay = averageValidatorReward.multipliedBy(erasPerDay ?? 0)

    const dayRewardRate = averageRewardPerDay.dividedBy(new BigNumber(totalIssuance.toString()))

    const inflationToStakers = dayRewardRate.multipliedBy(365)

    return inflationToStakers.dividedBy(supplyStaked).toNumber()
  }, [erasPerDay, lastEraTotalStakedTotalIssuance, rewards])

  return apr
}

export default useApr
