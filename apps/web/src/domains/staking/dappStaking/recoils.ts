import { ChainContext, dappStakingEnabledChainsState } from '@domains/chains'
import { chainReadIdState, substrateApiState } from '@domains/common'
import { useContext } from 'react'
import { selectorFamily, type RecoilValue } from 'recoil'

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

export const registeredDappsState = selectorFamily({
  key: 'DappStaking/RegisteredDApps',
  get:
    (params: { genesisHash: string; dappStakingApiEndpoint: string }) =>
    async ({ get }) => {
      const chain = get(dappStakingEnabledChainsState).find(x => x.genesisHash === params.genesisHash)
      const priorityDapp = chain?.priorityDapp

      const dapps = await Promise.all([
        fetch(new URL('./dappssimple', params.dappStakingApiEndpoint.replace('v3', 'v1'))),
        fetch(new URL('./chaindapps', params.dappStakingApiEndpoint)),
      ])
        .then(
          async ([x, y]) =>
            [
              (await x.json()) as Array<{
                imagesUrl: string
                address: string
                name: string
                mainCategory: string
                iconUrl: string
                creationTime: number
              }>,
              (await y.json()) as Array<{
                contractAddress: string
                stakersCount: number
                registeredAt: string
                registrationBlockNumber: 5335633
                unregisteredAt: string | null
                unregistrationBlockNumber: string | null
              }>,
            ] as const
        )
        .then(([simpleInfo, chainInfo]) =>
          simpleInfo.map(x => ({
            ...x,
            stakerCount:
              chainInfo.find(y => y.contractAddress.toLowerCase() === x.address.toLowerCase())?.stakersCount ?? 0,
          }))
        )

      const sortedDapps =
        priorityDapp === undefined
          ? dapps
          : [
              ...[dapps.find(x => x.address.toLowerCase() === priorityDapp.toLowerCase())].filter(
                (x): x is NonNullable<typeof x> => x !== undefined
              ),
              ...dapps.filter(x => x.address.toLowerCase() !== priorityDapp.toLowerCase()),
            ]

      return sortedDapps
    },
})

export type DappInfo = (ReturnType<typeof registeredDappsState> extends RecoilValue<infer R> ? R : never)[number]

export const useRegisteredDappsState = () => {
  const chain = useContext(ChainContext)

  if (!('hasDappStaking' in chain)) {
    throw new Error(`Chain ${chain.genesisHash} does not have DApp staking`)
  }

  return registeredDappsState({ genesisHash: chain.genesisHash, dappStakingApiEndpoint: chain.dappStakingApi })
}
