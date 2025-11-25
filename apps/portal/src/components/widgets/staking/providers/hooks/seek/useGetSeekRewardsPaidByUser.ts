import { useQuery } from '@tanstack/react-query'
import request from 'graphql-request'
import { useMemo } from 'react'
import { useRecoilValueLoadable } from 'recoil'

import { tokenPriceState } from '@/domains/chains/recoils'
import { DECIMALS, SEEK_COIN_GECKO_ID, SEEK_TICKER } from '@/domains/staking/seek/constants'
import { Decimal } from '@/util/Decimal'

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
    const response = await request<SeekUserResponse>(import.meta.env.VITE_SEEK_STAKE_INDEXER, GET_SEEK_USER_QUERY, {
      userId,
    })

    return response.users?.[0] || null
  } catch (error) {
    console.error('Failed to fetch seek user data:', error)
    throw error
  }
}

export const useGetSeekRewardsPaidByUser = (address: string) => {
  const userAddress = address.toLowerCase()
  const result = useQuery({
    queryKey: [SEEK_REWARDS_PAID_BY_USER_QUERY_KEY, userAddress],
    queryFn: () => fetchSeekUserData(userAddress),
    enabled: !!userAddress,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 1, // Refetch every 1 minute
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })

  const totalRewardsClaimed = result.data?.totalRewardsClaimed
  const totalRewardsClaimedDecimal = Decimal.fromPlanck(totalRewardsClaimed ?? 0, DECIMALS ?? 0, {
    currency: SEEK_TICKER,
  })

  const tokenPriceLoadable = useRecoilValueLoadable(tokenPriceState({ coingeckoId: SEEK_COIN_GECKO_ID }))
  const tokenPrice = tokenPriceLoadable.valueMaybe()
  const totalRewardsClaimedFiat = useMemo(
    () => totalRewardsClaimedDecimal.toNumber() * (tokenPrice ?? 0),
    [totalRewardsClaimedDecimal, tokenPrice]
  )

  return { ...result, totalRewardsClaimedDecimal, totalRewardsClaimedFiat }
}

export default useGetSeekRewardsPaidByUser
