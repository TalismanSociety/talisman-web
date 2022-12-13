import { accountsState, selectedAccountAddressesState } from '@domains/accounts/recoils'
import { favoriteNftsState, hiddenNftsState } from '@domains/nfts/recoils'
import { useEffect } from 'react'
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'

import { useNFTData } from './hooks'
import { NFTData } from './types'

export const nftDataState = atom<NFTData>({
  key: 'NftData',
  default: {
    items: [],
    isFetching: true,
    count: 0,
  },
})

export const selectedAccountsNftDataState = selector<NFTData>({
  key: 'SelectedAccountsNftData',
  get: ({ get }) => {
    const { items, isFetching, count } = get(nftDataState)
    const activeAccounts = get(selectedAccountAddressesState)

    if (activeAccounts && activeAccounts.length > 0) {
      const filteredItems = items.filter(item => activeAccounts.includes(item.address))
      return { items: filteredItems, isFetching, count }
    }

    return { items, isFetching, count }
  },
})

export const overviewNftDataState = selector({
  key: 'OverviewNftData',
  get: ({ get }) => {
    const nftData = get(selectedAccountsNftDataState)
    const favoriteNfts = get(favoriteNftsState)
    const hiddenNfts = get(hiddenNftsState)

    const favoriteKeys = favoriteNfts.map(x => `${x.address}-${x.id}`)
    const hiddenKeys = hiddenNfts.map(x => `${x.address}-${x.id}`)

    return {
      ...nftData,
      items: [...nftData.items.filter(x => !hiddenKeys.includes(`${x.address}-${x.id}`))].sort((a, b) =>
        favoriteKeys.includes(`${a.address}-${a.id}`) ? -1 : favoriteKeys.includes(`${b.address}-${b.id}`) ? 1 : 0
      ),
    }
  },
})

const NftProvider = () => {
  const addresses = useRecoilValue(accountsState).map(account => account.address)
  const setNftData = useSetRecoilState(nftDataState)
  const { items, isFetching, count } = useNFTData(addresses)

  useEffect(() => {
    setNftData({ items, isFetching, count })
  }, [count, isFetching, items, setNftData])

  return null
}

export default NftProvider
