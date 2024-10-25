import { useState, useCallback } from 'react'

export type StakeType = 'apr' | 'unbondingPeriod' | 'availableBalance' | 'stakePercentage'
type StakeValues = { [key: string]: number }

const useStakeValues = () => {
  const [stakeValues, setStakeValues] = useState<{ [key in StakeType]?: StakeValues }>({
    apr: {},
    unbondingPeriod: {},
    availableBalance: {},
    stakePercentage: {},
  })

  const setValues = (type: StakeType, id: string | number, value: number) => {
    const previousValue = stakeValues[type]?.[id]

    if (previousValue === value || !value) {
      return
    }
    setStakeValues(prevValues => ({
      ...prevValues,
      [type]: { ...prevValues[type], [id]: value },
    }))
  }

  const getValuesForSortType = useCallback(
    (type: StakeType) => {
      return stakeValues[type] || {}
    },
    [stakeValues]
  )

  return { getValuesForSortType, setValues }
}

export default useStakeValues
