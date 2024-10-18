import { chainQueryState, chainQueryMultiState } from '@/domains/common'
import { substrateApiState, expectedEraTime } from '@/domains/common'
import { BN } from '@polkadot/util'
import BigNumber from 'bignumber.js'
import { hoursToMilliseconds } from 'date-fns'
import { range } from 'lodash'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll, RecoilValue } from 'recoil'

const useAprs = ({ rpcIds }: { rpcIds: string[] }) => {
  const activeEras = useRecoilValue(waitForAll(rpcIds.map(apiId => chainQueryState(apiId, 'staking', 'activeEra', []))))
  const apis = useRecoilValue(waitForAll(rpcIds.map(apiId => substrateApiState(apiId))))
  const erasPerDay = useMemo(() => apis.map(api => hoursToMilliseconds(24) / expectedEraTime(api)), [apis])

  const numberOfErasToCheck = useMemo(() => {
    return apis.map((api, index) => {
      const maxSupportedDays = Math.round(api.consts.staking.historyDepth.toNumber() / (erasPerDay[index] ?? 0))
      const daysToCheck = maxSupportedDays >= 30 ? 30 : 15
      return Math.round(hoursToMilliseconds(daysToCheck * 24) / expectedEraTime(api))
    })
  }, [apis, erasPerDay])

  const erasToCheck = useMemo(() => {
    return activeEras.map((activeEra, index) =>
      range(
        Math.max(
          activeEra
            .unwrapOrDefault()
            .index.subn(numberOfErasToCheck[index] ?? 0)
            .toNumber(),
          Math.max(
            0,
            activeEra
              .unwrapOrDefault()
              .index.sub(apis[index]?.consts.staking.historyDepth ?? new BN(0))
              .toNumber()
          )
        ),
        activeEra.unwrapOrDefault().index.toNumber()
      )
    )
  }, [activeEras, apis, numberOfErasToCheck])

  const rewards = useRecoilValue(
    waitForAll(
      rpcIds.map((apiId, index) =>
        chainQueryState(apiId, 'staking', 'erasValidatorReward.multi', erasToCheck[index] ?? [])
      )
    )
  )

  const lastEraTotalStakedTotalIssuance = useRecoilValue<[BN, BN][]>(
    waitForAll(
      activeEras.flatMap((activeEra, index) =>
        chainQueryMultiState(rpcIds[index], [
          ['staking.erasTotalStake', activeEra.unwrapOrDefault().index.subn(1) ?? []],
          ['balances.totalIssuance'],
        ])
      )
    ) as RecoilValue<[BN, BN][]> // Explicitly cast the Recoil value
  )

  const aprs = useMemo(() => {
    return rewards.map((reward, index) => {
      const averageValidatorReward = reward
        .reduce((prev, curr) => prev.plus(curr.unwrapOrDefault().toString()), new BigNumber(0))
        .dividedBy(reward.length)

      const [lastEraTotalStaked, totalIssuance] = lastEraTotalStakedTotalIssuance[index] ?? [new BN(0), new BN(0)]

      const supplyStaked =
        lastEraTotalStaked.isZero() || totalIssuance.isZero()
          ? 0
          : new BigNumber(lastEraTotalStaked.toString()).div(totalIssuance.toString())

      const averageRewardPerDay = averageValidatorReward.multipliedBy(erasPerDay[index] ?? 0)

      const dayRewardRate = averageRewardPerDay.dividedBy(new BigNumber(totalIssuance.toString()))

      const inflationToStakers = dayRewardRate.multipliedBy(365)

      return inflationToStakers.dividedBy(supplyStaked).toNumber()
    })
  }, [erasPerDay, lastEraTotalStakedTotalIssuance, rewards])

  return aprs
}

export default useAprs
