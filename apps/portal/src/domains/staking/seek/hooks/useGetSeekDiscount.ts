import { DISCOUNT_TIERS } from '../constants'
import { useGetSeekStaked } from './useGetSeekStaked'

export const useGetSeekDiscount = () => {
  const { data, isLoading, isError, refetch } = useGetSeekStaked()

  if (isLoading || isError || !data) {
    return { tier: DISCOUNT_TIERS[0], isLoading, isError, refetch }
  }

  const getTier = ({ amount }: { amount: bigint }) => {
    return DISCOUNT_TIERS.findLast(tier => amount >= tier.min) || DISCOUNT_TIERS[0]
  }

  const tier = getTier({ amount: data.totalStaked.amount })

  return { tier, isLoading, isError, refetch }
}
