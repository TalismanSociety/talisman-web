import { bind } from "@react-rxjs/core"
import BN from "bn.js"
import { useContext, useDeferredValue, useMemo, useState } from "react"
import { combineLatest, defer } from "rxjs"

import type { Account } from "@/domains/accounts/accounts"
import { ChainContext } from "@/domains/chains/contexts"
import type { SmartContract } from "@/domains/chains/portal-runtime"
import { useTokenAmount, useTokenAmountFromPlanck } from "@/domains/common/hooks/useTokenAmount"
import { estimateTxFee, useTx } from "@/domains/common/hooks/useTx"
import type { Signer } from "@/domains/extension/signer"
import { BigIntMath } from "@/util/BigIntMath"
import { LOADING, toLoadable } from "@/util/loadable"

import { type AddStake, addStakeTx, maxStakeTx, type RewardClaims, unstakeTx } from "../calls"
import { account$, dappStakingApi, protocolState$, stakerInfo$ } from "../chain"
import type { Stake } from "./useStake"

const ESTIMATED_FEE_MARGIN_OF_ERROR = 0.5

const contractOf = (type: SmartContract["type"], value: string) =>
	({ type, value }) as SmartContract

const bonusContractsKeyOf = (bonusRewards: RewardClaims["bonusRewards"]) =>
	JSON.stringify(bonusRewards.map(({ contract }) => contract))

const bonusRewardsOfKey = (key: string): RewardClaims["bonusRewards"] =>
	(JSON.parse(key) as SmartContract[]).map((contract) => ({ contract }))

const [useAddStakeChainState] = bind(
	(genesisHash: string, address: string, type: SmartContract["type"], value: string) =>
		defer(() => {
			const { constants } = dappStakingApi(genesisHash)
			return combineLatest({
				accountInfo: account$(genesisHash, address),
				activeProtocol: protocolState$(genesisHash),
				stakerInfo: stakerInfo$(genesisHash, address, contractOf(type, value)),
				existentialDeposit: constants.Balances.ExistentialDeposit(),
				minimumStakeAmount: constants.DappStaking.MinimumStakeAmount(),
				maxNumberOfStakedContracts: constants.DappStaking.MaxNumberOfStakedContracts(),
			})
		})
)

const [useUnstakeChainState] = bind(
	(genesisHash: string, address: string, type: SmartContract["type"], value: string) =>
		defer(() =>
			combineLatest({
				stakerInfo: stakerInfo$(genesisHash, address, contractOf(type, value)),
				minimumStakeAmount: dappStakingApi(genesisHash).constants.DappStaking.MinimumStakeAmount(),
			})
		)
)

const [useMaxStakeFee] = bind(
	(
		genesisHash: string,
		address: string,
		type: SmartContract["type"],
		value: string,
		amount: bigint,
		lockedAvailableForStake: bigint,
		stakerRewards: bigint,
		claimableSpanCount: number,
		bonusContracts: string
	) =>
		toLoadable(
			defer(() =>
				estimateTxFee(
					genesisHash,
					address,
					maxStakeTx(dappStakingApi(genesisHash).tx, {
						contract: contractOf(type, value),
						amount,
						lockedAvailableForStake,
						stakerRewards,
						claimableSpanCount,
						bonusRewards: bonusRewardsOfKey(bonusContracts),
					})
				)
			)
		),
	LOADING
)

const rewardClaimsOf = (stake: Stake): RewardClaims => ({
	stakerRewards: stake.stakerRewards,
	claimableSpanCount: stake.claimableSpanCount,
	bonusRewards: stake.bonusRewards,
})

const stakedOf = (stakerInfo: { staked: { voting: bigint; build_and_earn: bigint } } | undefined) =>
	(stakerInfo?.staked.voting ?? 0n) + (stakerInfo?.staked.build_and_earn ?? 0n)

export const useAddStakeForm = (account: Account, stake: Stake, dapp: SmartContract) => {
	const { genesisHash } = useContext(ChainContext)
	const [amount, setAmount] = useState("")
	const deferredAmount = useDeferredValue(amount)
	const input = useTokenAmount(deferredAmount)
	const inTransition = amount !== deferredAmount

	const {
		accountInfo,
		activeProtocol,
		stakerInfo,
		existentialDeposit,
		minimumStakeAmount,
		maxNumberOfStakedContracts,
	} = useAddStakeChainState(genesisHash, account.address, dapp.type, dapp.value)

	const transferable = BigIntMath.max(0n, accountInfo.data.free - accountInfo.data.frozen)
	const lockedAvailableForStake = BigIntMath.max(
		0n,
		stake.ledger.locked - (stake.totalStaked ?? 0n)
	)

	const availableBeforeFee = useTokenAmountFromPlanck(
		BigIntMath.max(0n, transferable - existentialDeposit + lockedAvailableForStake)
	)

	const maxStakeFee = useMaxStakeFee(
		genesisHash,
		account.address,
		dapp.type,
		dapp.value,
		availableBeforeFee.decimalAmount.planck,
		lockedAvailableForStake,
		stake.stakerRewards,
		stake.claimableSpanCount,
		bonusContractsKeyOf(stake.bonusRewards)
	)

	const available = useTokenAmountFromPlanck(
		BigIntMath.max(
			0n,
			availableBeforeFee.decimalAmount.planck -
				BigInt(
					new BN(maxStakeFee.status === "success" ? maxStakeFee.data.toString() : 0)
						.muln(ESTIMATED_FEE_MARGIN_OF_ERROR)
						.toString()
				)
		)
	)

	const minimum = useTokenAmountFromPlanck(minimumStakeAmount)

	const maxStakeEntriesReached = stake.ledger.contract_stake_count >= maxNumberOfStakedContracts
	const maxStakedDappsReached = stake.dapps.length >= maxNumberOfStakedContracts
	const canCleanUpEntriesToMakeSpace = !maxStakedDappsReached || stakerInfo !== undefined

	const error = useMemo(() => {
		if (deferredAmount.trim() === "" || inTransition) return

		if (
			activeProtocol.period_info.subperiod.type === "BuildAndEarn" &&
			activeProtocol.period_info.next_subperiod_start_era <= activeProtocol.era + 1
		) {
			return new Error("Not possible to stake in the last era of a period")
		}

		if (maxStakeEntriesReached && !canCleanUpEntriesToMakeSpace) {
			return new Error("Too many staked contracts for the account")
		}

		if (
			input.decimalAmount !== undefined &&
			input.decimalAmount.planck > available.decimalAmount.planck
		) {
			return new Error("Insufficient balance")
		}

		if (
			input.decimalAmount !== undefined &&
			input.decimalAmount.planck < minimum.decimalAmount.planck
		) {
			return new Error(`Minimum ${minimum.decimalAmount.toLocaleString()} needed`)
		}

		return undefined
	}, [
		activeProtocol,
		available.decimalAmount.planck,
		canCleanUpEntriesToMakeSpace,
		deferredAmount,
		inTransition,
		input.decimalAmount,
		maxStakeEntriesReached,
		minimum.decimalAmount,
	])

	const tx = useTx(genesisHash, ({ api }, addStake: AddStake) => addStakeTx(api.tx, addStake))
	const addStake: AddStake = {
		...rewardClaimsOf(stake),
		contract: dapp,
		amount: input.decimalAmount?.planck ?? 0n,
		lockedAvailableForStake,
		cleanup: maxStakeEntriesReached && canCleanUpEntriesToMakeSpace,
	}

	return {
		ready:
			maxStakeFee.status === "success" &&
			deferredAmount.trim() !== "" &&
			input.decimalAmount !== undefined &&
			input.decimalAmount.planck !== 0n &&
			error === undefined &&
			!inTransition,
		input: { ...input, amount },
		setAmount,
		available,
		resulting: useTokenAmountFromPlanck(
			inTransition ? undefined : stakedOf(stakerInfo) + (input.decimalAmount?.planck ?? 0n)
		),
		error,
		extrinsic: { ...tx, signAndSend: (signer: Signer) => tx.signAndSend(signer, addStake) },
	}
}

export const useUnstakeForm = (account: Account, stake: Stake, dapp: SmartContract) => {
	const { genesisHash } = useContext(ChainContext)
	const [amount, setAmount] = useState("")
	const deferredAmount = useDeferredValue(amount)
	const input = useTokenAmount(deferredAmount)
	const inTransition = amount !== deferredAmount

	const { stakerInfo, minimumStakeAmount } = useUnstakeChainState(
		genesisHash,
		account.address,
		dapp.type,
		dapp.value
	)

	const tx = useTx(genesisHash, ({ api }, unstake: Parameters<typeof unstakeTx>[1]) =>
		unstakeTx(api.tx, unstake)
	)
	const unstake = {
		...rewardClaimsOf(stake),
		contract: dapp,
		amount: input.decimalAmount?.planck ?? 0n,
	}

	const available = useTokenAmountFromPlanck(stakedOf(stakerInfo))

	const minimum = useTokenAmountFromPlanck(minimumStakeAmount)

	const error = useMemo(() => {
		if (amount.trim() === "" || inTransition) return

		if (
			input.decimalAmount !== undefined &&
			input.decimalAmount.planck > available.decimalAmount.planck
		) {
			return new Error("Insufficient balance")
		}

		if (
			input.decimalAmount !== undefined &&
			available.decimalAmount.planck - input.decimalAmount.planck > 0n &&
			available.decimalAmount.planck - input.decimalAmount.planck < minimum.decimalAmount.planck
		) {
			return new Error(`Need ${minimum.decimalAmount.toLocaleString()} to keep staking`)
		}

		return undefined
	}, [
		amount,
		available.decimalAmount.planck,
		inTransition,
		input.decimalAmount,
		minimum.decimalAmount,
	])

	return {
		ready:
			deferredAmount.trim() !== "" &&
			input.decimalAmount !== undefined &&
			input.decimalAmount.planck !== 0n &&
			error === undefined &&
			!inTransition,
		input: { ...input, amount },
		setAmount,
		available,
		resulting: useTokenAmountFromPlanck(
			BigIntMath.max(0n, stakedOf(stakerInfo) - (input.decimalAmount?.planck ?? 0n))
		),
		error,
		extrinsic: { ...tx, signAndSend: (signer: Signer) => tx.signAndSend(signer, unstake) },
	}
}
