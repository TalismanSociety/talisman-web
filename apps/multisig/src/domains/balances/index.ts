import { Token } from '@domains/chains'
import { activeMultisigsState, selectedMultisigState } from '@domains/multisig'
import { Balances } from '@talismn/balances'
import { useAllAddresses, useBalances, useTokens } from '@talismn/balances-react'
import { groupBy } from 'lodash'
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

  const multisigs = useMemo(
    () => (showAllBalances ? activeMultisigs : [selectedMultisig]).filter(({ proxyAddress }) => proxyAddress),
    [showAllBalances, activeMultisigs, selectedMultisig]
  )
  const addresses = useMemo(() => multisigs.map(({ proxyAddress }) => proxyAddress), [multisigs])

  useEffect(() => {
    setAllAddresses(addresses)
  }, [setAllAddresses, addresses])

  const multisigsByChain = useMemo(() => groupBy(multisigs, ({ chain }) => chain.id), [multisigs])
  const addressesByToken = useMemo(
    () =>
      Object.fromEntries(
        Object.values(tokens).flatMap(token => {
          if (!token.chain) return []
          const multisigs = multisigsByChain[token.chain.id]

          if (!multisigs) return []
          return [[token.id, multisigs.map(({ proxyAddress }) => proxyAddress)]]
        })
      ),
    [multisigsByChain, tokens]
  )

  const balances = useBalances(addressesByToken)
  useEffect(() => {
    setBalances(balances.filterNonZero('total'))
  }, [balances, setBalances])

  return null
}
