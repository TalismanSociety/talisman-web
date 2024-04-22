import { wagmiAccountsState } from '@domains/accounts/recoils'
import { storageEffect } from '@domains/common/effects'
import { jsonParser, string } from '@recoiljs/refine'
import { toast } from '@talismn/ui'
import { connect as wagmiConnect, disconnect as wagmiDisconnect, watchAccount as watchWagmiAccount } from '@wagmi/core'
import { createStore, type EIP6963ProviderDetail } from 'mipd'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useSyncExternalStore } from 'react'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { useAccount as useWagmiAccount } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export const connectedEip6963RdnsState = atom<string | undefined>({
  key: 'ConnectedEip6963Rdns',
  default: undefined,
  effects: [storageEffect(localStorage, { key: 'connected-eip-6963-provider', parser: jsonParser(string()) })],
})

const eip6963Store = createStore()

export const useEip6963Providers = () => useSyncExternalStore(eip6963Store.subscribe, eip6963Store.getProviders)

export const useConnectedEip6963Provider = () => {
  const eip6963Providers = useEip6963Providers()
  const connectedEip6963Rdns = useRecoilValue(connectedEip6963RdnsState)

  return eip6963Providers.find(x => x.info.rdns === connectedEip6963Rdns)
}

export const useConnectEip6963 = () => {
  const setConnectedProvider = useSetRecoilState(connectedEip6963RdnsState)

  return {
    connect: (provider: EIP6963ProviderDetail) => {
      setConnectedProvider(provider.info.rdns)
    },
    disconnect: () => setConnectedProvider(undefined),
  }
}

export const useEvmExtensionEffect = () => {
  const [connectedEip6963Rdns, setConnectedEip6963Rdns] = useRecoilState(connectedEip6963RdnsState)

  const eip6963Providers = useEip6963Providers()

  useEffect(() => {
    if (connectedEip6963Rdns === undefined) {
      void wagmiDisconnect()
    }
  }, [connectedEip6963Rdns])

  const posthog = usePostHog()

  useEffect(() => {
    if (connectedEip6963Rdns !== undefined) {
      void (async () => {
        const providerToConnect = eip6963Providers.find(x => x.info.rdns === connectedEip6963Rdns)
        await wagmiDisconnect()

        if (providerToConnect !== undefined) {
          try {
            await wagmiConnect({
              connector: new InjectedConnector({
                options: {
                  // @ts-expect-error
                  getProvider: () => providerToConnect.provider,
                  shimDisconnect: true,
                },
              }),
            })
            posthog.capture('EVM extensions connected', { $set: { evmExtensions: [providerToConnect.info.rdns] } })
          } catch (error) {
            setConnectedEip6963Rdns(undefined)
            toast.error('Wallet connection declined')
            console.error(error)
          }
        }
      })()
    }
  }, [connectedEip6963Rdns, eip6963Providers, posthog, setConnectedEip6963Rdns])

  const { address } = useWagmiAccount()
  const setWagmiAccounts = useSetRecoilState(wagmiAccountsState)

  useEffect(() => {
    if (address === undefined) {
      setWagmiAccounts([])
    }

    if (address !== undefined) {
      setWagmiAccounts([{ address, type: 'ethereum', canSignEvm: true }])
    }

    const unwatch = watchWagmiAccount(account => {
      if (account.address === undefined) {
        setWagmiAccounts([])
      }

      if (account.isConnected && account.address !== undefined) {
        setWagmiAccounts([{ address: account.address, type: 'ethereum', canSignEvm: true }])
      }
    })

    return () => unwatch()
  }, [address, setWagmiAccounts])
}
