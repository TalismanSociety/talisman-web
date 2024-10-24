import { chainConnectorsAtom } from '@talismn/balances-react'
import { OnChainId } from '@talismn/on-chain-id'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { typeRegistryFamily } from './typeRegistry'

const chainIdAlephZero = 'aleph-zero'
const aznsSupportedChainIdAlephZero = 'alephzero'

export const resolveNsNameFamily = atomFamily((name?: string) =>
  atom(async get => (name ? await (await get(onChainIdResolverAtom)).resolveNames([name]) : undefined))
)

export const lookupAddressFamily = atomFamily((address?: string) =>
  atom(async get => (address ? await (await get(onChainIdResolverAtom)).lookupAddresses([address]) : undefined))
)

export const onChainIdResolverAtom = atom(async get => {
  const registryAlephZero = await get(typeRegistryFamily(chainIdAlephZero))
  const chainConnectors = get(chainConnectorsAtom)

  return new OnChainId({
    registryAlephZero,
    chainConnectors,

    chainIdAlephZero,
    aznsSupportedChainIdAlephZero,
  })
})
