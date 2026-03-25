import type { PropsWithChildren } from 'react'
import type { EIP1193Provider } from 'viem'
import { evmNetworksAtom } from '@talismn/balances-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { createConfig, fallback, http, WagmiProvider } from 'wagmi'
import { arbitrum, blast, bsc, mainnet, manta, moonbeam, moonriver, optimism, polygon } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

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

const chains = [bsc, mainnet, moonbeam, moonriver, arbitrum, polygon, optimism, blast, manta] as const

// Create wagmi config with chaindata RPCs
const createWagmiConfigWithChaindata = (evmNetworks: EvmNetwork[]) =>
  createConfig({
    chains,
    connectors: [injected()],
    transports: Object.fromEntries(
      chains.map(chain => {
        const network = evmNetworks.find(n => n.id.toString() === chain.id.toString())
        const rpcs = network?.rpcs?.map(rpc => rpc.url).filter(Boolean) || []
        return [chain.id, fallback([...rpcs.map((url: string) => http(url)), http()])]
      })
    ) as Record<(typeof chains)[number]['id'], ReturnType<typeof fallback>>,
  })

// Default config without chaindata (used during initial load)
const defaultConfig = createConfig({
  chains,
  connectors: [injected()],
  transports: Object.fromEntries(chains.map(chain => [chain.id, fallback([http()])])) as Record<
    (typeof chains)[number]['id'],
    ReturnType<typeof fallback>
  >,
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
