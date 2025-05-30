import { useQueries } from '@tanstack/react-query'
import axios from 'axios'

import { DTaoStakeBalance, DTaoStakeBalanceApiResponse } from '../types'

const TAOSTATS_API_KEY = import.meta.env.VITE_TAOSTATS_API_KEY
const TAOSTATS_API_URL = import.meta.env.VITE_TAOSTATS_API_URL

type DTaoStakedPosition = {
  coldkey: string
  hotkey: string
  netuid: number
}

const fetchdTaoStakedBalance = async ({ coldkey, hotkey, netuid }: DTaoStakedPosition) => {
  const { data } = await axios.get<DTaoStakeBalanceApiResponse>(
    `${TAOSTATS_API_URL}/api/dtao/stake_balance/latest/v1`,
    {
      params: {
        coldkey,
        hotkey,
        netuid,
      },
      method: 'GET',
      headers: {
        Authorization: TAOSTATS_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  )
  return data
}

type UseGetDTaoStakedBalances = {
  positions: DTaoStakedPosition[]
}

export function useGetDTaoStakedBalances({ positions }: UseGetDTaoStakedBalances) {
  return useQueries({
    queries: (positions ?? []).map(position => {
      const { coldkey, hotkey, netuid } = position
      return {
        queryKey: ['dTaoStakedBalance', coldkey, hotkey, netuid],
        queryFn: () => fetchdTaoStakedBalance({ coldkey, hotkey, netuid }),
      }
    }),
    combine: results => {
      return {
        data: results.reduce<Record<string, DTaoStakeBalance>>(
          (acc, { data: { data: responseData } = { data: [] } }) => {
            if (responseData && responseData[0]) {
              const {
                netuid,
                hotkey: { ss58 },
              } = responseData[0]
              acc[`${netuid}_${ss58}`] = responseData[0]
            } else {
              // noop, there's no data for this position
            }

            return acc
          },
          {}
        ),
        isLoading: results.some(result => result.isLoading),
      }
    },
  })
}
