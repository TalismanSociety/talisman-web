import { useRecoilValue } from 'recoil'

import { legacyBalancesState } from './core'

export const useLegacyBalances = () => {
  return useRecoilValue(legacyBalancesState)
}
