import type { MetadataLookup } from "@polkadot-api/metadata-builders"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { Transaction, TxEvent, TxInBestBlock } from "polkadot-api"
import { Subject } from "rxjs"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { chainReadId$ } from "@/domains/common/chainReadId"
import { HarmlessError } from "@/domains/common/errors"
import { estimateTxFee, useTx } from "./useTx"

const txHash = "0x01"
const block = { hash: "0xb10c", number: 42, index: 3 }

const { GENESIS, alice, txCreator, toastExtrinsic, track, signetAccount$, send, of } =
	await vi.hoisted(async () => {
		const { BehaviorSubject, of } = await import("rxjs")
		return {
			GENESIS: "0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a" as const,
			alice: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
			txCreator: { sign: "alice" },
			toastExtrinsic: vi.fn(),
			track: vi.fn(),
			signetAccount$: new BehaviorSubject<{ address: string } | undefined>(undefined),
			send: vi.fn(),
			of,
		}
	})

vi.mock("@/domains/chains/chain-runtime", () => ({
	getChainRuntime$: () =>
		of({ lookup: { metadata: { pallets: [] } } as unknown as MetadataLookup }),
}))
vi.mock("@/domains/chains/chaindata-provider", () => ({
	networksByGenesisHash$: of({
		[GENESIS]: {
			id: "kusama-asset-hub",
			blockExplorerUrls: ["https://kusama.statescan.io/", "https://assethub-kusama.subscan.io/"],
		},
	}),
}))
vi.mock("@/domains/extension/substrate", () => ({
	txCreatorOf: async (address: string) => (address === alice ? txCreator : undefined),
	connectedSubstrateWallet$: of(undefined),
	injectedSubstrateAccounts$: of([]),
}))
vi.mock("@/domains/extension/signet", () => ({ signetAccount$, signetSdk: () => ({ send }) }))
vi.mock("@/domains/common/utils/toast", () => ({ toastExtrinsic }))
vi.mock("@/domains/analytics/client", () => ({ track }))
vi.mock("polkadot-api/tx-creator", () => ({
	getFakeTxCreator: (address: string) => ({ fakeSignerFor: address }),
}))

const fakeTx = (call = { type: "NominationPools", value: { type: "claim_payout" } }) => {
	const events$ = new Subject<TxEvent>()
	const tx = {
		decodedCall: call,
		createSubmitAndWatch: vi.fn(() => events$.asObservable()),
		getEstimatedFees: vi.fn(async () => 123n),
		getEncodedData: vi.fn(async () => new Uint8Array([0x29, 0x12])),
	}
	return { events$, tx: tx as unknown as Transaction, calls: tx }
}

const included = (
	payload: { ok: true } | { ok: false; dispatchError: { type: string; value: unknown } }
) =>
	({
		type: "inBestBlock",
		txHash,
		block,
		events: [],
		...payload,
	}) as TxInBestBlock

const finalize = (events$: Subject<TxEvent>, event: TxInBestBlock) => {
	events$.next(event)
	events$.next({ ...event, type: "finalized" })
}

beforeEach(() => {
	toastExtrinsic.mockClear()
	track.mockClear()
	send.mockClear()
	signetAccount$.next(undefined)
})

afterEach(() => vi.restoreAllMocks())

describe("useTx", () => {
	it("signs with the account's wallet, toasts the call in polkadot.js casing and reports it", async () => {
		const { events$, tx, calls } = fakeTx()
		const readsBefore = chainReadId$.value
		const { result } = renderHook(() => useTx(GENESIS, () => tx))

		let submission: Promise<unknown> | undefined
		act(() => {
			submission = result.current.signAndSend(alice)
		})
		await waitFor(() => expect(result.current.state).toBe("loading"))
		await waitFor(() => expect(calls.createSubmitAndWatch).toHaveBeenCalled())
		expect(calls.createSubmitAndWatch).toHaveBeenCalledWith(txCreator, {
			customSignedExtensions: {},
		})
		expect(toastExtrinsic).toHaveBeenCalledWith(
			[["nominationPools", "claimPayout"]],
			expect.any(Promise),
			"https://assethub-kusama.subscan.io/"
		)

		act(() => finalize(events$, included({ ok: true })))

		await expect(submission).resolves.toEqual({
			txHash,
			blockNumber: 42,
			txIndex: 3,
			events: [],
		})
		expect(track).toHaveBeenCalledWith("Extrinsic in block", {
			chain: "kusama-asset-hub",
			module: "nominationPools",
			section: "claimPayout",
		})
		expect(chainReadId$.value).toBe(readsBefore + 1)
		await waitFor(() => expect(result.current.state).toBe("hasValue"))
	})

	it("waits for a builder that resolves the transaction from call data", async () => {
		const { events$, tx, calls } = fakeTx()
		const { result } = renderHook(() => useTx(GENESIS, async () => tx))

		let submission: Promise<unknown> | undefined
		act(() => {
			submission = result.current.signAndSend(alice)
		})
		await waitFor(() => expect(calls.createSubmitAndWatch).toHaveBeenCalled())
		act(() => finalize(events$, included({ ok: true })))

		await expect(submission).resolves.toEqual({ txHash, blockNumber: 42, txIndex: 3, events: [] })
	})

	it("reports each call of a batch with its parent", async () => {
		const { events$, tx } = fakeTx({
			type: "Utility",
			value: {
				type: "batch_all",
				value: {
					calls: [
						{ type: "NominationPools", value: { type: "join" } },
						{ type: "NominationPools", value: { type: "set_claim_permission" } },
					],
				},
			},
		} as never)
		const { result } = renderHook(() => useTx(GENESIS, () => tx))

		const submission = result.current.signAndSend(alice)
		await waitFor(() => expect(toastExtrinsic).toHaveBeenCalled())
		act(() => finalize(events$, included({ ok: true })))
		await submission

		expect(track.mock.calls).toEqual([
			["Extrinsic in block", { chain: "kusama-asset-hub", module: "utility", section: "batchAll" }],
			[
				"Extrinsic in block",
				{
					chain: "kusama-asset-hub",
					module: "nominationPools",
					section: "join",
					parent_module: "utility",
					parent_section: "batchAll",
				},
			],
			[
				"Extrinsic in block",
				{
					chain: "kusama-asset-hub",
					module: "nominationPools",
					section: "setClaimPermission",
					parent_module: "utility",
					parent_section: "batchAll",
				},
			],
		])
	})

	it("treats a wallet refusal as harmless and reports nothing", async () => {
		const { events$, tx } = fakeTx()
		const { result } = renderHook(() => useTx(GENESIS, () => tx))

		const submission = result.current.signAndSend(alice)
		await waitFor(() => expect(toastExtrinsic).toHaveBeenCalled())
		act(() => events$.error(new Error("Cancelled")))

		await expect(submission).rejects.toBeInstanceOf(HarmlessError)
		await waitFor(() => expect(result.current.state).toBe("hasError"))
		expect(track).not.toHaveBeenCalled()
	})

	it("surfaces a dispatch error and reports no inclusion", async () => {
		const { events$, tx } = fakeTx()
		const { result } = renderHook(() => useTx(GENESIS, () => tx))

		const submission = result.current.signAndSend(alice)
		await waitFor(() => expect(toastExtrinsic).toHaveBeenCalled())
		act(() =>
			finalize(
				events$,
				included({
					ok: false,
					dispatchError: { type: "Token", value: { type: "FundsUnavailable" } },
				})
			)
		)

		await expect(submission).rejects.toThrow("Funds are unavailable.")
		await expect(submission).rejects.not.toBeInstanceOf(HarmlessError)
		expect(track).not.toHaveBeenCalled()
	})

	it("refuses an account no connected wallet can sign for", async () => {
		const { tx } = fakeTx()
		const { result } = renderHook(() => useTx(GENESIS, () => tx))

		await expect(
			result.current.signAndSend("5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty")
		).rejects.toThrow(
			"No connected wallet can sign for 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
		)
	})

	it("hands the call data to Signet for the Signet account, without a toast", async () => {
		signetAccount$.next({ address: alice })
		send.mockResolvedValue({ ok: true, receipt: { txHash } })
		const { tx, calls } = fakeTx()
		const { result } = renderHook(() => useTx(GENESIS, () => tx))

		await expect(result.current.signAndSend(alice)).rejects.toBeInstanceOf(HarmlessError)

		expect(send).toHaveBeenCalledWith("0x2912")
		expect(calls.createSubmitAndWatch).not.toHaveBeenCalled()
		expect(toastExtrinsic).not.toHaveBeenCalled()
	})

	it("fails loudly when Signet rejects the call", async () => {
		signetAccount$.next({ address: alice })
		send.mockResolvedValue({ ok: false, error: "rejected" })
		const { tx } = fakeTx()
		const { result } = renderHook(() => useTx(GENESIS, () => tx))

		await expect(result.current.signAndSend(alice)).rejects.toThrow(
			"Failed to approve transaction in Signet"
		)
	})
})

describe("estimateTxFee", () => {
	it("estimates with a mock signature for the account and the chain's signed extensions", async () => {
		const { tx, calls } = fakeTx()

		expect(await estimateTxFee(GENESIS, alice, tx)).toBe(123n)
		expect(calls.getEstimatedFees).toHaveBeenCalledWith(
			{ fakeSignerFor: alice },
			{ customSignedExtensions: {} }
		)
	})

	it("estimates for an account no connected wallet holds, such as a Signet vault", async () => {
		const vault = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
		const { tx, calls } = fakeTx()

		expect(await estimateTxFee(GENESIS, vault, tx)).toBe(123n)
		expect(calls.getEstimatedFees).toHaveBeenCalledWith(
			{ fakeSignerFor: vault },
			{ customSignedExtensions: {} }
		)
	})
})
