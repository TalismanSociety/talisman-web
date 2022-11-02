import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client'
import { encodeAddress } from '@polkadot/util-crypto'

import { NFTDetail, NFTShort } from '../../types'
import { NFTInterface } from '../NFTInterface'

const QUERY_SHORT = gql`
  query ($address: String!) {
    nfts(where: { owner: { _eq: $address }, burned: { _eq: "" } }) {
      id
      metadata
      metadata_name
      metadata_content_type
      metadata_animation_url
      metadata_image
      collection {
        id
        name
        max
      }
    }
  }
`

const QUERY_DETAIL = gql`
  query ($id: String!) {
    nfts(where: { id: { _eq: $id } }) {
      id
      metadata
      metadata_name
      metadata_description
      metadata_animation_url
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
  collectionUri = 'https://singular.rmrk.app/api/stats/collection/'
  indexUri = 'https://singular.rmrk.app/api/rmrk1/account/'
  platformUri = ''
  storageProvider = ''
  client: any

  async getClient() {
    if (this.client) return this.client

    this.client = await new ApolloClient({
      link: createHttpLink({ uri: this.uri }),
      cache: new InMemoryCache(),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    })

    return this.client
  }

  async hydrateNftsByAddress(address: string) {
    this.reset()
    this.isFetching = true

    if (address.startsWith('0x')) {
      this.isFetching = false
      return
    }

    const client = await this.getClient()
    const encodedAddress = encodeAddress(address, 2)

    // returns the bare minimum items so we can get the count
    const itemIndex = await fetch(`${this.indexUri}${encodedAddress}`).then((res: any) => res.json())

    // set this count based on length
    this.count = itemIndex.length

    // set all the item media mappings
    const idImageMap: { [key: string]: string | null } = {}
    itemIndex.forEach((item: any) => (idImageMap[item.id] = this.toIPFSUrl(item?.metadata_image)))

    // fetch and set all items
    await client.query({ query: QUERY_SHORT, variables: { address: encodedAddress } }).then(({ data }: any) => {
      data.nfts.forEach(async (nft: any) => {
        const thumb = this.toIPFSUrl(nft?.metadata_image || nft?.metadata_animation_url)
        const mediaUri = this.toIPFSUrl(nft?.metadata_animation_url || nft?.metadata_image || idImageMap[nft?.id])

        // get the context type of null
        const type = nft?.metadata_content_type.split('/')[0]

        const item = {
          id: nft?.id,
          name: nft?.metadata_name,
          thumb,
          type,
          mediaUri,
          collection: {
            id: nft?.collection?.id,
            name: nft?.collection?.name,
            totalCount: nft?.collection?.max,
          },
          address,
          provider: this.name,
        } as NFTShort

        // se the item
        this.setItem(item)
      })
    })

    this.isFetching = false
  }

  fetchOneById(id: string) {
    const internalId = id.split('.').slice(1).join('.')
    return this.items[internalId] || null
  }

  protected async fetchDetail(id: string): Promise<NFTDetail> {
    const client = await this.getClient()

    return await client
      .query({ query: QUERY_DETAIL, variables: { id } })
      .then(async (res: any) => {
        const nft = res?.data?.nfts[0]
        if (!nft) throw new Error('TBD')

        const indexedItemRef = this.items[nft?.id]
        const mediaUri = this.toIPFSUrl(nft?.metadata_animation_url || nft?.metadata_image || indexedItemRef?.mediaUri)
        const thumb = this.toIPFSUrl(nft?.metadata_image)

        const type = nft?.metadata_content_type.split('/')[0] ?? (await this.fetchContentType(mediaUri))
        const collectionInfo = await this.fetchNFTs_CollectionInfo(nft?.collection?.id, this.collectionUri)

        return {
          id: nft?.id,
          name: nft?.metadata_name,
          thumb,
          description: nft?.metadata_description,
          serialNumber: nft?.sn.replace(/^0+/, ''),
          type,
          mediaUri,
          provider: this.name,
          platformUri: this.platformUri + nft?.id,
          attributes: nft?.metadata_properties || [],
          collection: {
            id: nft?.collection?.id,
            name: nft?.collection?.name,
            totalCount: collectionInfo?.totalNfts,
            floorPrice: collectionInfo?.floor,
          },
        } as NFTDetail
      })
      .catch((e: any) => {})
  }
}
