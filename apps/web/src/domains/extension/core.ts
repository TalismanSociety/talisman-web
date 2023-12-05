import { substrateInjectedAccountsState, wagmiAccountsState } from '@domains/accounts/recoils'
import { storageEffect } from '@domains/common/effects'
import { WalletAggregator, type BaseWallet } from '@polkadot-onboard/core'
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets'
import type { InjectedWindow } from '@polkadot/extension-inject/types'
import { jsonParser, string } from '@recoiljs/refine'
import { connect as wagmiConnect, disconnect as wagmiDisconnect, watchAccount as watchWagmiAccount } from '@wagmi/core'
import { createStore, type EIP6963ProviderDetail } from 'mipd'
import { useEffect, useSyncExternalStore } from 'react'
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState, waitForAll } from 'recoil'
import { useAccount as useWagmiAccount } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { talismanWalletLogo } from '.'

const connectedEip6963RdnsState = atom<string | undefined>({
  key: 'ConnectedEip6963Rdns',
  default: undefined,
  effects: [storageEffect(localStorage, { key: 'connected-eip-6963-provider', parser: jsonParser(string()) })],
})

const eip6963Store = createStore()

export const useEip6963Providers = () => useSyncExternalStore(eip6963Store.subscribe, eip6963Store.getProviders)

export const useConnectEip6963 = () => {
  const setConnectedProvider = useSetRecoilState(connectedEip6963RdnsState)

  return {
    connect: (provider: EIP6963ProviderDetail) => {
      setConnectedProvider(provider.info.rdns)
    },
    disconnect: () => setConnectedProvider(undefined),
  }
}

const useEvmExtensionEffect = () => {
  const [connectedEip6963Rdns, setConnectedEip6963Rdns] = useRecoilState(connectedEip6963RdnsState)

  const eip6963Providers = useEip6963Providers()

  useEffect(() => {
    if (connectedEip6963Rdns === undefined) {
      void wagmiDisconnect()
    }
  }, [connectedEip6963Rdns])

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
          } catch {
            setConnectedEip6963Rdns(undefined)
          }
        }
      })()
    }
  }, [connectedEip6963Rdns, eip6963Providers, setConnectedEip6963Rdns])

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

const substrateWalletAggregator = new WalletAggregator([
  new InjectedWalletProvider(
    {
      supported: [
        {
          id: 'talisman',
          title: 'Talisman',
          iconUrl: talismanWalletLogo,
        },
        {
          id: 'polkadot-js',
          title: 'Polkadot.js',
          iconUrl:
            'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjE1IDE1IDE0MCAxNDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE3MCAxNzA7em9vbTogMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LmJnMHtmaWxsOiNGRjhDMDB9IC5zdDB7ZmlsbDojRkZGRkZGfTwvc3R5bGU+PGc+PGNpcmNsZSBjbGFzcz0iYmcwIiBjeD0iODUiIGN5PSI4NSIgcj0iNzAiPjwvY2lyY2xlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04NSwzNC43Yy0yMC44LDAtMzcuOCwxNi45LTM3LjgsMzcuOGMwLDQuMiwwLjcsOC4zLDIsMTIuM2MwLjksMi43LDMuOSw0LjIsNi43LDMuM2MyLjctMC45LDQuMi0zLjksMy4zLTYuNyBjLTEuMS0zLjEtMS42LTYuNC0xLjUtOS43QzU4LjEsNTcuNiw2OS41LDQ2LDgzLjYsNDUuM2MxNS43LTAuOCwyOC43LDExLjcsMjguNywyNy4yYzAsMTQuNS0xMS40LDI2LjQtMjUuNywyNy4yIGMwLDAtNS4zLDAuMy03LjksMC43Yy0xLjMsMC4yLTIuMywwLjQtMywwLjVjLTAuMywwLjEtMC42LTAuMi0wLjUtMC41bDAuOS00LjRMODEsNzMuNGMwLjYtMi44LTEuMi01LjYtNC02LjIgYy0yLjgtMC42LTUuNiwxLjItNi4yLDRjMCwwLTExLjgsNTUtMTEuOSw1NS42Yy0wLjYsMi44LDEuMiw1LjYsNCw2LjJjMi44LDAuNiw1LjYtMS4yLDYuMi00YzAuMS0wLjYsMS43LTcuOSwxLjctNy45IGMxLjItNS42LDUuOC05LjcsMTEuMi0xMC40YzEuMi0wLjIsNS45LTAuNSw1LjktMC41YzE5LjUtMS41LDM0LjktMTcuOCwzNC45LTM3LjdDMTIyLjgsNTEuNiwxMDUuOCwzNC43LDg1LDM0Ljd6IE04Ny43LDEyMS43IGMtMy40LTAuNy02LjgsMS40LTcuNSw0LjljLTAuNywzLjQsMS40LDYuOCw0LjksNy41YzMuNCwwLjcsNi44LTEuNCw3LjUtNC45QzkzLjMsMTI1LjcsOTEuMiwxMjIuNCw4Ny43LDEyMS43eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+Cg==',
        },
      ],
    },
    import.meta.env.REACT_APP_APPLICATION_NAME ?? 'Talisman'
  ),
])

const installedSubstrateWalletsState = selector({
  key: 'InstalledSubstrateWallets',
  get: async () => await substrateWalletAggregator.getWallets(),
})

const connectedSubstrateWalletIdState = atom<string | undefined>({
  key: 'ConnectedSubstrateSubstrateWalletId',
  default: undefined,
  effects: [
    storageEffect(localStorage, {
      key: 'connected-substrate-extension',
      parser: jsonParser(string()),
    }),
  ],
})

const connectedSubstrateWalletState = atom<BaseWallet | undefined>({
  key: 'ConnectedSubstrateWallets',
  default: undefined,
})

export const useConnectedSubstrateWallet = () => useRecoilValue(connectedSubstrateWalletState)

export const useInstalledSubstrateWallets = () => useRecoilValue(installedSubstrateWalletsState)

export const useSubstrateWalletConnect = () => {
  const setConnectedWalletId = useSetRecoilState(connectedSubstrateWalletIdState)

  return {
    connect: (wallet: BaseWallet) => setConnectedWalletId(wallet.metadata.id),
    disconnect: () => setConnectedWalletId(undefined),
  }
}

const useSubstrateExtensionEffect = () => {
  const connectedWallet = useRecoilValue(connectedSubstrateWalletState)
  const setInjectedAccounts = useSetRecoilState(substrateInjectedAccountsState)

  useEffect(() => {
    const subscriptions = connectedWallet?.subscribeAccounts(accounts => setInjectedAccounts(accounts))

    return () => {
      void subscriptions?.then(unsubscribe => unsubscribe())
    }
  }, [connectedWallet, setInjectedAccounts])

  const [connectedWalletId, setConnectedWalletId] = useRecoilState(connectedSubstrateWalletIdState)
  const setConnectedWallet = useSetRecoilState(connectedSubstrateWalletState)

  useEffect(() => {
    if (connectedWalletId === undefined) {
      setConnectedWallet(undefined)
      setInjectedAccounts([])
    }
  }, [connectedWalletId, setConnectedWallet, setInjectedAccounts])

  useEffect(() => {
    void (async () => {
      const wallets = await substrateWalletAggregator.getWallets()
      await Promise.all(wallets.map(async x => await x.disconnect()))

      if (connectedWalletId !== undefined) {
        const walletToConnect = wallets.find(x => x.metadata.id === connectedWalletId)

        if (walletToConnect !== undefined) {
          try {
            await walletToConnect.connect()
            setConnectedWallet(walletToConnect)
          } catch {
            setConnectedWalletId(undefined)
          }
        }
      }
    })()
  }, [connectedWalletId, setConnectedWallet, setConnectedWalletId])

  // Auto connect on launch if Talisman extension is installed
  // and user has not explicitly disable wallet connection
  useEffect(
    () => {
      if ((globalThis as InjectedWindow).injectedWeb3?.['talisman'] !== undefined && connectedWalletId === undefined) {
        setConnectedWalletId('talisman')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}

export const ExtensionWatcher = () => {
  useSubstrateExtensionEffect()
  useEvmExtensionEffect()

  return null
}

export const useHadPreviouslyConnectedWallet = () => {
  return useRecoilValue(waitForAll([connectedSubstrateWalletIdState, connectedEip6963RdnsState])).some(
    x => x !== undefined
  )
}

export const useHasActiveWalletConnection = () => {
  const evmConnected = useWagmiAccount().isConnected
  return useRecoilValue(connectedSubstrateWalletState) !== undefined || evmConnected
}
