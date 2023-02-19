// TODO: nuke everything and re-write balances lib integration

import { accountsState } from '@domains/accounts/recoils'
import { Balances } from '@talismn/balances'
import { balanceModules } from '@talismn/balances-default-modules'
import { useBalances as _useBalances, useChaindata, useTokens } from '@talismn/balances-react'
import { ChaindataProvider, TokenList } from '@talismn/chaindata-provider'
import { groupBy, isNil } from 'lodash'
import { useEffect, useMemo } from 'react'
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'

export type LegacyBalances = {
  balances: Balances | undefined
  assetsTransferable: string | null
  assetsOverallValue: number
  tokenIds: string[]
  tokens: TokenList | any
  chaindata: (ChaindataProvider & { generation?: number | undefined }) | null
}

export const legacyBalancesState = atom<LegacyBalances>({
  key: 'LegacyBalances',
  default: {
    balances: undefined,
    assetsTransferable: '',
    assetsOverallValue: 0,
    tokenIds: [],
    tokens: [],
    chaindata: null,
  },
  dangerouslyAllowMutability: true,
})

export const totalFiatBalanceState = selector({
  key: 'TotalFiatBalance',
  get: ({ get }) => get(legacyBalancesState).assetsOverallValue,
})

export const totalLocalizedFiatBalanceState = selector({
  key: 'TotalLocalizedFiatBalanceState',
  get: ({ get }) =>
    get(totalFiatBalanceState).toLocaleString(undefined, {
      style: 'currency',
      currency: 'usd',
      currencyDisplay: 'narrowSymbol',
    }),
})

export const fiatBalancesState = atom({
  key: 'FiatBalances',
  default: {} as Record<string, number>,
})

export const LegacyBalancesWatcher = () => {
  const setLegacyBalances = useSetRecoilState(legacyBalancesState)

  const chaindata = useChaindata({ onfinalityApiKey: process.env.REACT_APP_ONFINALITY_API_KEY })
  const accounts = useRecoilValue(accountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const tokens = useTokens(chaindata)

  const tokenIds = useMemo(
    () =>
      Object.values(tokens)
        // filter out testnet tokens
        .filter(({ isTestnet }) => !isTestnet)
        .map(({ id }) => id),
    [tokens]
  )

  const addressesByToken = useMemo(
    () => {
      if (isNil(addresses)) return {}
      return Object.fromEntries(tokenIds.map(tokenId => [tokenId, addresses]))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(addresses), JSON.stringify(tokenIds)]
  )

  const balances = _useBalances(
    balanceModules,
    chaindata,
    addressesByToken,
    useMemo(
      () => ({
        onfinalityApiKey: process.env.REACT_APP_ONFINALITY_API_KEY,
      }),
      []
    )
  )

  const assetsAmount = balances?.sum.fiat('usd').transferable ?? 0

  const assetsTransferable =
    assetsAmount.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    }) ?? ' -'

  const assetsOverallValue = balances?.sum.fiat('usd').total ?? 0

  const value = useMemo(
    () => ({ balances, assetsTransferable, tokenIds, tokens, chaindata, assetsOverallValue }),
    [balances, assetsTransferable, tokenIds, tokens, chaindata, assetsOverallValue]
  )

  useEffect(() => {
    setLegacyBalances(value)
  }, [setLegacyBalances, value])

  const setFiatBalances = useSetRecoilState(fiatBalancesState)

  const AddressesFiatBalance = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(groupBy(balances?.sorted ?? [], 'address')).map(([key, value]) => [
          key,
          value.reduce((previous, current) => previous + (current.total.fiat('usd') ?? 0), 0),
        ])
      ),
    [balances?.sorted]
  )

  useEffect(
    () => {
      setFiatBalances(
        Object.fromEntries(
          Object.entries(groupBy(balances?.sorted ?? [], 'address')).map(([key, value]) => [
            key,
            value.reduce((previous, current) => previous + (current.total.fiat('usd') ?? 0), 0),
          ])
        )
      )
    },
    // not doing this will cause constant re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(AddressesFiatBalance)]
  )

  return null
}
