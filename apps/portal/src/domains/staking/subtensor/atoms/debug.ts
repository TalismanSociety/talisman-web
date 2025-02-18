import { toHex } from '@polkadot-api/utils'
import { ApiPromise } from '@polkadot/api'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { bool, compact, Struct, Vector } from 'scale-ts'

import { BittensorAccountId } from './_types'

/** For encoding/decoding the GetStakeInfoForColdkey runtime api *after* they added the netuid parameter */
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
const EncodeParams_GetStakeInfoForColdkey = (address: string) => toHex(BittensorAccountId.enc(address))
const DecodeResult_GetStakeInfoForColdkey = (result: string) => Vector(StakeInfo).dec(result)

type DTaoStakeInfo = {
  coldkey: string
  hotkey: string
  netuid: string
  stake: string
  drain: string
  emission: string
  isRegistered: boolean
  locked: string
}

export const accountStakeAtom = atomFamily(
  ({ api, address }: { api: ApiPromise; address: string }) =>
    atom(async () => {
      try {
        const params = EncodeParams_GetStakeInfoForColdkey(address)
        const response = (await api.rpc.state.call('StakeInfoRuntimeApi_get_stake_info_for_coldkey', params)).toHex()

        const resultNew = DecodeResult_GetStakeInfoForColdkey(response)

        console.log({ resultNew })

        const result = (
          await api.call['stakeInfoRuntimeApi']?.['getStakeInfoForColdkey']?.(address)
        )?.toHuman() as DTaoStakeInfo[]

        if (!Array.isArray(result)) return undefined

        const stakes = result
          ?.map(({ coldkey, hotkey, netuid, stake }) => ({
            coldkey,
            hotkey,
            netuid: BigInt(netuid),
            // make every stake a `bigint`, instead of a `number | bigint`, for consistency
            stake: BigInt(Number(stake.replace(/,/g, ''))),
          }))
          .filter(({ stake }) => stake !== 0n)

        if (stakes?.length === 0) return undefined
        return stakes
      } catch (cause) {
        console.error('Failed to fetch stake info for coldkey', cause)
        return undefined
      }
    }),

  // compareFunc to determine when two sets of atomFamily params are equal to eachother
  (a, b) => a.api.genesisHash === b.api.genesisHash && a.address === b.address
)
