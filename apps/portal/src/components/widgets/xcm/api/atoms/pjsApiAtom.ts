import { Parachain } from '@galacticcouncil/xcm-core'
import { chainsAtom } from '@talismn/balances-react'
import { atom } from 'jotai'

import { substrateApiGetterAtom } from '@/domains/common/recoils/api'

import { sourceChainAtom } from './xcmFieldsAtoms'

export const pjsApiAtom = atom(async get => {
  const substrateApiGetter = get(substrateApiGetterAtom)

  const sourceChain = get(sourceChainAtom)
  const genesisHash = sourceChain instanceof Parachain ? sourceChain.genesisHash : null
  const chain = genesisHash && (await get(chainsAtom)).find(chain => chain.genesisHash === genesisHash)
  if (!chain) return
  const chainRpc = chain?.rpcs?.[0]
  if (!chainRpc) return

  return await substrateApiGetter?.getApi(chainRpc.url)
})
