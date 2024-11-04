import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { ValidatorsData } from '../types'
import { delegatesAtom } from './delegates'

const TAOSTATS_API_KEY = import.meta.env.VITE_TAOSTATS_API_KEY
const TAOSTATS_API_URL = 'https://api-prod-v2.taostats.io/api'
const MAX_PAGE_SIZE = 100

const fetchTaoStats = async ({
  page = 1,
  limit = MAX_PAGE_SIZE,
}: {
  page: number
  limit: number
}): Promise<ValidatorsData> => {
  try {
    return await (
      await fetch(`${TAOSTATS_API_URL}/validator/latest/v1?page=${page}&limit=${limit}`, {
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
  const stats: ValidatorsData = {
    pagination: {
      current_page: 0,
      per_page: 0,
      total_items: 0,
      total_pages: 0,
      next_page: null,
      prev_page: null,
    },
    data: [],
  }
  let page = 1

  while (!stats.data.length || stats.pagination.current_page < stats.pagination.total_pages) {
    const taoStats = await fetchTaoStats({ page: page, limit: MAX_PAGE_SIZE })
    stats.pagination = taoStats.pagination
    stats.data.push(...taoStats.data)
    page = taoStats.pagination.current_page + 1
  }

  return stats
})

export const activeTaoDelegatesStatsAtom = atom(async get => {
  const taostats = await get(taostatsAtom)
  const delegates = await get(delegatesAtom)

  const activeDelegatesHotKeys = Object.keys(delegates)

  const activeDelegates = taostats.data.filter(validator => activeDelegatesHotKeys.includes(validator.hotkey.ss58))

  return activeDelegates
})

export const highestAprTaoValidatorAtom = atom(async get => {
  const activeDelegatesStats = await get(activeTaoDelegatesStatsAtom)

  const highestAprValidatorStats = activeDelegatesStats[0]

  return highestAprValidatorStats
})

export const taoDelegateStatsAtomFamily = atomFamily((hotKey: string) =>
  atom(async get => {
    const activeDelegatesStats = await get(activeTaoDelegatesStatsAtom)
    return activeDelegatesStats.find(validator => validator.hotkey.ss58 === hotKey)
  })
)

export const taoTotalStakedTaoAtom = atom(async get => {
  const { system_stake = '0' } = (await get(highestAprTaoValidatorAtom)) ?? {}

  return system_stake
})
