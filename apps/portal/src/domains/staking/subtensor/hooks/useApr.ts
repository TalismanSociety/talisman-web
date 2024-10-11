import { highestAprTaoValidatorAtom } from '../atoms/taostats'
import { useDelegateStats } from './useDelegateStats'
import { useAtomValue } from 'jotai'

export const useHighestAprFormatted = () => {
  const { apr } = useAtomValue(highestAprTaoValidatorAtom)

  return Number(apr).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })
}

export const useDelegateApr = (hotkey: string) => {
  const delegate = useDelegateStats(hotkey)
  return Number(delegate?.apr)
}

export const useDelegateAprFormatted = (hotkey: string) => {
  const apr = useDelegateApr(hotkey)
  return apr.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })
}
