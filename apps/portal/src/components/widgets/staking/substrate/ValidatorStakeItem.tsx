import type { DeriveStakingAccount } from "@polkadot/api-derive/types"
import BN from "bn.js"
import { useMemo, useState } from "react"
import { useRecoilValueLoadable, waitForAll } from "recoil"
import { StakePosition } from "@/components/recipes/StakePosition"
import { AnimatedFiatNumber } from "@/components/widgets/AnimatedFiatNumber"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import { RedactableBalance } from "@/components/widgets/RedactableBalance"
import type { Account } from "@/domains/accounts/recoils"
import { useChainState } from "@/domains/chains/hooks"
import { useNativeTokenDecimalState, useNativeTokenPriceState } from "@/domains/chains/recoils"
import { useEraEtaFormatter } from "@/domains/common/hooks/useEraEta"
import { useExtrinsic } from "@/domains/common/hooks/useExtrinsic"
import { useNativeTokenLocalizedFiatAmount } from "@/domains/common/hooks/useLocalizedFiatAmount"
import { useTotalValidatorStakingRewards } from "@/domains/staking/substrate/validator/hooks"

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

const ValidatorStakeItem = ({
	account,
	stake,
	reward,
	slashingSpan,
}: {
	account: Account
	stake: DeriveStakingAccount
	reward?: bigint
	slashingSpan: number
}) => {
	const withdrawExtrinsic = useExtrinsic("staking", "withdrawUnbonded")

	const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false)

	const { state, contents } = useRecoilValueLoadable(
		waitForAll([useChainState(), useNativeTokenDecimalState(), useNativeTokenPriceState()])
	)

	const [chain, decimal, nativeTokenPrice] = state === "hasValue" ? contents : []

	const active = decimal?.fromPlanck(stake.stakingLedger.active.toBigInt())

	const totalUnlocking = useMemo(
		() => stake.unlocking?.reduce((previous, current) => previous.add(current.value), new BN(0)),
		[stake.unlocking]
	)

	const eraEtaFormatter = useEraEtaFormatter()
	const unlocks = stake.unlocking?.map((x) => ({
		amount: decimal?.fromPlanck(x.value.toBigInt()).toLocaleString(),
		eta: eraEtaFormatter(x.remainingEras),
	}))

	const { name = "", nativeToken: { symbol, logo } = { symbol: "", logo: "" } } = chain || {}

	return (
		<>
			<StakePosition
				chain={name}
				chainId={chain?.id ?? ""}
				assetSymbol={symbol}
				assetLogoSrc={logo}
				provider="Validator staking"
				stakeStatus={
					reward === undefined
						? undefined
						: reward === 0n
							? "not_earning_rewards"
							: "earning_rewards"
				}
				readonly={account.readonly}
				account={account}
				balance={
					<ErrorBoundary renderFallback={() => <>--</>}>
						<RedactableBalance>{active?.toLocaleString()}</RedactableBalance>
					</ErrorBoundary>
				}
				fiatBalance={
					<ErrorBoundary renderFallback={() => <>--</>}>
						<AnimatedFiatNumber
							end={active && nativeTokenPrice ? active.toNumber() * nativeTokenPrice : 0}
						/>
					</ErrorBoundary>
				}
				rewards={
					<ErrorBoundary renderFallback={() => <>--</>}>
						<TotalRewards account={account} />
					</ErrorBoundary>
				}
				fiatRewards={
					<ErrorBoundary renderFallback={() => <>--</>}>
						<TotalFiatRewards account={account} />
					</ErrorBoundary>
				}
				unstakeButton={
					<ErrorBoundary renderFallback={() => <>--</>}>
						<StakePosition.UnstakeButton onClick={() => setIsUnstakeDialogOpen(true)} />
					</ErrorBoundary>
				}
				withdrawButton={
					stake.redeemable?.isZero() === false && (
						<ErrorBoundary renderFallback={() => <>--</>}>
							<StakePosition.WithdrawButton
								amount={
									<RedactableBalance>
										{decimal?.fromPlanck(stake.redeemable.toBigInt()).toLocaleString()}
									</RedactableBalance>
								}
								onClick={() => {
									void withdrawExtrinsic.signAndSend(stake.controllerId ?? "", slashingSpan)
								}}
								loading={withdrawExtrinsic.state === "loading"}
							/>
						</ErrorBoundary>
					)
				}
				unstakingStatus={
					<ErrorBoundary renderFallback={() => <>--</>}>
						{totalUnlocking?.isZero() === false ? (
							<StakePosition.UnstakingStatus
								amount={
									<RedactableBalance>
										{decimal?.fromPlanck(totalUnlocking.toString()).toLocaleString()}
									</RedactableBalance>
								}
								unlocks={unlocks ?? []}
							/>
						) : undefined}
					</ErrorBoundary>
				}
			/>
			<ValidatorUnstakeDialog
				accountAddress={stake.controllerId?.toString() ?? account.address}
				open={isUnstakeDialogOpen}
				onRequestDismiss={() => setIsUnstakeDialogOpen(false)}
			/>
		</>
	)
}

export default ValidatorStakeItem
