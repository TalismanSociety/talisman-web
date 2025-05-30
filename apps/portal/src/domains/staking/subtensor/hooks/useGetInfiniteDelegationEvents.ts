import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'

import { TAO_STAKE_GENESIS_MONTH_TIMESTAMP } from '@/components/widgets/staking/subtensor/constants'

import { DelegationEventsApiResponse } from '../types'

const TAOSTATS_API_KEY = import.meta.env.VITE_TAOSTATS_API_KEY
const TAOSTATS_API_URL = import.meta.env.VITE_TAOSTATS_API_URL

type FetchValidatorsYield = {
  pageParam: number
  nominator: string
  timestamp_start: number
  timestamp_end: number
}

const fetchValidatorsYield = async ({
  pageParam = 1,
  nominator,
  timestamp_start,
  timestamp_end,
}: FetchValidatorsYield) => {
  const { data } = await axios.get<DelegationEventsApiResponse>(`${TAOSTATS_API_URL}/api/delegation/v1`, {
    params: {
      page: pageParam,
      limit: 200,
      nominator: nominator,
      timestamp_start,
      timestamp_end,
      order: 'block_number_desc',
    },
    method: 'GET',
    headers: {
      Authorization: TAOSTATS_API_KEY,
      'Content-Type': 'application/json',
    },
  })
  return data
}

type UseGetInfiniteDelegationEventsProps = {
  nominator: string
  isEnabled?: boolean
}

export function useGetInfiniteDelegationEvents({ nominator, isEnabled = true }: UseGetInfiniteDelegationEventsProps) {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  tomorrow.setMinutes(0, 0, 0) // Round down to the nearest hour to avoid re-fetching on every second change.
  const timestamp_end = Math.ceil(tomorrow.getTime() / 1000) // Convert ms to seconds

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
    enabled: !!nominator && isEnabled,
  })
}
