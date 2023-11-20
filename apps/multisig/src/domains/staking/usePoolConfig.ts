import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util'
import { useApi } from '../chains/pjs-api'
import { useSelectedMultisig } from '../multisig'

export const EmptyH256 = new Uint8Array(32)
export const ModPrefix = stringToU8a('modl')
export const U32Opts = { bitLength: 32, isLe: true }

// This code is copied from: https://github.com/paritytech/polkadot-staking-dashboard/blob/HEAD/src/contexts/Pools/PoolsConfig/index.tsx
// Helper: generates pool stash and reward accounts. assumes poolsPalletId is synced.
export const usePoolConfig = () => {
  const [multisig] = useSelectedMultisig()
  const { api } = useApi(multisig.chain.rpcs)

  // Helper: generates pool stash and reward accounts. assumes poolsPalletId is synced.
  const createAccounts = (poolId: number) => {
    const poolIdBigNumber = new BigNumber(poolId)
    return {
      stash: createAccount(poolIdBigNumber, 0),
      reward: createAccount(poolIdBigNumber, 1),
    }
  }

  const createAccount = (poolId: BigNumber, index: number): string => {
    if (!api) return ''
    return api.registry
      .createType(
        'AccountId32',
        u8aConcat(
          ModPrefix,
          api.consts.nominationPools.palletId.toU8a() ?? new Uint8Array(0),
          new Uint8Array([index]),
          bnToU8a(new BN(poolId.toString()), U32Opts),
          EmptyH256
        )
      )
      .toString()
  }

  return { createAccounts }
}
