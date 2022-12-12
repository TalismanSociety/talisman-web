import { accountsState, selectedAccountAddressesState } from '@domains/accounts/recoils'
import { useEffect } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'

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

const NftProvider = () => {
  const addresses = useRecoilValue(accountsState).map(account => account.address)
  const activeAccounts = useRecoilValue(selectedAccountAddressesState)

  const setNftData = useSetRecoilState(nftDataState)
  const { items, isFetching, count } = useNFTData(addresses)

  useEffect(() => {
    // if activeaccounts then filter items by address in activeaccounts
    if (activeAccounts && activeAccounts.length > 0) {
      const filteredItems = items.filter(item => activeAccounts.includes(item.address))
      setNftData({ items: filteredItems, isFetching, count })
      return
    }

    setNftData({ items, isFetching, count })
  }, [activeAccounts, count, isFetching, items, setNftData])

  return null
}

export default NftProvider
