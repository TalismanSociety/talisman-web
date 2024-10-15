import { Asset, Parachain } from '@galacticcouncil/xcm-core'
import { encodeAnyAddress } from '@talismn/util'
import { atom } from 'jotai'
import { atomWithReducer } from 'jotai/utils'

import { formatAddress } from '../utils/formatAddress'
import { formatDestAddress } from '../utils/formatDestAddress'
import { configServiceAtom } from './configServiceAtom'

// TODO: Fix crash (infinite render) when switching from an evm parachain destination
// (with an ethereum account selected as the destination) to a substrate parachain destination
// also occurs when switching back the other way
// also occurs when disconnecting wallet / all accounts
export const senderAtom = atom(
  get => {
    const { sender, sourceChain } = get(xcmFieldsAtom)
    if (!sender) return

    return sourceChain ? formatAddress(sender, sourceChain) : sender
  },
  (get, set, sender: XcmFields['sender']) => {
    // If there's no recipient, or if the previous recipient is the same as the previous sender,
    // set the new recipient to be the same as the new sender.
    const { recipient: prevRecipient, sender: prevSender } = get(xcmFieldsAtom)
    const hasPrevRecipient = Boolean(prevRecipient)
    const prevRecipientIsPrevSender =
      prevRecipient && prevSender && encodeAnyAddress(prevRecipient) === encodeAnyAddress(prevSender)
    const recipient = hasPrevRecipient && !prevRecipientIsPrevSender ? prevRecipient : sender

    set(xcmFieldsAtom, { sender, recipient })
  }
)
export const recipientAtom = atom(
  get => {
    const { recipient, destChain } = get(xcmFieldsAtom)
    if (!recipient) return

    return destChain ? formatDestAddress(recipient, destChain) : recipient
  },
  (_, set, recipient: XcmFields['recipient']) => set(xcmFieldsAtom, { recipient })
)
export const amountAtom = atom(
  get => get(xcmFieldsAtom).amount,
  (_, set, amount: XcmFields['amount']) => set(xcmFieldsAtom, { amount })
)

export const assetAtom = atom(
  get => get(xcmFieldsAtom).asset,
  (get, set, assetKey: string) => {
    const { assets } = get(configServiceAtom)
    set(xcmFieldsAtom, { asset: assets.get(assetKey) })
  }
)
export const sourceChainAtom = atom(
  get => get(xcmFieldsAtom).sourceChain,
  (get, set, chain?: string) => {
    const { chains } = get(configServiceAtom)
    const sourceChain = chain ? chains.get(chain) : undefined
    set(xcmFieldsAtom, { sourceChain: sourceChain instanceof Parachain ? sourceChain : undefined })
  }
)
export const destChainAtom = atom(
  get => get(xcmFieldsAtom).destChain,
  (get, set, chain?: string) => {
    const { chains } = get(configServiceAtom)
    const destChain = chain ? chains.get(chain) : undefined
    set(xcmFieldsAtom, { destChain: destChain instanceof Parachain ? destChain : undefined })
  }
)

export type XcmFields = {
  sender?: string
  recipient?: string
  amount?: string

  asset?: Asset
  sourceChain?: Parachain
  destChain?: Parachain
}

/**
 * This is the state of the input parameters for the api.
 */
const xcmFieldsAtom = atomWithReducer(
  {
    sender: undefined,
    recipient: undefined,
    amount: undefined,

    asset: undefined,
    sourceChain: undefined,
    destChain: undefined,
  },
  (state: XcmFields, action: Partial<XcmFields>): XcmFields => ({ ...state, ...action })
)
