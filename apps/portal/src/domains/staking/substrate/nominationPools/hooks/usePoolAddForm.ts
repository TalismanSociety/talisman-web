import { bind } from "@react-rxjs/core"
import { useEffect, useMemo } from "react"
import { combineLatest, from, map, switchMap } from "rxjs"

import { txFromCall } from "@/domains/chains/chain-runtime"
import {
	useTokenAmountFromPlanck,
	useTokenAmountState,
} from "@/domains/common/hooks/useTokenAmount"
import { estimateTxFee } from "@/domains/common/hooks/useTx"
import { useSearchParams } from "@/hooks/useSearchParams"
import { BigIntMath } from "@/util/BigIntMath"
import { LOADING, toLoadable } from "@/util/loadable"
import usePrevious from "@/util/usePrevious"

import { bondExtraCall, joinCall } from "../calls"
import { existentialDeposit, watchAccount, watchMinJoinBond, watchPoolMember } from "../chain"
import { chainRuntimes$, useGenesisHash } from "./useRuntimes"

const ESTIMATED_FEE_MARGIN_OF_ERROR = 0.5

export type PoolAddAction = "bondExtra" | "join"

const maxCall = (action: PoolAddAction, available: bigint) =>
	action === "bondExtra"
		? bondExtraCall(available)
		: joinCall(available, 0, "PermissionlessCompound")

const [useAddFormInputs] = bind(
	(genesisHash: string, address: string, action: PoolAddAction) =>
		toLoadable(
			chainRuntimes$(genesisHash).pipe(
				switchMap(({ runtime }) =>
					combineLatest([
						watchPoolMember(runtime, address),
						watchMinJoinBond(runtime),
						watchAccount(runtime, address).pipe(
							map(({ data }) => (data.free > data.frozen ? data.free - data.frozen : 0n))
						),
					]).pipe(
						switchMap(([poolMember, minJoinBond, available]) =>
							from(txFromCall(runtime, maxCall(action, available))).pipe(
								switchMap((tx) => estimateTxFee(genesisHash, address, tx)),
								map((fee) => ({
									points: poolMember?.points,
									minJoinBond,
									available,
									fee,
									existentialDeposit: existentialDeposit(runtime),
								}))
							)
						)
					)
				)
			)
		),
	LOADING
)

const withFeeMargin = (fee: bigint) => BigIntMath.mulNumber(fee, 1 + ESTIMATED_FEE_MARGIN_OF_ERROR)

export const usePoolAddForm = (action: PoolAddAction, account?: string) => {
	const genesisHash = useGenesisHash()
	const prevAccount = usePrevious(account)
	const inputs = useAddFormInputs(genesisHash, account ?? "", action)
	const ready = account !== undefined && inputs.status === "success"
	const data = inputs.status === "success" ? inputs.data : undefined

	const [input, setAmount] = useTokenAmountState()

	const availableBalance = useTokenAmountFromPlanck(
		useMemo(() => {
			if (!data) return undefined
			const reserve = data.existentialDeposit + withFeeMargin(data.fee)
			return data.available < reserve ? 0n : data.available - reserve
		}, [data])
	)

	const resulting = useTokenAmountFromPlanck(
		useMemo(
			() =>
				data?.points === undefined ? undefined : data.points + (input.decimalAmount?.planck ?? 0n),
			[data?.points, input.decimalAmount?.planck]
		)
	)

	const minimum = useTokenAmountFromPlanck(data?.minJoinBond)

	const error = useMemo(() => {
		if (!ready) return
		if (input.amount.trim() === "") return
		if (
			availableBalance.decimalAmount !== undefined &&
			input.decimalAmount !== undefined &&
			input.decimalAmount.planck > availableBalance.decimalAmount.planck
		) {
			return new Error("Insufficient balance")
		}
		if (
			action === "join" &&
			minimum.decimalAmount !== undefined &&
			input.decimalAmount !== undefined &&
			input.decimalAmount.planck < minimum.decimalAmount.planck
		) {
			return new Error(`Minimum ${minimum.decimalAmount.toLocaleString()} needed`)
		}
		return undefined
	}, [
		action,
		availableBalance.decimalAmount,
		ready,
		input.amount,
		input.decimalAmount,
		minimum.decimalAmount,
	])

	const [searchParams] = useSearchParams()
	const defaultAmount = useMemo(() => searchParams.get("amount"), [searchParams])

	useEffect(() => {
		if (account !== prevAccount) {
			setAmount(defaultAmount ?? "")
		}
	}, [account, defaultAmount, prevAccount, setAmount])

	useEffect(() => {
		const amount = input.amount
		const amountDec = input.decimalAmount?.toNumber()
		const available = availableBalance.decimalAmount?.toNumber()
		if (amountDec === undefined || available === undefined) return
		if (amount !== defaultAmount) return
		if (available >= amountDec) return
		setAmount(available.toString())
	}, [availableBalance.decimalAmount, defaultAmount, input.amount, input.decimalAmount, setAmount])

	return { input, availableBalance, resulting, setAmount, error, isReady: ready }
}
