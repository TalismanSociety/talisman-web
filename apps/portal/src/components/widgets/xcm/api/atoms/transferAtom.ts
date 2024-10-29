import { atom } from 'jotai'

import { walletAtom } from './walletAtom'
import { assetAtom, destChainAtom, recipientAtom, senderAtom, sourceChainAtom } from './xcmFieldsAtoms'

export const transferAtom = atom(async get => {
  const sender = get(senderAtom)
  const recipient = get(recipientAtom)
  const asset = get(assetAtom)
  const sourceChain = get(sourceChainAtom)
  const destChain = get(destChainAtom)
  if (!sender || !recipient || !asset || !sourceChain || !destChain) return

  const wallet = await get(walletAtom)
  if (!wallet) return

  const transfer = await wallet.transfer(asset, sender, sourceChain, recipient, destChain)

  return transfer
})
