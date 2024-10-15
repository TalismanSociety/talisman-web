import { atom } from 'jotai'

import { configServiceAtom } from './configServiceAtom'
import { assetAtom, destChainAtom, sourceChainAtom } from './xcmFieldsAtoms'

export const xcmReverseRouteAtom = atom(
  get => {
    const sourceChain = get(sourceChainAtom)
    const destChain = get(destChainAtom)
    const asset = get(assetAtom)
    if (!sourceChain || !destChain || !asset) return false

    const routes = get(configServiceAtom).routes
    const canReverse = routes
      .get(destChain.key)
      ?.getRoutes()
      ?.some(route => route.source.asset.key === asset.key && route.destination.chain.key === sourceChain.key)

    return Boolean(canReverse)
  },
  (get, set) => {
    const canReverse = get(xcmReverseRouteAtom)
    if (!canReverse) return

    const sourceKey = get(sourceChainAtom)?.key
    const destKey = get(destChainAtom)?.key
    set(sourceChainAtom, destKey)
    set(destChainAtom, sourceKey)
  }
)
