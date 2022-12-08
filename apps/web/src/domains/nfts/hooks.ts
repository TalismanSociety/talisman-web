import { useCallback, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { favoriteNftsState, hiddenNftsState } from './recoils'

export const useNftFavoriteState = (address: string, id: string) => {
  const [favoriteNfts, setFavoriteNfts] = useRecoilState(favoriteNftsState)

  const favorited = favoriteNfts.find(x => x.address === address && x.id === id) !== undefined

  return [
    favorited,
    useCallback(() => {
      if (!favorited) {
        setFavoriteNfts(x => [...x, { address, id }])
      } else {
        setFavoriteNfts(x => x.filter(nft => nft.id !== id))
      }
    }, [address, favorited, id, setFavoriteNfts]),
  ] as const
}

export const useNftHiddenState = (address: string, id: string) => {
  const [hiddenNfts, setHiddenNfts] = useRecoilState(hiddenNftsState)

  const hidden = hiddenNfts.find(x => x.address === address && x.id === id) !== undefined

  return [
    hidden,
    useCallback(() => {
      if (!hidden) {
        setHiddenNfts(x => [...x, { address, id }])
      } else {
        setHiddenNfts(x => x.filter(nft => nft.id !== id))
      }
    }, [address, hidden, id, setHiddenNfts]),
  ] as const
}

export const useFavoriteNftLookup = () => {
  const favorites = useRecoilValue(favoriteNftsState)

  const lookup = useMemo(
    () => Object.fromEntries(Object.values(favorites).map(x => [`${x.address}.${x.id}`, true as const])),
    [favorites]
  )

  return useCallback((address: string, id: string) => lookup[`${address}.${id}`], [lookup])
}

export const useHiddenNftLookup = () => {
  const hiddens = useRecoilValue(hiddenNftsState)

  const lookup = useMemo(
    () => Object.fromEntries(Object.values(hiddens).map(x => [`${x.address}.${x.id}`, true as const])),
    [hiddens]
  )

  return useCallback((address: string, id: string) => lookup[`${address}.${id}`], [lookup])
}
