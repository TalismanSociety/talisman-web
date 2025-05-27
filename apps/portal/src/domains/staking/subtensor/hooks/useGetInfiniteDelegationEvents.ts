import { useBalances } from '@talismn/balances-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { groupBy } from 'lodash'
import { useEffect, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import {
  ROOT_NETUID,
  SCALE_FACTOR,
  TAO_STAKE_GENESIS_MONTH_TIMESTAMP,
} from '@/components/widgets/staking/subtensor/constants'
import { selectedCurrencyState } from '@/domains/balances/currency'

import { DelegationEventsApiResponse } from '../types'

const TAOSTATS_API_KEY = import.meta.env.VITE_TAOSTATS_API_KEY
const TAOSTATS_API_URL = import.meta.env.VITE_TAOSTATS_API_URL

type FetchValidatorsYield = {
  pageParam: number
  nominator: string
  timestamp_start: number
  timestamp_end: number
}

const local = 'http://localhost:8787'

const fetchValidatorsYield = async ({
  pageParam = 1,
  nominator,
  timestamp_start,
  timestamp_end,
}: FetchValidatorsYield) => {
  const { data } = await axios.get<DelegationEventsApiResponse>(`${local}/api/delegation/v1`, {
    params: {
      page: pageParam,
      limit: 200,
      nominator: nominator,
      timestamp_start,
      timestamp_end,
      order: 'block_number_asc',
    },
    method: 'GET',
    headers: {
      Authorization: TAOSTATS_API_KEY,
      'Content-Type': 'application/json',
    },
  })
  return data
}

function useGetInfiniteDelegationEvents({ nominator }: { nominator: string }) {
  const now = new Date()
  now.setMinutes(0, 0, 0) // Round down to the nearest hour
  const timestamp_end = Math.floor(now.getTime() / 1000) // Convert ms to seconds

  return useInfiniteQuery({
    queryKey: ['InfiniteDelegationEvents', nominator, TAO_STAKE_GENESIS_MONTH_TIMESTAMP, timestamp_end],
    queryFn: ({ pageParam = 1 }) =>
      fetchValidatorsYield({ pageParam, nominator, timestamp_start: TAO_STAKE_GENESIS_MONTH_TIMESTAMP, timestamp_end }),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.pagination.next_page ?? undefined,
    getPreviousPageParam: firstPage => firstPage.pagination.prev_page ?? undefined,
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, // 10 mins
    refetchOnReconnect: true,
    enabled: !!nominator,
  })
}

export type Reward = {
  amount: number
  alpha: number
  alphaAmountInTao?: number
}

type Rewards = Map<string, Reward>

export function useGetInfiniteDelegationEventsByNominator({ nominator }: { nominator: string }) {
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

  const combinedData = useMemo(() => data?.pages.flatMap(page => page.data) || [], [data])

  useEffect(() => {
    if (hasNextPage && !isFetchNextPageError) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchNextPageError, fetchNextPage])

  const parsedDataByNetuid = useMemo(() => {
    if (combinedData.length && !isFetchingNextPage) {
      const groupedData = groupBy(combinedData, event => `${event.netuid || 0}_${event.delegate.ss58}`)

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
  }, [combinedData, isFetchingNextPage, subtensor])

  return {
    data: combinedData,
    parsedDataByNetuid,
    isError,
  }
}
