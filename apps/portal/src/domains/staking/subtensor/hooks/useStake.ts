import { useAtomValue } from 'jotai'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { Decimal } from '@/util/Decimal'

import { accountStakeAtom } from '../atoms/accountStake'
import { useGetSubnetPools } from './useGetSubnetPools'

export type StakeItem = {
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
  const { data: { data: subnetPools = [] } = {} } = useGetSubnetPools()
  const api = useRecoilValue(useSubstrateApiState())
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())
  const nativeToken = api.registry.chainTokens[0] || 'TAO'

  const stakeInfoForColdKey = useAtomValue(accountStakeAtom({ api, address: account.address }))

  const stakes = stakeInfoForColdKey?.map(stake => {
    const symbol =
      stake.netuid !== 0 ? subnetPools?.find(pool => Number(pool.netuid) === Number(stake.netuid))?.symbol : nativeToken
    return {
      ...stake,
      netuid: Number(stake.netuid),
      totalStaked: nativeTokenAmount.fromPlanckOrUndefined(stake.stake, symbol || nativeToken),
      symbol,
    }
  })

  return { stakes }
}
