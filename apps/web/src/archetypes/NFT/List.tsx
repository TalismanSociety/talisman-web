import { Copy, EyeOff, Heart, Image } from '@components/atoms/Icon'
import Identicon from '@components/atoms/Identicon'
import Text from '@components/atoms/Text'
import { CopyButton } from '@components/CopyButton'
import Select from '@components/molecules/Select'
import { NFTCard } from '@components/recipes/NFTCard'
import { WalletNavConnector } from '@components/WalletNavConnector'
import { accountsState, selectedAccountsState } from '@domains/accounts/recoils'
import { useFavoriteNftLookup, useHiddenNftLookup } from '@domains/nfts/hooks'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { filteredNftDataState } from '@libs/@talisman-nft/provider'
import type { NFTCollectionDetails } from '@libs/@talisman-nft/types'
import { NFTShort } from '@libs/@talisman-nft/types'
import { device } from '@util/breakpoints'
import { Maybe } from '@util/monads'
import { AnimatePresence, motion } from 'framer-motion'
import { uniqWith } from 'lodash/fp'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useRecoilValue } from 'recoil'

import HiddenNFTGrid from './HiddenNFTGrid'

type ListItemProps = {
  nfts: NFTShort[]
  isFetching: boolean
}

const ListItems = ({ nfts, isFetching }: ListItemProps) => {
  return (
    <>
      <AnimatePresence mode="popLayout">
        {nfts.map(nft => (
          <motion.div key={nft.id} layoutId={`nft-card-${nft.id}`} exit={{ opacity: 0, scale: 0.8 }}>
            <NFTCard nft={nft as any} />
          </motion.div>
        ))}
      </AnimatePresence>
      {isFetching && <NFTCard loading />}
    </>
  )
}

export const ListGrid = styled.div`
  display: grid;
  gap: 2rem;
  overflow-anchor: none;
  @media ${device.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media ${device.lg} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media ${device.xl} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

const List = () => {
  const isFavorite = useFavoriteNftLookup()
  const isHidden = useHiddenNftLookup()

  const { items, isFetching, count } = useRecoilValue(filteredNftDataState)
  const accounts = useRecoilValue(accountsState)
  const isSingleAccountSelected = useRecoilValue(selectedAccountsState).length <= 1

  const specialCollections = useMemo(
    () =>
      [
        {
          id: 'all',
          element: (
            <Text.Body css={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Image width="1.6rem" height="1.6rem" /> All collections
            </Text.Body>
          ),
        },
        {
          id: 'favorites',
          element: (
            <Text.Body css={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Heart width="1.6rem" height="1.6rem" /> Favorites
            </Text.Body>
          ),
        },
        {
          id: 'hidden',
          element: (
            <Text.Body css={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <EyeOff width="1.6rem" height="1.6rem" /> Hidden
            </Text.Body>
          ),
        },
      ] as const,
    []
  )

  const [selectedCollection, setSelectedCollection] = useState<
    typeof specialCollections[number]['id'] | NFTCollectionDetails
  >('all')
  const selectedCollectionValue = typeof selectedCollection === 'string' ? selectedCollection : selectedCollection.id

  const collections = useMemo(
    () =>
      uniqWith(
        (a, b) => a.id === b.id,
        items
          .flatMap(x => x.collection)
          .filter((x): x is NFTCollectionDetails => x !== undefined)
          .sort((a, b) => a.id.localeCompare(b.id))
      ),
    [items]
  )

  const filteredItems = useMemo(() => {
    if (selectedCollection === 'all') {
      return items.filter(item => !isHidden(item.address, item.id))
    }

    if (selectedCollection === 'favorites') {
      return items.filter(item => isFavorite(item.address, item.id))
    }

    if (selectedCollection === 'hidden') {
      return items.filter(item => isHidden(item.address, item.id))
    }

    return items
      .filter(x => x.collection?.id === selectedCollection.id)
      .filter(item => !isHidden(item.address, item.id))
  }, [isFavorite, isHidden, items, selectedCollection])

  // filter items by address and map listgrid per address
  const nfts = useMemo(
    () =>
      filteredItems.reduce((acc, nft) => {
        if (!acc[nft?.address]) acc[nft?.address] = []
        acc[nft?.address]?.push(nft)
        return acc
      }, {} as Record<string, NFTShort[]>),
    [filteredItems]
  )

  const sortByKeys = ['Default', 'Name ascending', 'Name descending', 'Floor price'] as const
  const [sortBy, setSortBy] = useState<typeof sortByKeys[number]>('Default')

  const sortedNfts = useMemo(() => {
    const sortFunc = ((): ((a: NFTShort, b: NFTShort) => number) => {
      switch (sortBy) {
        case 'Name ascending':
          return (a, b) => a.name.localeCompare(b.name)
        case 'Name descending':
          return (a, b) => b.name.localeCompare(a.name)
        case 'Floor price':
          return (a, b) =>
            Maybe.of(b.collection?.floorPrice).mapOr(0, parseFloat) -
            Maybe.of(a.collection?.floorPrice).mapOr(0, parseFloat)
        default:
          return (a, b) => (isFavorite(a.address, a.id) ? -1 : isFavorite(b.address, b.id) ? 1 : 0)
      }
    })()

    return Object.fromEntries(Object.entries(nfts).map(([key, value]) => [key, [...value].sort(sortFunc)]))
  }, [isFavorite, nfts, sortBy])

  // find account name whhere address matches
  const accountName = (address: string) => {
    const account = accounts.find(account => account.address === address)
    return account?.name
  }

  if (!isFetching && count === 0)
    return (
      <HiddenNFTGrid
        overlay={
          <span
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              > * {
                margin-bottom: 1rem;
              }
            `}
          >
            <Text.H2>No NFTs Found</Text.H2>
            <Text.Body>Please try another account</Text.Body>
            <WalletNavConnector />
          </span>
        }
      />
    )

  return (
    <>
      <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Select.Label>
          Filter:
          <Select
            variant="toggle-no-background"
            value={selectedCollectionValue}
            onChange={id =>
              setSelectedCollection(
                collections.find(c => c.id === id) ?? specialCollections.find(x => x.id === id)?.id ?? 'all'
              )
            }
          >
            {[
              ...specialCollections.map((x, index, array) => (
                <Select.Item key={x.id} value={x.id} bottomBordered={index === array.length - 1}>
                  {x.element}
                </Select.Item>
              )),
              ...collections.map(x => (
                <Select.Item key={x.id} value={x.id}>
                  {x.name ?? x.id}
                </Select.Item>
              )),
            ]}
          </Select>
        </Select.Label>
        <Select.Label>
          Sort:
          <Select variant="toggle-no-background" value={sortBy} onChange={key => setSortBy(key ?? ('Default' as any))}>
            {sortByKeys.map(x => (
              <Select.Item key={x} value={x}>
                {x}
              </Select.Item>
            ))}
          </Select>
        </Select.Label>
      </div>
      {Object.keys(sortedNfts).map((address: string) => (
        <>
          <div
            css={{
              'display': 'flex',
              'flexDirection': 'row',
              'alignItems': 'center',

              // first item no top margin
              '&:first-of-type': {
                marginTop: 0,
              },

              'margin': '3rem 0',
              'gap': '1rem',
            }}
          >
            {!isSingleAccountSelected && (
              <>
                <Identicon
                  value={address}
                  css={{
                    width: '4rem',
                    height: '4rem',
                  }}
                />
                <Text.Body
                  css={{
                    fontSize: '2rem',
                  }}
                >
                  {accountName(address)}
                </Text.Body>
                <CopyButton
                  text={address}
                  onCopied={(text: string) => {
                    toast(
                      <>
                        <Text.Body as="div" alpha="high">
                          Address copied to clipboard
                        </Text.Body>
                        <Text.Body as="div">{text}</Text.Body>
                      </>,
                      { position: 'bottom-right', icon: <Copy /> }
                    )
                  }}
                  onFailed={(text: string) => {
                    console.log(`>>> failed`, text)
                  }}
                />
              </>
            )}
          </div>
          <ListGrid>
            <ListItems nfts={sortedNfts[address]!} isFetching={isFetching} />
          </ListGrid>
        </>
      ))}
    </>
  )
}

export default List
