import type { ChaindataFile, NetworkId } from "@talismn/chaindata-provider"

import type { PortalNetwork } from "../../src/domains/chains/portal-networks.ts"

const KEYED_RPC = /apikey=|\/pk_|\/vk_/i

export const trimChaindata = (
	chaindata: ChaindataFile,
	portalNetworks: Record<NetworkId, PortalNetwork>
): ChaindataFile => {
	const ids = new Set(Object.keys(portalNetworks))
	const networks = chaindata.networks.filter((network) => ids.has(network.id))

	const missingNetworks = [...ids].filter((id) => !networks.some((network) => network.id === id))
	if (missingNetworks.length)
		throw new Error(`Networks missing from chaindata: ${missingNetworks.join(", ")}`)

	const tokenIds = new Set(
		networks.flatMap((network) => [
			network.nativeTokenId,
			...(portalNetworks[network.id]?.tokens ?? []),
		])
	)
	const tokens = chaindata.tokens.filter((token) => tokenIds.has(token.id))

	const missingTokens = [...tokenIds].filter((id) => !tokens.some((token) => token.id === id))
	if (missingTokens.length)
		throw new Error(`Tokens missing from chaindata: ${missingTokens.join(", ")}`)

	const nativeTokenLogos = new Map(
		networks
			.filter((network) => portalNetworks[network.id]?.networkLogoForNativeToken)
			.map((network) => [network.nativeTokenId, network.logo])
	)

	return {
		networks: networks.map((network) => {
			const rpc = portalNetworks[network.id]?.rpc
			const keyless = network.rpcs.filter((url) => !KEYED_RPC.test(url))
			return { ...network, rpcs: rpc ? [rpc, ...keyless.filter((url) => url !== rpc)] : keyless }
		}),
		tokens: tokens.map((token) =>
			nativeTokenLogos.has(token.id) ? { ...token, logo: nativeTokenLogos.get(token.id) } : token
		),
		miniMetadatas: chaindata.miniMetadatas.filter((metadata) => ids.has(metadata.chainId)),
	}
}
