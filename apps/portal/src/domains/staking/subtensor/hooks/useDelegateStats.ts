import { useAtomValue } from 'jotai'

import { taoDelegateStatsAtomFamily } from '../atoms/taostats'

export const useDelegateStats = (hotkey: string) => {
  return useAtomValue(taoDelegateStatsAtomFamily(hotkey))
}
