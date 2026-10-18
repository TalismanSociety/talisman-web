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
	const withdrawalIdsQuery = useQuery(
		readContractsQueryOptions(config, {
			contracts: filteredAccounts.map(
				(x) =>
					({
						chainId: lidoSuite.chain.id,
						address: lidoSuite.withdrawalQueue,
						abi: withdrawalQueueAbi,
						functionName: "getWithdrawalRequests",
						args: [x.address],
					}) as const
			),
			allowFailure: false,
		})
	)
	const lastCheckpointIndexQuery = useQuery(
		readContractQueryOptions(config, {
			chainId: lidoSuite.chain.id,
			address: lidoSuite.withdrawalQueue,
			abi: withdrawalQueueAbi,
			functionName: "getLastCheckpointIndex",
		})
	)
	const firstQueryBatch = [tokenQuery, balancesQuery, withdrawalIdsQuery, lastCheckpointIndexQuery]

	const token = tokenQuery.data
	const balances = balancesQuery.data
	const withdrawalIds = withdrawalIdsQuery.data
	const lastCheckpointIndex = lastCheckpointIndexQuery.data

	const sortedWithdrawalIds =
		withdrawalIds
			?.flat()
			.map(serializableBigInt)
			.sort((a, b) => (a > b ? 1 : -1)) ?? []

	const withdrawalStatusesQuery = useQuery(
		readContractQueryOptions(config, {
			chainId: lidoSuite.chain.id,
			address: lidoSuite.withdrawalQueue,
			abi: withdrawalQueueAbi,
			functionName: "getWithdrawalStatus",
			args: [sortedWithdrawalIds],
		})
	)
	const hintsQuery = useQuery(
		readContractQueryOptions(config, {
			chainId: lidoSuite.chain.id,
			address: lidoSuite.withdrawalQueue,
			abi: withdrawalQueueAbi,
			functionName: "findCheckpointHints",
			args: [
				sortedWithdrawalIds,
				serializableBigInt(1n),
				serializableBigInt(lastCheckpointIndex ?? 0n),
			],
		})
	)
	const secondQueryBatch = [withdrawalStatusesQuery, hintsQuery]

	const withdrawalStatuses = withdrawalStatusesQuery.data
	const _hints = hintsQuery.data

	const hints = _hints?.map(serializableBigInt)

	const { data: claimables, refetch: refetchClaimables } = useQuery(
		readContractQueryOptions(config, {
			chainId: lidoSuite.chain.id,
			address: lidoSuite.withdrawalQueue,
			abi: withdrawalQueueAbi,
			functionName: "getClaimableEther",
			args: [sortedWithdrawalIds, hints ?? []],
		})
	)

	const { data: blockNumber } = useBlockNumber({ watch: true })

	useEffect(() => {
		;[...firstQueryBatch, ...secondQueryBatch].forEach((query) => {
			void query.refetch()
		})
		void refetchClaimables()
	}, [blockNumber])

	const withdrawals = withdrawalIds?.map((_, index) => ({
		status: withdrawalStatuses?.at(index),
		claimable: claimables?.at(index),
	}))

	const tokenPriceLoadable = useTokenPriceLoadable(
		evmErc20TokenId(String(lidoSuite.chain.id), lidoSuite.token.address)
	)
	const tokenPrice = loadableData(tokenPriceLoadable)

	const data = filteredAccounts
		.map((account, index) => {
			const balance = Decimal.fromPlanck(
				(balances?.at(index) as bigint) ?? 0n,
				token?.decimals ?? 0,
				{
					currency: token?.symbol,
				}
			)

			const accountWithdrawals = withdrawals?.filter((x) => x.status?.owner === account.address)
			const unlockings = accountWithdrawals?.filter(
				(x) => !x.status?.isClaimed && !x.status?.isFinalized
			)

			return {
				account,
				balance: Decimal.fromPlanck((balances?.at(index) as bigint) ?? 0n, token?.decimals ?? 0, {
					currency: token?.symbol,
				}),
				fiatBalance: balance.toNumber() * (tokenPrice ?? 0),
				totalUnlocking: Decimal.fromPlanck(
					unlockings?.reduce((prev, curr) => prev + (curr.status?.amountOfStETH ?? 0n), 0n) ?? 0n,
					token?.decimals ?? 0,
					{ currency: token?.symbol }
				),

				unlockings: unlockings?.map((unlock) => ({
					amount: Decimal.fromPlanck(unlock.status?.amountOfStETH ?? 0n, token?.decimals ?? 0, {
						currency: token?.symbol,
					}),
				})),
				claimable: Decimal.fromPlanck(
					accountWithdrawals?.reduce((prev, curr) => prev + (curr.claimable ?? 0n), 0n) ?? 0n,
					token?.decimals ?? 0,
					{ currency: token?.symbol }
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
