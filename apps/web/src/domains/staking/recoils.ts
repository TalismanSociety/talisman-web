import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { chainIdState, chainsState } from '@domains/chains/recoils'
import { selectorFamily } from 'recoil'
// @ts-expect-error
import { Thread, spawn } from 'threads'

import { WorkerFunction } from './worker'

export const stakersRewardState = selectorFamily({
  key: 'StakersRewardState',
  get:
    (activeEra: number) =>
    async ({ get }) => {
      const chains = get(chainsState)
      const chainId = get(chainIdState)

      const chain = chains.find(x => x.id === chainId)

      if (chain === undefined) {
        throw new Error(`No chain found with id: ${chainId}`)
      }

      const addresses = get(selectedSubstrateAccountsState).map(x => x.address)

      const worker = await spawn<WorkerFunction>(new Worker(new URL('./worker', import.meta.url)))

      const stakerRewards = await worker(
        chain.rpcs.map(x => x.url),
        addresses,
        [activeEra - 1, activeEra]
      )

      Thread.terminate(worker)

      return stakerRewards
    },
})
