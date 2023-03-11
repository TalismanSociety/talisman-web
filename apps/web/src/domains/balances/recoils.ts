// TODO: nuke everything and re-write balances lib integration

import { accountsState, injectedAccountsState, selectedAccountsState } from '@domains/accounts/recoils'
import { Balances } from '@talismn/balances'
import { useBalances as _useBalances, useAllAddresses, useChaindata, useTokens } from '@talismn/balances-react'
import { ChaindataProvider, TokenList } from '@talismn/chaindata-provider'
import { groupBy, isNil } from 'lodash'
import { useEffect, useMemo } from 'react'
import { atom, selector, useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil'

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

export const balancesState = atom<Balances>({ key: 'Balances', dangerouslyAllowMutability: true })

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

export const totalInjectedAccountsFiatBalance = selector({
  key: 'TotalInjectedAccountsFiatBalance',
  get: ({ get }) => {
    const injecteds = get(injectedAccountsState).map(x => x.address)
    const fiatBalances = get(fiatBalancesState)

    return Object.entries(fiatBalances)
      .filter(([key]) => injecteds.includes(key))
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

export const totalLocalizedFiatBalanceState = selector({
  key: 'TotalLocalizedFiatBalanceState',
  get: ({ get }) =>
    get(totalInjectedAccountsFiatBalance).toLocaleString(undefined, {
      style: 'currency',
      currency: 'usd',
      currencyDisplay: 'narrowSymbol',
    }),
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

  const balances = _useBalances(addressesByToken)

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

  const assetsTransferable =
    (selectedBalances?.sum.fiat('usd').transferable ?? 0).toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    }) ?? ' -'

  const assetsOverallValue = selectedBalances?.sum.fiat('usd').total ?? 0

  const value = useMemo(
    () => ({ balances: selectedBalances, assetsTransferable, tokenIds, tokens, chaindata, assetsOverallValue }),
    [selectedBalances, assetsTransferable, tokenIds, tokens, chaindata, assetsOverallValue]
  )

  useEffect(() => {
    setLegacyBalances(value)
  }, [setLegacyBalances, value])

  const setFiatBalances = useSetRecoilState(fiatBalancesState)

  const addressesFiatBalance = useMemo(() => {
    Object.fromEntries(
      Object.entries(groupBy(selectedBalances?.sorted, 'address')).map(([key, value]) => [
        key,
        value.reduce((previous, current) => previous + (current.total.fiat('usd') ?? 0), 0),
      ])
    )
  }, [selectedBalances])

  useEffect(
    () => {
      if (balances === undefined) {
        return
      }

      setFiatBalances(
        Object.fromEntries(
          Object.entries(groupBy(balances.sorted ?? [], 'address')).map(([key, value]) => [
            key,
            value.reduce((previous, current) => previous + (current.total.fiat('usd') ?? 0), 0),
          ])
        )
      )
    },
    // not doing this will cause constant re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [balances, JSON.stringify(addressesFiatBalance)]
  )

  return null
}
