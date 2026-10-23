import { bind } from "@react-rxjs/core"
import { AnimatePresence } from "motion/react"
import type { ReactNode } from "react"
import { memo, Suspense, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react"
import { useLocation } from "react-use"
import { combineLatest, map, of, switchMap } from "rxjs"
import { StakeForm as StakeFormComponent } from "@/components/recipes/StakeForm"
import type { StakeStatus } from "@/components/recipes/StakeStatusIndicator"
import { PoolSelectorDialog } from "@/components/recipes/StakeTargetSelectorDialog"
import { useAccountSelector } from "@/components/widgets/AccountSelector"
import type { SignerAccount } from "@/domains/accounts/accounts"
import { useWriteableSubstrateAccounts } from "@/domains/accounts/accounts"
import { txFromCall } from "@/domains/chains/chain-runtime"
import { type ChainInfo, useChain, useNativeTokenDecimal } from "@/domains/chains/chains"
import { claimPermissionUnsupportedChainIds } from "@/domains/chains/config"
import { assertChain } from "@/domains/chains/utils"
import { useTokenAmountFromPlanck } from "@/domains/common/hooks/useTokenAmount"
import { useTx, useTxLoadableState } from "@/domains/common/hooks/useTx"
import {
	type ClaimPermission,
	joinCall,
	withdrawUnbondedCall,
} from "@/domains/staking/substrate/nominationPools/calls"
import {
	nominatesActiveValidator,
	poolNames,
	poolStash,
	watchActiveEra,
	watchBondedPool,
	watchNominators,
	watchPoolMember,
} from "@/domains/staking/substrate/nominationPools/chain"
import {
	useApr,
	usePoolAddForm,
	usePoolCommission,
	usePoolStakes,
	useRecommendedPools,
} from "@/domains/staking/substrate/nominationPools/hooks"
import { useEraEtaFormatter } from "@/domains/staking/substrate/nominationPools/hooks/useEraEta"
import {
	chainRuntimes$,
	useGenesisHash,
} from "@/domains/staking/substrate/nominationPools/hooks/useRuntimes"
import { poolStatus } from "@/domains/staking/substrate/nominationPools/positions"
import { Info } from "@/icons"
import { CircularProgressIndicator } from "@/ui/atoms/CircularProgressIndicator"
import { Tooltip } from "@/ui/atoms/Tooltip"
import { Select } from "@/ui/molecules/Select"
import { BigIntMath } from "@/util/BigIntMath"
import type { Decimal } from "@/util/Decimal"
import { LOADING, toLoadable } from "@/util/loadable"
import { Maybe } from "@/util/monads"

import AddStakeDialog from "./AddStakeDialog"
import ClaimStakeDialog from "./ClaimStakeDialog"
import PoolClaimPermissionDialog, {
	PoolClaimPermissionControlledDialog,
	toUiPermission,
} from "./PoolClaimPermissionDialog"
import UnstakeDialog from "./UnstakeDialog"
import { usePoolSelection } from "./usePoolSelection"

const ExistingPool = (props: { account: SignerAccount; showClaimPermission: boolean }) => {
	const pool = usePoolStakes({ address: props.account.address })

	const amount = useTokenAmountFromPlanck(pool?.poolMember.points)
	const pendingRewards = useTokenAmountFromPlanck(pool?.pendingRewards)

	const [addStakeAccount, setAddStakeAccount] = useState<SignerAccount>()

	const [claimDialogOpen, setClaimDialogOpen] = useState(false)
	const [claimPayoutLoadable, setClaimPayoutLoadable] = useTxLoadableState()
	const [restakeLoadable, setRestakeLoadable] = useTxLoadableState()

	const [unstakeAccount, setUnstakeAccount] = useState<SignerAccount>()
	const genesisHash = useGenesisHash()
	const withdrawExtrinsic = useTx(genesisHash, (runtime) =>
		txFromCall(runtime, withdrawUnbondedCall(props.account.address, pool?.slashingSpan ?? 0))
	)

	const [claimPermissionDialogOpen, setClaimPermissionDialogOpen] = useState(false)

	const decimal = useNativeTokenDecimal()
	const eraEtaFormatter = useEraEtaFormatter()
	const unlocks = pool?.unlockings?.map((x) => ({
		amount: decimal.fromPlanck(x.amount).toLocaleString(),
		eta: eraEtaFormatter(x.erasTilWithdrawable),
	}))

	const unlocking = useTokenAmountFromPlanck(pool?.totalUnlocking ?? 0n)
	const withdrawable = useTokenAmountFromPlanck(pool?.withdrawable)

	return (
		<>
			<StakeFormComponent.ExistingPool
				name={pool?.poolName}
				status={pool?.status}
				amount={amount.decimalAmount?.toLocaleString()}
				fiatAmount={amount.localizedFiatAmount}
				rewards={pendingRewards.decimalAmount?.toLocaleString()}
				rewardsFiatAmount={pendingRewards.localizedFiatAmount}
				claimChip={
					pool?.pendingRewards !== undefined &&
					pool.pendingRewards !== 0n && (
						<StakeFormComponent.ExistingPool.ClaimChip
							onClick={() => setClaimDialogOpen(true)}
							loading={
								claimPayoutLoadable.state === "loading" || restakeLoadable.state === "loading"
							}
						/>
					)
				}
				unlocks={unlocks ?? []}
				unlocking={unlocking.decimalAmount.planck > 0n && unlocking.decimalAmount.toLocaleString()}
				unlockingFiatAmount={unlocking.localizedFiatAmount}
				withdrawable={
					withdrawable.decimalAmount !== undefined &&
					withdrawable.decimalAmount.planck > 0n &&
					withdrawable.decimalAmount.toLocaleString()
				}
				withdrawableFiatAmount={withdrawable.localizedFiatAmount}
				withdrawChip={
					<StakeFormComponent.ExistingPool.WithdrawChip
						onClick={() => {
							void withdrawExtrinsic.signAndSend(props.account)
						}}
						loading={withdrawExtrinsic.state === "loading"}
					/>
				}
				claimPermission={
					props.showClaimPermission && (
						<StakeFormComponent.ClaimPermission
							permission={toUiPermission(pool?.claimPermission ?? "Permissioned")}
							onChangeRequest={() => setClaimPermissionDialogOpen(true)}
						/>
					)
				}
				addButton={
					pool !== undefined && (
						<StakeFormComponent.ExistingPool.AddButton
							onClick={() => setAddStakeAccount(props.account)}
						/>
					)
				}
				unstakeButton={
					pool?.poolMember.points !== 0n && (
						<StakeFormComponent.ExistingPool.UnstakeButton
							onClick={() => setUnstakeAccount(props.account)}
						/>
					)
				}
				readonly={props.account.readonly}
			/>
			<AddStakeDialog account={addStakeAccount} onDismiss={() => setAddStakeAccount(undefined)} />
			<ClaimStakeDialog
				open={claimDialogOpen}
				onRequestDismiss={() => setClaimDialogOpen(false)}
				account={props.account}
				onChangeClaimPayoutLoadable={setClaimPayoutLoadable}
				onChangeRestakeLoadable={setRestakeLoadable}
			/>
			<UnstakeDialog account={unstakeAccount} onDismiss={() => setUnstakeAccount(undefined)} />
			<AnimatePresence>
				{claimPermissionDialogOpen && (
					<PoolClaimPermissionDialog
						account={props.account}
						onRequestDismiss={() => setClaimPermissionDialogOpen(false)}
					/>
				)}
			</AnimatePresence>
		</>
	)
}

const PoolSelector = (props: {
	open: boolean
	selectedPoolId?: number
	onChangePoolId: (poolId: number) => unknown
	onDismiss: () => unknown
}) => {
	const [newPoolId, setNewPoolId] = useState<number>()
	const chain = useChain()
	const nativeTokenDecimal = useNativeTokenDecimal()
	const recommendedPools = useRecommendedPools()
	const { getCurrentCommission } = usePoolCommission()

	return (
		<PoolSelectorDialog
			open={props.open}
			onRequestDismiss={useCallback(() => {
				props.onDismiss()
				setNewPoolId(undefined)
			}, [props])}
			onConfirm={useCallback(() => {
				if (newPoolId !== undefined) {
					props.onChangePoolId(newPoolId)
					setNewPoolId(undefined)
				}
				props.onDismiss()
			}, [newPoolId, props])}
		>
			{recommendedPools.map((pool, index) => {
				return (
					<PoolSelectorDialog.Item
						key={pool.poolId}
						selected={props.selectedPoolId !== undefined && pool.poolId === props.selectedPoolId}
						highlighted={newPoolId !== undefined && pool.poolId === newPoolId}
						talismanRecommended={index === 0}
						name={pool.name ?? ""}
						detailUrl={
							chain?.subscanUrl
								? new URL(`nomination_pool/${pool.poolId}`, chain.subscanUrl).toString()
								: undefined
						}
						balance={`${nativeTokenDecimal.fromPlanck(pool.points).toLocaleString()} staked`}
						rating={3}
						count={pool.memberCounter.toString()}
						onClick={() => setNewPoolId(pool.poolId)}
						commissionFeeDescription="Commission shown is only for the nomination pool, but actual earnings will reflect fees charged by both validators and nomination pools. The total amount of fees can change regularly and can't be determined by Talisman."
						commissionFee={`${getCurrentCommission(pool.poolId).toString()}%`}
					/>
				)
			})}
		</PoolSelectorDialog>
	)
}

export const AssetSelect = <T extends ChainInfo>(props: {
	selectedChain: T
	onSelectChain: (chain: T) => unknown
	chains: readonly T[]
	inTransition: boolean
	iconSize?: string | number
}) => (
	<Select
		css={{ width: "100%" }}
		value={props.selectedChain.id}
		renderSelected={
			props.inTransition
				? (id) => (
						<Select.Option
							leadingIcon={<CircularProgressIndicator size={props.iconSize ?? "2.4rem"} />}
							headlineContent={props.chains.find((x) => x.id === id)?.nativeToken?.symbol}
						/>
					)
				: undefined
		}
		onChangeValue={(id) => {
			const chain = props.chains.find((x) => x.id === id)
			if (chain !== undefined) {
				props.onSelectChain(chain)
			}
		}}
	>
		{props.chains.map((x, index) => (
			<Select.Option
				key={index}
				value={x.id}
				leadingIcon={
					<img
						alt={x.nativeToken?.symbol}
						src={x.nativeToken?.logo}
						css={{ width: props.iconSize ?? "2.4rem", height: props.iconSize ?? "2.4rem" }}
					/>
				}
				headlineContent={x.nativeToken?.symbol}
			/>
		))}
	</Select>
)

const EstimatedYield = memo(
	(props: { amount: Decimal }) => {
		const stakedReturn = useApr()
		const annualReturn = useMemo(
			() =>
				BigIntMath.mulNumber(props.amount.planck, Number.isNaN(stakedReturn) ? 0 : stakedReturn),
			[props.amount.planck, stakedReturn]
		)
		const parsedAnnualReturn = useTokenAmountFromPlanck(annualReturn)

		return (
			<StakeFormComponent.EstimatedYield
				amount={`${parsedAnnualReturn.decimalAmount.toLocaleString()} / Year`}
				fiatAmount={parsedAnnualReturn.localizedFiatAmount}
			/>
		)
	},
	(previous, current) => previous.amount.planck === current.amount.planck
)

const DeferredEstimatedYield = (props: { amount: Decimal }) => (
	<EstimatedYield amount={useDeferredValue(props.amount)} />
)

const CommissionFee = ({ poolId }: { poolId: number }) => {
	const { getCurrentCommission } = usePoolCommission()

	const poolCommission = getCurrentCommission(poolId)

	return (
		<div className="flex justify-between text-[14px]">
			<div className="flex items-center gap-2">
				<div>Commission fee</div>
				<Tooltip
					content={
						<div className="max-w-[276px] text-[12px]">
							Commission shown is only for the nomination pool, but actual earnings will reflect
							fees charged by both validators and nomination pools. The total amount of fees can
							change regularly and can't be determined by Talisman.
						</div>
					}
				>
					<Info size="1.4rem" />
				</Tooltip>
			</div>
			<div>{`${poolCommission}%`}</div>
		</div>
	)
}

const [useExistingPoolId] = bind(
	(genesisHash: string, address: string) =>
		toLoadable(
			chainRuntimes$(genesisHash).pipe(
				switchMap(({ runtime }) =>
					address === ""
						? of(undefined)
						: watchPoolMember(runtime, address).pipe(map((member) => member?.pool_id))
				)
			)
		),
	LOADING
)

const [useSelectedPool] = bind(
	(genesisHash: string, poolId: number) =>
		toLoadable(
			chainRuntimes$(genesisHash).pipe(
				switchMap(({ runtime }) =>
					combineLatest([
						watchBondedPool(runtime, poolId),
						poolNames(runtime, [poolId]),
						combineLatest([
							watchNominators(runtime, poolStash(runtime, poolId)),
							watchActiveEra(runtime),
						]).pipe(
							switchMap(([nominations, activeEra]) => {
								const targets = nominations?.targets ?? []
								return nominatesActiveValidator(runtime, activeEra?.index ?? 0, targets).pipe(
									map((active) => poolStatus(1n, targets, active))
								)
							})
						),
					]).pipe(
						map(([bondedPool, [name], status]) => ({
							points: bondedPool?.points,
							memberCounter: bondedPool?.member_counter,
							name,
							status,
						}))
					)
				)
			)
		),
	LOADING
)

export const ControlledStakeForm = (props: { assetSelector: ReactNode; account?: string }) => {
	const location = useLocation()

	const poolIdFromSearch = useMemo(
		() =>
			Maybe.of(new URLSearchParams(location.search).get("poolId")).mapOrUndefined((x) => {
				try {
					return parseInt(x)
				} catch {
					return undefined
				}
			}),
		[location.search]
	)

	const chain = useChain()
	const recommendedPools = useRecommendedPools()
	const genesisHash = useGenesisHash()

	const showClaimPermission = !claimPermissionUnsupportedChainIds.includes(chain.id)

	assertChain(chain, { hasNominationPools: true })

	const [selectedPoolId, setSelectedPoolId] = usePoolSelection({
		genesisHash,
		poolIdFromSearch,
		recommendedPoolId: recommendedPools[0]?.poolId,
	})
	const [showPoolSelector, setShowPoolSelector] = useState(false)

	const [[selectedAccount], accountSelector] = useAccountSelector(
		useWriteableSubstrateAccounts(),
		(accounts) =>
			props.account !== undefined
				? accounts?.find((account) => account.address === props.account)
				: poolIdFromSearch === undefined
					? accounts?.[0]
					: undefined
	)

	const {
		input: { amount, decimalAmount, localizedFiatAmount },
		isReady: isInputReady,
		availableBalance,
		error: inputError,
		setAmount,
	} = usePoolAddForm("join", selectedAccount?.address)

	const existingPoolLoadable = useExistingPoolId(genesisHash, selectedAccount?.address ?? "")
	const existingPool =
		existingPoolLoadable.status === "success" ? existingPoolLoadable.data : undefined

	const selectedPool = useSelectedPool(genesisHash, selectedPoolId ?? 0)
	const pool = selectedPool.status === "success" ? selectedPool.data : undefined

	const poolStatusValue: StakeStatus = pool?.status

	const { decimalAmount: poolTotalStaked } = useTokenAmountFromPlanck(pool?.points)

	const isReady =
		selectedAccount !== undefined &&
		decimalAmount !== undefined &&
		existingPoolLoadable.status === "success" &&
		isInputReady

	const [claimPermissionDialogOpen, setClaimPermisssionDialogOpen] = useState(false)
	const [claimPermission, setClaimPermission] = useState<ClaimPermission>("Permissioned")

	useEffect(() => {
		if (selectedPoolId !== undefined && chain.talismanPools?.includes(selectedPoolId)) {
			setClaimPermission("PermissionlessCompound")
		} else {
			setClaimPermission("Permissioned")
		}
	}, [selectedPoolId, chain.talismanPools])

	const joinPoolExtrinsic = useTx(genesisHash, (runtime) => {
		if (decimalAmount === undefined || selectedPoolId === undefined) {
			throw new Error("Unable to construct extrinsic nominationPools:join")
		}
		return txFromCall(runtime, joinCall(decimalAmount.planck, selectedPoolId, claimPermission))
	})

	return (
		<>
			<PoolSelector
				open={showPoolSelector}
				selectedPoolId={selectedPoolId}
				onChangePoolId={setSelectedPoolId}
				onDismiss={() => setShowPoolSelector(false)}
			/>
			<AnimatePresence>
				{claimPermissionDialogOpen && (
					<PoolClaimPermissionControlledDialog
						permission={claimPermission}
						onChangePermission={setClaimPermission}
						poolId={selectedPoolId}
						onRequestDismiss={() => setClaimPermisssionDialogOpen(false)}
					/>
				)}
			</AnimatePresence>
			<StakeFormComponent
				assetSelector={props.assetSelector}
				accountSelector={accountSelector}
				amountInput={
					<StakeFormComponent.AmountInput
						amount={amount}
						onChangeAmount={setAmount}
						onRequestMaxAmount={() => {
							if (availableBalance.decimalAmount !== undefined) {
								setAmount(availableBalance.decimalAmount.toString())
							}
						}}
						fiatAmount={localizedFiatAmount}
						availableToStake={availableBalance.decimalAmount?.toLocaleString() ?? "..."}
						error={inputError?.message}
						isLoading={joinPoolExtrinsic.state === "loading"}
					/>
				}
				poolInfo={
					<StakeFormComponent.PoolInfo
						name={pool?.name ?? ""}
						status={poolStatusValue}
						totalStaked={poolTotalStaked?.toLocaleString() ?? ""}
						memberCount={pool?.memberCounter?.toString() ?? ""}
						onRequestPoolChange={() => setShowPoolSelector(true)}
						chain={chain.id.toString() ?? ""}
					/>
				}
				estimatedYield={
					decimalAmount && (
						<Suspense>
							<DeferredEstimatedYield amount={decimalAmount} />
						</Suspense>
					)
				}
				commissionFee={<CommissionFee poolId={selectedPoolId || 0} />}
				claimPermission={
					showClaimPermission && (
						<StakeFormComponent.ClaimPermission
							permission={toUiPermission(claimPermission)}
							onChangeRequest={() => setClaimPermisssionDialogOpen(true)}
						/>
					)
				}
				stakeButton={
					<StakeFormComponent.StakeButton
						loading={joinPoolExtrinsic.state === "loading"}
						disabled={!isReady || inputError !== undefined || decimalAmount.planck === 0n}
						onClick={() => {
							if (
								selectedAccount !== undefined &&
								decimalAmount?.planck !== undefined &&
								selectedPoolId !== undefined
							) {
								void joinPoolExtrinsic.signAndSend(selectedAccount)
							}
						}}
					/>
				}
				existingPool={
					existingPool !== undefined &&
					selectedAccount !== undefined && (
						<ExistingPool account={selectedAccount} showClaimPermission={showClaimPermission} />
					)
				}
			/>
		</>
	)
}
