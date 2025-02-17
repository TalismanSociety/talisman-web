// import { toHex } from '@polkadot-api/utils'
import { ApiPromise } from '@polkadot/api'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import {
  // bool,
  compact,
  Struct,
  Vector,
} from 'scale-ts'

import { BittensorAccountId, vecDecodeResult, vecEncodeParams } from './_types'

/** For encoding/decoding the GetStakeInfoForColdkey runtime api *before* they added the netuid parameter */
const StakeInfo_old = Struct({
  hotkey: BittensorAccountId,
  coldkey: BittensorAccountId,
  stake: compact,
})
const EncodeParams_old_GetStakeInfoForColdkey = (address: string) => vecEncodeParams(BittensorAccountId.enc(address))
const DecodeResult_old_GetStakeInfoForColdkey = (result: string) => Vector(StakeInfo_old).dec(vecDecodeResult(result))

/** For encoding/decoding the GetStakeInfoForColdkey runtime api *after* they added the netuid parameter */
// const StakeInfo = Struct({
//   hotkey: BittensorAccountId,
//   coldkey: BittensorAccountId,
//   netuid: compact,
//   stake: compact,
//   locked: compact,
//   emission: compact,
//   drain: compact,
//   isRegistered: bool,
// })
// const EncodeParams_GetStakeInfoForColdkey = (address: string) => toHex(BittensorAccountId.enc(address))
// const DecodeResult_GetStakeInfoForColdkey = (result: string) => Vector(StakeInfo).dec(result)

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
        const params = EncodeParams_old_GetStakeInfoForColdkey(address)
        const response = (await api.rpc.state.call('StakeInfoRuntimeApi_get_stake_info_for_coldkey', params)).toHex()
        const result = DecodeResult_old_GetStakeInfoForColdkey(response)
        if (!Array.isArray(result)) return undefined

        const stakes = result
          ?.map(({ coldkey, hotkey, stake }) => ({
            coldkey,
            hotkey,
            netuid: 0,
            // make every stake a `bigint`, instead of a `number | bigint`, for consistency
            stake: BigInt(stake),
          }))
          .filter(({ stake }) => stake !== 0n)

        if (stakes?.length === 0) return []
        return stakes
      } catch (cause) {
        // const params = EncodeParams_GetStakeInfoForColdkey(address)
        // const response = (await api.rpc.state.call('StakeInfoRuntimeApi_get_stake_info_for_coldkey', params)).toHex()
        // const result = DecodeResult_GetStakeInfoForColdkey(response)

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
      }
    }),

  // compareFunc to determine when two sets of atomFamily params are equal to eachother
  (a, b) => a.api.genesisHash === b.api.genesisHash && a.address === b.address
)

// delete cached atomFamily atoms when their ApiPromise is no longer connected
// means we will always be using the latest `api`
accountStakeAtom.setShouldRemove((_createdAt, { api }) => api.isConnected === false)
