// @vitest-environment node
import { metadata } from "@polkadot-api/substrate-bindings"
import { IDBFactory } from "fake-indexeddb"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createMetadataCache } from "./metadata-cache"

const DAY_MS = 24 * 60 * 60 * 1_000
const T0 = Date.UTC(2026, 0, 1)
const EVICTION_DELAY_MS = 10_000
const READ_TIMEOUT_MS = 2_000

const metadataBytes = (fill: number) =>
	new Uint8Array([0x6d, 0x65, 0x74, 0x61, 0x0f, fill, fill, fill])

const decodableMetadata = () =>
	metadata.enc({
		magicNumber: 0x6174656d,
		metadata: {
			tag: "v14",
			value: {
				lookup: [],
				pallets: [],
				extrinsic: { type: 0, version: 4, signedExtensions: [] },
				type: 0,
				apis: [],
			},
		},
	})

const undecodableMetadata = () => new Uint8Array([0x6d, 0x65, 0x74, 0x61, 0x0e, 0xff, 0xff, 0xff])

const withDatabase = async <T>(
	factory: IDBFactory,
	use: (db: IDBDatabase) => Promise<T>
): Promise<T> => {
	const request = factory.open("talisman-portal-chain-metadata", 1)
	request.onupgradeneeded = () => {
		request.result.createObjectStore("metadata")
		request.result.createObjectStore("lastReadAt")
	}
	const db = await new Promise<IDBDatabase>((resolve, reject) => {
		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})
	try {
		return await use(db)
	} finally {
		db.close()
	}
}

const storedKeys = (factory: IDBFactory) =>
	withDatabase(factory, (db) => {
		const transaction = db.transaction(["metadata", "lastReadAt"], "readonly")
		const keysOf = (store: string) =>
			new Promise<IDBValidKey[]>((resolve, reject) => {
				const request = transaction.objectStore(store).getAllKeys()
				request.onsuccess = () => resolve(request.result)
				request.onerror = () => reject(request.error)
			})
		return Promise.all([keysOf("metadata"), keysOf("lastReadAt")]).then(
			([metadata, lastReadAt]) => ({ metadata, lastReadAt })
		)
	})

const storeRaw = (factory: IDBFactory, codeHash: string, metadata: unknown) =>
	withDatabase(
		factory,
		(db) =>
			new Promise<void>((resolve, reject) => {
				const transaction = db.transaction(["metadata", "lastReadAt"], "readwrite")
				transaction.objectStore("metadata").put(metadata, codeHash)
				transaction.objectStore("lastReadAt").put(T0, codeHash)
				transaction.oncomplete = () => resolve()
				transaction.onerror = () => reject(transaction.error)
			})
	)

describe("createMetadataCache", () => {
	let factory: IDBFactory
	let clock: number
	let cache: ReturnType<typeof createMetadataCache>

	beforeEach(() => {
		vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] })
		factory = new IDBFactory()
		clock = T0
		cache = createMetadataCache({ indexedDB: factory, now: () => clock, isDecodable: () => true })
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	const runScheduledEviction = () => vi.advanceTimersByTimeAsync(EVICTION_DELAY_MS)

	it("misses an unknown code hash and returns the stored bytes once set", async () => {
		expect(await cache.getMetadata("0xa")).toBeNull()

		cache.setMetadata("0xa", metadataBytes(1))

		expect(await cache.getMetadata("0xa")).toEqual(metadataBytes(1))
	})

	it("stores under the portal's own database, keyed by code hash", async () => {
		cache.setMetadata("0xa", metadataBytes(1))
		await cache.getMetadata("0xa")

		expect(await storedKeys(factory)).toEqual({ metadata: ["0xa"], lastReadAt: ["0xa"] })
	})

	it("forgets an entry that no longer decodes instead of returning it", async () => {
		const strict = createMetadataCache({ indexedDB: factory, now: () => clock })
		await storeRaw(factory, "0xbad", undecodableMetadata())
		await storeRaw(factory, "0xgood", decodableMetadata())

		expect(await strict.getMetadata("0xbad")).toBeNull()
		expect(await strict.getMetadata("0xgood")).toEqual(decodableMetadata())
		await vi.advanceTimersByTimeAsync(0)
		expect(await storedKeys(factory)).toEqual({ metadata: ["0xgood"], lastReadAt: ["0xgood"] })
	})

	it("refuses to store metadata that does not decode", async () => {
		const strict = createMetadataCache({ indexedDB: factory, now: () => clock })

		strict.setMetadata("0xbad", undecodableMetadata())
		await vi.advanceTimersByTimeAsync(0)

		expect(await strict.getMetadata("0xbad")).toBeNull()
	})

	it("forgets a stored value that is not bytes", async () => {
		await storeRaw(factory, "0xtext", "not bytes")

		expect(await cache.getMetadata("0xtext")).toBeNull()
		await vi.advanceTimersByTimeAsync(0)
		expect(await storedKeys(factory)).toEqual({ metadata: [], lastReadAt: [] })
	})

	it("evicts entries unread for 60 days and keeps the ones read since", async () => {
		await storeRaw(factory, "0xold", metadataBytes(1))
		await storeRaw(factory, "0xfresh", metadataBytes(2))
		clock = T0 + 61 * DAY_MS
		expect(await cache.getMetadata("0xfresh")).toEqual(metadataBytes(2))

		await runScheduledEviction()

		expect(await storedKeys(factory)).toEqual({ metadata: ["0xfresh"], lastReadAt: ["0xfresh"] })
	})

	it("answers null when the database is slow to read", async () => {
		const stalled = createMetadataCache({
			indexedDB: { open: () => ({}) as IDBOpenDBRequest },
			now: () => clock,
		})

		const read = stalled.getMetadata("0xa")
		await vi.advanceTimersByTimeAsync(READ_TIMEOUT_MS)

		expect(await read).toBeNull()
	})

	it("answers null without indexedDB", async () => {
		const memoryless = createMetadataCache({ indexedDB: undefined, now: () => clock })
		memoryless.setMetadata("0xa", metadataBytes(1))

		expect(await memoryless.getMetadata("0xa")).toBeNull()
	})
})
