import { metadata as metadataCodec, unifyMetadata } from "@polkadot-api/substrate-bindings"

const DATABASE_NAME = "talisman-portal-chain-metadata"
const DATABASE_VERSION = 1
const METADATA = "metadata"
const LAST_READ_AT = "lastReadAt"

const READ_TIMEOUT_MS = 2_000
const EVICTION_DELAY_MS = 10_000
const UNREAD_LIFETIME_MS = 60 * 24 * 60 * 60 * 1_000

type MetadataCacheDependencies = {
	indexedDB: Pick<IDBFactory, "open"> | undefined
	now: () => number
	isDecodable?: (metadata: Uint8Array) => boolean
}

const decodesAsMetadata = (metadata: Uint8Array) => {
	try {
		unifyMetadata(metadataCodec.dec(metadata))
		return true
	} catch {
		return false
	}
}

const requestResult = <T>(request: IDBRequest<T>) =>
	new Promise<T>((resolve, reject) => {
		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})

const committed = (transaction: IDBTransaction) =>
	new Promise<void>((resolve, reject) => {
		transaction.oncomplete = () => resolve()
		transaction.onerror = () => reject(transaction.error)
		transaction.onabort = () => reject(transaction.error)
	})

const orNullAfter = <T>(promise: Promise<T | null>, timeoutMs: number) =>
	new Promise<T | null>((resolve) => {
		const timer = setTimeout(() => resolve(null), timeoutMs)
		promise.then((value) => {
			clearTimeout(timer)
			resolve(value)
		})
	})

export const createMetadataCache = ({
	indexedDB,
	now,
	isDecodable = decodesAsMetadata,
}: MetadataCacheDependencies) => {
	let database: Promise<IDBDatabase | null> | undefined

	const openDatabase = () => {
		database ??= new Promise<IDBDatabase | null>((resolve) => {
			if (!indexedDB) return resolve(null)
			const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
			request.onupgradeneeded = () => {
				request.result.createObjectStore(METADATA)
				request.result.createObjectStore(LAST_READ_AT)
			}
			request.onsuccess = () => {
				const db = request.result
				db.onversionchange = () => {
					db.close()
					database = undefined
				}
				setTimeout(evictUnread, EVICTION_DELAY_MS)
				resolve(db)
			}
			request.onerror = () => resolve(null)
			request.onblocked = () => resolve(null)
		})
		return database
	}

	const write = (
		stores: string[],
		apply: (transaction: IDBTransaction) => void,
		shouldWrite = () => true
	) => {
		openDatabase()
			.then((db) => {
				if (!db || !shouldWrite()) return
				const transaction = db.transaction(stores, "readwrite")
				apply(transaction)
				return committed(transaction)
			})
			.catch(() => {})
	}

	const forget = (transaction: IDBTransaction, codeHash: IDBValidKey) => {
		transaction.objectStore(METADATA).delete(codeHash)
		transaction.objectStore(LAST_READ_AT).delete(codeHash)
	}

	const evictUnread = () => {
		const evictedAt = now()
		write([METADATA, LAST_READ_AT], (transaction) => {
			const cursorRequest = transaction.objectStore(LAST_READ_AT).openCursor()
			cursorRequest.onsuccess = () => {
				const cursor = cursorRequest.result
				if (!cursor) return
				if (evictedAt - cursor.value > UNREAD_LIFETIME_MS) forget(transaction, cursor.key)
				cursor.continue()
			}
		})
	}

	const readMetadata = async (codeHash: string) => {
		const db = await openDatabase()
		if (!db) return null
		const stored: unknown = await requestResult(
			db.transaction(METADATA, "readonly").objectStore(METADATA).get(codeHash)
		)
		if (stored === undefined) return null
		if (!(stored instanceof Uint8Array) || !isDecodable(stored)) {
			write([METADATA, LAST_READ_AT], (transaction) => forget(transaction, codeHash))
			return null
		}
		const readAt = now()
		write([LAST_READ_AT], (transaction) =>
			transaction.objectStore(LAST_READ_AT).put(readAt, codeHash)
		)
		return stored
	}

	const getMetadata = (codeHash: string): Promise<Uint8Array | null> =>
		orNullAfter(
			readMetadata(codeHash).catch(() => null),
			READ_TIMEOUT_MS
		)

	const setMetadata = (codeHash: string, metadata: Uint8Array) => {
		const writtenAt = now()
		write(
			[METADATA, LAST_READ_AT],
			(transaction) => {
				transaction.objectStore(METADATA).put(metadata, codeHash)
				transaction.objectStore(LAST_READ_AT).put(writtenAt, codeHash)
			},
			() => isDecodable(metadata)
		)
	}

	return { getMetadata, setMetadata }
}

const browserIndexedDB = () => {
	try {
		return globalThis.indexedDB
	} catch {
		return undefined
	}
}

export const chainMetadataCache = createMetadataCache({
	indexedDB: browserIndexedDB(),
	now: Date.now,
})
