import { Parachain } from '@galacticcouncil/xcm-core'
import { atom } from 'jotai'

import { configServiceAtom } from './configServiceAtom'

export const xcmChainsAtom = atom(get => {
  const configService = get(configServiceAtom)

  return [...configService.chains.values().filter(chain => chain instanceof Parachain)]
})
