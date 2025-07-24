import { Parachain } from '@galacticcouncil/xcm-core'
import { networksAtom } from '@talismn/balances-react'
import { atom } from 'jotai'

import { apiPromiseAtom } from '@/domains/common/atoms/apiPromiseAtom'

import { sourceChainAtom } from './xcmFieldsAtoms'

export const pjsApiAtom = atom(async get => {
  const sourceChain = get(sourceChainAtom)
  const genesisHash = sourceChain instanceof Parachain ? sourceChain.genesisHash : null
  const network =
    genesisHash &&
    (await get(networksAtom)).find(network => network.platform === 'polkadot' && network.genesisHash === genesisHash)
  if (!network) return

  const networkId = network.id
  if (!networkId) return

  return await get(apiPromiseAtom(networkId))
})
