import { NFTConsolidated } from 'rmrk-tools/dist/tools/consolidator/consolidator'

export const fetchNFTData = async (setNfts: (nfts: NFTConsolidated[]) => void, addresses: string[]) => {
  try {
    console.log('addresses sent', addresses)
    let dataTotal: NFTConsolidated[] | undefined = undefined
    for await (const address of addresses) {
      console.log(address)
      const payload = await fetch(`https://singular.rmrk.app/api/rmrk1/account/${address}`)
      const nftData: NFTConsolidated[] = await payload.json()
      if (!dataTotal) {
        dataTotal = []
      }
      dataTotal = dataTotal.concat(nftData)
      console.log('nftdata', dataTotal)
      for await (const nft of dataTotal) {
        nft.account = address
        nft.collection = nft.collectionId
        nft.symbol = nft.instance
      }
    }
    if (dataTotal) {
      dataTotal = dataTotal.filter(nft => nft.collectionId === 'b6e98494bff52d3b1e-SPIRIT')

      for await (const nft of dataTotal) {
        const payload = await fetch(nft.metadata!.replace('ipfs://', 'https://rmrk.mypinata.cloud/'))
        const metadata: PinataObject = await payload.json()
        nft.image = metadata.image
        nft.data = metadata
        nft.collection = nft.collectionId
        nft.symbol = nft.instance
      }
    }

    console.log('data', dataTotal)
    if (dataTotal) {
      dataTotal = dataTotal.sort((n1, n2) => {
        if (n1.sn > n2.sn) {
          return 1
        } else {
          return -1
        }
      })

      setNfts(dataTotal)
    }
  } catch (error: any) {
    console.log(error)
  }
}

export interface PinataObject {
  image: string
  name: string
  description: string
  external_url: string
}
