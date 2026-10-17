import { BigMath } from "@talismn/util"
import { useQuery } from "@tanstack/react-query"
import type { TxCallData } from "polkadot-api"
import { useContext, useEffect, useMemo, useState } from "react"
import { useRecoilValue } from "recoil"
import { firstValueFrom } from "rxjs"
import {
	MIN_SUBTENSOR_ALPHA_STAKE,
	MIN_SUBTENSOR_ROOTNET_STAKE,
	ROOT_NETUID,
} from "@/components/widgets/staking/subtensor/constants"
import type { Account } from "@/domains/accounts/accounts"
import { getChainRuntime$ } from "@/domains/chains/chain-runtime"
import { ChainContext } from "@/domains/chains/contexts"
import { useNativeTokenAmountState } from "@/domains/chains/recoils"
import { useTokenAmount, useTokenAmountFromPlanck } from "@/domains/common/hooks/useTokenAmount"
import { estimateTxFee, useTx } from "@/domains/common/hooks/useTx"
import { useGetDynamicTaoStakeInfo } from "@/domains/staking/subtensor/hooks/useGetDynamicTaoStakeInfo"

import { setFeeEstimate } from "../breakdown"
import { placeholderCall, stakeCall, txOf, unstakeCall } from "../calls"
import type { SubtensorBalance } from "../chain"
import type { StakeItem } from "./useStake"

export const useAddStakeForm = (
	account: Account,
	{ balance, existentialDeposit }: SubtensorBalance,
	stake: StakeItem | undefined,
	delegate: string | undefined,
	netuid: number | undefined
) => {
	const [input, setInput] = useState("")
	const { genesisHash } = useContext(ChainContext)
	const amount = useTokenAmount(input)

	const isRootnetStake = netuid === ROOT_NETUID

	const {
		slippage,
		isLoading: isSlippageLoading,
		error: isDynamicTaoStakeInfoError,
		expectedAlphaAmount,
		alphaPriceWithSlippageFormatted,
		taoToAlphaTalismanFee,
		taoToAlphaTalismanFeeFormatted,
		calculateExpectedTaoFromAlpha,
	} = useGetDynamicTaoStakeInfo({
		amount: amount,
		netuid: netuid ?? 0,
		direction: "taoToAlpha",
		shouldUpdateFeeAndSlippage: !isRootnetStake,
	})

	const limitPrice = alphaPriceWithSlippageFormatted.decimalAmount?.planck || 0n
	const amountPlanck = amount.decimalAmount?.planck ?? 0n

	const call = useMemo(
		() =>
			!delegate || netuid === undefined
				? placeholderCall()
				: stakeCall({
						hotkey: delegate,
						netuid,
						amount: amountPlanck,
						limitPrice,
						talismanFee: taoToAlphaTalismanFee,
					}),
		[delegate, netuid, amountPlanck, limitPrice, taoToAlphaTalismanFee]
	)

	const [feeEstimate, isFeeEstimateReady] = useStakeFormFeeEstimate(
		genesisHash,
		account.address,
		call
	)

	const formattedFeeEstimate = useTokenAmountFromPlanck(feeEstimate)

	useEffect(() => {
		setFeeEstimate(formattedFeeEstimate)
	}, [formattedFeeEstimate])

	const transferablePlanck = useMemo(() => {
		//
		// This diagram shows the relationship between these balance properties:
		//
		// |--------------------------total--------------------------|
		// |---reserved---|-------------------free-------------------|
		//                |--untouchable--|
		//                |-ed-| // existentialDeposit
		// |------------frozen------------|-------transferable-------|
		//
		// To calculate `transferable`:
		// 1. first we need to derive `untouchable`,
		// 2. then we need to ensure that `untouchable` is never smaller than `ed`
		// 3. finally we need to subtract `untouchable` from `free`.
		//
		const { reserved, frozen, free } = balance
		const untouchable = BigMath.max(frozen - reserved, 0n)

		// make sure untouchable is never less than the existentialDeposit
		const untouchableOrEd = BigMath.max(untouchable, existentialDeposit)

		const transferable = BigMath.max(free - (untouchableOrEd + taoToAlphaTalismanFee), 0n)

		return transferable - feeEstimate
	}, [balance, existentialDeposit, feeEstimate, taoToAlphaTalismanFee])

	const transferable = useTokenAmountFromPlanck(transferablePlanck)

	// resulting alpha
	const resulting = useTokenAmountFromPlanck(
		useMemo(
			() =>
				(stake?.totalStaked.decimalAmount?.planck ?? 0n) +
				(expectedAlphaAmount.decimalAmount?.planck ?? 0n),
			[expectedAlphaAmount.decimalAmount?.planck, stake?.totalStaked.decimalAmount?.planck]
		)
	)

	const resultingAlphaInTao = calculateExpectedTaoFromAlpha({
		alphaStaked: resulting.decimalAmount?.toNumber() ?? 0,
	})

	const resultingAlphaInTaoAmount = useTokenAmount(resultingAlphaInTao.toString())

	const resultingTao = useTokenAmountFromPlanck(
		useMemo(
			() => (stake?.totalStaked.decimalAmount?.planck ?? 0n) + (amount.decimalAmount?.planck ?? 0n),
			[amount.decimalAmount?.planck, stake?.totalStaked.decimalAmount?.planck]
		)
	)

	const minimum = useTokenAmount(
		String(isRootnetStake ? MIN_SUBTENSOR_ROOTNET_STAKE : MIN_SUBTENSOR_ALPHA_STAKE)
	)
	const error = useMemo(() => {
		if (input === "") return
		if ((amount.decimalAmount?.planck ?? 0n) > transferable.decimalAmount.planck)
			return new Error("Insufficient balance")

		if ((amount.decimalAmount?.planck ?? 0n) < (minimum.decimalAmount?.planck ?? 0n)) {
			return new Error(`Minimum stake is ${minimum.decimalAmount?.toLocaleStringPrecision()}`)
		}

		if (isDynamicTaoStakeInfoError) {
			return new Error("Failed to fetch dynamic tao stake info")
		}

		return undefined
	}, [
		amount.decimalAmount?.planck,
		input,
		isDynamicTaoStakeInfoError,
		minimum.decimalAmount,
		transferable.decimalAmount.planck,
	])

	const extrinsic = useTx(genesisHash, (runtime) => txOf(runtime, call))

	const ready =
		isFeeEstimateReady &&
		(amount.decimalAmount?.planck ?? 0n) > 0n &&
		error === undefined &&
		delegate &&
		netuid !== undefined &&
		!isSlippageLoading &&
		!isDynamicTaoStakeInfoError

	return {
		input,
		setInput,
		amount,
		talismanFeeTokenAmount: isRootnetStake ? undefined : taoToAlphaTalismanFeeFormatted,
		transferable,
		resulting,
		resultingTao,
		extrinsic,
		ready,
		error,
		slippage,
		expectedAlphaAmount,
		isLoading: extrinsic.state === "loading" || isSlippageLoading,
		resultingAlphaInTaoAmount,
	}
}

export const useUnstakeForm = (account: Account, stake: StakeItem, delegate: string) => {
	const { genesisHash } = useContext(ChainContext)
	const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

	const [input, setInput] = useState("")
	const amount = useTokenAmount(input)
	const isRootnetStake = stake.netuid === ROOT_NETUID

	const {
		alphaToTaoSlippage: slippage,
		isLoading: isSlippageLoading,
		error: isDynamicTaoStakeInfoError,
		expectedTaoAmount,
		minAlphaUnstake,
		taoPriceWithSlippageFormatted,
		alphaToTaoTalismanFee,
		alphaToTaoTalismanFeeFormatted,
		taoToAlphaTalismanFee,
		taoToAlphaTalismanFeeFormatted,
		calculateExpectedTaoFromAlpha,
	} = useGetDynamicTaoStakeInfo({
		amount: amount,
		netuid: stake.netuid,
		direction: "alphaToTao",
		shouldUpdateFeeAndSlippage: !isRootnetStake,
	})

	const talismanFeeTxTokenAmount = isRootnetStake ? taoToAlphaTalismanFee : alphaToTaoTalismanFee
	const talismanFeeTokenAmount = isRootnetStake
		? taoToAlphaTalismanFeeFormatted
		: alphaToTaoTalismanFeeFormatted

	const limitPrice = taoPriceWithSlippageFormatted.decimalAmount?.planck || 0n

	const amountPlanck = amount.decimalAmount?.planck ?? 0n

	const call = useMemo(
		() =>
			unstakeCall({
				hotkey: delegate,
				netuid: stake.netuid,
				amount: amountPlanck,
				limitPrice,
				talismanFee: talismanFeeTxTokenAmount,
			}),
		[delegate, stake.netuid, amountPlanck, limitPrice, talismanFeeTxTokenAmount]
	)
	const extrinsic = useTx(genesisHash, (runtime) => txOf(runtime, call))

	const [feeEstimate] = useStakeFormFeeEstimate(genesisHash, account.address, call)

	const formattedFeeEstimate = useTokenAmountFromPlanck(feeEstimate)

	useEffect(() => {
		setFeeEstimate(formattedFeeEstimate)
	}, [formattedFeeEstimate])

	const available = nativeTokenAmount.fromPlanckOrUndefined(stake.stake, stake?.symbol)

	const minimum = useTokenAmount(
		String(isRootnetStake ? MIN_SUBTENSOR_ROOTNET_STAKE : minAlphaUnstake)
	)
	const minimumFormatted = nativeTokenAmount.fromPlanckOrUndefined(
		minimum.decimalAmount?.planck ?? 0n,
		stake?.symbol
	)

	const error = useMemo(() => {
		if (input === "" || !available.decimalAmount) return

		if ((amount.decimalAmount?.planck ?? 0n) > available.decimalAmount.planck)
			return new Error("Insufficient balance")

		if ((amount.decimalAmount?.planck ?? 0n) < (minimumFormatted.decimalAmount?.planck ?? 0n)) {
			return new Error(
				`Minimum unstake amount is ${minimumFormatted.decimalAmount?.toLocaleStringPrecision()}`
			)
		}

		if (
			amount.decimalAmount &&
			available.decimalAmount.planck - amount.decimalAmount.planck > 0n &&
			available.decimalAmount.planck - amount.decimalAmount.planck <
				(minimumFormatted.decimalAmount?.planck ?? 0n)
		) {
			return new Error(
				`You must keep ${minimumFormatted.decimalAmount?.toLocaleString?.()} to continue staking`
			)
		}

		if (isDynamicTaoStakeInfoError) {
			return new Error("Failed to fetch dynamic tao stake info")
		}

		return undefined
	}, [
		amount.decimalAmount,
		available.decimalAmount,
		input,
		isDynamicTaoStakeInfoError,
		minimumFormatted.decimalAmount,
	])

	const resulting = useTokenAmountFromPlanck(
		useMemo(
			() =>
				BigMath.max(
					0n,
					(available?.decimalAmount?.planck ?? 0n) - (amount.decimalAmount?.planck ?? 0n)
				),
			[amount.decimalAmount?.planck, available.decimalAmount?.planck]
		)
	)

	const resultingAlphaInTao = calculateExpectedTaoFromAlpha({
		alphaStaked: resulting.decimalAmount?.toNumber() ?? 0,
	})

	const resultingAlphaInTaoAmount = useTokenAmount(resultingAlphaInTao.toString())

	const ready =
		(amount.decimalAmount?.planck ?? 0n) > 0n &&
		error === undefined &&
		!isSlippageLoading &&
		!isDynamicTaoStakeInfoError

	return {
		input,
		setInput,
		amount,
		available,
		resulting,
		extrinsic,
		ready,
		error,
		alphaToTaoSlippage: slippage,
		expectedTaoAmount,
		isLoading: extrinsic.state === "loading" || isSlippageLoading,
		talismanFeeTokenAmount: isRootnetStake ? undefined : talismanFeeTokenAmount,
		resultingAlphaInTaoAmount,
	}
}

const callKey = (call: TxCallData) =>
	JSON.stringify(call, (_, value) => (typeof value === "bigint" ? value.toString() : value))

const useStakeFormFeeEstimate = (genesisHash: string, origin: string, call: TxCallData) => {
	const { data, isSuccess } = useQuery({
		queryKey: ["subtensorFeeEstimate", genesisHash, origin, callKey(call)],
		queryFn: async () => {
			const runtime = await firstValueFrom(getChainRuntime$(genesisHash))
			return estimateTxFee(genesisHash, origin, await txOf(runtime, call))
		},
		staleTime: Number.POSITIVE_INFINITY,
		retry: false,
	})
	return [data ?? 0n, isSuccess] as const
}
