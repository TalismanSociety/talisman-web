import type { PolkadotClient } from "polkadot-api"
import { createWsClient } from "polkadot-api/ws"

import { networks } from "../../../public/chaindata.json"
import { chainMetadataCache } from "./metadata-cache"

type ShippedNetwork = { genesisHash?: string; rpcs?: string[] }

const rpcsByGenesisHash = (genesisHash: string) =>
	(networks as ShippedNetwork[]).find((network) => network.genesisHash === genesisHash)?.rpcs ?? []

const clientsByRpcs = new Map<string, PolkadotClient>()

export const getPapiClient = (genesisHash: string): PolkadotClient => {
	const rpcs = rpcsByGenesisHash(genesisHash)
	if (rpcs.length === 0) throw new Error(`No RPC known for chain ${genesisHash}`)
	const key = rpcs.join(",")
	const client = clientsByRpcs.get(key) ?? createWsClient(rpcs, chainMetadataCache)
	clientsByRpcs.set(key, client)
	return client
}
