import { Account, selectedAccountsState } from '@domains/accounts'
import {
  CollectionKey,
  nftCollectionItemsState,
  nftCollectionsState,
  nftsState,
  type NftCollection,
} from '@domains/nfts'
import { ChevronLeft, ChevronRight, ExternalLink } from '@talismn/icons'
import { type Nft } from '@talismn/nft'
import { Button, Card, Hr, Identicon, ListItem, MediaDialog, SegmentedButton, Text } from '@talismn/ui'
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
          content={
            <div>
              <Text.Body as="p" css={{ whiteSpace: 'pre-wrap' }}>
                {nft.description}
              </Text.Body>
              <div css={{ display: 'flex', gap: '3.2rem', marginTop: '3.2rem' }}>
                {(nft.externalLinks?.length ?? 0) > 0 && (
                  <article>
                    <Text.BodyLarge as="div">View on</Text.BodyLarge>
                    {nft.externalLinks?.map(link => (
                      <Text.BodyLarge.A target="_blank" href={link.url}>
                        {link.name} <ExternalLink size="1em" css={{ verticalAlign: 'middle' }} />
                      </Text.BodyLarge.A>
                    ))}
                  </article>
                )}
                {nft.serialNumber && (
                  <article>
                    <Text.BodyLarge as="div">Edition</Text.BodyLarge>
                    <Text.BodyLarge alpha="high">
                      #{nft.serialNumber}
                      {nft.collection?.maxSupply && ` / ${nft.collection.maxSupply}`}
                    </Text.BodyLarge>
                  </article>
                )}
              </div>
            </div>
          }
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

  const [items, { page, pageCount, previous, next }] = usePagination(nftsOrCollections, { limit }, [
    view,
    props.account.address,
  ])

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
      <Suspense
        fallback={
          <div css={{ 'marginTop': '1.6rem', '@media(min-width: 425px)': { maxWidth: 290 } }}>
            <Card.Skeleton />
          </div>
        }
      >
        <section>
          {accounts.map(account => (
            <AccountNfts key={account.address} account={account} view={view} />
          ))}
          <section
            css={[
              {
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.8rem',
                marginTop: '1.6rem',
              },
              { ':not(:only-child)': { display: 'none' } },
            ]}
          >
            <Text.H2>No collectibles found</Text.H2>
            <Text.Body>
              Talisman currently supports RMRK 2, Astar,
              <br />
              Moonriver, Moonbeam, Statemine and Acala NFTs
            </Text.Body>
            <Text.Body>
              Start your collection with a{' '}
              <Text.Body.A href="https://singular.rmrk.app/collections/b6e98494bff52d3b1e-SPIRIT" target="_blank">
                Spirit Key <ExternalLink size="1em" />
              </Text.Body.A>
            </Text.Body>
          </section>
        </section>
      </Suspense>
    </div>
  )
}

export default Nfts
