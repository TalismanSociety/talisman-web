import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import {
	type Abi,
	custom,
	decodeFunctionData,
	encodeErrorResult,
	encodeFunctionResult,
	erc20Abi,
	getAddress,
	type Hex,
	multicall3Abi,
	parseAbi,
	parseEther,
} from "viem"
import { describe, expect, it, vi } from "vitest"
import { createConfig, WagmiProvider } from "wagmi"
import { mainnet } from "wagmi/chains"
import type { Account } from "@/domains/accounts/accounts"
import { withdrawalQueueAbi } from "./abi"
import { lidoMainnet } from "./config"
import { useStakes } from "./core"

vi.mock("@/domains/balances/token-rates", () => ({
	useTokenPriceLoadable: () => ({ status: "success", data: 0 }),
}))

type WithdrawalRequest = {
	id: bigint
	owner: string
	stEth: bigint
	claimed?: boolean
	claimable?: bigint
}

type Queue = {
	lastFinalizedRequestId: bigint
	checkpointsFrom: bigint[]
	requests: WithdrawalRequest[]
}

type Handlers = Record<string, (args: readonly unknown[]) => unknown>

const sameAddress = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

const dispatch = (abi: Abi, handlers: Handlers, data: Hex): Hex => {
	const { functionName, args } = decodeFunctionData({ abi, data })
	const handler = handlers[functionName]
	if (handler === undefined) throw new Error(`no handler for ${functionName}`)
	return encodeFunctionResult({ abi, functionName, result: handler(args ?? []) })
}

const revertData = (error: unknown) =>
	encodeErrorResult({
		abi: parseAbi(["error Error(string reason)"]),
		errorName: "Error",
		args: [error instanceof Error ? error.message : String(error)],
	})

const fakeMainnet = (queue: Queue, balances: Record<string, bigint>) => {
	const checkpoints = [0n, ...queue.checkpointsFrom]
	const lastCheckpointIndex = BigInt(queue.checkpointsFrom.length)
	const isFinalized = (id: bigint) => id <= queue.lastFinalizedRequestId
	const requestById = (id: bigint) => {
		const request = queue.requests.find((candidate) => candidate.id === id)
		if (request === undefined) throw new Error(`InvalidRequestId(${id})`)
		return request
	}
	const checkpointFrom = (index: bigint) => checkpoints[Number(index)] as bigint
	const checkpointHint = (id: bigint, start: bigint, end: bigint) => {
		if (!isFinalized(id) || start > end) return 0n
		let index = end
		while (index >= start && checkpointFrom(index) > id) index -= 1n
		if (index < start) return 0n
		if (index === end && end !== lastCheckpointIndex && id >= checkpointFrom(end + 1n)) return 0n
		return index
	}

	const withdrawalQueue: Handlers = {
		getWithdrawalRequests: ([owner]) =>
			queue.requests
				.filter((request) => sameAddress(request.owner, owner as string) && !request.claimed)
				.map(({ id }) => id),
		getLastFinalizedRequestId: () => queue.lastFinalizedRequestId,
		getLastCheckpointIndex: () => lastCheckpointIndex,
		getWithdrawalStatus: ([ids]) =>
			(ids as bigint[]).map((id) => {
				const request = requestById(id)
				return {
					amountOfStETH: request.stEth,
					amountOfShares: request.stEth,
					owner: getAddress(request.owner),
					timestamp: 0n,
					isFinalized: isFinalized(id),
					isClaimed: request.claimed ?? false,
				}
			}),
		findCheckpointHints: ([ids, firstIndex, lastIndex]) => {
			let start = firstIndex as bigint
			return (ids as bigint[]).map((id, index, sorted) => {
				if (index > 0 && id < (sorted[index - 1] as bigint))
					throw new Error("RequestIdsNotSorted()")
				if (start === 0n || (lastIndex as bigint) > lastCheckpointIndex)
					throw new Error(`InvalidRequestIdRange(${start}, ${lastIndex})`)
				const hint = checkpointHint(id, start, lastIndex as bigint)
				start = hint
				return hint
			})
		},
		getClaimableEther: ([ids, hints]) =>
			(ids as bigint[]).map((id, index) => {
				const request = requestById(id)
				if (!isFinalized(id) || request.claimed) return 0n
				const hint = (hints as bigint[])[index]
				if (hint === undefined) throw new Error("Panic(0x32)")
				if (hint === 0n || hint > lastCheckpointIndex) throw new Error(`InvalidHint(${hint})`)
				if (id < checkpointFrom(hint)) throw new Error(`InvalidHint(${hint})`)
				if (hint < lastCheckpointIndex && checkpointFrom(hint + 1n) <= id)
					throw new Error(`InvalidHint(${hint})`)
				return request.claimable ?? request.stEth
			}),
	}

	const token: Handlers = {
		decimals: () => 18,
		symbol: () => "stETH",
		balanceOf: ([owner]) =>
			Object.entries(balances).find(([address]) => sameAddress(address, owner as string))?.[1] ??
			0n,
	}

	const call = (to: string, data: Hex): Hex => {
		if (sameAddress(to, mainnet.contracts.multicall3.address)) {
			const decoded = decodeFunctionData({ abi: multicall3Abi, data })
			if (decoded.functionName !== "aggregate3")
				throw new Error(`multicall has no ${decoded.functionName}`)
			const [calls] = decoded.args
			return encodeFunctionResult({
				abi: multicall3Abi,
				functionName: "aggregate3",
				result: calls.map((entry) => {
					try {
						return { success: true, returnData: call(entry.target, entry.callData) }
					} catch (error) {
						if (!entry.allowFailure) throw error
						return { success: false, returnData: revertData(error) }
					}
				}),
			})
		}
		if (sameAddress(to, lidoMainnet.withdrawalQueue))
			return dispatch(withdrawalQueueAbi, withdrawalQueue, data)
		if (sameAddress(to, lidoMainnet.token.address)) return dispatch(erc20Abi, token, data)
		throw new Error(`no contract at ${to}`)
	}

	return custom({
		request: async ({ method, params }: { method: string; params?: unknown }) => {
			if (method === "eth_chainId") return "0x1"
			if (method === "eth_blockNumber") return "0x10"
			if (method === "eth_call") {
				const [{ to, data }] = params as [{ to: string; data: Hex }]
				try {
					return call(to, data)
				} catch (error) {
					throw Object.assign(new Error("execution reverted"), { code: 3, data: revertData(error) })
				}
			}
			throw new Error(`unexpected ${method}`)
		},
	})
}

type Summary = { address: string; unlocking: bigint; unlockings: bigint[]; claimable: bigint }

const summarize = (stakes: ReturnType<typeof useStakes>["data"]): Summary[] =>
	stakes.map((stake) => ({
		address: stake.account.address,
		unlocking: stake.totalUnlocking.planck,
		unlockings: stake.unlockings.map((unlock) => unlock.amount.planck),
		claimable: stake.claimable.planck,
	}))

const renderStakes = (accounts: Account[], queue: Queue, balances: Record<string, bigint>) => {
	const config = createConfig({
		chains: [mainnet],
		transports: { [mainnet.id]: fakeMainnet(queue, balances) },
		multiInjectedProviderDiscovery: false,
	})
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
	const wrapper = ({ children }: { children: ReactNode }) => (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	)
	const { result } = renderHook(() => useStakes(accounts, lidoMainnet), { wrapper })
	return (expected: Summary[]) =>
		vi.waitFor(() => expect(summarize(result.current.data)).toEqual(expected), { timeout: 4000 })
}

const evmAccount = (address: string): Account => ({ address, type: "ethereum" })

const alice = "0x1111111111111111111111111111111111111111"
const bob = "0x2222222222222222222222222222222222222222"
const carol = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
const dave = "0x4444444444444444444444444444444444444444"
const erin = "0x5555555555555555555555555555555555555555"
const frank = "0x6666666666666666666666666666666666666666"

const checkpointsFrom = [1n, 5n, 8n]

describe("lido stakes", () => {
	it("counts every withdrawal request of an account against its own status and claimable amount", async () => {
		const expectStakes = renderStakes(
			[evmAccount(alice), evmAccount(bob)],
			{
				lastFinalizedRequestId: 10n,
				checkpointsFrom,
				requests: [
					{ id: 7n, owner: alice, stEth: parseEther("3"), claimable: parseEther("2.9") },
					{ id: 2n, owner: alice, stEth: parseEther("1.5") },
					{ id: 11n, owner: alice, stEth: parseEther("4") },
					{ id: 4n, owner: bob, stEth: parseEther("1"), claimed: true },
					{ id: 9n, owner: bob, stEth: parseEther("0.5") },
					{ id: 5n, owner: bob, stEth: parseEther("2") },
				],
			},
			{ [alice]: parseEther("10") }
		)

		await expectStakes([
			{
				address: alice,
				unlocking: parseEther("4"),
				unlockings: [parseEther("4")],
				claimable: parseEther("4.4"),
			},
			{ address: bob, unlocking: 0n, unlockings: [], claimable: parseEther("2.5") },
		])
	})

	it("keeps the request of an address looked up in lowercase", async () => {
		expect(getAddress(carol)).not.toBe(carol)
		const expectStakes = renderStakes(
			[evmAccount(carol)],
			{
				lastFinalizedRequestId: 10n,
				checkpointsFrom,
				requests: [{ id: 6n, owner: carol, stEth: parseEther("3") }],
			},
			{}
		)

		await expectStakes([
			{ address: carol, unlocking: 0n, unlockings: [], claimable: parseEther("3") },
		])
	})

	it("shows a claimable amount while other accounts hold several pending requests", async () => {
		const expectStakes = renderStakes(
			[evmAccount(dave), evmAccount(erin), evmAccount(frank)],
			{
				lastFinalizedRequestId: 10n,
				checkpointsFrom,
				requests: [
					{ id: 8n, owner: dave, stEth: parseEther("2") },
					{ id: 12n, owner: erin, stEth: parseEther("1") },
					{ id: 15n, owner: frank, stEth: parseEther("5") },
				],
			},
			{}
		)

		await expectStakes([
			{ address: dave, unlocking: 0n, unlockings: [], claimable: parseEther("2") },
			{ address: erin, unlocking: parseEther("1"), unlockings: [parseEther("1")], claimable: 0n },
			{ address: frank, unlocking: parseEther("5"), unlockings: [parseEther("5")], claimable: 0n },
		])
	})
})
