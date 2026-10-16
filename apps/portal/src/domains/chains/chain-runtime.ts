import { getLookupFn, type MetadataLookup } from "@polkadot-api/metadata-builders"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import type { PolkadotClient, TypedApi } from "polkadot-api"
import { defer } from "rxjs"

import { getPapiClient } from "./papi-client"
import type { PortalRuntime } from "./portal-runtime"

type ChainSpecData = Awaited<ReturnType<PolkadotClient["getChainSpecData"]>>

export type ChainRuntime = {
	client: PolkadotClient
	api: TypedApi<PortalRuntime, false>
	lookup: MetadataLookup
	chainSpec: ChainSpecData
}

const loadChainRuntime = async (client: PolkadotClient): Promise<ChainRuntime> => {
	const api = client.getUnsafeApi<PortalRuntime>()
	const [chainSpec, { hash }] = await Promise.all([
		client.getChainSpecData(),
		client.getFinalizedBlock(),
	])
	const metadata = await client.getMetadata(hash)
	const lookup = getLookupFn(unifyMetadata(decAnyMetadata(metadata)))
	return { client, api, lookup, chainSpec }
}

const runtimesByClient = new WeakMap<PolkadotClient, Promise<ChainRuntime>>()

const chainRuntimeOf = (client: PolkadotClient) => {
	const cached = runtimesByClient.get(client)
	if (cached) return cached
	const runtime = loadChainRuntime(client)
	runtimesByClient.set(client, runtime)
	runtime.catch(() => runtimesByClient.delete(client))
	return runtime
}

export const getChainRuntime$ = (genesisHash: string) =>
	defer(() => chainRuntimeOf(getPapiClient(genesisHash)))
