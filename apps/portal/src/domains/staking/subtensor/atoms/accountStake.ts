import { ApiPromise } from '@polkadot/api'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { compact, Struct, Vector } from 'scale-ts'

import { ROOT_NETUID } from '@/components/widgets/staking/subtensor/constants'

import { BittensorAccountId, vecDecodeResult, vecEncodeParams } from './_types'

const StakeInfo = Struct({
  hotkey: BittensorAccountId,
  coldkey: BittensorAccountId,
  stake: compact,
})

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

const EncodeParams_GetStakeInfoForColdkey = (address: string) => vecEncodeParams(BittensorAccountId.enc(address))
const DecodeResult_GetStakeInfoForColdkey = (result: string) => Vector(StakeInfo).dec(vecDecodeResult(result))

export const accountStakeAtom = atomFamily(
  ({ api, address }: { api: ApiPromise; address: string }) =>
    atom(async () => {
      try {
        const params = EncodeParams_GetStakeInfoForColdkey(address)
        const response = (await api.rpc.state.call('StakeInfoRuntimeApi_get_stake_info_for_coldkey', params)).toHex()
        const result = DecodeResult_GetStakeInfoForColdkey(response)
        if (!Array.isArray(result)) return undefined

        const stakes = result
          ?.map(({ coldkey, hotkey, stake }) => ({
            coldkey,
            hotkey,
            // make every stake a `bigint`, instead of a `number | bigint`, for consistency
            stake: typeof stake === 'number' ? BigInt(stake) : stake,
          }))
          .filter(({ stake }) => stake !== 0n)

        if (stakes?.length === 0) return undefined
        return stakes
      } catch (cause) {
        const response = (
          await api.call['stakeInfoRuntimeApi']?.['getStakeInfoForColdkey']?.(address)
        )?.toHuman() as DTaoStakeInfo[]

        if (!Array.isArray(response)) return undefined

        const stakes = response
          // Filter out Subnet stakes for now
          .filter(stake => Number(stake?.netuid) === ROOT_NETUID)
          ?.map(({ coldkey, hotkey, stake, netuid }) => ({
            coldkey,
            hotkey,
            netuid,
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
