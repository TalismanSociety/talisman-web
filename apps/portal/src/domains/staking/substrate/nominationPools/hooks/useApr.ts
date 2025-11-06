import { BN } from '@polkadot/util'
import { useQueryMultiState, useQueryState } from '@talismn/react-polkadot-api'
import { useSuspenseQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { hoursToMilliseconds } from 'date-fns'
import { range } from 'lodash'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { useChainState } from '@/domains/chains/hooks'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { expectedEraTime } from '@/domains/common/utils/substratePolyfills'

import { useKusamaApr } from './useKusamaApr'

const KUSAMA_ASSET_HUB_CHAIN_ID = 'kusama-asset-hub'
const POLKADOT_ASSET_HUB_CHAIN_ID = 'polkadot-asset-hub'

export const useApr = () => {
  const chain = useRecoilValue(useChainState())
  const isAssetHub = chain.id === KUSAMA_ASSET_HUB_CHAIN_ID || chain.id === POLKADOT_ASSET_HUB_CHAIN_ID

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

  const kusamaApr = useKusamaApr({ activeEra, stakingApi: api, chainId: chain.id })

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

  const { data: analogApr } = useSuspenseQuery({
    queryKey: ['analog-timechain-apy', chain.id],
    queryFn: async () => {
      if (chain.id !== 'analog-timechain') return 0

      try {
        const analogExplorerApyUrl = 'https://explorer-api.analog.one/api/nominations?projection=apy'
        const result = await (await fetch(analogExplorerApyUrl)).json()
        if (result?.status !== 200) {
          console.warn('Failed to fetch analog apy (non-200 status)', result)
          return 0
        }

        const apy = result?.data?.apy
        if (typeof apy !== 'number') {
          console.warn('Failed to fetch analog apy (apy is not number)', result)
          return 0
        }

        return apy / 100
      } catch (cause) {
        console.warn('Failed to fetch analog apy (fetch error)', cause)
        return 0
      }
    },
  })

  return useMemo(() => {
    if (chain.id === 'analog-timechain') return analogApr
    if (isAssetHub) return kusamaApr

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
  }, [analogApr, chain.id, erasPerDay, isAssetHub, kusamaApr, lastEraTotalStaked, rewards, totalIssuance])
}
