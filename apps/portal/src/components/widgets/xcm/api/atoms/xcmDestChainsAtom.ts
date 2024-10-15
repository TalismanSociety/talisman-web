import { atom } from 'jotai'

import { xcmTokenPickerDestAtom } from './xcmTokenPickerDestAtom'

export const xcmDestChainsAtom = atom(async get => {
  const dests = await get(xcmTokenPickerDestAtom)
  return [
    ...new Map(dests.map(dest => [dest.chain.key, { ...dest.chain, chaindataId: dest.chaindataId }])).values(),
  ].sort((a, b) => a.name.localeCompare(b.name))
})
