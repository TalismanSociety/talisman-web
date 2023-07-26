import { useRecoilValue } from 'recoil'

import { legacyBalancesState } from './recoils'

export const useLegacyBalances = () => {
  return useRecoilValue(legacyBalancesState)
}
