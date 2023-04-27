import { TalismanHandLoader } from '@components/TalismanHandLoader'
import { Account, selectedAccountsState } from '@domains/accounts'
import {
  CollectionKey,
  nftCollectionItemsState,
  nftCollectionsState,
  nftsState,
  type NftCollection,
} from '@domains/nfts'
import { ChevronLeft, ChevronRight } from '@talismn/icons'
import { type Nft } from '@talismn/nft'
import { Button, Card, Hr, IconButton, Identicon, ListItem, MediaDialog, SegmentedButton, Text } from '@talismn/ui'
import { usePagination } from '@talismn/utils/react'
import { RefCallback, Suspense, useCallback, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

const NftCard = ({ nft }: { nft: Nft }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card
        media={
          <Card.Image
            src={nft.thumbnail?.replace(/ipfs:\/\/(ipfs\/)?/, 'https://talisman.mypinata.cloud/ipfs/')}
            loading="lazy"
          />
        }
        headlineText={nft.name}
        overlineText={nft.collection?.name}
        onClick={() => setDialogOpen(true)}
      />
      {/* Unmount completely to help with performance */}
      {dialogOpen && (
        <MediaDialog
          open={dialogOpen}
          onRequestDismiss={() => setDialogOpen(false)}
          title={nft.name}
          overline={nft.collection?.name}
          media={
            <MediaDialog.Player
              src={nft.media?.replace(/ipfs:\/\/(ipfs\/)?/, 'https://talisman.mypinata.cloud/ipfs/')}
            />
          }
          content={<Text.Body as="p">{nft.description}</Text.Body>}
        />
      )}
    </>
  )
}

const NftCollectionCard = ({ collection }: { collection: NftCollection }) => (
  <Link to={`/portfolio/collectibles?collectionKey=${collection.key}`}>
    <Card
      media={
        <Card.MultiMedia>
          {collection.items
            .map(nft => (
              <Card.Image
                key={nft.id}
                src={nft.thumbnail?.replace(/ipfs:\/\/(ipfs\/)?/, 'https://talisman.mypinata.cloud/ipfs/')}
              />
            ))
            .slice(0, 4)}
        </Card.MultiMedia>
      }
      mediaLabel={`+${collection.items.length}`}
      headlineText={collection.name}
    />
  </Link>
)

const AccountNfts = (props: { account: Account; view: 'collections' | 'items' }) => {
  const [searchParams] = useSearchParams()
  const collectionKey = searchParams.get('collectionKey') as CollectionKey | null

  const targetWidth = 290
  const gap = 8
  const targetRows = 3
  const [availableWidth, setAvailableWidth] = useState<number>()

  const limit = useMemo(
    () =>
      (availableWidth === undefined || targetWidth >= availableWidth
        ? 10
        : Math.floor(availableWidth / (targetWidth + gap))) * targetRows,
    [availableWidth]
  )

  const view = collectionKey !== null ? ('items' as const) : props.view

  const nftsOrCollections: Array<NftCollection | Nft> = useRecoilValue(
    // @ts-expect-error
    view === 'collections'
      ? nftCollectionsState(props.account.address)
      : collectionKey !== null
      ? nftCollectionItemsState({ address: props.account.address, collectionKey })
      : nftsState(props.account.address)
  )

  const [items, { page, pageCount, previous, next }] = usePagination(nftsOrCollections, { limit })

  const ref = useCallback<RefCallback<HTMLElement>>(
    element => setAvailableWidth(element?.getBoundingClientRect().width),
    []
  )

  const PaginationControls = useCallback(
    ({ showAccount }: { showAccount?: boolean }) => (
      <header
        css={{
          display: 'flex',
          alignItems: 'center',
          gap,
          margin: '1.6rem 0',
        }}
      >
        {showAccount ? (
          <ListItem
            leadingContent={<Identicon value={props.account.address} size="4rem" />}
            headlineText={props.account.name ?? props.account.address}
            css={{ flex: 1, padding: 0 }}
          />
        ) : (
          <div css={{ flex: 1 }} />
        )}
        <Text.Body
          as="div"
          style={{ visibility: pageCount <= 1 ? 'hidden' : undefined }}
          css={{ flex: 1, textAlign: 'center' }}
        >
          Page {page + 1} of {pageCount}
        </Text.Body>
        <div css={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
          <Button
            variant="outlined"
            leadingIcon={<ChevronLeft />}
            onClick={previous}
            style={{ visibility: previous === undefined ? 'hidden' : undefined }}
          >
            Prev
          </Button>
          <Button
            variant="outlined"
            trailingIcon={<ChevronRight />}
            onClick={next}
            style={{ visibility: next === undefined ? 'hidden' : undefined }}
          >
            Next
          </Button>
        </div>
      </header>
    ),
    [next, page, pageCount, previous, props.account.address, props.account.name]
  )

  if (items.length === 0) {
    return null
  }

  return (
    <>
      <section ref={ref}>
        <PaginationControls showAccount />
        <div
          css={{
            'display': 'grid',
            'gap': '2.4rem',
            '@media(min-width: 425px)': {
              gridTemplateColumns: `repeat(auto-fill, minmax(${targetWidth}px, 1fr))`,
            },
          }}
        >
          {items.map((item, index) => (
            <div key={`${page}-${index}`}>
              {'items' in item ? <NftCollectionCard collection={item} /> : <NftCard nft={item} />}
            </div>
          ))}
        </div>
        <PaginationControls />
      </section>
      <Hr />
    </>
  )
}

const Nfts = () => {
  const [searchParams] = useSearchParams()
  const collectionKey = searchParams.get('collectionKey')

  const [view, setView] = useState<'collections' | 'items'>('items')
  const accounts = useRecoilValue(selectedAccountsState)

  return (
    <div>
      <div css={{ display: 'flex' }}>
        {collectionKey === null ? (
          <SegmentedButton value={view} onChange={setView} css={{ marginLeft: 'auto' }}>
            <SegmentedButton.ButtonSegment value="collections">Collections</SegmentedButton.ButtonSegment>
            <SegmentedButton.ButtonSegment value="items">Items</SegmentedButton.ButtonSegment>
          </SegmentedButton>
        ) : (
          <div css={{ flex: 1 }}>
            <Button
              as={Link}
              variant="secondary"
              leadingIcon={<ChevronLeft />}
              to="/portfolio/collectibles"
              css={{ marginBottom: '2rem' }}
            >
              Back
            </Button>
            <Hr />
          </div>
        )}
      </div>
      <Suspense fallback={<TalismanHandLoader />}>
        <section>
          {accounts.map(account => (
            <AccountNfts key={account.address} account={account} view={view} />
          ))}
        </section>
      </Suspense>
    </div>
  )
}

export default Nfts
