import { BittensorAccountId, vecDecodeResult, vecEncodeParams } from './_types'
import { ApiPromise } from '@polkadot/api'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { Struct, Vector, compact } from 'scale-ts'

const StakeInfo = Struct({
  hotkey: BittensorAccountId,
  coldkey: BittensorAccountId,
  stake: compact,
})

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
        console.error(
          new Error(`Failed to fetch subtensor stake for account ${address} on chain ${api.genesisHash}`, { cause })
        )
        return undefined
      }
    }),

  // compareFunc to determine when two sets of atomFamily params are equal to eachother
  (a, b) => a.api.genesisHash === b.api.genesisHash && a.address === b.address
)

// delete cached atomFamily atoms when their ApiPromise is no longer connected
// means we will always be using the latest `api`
accountStakeAtom.setShouldRemove((_createdAt, { api }) => api.isConnected === false)
