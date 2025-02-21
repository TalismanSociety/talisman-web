import { toHex } from '@polkadot-api/utils'
import { ApiPromise } from '@polkadot/api'
import { useQuery } from '@tanstack/react-query'
import { AccountId } from 'polkadot-api'
import { useRecoilValue } from 'recoil'
import { bool, compact, Struct, Vector } from 'scale-ts'

import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'

export const BittensorAccountPrefix = 42
export const BittensorAccountId = AccountId(BittensorAccountPrefix)

/** Struct definition for decoding stake info */
const StakeInfo = Struct({
  hotkey: BittensorAccountId,
  coldkey: BittensorAccountId,
  netuid: compact,
  stake: compact,
  locked: compact,
  emission: compact,
  tao_emission: compact,
  drain: compact,
  isRegistered: bool,
})

/** Encoding/decoding for GetStakeInfoForColdkey */
const EncodeParams_GetStakeInfoForColdkey = (address: string) => toHex(BittensorAccountId.enc(address))

const DecodeResult_GetStakeInfoForColdkey = (result: string) => Vector(StakeInfo).dec(result)

/**
 * Fetches the stake info for a given coldkey using the API
 */
const fetchStakeInfo = async (api: ApiPromise, address: string) => {
  try {
    const params = EncodeParams_GetStakeInfoForColdkey(address)
    const response = (await api.rpc.state.call('StakeInfoRuntimeApi_get_stake_info_for_coldkey', params)).toHex()

    const result = DecodeResult_GetStakeInfoForColdkey(response)
    if (!Array.isArray(result)) return undefined

    const stakes = result
      .map(({ coldkey, hotkey, netuid, stake }) => ({
        coldkey,
        hotkey,
        netuid: Number(netuid),
        stake: BigInt(stake),
      }))
      .filter(({ stake }) => stake !== 0n)

    return stakes.length ? stakes : undefined
  } catch (error) {
    console.error('Failed to fetch stake info:', error)
    return undefined
  }
}

export const useGetStakeInfoForColdKey = (address: string) => {
  const api = useRecoilValue(useSubstrateApiState())
  return useQuery({
    queryKey: ['stakeInfoForColdKey', address],
    queryFn: () => fetchStakeInfo(api, address),
    enabled: !!api && !!address,
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 30000, // Mark data as fresh for 30 seconds
  })
}
