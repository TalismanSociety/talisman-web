import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from '@apollo/client'
import { encodeAddress } from '@polkadot/util-crypto'

import { NFTDetail, NFTShort, NFTShortArray } from '../../types'
import { NFTInterface } from '../NFTInterface'

const QUERY_SHORT = gql`
  query ($address: String!) {
    nfts(where: { owner: { _eq: $address }, burned: { _eq: "" } }) {
      id
      metadata_name
      metadata_content_type
      metadata_animation_url
      metadata_image
    }
  }
`

const QUERY_DETAIL = gql`
  query ($id: String!) {
    nfts(where: { id: { _eq: $id } }) {
      id
      metadata_name
      metadata_description
      metadata
      metadata_animation_url
      metadata
      metadata_image
      metadata_content_type
      sn
      collection {
        id
        name
        max
      }
    }
  }
`

export class Rmrk1Provider extends NFTInterface {
  name = 'RMRK1'
  uri = 'https://gql-rmrk1.rmrk.link/v1/graphql'
  platformUri = ''
  storageProvider = ''
  client: any

  async getClient() {
    if (this.client) return this.client

    this.client = await new ApolloClient({
      link: createHttpLink({ uri: this.uri }),
      cache: new InMemoryCache(),
      // fetchOptions: {
      //   mode: 'no-cors',
      // },
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    })

    return this.client
  }

  async fetchAllByAddress(address: string) {
    const client = await this.getClient()
    const encodedAddress = encodeAddress(address, 2)
    // @Josh handle funny stuff
    const data = await client.query({ query: QUERY_SHORT, variables: { address: encodedAddress } }).then((res: any) => {
      return res?.data?.nfts.map((nft: any) => {
        // parse out the thumb image
        const thumb = this.toIPFSUrl(nft?.metadata_animation_url || nft?.metadata_image)

        // get the context type of null
        const type = nft?.metadata_content_type.split('/')[0]

        return {
          id: nft?.id,
          name: nft?.metadata_name,
          thumb,
          type,
          mediaUri: this.toIPFSUrl(nft?.metadata_animation_url || nft?.metadata_image),
          platform: this.name,
        } as NFTShort
      })
    })

    // data smooshing here before returning
    return data as NFTShortArray
  }

  async fetchOneById(id: string) {
    const client = await this.getClient()

    return await client
      .query({ query: QUERY_DETAIL, variables: { id: id } })
      .then((res: any) => {
        const nft = res?.data?.nfts[0]

        if (!nft) throw new Error('TBD')

        const mediaUri = this.toIPFSUrl(nft?.metadata_animation_url || nft?.metadata_image)
        const thumb = this.toIPFSUrl(nft?.metadata_image)

        // get the context type of null
        const type = nft?.metadata_content_type.split('/')[0]

        return {
          id: nft?.id,
          name: nft?.metadata_name,
          thumb,
          description: nft?.metadata_description,
          serialNumber: nft?.sn.replace(/^0+/, ''),
          type,
          mediaUri,
          platform: this.name,
          platformUri: this.platformUri + nft?.id,
          attributes: nft?.metadata_properties || [],
          collection: {
            id: nft?.collection?.id,
            name: nft?.collection?.name,
            totalCount: nft?.collection?.max,
          },
        } as NFTDetail
      })
      .catch((e: any) => {})
  }
}
