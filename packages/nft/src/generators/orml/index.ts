import { WsProvider } from '@polkadot/api'
import { type Bytes } from '@polkadot/types-codec'
import { hexToString } from '@polkadot/util'
import { CID } from 'multiformats'
import { createOrmlNftAsyncGenerator } from './orml.js'

const parseCid = (bytes: Bytes) => {
  try {
    return CID.parse(hexToString(bytes.toHex()))
  } catch (error) {
    return undefined
  }
}

export const createAcalaNftAsyncGenerator = createOrmlNftAsyncGenerator({
  chain: 'acala',
  provider: new WsProvider('wss://acala-rpc.dwellir.com'),
  getMetadata: async (_, __, metadata) => {
    const ipfsCid = parseCid(metadata)

    if (!ipfsCid) {
      return
    }

    return await fetch(new URL(ipfsCid.toString() + '/metadata.json', 'https://talisman.mypinata.cloud/ipfs/')).then(
      async res => await res.json()
    )
  },
  getExternalLinks: (_, __) => [{ name: 'Acala', url: 'https://apps.acala.network/' }],
})

export const createBitCountryNftAsyncGenerator = createOrmlNftAsyncGenerator({
  chain: 'bit-country',
  provider: new WsProvider('wss://pioneer.api.onfinality.io/public-ws'),
  getMetadata: async (classId, tokenId, metadata) => {
    const ipfsCid = parseCid(metadata)

    if (!ipfsCid) {
      return await fetch(
        `https://pioneer-api.bit.country/metadata/landTokenUriPioneer/${classId.toString()}/${tokenId.toString()}/metadata.json`
      ).then(async x => await x.json())
    }

    return await fetch(new URL(ipfsCid.toString(), 'https://ipfs-cdn.bit.country'))
      .then(async res => await res.json())
      .then(x => ({ ...x, image: x.image_url ? `https://ipfs-cdn.bit.country/${x.image_url as string}` : undefined }))
  },
  getExternalLinks: (classId, __) => [
    { name: 'Pioneer', url: `https://pioneer.bit.country/marketplace/browse?collection=${classId.toString()}` },
  ],
})
