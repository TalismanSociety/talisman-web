import { accountsState, selectedAccountAddressesState } from '@domains/accounts/recoils'
import { useEffect, useMemo } from 'react'
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'

import { useNFTData } from './hooks'
import { NFTData } from './types'

export const nftDataState = atom<NFTData>({
  key: 'NftData',
  default: {
    items: [],
    isFetching: true,
    count: {},
  },
})

export const filteredNftDataState = selector<NFTData>({
  key: 'FilteredNftData',
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

const NftProvider = () => {
  const addresses = useRecoilValue(accountsState)
  const setNftData = useSetRecoilState(nftDataState)
  const { items, isFetching, count } = useNFTData(useMemo(() => addresses.map(account => account.address), [addresses]))

  useEffect(() => {
    setNftData({ items, isFetching, count })
  }, [count, isFetching, items, setNftData])

  return null
}

export default NftProvider
