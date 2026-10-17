import { useState } from "react"
import { StakePosition } from "@/components/recipes/StakePosition"
import { AnimatedFiatNumber } from "@/components/widgets/AnimatedFiatNumber"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import { RedactableBalance } from "@/components/widgets/RedactableBalance"
import type { Account } from "@/domains/accounts/accounts"
import { txFromCall } from "@/domains/chains/chain-runtime"
import { useChain, useNativeTokenDecimal, useNativeTokenPrice } from "@/domains/chains/chains"
import { useNativeTokenLocalizedFiatAmount } from "@/domains/common/hooks/useLocalizedFiatAmount"
import { useTx } from "@/domains/common/hooks/useTx"
import { useEraEtaFormatter } from "@/domains/staking/substrate/nominationPools/hooks/useEraEta"
import { useGenesisHash } from "@/domains/staking/substrate/nominationPools/hooks/useRuntimes"
import { withdrawUnbondedCall } from "@/domains/staking/substrate/validator/calls"
import { useTotalValidatorStakingRewards } from "@/domains/staking/substrate/validator/hooks/useTotalRewards"
import type { ValidatorStake } from "@/domains/staking/substrate/validator/hooks/useValidatorStakes"

import ValidatorUnstakeDialog from "./ValidatorUnstakeDialog"

const TotalRewards = ({ account }: { account: Account }) => {
	const { totalRewards, isError } = useTotalValidatorStakingRewards(account)
	if (isError) return "--"

	return totalRewards.toLocaleString()
}

const TotalFiatRewards = ({ account }: { account: Account }) => {
	const { totalRewards, isError } = useTotalValidatorStakingRewards(account)
	const totalFiatRewards = useNativeTokenLocalizedFiatAmount(totalRewards)
	if (isError) return null

	return totalFiatRewards
}

const ValidatorStakeItem = ({ stake }: { stake: ValidatorStake }) => {
	const chain = useChain()
	const decimal = useNativeTokenDecimal()
	const nativeTokenPrice = useNativeTokenPrice()
	const genesisHash = useGenesisHash()
	const withdrawExtrinsic = useTx(genesisHash, (runtime) =>
		txFromCall(runtime, withdrawUnbondedCall(stake.slashingSpan))
	)

	const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false)

	const active = decimal.fromPlanck(stake.active)

	const eraEtaFormatter = useEraEtaFormatter()
	const unlocks = stake.unlocking.map((x) => ({
		amount: decimal.fromPlanck(x.value).toLocaleString(),
		eta: eraEtaFormatter(x.remainingEras),
	}))

	const { name = "", nativeToken: { symbol, logo } = { symbol: "", logo: "" } } = chain

	return (
		<>
			<StakePosition
				chain={name}
				chainId={chain.id ?? ""}
				assetSymbol={symbol}
				assetLogoSrc={logo}
				provider="Validator staking"
				stakeStatus={stake.status}
				readonly={stake.account.readonly}
				account={stake.account}
				balance={
					<ErrorBoundary renderFallback={() => <>--</>}>
						<RedactableBalance>{active.toLocaleString()}</RedactableBalance>
					</ErrorBoundary>
				}
				fiatBalance={
					<ErrorBoundary renderFallback={() => <>--</>}>
						<AnimatedFiatNumber end={nativeTokenPrice ? active.toNumber() * nativeTokenPrice : 0} />
					</ErrorBoundary>
				}
				rewards={
					<ErrorBoundary renderFallback={() => <>--</>}>
						<TotalRewards account={stake.account} />
					</ErrorBoundary>
				}
				fiatRewards={
					<ErrorBoundary renderFallback={() => <>--</>}>
						<TotalFiatRewards account={stake.account} />
					</ErrorBoundary>
				}
				unstakeButton={
					<ErrorBoundary renderFallback={() => <>--</>}>
						<StakePosition.UnstakeButton onClick={() => setIsUnstakeDialogOpen(true)} />
					</ErrorBoundary>
				}
				withdrawButton={
					stake.redeemable > 0n && (
						<ErrorBoundary renderFallback={() => <>--</>}>
							<StakePosition.WithdrawButton
								amount={
									<RedactableBalance>
										{decimal.fromPlanck(stake.redeemable).toLocaleString()}
									</RedactableBalance>
								}
								onClick={() => {
									void withdrawExtrinsic.signAndSend(stake.controller)
								}}
								loading={withdrawExtrinsic.state === "loading"}
							/>
						</ErrorBoundary>
					)
				}
				unstakingStatus={
					<ErrorBoundary renderFallback={() => <>--</>}>
						{stake.totalUnlocking > 0n ? (
							<StakePosition.UnstakingStatus
								amount={
									<RedactableBalance>
										{decimal.fromPlanck(stake.totalUnlocking).toLocaleString()}
									</RedactableBalance>
								}
								unlocks={unlocks}
							/>
						) : undefined}
					</ErrorBoundary>
				}
			/>
			<ValidatorUnstakeDialog
				controller={stake.controller}
				open={isUnstakeDialogOpen}
				onRequestDismiss={() => setIsUnstakeDialogOpen(false)}
			/>
		</>
	)
}

export default ValidatorStakeItem
