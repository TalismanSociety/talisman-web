import { useAtomValue } from 'jotai'

import { highestAprTaoValidatorAtom } from '../atoms/taostats'
import { useDelegateStats } from './useDelegateStats'

export const useHighestAprFormatted = () => {
  const apr = useHighestApr()

  return Number(apr).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })
}
export const useHighestApr = () => {
  const { apr } = useAtomValue(highestAprTaoValidatorAtom)

  return Number(apr)
}

export const useDelegateApr = (hotkey: string) => {
  const delegate = useDelegateStats(hotkey)
  return Number(delegate?.apr)
}

export const useDelegateAprFormatted = (hotkey: string) => {
  const apr = useDelegateApr(hotkey)
  return apr.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })
}
