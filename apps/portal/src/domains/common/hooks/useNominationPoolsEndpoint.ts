import { isNetworkDot, type NetworkId } from "@talismn/chaindata-provider"
import { useMemo } from "react"

import { useNetworksById } from "@/domains/chains/chaindata-provider"

export const useNominationPoolsEndpoint = (
	chainId: NetworkId | null | undefined
): string | null => {
	const networks = useNetworksById()

	return useMemo(() => {
		const network = chainId ? networks[chainId] : undefined
		if (!network || !isNetworkDot(network)) return null

		const stakingNetwork =
			network.topology.type === "parachain" ? networks[network.topology.relayId] : network
		return stakingNetwork?.rpcs?.[0] ?? null
	}, [chainId, networks])
}
