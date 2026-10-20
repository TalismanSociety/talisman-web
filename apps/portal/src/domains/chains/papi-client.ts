import { withLegacy } from "@polkadot-api/ws-middleware"
import { getWsProvider, type Middleware } from "@polkadot-api/ws-provider"
import { createClient, type PolkadotClient } from "polkadot-api"
import { createWsClient } from "polkadot-api/ws"
import { withAvailHeaders } from "./avail-headers"
import { networks } from "./chaindata.json"
import { chainMetadataCache } from "./metadata-cache"

type ShippedNetwork = { id: string; genesisHash?: string; rpcs?: string[] }

const LEGACY_RPC_MIDDLEWARES: Record<string, Middleware> = {
	astar: withLegacy,
	bittensor: withLegacy,
	avail: (base) => withLegacy(withAvailHeaders(base)),
}

const networkOf = (genesisHash: string) =>
	(networks as ShippedNetwork[]).find((network) => network.genesisHash === genesisHash)

const CONNECT_TIMEOUT_MS = 20_000

const clientConfig = { ...chainMetadataCache, timeout: CONNECT_TIMEOUT_MS }

const openClient = (networkId: string, rpcs: string[]) => {
	const middleware = LEGACY_RPC_MIDDLEWARES[networkId]
	return middleware
		? createClient(
				getWsProvider(rpcs, { middleware, timeout: CONNECT_TIMEOUT_MS }),
				chainMetadataCache
			)
		: createWsClient(rpcs, clientConfig)
}

const clientsByRpcs = new Map<string, PolkadotClient>()

export const getPapiClient = (genesisHash: string): PolkadotClient => {
	const network = networkOf(genesisHash)
	const rpcs = network?.rpcs ?? []
	if (!network || rpcs.length === 0) throw new Error(`No RPC known for chain ${genesisHash}`)
	const key = rpcs.join(",")
	const client = clientsByRpcs.get(key) ?? openClient(network.id, rpcs)
	clientsByRpcs.set(key, client)
	return client
}
