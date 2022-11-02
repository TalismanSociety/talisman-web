import '@polkadot/api-augment/substrate'

import { polkadotAccountsState } from '@domains/accounts/recoils'
import { chainReadIdState } from '@domains/common/recoils'
import type { AnyNumber } from '@polkadot/types-codec/types'
import { BN } from '@polkadot/util'
import DotPoolSelector, { ValidatorSelector, defaultOptions } from '@talismn/dot-pool-selector'
import { SerializableParam, selector, selectorFamily } from 'recoil'

import { apiState, chainIdState } from '../chains/recoils'

export const allPendingPoolRewardsState = selector({
  key: 'AllPendingRewards',
  get: ({ get }) => {
    get(chainReadIdState)

    const api = get(apiState)
    const accounts = get(polkadotAccountsState)

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
    const chainId = get(chainIdState)

    const recommendedPools = await new DotPoolSelector(
      new ValidatorSelector(api),
      api,
      chainId === 'polkadot'
        ? {
            ...defaultOptions,
            numberOfPools: Infinity,
            rootMinStake: new BN(10),
            minNumberOfValidators: 16,
            checkRootVerified: true,
            checkForDuplicateValidators: true,
          }
        : { ...defaultOptions, numberOfPools: Infinity }
    ).getPoolsMeetingCriteria()

    const pools =
      recommendedPools.length > 0
        ? await api.query.nominationPools.bondedPools
            .multi(recommendedPools.map(({ poolId }) => poolId))
            .then(bondedPools =>
              bondedPools.map((pool, index) => ({ poolId: recommendedPools[index]?.poolId ?? 0, bondedPool: pool }))
            )
        : await api.query.nominationPools.bondedPools
            .entries()
            .then(x => x.map(y => ({ poolId: y[0].args[0].toNumber() ?? 0, bondedPool: y[1] })))

    const names = await api.query.nominationPools.metadata.multi(pools.map(({ poolId }) => poolId))

    return pools
      .map((pool, index) => ({ ...pool, name: names[index]?.toUtf8() }))
      .filter(pool => pool.bondedPool.isSome)
      .map(pool => ({ ...pool, bondedPool: pool.bondedPool.unwrap() }))
      .sort((a, b) => b.bondedPool.points.sub(a.bondedPool.points).toNumber())
  },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})
