import { atomEffect } from 'jotai-effect'
import { isAddress as isEvmAddress } from 'viem'

import { assetAtom, destChainAtom, senderAtom, sourceChainAtom } from './xcmFieldsAtoms'
import { xcmTokenPickerDestAtom } from './xcmTokenPickerDestAtom'
import { xcmTokenPickerSourceAtom } from './xcmTokenPickerSourceAtom'

const DEFAULT_SUB_SOURCE = { chain: 'assethub', token: 'dot' }
const DEFAULT_EVM_SOURCE = { chain: 'moonbeam', token: 'glmr' }

/**
 * Ensures that `sourceChain` and `destChain` are always set to a valid route.
 */
export const xcmAutoselectEffect = atomEffect((get, set) => {
  const ac = new AbortController()

  const sender = get(senderAtom)
  const sourceChain = get(sourceChainAtom)
  const destChain = get(destChainAtom)
  const tokenPickerSourcePromise = get(xcmTokenPickerSourceAtom)
  const tokenPickerDestPromise = get(xcmTokenPickerDestAtom)

  if (!sender) return
  const isEvmSender = isEvmAddress(sender ?? '')
  const DEFAULT_SOURCE = isEvmSender ? DEFAULT_EVM_SOURCE : DEFAULT_SUB_SOURCE

  void (async () => {
    const [tokenPickerSource, tokenPickerDest] = await Promise.all([tokenPickerSourcePromise, tokenPickerDestPromise])
    if (ac.signal.aborted) return

    //
    // Step 1: If no source chain is selected, select either the default or the first source chain available
    //
    const defaultSource =
      tokenPickerSource.find(
        asset => asset.chain.key === DEFAULT_SOURCE.chain && asset.token.key === DEFAULT_SOURCE.token
      ) ??
      tokenPickerSource.find(asset => asset.chain.key === DEFAULT_SOURCE.chain) ??
      tokenPickerSource[0]
    if (!defaultSource?.chain.key) return
    if (!defaultSource?.token.key) return

    if (!sourceChain)
      return set.recurse(sourceChainAtom, defaultSource.chain.key), set(assetAtom, defaultSource.token.key)

    //
    // Step 2: If sender is an evm address, but source chain is a substrate parachain, switch to an evm parachain (and vice versa)
    //
    if (isEvmSender && !sourceChain?.usesH160Acc && sourceChain?.key !== defaultSource.chain.key)
      return set.recurse(sourceChainAtom, defaultSource.chain.key), set(assetAtom, defaultSource.token.key)

    if (!isEvmSender && sourceChain?.usesH160Acc && sourceChain?.key !== defaultSource.chain.key)
      return set.recurse(sourceChainAtom, defaultSource.chain.key), set(assetAtom, defaultSource.token.key)

    //
    // Step 3: If no dest chain is selected or if the selected dest chain has no route from the source chain,
    // select the first valid dest chain available (valid meaning that a route exists from the source chain and selected asset)
    //
    const defaultDest = tokenPickerDest[0]
    if (
      defaultDest &&
      destChain?.key !== defaultDest.chain.key &&
      (!destChain || !tokenPickerDest.some(dest => dest.chain.key === destChain?.key))
    )
      return set.recurse(destChainAtom, defaultDest.chain.key)
  })()

  return () => ac.abort()
})
