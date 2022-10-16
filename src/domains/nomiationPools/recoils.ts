import '@polkadot/api-augment/substrate'

import { selector } from 'recoil'

import { apiState } from '../chains/recoils'
import { polkadotAccountsState } from '../extension/recoils'

export const allPendingPoolRewardsState = selector({
  key: 'AllPendingRewards',
  get: ({ get }) => {
    const api = get(apiState)
    const accounts = get(polkadotAccountsState)

    return Promise.all(
      accounts.map(({ address }) =>
        api.call.nominationPoolsApi.pendingRewards(address).then(result => [address, result] as const)
      )
    )
  },
})
