import { injectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { SubstrateApiContext, substrateApiState } from '@domains/common'
import { useChainState } from '@domains/common/hooks'
import { range } from 'lodash/fp'
import { useContext } from 'react'
import {
  RecoilLoadable,
  constSelector,
  selectorFamily,
  useRecoilValue,
  useRecoilValueLoadable,
  waitForAll,
} from 'recoil'

const eraExposedAccountsState = selectorFamily({
  key: 'EraExposedAccounts',
  get:
    ({ endpoint, era }: { endpoint: string; era: number }) =>
    ({ get }) =>
      get(substrateApiState(endpoint))
        .query.staking.erasStakers.entries(era)
        .then(x =>
          x.flatMap(([_, exposure]) => (exposure as any).others.flatMap(({ who }: any) => who.toString() as string))
        )
        .then(array => new Set(array)),
})

const exposedAccountsState = selectorFamily({
  key: 'ExposedAccount',
  get:
    ({ endpoint, activeEra }: { endpoint: string; activeEra: number }) =>
    ({ get }) => {
      const api = get(substrateApiState(endpoint))
      const startEraToCheck = activeEra - api.consts.staking.bondingDuration.toNumber()

      return get(
        waitForAll(range(startEraToCheck, activeEra).map(era => eraExposedAccountsState({ endpoint, era })))
      ).reduce((prev, curr) => new Set([...prev, ...curr]))
    },
})

export const useExposedAccounts = () => {
  const apiEndpoint = useContext(SubstrateApiContext).endpoint
  const activeEra = useChainState('query', 'staking', 'activeEra', [])

  const loadable = useRecoilValueLoadable(
    activeEra.state !== 'hasValue'
      ? constSelector(new Set([]))
      : exposedAccountsState({
          endpoint: apiEndpoint,
          activeEra: activeEra.contents.unwrapOrDefault().index.toNumber(),
        })
  )

  if (activeEra.state !== 'hasValue') {
    return RecoilLoadable.loading() as typeof loadable
  }

  return loadable
}

export const useFastUnstakeEligibleAccounts = () => {
  const accounts = useRecoilValue(injectedSubstrateAccountsState)

  const exposedAccountsLoadable = useExposedAccounts()
  const ledgersLoadable = useChainState(
    'query',
    'staking',
    'ledger.multi',
    accounts.map(x => x.address)
  )

  return RecoilLoadable.all([exposedAccountsLoadable, ledgersLoadable]).map(([exposedAccounts, ledgers]) =>
    accounts.filter(
      account =>
        !exposedAccounts.has(account.address) &&
        ledgers.find(ledger => ledger.unwrapOrDefault().stash.toString() === account.address)?.unwrapOrDefault()
          .unlocking.length === 0
    )
  )
}
