import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'

import { SubnetApiResponse } from '../types'

const TAOSTATS_API_KEY = import.meta.env.VITE_TAOSTATS_API_KEY
const TAOSTATS_API_URL = import.meta.env.VITE_TAOSTATS_API_URL

const fetchSubnetPools = async ({ pageParam = 1 }) => {
  const { data } = await axios.get<SubnetApiResponse>(`${TAOSTATS_API_URL}/api/dtao/pool/v1`, {
    params: { page: pageParam },
    method: 'GET',
    headers: {
      Authorization: TAOSTATS_API_KEY,
      'Content-Type': 'application/json',
    },
  })
  return data
}

export function useGetInfiniteSubnetPools() {
  return useInfiniteQuery({
    queryKey: ['infiniteSubnetPools'],
    queryFn: fetchSubnetPools,
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.pagination.next_page ?? undefined,
    getPreviousPageParam: firstPage => firstPage.pagination.prev_page ?? undefined,
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, // 10 mins
    refetchOnReconnect: true,
  })
}
