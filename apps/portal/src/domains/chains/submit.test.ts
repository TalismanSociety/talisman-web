import type { MetadataLookup } from "@polkadot-api/metadata-builders"
import { InvalidTxError, type TxEvent, type TxFinalized, type TxInBestBlock } from "polkadot-api"
import { Subject } from "rxjs"
import { describe, expect, it, vi } from "vitest"
import { TxFailedError, TxInvalidError, watchTx } from "./submit"

const POOLS_ERRORS_TYPE = 7

const lookup = Object.assign(
	(id: number) =>
		id === POOLS_ERRORS_TYPE
			? {
					type: "enum",
					innerDocs: { PoolMemberNotFound: ["An account is not a member", "of a pool."] },
				}
			: undefined,
	{ metadata: { pallets: [{ name: "NominationPools", errors: { type: POOLS_ERRORS_TYPE } }] } }
) as unknown as MetadataLookup

const txHash = "0x01"
const block = { hash: "0xb10c", number: 42, index: 3 }

const event = (type: string, value: unknown) => ({
	phase: { type: "ApplyExtrinsic", value: block.index },
	event: { type, value },
	type,
	value,
	topics: [],
})

const inBestBlock = (
	payload: { ok: true } | { ok: false; dispatchError: { type: string; value: unknown } },
	events = [event("System", { type: "ExtrinsicSuccess", value: {} })]
) => ({ type: "inBestBlock", txHash, block, events, ...payload }) as TxInBestBlock

const finalized = (included: TxInBestBlock): TxFinalized => ({ ...included, type: "finalized" })

const settled = async (promise: Promise<unknown>) => {
	let state = "pending"
	promise.then(
		() => {
			state = "resolved"
		},
		() => {
			state = "rejected"
		}
	)
	await new Promise((resolve) => setTimeout(resolve))
	return state
}

describe("watchTx", () => {
	it("resolves at the finalized event with hash, block number, index and events", async () => {
		const events$ = new Subject<TxEvent>()
		const result = watchTx(events$, lookup)
		const included = inBestBlock({ ok: true })
		events$.next(included)
		events$.next(finalized(included))

		await expect(result).resolves.toEqual({
			txHash,
			blockNumber: 42,
			txIndex: 3,
			events: included.events,
		})
	})

	it("stays pending through signing, broadcast and a best block until finality", async () => {
		const events$ = new Subject<TxEvent>()
		const result = watchTx(events$, lookup)
		events$.next({ type: "created", txHash })
		events$.next({ type: "broadcasted", txHash })
		const included = inBestBlock({ ok: true })
		events$.next(included)
		expect(await settled(result)).toBe("pending")

		events$.next(finalized(included))

		expect(await settled(result)).toBe("resolved")
	})

	it("reports every event and the best-block inclusion to the watchers", async () => {
		const events$ = new Subject<TxEvent>()
		const onEvent = vi.fn()
		const onInBestBlock = vi.fn()
		const result = watchTx(events$, lookup, { onEvent, onInBestBlock })
		const included = inBestBlock({ ok: true })
		events$.next({ type: "created", txHash })
		events$.next(included)
		events$.next(finalized(included))
		await result

		expect(onEvent.mock.calls.map(([event]) => event.type)).toEqual([
			"created",
			"inBestBlock",
			"finalized",
		])
		expect(onInBestBlock).toHaveBeenCalledTimes(1)
		expect(onInBestBlock).toHaveBeenCalledWith(included)
	})

	it("explains a module dispatch error from the pallet's docs, with the tx hash", async () => {
		const events$ = new Subject<TxEvent>()
		const result = watchTx(events$, lookup)
		const failed = inBestBlock({
			ok: false,
			dispatchError: {
				type: "Module",
				value: { type: "NominationPools", value: { type: "PoolMemberNotFound" } },
			},
		})
		events$.next(failed)
		events$.next(finalized(failed))

		await expect(result).rejects.toThrow("An account is not a member of a pool.")
		await expect(result).rejects.toBeInstanceOf(TxFailedError)
		await expect(result).rejects.toMatchObject({ txHash })
	})

	it("names an undocumented module error by pallet and variant", async () => {
		const events$ = new Subject<TxEvent>()
		const result = watchTx(events$, lookup)
		const failed = inBestBlock({
			ok: false,
			dispatchError: { type: "Module", value: { type: "Staking", value: { type: "NotStash" } } },
		})
		events$.next(failed)
		events$.next(finalized(failed))

		await expect(result).rejects.toThrow("Staking.NotStash")
	})

	it("translates a token error", async () => {
		const events$ = new Subject<TxEvent>()
		const result = watchTx(events$, lookup)
		const failed = inBestBlock({
			ok: false,
			dispatchError: { type: "Token", value: { type: "FundsUnavailable" } },
		})
		events$.next(failed)
		events$.next(finalized(failed))

		await expect(result).rejects.toThrow("Funds are unavailable.")
	})

	it("explains an invalid transaction and keeps its reason", async () => {
		const events$ = new Subject<TxEvent>()
		const result = watchTx(events$, lookup)
		events$.error(new InvalidTxError({ type: "Invalid", value: { type: "Payment" } }))

		await expect(result).rejects.toThrow(
			"Inability to pay some fees (e.g. account balance too low)"
		)
		await expect(result).rejects.toBeInstanceOf(TxInvalidError)
		await expect(result).rejects.toMatchObject({ reason: "Payment" })
	})

	it("falls back to the validity variant for an unlisted reason", async () => {
		const events$ = new Subject<TxEvent>()
		const result = watchTx(events$, lookup)
		events$.error(new InvalidTxError({ type: "Unknown", value: { type: "Custom" } }))

		await expect(result).rejects.toThrow("Unknown transaction: Custom")
	})

	it("passes a wallet refusal through untouched", async () => {
		const events$ = new Subject<TxEvent>()
		const result = watchTx(events$, lookup)
		events$.error(new Error("Cancelled"))

		await expect(result).rejects.toThrow("Cancelled")
		await expect(result).rejects.not.toBeInstanceOf(TxInvalidError)
	})
})
