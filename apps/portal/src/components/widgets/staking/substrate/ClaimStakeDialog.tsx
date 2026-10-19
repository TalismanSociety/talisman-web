import { useEffect } from "react"
import { ClaimStakeDialog as ClaimStakeDialogComponent } from "@/components/recipes/ClaimStakeDialog"
import type { SignerAccount } from "@/domains/accounts/accounts"
import { txFromCall } from "@/domains/chains/chain-runtime"
import { useTokenAmountFromPlanck } from "@/domains/common/hooks/useTokenAmount"
import { type TxLoadable, useTx } from "@/domains/common/hooks/useTx"
import { bondRewardsCall, claimPayoutCall } from "@/domains/staking/substrate/nominationPools/calls"
import { usePoolStakes } from "@/domains/staking/substrate/nominationPools/hooks"
import { useGenesisHash } from "@/domains/staking/substrate/nominationPools/hooks/useRuntimes"

type ClaimStakeDialogProps = {
	open?: boolean
	account: SignerAccount
	onRequestDismiss: () => unknown
	onChangeClaimPayoutLoadable: (loadable: TxLoadable) => unknown
	onChangeRestakeLoadable: (loadable: TxLoadable) => unknown
}

const ClaimStakeDialog = (props: ClaimStakeDialogProps) => {
	const pool = usePoolStakes(props.account)
	const rewards = useTokenAmountFromPlanck(pool?.pendingRewards)

	const genesisHash = useGenesisHash()
	const claimPayoutExtrinsic = useTx(genesisHash, (runtime) =>
		txFromCall(runtime, claimPayoutCall())
	)
	const restakeExtrinsic = useTx(genesisHash, (runtime) => txFromCall(runtime, bondRewardsCall()))

	useEffect(() => {
		props.onChangeClaimPayoutLoadable(claimPayoutExtrinsic)
	}, [claimPayoutExtrinsic, props])

	useEffect(() => {
		props.onChangeRestakeLoadable(restakeExtrinsic)
	}, [props, restakeExtrinsic])

	return (
		<ClaimStakeDialogComponent
			open={props.open}
			amount={rewards.decimalAmount?.toLocaleString() ?? "..."}
			fiatAmount={rewards.localizedFiatAmount ?? "..."}
			onRequestDismiss={props.onRequestDismiss}
			onRequestClaim={() => {
				void claimPayoutExtrinsic.signAndSend(props.account)
				props.onRequestDismiss()
			}}
			onRequestReStake={() => {
				void restakeExtrinsic.signAndSend(props.account)
				props.onRequestDismiss()
			}}
		/>
	)
}

export default ClaimStakeDialog
