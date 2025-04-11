import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useMemo } from 'react'

import { ValidatorsYieldApiResponse } from '../types'

const TAOSTATS_API_KEY = import.meta.env.VITE_TAOSTATS_API_KEY
const TAOSTATS_API_URL = import.meta.env.VITE_TAOSTATS_API_URL

const fetchValidatorsYield = async ({ pageParam = 1, netuid = 0 }) => {
  const { data } = await axios.get<ValidatorsYieldApiResponse>(
    `${TAOSTATS_API_URL}/api/dtao/validator/yield/latest/v1`,
    {
      params: { page: pageParam, limit: 100, netuid: netuid },
      method: 'GET',
      headers: {
        Authorization: TAOSTATS_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  )
  return data
}

export function useGetInfiniteValidatorsYield({ netuid }: { netuid: number }) {
  return useInfiniteQuery({
    queryKey: ['infiniteValidatorsYield', netuid],
    queryFn: ({ pageParam = 1 }) => fetchValidatorsYield({ pageParam, netuid }),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.pagination.next_page ?? undefined,
    getPreviousPageParam: firstPage => firstPage.pagination.prev_page ?? undefined,
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, // 10 mins
    refetchOnReconnect: true,
  })
}

export function useGetInfiniteValidatorsYieldByNetuid({ netuid }: { netuid: number }) {
  const { data, hasNextPage, isFetchNextPageError, isError, fetchNextPage } = useGetInfiniteValidatorsYield({ netuid })

  const combinedData = useMemo(() => data?.pages.flatMap(page => page.data) || [], [data])

  useEffect(() => {
    if (hasNextPage && !isFetchNextPageError) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchNextPageError, fetchNextPage])

  return {
    data: combinedData,
    isError,
  }
}
