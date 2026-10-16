import { useContext, useEffect } from "react"
import { ClaimStakeDialog as ClaimStakeDialogComponent } from "@/components/recipes/ClaimStakeDialog"
import type { Account } from "@/domains/accounts/recoils"
import { ChainContext } from "@/domains/chains/contexts"
import { type SubmittableResultLoadable, useExtrinsic } from "@/domains/common/hooks/useExtrinsic"
import { useTokenAmountFromPlanck } from "@/domains/common/hooks/useTokenAmount"
import { type TxLoadable, useTx } from "@/domains/common/hooks/useTx"
import { usePoolStakes } from "@/domains/staking/substrate/nominationPools/hooks"

type ClaimStakeDialogProps = {
	open?: boolean
	account: Account
	onRequestDismiss: () => unknown
	onChangeClaimPayoutLoadable: (loadable: TxLoadable) => unknown
	onChangeRestakeLoadable: (loadable: SubmittableResultLoadable) => unknown
}

const ClaimStakeDialog = (props: ClaimStakeDialogProps) => {
	const pool = usePoolStakes(props.account)
	const rewards = useTokenAmountFromPlanck(pool?.pendingRewards)

	const { genesisHash } = useContext(ChainContext)
	const claimPayoutExtrinsic = useTx(genesisHash, (runtime) =>
		runtime.api.tx.NominationPools.claim_payout()
	)
	const restakeExtrinsic = useExtrinsic("nominationPools", "bondExtra", [{ Rewards: true }])

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
				void claimPayoutExtrinsic.signAndSend(props.account.address)
				props.onRequestDismiss()
			}}
			onRequestReStake={() => {
				void restakeExtrinsic.signAndSend(props.account.address)
				props.onRequestDismiss()
			}}
		/>
	)
}

export default ClaimStakeDialog
