import { ApiPromise, WsProvider } from '@polkadot/api'
import type { CreateNftAsyncGenerator, Nft } from '../../types.js'
import { createPsp34NftsAsyncGenerator } from './psp34.js'

export const createArtZeroNftsAsyncGenerator: CreateNftAsyncGenerator<Nft<'psp34', 'azero'>> = async function* (
  address,
  options
) {
  const collectionsResponse = await fetch('https://a0-api.artzero.io/getCollectionsByVolume', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'limit=100&offset=0&sort=-1&isActive=true',
    method: 'POST',
  })

  const collections: { ret: Array<{ nftContractAddress: string }> } = await collectionsResponse.json()

  const api = await ApiPromise.create({ provider: new WsProvider('wss://ws.azero.dev') })

  try {
    yield* createPsp34NftsAsyncGenerator({
      chainId: 'azero',
      api,
      contractAddresses: collections.ret.map(x => x.nftContractAddress),
      getExternalLink: contractAddress => [
        { name: 'ArtZero', url: `https://a0.artzero.io/collection/${contractAddress}` },
      ],
    })(address, options)
  } finally {
    await api.disconnect()
  }
}

export const createParasNftsAsyncGenerator: CreateNftAsyncGenerator<Nft<'psp34', 'astar'>> = async function* (
  address,
  options
) {
  const collectionsResponse = await fetch(
    'https://api.paras.id/marketplace/collections?chain=astar&is_verified=true&__skip=0&__limit=100',
    {
      method: 'GET',
    }
  )

  const collections: { data: { results: Array<{ collection_id: string }> } } = await collectionsResponse.json()

  const api = await ApiPromise.create({ provider: new WsProvider('wss://rpc.astar.network') })

  try {
    yield* createPsp34NftsAsyncGenerator({
      chainId: 'astar',
      api,
      contractAddresses: collections.data.results.map(x => x.collection_id),
      getExternalLink: contractAddress => [
        { name: 'Paras', url: `https://astar.paras.id/collection/${contractAddress}` },
      ],
    })(address, options)
  } finally {
    await api.disconnect()
  }
}
