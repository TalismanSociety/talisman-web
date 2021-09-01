import { debounce } from 'lodash'
import { FC, useContext as _useContext, createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

// TODO: Cache token USD values locally
// TODO: Update token USD values in the background

//
// Constants
//

const api = 'https://api.coingecko.com/api/v3'
const apiCoinsList = `${api}/coins/list`
const apiSimplePrice = `${api}/simple/price`

//
// Types
//

export type TokenPrices = { [key: string]: TokenPrice }
export type TokenPrice = {
  token: string
  loading: boolean

  id?: string
  symbol?: string
  name?: string

  price?: string
}

export type Coin = { id?: string; symbol?: string; name?: string }

//
// Hooks (exported)
//

export function useTokenPrices(tokens: string[]): TokenPrice[] {
  const { coins, tokenPrices, addToken } = useContext()

  useEffect(() => {
    if (coins.length < 1) return
    tokens.filter(Boolean).forEach(addToken)
  }, [coins, tokens, addToken])

  return useMemo(
    () =>
      tokens.map(token => {
        if (tokenPrices[token]) return tokenPrices[token]
        return { token, loading: true }
      }),
    [tokens, tokenPrices]
  )
}

export function useTokenPrice(token: string): TokenPrice {
  const tokens = useMemo(() => [token], [token])
  return useTokenPrices(tokens)[0]
}

//
// Hooks (internal)
//

function _useCoins() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [attempt, setAttempt] = useState(1)

  useEffect(() => {
    fetch(apiCoinsList, { headers: { Accept: 'application/json' } })
      .then(response => response.json())
      .then(setCoins)
      .catch(error => {
        const timeoutSeconds = 5
        console.error(
          `Failed to fetch ${apiCoinsList} (attempt ${attempt}, retrying in ${timeoutSeconds} seconds`,
          error
        )
        setTimeout(() => setAttempt(attempt => attempt + 1), timeoutSeconds * 1000)
      })
  }, [attempt])

  return coins
}

function _useTokenPrices(coins: Coin[]): [TokenPrices, (token: string) => void] {
  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({})

  const fetchTokens = useRef<Array<[string, string]>>([])
  const [fetchTokenBatch, setFetchTokenBatch] = useState(0)
  const fetchNextBatch = useMemo(() => debounce(() => setFetchTokenBatch(batch => (batch + 1) % 999), 150), [])

  useEffect(() => {
    const tokens = fetchTokens.current.splice(0)
    if (tokens.length < 1) return

    const idToToken = Object.fromEntries(tokens)
    const tokenIds = Object.keys(idToToken)

    fetch(`${apiSimplePrice}?ids=${tokenIds.join(',')}&vs_currencies=usd`)
      .then(response => response.json())
      .then(result =>
        Object.entries(result).forEach(([tokenId, { usd }]: any) =>
          setTokenPrices(tokenPrices => ({
            ...tokenPrices,
            [idToToken[tokenId]]: { ...tokenPrices[idToToken[tokenId]], loading: false, price: usd },
          }))
        )
      )
  }, [fetchTokenBatch])

  const addToken = useCallback(
    (token: string) => {
      const coinCandidates = coins.filter(coin => coin.symbol === token.toLowerCase())
      if (coinCandidates.length < 1) {
        console.error(`Failed to find token ${token}`)
        setTokenPrices(tokenPrices => ({ ...tokenPrices, [token]: { token, loading: false } }))
        return
      }

      if (coinCandidates.length > 1)
        console.warn(
          `Multiple candidates for token ${token}: ${coinCandidates
            .map(coin => `${coin.name} (${coin.id})`)
            .join(', ')}`
        )

      const coin = coinCandidates[0]

      setTokenPrices(tokenPrices => ({ ...tokenPrices, [token]: { token, loading: true, ...coin } }))
      coin.id && fetchTokens.current.push([coin.id, token])
      fetchNextBatch()
    },
    [coins, fetchNextBatch]
  )

  return [tokenPrices, addToken]
}

//
// Context
//

type ContextProps = {
  coins: Coin[]
  tokenPrices: TokenPrices
  addToken: (token: string) => void
}

const Context = createContext<ContextProps | null>(null)

function useContext() {
  const context = _useContext(Context)
  if (!context) throw new Error('The tokenprices provider is required in order to use this hook')

  return context
}

//
// Provider
//

type ProviderProps = {}

export const Provider: FC<ProviderProps> = ({ children }) => {
  const coins = _useCoins()
  const [tokenPrices, addToken] = _useTokenPrices(coins)

  const value = useMemo(() => ({ coins, tokenPrices, addToken }), [coins, tokenPrices, addToken])

  return <Context.Provider value={value}>{children}</Context.Provider>
}
