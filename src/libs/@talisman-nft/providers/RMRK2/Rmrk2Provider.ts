import { NFTInterface } from "../NFTInterface";
import { encodeAddress } from '@polkadot/util-crypto'
import { NFTCategory, NFTItem, NFTItemArray } from "../../types";
import { resolve } from "path";

type NFTRawData = {
  id: string
  metadata: string
  mediaUri: string
  name: string
  serialNumber: string
  collectionId: string
  type: string
  primaryResource: {
    base: boolean | null
    id: string | null
    metadata: string | null
    slot_id: string | number | null
    src: string | null
    thumb: string | null
  }
}

export class Rmrk2Provider extends NFTInterface {

  name = 'RMRK2'
  uri = 'https://singular.app/api/rmrk2/account/'
  collectionUri = 'https://singular.app/api/stats/collection/'
  storageProvider = ''

  async fetchNFTs_AccountRawData(address: string) { 
    return fetch(this.uri + address)
    .then(res => res.json())
    .then(data => {
      return data.map((nft : any) => {
        return {
          id: nft.id,
          metadata: this.toIPFSUrl(nft.metadata),
          mediaUri: this.toIPFSUrl(nft.image),
          serialNumber: nft.sn.replace(/^0+/, ''),
          collectionId: nft.collectionId,
          thumb: this.toIPFSUrl(nft.primaryResource.thumb),
          primaryResource: nft.primaryResource,
        }
      })
    })
  }

  async fetchNFTs_Metadata(IPFSUrl : string){
    if(IPFSUrl == null) return
    return fetch(IPFSUrl)
    .then(res => res.json())
    .then(data => {
      return ({
        name: data.name,
        mediaUri: this.toIPFSUrl(data.mediaUri),
        thumb: this.toIPFSUrl(data.thumbnailUri),
        description: data.description,
        attributes: data.properties,
      }) as any
    })
  }

  async fetchNFTs_type(IPFSUrl : string) : Promise<NFTCategory>{
    let cat = 'unknown' 
    
    if(IPFSUrl !== null) {
      cat = await fetch(IPFSUrl)
        .then(res => {
          const headers = res.headers.get('content-type')
          return !headers ? cat : headers.split('/')[0]
        })
    }

    return cat as NFTCategory
  }

  async fetchNFTs_CollectionInfo(collectionId: string) {
    if(collectionId == null) return
    return fetch(`${this.collectionUri}${collectionId}`)
    .then(res => res.json())
    .then(data => {
      if(!data) return {
        totalNfts: null,
        floor: null
      }

      return ({
        totalNfts: data.totalNFTs,
        floor: (parseFloat(data.floor) / 1000000000000).toFixed(3)
      })
    })
  }

  async fetchByAddress(address: string) : Promise<NFTItemArray> {
      // Convert to Kusama Address
      const encodedAddress = encodeAddress(address, 2)

      const NftIndex : NFTRawData[] = await this.fetchNFTs_AccountRawData(encodedAddress)
      
      return this.useCache(address, this.name, NftIndex)
        .then((cachedItems : NFTItemArray) => {
          return cachedItems
        })
        .catch(async (store) => {
          const items = await Promise.all(
            NftIndex.map( async (nft : NFTRawData) => new Promise(async (resolve) => {
    
              const metadata = await this.fetchNFTs_Metadata(nft.metadata)
              const type = await this.fetchNFTs_type(metadata?.mediaUri)
              const collectionData = await this.fetchNFTs_CollectionInfo(nft.collectionId)

              const nftItem : NFTItem = {
                id: nft.id,
                name: metadata?.name,
                description: metadata?.description,
                mediaUri: metadata?.mediaUri || nft?.mediaUri || nft?.primaryResource?.src,
                thumb: metadata?.thumb,
                type: type,
                serialNumber: nft.serialNumber,
                platform: this.name,
                attributes: metadata?.attributes,
                collection: {
                  id: nft.collectionId,
                  totalCount: collectionData?.totalNfts,
                  floorPrice: collectionData?.floor,
                },
                nftSpecificData: {
                  primaryResource: nft?.primaryResource
                }
              }
    
              resolve (nftItem)
            })
            )
          ) as NFTItemArray

          store(items)
          return items

        })
  }
}