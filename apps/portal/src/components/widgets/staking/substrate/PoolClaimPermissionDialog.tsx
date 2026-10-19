import { useState } from "react"
import { combineLatest, switchMap } from "rxjs"
import {
	PoolClaimPermissionDialog as PoolClaimPermissionDialogComponent,
	PoolClaimPermissionForm as PoolClaimPermissionFormComponent,
} from "@/components/recipes/PoolClaimPermissionForm"
import type { SignerAccount } from "@/domains/accounts/accounts"
import { txFromCall } from "@/domains/chains/chain-runtime"
import { useChain } from "@/domains/chains/chains"
import { assertChain } from "@/domains/chains/utils"
import { useTxInBlockOrErrorEffect } from "@/domains/common/hooks/useExtrinsicEffect"
import { useTx } from "@/domains/common/hooks/useTx"
import {
	type ClaimPermission,
	setClaimPermissionCall,
} from "@/domains/staking/substrate/nominationPools/calls"
import {
	watchClaimPermission,
	watchPoolMember,
} from "@/domains/staking/substrate/nominationPools/chain"
import {
	chainRuntimes$,
	useGenesisHash,
} from "@/domains/staking/substrate/nominationPools/hooks/useRuntimes"
import { bindSuspended } from "@/util/loadable"

type PoolClaimPermissionDialogProps = {
	account: SignerAccount
	onRequestDismiss: () => unknown
}

export const toUiPermission = (permission: ClaimPermission) => {
	switch (permission) {
		case "Permissioned":
			return undefined
		case "PermissionlessCompound":
			return "compound" as const
		case "PermissionlessWithdraw":
			return "withdraw" as const
		case "PermissionlessAll":
			return "all" as const
	}
}

const toSubstratePermission = (
	permission: "compound" | "withdraw" | "all" | undefined
): ClaimPermission => {
	switch (permission) {
		case undefined:
			return "Permissioned"
		case "compound":
			return "PermissionlessCompound"
		case "withdraw":
			return "PermissionlessWithdraw"
		case "all":
			return "PermissionlessAll"
	}
}

const [useMemberClaimPermission] = bindSuspended((genesisHash: string, address: string) =>
	chainRuntimes$(genesisHash).pipe(
		switchMap(({ runtime }) =>
			combineLatest([watchPoolMember(runtime, address), watchClaimPermission(runtime, address)])
		)
	)
)

const PoolClaimPermissionForm = (props: {
	account: SignerAccount
	onRequestDismiss: () => unknown
}) => {
	const chain = useChain()

	assertChain(chain, { hasNominationPools: true })

	const genesisHash = useGenesisHash()
	const [poolMember, claimPermission] = useMemberClaimPermission(genesisHash, props.account.address)

	const [permission, setPermission] = useState<ClaimPermission>(claimPermission.type)

	const extrinsic = useTx(genesisHash, (runtime) =>
		txFromCall(runtime, setClaimPermissionCall(permission))
	)

	useTxInBlockOrErrorEffect(() => {
		props.onRequestDismiss()
	}, extrinsic)

	return (
		<PoolClaimPermissionFormComponent
			permission={toUiPermission(permission)}
			onChangePermission={(x) => setPermission(toSubstratePermission(x))}
			onSubmit={() => {
				void extrinsic.signAndSend(props.account)
			}}
			submitPending={extrinsic.state === "loading"}
			isTalismanPool={
				poolMember !== undefined && (chain.talismanPools?.includes(poolMember.pool_id) ?? false)
			}
		/>
	)
}

const PoolClaimPermissionDialog = (props: PoolClaimPermissionDialogProps) => (
	<PoolClaimPermissionDialogComponent onRequestDismiss={props.onRequestDismiss}>
		<PoolClaimPermissionForm account={props.account} onRequestDismiss={props.onRequestDismiss} />
	</PoolClaimPermissionDialogComponent>
)

type PoolClaimPermissionControlledDialogProps = {
	permission: ClaimPermission
	onChangePermission: (permission: ClaimPermission) => unknown
	poolId?: number
	onRequestDismiss: () => unknown
}

export const PoolClaimPermissionControlledDialog = (
	props: PoolClaimPermissionControlledDialogProps
) => {
	const chain = useChain()

	assertChain(chain, { hasNominationPools: true })

	const [permission, setPermission] = useState<ClaimPermission>(props.permission)

	return (
		<PoolClaimPermissionDialogComponent onRequestDismiss={props.onRequestDismiss}>
			<PoolClaimPermissionFormComponent
				permission={toUiPermission(permission)}
				onChangePermission={(x) => setPermission(toSubstratePermission(x))}
				onSubmit={() => {
					props.onChangePermission(permission)
					props.onRequestDismiss()
				}}
				isTalismanPool={
					props.poolId !== undefined && (chain.talismanPools?.includes(props.poolId) ?? false)
				}
			/>
		</PoolClaimPermissionDialogComponent>
	)
}

export default PoolClaimPermissionDialog
