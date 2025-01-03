import { Parachain } from '@galacticcouncil/xcm-core'
import { chainsAtom } from '@talismn/balances-react'
import { atom } from 'jotai'

import { apiPromiseAtom } from '@/domains/common/atoms/apiPromiseAtom'

import { sourceChainAtom } from './xcmFieldsAtoms'

export const pjsApiAtom = atom(async get => {
  const sourceChain = get(sourceChainAtom)
  const genesisHash = sourceChain instanceof Parachain ? sourceChain.genesisHash : null
  const chain = genesisHash && (await get(chainsAtom)).find(chain => chain.genesisHash === genesisHash)
  if (!chain) return

  const chainId = chain.id
  if (!chainId) return

  return await get(apiPromiseAtom(chainId))
})
