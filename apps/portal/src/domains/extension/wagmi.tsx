import { type EthNetwork, isNetworkEth } from "@talismn/chaindata-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"
import { useEffect, useMemo, useState } from "react"
import type { EIP1193Provider } from "viem"
import { createConfig, fallback, http, WagmiProvider } from "wagmi"
import { injected } from "wagmi/connectors"
import { useNetworksById } from "@/domains/chains/chaindata-provider"
import { evmChains as chains } from "./evmChains"

declare global {
	interface Window {
		talismanEth?: EIP1193Provider
	}
}

// Create wagmi config with chaindata RPCs
const createWagmiConfigWithChaindata = (evmNetworks: EthNetwork[]) =>
	createConfig({
		chains,
		connectors: [injected()],
		transports: Object.fromEntries(
			chains.map((chain) => {
				const network = evmNetworks.find((n) => n.id === chain.id.toString())
				const rpcs = network?.rpcs ?? []
				return [chain.id, fallback([...rpcs.map((url) => http(url)), http()])]
			})
		) as Record<(typeof chains)[number]["id"], ReturnType<typeof fallback>>,
	})

// Default config without chaindata (used during initial load)
const defaultConfig = createConfig({
	chains,
	connectors: [injected()],
	transports: Object.fromEntries(chains.map((chain) => [chain.id, fallback([http()])])) as Record<
		(typeof chains)[number]["id"],
		ReturnType<typeof fallback>
	>,
})

export const wagmiConfig = defaultConfig

const migrate = () => {
	const legacyKey = "connected-eip-6963-provider"
	const legacyConnectorId = localStorage.getItem(legacyKey)

	if (legacyConnectorId !== null && wagmiConfig.storage?.key !== undefined) {
		localStorage.setItem(`${wagmiConfig.storage.key}.recentConnectorId`, legacyConnectorId)
		localStorage.removeItem(legacyKey)
	}
}

migrate()

const queryClient = new QueryClient()

export const EvmProvider = (props: PropsWithChildren) => {
	const networks = useNetworksById()
	const evmNetworks = useMemo(() => Object.values(networks).filter(isNetworkEth), [networks])
	const [config, setConfig] = useState(defaultConfig)

	useEffect(() => {
		if (evmNetworks.length > 0) {
			const newConfig = createWagmiConfigWithChaindata(evmNetworks)
			setConfig(newConfig)
		}
	}, [evmNetworks])

	return (
		<WagmiProvider config={config} reconnectOnMount>
			<QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
		</WagmiProvider>
	)
}
