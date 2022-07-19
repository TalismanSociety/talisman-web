import { useEffect, useState } from "react";
import { NFTFactory } from "./nftFactory";
import { Rmrk1Provider, Rmrk2Provider, StatemineProvider } from "./providers";
import { NFTInterface } from "./providers/NFTInterface";

const providers : NFTInterface[] = [
  new Rmrk1Provider(), 
  new Rmrk2Provider(), 
  new StatemineProvider()
] 

const nftFactory = new NFTFactory(providers);

export const useNftsByAddress = (initialAddress: string) => {
  
  const [address, setAddress] = useState<string|null>(initialAddress)
  const [nfts, setNfts] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if(!address) return
    setLoading(true)
    nftFactory.fetchNFTSByAddress(address)
      .then(nfts => { 
        setNfts(nfts); 
        setLoading(false); 
      })
  }, [address])

  return {
    setAddress,
    nfts,
    loading
  }
}