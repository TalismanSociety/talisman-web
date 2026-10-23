import { BigMath } from "@talismn/util"
import { useQuery } from "@tanstack/react-query"
import type { TxCallData } from "polkadot-api"
import { useContext, useEffect, useMemo } from "react"
import { firstValueFrom } from "rxjs"
import {
	MIN_SUBTENSOR_ALPHA_STAKE,
	MIN_SUBTENSOR_ROOTNET_STAKE,
	ROOT_NETUID,
} from "@/components/widgets/staking/subtensor/constants"
import type { Account } from "@/domains/accounts/accounts"
import { getChainRuntime$ } from "@/domains/chains/chain-runtime"
import { useNativeTokenAmount, useNativeTokenDecimal } from "@/domains/chains/chains"
import { ChainContext } from "@/domains/chains/contexts"
import { useTokenAmount, useTokenAmountFromPlanck } from "@/domains/common/hooks/useTokenAmount"
import { estimateTxFee, useTx } from "@/domains/common/hooks/useTx"
import { useGetDynamicTaoStakeInfo } from "@/domains/staking/subtensor/hooks/useGetDynamicTaoStakeInfo"
import { useAmountInputState } from "@/util/amountInput"

import { setFeeEstimate } from "../breakdown"
import { placeholderCall, stakeCall, txOf, unstakeCall } from "../calls"
import type { SubtensorBalance } from "../chain"
import { unstakeError } from "../validation"
import type { StakeItem } from "./useStake"
import { useSubtensorMinimums } from "./useSubtensorMinimums"

export const useAddStakeForm = (
	account: Account,
	{ balance, existentialDeposit }: SubtensorBalance,
	stake: StakeItem | undefined,
	delegate: string | undefined,
	netuid: number | undefined
) => {
	const [input, setInput] = useAmountInputState(useNativeTokenDecimal().decimals)
	const { genesisHash } = useContext(ChainContext)
	const amount = useTokenAmount(input)

	const isRootnetStake = netuid === ROOT_NETUID

	const {
		slippage,
		isLoading: isSlippageLoading,
		error: isDynamicTaoStakeInfoError,
		expectedAlphaAmount,
		alphaPrice,
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
		alphaPrice,
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
	const nativeTokenAmount = useNativeTokenAmount()

	const [input, setInput] = useAmountInputState(useNativeTokenDecimal().decimals)
	const amount = useTokenAmount(input)
	const isRootnetStake = stake.netuid === ROOT_NETUID

	const {
		alphaToTaoSlippage: slippage,
		isLoading: isSlippageLoading,
		error: isDynamicTaoStakeInfoError,
		expectedTaoAmount,
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

	const { data: minimums } = useSubtensorMinimums()
	const taoReceived = isRootnetStake
		? amountPlanck
		: (expectedTaoAmount.decimalAmount?.planck ?? 0n)

	const error = useMemo(() => {
		if (input === "" || !available.decimalAmount || !minimums || isSlippageLoading) return

		const validationError = unstakeError({
			amount: amountPlanck,
			available: available.decimalAmount,
			taoReceived,
			minStake: nativeTokenAmount.fromPlanck(minimums.stake).decimalAmount,
			minKeep: isRootnetStake
				? minimums.nominatorStake
				: ceilDiv(
						minimums.nominatorStake * 10n ** BigInt(available.decimalAmount.decimals),
						BigMath.max(limitPrice, 1n)
					),
			nominatorMinStake: nativeTokenAmount.fromPlanck(minimums.nominatorStake).decimalAmount,
		})
		if (validationError) return validationError

		if (isDynamicTaoStakeInfoError) {
			return new Error("Failed to fetch dynamic tao stake info")
		}

		return undefined
	}, [
		amountPlanck,
		available.decimalAmount,
		input,
		isDynamicTaoStakeInfoError,
		isRootnetStake,
		isSlippageLoading,
		limitPrice,
		minimums,
		nativeTokenAmount,
		taoReceived,
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
		minimums !== undefined &&
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

const ceilDiv = (numerator: bigint, denominator: bigint) =>
	(numerator + denominator - 1n) / denominator

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
