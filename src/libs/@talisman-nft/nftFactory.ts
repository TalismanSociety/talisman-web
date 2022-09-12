import { Observable } from 'rxjs'
import { NFTInterface } from './providers/NFTInterface'
import { NFTDetail, NFTShort, NFTShortArray } from './types'

type nftPlatformMapping = {
  [key: string]: string
}

export class NFTFactory {
  providers: NFTInterface[]
  nftPlatformMapping: nftPlatformMapping = {}

  constructor(providers: NFTInterface[]) {
    this.providers = providers
  }

  fetchNFTSByAddress(address: string) {
    // fetch all the NFTs from the providers

    const nftObservable = new Observable(observer => {
      this.providers.forEach(async provider => {
        provider.fetchAllByAddress(address).then((nfts: NFTShortArray) => {
          // create a mapping between
          nfts.forEach((nft: NFTShort) => (this.nftPlatformMapping[nft.id] = nft.platform))
          observer.next(nfts)
        })
      })
    })

    return nftObservable

    // const nftArray: NFTShortArray = await Promise.all(
    //   this.providers.map(async provider => {
    //     const nfts: NFTShortArray = await provider.fetchAllByAddress(address)
    //     return nfts
    //   })
    // ).then((nfts: NFTShortArray[]) => {
    //   // Fix this type later
    //   return [].concat.apply([], nfts as any) as NFTShortArray
    // })

    // // create a mapping between
    // this.nftPlatformMapping = {}
    // nftArray.forEach((nft: NFTShort) => (this.nftPlatformMapping[nft.id] = nft.platform))

    // return nftArray
  }

  async fetchNFTById(id: string): Promise<NFTDetail> {
    const platform = this.nftPlatformMapping[id]
    const provider = this.providers.find(provider => provider.name === platform)

    if (!provider) throw new Error('TBD')

    const nft = await provider.fetchOneById(id)

    return nft
  }
}
