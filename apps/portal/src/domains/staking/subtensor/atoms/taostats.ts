import { ValidatorsData } from '../types'
import { delegatesAtom } from './delegates'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

const TAOSTATS_API_KEY = import.meta.env.REACT_APP_TAOSTATS_API_KEY
const TAOSTATS_API_URL = 'https://api.taostats.io/api/v1'

const fetchTaoStats = async ({ page = 1, limit = 200 }: { page: number; limit: number }): Promise<ValidatorsData> => {
  try {
    return await (
      await fetch(`${TAOSTATS_API_URL}/validator?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          Authorization: TAOSTATS_API_KEY,
          'Content-Type': 'application/json',
        },
      })
    ).json()
  } catch (cause) {
    throw new Error('Failed to fetch TAO stats', { cause })
  }
}

export const taostatsAtom = atom(async () => {
  const stats: ValidatorsData = { count: 0, validators: [] }

  let page = 1
  while (stats.count === 0 || stats.count > stats.validators.length) {
    const taoStats = await fetchTaoStats({ page: page, limit: 200 })
    stats.count = taoStats.count
    stats.validators.push(...taoStats.validators)
    page++
  }

  return stats
})

export const activeTaoDelegatesStatsAtom = atom(async get => {
  const taostats = await get(taostatsAtom)
  const delegates = await get(delegatesAtom)

  const activeDelegatesHotKeys = Object.keys(delegates)

  const activeDelegates = taostats.validators.filter(validator =>
    activeDelegatesHotKeys.includes(validator.hot_key.ss58)
  )

  return activeDelegates
})

export const highestAprTaoValidatorAtom = atom(async get => {
  const activeDelegatesStats = await get(activeTaoDelegatesStatsAtom)
  const highestAprValidatorStats = activeDelegatesStats.reduce((acc, validator) => {
    if (parseFloat(validator.apr) > parseFloat(acc.apr)) {
      acc = validator
    }
    return acc
  })

  return highestAprValidatorStats
})

export const taoDelegateStatsAtomFamily = atomFamily((hotKey: string) =>
  atom(async get => {
    const activeDelegatesStats = await get(activeTaoDelegatesStatsAtom)
    return activeDelegatesStats.find(validator => validator.hot_key.ss58 === hotKey)
  })
)

export const taoTotalStakedTaoAtom = atom(async get => {
  const { system_total_stake } = await get(highestAprTaoValidatorAtom)

  return system_total_stake
})
