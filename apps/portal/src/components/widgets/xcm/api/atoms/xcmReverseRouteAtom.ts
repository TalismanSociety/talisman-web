import { atom } from 'jotai'

import { validRoute } from '../utils/validRoute'
import { configServiceAtom } from './configServiceAtom'
import { assetAtom, destChainAtom, senderAtom, sourceChainAtom } from './xcmFieldsAtoms'

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
      ?.filter(validRoute)
      ?.some(route => route.source.asset.key === asset.key && route.destination.chain.key === sourceChain.key)

    return Boolean(canReverse)
  },
  (get, set) => {
    const canReverse = get(xcmReverseRouteAtom)
    if (!canReverse) return

    const sourceChain = get(sourceChainAtom)
    const destChain = get(destChainAtom)
    const resetSender = Boolean(sourceChain?.usesH160Acc) !== Boolean(destChain?.usesH160Acc)
    if (resetSender) set(senderAtom, undefined)

    const sourceKey = sourceChain?.key
    const destKey = destChain?.key

    set(sourceChainAtom, destKey)
    set(destChainAtom, sourceKey)
  }
)
