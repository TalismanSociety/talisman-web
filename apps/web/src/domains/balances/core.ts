// TODO: nuke everything and re-write balances lib integration

import {
  accountsState,
  injectedAccountsState,
  portfolioAccountsState,
  selectedAccountsState,
} from '@domains/accounts/recoils'
import { Balances } from '@talismn/balances'
import { useBalances as _useBalances, useAllAddresses, useChaindata, useTokens } from '@talismn/balances-react'
import { type ChaindataProvider, type TokenList } from '@talismn/chaindata-provider'
import { groupBy, isNil } from 'lodash'
import { useEffect, useMemo } from 'react'
import { atom, selector, useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil'
import { selectedCurrencyState } from '.'

export type LegacyBalances = {
  balances: Balances | undefined
  assetsTransferable: string | null
  assetsOverallValue: number
  tokenIds: string[]
  tokens: TokenList | any
  chaindata: (ChaindataProvider & { generation?: number | undefined }) | undefined
}

export const legacyBalancesState = atom<LegacyBalances>({
  key: 'LegacyBalances',
  default: {
    balances: undefined,
    assetsTransferable: '',
    assetsOverallValue: 0,
    tokenIds: [],
    tokens: [],
    chaindata: undefined,
  },
  dangerouslyAllowMutability: true,
})

export const balancesState = atom<Balances>({
  key: 'Balances',
  default: new Balances([]),
  dangerouslyAllowMutability: true,
})

export const injectedBalancesState = selector({
  key: 'InjectedBalances',
  get: ({ get }) => {
    const injectedAddresses = get(injectedAccountsState).map(x => x.address)
    return new Balances(get(balancesState).each.filter(x => injectedAddresses.includes(x.address)))
  },
  dangerouslyAllowMutability: true,
})

export const injectedNominationPoolBalances = selector({
  key: 'InjectedNominationPoolFiatBalance',
  get: ({ get }) =>
    get(injectedBalancesState).find(
      balance => balance.source === 'substrate-native' && balance.toJSON().subSource === 'nompools-staking'
    ),
  dangerouslyAllowMutability: true,
})

export const selectedBalancesState = selector({
  key: 'SelectedBalances',
  get: ({ get }) => {
    const selectedAddresses = get(selectedAccountsState).map(x => x.address)
    return new Balances(get(balancesState).sorted.filter(x => selectedAddresses.includes(x.address)))
  },
  dangerouslyAllowMutability: true,
})

export const fiatBalancesState = atom<Record<string, number>>({
  key: 'FiatBalances',
})

export const totalPortfolioFiatBalance = selector({
  key: 'TotalPortfolioFiatBalance',
  get: ({ get }) => {
    const accounts = get(portfolioAccountsState).map(x => x.address)
    const fiatBalances = get(fiatBalancesState)

    return Object.entries(fiatBalances)
      .filter(([key]) => accounts.includes(key))
      .reduce((previous, current) => previous + current[1], 0)
  },
})

export const totalSelectedAccountsFiatBalance = selector({
  key: 'TotalSelectedAccountsFiatBalance',
  get: ({ get }) => {
    const selecteds = get(selectedAccountsState).map(x => x.address)
    const fiatBalances = get(fiatBalancesState)

    return Object.entries(fiatBalances)
      .filter(([key]) => selecteds.includes(key))
      .reduce((previous, current) => previous + current[1], 0)
  },
})

export const LegacyBalancesWatcher = () => {
  const setLegacyBalances = useSetRecoilState(legacyBalancesState)

  const chaindata = useChaindata()
  const accounts = useRecoilValue(accountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const [, setAllAddresses] = useAllAddresses()
  useEffect(() => setAllAddresses(addresses ?? []), [addresses, setAllAddresses])

  const tokens = useTokens()
  const tokenIds = useMemo(() => Object.values(tokens).map(({ id }) => id), [tokens])

  const addressesByToken = useMemo(
    () => {
      if (isNil(addresses)) return {}
      return Object.fromEntries(tokenIds.map(tokenId => [tokenId, addresses]))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(addresses), JSON.stringify(tokenIds)]
  )

  const unfilteredBalances = _useBalances(addressesByToken)
  const balances = useMemo(() => unfilteredBalances.filterNonZero('total').filterMirrorTokens(), [unfilteredBalances])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    useRecoilCallback(({ set }) => () => {
      set(balancesState, balances)
    }),
    [balances]
  )

  const selectedAccounts = useRecoilValue(selectedAccountsState)
  const selectedAddresses = useMemo(() => selectedAccounts.map(x => x.address), [selectedAccounts])

  const balancesGroupByAddress = useMemo(() => groupBy(balances?.sorted, 'address'), [balances?.sorted])
  const selectedBalances = useMemo(() => {
    if (balances === undefined) {
      return
    }

    const selectedBalances = Object.entries(balancesGroupByAddress)
      .filter(([address]) => selectedAddresses.includes(address))
      .flatMap(x => x[1])

    return new Balances(selectedBalances)
  }, [balances, balancesGroupByAddress, selectedAddresses])

  const currency = useRecoilValue(selectedCurrencyState)

  const assetsTransferable =
    (selectedBalances?.sum.fiat(currency).transferable ?? 0).toLocaleString(undefined, {
      style: 'currency',
      currency,
    }) ?? ' -'

  const assetsOverallValue = selectedBalances?.sum.fiat(currency).total ?? 0

  const value = useMemo(
    () => ({ balances: selectedBalances, assetsTransferable, tokenIds, tokens, chaindata, assetsOverallValue }),
    [selectedBalances, assetsTransferable, tokenIds, tokens, chaindata, assetsOverallValue]
  )

  useEffect(() => {
    setLegacyBalances(value)
  }, [setLegacyBalances, value])

  const setFiatBalances = useSetRecoilState(fiatBalancesState)

  const addressesFiatBalance = useMemo(
    () =>
      Object.fromEntries(
        accounts.map(x => [x.address, balances.find({ address: x.address }).sum.fiat(currency).total])
      ),
    [accounts, balances, currency]
  )

  useEffect(() => {
    if (balances === undefined) {
      return
    }

    setFiatBalances(addressesFiatBalance)
  }, [addressesFiatBalance, balances, setFiatBalances])

  return null
}
