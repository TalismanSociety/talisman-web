import { storageEffect } from '@domains/common/effects'
import type { InjectedAccount } from '@polkadot/extension-inject/types'
import { array, jsonParser, object, optional, string } from '@recoiljs/refine'
import { Maybe } from '@util/monads'
import { DefaultValue, atom, selector, waitForAll } from 'recoil'
import { isAddress as isEvmAddress } from 'viem'

export type Account = InjectedAccount & {
  readonly?: boolean
}

export type ReadonlyAccount = Pick<Account, 'address' | 'name'>

/**
 * Includes both EVM & Substrate accounts
 */
export const DANGEROUS_INJECTED_ACCOUNTS_STATE = atom<Account[]>({
  key: 'InjectedAccounts',
  default: [],
})

export const injectedSubstrateAccountsState = selector({
  key: 'InjectedSubstrateAccountsState',
  get: ({ get }) => get(DANGEROUS_INJECTED_ACCOUNTS_STATE).filter(x => x.type !== 'ethereum'),
})

const _readOnlyAccountsState = atom<ReadonlyAccount[]>({
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
    const injectedAddresses = get(DANGEROUS_INJECTED_ACCOUNTS_STATE).map(x => x.address)
    return get(_readOnlyAccountsState)
      .filter(x => !injectedAddresses.includes(x.address))
      .map(x => ({ ...x, readonly: true, type: isEvmAddress(x.address) ? 'ethereum' : undefined }))
  },
  set: ({ set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(_readOnlyAccountsState)
    } else {
      set(_readOnlyAccountsState, newValue)
    }
  },
})

/**
 * Includes EVM, Substrate, readonly & non-selected accounts
 */
export const DANGEROUS_ACCOUNTS_STATE = selector({
  key: 'Accounts',
  get: ({ get }) => [...get(DANGEROUS_INJECTED_ACCOUNTS_STATE), ...get(readOnlyAccountsState)],
})

/**
 * Includes readonly accounts
 */
export const DANGEROUS_SUBSTRATE_ACCOUNTS_STATE = selector({
  key: 'SubstrateAccounts',
  get: ({ get }) => {
    const accounts = get(DANGEROUS_ACCOUNTS_STATE)
    return accounts.filter(x => x.type !== 'ethereum')
  },
})

export const selectedAccountAddressesState = atom<string[] | undefined>({
  key: 'SelectedAccountAddresses',
  default: undefined,
})

/**
 * Includes EVM, Substrate & readonly accounts
 */
export const DANGEROUS_SELECTED_ACCOUNTS_STATE = selector({
  key: 'SelectedAccounts',
  get: ({ get }) => {
    const [accounts, injectedAccounts, readOnlyAccounts, selectedAddresses] = get(
      waitForAll([
        DANGEROUS_ACCOUNTS_STATE,
        DANGEROUS_INJECTED_ACCOUNTS_STATE,
        readOnlyAccountsState,
        selectedAccountAddressesState,
      ])
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
    const [accounts, selectedAddresses] = get(waitForAll([DANGEROUS_ACCOUNTS_STATE, selectedAccountAddressesState]))

    if (selectedAddresses === undefined) return undefined

    return accounts.filter(({ address }) => selectedAddresses.includes(address))[0]
  },
})

/**
 * Includes readonly accounts
 */
export const DANGEROUS_SELECTED_SUBSTRATE_ACCOUNTS_STATE = selector({
  key: 'SelectedSubstrateAccounts',
  get: ({ get }) => {
    return get(DANGEROUS_SELECTED_ACCOUNTS_STATE).filter(x => x.type !== 'ethereum')
  },
})
