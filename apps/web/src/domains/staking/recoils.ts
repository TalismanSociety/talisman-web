import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { selectorFamily } from 'recoil'
// @ts-expect-error
import { Thread, spawn } from 'threads'

import { SubstrateApiContext } from '@domains/common'
import { useContext } from 'react'
import { type WorkerFunction } from './worker'

export const stakersRewardState = selectorFamily({
  key: 'StakersRewardState',
  get:
    ({ endpoint, activeEra }: { endpoint: string; activeEra: number }) =>
    async ({ get }) => {
      const addresses = get(selectedSubstrateAccountsState).map(x => x.address)

      const worker = await spawn<WorkerFunction>(new Worker(new URL('./worker', import.meta.url), { type: 'module' }))

      const stakerRewards = await worker(endpoint, addresses, [activeEra - 1, activeEra])

      Thread.terminate(worker)

      return stakerRewards
    },
})

export const useStakersRewardState = (activeEra: number) =>
  stakersRewardState({ endpoint: useContext(SubstrateApiContext).endpoint, activeEra })
