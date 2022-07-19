import { NFTInterface } from "./providers/NFTInterface";
import { NFTItemArray } from "./providers/types";

export class NFTFactory {
  providers: NFTInterface[]

  constructor(providers: NFTInterface[]) {
    this.providers = providers
  }

  async fetchNFTSByAddress(address: string) {

    let nfts : any = [] // Work on this time

    return Promise.all(
      this.providers.map(
        provider => provider.fetchByAddress(address).then((res : NFTItemArray) => {
          if(!res) return
          nfts.push(res)
        })
      )
    ).then(() => {
      return [].concat.apply([], nfts)
    });

  }

}