import { useEffect, useState } from 'react'

import { NFTFactory } from './nftFactory'
import { Rmrk1Provider, Rmrk2Provider, StatemineProvider } from './providers'
import { NFTInterface } from './providers/NFTInterface'
import { NFTDetail, NFTShortArray } from './types'

const providers: NFTInterface[] = [
  new Rmrk1Provider(),
  new Rmrk2Provider(),
  new StatemineProvider(),
  //  new AcalaProvider()
]

const nftFactory = new NFTFactory(providers)

export const useNftsByAddress = (initialAddress?: string) => {
  const [address, setAddress] = useState<string | undefined>(initialAddress)
  const [nfts, setNfts] = useState<NFTShortArray>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!address) return
    setLoading(true)
    nftFactory.fetchNFTSByAddress(address).then((nfts: NFTShortArray) => {
      setNfts(nfts)
      setLoading(false)
    })
  }, [address])

  return {
    setAddress,
    nfts,
    loading,
  }
}

export const useNftById = (id?: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [nft, setNft] = useState<NFTDetail>()
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    nftFactory
      .fetchNFTById(id)
      .then((nft: NFTDetail) => {
        setNft(nft)
        setLoading(false)
      })
      .catch((error: string) => {
        setError(error)
        setLoading(false)
      })
  }, [id])

  return {
    nft,
    loading,
    error,
  }
}
