import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import type { EIP1193Provider } from 'viem'
import { WagmiProvider, createConfig, http } from 'wagmi'
import type {} from 'wagmi/'
import { mainnet, moonbeam, moonriver } from 'wagmi/chains'

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    talismanEth?: EIP1193Provider
  }
}

export const wagmiConfig = createConfig({
  chains: [mainnet, moonbeam, moonriver],
  transports: { [mainnet.id]: http(), [moonbeam.id]: http(), [moonriver.id]: http() },
})

const queryClient = new QueryClient()

export const EvmProvider = (props: PropsWithChildren) => (
  <WagmiProvider config={wagmiConfig} reconnectOnMount>
    <QueryClientProvider client={queryClient}>{props.children} </QueryClientProvider>
  </WagmiProvider>
)
