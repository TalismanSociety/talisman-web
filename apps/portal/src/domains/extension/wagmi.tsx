import type { PropsWithChildren } from 'react'
import type { EIP1193Provider } from 'viem'
import { evmNetworksAtom } from '@talismn/balances-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { createConfig, fallback, http, WagmiProvider } from 'wagmi'
import { arbitrum, blast, bsc, mainnet, manta, moonbeam, moonriver, optimism, polygon } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const onFinalityRpc = import.meta.env.VITE_ON_FINALITY_RPC

if (!onFinalityRpc) {
  console.warn('VITE_ON_FINALITY_RPC is not set')
}

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    talismanEth?: EIP1193Provider
  }
}

// Type for EVM network from chaindata
type EvmNetwork = {
  id: string | number
  rpcs?: Array<{ url: string }> | null
}

// Create wagmi config with chaindata RPCs
const createWagmiConfigWithChaindata = (evmNetworks: EvmNetwork[]) => {
  // Helper to get RPCs from chaindata for a specific chain
  const getRpcTransports = (chainId: number) => {
    const network = evmNetworks.find(n => n.id.toString() === chainId.toString())
    const chaindataRpcs = network?.rpcs?.map(rpc => rpc.url).filter(Boolean) || []

    const rpcTransports = [
      ...(chainId === mainnet.id && onFinalityRpc ? [http(onFinalityRpc)] : []),
      ...chaindataRpcs.map((url: string) => http(url)),
      http(), // Default public RPC as last resort
    ]
    return fallback(rpcTransports)
  }

  return createConfig({
    chains: [bsc, mainnet, moonbeam, moonriver, arbitrum, polygon, optimism, blast, manta],
    connectors: [injected()],
    transports: {
      [mainnet.id]: getRpcTransports(mainnet.id),
      [arbitrum.id]: getRpcTransports(arbitrum.id),
      [moonbeam.id]: getRpcTransports(moonbeam.id),
      [moonriver.id]: getRpcTransports(moonriver.id),
      [manta.id]: getRpcTransports(manta.id),
      [bsc.id]: getRpcTransports(bsc.id),
      [polygon.id]: getRpcTransports(polygon.id),
      [optimism.id]: getRpcTransports(optimism.id),
      [blast.id]: getRpcTransports(blast.id),
    },
  })
}

// Default config without chaindata (used during initial load)
// Use fallback for all transports for consistent typing
const defaultConfig = createConfig({
  chains: [bsc, mainnet, moonbeam, moonriver, arbitrum, polygon, optimism, blast, manta],
  connectors: [injected()],
  transports: {
    [mainnet.id]: fallback([http(onFinalityRpc), http()]),
    [arbitrum.id]: fallback([http()]),
    [moonbeam.id]: fallback([http()]),
    [moonriver.id]: fallback([http()]),
    [manta.id]: fallback([http()]),
    [bsc.id]: fallback([http()]),
    [polygon.id]: fallback([http()]),
    [optimism.id]: fallback([http()]),
    [blast.id]: fallback([http()]),
  },
})

export const wagmiConfig = defaultConfig

const migrate = () => {
  const legacyKey = 'connected-eip-6963-provider'
  const legacyConnectorId = localStorage.getItem(legacyKey)

  if (legacyConnectorId !== null && wagmiConfig.storage?.key !== undefined) {
    localStorage.setItem(`${wagmiConfig.storage.key}.recentConnectorId`, legacyConnectorId)
    localStorage.removeItem(legacyKey)
  }
}

migrate()

const queryClient = new QueryClient()

export const EvmProvider = (props: PropsWithChildren) => {
  const evmNetworks = useAtomValue(evmNetworksAtom)
  const [config, setConfig] = useState(defaultConfig)

  useEffect(() => {
    if (evmNetworks && evmNetworks.length > 0) {
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
