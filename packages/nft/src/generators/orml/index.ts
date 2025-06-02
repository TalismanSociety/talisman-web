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
