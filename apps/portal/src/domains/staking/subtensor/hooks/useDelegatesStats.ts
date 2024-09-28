import { activeTaoDelegatesStatsAtom } from '../atoms/taostats'
import { useAtomValue } from 'jotai'

export const useDelegatesStats = () => {
  return useAtomValue(activeTaoDelegatesStatsAtom)
}
