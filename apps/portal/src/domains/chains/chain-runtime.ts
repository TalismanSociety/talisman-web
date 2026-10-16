import {
	getDynamicBuilder,
	getLookupFn,
	type MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { type Codec, decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import type { PolkadotClient, TxCallData, TypedApi } from "polkadot-api"
import { defer } from "rxjs"

import { getPapiClient } from "./papi-client"
import type { PortalRuntime } from "./portal-runtime"

type ChainSpecData = Awaited<ReturnType<PolkadotClient["getChainSpecData"]>>

export type ChainRuntime = {
	client: PolkadotClient
	api: TypedApi<PortalRuntime, false>
	lookup: MetadataLookup
	chainSpec: ChainSpecData
	encodeCall: (call: TxCallData) => Uint8Array
}

export const callEncoderOf = (lookup: MetadataLookup) => {
	if (lookup.call === null) throw new Error("Metadata has no runtime call type")
	const codec = getDynamicBuilder(lookup).buildDefinition(lookup.call) as Codec<TxCallData>
	return (call: TxCallData) => codec.enc(call)
}

export const txFromCall = (runtime: ChainRuntime, call: TxCallData) =>
	runtime.api.txFromCallData(runtime.encodeCall(call))

const palletOf = (lookup: MetadataLookup, pallet: string) =>
	lookup.metadata.pallets.find(({ name }) => name === pallet)

export const hasPallet = (lookup: MetadataLookup, pallet: string) =>
	palletOf(lookup, pallet) !== undefined

export const hasStorage = (lookup: MetadataLookup, pallet: string, item: string) =>
	palletOf(lookup, pallet)?.storage?.items.some(({ name }) => name === item) ?? false

export const constantOf = <T>(lookup: MetadataLookup, pallet: string, name: string) => {
	const constant = palletOf(lookup, pallet)?.constants.find((entry) => entry.name === name)
	if (!constant) return undefined
	return getDynamicBuilder(lookup).buildConstant(pallet, name).dec(constant.value) as T
}

const loadChainRuntime = async (client: PolkadotClient): Promise<ChainRuntime> => {
	const api = client.getUnsafeApi<PortalRuntime>()
	const [chainSpec, { hash }] = await Promise.all([
		client.getChainSpecData(),
		client.getFinalizedBlock(),
	])
	const metadata = await client.getMetadata(hash)
	const lookup = getLookupFn(unifyMetadata(decAnyMetadata(metadata)))
	return { client, api, lookup, chainSpec, encodeCall: callEncoderOf(lookup) }
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
