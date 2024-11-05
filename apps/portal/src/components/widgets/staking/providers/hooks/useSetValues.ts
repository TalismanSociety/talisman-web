import { useCallback, useRef } from 'react'

export type StakeType = 'apr' | 'unbondingPeriod' | 'availableBalance' | 'stakePercentage'
type StakeValues = { [key: string]: number }

const useStakeValues = () => {
  const stakeValues = useRef<{ [key in StakeType]?: StakeValues }>({
    apr: {},
    unbondingPeriod: {},
    availableBalance: {},
    stakePercentage: {},
  })

  const setValues = (type: StakeType, id: string | number, value: number) => {
    const previousValue = stakeValues.current[type]?.[id]

    if (previousValue === value || !value) return

    stakeValues.current = {
      ...stakeValues.current,
      [type]: { ...stakeValues.current[type], [id]: value },
    }
  }

  const getValuesForSortType = useCallback((type: StakeType) => {
    return stakeValues.current[type] || {}
  }, [])

  return { getValuesForSortType, setValues }
}

export default useStakeValues
