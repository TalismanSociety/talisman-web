import { useRecoilValue } from 'recoil'
import { Address } from '@util/addresses'
import { BondedPool, bondedPoolsState } from './NomPoolsWatcher'

/**
 * Returns a nom pool which the given address has a role for.
 * Returns undefined while loading, null if the address has no role in any pool.
 */
export const useNomPoolOf = (address: Address) => {
  const bondedPools = useRecoilValue(bondedPoolsState)

  if (!bondedPools) return undefined

  const findNomPoolWithRole = (): {
    pool: BondedPool
    role: keyof BondedPool['roles']
  } | null => {
    for (let i = 0; i < bondedPools.pools.length; i++) {
      const pool = bondedPools.pools[i]!
      if (pool.roles.root.isEqual(address)) {
        return { pool, role: 'root' }
      }
      if (pool.roles.nominator.isEqual(address)) {
        return { pool, role: 'nominator' }
      }
      if (pool.roles.depositor.isEqual(address)) {
        return { pool, role: 'depositor' }
      }
      if (pool.roles.bouncer.isEqual(address)) {
        return { pool, role: 'bouncer' }
      }
    }

    return null
  }

  return findNomPoolWithRole()
}
