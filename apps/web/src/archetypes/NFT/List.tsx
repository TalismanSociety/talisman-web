import { Copy } from '@components/atoms/Icon'
import Identicon from '@components/atoms/Identicon'
import Text from '@components/atoms/Text'
import { CopyButton } from '@components/CopyButton'
import Select from '@components/molecules/Select'
import { NFTCard } from '@components/recipes/NFTCard'
import { WalletNavConnector } from '@components/WalletNavConnector'
import { useFavoriteNftLookup, useHiddenNftLookup } from '@domains/nfts/hooks'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { GetNFTData } from '@libs/@talisman-nft'
import type { NFTCollectionDetails } from '@libs/@talisman-nft/types'
import { NFTShort } from '@libs/@talisman-nft/types'
import { useAccounts } from '@libs/talisman'
import { device } from '@util/breakpoints'
import { AnimatePresence, motion } from 'framer-motion'
import { uniqWith } from 'lodash/fp'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import HiddenNFTGrid from './HiddenNFTGrid'

type ListItemProps = {
  nfts: NFTShort[]
  isFetching: boolean
  collectionId?: string
}

const ListItems = ({ nfts, collectionId, isFetching }: ListItemProps) => {
  return (
    <>
      <AnimatePresence mode="popLayout">
        {nfts.map(nft => (
          <motion.div key={nft.id} layoutId={`nft-card-${collectionId}-${nft.id}`} exit={{ opacity: 0, scale: 0.8 }}>
            <NFTCard nft={nft as any} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* {nfts.length !== count &&
        Array.from({ length: count - nfts.length }).map((_, index) => <NFTCard loading={true} />)} */}

      {isFetching && <NFTCard loading={true} />}
    </>
  )
}

const ListGrid = styled.div`
  display: grid;
  gap: 2rem;
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

const List = ({ addresses }: { addresses: string[] }) => {
  const isFavorite = useFavoriteNftLookup()
  const isHidden = useHiddenNftLookup()

  const { items, isFetching, count } = GetNFTData({ addresses: addresses })

  const specialCollections = ['All collection', '❤️ Favorites', 'Hidden'] as const

  const [selectedCollection, setSelectedCollection] = useState<
    typeof specialCollections[number] | NFTCollectionDetails
  >('All collection')
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
    if (selectedCollection === 'All collection') {
      return items.filter(item => !isHidden(item.address, item.id))
    }

    if (selectedCollection === '❤️ Favorites') {
      return items.filter(item => isFavorite(item.address, item.id))
    }

    if (selectedCollection === 'Hidden') {
      return items.filter(item => isHidden(item.address, item.id))
    }

    return items
      .filter(x => x.collection?.id === selectedCollection.id)
      .filter(item => !isHidden(item.address, item.id))
  }, [isFavorite, isHidden, items, selectedCollection])

  const accounts = useAccounts()

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

  const sortedNfts = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(nfts).map(([key, value]) => [
          key,
          value.sort((a, b) => (isFavorite(a.address, a.id) ? -1 : isFavorite(b.address, b.id) ? 1 : 0)),
        ])
      ),
    [isFavorite, nfts]
  )

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
      <Select
        value={selectedCollectionValue}
        onChange={id =>
          setSelectedCollection(
            collections.find(c => c.id === id) ?? specialCollections.find(x => x === id) ?? 'All collection'
          )
        }
      >
        {[
          ...specialCollections.map(x => (
            <Select.Item key={x} value={x}>
              <Text.Body alpha="high">{x}</Text.Body>
            </Select.Item>
          )),
          ...collections.map(x => (
            <Select.Item key={x.id} value={x.id}>
              {x.name ?? x.id}
            </Select.Item>
          )),
        ]}
      </Select>
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
