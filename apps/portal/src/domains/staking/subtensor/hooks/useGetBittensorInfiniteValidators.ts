import { useInfiniteQuery } from '@tanstack/react-query'

import { ValidatorsData } from '../types'

const TAOSTATS_API_KEY = import.meta.env.VITE_TAOSTATS_API_KEY
const TAOSTATS_API_URL = import.meta.env.VITE_TAOSTATS_API_URL

const MAX_PAGE_SIZE = 100

const fetchBittensorInfiniteValidators = async (page: number = 1): Promise<ValidatorsData> => {
  try {
    const response = await (
      await fetch(`${TAOSTATS_API_URL}/api/dtao/validator/latest/v1?page=${page}&limit=${MAX_PAGE_SIZE}`, {
        method: 'GET',
        headers: {
          'X-Extension-ID': TAOSTATS_API_KEY ?? '',
          'Content-Type': 'application/json',
        },
      })
    ).json()
    return response
  } catch (cause) {
    throw new Error('Failed to fetch TAO stats', { cause })
  }
}

export const useGetBittensorInfiniteValidators = ({ isEnabled }: { isEnabled: boolean }) => {
  return useInfiniteQuery({
    queryKey: ['useGetBittensorInfiniteValidators'],
    queryFn: ({ pageParam = 1 }) => fetchBittensorInfiniteValidators(pageParam),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.pagination?.next_page ?? undefined,
    getPreviousPageParam: firstPage => firstPage.pagination?.prev_page ?? undefined,
    enabled: isEnabled,
    staleTime: 10 * 60 * 1000,
  })
}
