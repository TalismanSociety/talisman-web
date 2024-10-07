import { taoDelegateStatsAtomFamily } from '../atoms/taostats'
import { useAtomValue } from 'jotai'

export const useDelegateStats = (hotkey: string) => {
  return useAtomValue(taoDelegateStatsAtomFamily(hotkey))
}
