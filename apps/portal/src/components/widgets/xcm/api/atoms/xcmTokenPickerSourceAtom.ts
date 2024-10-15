import { chainsByGenesisHashAtom, tokensByIdAtom } from '@talismn/balances-react'
import { atom } from 'jotai'

import { sortTokenPickerAssets } from '../utils/sortTokenPickerAssets'
import { configServiceAtom } from './configServiceAtom'
import { xcmBalancesAtom } from './xcmBalancesAtom'
import { xcmChainsAtom } from './xcmChainsAtom'

export const xcmTokenPickerSourceAtom = atom(async get => {
  const xcmChains = get(xcmChainsAtom)
  const routes = get(configServiceAtom).routes
  const balances = get(xcmBalancesAtom)
  const chaindataChainsByGenesisHash = await get(chainsByGenesisHashAtom)
  const chaindataTokensById = await get(tokensByIdAtom)

  return xcmChains
    .flatMap(chain => {
      const chainRoutes = routes.get(chain.key)?.getRoutes()
      const tokens = [...new Set((chainRoutes ?? []).map(route => route.source.asset))]
      const chaindataChain = chaindataChainsByGenesisHash?.[chain.genesisHash]
      const chaindataTokensBySymbol = new Map(
        chaindataChain?.tokens?.map(({ id }) => [chaindataTokensById[id]?.symbol, chaindataTokensById[id]] as const)
      )

      return tokens.map(token => ({
        chain: { ...chain, name: chaindataChain?.name ?? chain.name },
        token,
        chaindataId: chaindataChain?.id,
        chaindataTokenLogo: chaindataTokensBySymbol.get(token.originSymbol)?.logo,
        // TODO: use @talismn/balances
        // in this context, `balances` is only valid for the sourceChain that we are connected to
        balance: balances.get(token.key),
      }))
    })
    .sort(sortTokenPickerAssets)
})
