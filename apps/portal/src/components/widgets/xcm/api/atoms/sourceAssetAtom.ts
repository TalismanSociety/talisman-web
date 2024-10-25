import { atom } from 'jotai'

import { assetAtom, sourceChainAtom } from './xcmFieldsAtoms'
import { xcmTokenPickerSourceAtom } from './xcmTokenPickerSourceAtom'

export const sourceAssetAtom = atom(async get => {
  const sourceChain = get(sourceChainAtom)
  const asset = get(assetAtom)
  if (!sourceChain || !asset) return

  const sources = await get(xcmTokenPickerSourceAtom)
  return sources.find(source => source.chain.key === sourceChain.key && source.token.key === asset.key)
})
