import { BittensorAccountId, vecDecodeResult, vecEncodeParams } from './_types'
import { ApiPromise } from '@polkadot/api'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { Option, Struct, Tuple, Vector, compact } from 'scale-ts'

const DelegateInfo = Struct({
  hotkey: BittensorAccountId,
  take: compact,
  /** map of nominator_ss58 to stake amount */
  nominators: Vector(Tuple(BittensorAccountId, compact)),
  owner: BittensorAccountId,
  /** Vec of netuid this delegate is registered on */
  registrations: Vector(compact),
  /** Vec of netuid this delegate has validator permit on */
  validatorPermits: Vector(compact),
  /** Delegators current daily return per 1000 TAO staked minus take fee, in planck units */
  return_per_1000: compact,
  /** Delegators current daily return */
  total_daily_return: compact,
})

const EncodeParams_GetDelegate = (address: string) => vecEncodeParams(BittensorAccountId.enc(address))
const DecodeResult_GetDelegate = (result: string) => Option(DelegateInfo).dec(vecDecodeResult(result))

const DecodeResult_GetDelegates = (result: string) => Vector(DelegateInfo).dec(vecDecodeResult(result))

export const allDelegateInfosAtomFamily = atomFamily(
  ({ api }: { api: ApiPromise }) =>
    atom(async () => {
      try {
        const response = (await api.rpc.state.call('DelegateInfoRuntimeApi_get_delegates', new Uint8Array())).toHex()
        const result = DecodeResult_GetDelegates(response)

        const allDelegates = Object.fromEntries(
          (result ?? []).map(d => [
            d.hotkey,
            {
              ...d,
              return_per_1000: typeof d.return_per_1000 === 'number' ? BigInt(d.return_per_1000) : d.return_per_1000,
              totalDelegated: d.nominators.reduce((acc, [_address, amount]) => acc + BigInt(amount), 0n),
              // TODO: Calculate APR from return_per_1000
              apr: undefined,
            },
          ])
        )

        return allDelegates
      } catch (cause) {
        console.error(new Error(`Failed to fetch all delegate infos on chain ${api.genesisHash}`, { cause }))
        return undefined
      }
    }),

  // compareFunc to determine when two sets of atomFamily params are equal to eachother
  (a, b) => a.api.genesisHash === b.api.genesisHash
)

export const delegateInfosAtomFamily = atomFamily(
  ({ api, delegateAddresses }: { api: ApiPromise; delegateAddresses: string[] }) =>
    atom(async get => {
      const delegateInfos = (
        await Promise.all(
          delegateAddresses.map(delegateAddress => get(delegateInfoAtomFamily({ api, delegateAddress })))
        )
      ).flatMap(delegateInfo => delegateInfo ?? [])

      return Object.fromEntries(
        delegateInfos.map(d => [
          d.hotkey,
          { ...d, totalDelegated: d.nominators.reduce((acc, [_address, amount]) => acc + BigInt(amount), 0n) },
        ])
      )
    }),

  // compareFunc to determine when two sets of atomFamily params are equal to eachother
  (a, b) =>
    a.api.genesisHash === b.api.genesisHash &&
    JSON.stringify(a.delegateAddresses) === JSON.stringify(b.delegateAddresses)
)

export const delegateInfoAtomFamily = atomFamily(
  ({ api, delegateAddress }: { api: ApiPromise; delegateAddress: string }) =>
    atom(async () => {
      try {
        const params = EncodeParams_GetDelegate(delegateAddress)
        const response = (await api.rpc.state.call('DelegateInfoRuntimeApi_get_delegate', params)).toHex()
        const result = DecodeResult_GetDelegate(response)

        return result
      } catch (cause) {
        console.error(
          new Error(`Failed to fetch delegate info for ${delegateAddress} on chain ${api.genesisHash}`, { cause })
        )
        return undefined
      }
    }),

  // compareFunc to determine when two sets of atomFamily params are equal to eachother
  (a, b) => a.api.genesisHash === b.api.genesisHash && a.delegateAddress === b.delegateAddress
)

// delete cached atomFamily atoms when their ApiPromise is no longer connected
// means we will always be using the latest `api`
delegateInfoAtomFamily.setShouldRemove((_createdAt, { api }) => api.isConnected === false)
delegateInfosAtomFamily.setShouldRemove((_createdAt, { api }) => api.isConnected === false)
