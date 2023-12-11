import polkadotJsWalletLogo from '@assets/polkadot-js-wallet.svg'
import talismanWalletLogo from '@assets/talisman-wallet.svg'
import { substrateInjectedAccountsState } from '@domains/accounts/recoils'
import { storageEffect } from '@domains/common/effects'
import { WalletAggregator, type BaseWallet } from '@polkadot-onboard/core'
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets'
import type { InjectedWindow } from '@polkadot/extension-inject/types'
import { jsonParser, string } from '@recoiljs/refine'
import { useEffect } from 'react'
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const walletAggregator = new WalletAggregator([
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
          iconUrl: polkadotJsWalletLogo,
        },
      ],
    },
    import.meta.env.REACT_APP_APPLICATION_NAME ?? 'Talisman'
  ),
])

const installedSubstrateWalletsState = selector({
  key: 'InstalledSubstrateWallets',
  get: async () => await walletAggregator.getWallets(),
})

export const connectedSubstrateWalletIdState = atom<string | undefined>({
  key: 'ConnectedSubstrateSubstrateWalletId',
  default: undefined,
  effects: [
    storageEffect(localStorage, {
      key: 'connected-substrate-extension',
      parser: jsonParser(string()),
    }),
  ],
})

export const connectedSubstrateWalletState = atom<BaseWallet | undefined>({
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

export const useSubstrateExtensionEffect = () => {
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
      const wallets = await walletAggregator.getWallets()
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
