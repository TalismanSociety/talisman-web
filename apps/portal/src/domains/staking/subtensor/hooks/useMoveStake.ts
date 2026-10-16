import { useContext, useMemo } from "react"
import { useRecoilValue } from "recoil"

import {
	MIN_SUBTENSOR_ROOTNET_STAKE,
	ROOT_NETUID,
} from "@/components/widgets/staking/subtensor/constants"
import { ChainContext } from "@/domains/chains/contexts"
import { useNativeTokenAmountState } from "@/domains/chains/recoils"
import { useTokenAmount } from "@/domains/common/hooks/useTokenAmount"
import { useTx } from "@/domains/common/hooks/useTx"
import { useGetDynamicTaoStakeInfo } from "@/domains/staking/subtensor/hooks/useGetDynamicTaoStakeInfo"

import { moveStakeCall, placeholderCall, txOf } from "../calls"
import type { StakeItem } from "./useStake"

type MoveItem = {
	stake: StakeItem | undefined
	destinationHotkey: string | undefined
}

export const useMoveStake = ({ stake, destinationHotkey }: MoveItem) => {
	const { genesisHash } = useContext(ChainContext)
	const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

	const { hotkey: originHotkey, stake: alphaAmount, netuid, symbol } = stake || {}
	const formattedAlphaAmount = nativeTokenAmount.fromPlanckOrUndefined(alphaAmount, symbol)

	const { minAlphaUnstake } = useGetDynamicTaoStakeInfo({
		amount: formattedAlphaAmount,
		netuid: netuid ?? 0,
		direction: "alphaToTao",
		shouldUpdateFeeAndSlippage: false,
	})

	const isRootnetStake = netuid === ROOT_NETUID
	const minimum = useTokenAmount(
		String(isRootnetStake ? MIN_SUBTENSOR_ROOTNET_STAKE : minAlphaUnstake)
	)
	const minimumFormatted = nativeTokenAmount.fromPlanckOrUndefined(
		minimum.decimalAmount?.planck ?? 0n,
		stake?.symbol
	)

	const { isError, errorMessage } = useMemo(() => {
		const validations: Array<{ condition: boolean; message: string }> = [
			{
				condition:
					(formattedAlphaAmount.decimalAmount?.planck ?? 0n) <
					(minimumFormatted.decimalAmount?.planck ?? 0n),
				message: `Minimum staked amount for changing validator is ${minimumFormatted.decimalAmount?.toLocaleStringPrecision()}`,
			},
		]

		const firstError = validations.find((v) => v.condition)

		return {
			isError: Boolean(firstError),
			errorMessage: firstError?.message ?? null,
		}
	}, [formattedAlphaAmount.decimalAmount, minimumFormatted.decimalAmount])

	const isReady = stake && destinationHotkey && originHotkey !== destinationHotkey

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

	return { extrinsic, isReady, isError, errorMessage }
}
