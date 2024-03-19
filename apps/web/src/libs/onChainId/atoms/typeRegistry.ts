import { Metadata, TypeRegistry } from '@polkadot/types'
import { isHex, assert } from '@polkadot/util'
import { chainConnectorsAtom, chaindataProviderAtom } from '@talismn/balances-react'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

export const typeRegistryFamily = atomFamily((chainIdOrHash: string) =>
  atom(async get => {
    const registry = new TypeRegistry()

    const chaindataProvider = get(chaindataProviderAtom)
    const chainConnectors = get(chainConnectorsAtom)

    let genesisHash = isHex(chainIdOrHash) ? chainIdOrHash : null
    const chain = await (isHex(chainIdOrHash)
      ? chaindataProvider.chainByGenesisHash(chainIdOrHash)
      : chaindataProvider.chainById(chainIdOrHash))
    if (!genesisHash) genesisHash = chain?.genesisHash as `0x${string}`

    assert(genesisHash, `Unknown chain: ${chainIdOrHash}`)

    const metadataRpc = await chainConnectors.substrate?.send<`0x${string}`>(chain.id, 'state_getMetadata', [])
    if (!metadataRpc) return registry

    const metadata = new Metadata(registry, metadataRpc)
    registry.setMetadata(metadata)

    return registry
  })
)
