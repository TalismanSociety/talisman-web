import { NFTInterface } from "../NFTInterface";
import { NFTItem, NFTItemArray } from "../../types";

type NFTRawData = {
  id: string
  metadata: string
  mediaIPFS: string
  name: string
  serialNumber: string
  collectionId: string
  type: string
}

export class Rmrk1Provider extends NFTInterface {

  name = 'RMRK1'
  uri = 'https://singular.rmrk.app/api/rmrk1/account/'
  collectionUri = 'https://singular.rmrk.app/api/stats/collection/'
  storageProvider = ''
 

  async fetchNFTs_AccountRawData(address: string) { 
    return fetch(this.uri + address)
    .then(res => res.json())
    .then(data => {
      return data.map((nft : any) => {
        return {
          id: nft.id,
          metadata: this.toIPFSUrl(nft.metadata),
          mediaIPFS: this.toIPFSUrl(nft.metadata_image),
          name: nft.name,
          serialNumber: nft.sn.replace(/^0+/, ''),
          collectionId: nft.collectionId,
          type: nft.metadata_content_type.split('/')[0]
        }
      })
    })
  }

  async fetchNFTs_Metadata(IPFSUrl : string){
    if(IPFSUrl == null) return 
    return fetch(IPFSUrl)
    .then(res => res.json())
    .then(data => {
      return data.description
    })
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
      const NftIndex : NFTRawData[] = await this.fetchNFTs_AccountRawData(address)
      
      return this.useCache(address, this.name, NftIndex)
        .then((cachedItems: NFTItemArray) => {
          return cachedItems
        })
        .catch(async (store) => {
          const items = await Promise.all(
            NftIndex.map((nft : NFTRawData) => new Promise(async (resolve) => {
    
              const description = await this.fetchNFTs_Metadata(nft.metadata)
              const collectionData = await this.fetchNFTs_CollectionInfo(nft.collectionId)
              
              resolve ({
                id: nft.id,
                name: nft.name,
                description,
                thumb: null,
                type: nft.type,
                mediaUri: nft.mediaIPFS,
                serialNumber: nft.serialNumber,
                platform: this.name,
                attributes: {},
                collection: {
                  id: nft.collectionId,
                  totalCount: collectionData?.totalNfts,
                  floorPrice: collectionData?.floor,
                },
                nftSpecificData: null
              } as NFTItem )
            })
          )
        ) as NFTItemArray

        store(items)
        return items

        })
  }
}