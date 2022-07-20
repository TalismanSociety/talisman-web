import { useEffect, useState } from "react";
import { NFTFactory } from "./nftFactory";
import { Rmrk1Provider, Rmrk2Provider, StatemineProvider } from "./providers";
import { NFTInterface } from "./providers/NFTInterface";
import { NFTItemArray } from "./types";

const providers : NFTInterface[] = [
  new Rmrk1Provider(), 
  new Rmrk2Provider(), 
  new StatemineProvider()
] 

const nftFactory = new NFTFactory(providers);

export const useNftsByAddress = (initialAddress?: string) => {
  
  const [address, setAddress] = useState<string|undefined>(initialAddress)
  const [nfts, setNfts] = useState<NFTItemArray>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if(!address) return
    setLoading(true)
    nftFactory.fetchNFTSByAddress(address)
      .then((nfts : NFTItemArray) => { 
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