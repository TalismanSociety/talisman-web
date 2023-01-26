import { substrateAccountsState } from '@domains/accounts/recoils'
import { chainReadIdState } from '@domains/common/recoils'
import type { AnyNumber } from '@polkadot/types-codec/types'
import DotPoolSelector, { ValidatorSelector, defaultOptions } from '@talismn/dot-pool-selector'
import { SerializableParam, selector, selectorFamily } from 'recoil'

import { apiState } from '../chains/recoils'

export const allPendingPoolRewardsState = selector({
  key: 'AllPendingRewards',
  get: ({ get }) => {
    get(chainReadIdState)

    const api = get(apiState)
    const accounts = get(substrateAccountsState)

    return Promise.all(
      accounts.map(({ address }) =>
        api.call.nominationPoolsApi.pendingRewards(address).then(result => [address, result] as const)
      )
    )
  },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

// TODO: refactor to selector that can read all storage entries
export const eraStakersState = selectorFamily({
  key: 'EraStakers',
  get:
    (era: Extract<AnyNumber, SerializableParam>) =>
    ({ get }) => {
      const api = get(apiState)

      return api.query.staking.erasStakers.entries(era)
    },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const recommendedPoolsState = selector({
  key: 'Staking/BondedPools',
  get: async ({ get }) => {
    const api = get(apiState)

    const recommendedPoolIds = await new DotPoolSelector(new ValidatorSelector(api), api, {
      ...defaultOptions,
      numberOfPools: Infinity,
    })
      .getPoolsMeetingCriteria()
      .then(x => x.map(({ poolId }) => poolId))

    const pools = await api.query.nominationPools.bondedPools
      .entries()
      .then(x => x.map(y => ({ poolId: y[0].args[0].toNumber() ?? 0, bondedPool: y[1] })))

    const names = await api.query.nominationPools.metadata.multi(pools.map(({ poolId }) => poolId))

    return pools
      .map((pool, index) => ({ ...pool, name: names[index]?.toUtf8() }))
      .filter(pool => pool.bondedPool.isSome)
      .map(pool => ({ ...pool, bondedPool: pool.bondedPool.unwrap() }))
      .sort((a, b) =>
        recommendedPoolIds.includes(a.poolId) && !recommendedPoolIds.includes(b.poolId)
          ? -1
          : recommendedPoolIds.includes(b.poolId) && !recommendedPoolIds.includes(a.poolId)
          ? 1
          : b.bondedPool.points.sub(a.bondedPool.points).toNumber()
      )
  },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})
