import { Token } from '@domains/chains'
import { activeMultisigsState, selectedMultisigState } from '@domains/multisig'
import { Balances } from '@talismn/balances'
import { useAllAddresses, useBalances, useTokens } from '@talismn/balances-react'
import { useEffect, useMemo } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'

import { TokenAugmented } from '../../layouts/Overview/Assets'

// create a new atom for deciding whether to show all balances or just the selected multisig
export const showAllBalancesState = atom<boolean>({
  key: 'ShowAllBalances',
  default: false,
})

export const balancesState = atom<Balances | undefined>({
  key: 'Balances',
  default: undefined,
  dangerouslyAllowMutability: true,
})

export const useAugmentedBalances = () => {
  const balances = useRecoilValue(balancesState)

  return useMemo(() => {
    if (!balances) return []
    return balances.filterNonZero('total').sorted.reduce((acc: TokenAugmented[], b) => {
      if (!b.chain || !b.token) return acc

      const avaliable = parseFloat(b.transferable.tokens)
      const unavaliable = parseFloat(b.total.tokens) - avaliable
      const token: Token = {
        id: b.tokenId,
        chain: b.chain,
        symbol: b.token.symbol,
        coingeckoId: b.token.coingeckoId,
        decimals: b.token.decimals,
        logo: b.token.logo,
        type: b.token.type,
      }
      return [...acc, { details: token, balance: { avaliable, unavaliable }, price: b.rates?.usd || 0 }]
    }, [])
  }, [balances])
}

export const BalancesWatcher = () => {
  const tokens = useTokens(true)
  const showAllBalances = useRecoilValue(showAllBalancesState)
  const selectedMultisig = useRecoilValue(selectedMultisigState)
  const activeMultisigs = useRecoilValue(activeMultisigsState)
  const setBalances = useSetRecoilState(balancesState)
  const [, setAllAddresses] = useAllAddresses()

  const addresses = useMemo(() => {
    if (showAllBalances) return activeMultisigs.map(({ proxyAddress }) => proxyAddress)
    return [selectedMultisig.proxyAddress]
  }, [showAllBalances, selectedMultisig, activeMultisigs])

  useEffect(() => {
    setAllAddresses(addresses)
  }, [setAllAddresses, addresses])

  const addressesByToken = useMemo(() => {
    const tokenIds = Object.values(tokens).map(({ id }) => id)
    return Object.fromEntries(tokenIds.map(tokenId => [tokenId, addresses]))
  }, [addresses, tokens])

  const balances = useBalances(addressesByToken)
  setBalances(balances.filterNonZero('total'))

  return null
}
