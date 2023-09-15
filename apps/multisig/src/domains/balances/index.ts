import { BaseToken, supportedChains } from '@domains/chains'
import { activeMultisigsState, combinedViewState, selectedMultisigState } from '@domains/multisig'
import { Balances } from '@talismn/balances'
import { useAllAddresses, useBalances, useTokens } from '@talismn/balances-react'
import { groupBy } from 'lodash'
import { useEffect, useMemo } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'

import { TokenAugmented } from '../../layouts/Overview/Assets'

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
      if (b.chain === null || !b.token) return acc
      const balanceChain = b.chain

      if (
        b.token.type !== 'substrate-native' &&
        b.token.type !== 'substrate-assets' &&
        b.token.type !== 'substrate-tokens'
      ) {
        console.error('token has unrecognised type, skipping', b.token)
        return acc
      }

      const chain = supportedChains.find(c => c.squidIds.chainData === balanceChain.id)
      if (!chain) return acc

      const avaliable = parseFloat(b.transferable.tokens)
      const unavaliable = parseFloat(b.total.tokens) - avaliable
      const token: BaseToken = {
        id: b.tokenId,
        chain,
        symbol: b.token.symbol,
        coingeckoId: b.token.coingeckoId,
        decimals: b.token.decimals,
        logo: b.token.logo,
        type: b.token.type,
      }
      return [...acc, { details: token, balance: { avaliable, unavaliable }, price: b.rates?.usd || 0, id: b.id }]
    }, [])
  }, [balances])
}

export const BalancesWatcher = () => {
  const tokens = useTokens(true)
  const combinedView = useRecoilValue(combinedViewState)
  const selectedMultisig = useRecoilValue(selectedMultisigState)
  const activeMultisigs = useRecoilValue(activeMultisigsState)
  const setBalances = useSetRecoilState(balancesState)
  const [, setAllAddresses] = useAllAddresses()

  const multisigs = useMemo(
    () => (combinedView ? activeMultisigs : [selectedMultisig]),
    [combinedView, activeMultisigs, selectedMultisig]
  )
  const addresses = useMemo(() => multisigs.map(({ proxyAddress }) => proxyAddress), [multisigs])

  useEffect(() => {
    setAllAddresses(addresses.map(a => a.toSs58(selectedMultisig.chain)))
  }, [setAllAddresses, addresses, selectedMultisig])

  const multisigsByChain = useMemo(() => groupBy(multisigs, ({ chain }) => chain.squidIds.chainData), [multisigs])
  const addressesByToken = useMemo(
    () =>
      Object.fromEntries(
        Object.values(tokens).flatMap(token => {
          if (!token.chain) return []
          const multisigs = multisigsByChain[token.chain.id]

          if (!multisigs) return []
          return [[token.id, multisigs.map(({ proxyAddress }) => proxyAddress.toSs58(selectedMultisig.chain))]]
        })
      ),
    [multisigsByChain, tokens, selectedMultisig]
  )

  const balances = useBalances(addressesByToken)
  useEffect(() => {
    setBalances(balances.filterNonZero('total'))
  }, [balances, setBalances])

  return null
}
