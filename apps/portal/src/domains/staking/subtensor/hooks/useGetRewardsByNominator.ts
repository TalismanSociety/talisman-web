import { useBalances } from '@talismn/balances-react'
import BigNumber from 'bignumber.js'
import { groupBy } from 'lodash'
import { useEffect, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { ROOT_NETUID, SCALE_FACTOR } from '@/components/widgets/staking/subtensor/constants'
import { selectedCurrencyState } from '@/domains/balances/currency'
import { useGetInfiniteDelegationEvents } from '@/domains/staking/subtensor/hooks/useGetInfiniteDelegationEvents'

export type Reward = {
  amount: number
  alpha: number
  alphaAmountInTao?: number
}

type Rewards = Map<string, Reward>

export function useGetRewardsByNominator({ nominator }: { nominator: string }) {
  const { data, hasNextPage, isFetchNextPageError, isError, fetchNextPage, isFetchingNextPage } =
    useGetInfiniteDelegationEvents({
      nominator,
    })

  const allBalances = useBalances()
  const currency = useRecoilValue(selectedCurrencyState)

  const accountBalances = allBalances.find(b => b.address === nominator)

  const subtensor = accountBalances.each.flatMap(b =>
    b.subtensor.map((subtensor, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { meta } = subtensor as any

      return {
        key: `${b.id}-subtensor-${index}`,
        description: meta?.description ?? undefined,
        tokens: BigNumber(subtensor.amount.tokens),
        fiat: subtensor.amount.fiat(currency),
        locked: true,
        meta: meta,
      }
    })
  )

  const combinedPagesData = useMemo(() => data?.pages.flatMap(page => page.data) || [], [data])

  useEffect(() => {
    if (hasNextPage && !isFetchNextPageError) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchNextPageError, fetchNextPage])

  const parsedDataByNetuidAndDelegator = useMemo(() => {
    if (combinedPagesData.length && !isFetchingNextPage) {
      const groupedData = groupBy(combinedPagesData, event => `${event.netuid || 0}_${event.delegate.ss58}`)

      const rewards = Object.keys(groupedData).reduce<Rewards>((acc, currEventKey) => {
        const currentEventsByNetuidAndDelegate = groupedData[currEventKey]!
        const reward = currentEventsByNetuidAndDelegate?.reduce<Reward>(
          (accReward, currReward) => {
            const { amount, alpha, action } = currReward
            if (action === 'DELEGATE') {
              accReward.amount -= Number(amount)
              accReward.alpha -= Number(alpha)
            } else {
              accReward.amount += Number(amount)
              accReward.alpha += Number(alpha)
            }
            return accReward
          },
          { amount: 0, alpha: 0 }
        )
        acc.set(currEventKey, reward)
        return acc
      }, new Map() as Rewards)

      subtensor.forEach(({ meta }) => {
        const { netuid, hotkey, amountStaked, alphaToTaoRate } = meta || {}
        const key = `${netuid || 0}_${hotkey}`
        const isRootnetStake = netuid === ROOT_NETUID

        const reward = rewards.get(key)
        if (reward) {
          if (isRootnetStake) {
            reward.amount += Number(amountStaked)
            reward.alpha += Number(amountStaked)
          } else {
            reward.amount += Number(amountStaked) // This includes P&L of Alpha token price fluctuations against TAO + rewards
            reward.alpha += Number(amountStaked)
            reward.alphaAmountInTao = Math.round((reward.alpha * alphaToTaoRate) / Number(SCALE_FACTOR.toString()))
          }

          rewards.set(key, reward)
        }
      })

      return { groupedData, rewards }
    }

    return { groupedData: {}, rewards: new Map<string, Reward>() }
  }, [combinedPagesData, isFetchingNextPage, subtensor])

  return {
    data: parsedDataByNetuidAndDelegator,
    isError,
  }
}
