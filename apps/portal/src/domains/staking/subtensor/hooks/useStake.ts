import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import { MIN_SUBTENSOR_ALPHA_STAKE, ROOT_NETUID } from '@/components/widgets/staking/subtensor/constants'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { useTokenAmount } from '@/domains/common/hooks/useTokenAmount'
import { type SubnetData } from '@/domains/staking/subtensor/types'
import { Decimal } from '@/util/Decimal'

import { useCombineSubnetData } from './useCombineSubnetData'
import { useGetRewardsByNominator } from './useGetRewardsByNominator'
import { useGetStakeInfoForColdKey } from './useGetStakeInfoForColdKey'

export type StakeItem = SubnetData & {
  totalStaked: {
    decimalAmount: Decimal | undefined
    fiatAmount: number
    localizedFiatAmount: string
  }
  rewards: {
    decimalAmount: Decimal | undefined
    fiatAmount: number
    localizedFiatAmount: string
  }
  rewardsFormatted: {
    decimalAmount: Decimal | undefined
    fiatAmount: number
    localizedFiatAmount: string
  }
  symbol: string | undefined
  coldkey: string
  hotkey: string
  netuid: number
  stake: bigint
}

export type Stake = {
  stakes: StakeItem[] | undefined
}

export const useStake = (account: Account): Stake => {
  const api = useRecoilValue(useSubstrateApiState())
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())
  const nativeToken = api.registry.chainTokens[0] || 'TAO'
  const { subnetData } = useCombineSubnetData()
  const { data: stakeInfoForColdKey } = useGetStakeInfoForColdKey(account.address)

  const {
    data: { rewards },
  } = useGetRewardsByNominator({ nominator: account.address })

  const minimumStakeAmount = useTokenAmount(String(MIN_SUBTENSOR_ALPHA_STAKE))

  const stakes = stakeInfoForColdKey
    ?.map(stake => {
      const { netuid, hotkey } = stake
      const isRootnetStake = Number(netuid) === ROOT_NETUID
      const stakeKey = `${netuid}_${hotkey}`
      const stakeReward = rewards?.get(stakeKey)
      const reward = isRootnetStake ? stakeReward?.amount : stakeReward?.alpha
      const subnet = subnetData[Number(netuid)]
      const symbol = isRootnetStake ? nativeToken : subnet?.symbol
      const rewardsAmount = isRootnetStake ? stakeReward?.amount : stakeReward?.alphaAmountInTao
      return {
        ...stake,
        ...subnet,
        netuid: Number(netuid),
        totalStaked: nativeTokenAmount.fromPlanckOrUndefined(stake.stake, symbol || nativeToken),
        rewards: nativeTokenAmount.fromPlanckOrUndefined(reward, symbol || nativeToken),
        rewardsFormatted: nativeTokenAmount.fromPlanckOrUndefined(rewardsAmount, symbol), // Used for displaying rewards in fiat
        symbol,
      }
    })
    .filter(
      ({ totalStaked }) => (totalStaked.decimalAmount?.planck ?? 0n) > (minimumStakeAmount.decimalAmount?.planck ?? 0n)
    )

  return { stakes }
}
