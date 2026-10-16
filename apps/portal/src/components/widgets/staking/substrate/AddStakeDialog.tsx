import { NominationPoolsAddStakeDialog } from "@/components/recipes/AddStakeDialog"
import { txFromCall } from "@/domains/chains/chain-runtime"
import { useTxInBlockOrErrorEffect } from "@/domains/common/hooks/useExtrinsicEffect"
import { useTx } from "@/domains/common/hooks/useTx"
import { bondExtraCall } from "@/domains/staking/substrate/nominationPools/calls"
import { usePoolAddForm } from "@/domains/staking/substrate/nominationPools/hooks"
import { useGenesisHash } from "@/domains/staking/substrate/nominationPools/hooks/useRuntimes"

const AddStakeDialog = (props: { account?: string; onDismiss: () => unknown }) => {
	const {
		isReady,
		input: { amount, decimalAmount, localizedFiatAmount },
		availableBalance,
		resulting,
		setAmount,
		error: inputError,
	} = usePoolAddForm("bondExtra", props.account)

	const genesisHash = useGenesisHash()
	const bondExtraExtrinsic = useTx(genesisHash, (runtime) =>
		txFromCall(runtime, bondExtraCall(decimalAmount?.planck ?? 0n))
	)

	useTxInBlockOrErrorEffect(() => {
		props.onDismiss()
	}, bondExtraExtrinsic)

	return (
		<NominationPoolsAddStakeDialog
			isError={inputError !== undefined}
			open={props.account !== undefined}
			availableToStake={availableBalance.decimalAmount?.toLocaleString() ?? "..."}
			amount={amount}
			onChangeAmount={setAmount}
			fiatAmount={localizedFiatAmount ?? ""}
			newAmount={resulting.decimalAmount?.toLocaleString() ?? "..."}
			newFiatAmount={resulting.localizedFiatAmount ?? "..."}
			inputSupportingText={inputError?.message}
			onDismiss={props.onDismiss}
			onConfirm={async () =>
				await bondExtraExtrinsic.signAndSend(props.account ?? "").finally(() => props.onDismiss())
			}
			onRequestMaxAmount={() => {
				if (availableBalance.decimalAmount !== undefined) {
					setAmount(availableBalance.decimalAmount?.toString())
				}
			}}
			confirmState={
				!isReady ||
				inputError !== undefined ||
				decimalAmount === undefined ||
				decimalAmount.planck === 0n
					? "disabled"
					: bondExtraExtrinsic.state === "loading"
						? "pending"
						: undefined
			}
		/>
	)
}

export default AddStakeDialog
