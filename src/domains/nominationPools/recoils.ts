import '@polkadot/api-augment/substrate'

import { polkadotAccountsState } from '@domains/accounts/recoils'
import { selector } from 'recoil'

import { apiState } from '../chains/recoils'

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
