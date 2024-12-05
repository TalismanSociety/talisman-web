import { chainsByGenesisHashAtom, tokensByIdAtom } from '@talismn/balances-react'
import { atom } from 'jotai'
import { isAddress as isEvmAddress } from 'viem'

import { sortTokenPickerAssets } from '../utils/sortTokenPickerAssets'
import { validRoute } from '../utils/validRoute'
import { configServiceAtom } from './configServiceAtom'
import { xcmChainsAtom } from './xcmChainsAtom'
import { senderAtom } from './xcmFieldsAtoms'

/**
 * This one is used anywhere we need to reference an asset from this unfiltered list.
 * Use `xcmTokenPickerSourceBySenderAtom` instead when you want a list which is filtered by the selected sender account.
 */
export const xcmTokenPickerSourceAtom = atom(async get => {
  const xcmChains = get(xcmChainsAtom)
  const routes = get(configServiceAtom).routes
  const chaindataChainsByGenesisHash = await get(chainsByGenesisHashAtom)
  const chaindataTokensById = await get(tokensByIdAtom)

  return xcmChains
    .flatMap(chain => {
      const chainRoutes = routes
        .get(chain.key)
        ?.getRoutes()
        // filter out routes with a destination which isn't in xcmChains
        ?.filter(route => xcmChains.some(({ key }) => key === route.destination.chain.key))
      const tokens = [...new Set((chainRoutes ?? []).filter(validRoute).map(route => route.source.asset))]
      const chaindataChain = chaindataChainsByGenesisHash?.[chain.genesisHash]
      const chaindataTokensBySymbol = new Map(
        chaindataChain?.tokens?.map(({ id }) => [chaindataTokensById[id]?.symbol, chaindataTokensById[id]] as const)
      )

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

/** This one is used to filter the list of available source chains in the UI, based on the selected sender account. */
export const xcmTokenPickerSourceBySenderAtom = atom(async get => {
  const sender = get(senderAtom)
  const isEvmSender = isEvmAddress(sender ?? '')
  const xcmTokenPickerSource = await get(xcmTokenPickerSourceAtom)

  return xcmTokenPickerSource.filter(isEvmSender ? asset => asset.chain.usesH160Acc : asset => !asset.chain.usesH160Acc)
})
