import { atomEffect } from 'jotai-effect'

import { assetAtom, destChainAtom, sourceChainAtom } from './xcmFieldsAtoms'
import { xcmTokenPickerDestAtom } from './xcmTokenPickerDestAtom'
import { xcmTokenPickerSourceAtom } from './xcmTokenPickerSourceAtom'

const DEFAULT_SOURCE = { chain: 'assethub', token: 'dot' }

/**
 * Ensures that `sourceChain` and `destChain` are always set to a valid route.
 */
export const xcmAutoselectEffect = atomEffect((get, set) => {
  const ac = new AbortController()

  const sourceChain = get(sourceChainAtom)
  const destChain = get(destChainAtom)
  const tokenPickerSourcePromise = get(xcmTokenPickerSourceAtom)
  const tokenPickerDestPromise = get(xcmTokenPickerDestAtom)

  void (async () => {
    const [tokenPickerSource, tokenPickerDest] = await Promise.all([tokenPickerSourcePromise, tokenPickerDestPromise])
    if (ac.signal.aborted) return

    //
    // Step 1: If no source chain is selected, select either the default or the first source chain available
    //
    const defaultSource =
      tokenPickerSource.find(
        asset => asset.chain.key === DEFAULT_SOURCE.chain && asset.token.key === DEFAULT_SOURCE.token
      ) ?? tokenPickerSource[0]

    if (!defaultSource?.chain.key || !defaultSource?.token.key) return
    if (!sourceChain)
      return set.recurse(sourceChainAtom, defaultSource.chain.key), set(assetAtom, defaultSource.token.key)

    //
    // Step 2: If no dest chain is selected or if the selected dest chain has no route from the source chain,
    // select the first valid dest chain available (valid meaning that a route exists from the source chain and selected asset)
    //
    const defaultDest = tokenPickerDest[0]
    if (!defaultDest) return
    if (destChain?.key === defaultDest.chain.key) return
    if (tokenPickerDest.some(dest => dest.chain.key === destChain?.key)) return

    return set.recurse(destChainAtom, defaultDest.chain.key)
  })()

  return () => ac.abort()
})
