import '@wagmi/core/window'
import type { PropsWithChildren } from 'react'
import { WagmiConfig, configureChains, createConfig, createStorage, type WindowProvider } from 'wagmi'
import { mainnet, moonbeam, moonriver } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    talismanEth?: WindowProvider
  }
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, moonbeam, moonriver],
  [publicProvider()]
)

export const wagmiInjectedConnector = new InjectedConnector({
  chains,
  options: {
    getProvider: () => window.talismanEth,
  },
})

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [wagmiInjectedConnector],
  storage: createStorage({ storage: globalThis.sessionStorage }),
})

export const WagmiProvider = (props: PropsWithChildren) => <WagmiConfig config={config}>{props.children}</WagmiConfig>
