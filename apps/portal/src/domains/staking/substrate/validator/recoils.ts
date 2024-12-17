import { selectorFamily } from 'recoil'
import { spawn, Thread } from 'threads'

import { selectedSubstrateAccountsState } from '@/domains/accounts/recoils'
import { useSubstrateApiEndpoint } from '@/domains/common/hooks/useSubstrateApiEndpoint'

import type { WorkerFunction } from './worker'

export const stakersRewardState = selectorFamily({
  key: 'StakersRewardState',
  get:
    ({ endpoint, activeEra }: { endpoint: string; activeEra: number }) =>
    async ({ get }) => {
      const addresses = get(selectedSubstrateAccountsState).map(x => x.address)

      const worker = await spawn<WorkerFunction>(new Worker(new URL('./worker', import.meta.url), { type: 'module' }))

      const stakerRewards = await worker(endpoint, addresses, [activeEra - 1, activeEra])

      void Thread.terminate(worker)

      return stakerRewards
    },
})

export const useStakersRewardState = (activeEra: number) =>
  stakersRewardState({ endpoint: useSubstrateApiEndpoint(), activeEra })
