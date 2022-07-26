import { NFTCategory } from "@libs/@talisman-nft/types"

export const fetchNFTs_type = async (IPFSUrl : string) : Promise<NFTCategory> => {
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