import { atom } from 'jotai'

import { xcmTokenPickerSourceAtom } from './xcmTokenPickerSourceAtom'

export const xcmSourceChainsAtom = atom(async get => {
  const sources = await get(xcmTokenPickerSourceAtom)
  return [
    ...new Map(
      sources.map(source => [source.chain.key, { ...source.chain, chaindataId: source.chaindataId }])
    ).values(),
  ].sort((a, b) => a.name.localeCompare(b.name))
})
