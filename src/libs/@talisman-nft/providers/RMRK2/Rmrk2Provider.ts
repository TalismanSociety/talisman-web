import { NFTInterface } from "../NFTInterface";
import { encodeAddress } from '@polkadot/util-crypto'
import { NFTCategory, NFTDetail, NFTShort, NFTShortArray } from "../../types";

import {
  ApolloClient,
  ApolloQueryResult,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  gql,
} from '@apollo/client'

const QUERY_SHORT = gql`
  query ($address: String!) {
    nfts(where: {owner: {_eq: $address}}) {
      id
      symbol
      metadata_name
      resources {
        metadata_content_type
        thumb
        src
      }
      metadata_image	
    }
  }
`

const QUERY_DETAIL = gql`
  query ($id: String!) {
    nfts (where : {id : {_eq : $id}}) {
      id
      symbol
      metadata_name
      metadata_description
      resources {
        metadata_content_type
        thumb
      }
      metadata_image	
      sn
      metadata_properties
      collection {
        id
        metadata_name
        max
      }
    }
  }
`

export class Rmrk2Provider extends NFTInterface {
  name = 'RMRK2'
  uri = 'https://gql-rmrk2-prod.graphcdn.app'
  storageProvider = ''
  client: any

  async getClient(){
    if(this.client) return this.client

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

  async fetchAllByAddress(address: string){

    const encodedAddress = encodeAddress(address, 2)

    const client = await this.getClient()

    // @Josh handle funny stuff
    const data = await client.query({ query: QUERY_SHORT, variables : { address: encodedAddress } })
      .then((res : any) => {
        return res?.data?.nfts.map((nft : any) => {
          // parse out the thumb image
          const thumb = !!nft?.resources[0]?.thumb
            ? this.toIPFSUrl(nft?.resources[0]?.thumb)
            : null // fetch from somewhere

          // get the context type of null
          const type = nft?.resources[0]?.metadata_content_type

          return {
            id: nft?.id,
            name: nft?.metadata_name || nft?.symbol,
            thumb,
            type,
            mediaUri: this.toIPFSUrl(nft?.metadata_image),
            platform: this.name,
          } as NFTShort
        })
      })

    // data smooshing here before returning
    return data as NFTShortArray
  }
  
  async fetchOneById(id: string){
    const client = await this.getClient()

    return await client.query({ query: QUERY_DETAIL, variables : { id: id } })
      .then((res : any) => {
        const nft = res?.data?.nfts[0]

        if(!nft) throw new Error('TBD')

        // parse out the thumb image
        const mediaUri = !!nft?.metadata_image
          ? this.toIPFSUrl(nft?.metadata_image)
          : null // fetch from somewhere

        
          const thumb = !!nft?.resources[0]?.thumb
          ? this.toIPFSUrl(nft?.resources[0]?.thumb)
          : null // fetch from somewhere

        // get the context type of null
        const type = nft?.resources[0]?.metadata_content_type
        
        return {
          id: nft?.id,
          name: nft?.metadata_name || nft?.symbol,
          thumb,
          description: nft?.metadata_description,
          serialNumber: nft?.sn.replace(/^0+/, ''),
          type,
          mediaUri,
          platform: this.name,
          attributes: nft?.metadata_properties || [],
          collection: {
            id: nft?.collection?.id,
            name: nft?.collection?.metadata_name,
            totalCount: nft?.collection?.max,
          },
        } as NFTDetail
      })
      .catch((e: any) => {
        
      })
  }
}