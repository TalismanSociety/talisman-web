import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import type { EIP1193Provider } from 'viem'
import { WagmiProvider, createConfig, http } from 'wagmi'
import type {} from 'wagmi/'
import { arbitrum, mainnet, moonbeam, moonriver, manta, bsc, optimism, blast, polygon } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    talismanEth?: EIP1193Provider
  }
}

export const wagmiConfig = createConfig({
  chains: [bsc, mainnet, moonbeam, moonriver, arbitrum, polygon, optimism, blast, manta],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [moonbeam.id]: http(),
    [moonriver.id]: http(),
    [manta.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [blast.id]: http(),
  },
})

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

export const EvmProvider = (props: PropsWithChildren) => (
  <WagmiProvider config={wagmiConfig} reconnectOnMount>
    <QueryClientProvider client={queryClient}>{props.children} </QueryClientProvider>
  </WagmiProvider>
)
