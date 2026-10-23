import { bind } from "@react-rxjs/core"
import { useMemo } from "react"
import { combineLatest, map, switchMap } from "rxjs"

import { txFromCall } from "@/domains/chains/chain-runtime"
import {
	useTokenAmountFromPlanck,
	useTokenAmountState,
} from "@/domains/common/hooks/useTokenAmount"
import { useTx } from "@/domains/common/hooks/useTx"
import type { Signer } from "@/domains/extension/signer"
import { LOADING, toLoadable } from "@/util/loadable"

import { unbondCall } from "../calls"
import { watchMinJoinBond, watchPoolMember } from "../chain"
import { chainRuntimes$, useGenesisHash } from "./useRuntimes"

const [useUnstakeFormInputs] = bind(
	(genesisHash: string, address: string) =>
		toLoadable(
			chainRuntimes$(genesisHash).pipe(
				switchMap(({ runtime }) =>
					combineLatest([watchMinJoinBond(runtime), watchPoolMember(runtime, address)]).pipe(
						map(([minJoinBond, poolMember]) => ({ minJoinBond, points: poolMember?.points ?? 0n }))
					)
				)
			)
		),
	LOADING
)

export const usePoolUnstakeForm = (account?: string) => {
	const genesisHash = useGenesisHash()
	const inputs = useUnstakeFormInputs(genesisHash, account ?? "")
	const ready = account !== undefined && inputs.status === "success"
	const data = inputs.status === "success" ? inputs.data : undefined

	const unbondExtrinsic = useTx(genesisHash, (runtime, member: string, points: bigint) =>
		txFromCall(runtime, unbondCall(member, points))
	)

	const [input, setAmount] = useTokenAmountState()

	const minNeededForMembership = useTokenAmountFromPlanck(data?.minJoinBond)
	const available = useTokenAmountFromPlanck(data?.points)

	const resulting = useTokenAmountFromPlanck(
		useMemo(
			() =>
				available.decimalAmount === undefined || input.decimalAmount === undefined
					? undefined
					: available.decimalAmount.planck - input.decimalAmount.planck,
			[available.decimalAmount, input.decimalAmount]
		)
	)

	const isLeaving = useMemo(
		() =>
			input.decimalAmount !== undefined &&
			available.decimalAmount !== undefined &&
			input.decimalAmount.toString() === input.amount &&
			input.decimalAmount.toString() === available.decimalAmount.toString(),
		[available.decimalAmount, input.amount, input.decimalAmount]
	)

	const error = useMemo(() => {
		if (!ready) return
		if (!isLeaving) {
			if (
				available.decimalAmount !== undefined &&
				input.decimalAmount !== undefined &&
				input.decimalAmount.planck > available.decimalAmount.planck
			) {
				return new Error("Insufficient balance")
			}
			if (
				available.decimalAmount !== undefined &&
				input.decimalAmount !== undefined &&
				input.decimalAmount.planck !== available.decimalAmount.planck &&
				minNeededForMembership.decimalAmount !== undefined &&
				available.decimalAmount.planck - input.decimalAmount.planck <
					minNeededForMembership.decimalAmount.planck
			) {
				return new Error(
					`Need ${minNeededForMembership.decimalAmount?.toLocaleString()} to stay in pool`
				)
			}
		}
		return undefined
	}, [
		available.decimalAmount,
		input.decimalAmount,
		isLeaving,
		minNeededForMembership.decimalAmount,
		ready,
	])

	return {
		extrinsic: {
			...unbondExtrinsic,
			unbondMax: async (signer: Signer) => {
				if (data === undefined || account === undefined) throw new Error("Extrinsic not ready yet")
				return await unbondExtrinsic.signAndSend(signer, account, data.points)
			},
		},
		input,
		available,
		resulting,
		setAmount,
		error,
		isLeaving,
		isReady: ready,
	}
}
