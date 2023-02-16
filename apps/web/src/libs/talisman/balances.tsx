import { useAllAccountAddresses } from '@libs/talisman'
import { AddressesByToken, Balances } from '@talismn/balances'
import { balanceModules } from '@talismn/balances-default-modules'
import { useBalances as _useBalances, useChaindata, useTokens } from '@talismn/balances-react'
import { ChaindataProvider, Token, TokenList } from '@talismn/chaindata-provider'
import { isNil } from 'lodash'
import { PropsWithChildren, createContext, useContext, useMemo } from 'react'

export const useBalances = () => useBalanceContext()

function useAddressesByToken(addresses: string[] | null | undefined, tokenIds: Token['id'][]): AddressesByToken<Token> {
  return useMemo(() => {
    if (isNil(addresses)) return {}
    return Object.fromEntries(tokenIds.map(tokenId => [tokenId, addresses]))
  }, [addresses, tokenIds])
}

type ContextProps = {
  balances: Balances | undefined
  assetsTransferable: string | null
  assetsOverallValue: number
  tokenIds: string[]
  tokens: TokenList | any
  chaindata: (ChaindataProvider & { generation?: number | undefined }) | null
}

const Context = createContext<ContextProps>({
  balances: undefined,
  assetsTransferable: '',
  assetsOverallValue: 0,
  tokenIds: [],
  tokens: [],
  chaindata: null,
})

function useBalanceContext() {
  const context = useContext(Context)
  if (!context) throw new Error('The talisman balances provider is required in order to use this hook')

  return context
}

//
// Provider
//

export const Provider = ({ children }: PropsWithChildren) => {
  const chaindata = useChaindata({ onfinalityApiKey: process.env.REACT_APP_ONFINALITY_API_KEY })
  const addresses = useAllAccountAddresses()

  const tokens = useTokens(chaindata)

  const tokenIds = useMemo(
    () =>
      Object.values(tokens)
        // filter out testnet tokens
        .filter(({ isTestnet }) => !isTestnet)
        .map(({ id }) => id),
    [tokens]
  )

  const addressesByToken = useAddressesByToken(addresses, tokenIds)
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

  return <Context.Provider value={value}>{children}</Context.Provider>
}
