import { evmErc20TokenId } from "@talismn/chaindata-provider"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { erc20Abi } from "viem"
import { type Config, useBlockNumber, useConfig } from "wagmi"
import { readContractQueryOptions, readContractsQueryOptions } from "wagmi/query"

import type { Account } from "@/domains/accounts/accounts"
import { useTokenPriceLoadable } from "@/domains/balances/token-rates"
import { Decimal } from "@/util/Decimal"
import { loadableData } from "@/util/loadable"
import { lidoTokenAbi, withdrawalQueueAbi } from "./abi"
import type { LidoSuite } from "./types"

// https://github.com/wevm/wagmi/issues/3855
const serializableBigInt = (value: bigint) =>
	Object.assign(value, { toJSON: () => value.toString() })

export const erc20TokenQueryOptions = (
	config: Config,
	token: { chainId: number; address: `0x${string}` }
) =>
	readContractsQueryOptions(config, {
		contracts: [
			{ ...token, abi: erc20Abi, functionName: "decimals" },
			{ ...token, abi: erc20Abi, functionName: "symbol" },
		],
		allowFailure: false,
		query: { select: ([decimals, symbol]) => ({ decimals, symbol }) },
	})

export const useStakes = (accounts: Account[], lidoSuite: LidoSuite) => {
	const filteredAccounts = accounts.filter((x) => x.type === "ethereum")

	const config = useConfig()

	const tokenQuery = useQuery(
		erc20TokenQueryOptions(config, {
			chainId: lidoSuite.chain.id,
			address: lidoSuite.token.address,
		})
	)
	const balancesQuery = useQuery(
		readContractsQueryOptions(config, {
			contracts: filteredAccounts.map(
				(x) =>
					({
						chainId: lidoSuite.chain.id,
						address: lidoSuite.token.address,
						abi: lidoTokenAbi,
						functionName: "balanceOf",
						args: [x.address],
					}) as const
			),
			allowFailure: false,
		})
	)
	const withdrawalQueue = {
		chainId: lidoSuite.chain.id,
		address: lidoSuite.withdrawalQueue,
		abi: withdrawalQueueAbi,
	} as const
	const withdrawalIdsQuery = useQuery(
		readContractsQueryOptions(config, {
			contracts: filteredAccounts.map(
				(x) =>
					({
						...withdrawalQueue,
						functionName: "getWithdrawalRequests",
						args: [x.address],
					}) as const
			),
			allowFailure: false,
		})
	)
	const queueStateQuery = useQuery(
		readContractsQueryOptions(config, {
			contracts: [
				{ ...withdrawalQueue, functionName: "getLastFinalizedRequestId" },
				{ ...withdrawalQueue, functionName: "getLastCheckpointIndex" },
			] as const,
			allowFailure: false,
		})
	)
	const firstQueryBatch = [tokenQuery, balancesQuery, withdrawalIdsQuery, queueStateQuery]

	const token = tokenQuery.data
	const balances = balancesQuery.data
	const withdrawalIds = withdrawalIdsQuery.data
	const [lastFinalizedRequestId, lastCheckpointIndex] = queueStateQuery.data ?? []

	const sortedWithdrawalIds = withdrawalIds?.flat().sort((a, b) => (a > b ? 1 : -1)) ?? []
	const claimableIds =
		lastFinalizedRequestId === undefined
			? []
			: sortedWithdrawalIds.filter((id) => id <= lastFinalizedRequestId)

	const withdrawalStatusesQuery = useQuery(
		readContractQueryOptions(config, {
			...withdrawalQueue,
			functionName: "getWithdrawalStatus",
			args: [sortedWithdrawalIds.map(serializableBigInt)],
		})
	)
	const hintsQuery = useQuery(
		readContractQueryOptions(config, {
			...withdrawalQueue,
			functionName: "findCheckpointHints",
			args: [
				claimableIds.map(serializableBigInt),
				serializableBigInt(1n),
				serializableBigInt(lastCheckpointIndex ?? 0n),
			],
		})
	)
	const secondQueryBatch = [withdrawalStatusesQuery, hintsQuery]

	const hints = hintsQuery.data?.map(serializableBigInt)

	const { data: claimables, refetch: refetchClaimables } = useQuery(
		readContractQueryOptions(config, {
			...withdrawalQueue,
			functionName: "getClaimableEther",
			args: hints === undefined ? [[], []] : [claimableIds.map(serializableBigInt), hints],
		})
	)

	const { data: blockNumber } = useBlockNumber({ watch: true })

	useEffect(() => {
		;[...firstQueryBatch, ...secondQueryBatch].forEach((query) => {
			void query.refetch()
		})
		void refetchClaimables()
	}, [blockNumber])

	const amountById = new Map(
		withdrawalStatusesQuery.data?.map(
			(status, index) => [sortedWithdrawalIds[index], status.amountOfStETH] as const
		)
	)
	const claimableById = new Map(
		claimables?.map((claimable, index) => [claimableIds[index], claimable] as const)
	)

	const tokenPriceLoadable = useTokenPriceLoadable(
		evmErc20TokenId(String(lidoSuite.chain.id), lidoSuite.token.address)
	)
	const tokenPrice = loadableData(tokenPriceLoadable)

	const stEth = (planck: bigint) =>
		Decimal.fromPlanck(planck, token?.decimals ?? 0, { currency: token?.symbol })

	const data = filteredAccounts
		.map((account, index) => {
			const balance = stEth(balances?.at(index) ?? 0n)
			const requestIds = withdrawalIds?.at(index) ?? []
			const pendingAmounts =
				lastFinalizedRequestId === undefined
					? []
					: requestIds
							.filter((id) => id > lastFinalizedRequestId)
							.map((id) => amountById.get(id) ?? 0n)

			return {
				account,
				balance,
				fiatBalance: balance.toNumber() * (tokenPrice ?? 0),
				totalUnlocking: stEth(pendingAmounts.reduce((total, amount) => total + amount, 0n)),
				unlockings: pendingAmounts.map((amount) => ({ amount: stEth(amount) })),
				claimable: stEth(
					requestIds.reduce((total, id) => total + (claimableById.get(id) ?? 0n), 0n)
				),
			}
		})
		.filter((x) => x.balance.planck > 0 || x.totalUnlocking.planck > 0 || x.claimable.planck > 0)

	return {
		data,
		isLoading:
			firstQueryBatch.some((x) => x.isLoading) ||
			secondQueryBatch.some((x) => x.isLoading) ||
			tokenPriceLoadable.status === "loading",
	}
}
