import { storageEffect } from '@domains/common/effects'
import { atom } from 'recoil'

type AddressNft = { address: string; id: string }

export const favoriteNftsState = atom<AddressNft[]>({
  key: 'FavoriteNfts',
  default: [],
  effects: [storageEffect(localStorage, '@talisman/')],
})

export const hiddenNftsState = atom<AddressNft[]>({
  key: 'HiddenNfts',
  default: [],
  effects: [storageEffect(localStorage, '@talisman/')],
})
