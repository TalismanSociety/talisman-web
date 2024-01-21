import { chainReadIdState, substrateApiState } from '@domains/common'
import { selectorFamily } from 'recoil'

export const stakedDappsState = selectorFamily({
  key: 'DappStaking/StakedDApps',
  get:
    (params: { endpoint: string; address: string }) =>
    async ({ get }) => {
      get(chainReadIdState)

      return (await get(substrateApiState(params.endpoint)).query.dappStaking.stakerInfo.entries(params.address))
        .filter(x => x[1].isSome)
        .map(x => [x[0], x[1].unwrapOrDefault()] as const)
    },
  dangerouslyAllowMutability: true,
})
