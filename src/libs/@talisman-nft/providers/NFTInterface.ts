import md5 from 'md5'

import { NFTDetail, NFTDetailArray, NFTShortArray } from '../types'

// export interface NFTInterfaceType {
//   name: string;
// }

export class NFTInterface {
  name = ''
  baseIPFSUrl = 'https://talisman.mypinata.cloud/ipfs/'
  indexedNFTs: any = []

  protected toIPFSUrl(url: string): string | null {
    if (url == null) return null

    if (url.startsWith('ipfs://ipfs/')) 
      return url.replace('ipfs://ipfs/', this.baseIPFSUrl)

    if(url.startsWith('ipfs://'))
      return url.replace('ipfs://', this.baseIPFSUrl)

    return url
  }

  public fetchAllByAddress(address: string): Promise<NFTShortArray> {
    return Promise.reject()
  }

  public fetchOneById(id: string): Promise<NFTDetail> {
    return Promise.reject()
  }

  public async fetchContentType(mediaUri?: string | null) {
    if (!mediaUri) return null
    try {
      const req = await fetch(mediaUri, { method: 'HEAD' })
      return req.headers.get('content-type')?.split('/')[0] ?? null
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async fetchNFTs_CollectionInfo(collectionId: string, collectionUri: string) {
    if (collectionId == null) return
    return fetch(`${collectionUri}${collectionId}`)
      .then(res => res.json())
      .then(data => {
        if (!data)
          return {
            totalNfts: null,
            floor: null,
          }

        return {
          totalNfts: data.totalNFTs,
          floor: (parseFloat(data.floor) / 1000000000000).toFixed(3),
        }
      })
  }

  async fetchMediaFromMetadata(IPFSUrl: string) {
    if (IPFSUrl == null) return
    return fetch(IPFSUrl)
      .then(res => res.json())
      .then(data => {
        return this.toIPFSUrl(data.mediaUri)
      })
  }

  // use the cacehed data if available
  // address: address of the NFTs we're storing
  // protocol: protocol name ie RMRK1
  // data: the data to store in order to run a match next time we ask
  protected useCache(address: string, protocol: string, data: any): Promise<NFTDetailArray> {
    // names of the storage items/keys/locations
    const storageKey_hash = `@talisman/nfts/${protocol}/${address}/hash`
    const storageKey_data = `@talisman/nfts/${protocol}/${address}/data`

    // hash the data we're about to store
    const dataHash = md5(JSON.stringify(data))

    // get the currently stored hash
    const storedDataHash = localStorage.getItem(storageKey_hash)

    const storeCachedData = (keyHash: string, data: NFTDetailArray) => {
      localStorage.setItem(`${storageKey_hash}`, keyHash)
      localStorage.setItem(`${storageKey_data}`, JSON.stringify(data))
    }

    return new Promise(async (resolve, reject) => {
      // if the data has changed from last time we stored it
      // return false/reject
      if (storedDataHash !== dataHash) {
        reject((data: NFTDetailArray) => storeCachedData(dataHash, data))
      }
      // if it hasn't changed, return the stored data
      else {
        try {
          // attempt to get the data from storage
          const storedDataString = localStorage.getItem(storageKey_data)
          if (!storedDataString) throw new Error('make a better error message') // @josh

          // attempt to parse the stored data into a json object
          const storedData: NFTDetailArray = JSON.parse(storedDataString)

          // return data
          resolve(storedData)
        } catch (error) {
          reject((data: NFTDetailArray) => storeCachedData(dataHash, data))
        }
      }
    })
  }
}
