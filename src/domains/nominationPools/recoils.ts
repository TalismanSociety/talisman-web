import '@polkadot/api-augment/substrate'

import { polkadotAccountsState } from '@domains/accounts/recoils'
import { chainReadIdState } from '@domains/common/recoils'
import type { AnyNumber } from '@polkadot/types-codec/types'
import { SerializableParam, selector, selectorFamily } from 'recoil'

import { apiState } from '../chains/recoils'

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
})
