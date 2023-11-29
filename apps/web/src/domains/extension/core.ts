import { substrateInjectedAccountsState, wagmiAccountsState } from '@domains/accounts/recoils'
import { storageEffect } from '@domains/common/effects'
import { WalletAggregator, type BaseWallet } from '@polkadot-onboard/core'
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets'
import { jsonParser, string } from '@recoiljs/refine'
import { connect as wagmiConnect, disconnect as wagmiDisconnect, watchAccount as watchWagmiAccount } from '@wagmi/core'
import { createStore, type EIP6963ProviderDetail } from 'mipd'
import { useEffect, useSyncExternalStore } from 'react'
import { atom, selector, useRecoilValue, useSetRecoilState, waitForAll } from 'recoil'
import { useAccount as useWagmiAccount } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

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
  const connectedEip6963Rdns = useRecoilValue(connectedEip6963RdnsState)

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
          await wagmiConnect({
            connector: new InjectedConnector({
              options: {
                // @ts-expect-error
                getProvider: () => providerToConnect.provider,
                shimDisconnect: true,
              },
            }),
          })
        }
      })()
    }
  }, [connectedEip6963Rdns, eip6963Providers])

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
          iconUrl:
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODIiIGhlaWdodD0iODIiIHZpZXdCb3g9IjAgMCA4MiA4MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgyIiBoZWlnaHQ9IjgyIiByeD0iMTIiIGZpbGw9IiNENUZGNUMiLz4KPHBhdGggZD0iTTM1LjA0IDU1QzM1LjA0IDU4LjI5MDUgMzcuNjg4NyA2MC45NjIzIDQwLjk3MDMgNjAuOTk5NkM0NC4yNTE5IDYwLjk2MjMgNDYuOTAwNiA1OC4yOTA1IDQ2LjkwMDYgNTVDNDYuOTAwNiA1MS43MDk2IDQ0LjI1MTkgNDkuMDM3NyA0MC45NzAzIDQ5LjAwMDRDMzcuNjg4NyA0OS4wMzc3IDM1LjA0IDUxLjcwOTYgMzUuMDQgNTVaIiBmaWxsPSIjRkQ0ODQ4Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjIuODU0NCA0NC42NjIzQzIyLjI0NjIgNDUuOTg2OCAyMC40NTUzIDQ2LjQ1NDYgMTkuNDI0OCA0NS40MjQxTDE3LjUzNTYgNDMuNTM0OUMxNS41ODMgNDEuNTgyMyAxMi40MTcxIDQxLjU4MjMgMTAuNDY0NSA0My41MzQ5QzguNTExODQgNDUuNDg3NSA4LjUxMTg0IDQ4LjY1MzQgMTAuNDY0NSA1MC42MDZMMjUuNzM5MSA2NS44ODA3QzI5LjM5NDIgNzAuMjE3NiAzNC44NTk1IDcyLjk3ODggNDAuOTcwMyA3Mi45OTk0QzQ3LjA4MTEgNzIuOTc4OCA1Mi41NDY0IDcwLjIxNzYgNTYuMjAxNCA2NS44ODA3TDcxLjQ3NjEgNTAuNjA2QzczLjQyODcgNDguNjUzNCA3My40Mjg3IDQ1LjQ4NzUgNzEuNDc2MSA0My41MzQ5QzY5LjUyMzQgNDEuNTgyMyA2Ni4zNTc2IDQxLjU4MjMgNjQuNDA0OSA0My41MzQ5TDYyLjUxNTggNDUuNDI0MUM2MS40ODUyIDQ2LjQ1NDYgNTkuNjk0MyA0NS45ODY4IDU5LjA4NjEgNDQuNjYyM0M1OC45NjYzIDQ0LjQwMTMgNTguOTAxIDQ0LjEyMTMgNTguOTAxIDQzLjgzNDFMNTguOTAxIDIwLjk5OTVDNTguOTAxIDE4LjIzODEgNTYuNjYyNCAxNS45OTk1IDUzLjkwMSAxNS45OTk1QzUxLjEzOTYgMTUuOTk5NSA0OC45MDEgMTguMjM4MSA0OC45MDEgMjAuOTk5NUw0OC45MDEgMzIuNTU2OEM0OC45MDEgMzMuNTUwNiA0Ny44ODI5IDM0LjIyNTIgNDYuOTM1MyAzMy45MjU3QzQ2LjMzNTYgMzMuNzM2MSA0NS45MDIzIDMzLjE5MDEgNDUuOTAyMyAzMi41NjExTDQ1LjkwMjMgMTMuOTk5NkM0NS45MDIzIDExLjI2MDggNDMuNzAwNCA5LjAzNjM3IDQwLjk3MDMgOUMzOC4yNDAyIDkuMDM2MzcgMzYuMDM4MiAxMS4yNjA4IDM2LjAzODIgMTMuOTk5NkwzNi4wMzgyIDMyLjU2MTFDMzYuMDM4MiAzMy4xOTAxIDM1LjYwNSAzMy43MzYxIDM1LjAwNTIgMzMuOTI1N0MzNC4wNTc2IDM0LjIyNTIgMzMuMDM5NSAzMy41NTA2IDMzLjAzOTUgMzIuNTU2OEwzMy4wMzk2IDIwLjk5OTVDMzMuMDM5NiAxOC4yMzgxIDMwLjgwMSAxNS45OTk1IDI4LjAzOTUgMTUuOTk5NUMyNS4yNzgxIDE1Ljk5OTUgMjMuMDM5NSAxOC4yMzgxIDIzLjAzOTUgMjAuOTk5NUwyMy4wMzk1IDQzLjgzNDFDMjMuMDM5NSA0NC4xMjEzIDIyLjk3NDMgNDQuNDAxMyAyMi44NTQ0IDQ0LjY2MjNaTTQwLjk3MDMgNDQuOTk5OUMzMi4xNjU5IDQ1LjA1MjUgMjUuMDQwMyA1NC45OTk3IDI1LjA0MDMgNTQuOTk5N0MyNS4wNDAzIDU0Ljk5OTcgMzIuMTY1OSA2NC45NDY5IDQwLjk3MDMgNjQuOTk5NUM0OS43NzQ2IDY0Ljk0NjkgNTYuOTAwMiA1NC45OTk3IDU2LjkwMDIgNTQuOTk5N0M1Ni45MDAyIDU0Ljk5OTcgNDkuNzc0NiA0NS4wNTI1IDQwLjk3MDMgNDQuOTk5OVoiIGZpbGw9IiNGRDQ4NDgiLz4KPC9zdmc+Cg==',
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

  const connectedWalletId = useRecoilValue(connectedSubstrateWalletIdState)
  const setConnectedWallet = useSetRecoilState(connectedSubstrateWalletState)

  useEffect(() => {
    if (connectedWalletId === undefined) {
      setConnectedWallet(undefined)
    }
  }, [connectedWalletId, setConnectedWallet])

  useEffect(() => {
    void (async () => {
      const wallets = await substrateWalletAggregator.getWallets()
      await Promise.all(wallets.map(async x => await x.disconnect()))

      if (connectedWalletId !== undefined) {
        const walletToConnect = wallets.find(x => x.metadata.id === connectedWalletId)

        if (walletToConnect !== undefined) {
          await walletToConnect.connect()
          setConnectedWallet(walletToConnect)
        }
      }
    })()
  }, [connectedWalletId, setConnectedWallet])
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
