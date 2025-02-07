import { QueryClient, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { SubnetApiResponse } from '../types'

const TAOSTATS_API_KEY = import.meta.env.VITE_TAOSTATS_API_KEY
const TAOSTATS_API_URL = import.meta.env.VITE_TAOSTATS_API_URL

export const queryClient = new QueryClient()

const fetchSubnetPools = async () => {
  const { data } = await axios.get<SubnetApiResponse>(`${TAOSTATS_API_URL}/api/dtao/pool/v1`, {
    method: 'GET',
    headers: {
      Authorization: TAOSTATS_API_KEY,
      'Content-Type': 'application/json',
    },
  })
  return data
}

export const useGetSubnetPools = () => {
  return useQuery({
    queryKey: ['subnetPools'],
    queryFn: fetchSubnetPools,
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, // 10 mins
    refetchOnReconnect: true,
  })
}
