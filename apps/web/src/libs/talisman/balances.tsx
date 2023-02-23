import { useAllAccountAddresses } from '@libs/talisman'
import { AddressesByToken, Balances } from '@talismn/balances'
import { useBalances as _useBalances, useAllAddresses, useTokens } from '@talismn/balances-react'
import { Token } from '@talismn/chaindata-provider'
import { isNil } from 'lodash'
import { PropsWithChildren, createContext, useContext, useEffect, useMemo } from 'react'

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
}

const Context = createContext<ContextProps>({
  balances: undefined,
  assetsTransferable: '',
  assetsOverallValue: 0,
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
  const addresses = useAllAccountAddresses()
  const [, setAllAddresses] = useAllAddresses()
  useEffect(() => setAllAddresses(addresses ?? []), [addresses, setAllAddresses])

  const tokens = useTokens()
  const tokenIds = useMemo(() => Object.values(tokens).map(({ id }) => id), [tokens])

  const addressesByToken = useAddressesByToken(addresses, tokenIds)
  const balances = _useBalances(addressesByToken)

  const assetsTransferable =
    (balances?.sum.fiat('usd').transferable ?? 0).toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    }) ?? ' -'

  const assetsOverallValue = balances?.sum.fiat('usd').total ?? 0

  return (
    <Context.Provider
      value={useMemo(
        () => ({ balances, assetsTransferable, assetsOverallValue }),
        [balances, assetsTransferable, assetsOverallValue]
      )}
    >
      {children}
    </Context.Provider>
  )
}
