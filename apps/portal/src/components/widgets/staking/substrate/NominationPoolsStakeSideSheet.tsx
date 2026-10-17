import { Suspense, useState, useTransition } from "react"
import { StakeDialog as StakeDialogComponent } from "@/components/recipes/StakeDialog"
import { StakeForm } from "@/components/recipes/StakeForm"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import type { ChainInfo } from "@/domains/chains/chains"
import { useNominationPoolsEnabledChains } from "@/domains/chains/chains"
import { ChainProvider } from "@/domains/chains/provider"
import { useApr } from "@/domains/staking/substrate/nominationPools/hooks"
import { useEraEtaFormatter } from "@/domains/staking/substrate/nominationPools/hooks/useEraEta"
import { useSearchParams } from "@/hooks/useSearchParams"
import { CircularProgressIndicator } from "@/ui/atoms/CircularProgressIndicator"

import { AssetSelect, ControlledStakeForm } from "./StakeForm"

const Rewards = () => (
	<>{useApr().toLocaleString(undefined, { style: "percent", maximumFractionDigits: 2 })}</>
)

const EraEta = () => {
	return <>{useEraEtaFormatter()(1)}</>
}

const InnerStakeDialog = () => {
	const [searchParams, setSearchParams] = useSearchParams()

	const open =
		searchParams.get("action") === "stake" && searchParams.get("type") === "nomination-pools"
	const initialChain = searchParams.get("chain")
	const account = searchParams.get("account") ?? undefined

	const chains = useNominationPoolsEnabledChains()
	const [chain, setChain] = useState<ChainInfo | undefined>(
		chains.find((x) => x.id === initialChain) ?? chains[0]
	)

	const [inTransition, startTransition] = useTransition()

	if (!open) {
		return null
	}

	if (chain === undefined) {
		throw new Error(`Missing chain configs`)
	}

	return (
		<ChainProvider chain={chain}>
			<StakeDialogComponent
				open={open}
				onRequestDismiss={() =>
					setSearchParams((sp) => {
						sp.delete("action")
						sp.delete("type")
						sp.delete("chain")
						sp.delete("account")
						return sp
					})
				}
				stats={
					<ErrorBoundary>
						<StakeDialogComponent.Stats>
							<StakeDialogComponent.Stats.Item
								overlineContent="Rewards"
								headlineContent={
									<Suspense fallback={<CircularProgressIndicator size="1em" />}>
										<Rewards />
									</Suspense>
								}
							/>
							<StakeDialogComponent.Stats.Item
								overlineContent="Current era ends"
								headlineContent={
									<Suspense fallback={<CircularProgressIndicator size="1em" />}>
										<EraEta />
									</Suspense>
								}
							/>
						</StakeDialogComponent.Stats>
					</ErrorBoundary>
				}
				stakeInput={
					<ErrorBoundary>
						<Suspense fallback={<StakeForm.Skeleton />}>
							<ControlledStakeForm
								account={account}
								assetSelector={
									<AssetSelect
										chains={chains}
										selectedChain={chain}
										onSelectChain={(chain) => startTransition(() => setChain(chain))}
										inTransition={inTransition}
									/>
								}
							/>
						</Suspense>
					</ErrorBoundary>
				}
				learnMoreAnchor={
					<StakeDialogComponent.LearnMore
						href="https://docs.talisman.xyz/talisman/navigating-the-paraverse/using-the-talisman-portal/one-click-staking"
						target="_blank"
					/>
				}
			/>
		</ChainProvider>
	)
}

// TODO: Clean this up
// we use a wrapper component to reset the dialog state on close
// this is right now the safest change
const NominationPoolsStakeSideSheet = () => {
	const [searchParams] = useSearchParams()
	const open = searchParams.get("action") === "stake"

	if (!open) {
		return null
	}

	return <InnerStakeDialog />
}

export default NominationPoolsStakeSideSheet
