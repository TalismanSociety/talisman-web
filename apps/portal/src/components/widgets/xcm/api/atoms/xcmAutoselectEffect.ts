import { atomEffect } from 'jotai-effect'
import { isAddress as isEvmAddress } from 'viem'

import { assetAtom, destChainAtom, recipientAtom, senderAtom, sourceChainAtom } from './xcmFieldsAtoms'
import { xcmTokenPickerDestAtom } from './xcmTokenPickerDestAtom'

/**
 * Handles a few cases where it makes sense for the XCM form to automatically select an option on behalf of the user.
 */
export const xcmAutoselectEffect = atomEffect((get, set) => {
  const ac = new AbortController()

  const sender = get(senderAtom)
  const recipient = get(recipientAtom)
  const sourceChain = get(sourceChainAtom)
  const destChain = get(destChainAtom)
  const tokenPickerDestPromise = get(xcmTokenPickerDestAtom)

  if (!sender) return
  const isEvmSender = isEvmAddress(sender ?? '')

  void (async () => {
    const tokenPickerDest = await tokenPickerDestPromise
    if (ac.signal.aborted) return

    // If sender address is incompatible with the source chain, deselect the source and dest chains.
    if (isEvmSender && !sourceChain?.usesH160Acc)
      return set.recurse(sourceChainAtom, undefined), set.recurse(destChainAtom, undefined), set(assetAtom, undefined)
    if (!isEvmSender && sourceChain?.usesH160Acc)
      return set.recurse(sourceChainAtom, undefined), set.recurse(destChainAtom, undefined), set(assetAtom, undefined)

    // If no source chain is selected or if the selected dest chain has no route from the selected source chain, deselect dest chain.
    if (destChain && !sourceChain) return set.recurse(destChainAtom, undefined)
    if (destChain && !tokenPickerDest.some(dest => dest.chain.key === destChain?.key))
      return set.recurse(destChainAtom, undefined)

    // If no dest chain is selected and only one dest chain is available for this asset, select it.
    if (!destChain && tokenPickerDest.length === 1) return set.recurse(destChainAtom, tokenPickerDest[0]!.chain.key)

    // If no recipient is selected and both chains use the same address type, set recipient to be the same as sender.
    if (!recipient && sourceChain?.usesH160Acc === destChain?.usesH160Acc) return set.recurse(recipientAtom, sender)
  })()

  return () => ac.abort()
})
