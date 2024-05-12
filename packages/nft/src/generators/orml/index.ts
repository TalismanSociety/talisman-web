import { createOrmlNftAsyncGenerator } from './orml.js'
import { WsProvider } from '@polkadot/api'
import { type Bytes } from '@polkadot/types-codec'
import { hexToString } from '@polkadot/util'
import { CID } from 'multiformats'

const parseCid = (bytes: Bytes) => {
  try {
    return CID.parse(hexToString(bytes.toHex()))
  } catch (error) {
    return undefined
  }
}

export const createAcalaNftAsyncGenerator = (options: { rpc: string }) =>
  createOrmlNftAsyncGenerator({
    chain: 'acala',
    provider: new WsProvider(options.rpc),
    getMetadata: async (_, __, metadata) => {
      const ipfsCid = parseCid(metadata)

      if (!ipfsCid) {
        return
      }

      return fetch(new URL(ipfsCid.toString() + '/metadata.json', 'https://talisman.mypinata.cloud/ipfs/')).then(res =>
        res.json()
      )
    },
    getExternalLinks: (_, __) => [{ name: 'Acala', url: 'https://apps.acala.network/' }],
  })

export const createBitCountryNftAsyncGenerator = (options: { rpc: string }) =>
  createOrmlNftAsyncGenerator({
    chain: 'bit-country',
    provider: new WsProvider(options.rpc),
    getMetadata: async (classId, tokenId, metadata) => {
      const ipfsCid = parseCid(metadata)

      if (!ipfsCid) {
        return fetch(
          `https://pioneer-api.bit.country/metadata/landTokenUriPioneer/${classId}/${tokenId}/metadata.json`
        ).then(x => x.json())
      }

      return fetch(new URL(ipfsCid.toString(), 'https://ipfs-cdn.bit.country'))
        .then(res => res.json())
        .then(x => ({
          ...x,
          image: x.image_url ? `https://ipfs-cdn.bit.country/${x.image_url}` : undefined,
          mimeType: x.asset_type === 'Model' ? 'model/gltf+json' : undefined,
          thumbnail: `https://res.cloudinary.com/ddftctzph/image/upload/c_scale,q_100,w_500/production-ipfs/asset/${ipfsCid.toString()}`,
        }))
    },
    getExternalLinks: (classId, tokenId) => [
      {
        name: 'Pioneer',
        url: `https://pioneer.bit.country/p/nft/${classId.toHex()}-${tokenId.toHex().replace(/^0x0+/, '0')}
    `,
      },
    ],
  })
