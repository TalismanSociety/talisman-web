import { CachingPoolService } from '@galacticcouncil/sdk'
import { atom } from 'jotai'

import { pjsApiAtom } from './pjsApiAtom'

export const poolServiceAtom = atom(async get => {
  const pjsApi = await get(pjsApiAtom)
  if (!pjsApi) return

  return new CachingPoolService(pjsApi)
})
