import { formatDistance } from "date-fns"
import { useState } from "react"
import { UnstakeDialog as UnstakeDialogComponent } from "@/components/recipes/UnstakeDialog"
import type { Account } from "@/domains/accounts/recoils"
import type { SmartContract } from "@/domains/chains/portal-runtime"
import { useTxInBlockOrErrorEffect } from "@/domains/common/hooks/useExtrinsicEffect"
import { useUnstakeForm } from "@/domains/staking/dappStaking/hooks/forms"
import type { Stake } from "@/domains/staking/dappStaking/hooks/useStake"
import { CircularProgressIndicator } from "@/ui/atoms/CircularProgressIndicator"

import useUnlockDuration from "../providers/hooks/dapp/useUnlockDuration"
import DappPickerDialog from "./DappPickerDialog"

type DappUnstakeDialogProps = {
	account: Account
	stake: Stake
	dapp: SmartContract
	onRequestDismiss: () => void
}

const DappUnstakeDialog = (props: DappUnstakeDialogProps) => {
	const { input, setAmount, available, resulting, error, extrinsic, ready } = useUnstakeForm(
		props.account,
		props.stake,
		props.dapp
	)

	useTxInBlockOrErrorEffect(() => props.onRequestDismiss(), extrinsic)

	return (
		<UnstakeDialogComponent
			confirmState={extrinsic.state === "loading" ? "pending" : !ready ? "disabled" : undefined}
			isError={error !== undefined}
			availableAmount={available.decimalAmount.toLocaleString()}
			amount={input.amount}
			onChangeAmount={setAmount}
			onRequestMaxAmount={() => setAmount(available.decimalAmount.toString())}
			fiatAmount={input.localizedFiatAmount ?? ""}
			newAmount={
				resulting.decimalAmount?.toLocaleString() ?? <CircularProgressIndicator size="1em" />
			}
			newFiatAmount={resulting.localizedFiatAmount ?? <CircularProgressIndicator size="1em" />}
			onConfirm={() => {
				void extrinsic.signAndSend(props.account.address)
			}}
			inputSupportingText={error?.message}
			onDismiss={props.onRequestDismiss}
			lockDuration={formatDistance(0, useUnlockDuration())}
		/>
	)
}

type MultiDappsUnstakeDialogProps = {
	account: Account
	stake: Stake
	onRequestDismiss: () => void
}

const MultiDappUnstakeDialog = (props: MultiDappsUnstakeDialogProps) => {
	const [dapp, setDapp] = useState<SmartContract>()

	return dapp === undefined ? (
		<DappPickerDialog
			title="Select a DApp to unstake from"
			stake={props.stake}
			onSelect={setDapp}
			onRequestDismiss={props.onRequestDismiss}
		/>
	) : (
		<DappUnstakeDialog
			account={props.account}
			stake={props.stake}
			dapp={dapp}
			onRequestDismiss={props.onRequestDismiss}
		/>
	)
}

type UnstakeDialogProps = {
	account: Account
	stake: Stake
	onRequestDismiss: () => void
}

const UnstakeDialog = (props: UnstakeDialogProps) => {
	if (props.stake.dapps.length === 1) {
		return (
			<DappUnstakeDialog
				account={props.account}
				stake={props.stake}
				dapp={props.stake.dapps.at(0)?.[0]!}
				onRequestDismiss={props.onRequestDismiss}
			/>
		)
	}

	if (props.stake.dapps.length > 1) {
		return (
			<MultiDappUnstakeDialog
				account={props.account}
				stake={props.stake}
				onRequestDismiss={props.onRequestDismiss}
			/>
		)
	}

	return null
}

export default UnstakeDialog
