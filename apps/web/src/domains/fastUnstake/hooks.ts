import { substrateAccountsState } from '@domains/accounts/recoils'
import { apiState, chainRpcState } from '@domains/chains/recoils'
import { useChainState } from '@domains/common/hooks'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { range } from 'lodash/fp'
import {
  RecoilLoadable,
  constSelector,
  selector,
  selectorFamily,
  useRecoilValue,
  useRecoilValueLoadable,
  waitForAll,
} from 'recoil'

// Can't re-use global api because fast unstake eligibility check is very resource intensive and will congest all other subscriptions
const fastUnstakeApiState = selector({
  key: 'FastUnstakeApi',
  get: ({ get }) => ApiPromise.create({ provider: new WsProvider(get(chainRpcState)) }),
})

const eraExposedAccountsState = selectorFamily({
  key: 'EraExposedAccounts',
  get:
    (era: number) =>
    async ({ get }) =>
      get(fastUnstakeApiState)
        .query.staking.erasStakers.entries(era)
        .then(x => x.flatMap(([_, exposure]) => (exposure as any).others.flatMap(({ who }: any) => who.toString())))
        .then(array => new Set(array)),
})

const exposedAccountsState = selectorFamily({
  key: 'ExposedAccount',
  get:
    (activeEra: number) =>
    ({ get }) => {
      const api = get(apiState)
      const startEraToCheck = activeEra - api.consts.staking.bondingDuration.toNumber()

      return get(waitForAll(range(startEraToCheck, activeEra).map(eraExposedAccountsState))).reduce(
        (prev, curr) => new Set([...prev, ...curr])
      )
    },
})

export const useExposedAccounts = () => {
  const activeEra = useChainState('query', 'staking', 'activeEra', [])

  const loadable = useRecoilValueLoadable(
    activeEra.state !== 'hasValue'
      ? constSelector(new Set([]))
      : exposedAccountsState(activeEra.contents.unwrapOrDefault().index.toNumber())
  )

  if (activeEra.state !== 'hasValue') {
    return RecoilLoadable.loading() as typeof loadable
  }

  return loadable
}

export const useFastUnstakeEligibleAccounts = () => {
  const accounts = useRecoilValue(substrateAccountsState)

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
