import { storageEffect } from '../common/effects'
import type { InjectedAccount } from '@polkadot/extension-inject/types'
import { useSignetSdk } from '@talismn/signet-apps-sdk'
import { array, jsonParser, object, optional, string } from '@recoiljs/refine'
import { tryParseSubstrateOrEthereumAddress } from '../../util/addressValidation'
import { Maybe } from '../../util/monads'
import { isNilOrWhitespace } from '../../util/nil'
import { uniqBy } from 'lodash'
import { useUpdateEffect } from 'react-use'
import { atom, selector, useRecoilValue, useSetRecoilState, waitForAll } from 'recoil'
import { isAddress as isEvmAddress } from 'viem'
import router from '../../routes'
import { useEffect } from 'react'

type AccountWithOrigin = InjectedAccount & { origin?: 'injected' | 'local' }

type AccountWithReadonlyInfo = InjectedAccount & ({ readonly?: false } | { readonly: true; partOfPortfolio: boolean })

export type Account = AccountWithOrigin & AccountWithReadonlyInfo & { canSignEvm?: boolean }

export type ReadonlyAccount = Pick<Account, 'address' | 'name'>

const lookupAddressSearchKey = 'lookup-address'

export const lookupAccountAddressState = atom<string | undefined>({
  key: 'LookupAccountAddress',
  default: new URLSearchParams(globalThis.location.search).get(lookupAddressSearchKey) ?? undefined,
  effects: [
    // Add lookup address to search params on change
    ({ onSet, getPromise }) => {
      onSet(newValue => {
        const searchParams = new URLSearchParams(globalThis.location.search)

        if (newValue === undefined || newValue.trim() === '') {
          searchParams.delete(lookupAddressSearchKey)
        } else {
          searchParams.set(lookupAddressSearchKey, newValue)
        }

        void router.navigate('?' + searchParams.toString(), { replace: true })
      })

      // Persist lookup address between navigation
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      router.subscribe(async state => {
        const search = new URLSearchParams(state.location.search)
        const currentValue = await getPromise(lookupAccountAddressState)

        if (!search.has(lookupAddressSearchKey) && !isNilOrWhitespace(currentValue)) {
          search.set(lookupAddressSearchKey, currentValue)
          void router.navigate('?' + search.toString(), { replace: true })
        }
      })
    },
  ],
})

export const lookupAccountsState = selector<Account[]>({
  key: 'LookupAccount',
  get: ({ get }) =>
    Maybe.of(get(lookupAccountAddressState)).mapOr([] as Account[], address =>
      address
        .split(',')
        .map(x => x.trim())
        .filter(x => x !== '')
        .map(address => tryParseSubstrateOrEthereumAddress(address))
        .filter((result): result is NonNullable<typeof result> => result !== undefined)
        .map(address => ({
          address,
          readonly: true,
          partOfPortfolio: false,
          type: isEvmAddress(address) ? ('ethereum' as const) : undefined,
        }))
    ),
})

const _substrateInjectedAccountsState = atom<AccountWithReadonlyInfo[]>({
  key: '_SubstrateInjectedAccounts',
  default: [],
})

export const substrateInjectedAccountsState = selector<Account[]>({
  key: 'SubstrateInjectedAccounts',
  get: ({ get }) => get(_substrateInjectedAccountsState).map(x => ({ ...x, origin: 'injected' })),
  set: ({ set }, newValue) => set(_substrateInjectedAccountsState, newValue),
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
    const injectedAccounts = get(substrateInjectedAccountsState)
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

export const wagmiAccountsState = atom<Account[]>({
  key: 'WagmiAccounts',
  default: [],
})

export const accountsState = selector({
  key: 'Accounts',
  get: ({ get }) => {
    const signetAccount = get(signetAccountState)
    if (signetAccount !== undefined) return [{ ...signetAccount, readonly: false, partOfPortfolio: true }]

    const substrateInjecteds = get(substrateInjectedAccountsState)
    // Hack to retrieve name from that is only available from substrate injected accounts
    const wagmiInjected = get(wagmiAccountsState).map(x => ({
      ...x,
      name: substrateInjecteds.find(y => y.address === x.address)?.name,
    }))
    const lookupAccounts = get(lookupAccountsState)

    return uniqBy(
      [...wagmiInjected, ...substrateInjecteds, ...get(readOnlyAccountsState), ...lookupAccounts],
      x => x.address
    )
  },
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

export const writeableEvmAccountsState = selector({
  key: 'WriteableEvmAccounts',
  get: ({ get }) => get(writeableAccountsState).filter(x => x.type === 'ethereum'),
})

export const evmSignableAccountsState = selector({
  key: 'EvmSignableAccounts',
  get: ({ get }) => get(writeableAccountsState).filter(x => x.type === 'ethereum' && x.canSignEvm),
})

export const substrateAccountsState = selector({
  key: 'SubstrateAccounts',
  get: ({ get }) => {
    const accounts = get(accountsState)
    return accounts.filter(x => x.type !== 'ethereum')
  },
})

export const evmAccountsState = selector({
  key: 'EvmAccountsState',
  get: ({ get }) => {
    const accounts = get(accountsState)
    return accounts.filter(x => x.type === 'ethereum')
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
    const signetAccount = get(signetAccountState)
    if (signetAccount !== undefined) return [signetAccount]

    const [accounts, portfolioAccounts, readOnlyAccounts, selectedAddresses, lookupAccounts] = get(
      waitForAll([
        accountsState,
        portfolioAccountsState,
        readOnlyAccountsState,
        selectedAccountAddressesState,
        lookupAccountsState,
      ])
    )

    if (lookupAccounts.length > 0) {
      return lookupAccounts
    }

    const onlyHasReadonlyAccounts = portfolioAccounts.length === 0 && readOnlyAccounts.length > 0
    const defaultDisplayedAccounts = onlyHasReadonlyAccounts
      ? Maybe.of(readOnlyAccounts[0]).mapOr([], x => [x])
      : portfolioAccounts

    if (selectedAddresses === undefined) {
      return defaultDisplayedAccounts
    }

    const selectedAccounts = accounts.filter(({ address }) => selectedAddresses.includes(address))

    // TODO: clean this up
    return selectedAccounts.length === 0 ? defaultDisplayedAccounts : selectedAccounts
  },
})

export const selectedSubstrateAccountsState = selector({
  key: 'SelectedSubstrateAccounts',
  get: ({ get }) => {
    return get(selectedAccountsState).filter(x => x.type !== 'ethereum')
  },
})

export const selectedEvmAccountsState = selector({
  key: 'SelectedEvmAccountsState',
  get: ({ get }) => {
    const accounts = get(selectedAccountsState)
    return accounts.filter(x => x.type === 'ethereum')
  },
})

export const AccountWatcher = () => {
  const selectedAddresses = useRecoilValue(selectedAccountAddressesState)
  const setLookupAccountAddress = useSetRecoilState(lookupAccountAddressState)

  useUpdateEffect(() => {
    setLookupAccountAddress(undefined)
  }, [selectedAddresses])

  return null
}

export const signetAccountState = atom<InjectedAccount | undefined>({
  key: 'SignetAccount',
  default: undefined,
})

export const SignetWatcher = () => {
  const { inSignet, sdk } = useSignetSdk()
  const setSignetVaultAccount = useSetRecoilState(signetAccountState)

  useEffect(() => {
    if (inSignet) {
      sdk
        .getAccount()
        .then(vault => {
          setSignetVaultAccount({
            address: vault.vaultAddress,
            genesisHash: vault.chain.genesisHash,
            name: vault.name,
          })
        })
        .catch(e => {
          console.error('Failed to inject Signet account', e)
        })
    }
  }, [inSignet, sdk, setSignetVaultAccount])

  return null
}
