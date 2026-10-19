import {
	MIN_SUBTENSOR_ALPHA_STAKE,
	ROOT_NETUID,
} from "@/components/widgets/staking/subtensor/constants"
import type { Account } from "@/domains/accounts/accounts"
import { useChain, useNativeTokenAmount } from "@/domains/chains/chains"
import { useTokenAmount } from "@/domains/common/hooks/useTokenAmount"
import type { SubnetData } from "@/domains/staking/subtensor/types"
import type { Decimal } from "@/util/Decimal"

import { useCombineSubnetData } from "./useCombineSubnetData"
import { useGetStakeInfoForColdKey } from "./useGetStakeInfoForColdKey"

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
	isLoading: boolean
}

export const useStake = (account: Account): Stake => {
	const nativeTokenAmount = useNativeTokenAmount()
	const nativeToken = useChain().nativeToken?.symbol || "TAO"
	const { subnetData } = useCombineSubnetData()
	const { data: stakeInfoForColdKey, isLoading } = useGetStakeInfoForColdKey(account.address)

	const minimumStakeAmount = useTokenAmount(String(MIN_SUBTENSOR_ALPHA_STAKE))

	const stakes = stakeInfoForColdKey
		?.map((stake) => {
			const { netuid } = stake
			const isRootnetStake = Number(netuid) === ROOT_NETUID
			const subnet = subnetData[Number(netuid)]
			const symbol = isRootnetStake ? nativeToken : subnet?.symbol
			return {
				...stake,
				...subnet,
				netuid: Number(netuid),
				totalStaked: nativeTokenAmount.fromPlanckOrUndefined(stake.stake, symbol || nativeToken),
				symbol,
			}
		})
		.filter(
			({ totalStaked }) =>
				(totalStaked.decimalAmount?.planck ?? 0n) > (minimumStakeAmount.decimalAmount?.planck ?? 0n)
		)

	return { stakes, isLoading }
}
