import type { BaseWallet } from '@polkadot-onboard/core'
import type { InjectedWindow } from '@polkadot/extension-inject/types'
import { WalletAggregator } from '@polkadot-onboard/core'
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets'
import { jsonParser, string } from '@recoiljs/refine'
import { toast } from '@talismn/ui/molecules/Toaster'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import polkadotJsWalletLogo from '@/assets/polkadot-js-wallet.svg'
import talismanWalletLogo from '@/assets/talisman-wallet.svg'
import { substrateInjectedAccountsState } from '@/domains/accounts/recoils'
import { storageEffect } from '@/domains/common/effects'

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
    import.meta.env.VITE_APPLICATION_NAME ?? 'Talisman'
  ),
])

export const initialisedSubstrateWalletsState = atom({
  key: 'InitialisedSubstrateWallets',
  default: false,
})

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
  const setWalletConnectionInitialised = useSetRecoilState(initialisedSubstrateWalletsState)

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

  const posthog = usePostHog()

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
            posthog.capture('Substrate extensions connected', {
              $set: { substrateExtensions: [walletToConnect.metadata.id] },
            })
          } catch (error) {
            setConnectedWalletId(undefined)
            toast.error('Wallet connection declined')
            console.error(error)
          }
        }
      }

      setWalletConnectionInitialised(true)
    })()
  }, [connectedWalletId, posthog, setConnectedWallet, setConnectedWalletId, setWalletConnectionInitialised])

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
