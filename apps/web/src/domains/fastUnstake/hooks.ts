import { injectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { SubstrateApiContext, chainQueryState, substrateApiState } from '@domains/common'
import { array, assertion, jsonParser, number, object, string } from '@recoiljs/refine'
import { useContext } from 'react'
import { selectorFamily, waitForAll } from 'recoil'
// @ts-expect-error
import { Thread, spawn } from 'threads'

import { WorkerModule } from './worker'

const STORAGE_KEY = 'fast-unstake-exposure'

const fastUnstakeExposureChecker = array(
  object({
    genesisHash: string(),
    era: number(),
    exposed: array(string()),
  })
)

const fastUnstakeExposureAsssertion = assertion(fastUnstakeExposureChecker)

const fastUnstakeExposureJsonParser = jsonParser(fastUnstakeExposureChecker)

const exposedAccountsState = selectorFamily({
  key: 'ExposedAccount',
  get:
    (endpoint: string) =>
    async ({ get }): Promise<Set<string>> => {
      const api = get(substrateApiState(endpoint))
      const activeEra = get(chainQueryState(endpoint, 'staking', 'activeEra', [])).unwrapOrDefault().index.toNumber()

      const genesisHash = api.genesisHash.toHex()
      const storedValue = fastUnstakeExposureJsonParser(sessionStorage.getItem(STORAGE_KEY))

      const precomputedExposure = storedValue?.find(x => x.genesisHash === genesisHash && x.era === activeEra)

      if (precomputedExposure !== undefined) {
        return new Set(precomputedExposure.exposed)
      }

      const worker = await spawn<WorkerModule>(new Worker(new URL('./worker', import.meta.url)))
      const exposed = await worker.getExposedAccounts(endpoint, activeEra)

      Thread.terminate(worker)

      const newStoredValue = (storedValue ?? [])
        .filter(x => x.genesisHash !== genesisHash)
        .concat([{ genesisHash, era: activeEra, exposed: Array.from(exposed) }])

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fastUnstakeExposureAsssertion(newStoredValue)))

      return exposed
    },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

const fastUnstakeEligibleAccountsState = selectorFamily({
  key: 'FastUnstakeEligibleAccounts',
  get:
    (endpoint: string) =>
    async ({ get }) => {
      const [accounts, exposedAccounts] = get(
        waitForAll([injectedSubstrateAccountsState, exposedAccountsState(endpoint)])
      )

      const ledgers = get(
        chainQueryState(
          endpoint,
          'staking',
          'ledger.multi',
          accounts.map(x => x.address)
        )
      )

      return accounts.filter(
        account =>
          !exposedAccounts.has(account.address) &&
          ledgers?.find(ledger => ledger.unwrapOrDefault().stash.toString() === account.address)?.unwrapOrDefault()
            .unlocking.length === 0
      )
    },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const useFastUnstakeEligibleAccountsState = () =>
  fastUnstakeEligibleAccountsState(useContext(SubstrateApiContext).endpoint)
