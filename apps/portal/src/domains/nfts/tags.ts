import { selectedAccountsState } from '@domains/accounts'
import { storageEffect } from '@domains/common/effects'
import { array, jsonParser, string } from '@recoiljs/refine'
import { partial } from 'lodash'
import { useCallback, useMemo } from 'react'
import {
  atom,
  selector,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
  waitForNone,
  type SetterOrUpdater,
} from 'recoil'
import { nftsState, type Nft, type NftTag } from '.'

export const favoriteNftIdsState = atom<readonly string[]>({
  key: 'favorite-nft-ids',
  default: [],
  effects: [storageEffect(localStorage, { parser: jsonParser(array(string())) })],
})

export const hiddenNftIdsState = atom<readonly string[]>({
  key: 'hidden-nft-ids',
  default: [],
  effects: [storageEffect(localStorage, { parser: jsonParser(array(string())) })],
})

export const selectedAccountsFavoriteNftsState = selector({
  key: 'SelectedAccountsFavoriteNfts',
  get: ({ get }) =>
    get(waitForNone(get(selectedAccountsState).map(x => nftsState(x.address))))
      .flatMap(x => x.valueMaybe() ?? [])
      .filter(x => get(favoriteNftIdsState).includes(x.id)),
})

export const selectedAccountsHiddenNftsState = selector({
  key: 'SelectedAccountsHiddenNfts',
  get: ({ get }) =>
    get(waitForNone(get(selectedAccountsState).map(x => nftsState(x.address))))
      .flatMap(x => x.valueMaybe() ?? [])
      .filter(x => get(hiddenNftIdsState).includes(x.id)),
})

export const nftsByTagState = selectorFamily<
  readonly Nft[],
  {
    address: string
    whitelist?: NftTag[] | NftTag | undefined
    blacklist?: NftTag[] | NftTag | undefined
  }
>({
  key: 'NftsByTag',
  get:
    ({ address, whitelist, blacklist }) =>
    ({ get }) =>
      get(nftsState(address))
        .filter(x =>
          Array.isArray(whitelist) ? whitelist.every(x.tags.has) : whitelist === undefined || x.tags.has(whitelist)
        )
        .filter(x =>
          Array.isArray(blacklist) ? !blacklist.some(x.tags.has) : blacklist === undefined || !x.tags.has(blacklist)
        ),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

const useSetTaggedNfts = (setNfts: SetterOrUpdater<readonly string[]>) => ({
  add: useCallback((nft: Nft) => setNfts(x => [...x.filter(y => y !== nft.id), nft.id]), [setNfts]),
  remove: useCallback((nft: Nft) => setNfts(x => x.filter(y => y !== nft.id)), [setNfts]),
  toggle: useCallback(
    (nft: Nft) =>
      setNfts(ids => {
        if (ids.includes(nft.id)) {
          return ids.filter(x => x !== nft.id)
        } else {
          return [...ids, nft.id]
        }
      }),
    [setNfts]
  ),
})

const useSetTaggedNft = (nft: Nft, setNfts: SetterOrUpdater<readonly string[]>) => {
  const { add, remove, toggle } = useSetTaggedNfts(setNfts)

  return {
    add: useMemo(() => partial(add, nft), [add, nft]),
    remove: useMemo(() => partial(remove, nft), [nft, remove]),
    toggle: useMemo(() => partial(toggle, nft), [nft, toggle]),
  }
}

export const useSetFavoriteNfts = () => useSetTaggedNfts(useSetRecoilState(favoriteNftIdsState))

export const useSetFavoriteNft = (nft: Nft) => useSetTaggedNft(nft, useSetRecoilState(favoriteNftIdsState))

export const useFavoriteNfts = () => [useRecoilValue(selectedAccountsFavoriteNftsState), useSetFavoriteNfts()] as const

export const useFavoriteNft = (nft: Nft) =>
  [useRecoilValue(favoriteNftIdsState).includes(nft.id), useSetFavoriteNft(nft)] as const

export const useSetHiddenNfts = () => useSetTaggedNfts(useSetRecoilState(hiddenNftIdsState))

export const useSetHiddenNft = (nft: Nft) => useSetTaggedNft(nft, useSetRecoilState(hiddenNftIdsState))

export const useHiddenNfts = () => [useRecoilValue(selectedAccountsHiddenNftsState), useSetHiddenNfts()] as const

export const useHiddenNft = (nft: Nft) =>
  [useRecoilValue(hiddenNftIdsState).includes(nft.id), useSetHiddenNft(nft)] as const
