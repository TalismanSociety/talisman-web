import { Link } from "@tanstack/react-router"
import type { PropsWithChildren } from "react"
import { Fragment, Suspense } from "react"
import { SectionHeader } from "@/components/molecules/SectionHeader"
import { StakePosition, StakePositionList } from "@/components/recipes/StakePosition"
import { AnimatedFiatNumber } from "@/components/widgets/AnimatedFiatNumber"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import { useNominationPoolsEnabledChains } from "@/domains/chains/chains"
import { ChainProvider } from "@/domains/chains/provider"
import { useTotalStaked } from "@/domains/staking/hooks"
import { Button } from "@/ui/atoms/Button"
import { Text } from "@/ui/atoms/Text"
import { HiddenDetails } from "@/ui/molecules/HiddenDetails"

import DappStakes from "./dappStaking/Stakes"
import LidoStakes from "./lido/Stakes"
import SeekStakes from "./providers/seek/SeekStakes"
import { StakesLoading, StakesLoadingSkeleton } from "./StakesLoading"
import PoolStakes from "./substrate/PoolStakes"
import ValidatorStakes from "./substrate/ValidatorStakes"
import SubtensorStakes from "./subtensor/Stakes"

const NoStakePrompt = (props: { className?: string }) => (
	<div className={props.className}>
		<HiddenDetails
			hidden
			overlay={
				<div
					css={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: "3.2rem",
					}}
				>
					<Text.Body>You have no staked assets yet...</Text.Body>
					<Button as={Link} variant="outlined" to="/staking">
						Get started
					</Button>
				</div>
			}
		>
			<section css={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
				<StakePosition.Skeleton animate={false} />
				<StakePosition.Skeleton animate={false} />
			</section>
		</HiddenDetails>
	</div>
)

const StakeTotal = () => <AnimatedFiatNumber end={useTotalStaked()} />

const StakeHeader = () => {
	return (
		<SectionHeader
			headlineContent="Staking"
			supportingContent={
				<ErrorBoundary>
					<Suspense>
						<StakeTotal />
					</Suspense>
				</ErrorBoundary>
			}
		/>
	)
}

const LoadingSuspense = (props: PropsWithChildren) => (
	<Suspense fallback={<StakesLoading />} {...props} />
)

const Stakes = (props: { hideHeader?: boolean }) => {
	const chains = useNominationPoolsEnabledChains()

	return (
		<div id="staking">
			{!props.hideHeader && <StakeHeader />}
			<StakePositionList>
				<StakesLoadingSkeleton>
					<ErrorBoundary orientation="horizontal">
						<LoadingSuspense>
							<SeekStakes />
						</LoadingSuspense>
					</ErrorBoundary>

					{chains.map((chain, index) => {
						return (
							<Fragment key={index}>
								<ChainProvider chain={chain}>
									<ErrorBoundary orientation="horizontal">
										<LoadingSuspense>
											<PoolStakes />
										</LoadingSuspense>
									</ErrorBoundary>
									<ErrorBoundary orientation="horizontal">
										<LoadingSuspense>
											<ValidatorStakes />
										</LoadingSuspense>
									</ErrorBoundary>
								</ChainProvider>
							</Fragment>
						)
					})}
					<ErrorBoundary orientation="horizontal">
						<LoadingSuspense>
							<SubtensorStakes />
						</LoadingSuspense>
					</ErrorBoundary>
					<ErrorBoundary orientation="horizontal">
						<LoadingSuspense>
							<DappStakes />
						</LoadingSuspense>
					</ErrorBoundary>
					<ErrorBoundary orientation="horizontal">
						<LoadingSuspense>
							<LidoStakes />
						</LoadingSuspense>
					</ErrorBoundary>
				</StakesLoadingSkeleton>
				<NoStakePrompt css={{ display: "none", ":only-child": { display: "revert" } }} />
			</StakePositionList>
		</div>
	)
}

export default Stakes
