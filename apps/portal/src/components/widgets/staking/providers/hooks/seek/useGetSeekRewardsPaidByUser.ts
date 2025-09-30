import { useQuery } from '@tanstack/react-query'
import request from 'graphql-request'

const SEEK_GRAPHQL_ENDPOINT = 'https://talisman.squids.live/seek-staking-sqd-indexer@v1/api/graphql'

export const SEEK_REWARDS_PAID_BY_USER_QUERY_KEY = 'seekRewardsPaidByUser'

export type SeekUser = {
  createdAt: string
  createdBlock: number
  id: string
  totalRewardsClaimed: string
  updatedAt: string
  updatedAtBlock: number
}

export type SeekUserResponse = {
  users: SeekUser[]
}

const GET_SEEK_USER_QUERY = `
  query MyQuery($userId: String!) {
    users(where: {id_eq: $userId}) {
      createdAt
      createdBlock
      id
      totalRewardsClaimed
      updatedAt
      updatedAtBlock
    }
  }
`

const fetchSeekUserData = async (userId: string): Promise<SeekUser | null> => {
  try {
    const response = await request<SeekUserResponse>(SEEK_GRAPHQL_ENDPOINT, GET_SEEK_USER_QUERY, { userId })

    return response.users?.[0] || null
  } catch (error) {
    console.error('Failed to fetch seek user data:', error)
    throw error
  }
}

export const useGetSeekRewardsPaidByUser = (address: string) => {
  const userAddress = address.toLowerCase()
  return useQuery({
    queryKey: [SEEK_REWARDS_PAID_BY_USER_QUERY_KEY, userAddress],
    queryFn: () => fetchSeekUserData(userAddress),
    enabled: !!userAddress,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 1, // Refetch every 1 minute
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })
}

export default useGetSeekRewardsPaidByUser
