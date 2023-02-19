import { accountsState } from '@domains/accounts/recoils'
import { Balances } from '@talismn/balances'
import { balanceModules } from '@talismn/balances-default-modules'
import { useBalances as _useBalances, useChaindata, useTokens } from '@talismn/balances-react'
import { ChaindataProvider, TokenList } from '@talismn/chaindata-provider'
import { isNil } from 'lodash'
import { useEffect, useMemo } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'

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

  const addressesByToken = useMemo(() => {
    if (isNil(addresses)) return {}
    return Object.fromEntries(tokenIds.map(tokenId => [tokenId, addresses]))
  }, [addresses, tokenIds])

  const balances = _useBalances(balanceModules, chaindata, addressesByToken, {
    onfinalityApiKey: process.env.REACT_APP_ONFINALITY_API_KEY,
  })

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

  return null
}
