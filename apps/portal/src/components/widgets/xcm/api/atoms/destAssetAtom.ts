import { atom } from 'jotai'

import { assetAtom, destChainAtom } from './xcmFieldsAtoms'
import { xcmTokenPickerDestAtom } from './xcmTokenPickerDestAtom'

export const destAssetAtom = atom(async get => {
  const destChain = get(destChainAtom)
  const asset = get(assetAtom)
  if (!destChain || !asset) return

  const dests = await get(xcmTokenPickerDestAtom)
  return dests.find(dest => dest.chain.key === destChain.key && dest.token.key === asset.key)
})
