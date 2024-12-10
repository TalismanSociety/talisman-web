import { useAtomValue } from 'jotai'

import { activeTaoDelegatesStatsAtom } from '../atoms/taostats'

export const useDelegatesStats = () => {
  return useAtomValue(activeTaoDelegatesStatsAtom)
}
