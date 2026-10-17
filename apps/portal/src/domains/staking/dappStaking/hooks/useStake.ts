import { bind } from "@react-rxjs/core"
import { addMilliseconds, formatDistanceToNow } from "date-fns"
import { useContext, useMemo } from "react"

import type { Account } from "@/domains/accounts/accounts"
import {
	type NativeTokenAmount,
	useNativeTokenAmount,
	useNativeTokenAmountLoadable,
} from "@/domains/chains/chains"
import { ChainContext } from "@/domains/chains/contexts"
import { LOADING, loadableData, toLoadable } from "@/util/loadable"

import { dappStake$ } from "../chain"
import type { DappStake } from "../stake"

const withTokenAmounts = (stake: DappStake, tokenAmount: NativeTokenAmount) => ({
	...stake,
	amounts: {
		totalStaked: tokenAmount.fromPlanckOrUndefined(stake.totalStaked),
		locked: tokenAmount.fromPlanck(stake.locked),
		totalRewards: tokenAmount.fromPlanck(stake.stakerRewards),
		totalUnlocking: tokenAmount.fromPlanck(stake.totalUnlocking),
		withdrawable: tokenAmount.fromPlanck(stake.withdrawable),
	},
	unlocking: stake.pendingUnlocks.map((chunk) => ({
		amount: tokenAmount.fromPlanck(chunk.amount),
		eta: formatDistanceToNow(addMilliseconds(new Date(), chunk.remainingMs)),
	})),
})

export type Stake = ReturnType<typeof withTokenAmounts>

const [useDappStake] = bind(dappStake$)

const [useDappStakeLoadable] = bind(
	(genesisHash: string, address: string) => toLoadable(dappStake$(genesisHash, address)),
	LOADING
)

export const useStake = (account: Account) => {
	const nativeTokenAmount = useNativeTokenAmount()
	const stake = useDappStake(useContext(ChainContext).genesisHash, account.address)
	return useMemo(() => withTokenAmounts(stake, nativeTokenAmount), [nativeTokenAmount, stake])
}

export const useStakeLoadable = (account: Account) => {
	const tokenAmountLoadable = useNativeTokenAmountLoadable()
	const tokenAmount = loadableData(tokenAmountLoadable)
	const stake = useDappStakeLoadable(useContext(ChainContext).genesisHash, account.address)
	const data = useMemo(
		() =>
			stake.status === "success" && tokenAmount !== undefined
				? withTokenAmounts(stake.data, tokenAmount)
				: undefined,
		[stake, tokenAmount]
	)
	return {
		data,
		isLoading: stake.status === "loading" || tokenAmountLoadable.status === "loading",
	}
}
