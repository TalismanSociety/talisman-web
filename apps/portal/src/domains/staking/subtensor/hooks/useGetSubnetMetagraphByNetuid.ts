import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'

import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'

import { type RuntimePoolData } from '../types'

export const useGetSubnetMetagraphByNetuid = ({ netuid }: { netuid: number }) => {
  const api = useRecoilValue(useSubstrateApiState())

  const fetchSubnetMetagraph = async ({ netuid }: { netuid: number }) => {
    try {
      const response = (await (
        await api?.call['subnetInfoRuntimeApi']?.['getMetagraph']?.(netuid)
      )?.toHuman()) as RuntimePoolData

      return response
    } catch (error) {
      console.error('useGetSubnetMetagraphByNetuid', error)
      return undefined
    }
  }

  return useQuery({
    queryKey: ['subnetMetagraph', netuid],
    queryFn: () => fetchSubnetMetagraph({ netuid }),
    staleTime: 1000 * 10, // 10 seconds
    enabled: !!api && netuid !== undefined && netuid !== 0,
    retry: 10,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // tryDelay is set to double (starting at 1000ms) with each attempt, but not exceed 30 seconds
  })
}
