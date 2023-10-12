import type { ApiPromise } from '@polkadot/api'
import type { BN } from '@polkadot/util'
import { bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util'

const EMPTY_H256 = new Uint8Array(32)
const MOD_PREFIX = stringToU8a('modl')
const U32_OPTS = { bitLength: 32, isLe: true }

const createAccount = (api: ApiPromise, palletId: Uint8Array, poolId: BN, index: number) => {
  return api.registry
    .createType(
      'AccountId32',
      u8aConcat(MOD_PREFIX, palletId, new Uint8Array([index]), bnToU8a(poolId, U32_OPTS), EMPTY_H256)
    )
    .toString()
}

export const createAccounts = (api: ApiPromise, poolId: BN) => {
  const palletId = api.consts.nominationPools.palletId.toU8a()

  return {
    rewardId: createAccount(api, palletId, poolId, 1),
    stashId: createAccount(api, palletId, poolId, 0),
  }
}
