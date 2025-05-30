import { useBalances } from '@talismn/balances-react'
import { groupBy } from 'lodash'
import { useEffect, useMemo } from 'react'

import { ROOT_NETUID, SCALE_FACTOR } from '@/components/widgets/staking/subtensor/constants'
import { useGetInfiniteDelegationEvents } from '@/domains/staking/subtensor/hooks/useGetInfiniteDelegationEvents'

import { useGetDTaoStakedBalances } from './useGetDTaoStakedBalances'

export type Reward = {
  amount: number
  alpha: number
  alphaAmountInTao: number
}

type Rewards = Map<string, Reward>

export function useGetRewardsByNominator({ nominator }: { nominator: string }) {
  const allBalances = useBalances()

  const accountBalances = useMemo(() => allBalances.find(b => b.address === nominator), [allBalances, nominator])

  const subtensorStakedPositionsInfo = useMemo(
    () =>
      accountBalances.each.flatMap(b =>
        b.subtensor.map(subtensor => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { meta } = subtensor as any

          const { netuid, hotkey, alphaToTaoRate } = meta || {}

          return {
            coldkey: nominator,
            hotkey,
            netuid: netuid || 0,
            alphaToTaoRate,
          }
        })
      ),
    [accountBalances.each, nominator]
  )

  const { data: stakedBalancesData } = useGetDTaoStakedBalances({
    positions: subtensorStakedPositionsInfo,
  })

  const { data, hasNextPage, isFetchNextPageError, isError, fetchNextPage, isFetchingNextPage } =
    useGetInfiniteDelegationEvents({
      nominator,
      isEnabled: subtensorStakedPositionsInfo.length > 0,
    })

  useEffect(() => {
    if (hasNextPage && !isFetchNextPageError && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchNextPageError, fetchNextPage, isFetchingNextPage])

  const combinedPagesData = useMemo(() => data?.pages.flatMap(page => page.data) || [], [data])

  const groupedByNetuidAndDelegator = useMemo(() => {
    if (combinedPagesData.length && !isFetchingNextPage) {
      return groupBy(combinedPagesData, event => `${event.netuid || 0}_${event.delegate.ss58}`)
    }
    return {}
  }, [combinedPagesData, isFetchingNextPage])

  const summedDelegationEvents = useMemo(() => {
    const rewards = Object.keys(groupedByNetuidAndDelegator).reduce<Rewards>((acc, currEventKey) => {
      const currentEventsByNetuidAndDelegate = groupedByNetuidAndDelegator[currEventKey]!
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
        { amount: 0, alpha: 0, alphaAmountInTao: 0 }
      )
      acc.set(currEventKey, reward)
      return acc
    }, new Map() as Rewards)

    Object.keys(stakedBalancesData).forEach(key => {
      const balanceData = stakedBalancesData[key]!

      const [keyNetuid, keyHotkey] = key.split('_')

      const { netuid, balance } = balanceData
      const isRootnetStake = netuid === ROOT_NETUID

      const reward = rewards.get(key)

      if (reward) {
        if (isRootnetStake) {
          reward.amount += Number(balance)
          reward.alpha += Number(balance)
        } else {
          const { alphaToTaoRate } =
            subtensorStakedPositionsInfo.find(({ hotkey, netuid }) => {
              return hotkey === keyHotkey && netuid === Number(keyNetuid)
            }) || {}
          reward.amount += Number(balance) // This includes P&L of Alpha token price fluctuations against TAO + rewards
          reward.alpha += Number(balance)
          reward.alphaAmountInTao = Math.round((reward.alpha * alphaToTaoRate) / Number(SCALE_FACTOR.toString()))
        }

        rewards.set(key, reward)
      }
    })
    return rewards
  }, [groupedByNetuidAndDelegator, stakedBalancesData, subtensorStakedPositionsInfo])

  // TODO: add an isLoading state
  return {
    rewards: summedDelegationEvents,
    isError,
  }
}
