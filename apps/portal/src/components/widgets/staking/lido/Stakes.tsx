import { useState } from "react"

import { StakePosition, StakePositionErrorBoundary } from "@/components/recipes/StakePosition"
import { AnimatedFiatNumber } from "@/components/widgets/AnimatedFiatNumber"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import { RedactableBalance } from "@/components/widgets/RedactableBalance"
import { useSelectedEvmAccounts } from "@/domains/accounts/accounts"
import { lidoSuites } from "@/domains/staking/lido/config"
import { useStakes } from "@/domains/staking/lido/core"
import type { LidoSuite } from "@/domains/staking/lido/types"

import { StakesLoading } from "../StakesLoading"
import LidoWidgetSideSheet from "./LidoWidgetSideSheet"

const IncreaseStakeSideSheet = (props: {
	onRequestDismiss: () => unknown
	lidoSuite: LidoSuite
}) => (
	<LidoWidgetSideSheet
		url={`https://stake.lido.fi?ref=${import.meta.env.VITE_LIDO_REWARDS_ADDRESS}`}
		lidoSuite={props.lidoSuite}
		onRequestDismiss={props.onRequestDismiss}
	/>
)

const UnstakeSideSheet = (props: { onRequestDismiss: () => unknown; lidoSuite: LidoSuite }) => (
	<LidoWidgetSideSheet
		url={`https://stake.lido.fi/withdrawals/request?ref=${import.meta.env.VITE_LIDO_REWARDS_ADDRESS}`}
		lidoSuite={props.lidoSuite}
		onRequestDismiss={props.onRequestDismiss}
	/>
)

const ClaimSideSheet = (props: { onRequestDismiss: () => unknown; lidoSuite: LidoSuite }) => (
	<LidoWidgetSideSheet
		url={`https://stake.lido.fi/withdrawals/claim?ref=${import.meta.env.VITE_LIDO_REWARDS_ADDRESS}`}
		lidoSuite={props.lidoSuite}
		onRequestDismiss={props.onRequestDismiss}
	/>
)

const LidoStakes = (props: { lidoSuite: LidoSuite }) => {
	const [increaseStakeSideSheetOpen, setIncreaseStakeSideSheetOpen] = useState(false)
	const [unstakeSideSheetOpen, setUnstakeSideSheetOpen] = useState(false)
	const [claimSideSheetOpen, setClaimSideSheetOpen] = useState(false)

	const { data: stakes, isLoading } = useStakes(useSelectedEvmAccounts(), props.lidoSuite)

	if (isLoading && !stakes.length) return <StakesLoading />

	const logo =
		"https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/eth.svg"

	return (
		<>
			{stakes.map((stake, index) => {
				const symbol = stake.balance.options?.currency ?? ""
				return (
					<ErrorBoundary
						key={index}
						renderFallback={() => (
							<StakePositionErrorBoundary
								chain={props.lidoSuite.chain.name}
								assetSymbol={symbol}
								assetLogoSrc={logo}
								account={stake.account}
								provider="Lido finance"
								key={index}
							/>
						)}
					>
						<StakePosition
							readonly={stake.account.readonly || !stake.account.canSignEvm}
							account={stake.account}
							provider="Lido finance"
							stakeStatus={stake.balance.planck > 0n ? "earning_rewards" : "not_earning_rewards"}
							balance={
								<ErrorBoundary renderFallback={() => <>--</>}>
									<RedactableBalance>{stake.balance.toLocaleString()}</RedactableBalance>
								</ErrorBoundary>
							}
							fiatBalance={
								<ErrorBoundary renderFallback={() => <>--</>}>
									<AnimatedFiatNumber end={stake.fiatBalance} />
								</ErrorBoundary>
							}
							chain={props.lidoSuite.chain.name}
							chainId={props.lidoSuite.chain.id}
							assetSymbol={symbol}
							assetLogoSrc={logo}
							withdrawButton={
								stake.claimable.planck > 0n && (
									<ErrorBoundary renderFallback={() => <>--</>}>
										<StakePosition.WithdrawButton
											amount={
												<RedactableBalance>{stake.claimable.toLocaleString()}</RedactableBalance>
											}
											onClick={() => setClaimSideSheetOpen(true)}
										/>
									</ErrorBoundary>
								)
							}
							increaseStakeButton={
								<ErrorBoundary renderFallback={() => <>--</>}>
									<StakePosition.IncreaseStakeButton
										onClick={() => setIncreaseStakeSideSheetOpen(true)}
									/>
								</ErrorBoundary>
							}
							unstakeButton={
								stake.balance.planck > 0n && (
									<ErrorBoundary renderFallback={() => <>--</>}>
										<StakePosition.UnstakeButton onClick={() => setUnstakeSideSheetOpen(true)} />
									</ErrorBoundary>
								)
							}
							unstakingStatus={
								stake.totalUnlocking.planck > 0n && (
									<ErrorBoundary renderFallback={() => <>--</>}>
										<StakePosition.UnstakingStatus
											amount={stake.totalUnlocking.toLocaleString()}
											unlocks={[]}
										/>
									</ErrorBoundary>
								)
							}
						/>
					</ErrorBoundary>
				)
			})}
			{increaseStakeSideSheetOpen && (
				<IncreaseStakeSideSheet
					onRequestDismiss={() => setIncreaseStakeSideSheetOpen(false)}
					lidoSuite={props.lidoSuite}
				/>
			)}
			{unstakeSideSheetOpen && (
				<UnstakeSideSheet
					onRequestDismiss={() => setUnstakeSideSheetOpen(false)}
					lidoSuite={props.lidoSuite}
				/>
			)}
			{claimSideSheetOpen && (
				<ClaimSideSheet
					onRequestDismiss={() => setClaimSideSheetOpen(false)}
					lidoSuite={props.lidoSuite}
				/>
			)}
		</>
	)
}

const Stakes = () => {
	return (
		<>
			{lidoSuites.map((lidoSuite, index) => (
				<LidoStakes key={index} lidoSuite={lidoSuite} />
			))}
		</>
	)
}

export default Stakes
