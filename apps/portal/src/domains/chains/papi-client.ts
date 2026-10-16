import { withLegacy } from "@polkadot-api/ws-middleware"
import { getWsProvider } from "@polkadot-api/ws-provider"
import { createClient, type PolkadotClient } from "polkadot-api"
import { createWsClient } from "polkadot-api/ws"

import { networks } from "../../../public/chaindata.json"
import { chainMetadataCache } from "./metadata-cache"

type ShippedNetwork = { id: string; genesisHash?: string; rpcs?: string[] }

const LOAD_BALANCED_RPC_NETWORKS = new Set(["bittensor"])

const networkOf = (genesisHash: string) =>
	(networks as ShippedNetwork[]).find((network) => network.genesisHash === genesisHash)

const openClient = (networkId: string, rpcs: string[]) =>
	LOAD_BALANCED_RPC_NETWORKS.has(networkId)
		? createClient(getWsProvider(rpcs, { middleware: withLegacy }), chainMetadataCache)
		: createWsClient(rpcs, chainMetadataCache)

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
