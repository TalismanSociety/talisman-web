import { storageEffect } from '@domains/common/effects'
import type { InjectedAccount } from '@polkadot/extension-inject/types'
import { array, jsonParser, object, optional, string } from '@recoiljs/refine'
import { Maybe } from '@util/monads'
import { uniqBy } from 'lodash'
import { atom, selector, waitForAll } from 'recoil'
import { isAddress as isEvmAddress } from 'viem'

type AccountWithOrigin = InjectedAccount & { origin?: 'injected' | 'local' }

type AccountWithReadonlyInfo = InjectedAccount & ({ readonly?: false } | { readonly: true; partOfPortfolio: boolean })

export type Account = AccountWithOrigin & AccountWithReadonlyInfo

export type ReadonlyAccount = Pick<Account, 'address' | 'name'>

const _injectedAccountsState = atom<AccountWithReadonlyInfo[]>({
  key: '_InjectedAccounts',
  default: [],
})

export const injectedAccountsState = selector<Account[]>({
  key: 'InjectedAccounts',
  get: ({ get }) => get(_injectedAccountsState).map(x => ({ ...x, origin: 'injected' })),
  set: ({ set }, newValue) => set(_injectedAccountsState, newValue),
})

const _readonlyAccountsState = atom<ReadonlyAccount[]>({
  key: 'readonly_accounts',
  default: [],
  effects: [
    storageEffect(localStorage, {
      parser: jsonParser(
        array(
          object({
            address: string(),
            name: optional(string()),
          })
        )
      ),
    }),
  ],
})

export const readOnlyAccountsState = selector<Account[]>({
  key: 'ReadonlyAccounts',
  get: ({ get }) => {
    const injectedAccounts = get(injectedAccountsState)
    const injectedAddresses = injectedAccounts.map(x => x.address)
    return [
      ...injectedAccounts.filter(x => x.readonly && !x.partOfPortfolio),
      ...get(_readonlyAccountsState)
        .filter(x => !injectedAddresses.includes(x.address))
        .map(x => ({
          ...x,
          origin: 'local' as const,
          readonly: true,
          partOfPortfolio: false,
          type: isEvmAddress(x.address) ? ('ethereum' as const) : undefined,
        })),
    ]
  },
  set: ({ set }, newValue) => set(_readonlyAccountsState, newValue),
})

export const accountsState = selector({
  key: 'Accounts',
  get: ({ get }) => uniqBy([...get(injectedAccountsState), ...get(readOnlyAccountsState)], x => x.address),
})

export const portfolioAccountsState = selector({
  key: 'PortfolioAccounts',
  get: ({ get }) => get(accountsState).filter(x => !x.readonly || x.partOfPortfolio),
})

export const writeableAccountsState = selector({
  key: 'WriteableAccounts',
  get: ({ get }) => get(accountsState).filter(x => !x.readonly),
})

export const writeableSubstrateAccountsState = selector({
  key: 'WriteableSubstrateAccounts',
  get: ({ get }) => get(writeableAccountsState).filter(x => x.type !== 'ethereum'),
})

export const substrateAccountsState = selector({
  key: 'SubstrateAccounts',
  get: ({ get }) => {
    const accounts = get(accountsState)
    return accounts.filter(x => x.type !== 'ethereum')
  },
})

export const selectedAccountAddressesState = atom<string[] | undefined>({
  key: 'SelectedAccountAddresses',
  default: undefined,
})

// TODO: either clean this up or add some tests
export const selectedAccountsState = selector({
  key: 'SelectedAccounts',
  get: ({ get }) => {
    const [accounts, injectedAccounts, readOnlyAccounts, selectedAddresses] = get(
      waitForAll([accountsState, injectedAccountsState, readOnlyAccountsState, selectedAccountAddressesState])
    )

    const onlyHasReadonlyAccounts = injectedAccounts.length === 0 && readOnlyAccounts.length > 0
    const defaultDisplayedAccounts = onlyHasReadonlyAccounts
      ? Maybe.of(readOnlyAccounts[0]).mapOr([], x => [x])
      : injectedAccounts

    if (selectedAddresses === undefined) {
      return defaultDisplayedAccounts
    }

    const selectedAccounts = accounts.filter(({ address }) => selectedAddresses.includes(address))

    // TODO: clean this up
    return selectedAccounts.length === 0 ? defaultDisplayedAccounts : selectedAccounts
  },
})

// For legacy components that only support single account selection
export const legacySelectedAccountState = selector({
  key: 'LegacySelectedAccounts',
  get: ({ get }) => {
    const [accounts, selectedAddresses] = get(waitForAll([accountsState, selectedAccountAddressesState]))

    if (selectedAddresses === undefined) return undefined

    return accounts.filter(({ address }) => selectedAddresses.includes(address))[0]
  },
})

export const selectedSubstrateAccountsState = selector({
  key: 'SelectedSubstrateAccounts',
  get: ({ get }) => {
    return get(selectedAccountsState).filter(x => x.type !== 'ethereum')
  },
})
