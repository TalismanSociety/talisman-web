import { NFTItemArray} from "./types";
import md5 from "md5";

// export interface NFTInterfaceType {
//   name: string;
// }


export class NFTInterface {

  baseIPFSUrl = 'https://talisman.mypinata.cloud/ipfs/'

  protected toIPFSUrl(url: string): string | null {
    if(url == null) return null
    return url.replace('ipfs://ipfs/', this.baseIPFSUrl)
  }

  public fetchByAddress(address: string) : Promise<NFTItemArray> {

    return Promise.resolve([])
  }

  // use the cacehed data if available
  // address: address of the NFTs we're storing
  // protocol: protocol name ie RMRK1
  // data: the data to store in order to run a match next time we ask
  protected useCache(address: string, protocol: string, data: any) : Promise<NFTItemArray> {

    // names of the storage items/keys/locations
    const storageKey_hash = `@talisman/nfts/${protocol}/${address}/hash`
    const storageKey_data = `@talisman/nfts/${protocol}/${address}/data`

    // hash the data we're about to store
    const dataHash = md5(JSON.stringify(data))

    // get the currently stored hash
    const storedDataHash = localStorage.getItem(storageKey_hash)
    
    const storeCachedData = (keyHash: string, data: NFTItemArray) => {
      localStorage.setItem(`${storageKey_hash}`, keyHash)
      localStorage.setItem(`${storageKey_data}`, JSON.stringify(data))
    }
    
    return new Promise(async (resolve, reject) => {

      // if the data has changed from last time we stored it
      // return false/reject
      if(storedDataHash !== dataHash){
        reject((data: NFTItemArray) => storeCachedData(dataHash, data))
      }
      // if it hasn't changed, return the stored data
      else{
        try {
          // attempt to get the data from storage
          const storedDataString = localStorage.getItem(storageKey_data)
          if(!storedDataString) throw new Error('make a better error message') // @josh

          // attempt to parse the stored data into a json object
          const storedData : NFTItemArray = JSON.parse(storedDataString)

          // return data
          resolve(storedData)

        } catch (error) {
          reject((data: NFTItemArray) => storeCachedData(dataHash, data))
        }
      }
    })
  }


  // Check Cache
    // Cache Key: Platform
    // If the first call Hash is the same as the cache key's current hash
      // If the same, return
      // If not, update cache key with new md5 hash
  // Set Cache
  // Clear Cache

}