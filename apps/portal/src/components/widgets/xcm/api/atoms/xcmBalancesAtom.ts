import { AssetAmount } from '@galacticcouncil/xcm-core'
import { atom } from 'jotai'
import { atomEffect } from 'jotai-effect'

import { walletAtom } from './walletAtom'
import { senderAtom, sourceChainAtom } from './xcmFieldsAtoms'

const _xcmBalancesAtom = atom(new Map<string, AssetAmount>())
export const xcmBalancesAtom = atom(get => {
  // subscribe to balances
  get(xcmBalancesEffect)

  return get(_xcmBalancesAtom)
})

const xcmBalancesEffect = atomEffect((get, set) => {
  const abortController = new AbortController()

  const walletPromise = get(walletAtom)
  const sender = get(senderAtom)
  const sourceChain = get(sourceChainAtom)
  if (!sender) return
  if (!sourceChain) return

  set(_xcmBalancesAtom, new Map())

  const subscribeSourceBalance = async () => {
    const wallet = await walletPromise
    if (!wallet) return

    if (abortController.signal.aborted) return
    const balanceSubscription = await wallet.subscribeBalance(sender, sourceChain, (balances: AssetAmount[]) =>
      set(_xcmBalancesAtom, new Map(balances.map(b => [b.key, b])))
    )

    if (abortController.signal.aborted) return balanceSubscription.unsubscribe()
    abortController.signal.onabort = () => balanceSubscription.unsubscribe()
  }
  subscribeSourceBalance().catch(console.error)

  return () => abortController.abort()
})
