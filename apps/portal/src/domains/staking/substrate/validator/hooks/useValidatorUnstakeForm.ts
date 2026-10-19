import { bind } from "@react-rxjs/core"
import { useMemo } from "react"
import { combineLatest, map, of, switchMap } from "rxjs"

import { txFromCall } from "@/domains/chains/chain-runtime"
import {
	useTokenAmountFromPlanck,
	useTokenAmountState,
} from "@/domains/common/hooks/useTokenAmount"
import { useTx } from "@/domains/common/hooks/useTx"
import { LOADING, toLoadable } from "@/util/loadable"

import { chainRuntimes$, useGenesisHash } from "../../nominationPools/hooks/useRuntimes"
import { type UnbondAction, unbondActionCall } from "../calls"
import { watchLedger, watchMinNominatorBond } from "../chain"

const [useUnstakeFormInputs] = bind(
	(genesisHash: string, controller: string) =>
		controller === ""
			? of(LOADING)
			: toLoadable(
					chainRuntimes$(genesisHash).pipe(
						switchMap(({ runtime }) =>
							combineLatest([
								watchMinNominatorBond(runtime),
								watchLedger(runtime, controller),
							]).pipe(
								map(([minNominatorBond, ledger]) => ({
									minNominatorBond,
									active: ledger?.active ?? 0n,
								}))
							)
						)
					)
				),
	LOADING
)

export const useValidatorUnstakeForm = (controller?: string) => {
	const genesisHash = useGenesisHash()
	const inputs = useUnstakeFormInputs(genesisHash, controller ?? "")
	const ready = controller !== undefined && inputs.status === "success"
	const data = inputs.status === "success" ? inputs.data : undefined

	const unbondExtrinsic = useTx(genesisHash, (runtime, action: UnbondAction) =>
		txFromCall(runtime, unbondActionCall(action))
	)

	const [input, setAmount] = useTokenAmountState("")

	const minNeededForMembership = useTokenAmountFromPlanck(data?.minNominatorBond)
	const available = useTokenAmountFromPlanck(data?.active)

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
					`Need ${minNeededForMembership.decimalAmount?.toLocaleString()} to stay active`
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
			unbond: (controller: string, value: bigint) =>
				unbondExtrinsic.signAndSend({ address: controller }, { type: "unbond", value }),
			unbondAll: async (controller: string) => {
				if (data === undefined) throw new Error("Extrinsic not ready yet")
				return await unbondExtrinsic.signAndSend(
					{ address: controller },
					{
						type: "unbondAll",
						active: data.active,
					}
				)
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
