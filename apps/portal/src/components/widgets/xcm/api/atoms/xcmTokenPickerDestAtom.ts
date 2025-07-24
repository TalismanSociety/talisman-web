import { dotNetworksByGenesisHashAtom, tokensAtom } from '@talismn/balances-react'
import { atom } from 'jotai'
import groupBy from 'lodash/groupBy'

import { sortTokenPickerAssets } from '../utils/sortTokenPickerAssets'
import { validRoute } from '../utils/validRoute'
import { configServiceAtom } from './configServiceAtom'
import { xcmChainsAtom } from './xcmChainsAtom'
import { assetAtom, sourceChainAtom } from './xcmFieldsAtoms'

export const xcmTokenPickerDestAtom = atom(async get => {
  const xcmChains = get(xcmChainsAtom)
  const routes = get(configServiceAtom).routes
  const chaindataChainsByGenesisHash = await get(dotNetworksByGenesisHashAtom)
  const chaindataTokens = await get(tokensAtom)

  const sourceChain = get(sourceChainAtom)
  const asset = get(assetAtom)
  if (!sourceChain || !asset) return []
  const sourceRoutes = routes.get(sourceChain.key)?.getRoutes()
  const sourceRoutesByDest = groupBy(sourceRoutes, route => route.destination.chain.key)

  return xcmChains
    .flatMap(chain => {
      const chainRoutes = sourceRoutesByDest[chain.key]
      if (!chainRoutes) return []

      const tokens = [
        ...new Set(
          chainRoutes
            .filter(validRoute)
            .flatMap(route => (route.destination.asset.key === asset.key ? route.destination.asset : []))
        ),
      ]
      const chaindataChain = chaindataChainsByGenesisHash?.[chain.genesisHash]
      const chaindataChainTokens = chaindataChain ? chaindataTokens.filter(t => t.networkId === chaindataChain.id) : []
      const chaindataTokensBySymbol = new Map(chaindataChainTokens.map(token => [token?.symbol, token] as const))

      return tokens.map(token => ({
        chain: { ...chain, name: chaindataChain?.name ?? chain.name },
        token,
        chaindataId: chaindataChain?.id,
        chaindataTokenLogo: chaindataTokensBySymbol.get(token.originSymbol)?.logo,
        chaindataCoingeckoId: chaindataTokensBySymbol.get(token.originSymbol)?.coingeckoId,
      }))
    })
    .sort(sortTokenPickerAssets)
})
