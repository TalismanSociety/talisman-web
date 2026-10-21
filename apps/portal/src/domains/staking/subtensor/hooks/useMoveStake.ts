import { useContext, useMemo } from "react"

import { ROOT_NETUID } from "@/components/widgets/staking/subtensor/constants"
import { useNativeTokenAmount } from "@/domains/chains/chains"
import { ChainContext } from "@/domains/chains/contexts"
import { useTx } from "@/domains/common/hooks/useTx"
import { useGetDynamicTaoStakeInfo } from "@/domains/staking/subtensor/hooks/useGetDynamicTaoStakeInfo"

import { moveStakeCall, placeholderCall, txOf } from "../calls"
import { moveStakeError } from "../validation"
import type { StakeItem } from "./useStake"
import { useSubtensorMinimums } from "./useSubtensorMinimums"

type MoveItem = {
	stake: StakeItem | undefined
	destinationHotkey: string | undefined
}

export const useMoveStake = ({ stake, destinationHotkey }: MoveItem) => {
	const { genesisHash } = useContext(ChainContext)
	const nativeTokenAmount = useNativeTokenAmount()

	const { hotkey: originHotkey, stake: alphaAmount, netuid, symbol } = stake || {}
	const formattedAlphaAmount = nativeTokenAmount.fromPlanckOrUndefined(alphaAmount, symbol)

	const { taoAmountFromAlpha, isLoading } = useGetDynamicTaoStakeInfo({
		amount: formattedAlphaAmount,
		netuid: netuid ?? 0,
		direction: "alphaToTao",
		shouldUpdateFeeAndSlippage: false,
	})

	const { data: minimums } = useSubtensorMinimums()
	const taoValue =
		netuid === ROOT_NETUID ? (alphaAmount ?? 0n) : (taoAmountFromAlpha.decimalAmount?.planck ?? 0n)

	const error = useMemo(
		() =>
			minimums && !isLoading
				? moveStakeError(taoValue, nativeTokenAmount.fromPlanck(minimums.transfer).decimalAmount)
				: undefined,
		[isLoading, minimums, nativeTokenAmount, taoValue]
	)

	const isReady =
		stake && destinationHotkey && originHotkey !== destinationHotkey && minimums && !error

	const call = useMemo(
		() =>
			stake && destinationHotkey
				? moveStakeCall({
						originHotkey: stake.hotkey,
						destinationHotkey,
						netuid: stake.netuid,
						alphaAmount: stake.stake,
					})
				: placeholderCall(),
		[stake, destinationHotkey]
	)

	const extrinsic = useTx(genesisHash, (runtime) => txOf(runtime, call))

	return { extrinsic, isReady, error }
}
