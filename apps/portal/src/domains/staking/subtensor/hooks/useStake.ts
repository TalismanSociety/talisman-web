import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import { ROOT_NETUID } from '@/components/widgets/staking/subtensor/constants'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { type SubnetData } from '@/domains/staking/subtensor/types'
import { Decimal } from '@/util/Decimal'

import { useCombineSubnetData } from './useCombineSubnetData'
import { useGetStakeInfoForColdKey } from './useGetStakeInfoForColdKey'

export type StakeItem = SubnetData & {
  totalStaked: {
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

  const stakes = stakeInfoForColdKey?.map(stake => {
    const subnet = subnetData[Number(stake.netuid)]
    const symbol = Number(stake.netuid) !== ROOT_NETUID ? subnet?.symbol : nativeToken
    return {
      ...stake,
      ...subnet,
      netuid: Number(stake.netuid),
      totalStaked: nativeTokenAmount.fromPlanckOrUndefined(stake.stake, symbol || nativeToken),
      symbol,
    }
  })

  return { stakes }
}
