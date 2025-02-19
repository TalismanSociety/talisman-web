import { useQuery } from '@tanstack/react-query'

import { ValidatorsResponse } from '../types'

const SUPPORTED_DELEGATES_URL =
  'https://raw.githubusercontent.com/opentensor/bittensor-delegates/main/public/delegates.json'

const fetchBittensorSupportedDelegates = async (): Promise<ValidatorsResponse> => {
  try {
    const response = await (await fetch(SUPPORTED_DELEGATES_URL)).json()
    return response
  } catch (cause) {
    throw new Error('Failed to fetch TAO stats', { cause })
  }
}

export const useGetBittensorSupportedDelegates = () => {
  return useQuery({
    queryKey: ['getBittensorSupportedDelegates'],
    queryFn: async () => {
      const response = fetchBittensorSupportedDelegates()
      return response
    },
    enabled: true,
  })
}
