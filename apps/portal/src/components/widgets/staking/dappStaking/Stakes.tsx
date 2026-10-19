import { useNavigate } from "@tanstack/react-router"
import { formatDistance } from "date-fns"
import { useState, useTransition } from "react"
import { DappStakingLockedAmountDialog } from "@/components/recipes/DappStakingLockedAmountDialog"
import { StakePosition, StakePositionErrorBoundary } from "@/components/recipes/StakePosition"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import type { Account } from "@/domains/accounts/accounts"
import { useSelectedSubstrateAccounts } from "@/domains/accounts/accounts"
import { useChain, useDappStakingEnabledChainsLoadable } from "@/domains/chains/chains"
import { ChainProvider } from "@/domains/chains/provider"
import { useNativeTokenLocalizedFiatAmount } from "@/domains/common/hooks/useLocalizedFiatAmount"
import { usePreloadRegisteredDapps } from "@/domains/staking/dappStaking/dapps"
import { useStakeLoadable } from "@/domains/staking/dappStaking/hooks/useStake"
import {
	useClaimAllRewardsTx,
	useUnlockTx,
	useWithdrawUnbondedTx,
} from "@/domains/staking/dappStaking/hooks/useStakeTxs"
import { useTotalDappStakingRewards } from "@/domains/staking/dappStaking/hooks/useTotalRewards"
import { loadableData } from "@/util/loadable"

import useUnlockDuration from "../providers/hooks/dapp/useUnlockDuration"
import AddStakeDialog from "./AddStakeDialog"
import UnstakeDialog from "./UnstakeDialog"

const TotalRewards = (props: { account: Account }) =>
	useTotalDappStakingRewards(props.account).toLocaleString()

const TotalFiatRewards = (props: { account: Account }) =>
	useNativeTokenLocalizedFiatAmount(useTotalDappStakingRewards(props.account))

const Stake = ({
	account,
	setShouldRenderLoadingSkeleton,
}: {
	account: Account
	setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const [addStakeDialogOpen, setAddStakeDialogOpen] = useState(false)
	const [unstakeDialogOpen, setUnstakeDialogOpen] = useState(false)
	const [lockedDialogOpen, setLockedDialogOpen] = useState(false)

	usePreloadRegisteredDapps()

	const navigate = useNavigate()

	const chain = useChain()
	const { data: stake, isLoading } = useStakeLoadable(account)

	const claimAllRewardsExtrinsic = useClaimAllRewardsTx()
	const withdrawExtrinsic = useWithdrawUnbondedTx()
	const unlockExtrinsic = useUnlockTx()

	const [requestReStakeInTransition, startRequestRestakeTransition] = useTransition()
	const unlockDuration = formatDistance(0, useUnlockDuration())

	const { name = "", nativeToken: { symbol, logo } = { symbol: "", logo: "" } } = chain || {}

	if (stake?.active || !isLoading) {
		setShouldRenderLoadingSkeleton(false)
	}

	if (!stake?.active) {
		return null
	}

	const { amounts } = stake

	return (
		<>
			<StakePosition
				readonly={account.readonly}
				chain={name}
				chainId={chain.id}
				assetSymbol={symbol}
				assetLogoSrc={logo}
				account={account}
				provider="DApp staking"
				stakeStatus={stake.earningRewards ? "earning_rewards" : "not_earning_rewards"}
				balance={
					<ErrorBoundary renderFallback={() => <>--</>}>
						{amounts.totalStaked.decimalAmount?.toLocaleString()}
					</ErrorBoundary>
				}
				fiatBalance={
					<ErrorBoundary renderFallback={() => <>--</>}>
						{amounts.totalStaked.localizedFiatAmount}
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
				increaseStakeButton={
					stake.dapps.length > 0 && (
						<ErrorBoundary renderFallback={() => <>--</>}>
							<StakePosition.IncreaseStakeButton
								onClick={() => setAddStakeDialogOpen(true)}
								withTransition
							/>
						</ErrorBoundary>
					)
				}
				unstakeButton={
					stake.dapps.length > 0 && (
						<ErrorBoundary renderFallback={() => <>--</>}>
							<StakePosition.UnstakeButton
								onClick={() => setUnstakeDialogOpen(true)}
								withTransition
							/>
						</ErrorBoundary>
					)
				}
				lockedButton={
					(amounts.locked.decimalAmount?.planck ?? 0n) > 0n && (
						<ErrorBoundary renderFallback={() => <>--</>}>
							<StakePosition.LockedButton
								loading={unlockExtrinsic.state === "loading"}
								amount={amounts.locked.decimalAmount?.toLocaleString()}
								onClick={() => setLockedDialogOpen(true)}
							/>
						</ErrorBoundary>
					)
				}
				claimButton={
					(amounts.totalRewards.decimalAmount?.planck ?? 0n) > 0n && (
						<ErrorBoundary renderFallback={() => <>--</>}>
							<StakePosition.ClaimButton
								loading={claimAllRewardsExtrinsic.state === "loading"}
								amount={amounts.totalRewards.decimalAmount?.toLocaleString()}
								onClick={() => {
									void claimAllRewardsExtrinsic.signAndSend(account, stake)
								}}
							/>
						</ErrorBoundary>
					)
				}
				withdrawButton={
					(amounts.withdrawable.decimalAmount?.planck ?? 0n) > 0n && (
						<ErrorBoundary renderFallback={() => <>--</>}>
							<StakePosition.WithdrawButton
								loading={withdrawExtrinsic.state === "loading"}
								amount={amounts.withdrawable.decimalAmount?.toLocaleString()}
								onClick={() => {
									void withdrawExtrinsic.signAndSend(account)
								}}
							/>
						</ErrorBoundary>
					)
				}
				unstakingStatus={
					stake.unlocking.length > 0 && (
						<ErrorBoundary renderFallback={() => <>--</>}>
							<StakePosition.UnstakingStatus
								amount={amounts.totalUnlocking.decimalAmount?.toLocaleString()}
								unlocks={stake.unlocking.map((x) => ({
									amount: x.amount.decimalAmount?.toLocaleString(),
									eta: x.eta,
								}))}
							/>
						</ErrorBoundary>
					)
				}
			/>
			{addStakeDialogOpen && (
				<AddStakeDialog
					account={account}
					stake={stake}
					onRequestDismiss={() => setAddStakeDialogOpen(false)}
				/>
			)}
			{unstakeDialogOpen && (
				<UnstakeDialog
					account={account}
					stake={stake}
					onRequestDismiss={() => setUnstakeDialogOpen(false)}
				/>
			)}
			{lockedDialogOpen && (
				<DappStakingLockedAmountDialog
					amount={amounts.locked.decimalAmount?.toLocaleString()}
					fiatAmount={amounts.locked.localizedFiatAmount}
					unlockDuration={unlockDuration}
					onRequestDismiss={() => setLockedDialogOpen(false)}
					onRequestReStake={() => {
						startRequestRestakeTransition(() => {
							if (stake.dapps.length > 0) {
								setAddStakeDialogOpen(true)
							} else {
								navigate({
									to: ".",
									search: {
										action: "stake",
										type: "dapp-staking",
										chain: chain.id,
										account: account.address,
									},
								})
							}
							setLockedDialogOpen(false)
						})
					}}
					requestReStakeInTransition={requestReStakeInTransition}
					onRequestUnlock={() => {
						void unlockExtrinsic.signAndSend(account, stake.locked)
						setLockedDialogOpen(false)
					}}
				/>
			)}
		</>
	)
}

type StakesProps = {
	setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}

const Stakes = ({ setShouldRenderLoadingSkeleton }: StakesProps) => {
	const chains = loadableData(useDappStakingEnabledChainsLoadable())

	const accounts = useSelectedSubstrateAccounts()

	return (
		<>
			{chains?.map((chain, index) => (
				<ChainProvider key={index} chain={chain}>
					{accounts.map((account, index) => {
						const { name = "", nativeToken: { symbol, logo } = { symbol: "", logo: "" } } =
							chain || {}
						return (
							<ErrorBoundary
								key={index}
								renderFallback={() => (
									<StakePositionErrorBoundary
										chain={name}
										assetSymbol={symbol}
										assetLogoSrc={logo}
										account={account}
										provider="DApp staking"
										key={index}
									/>
								)}
							>
								<Stake
									account={account}
									setShouldRenderLoadingSkeleton={setShouldRenderLoadingSkeleton}
								/>
							</ErrorBoundary>
						)
					})}
				</ChainProvider>
			))}
		</>
	)
}

export default Stakes
