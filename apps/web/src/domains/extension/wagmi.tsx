import type { PropsWithChildren } from 'react'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { mainnet, moonbeam, moonriver } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import { InjectedConnector } from 'wagmi/connectors/injected'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, moonbeam, moonriver],
  [publicProvider()]
)

export const wagmiInjectedConnector = new InjectedConnector({ chains })

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [wagmiInjectedConnector],
})

export const WagmiProvider = (props: PropsWithChildren) => <WagmiConfig config={config}>{props.children}</WagmiConfig>
