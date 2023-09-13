import AccountIcon from '@components/molecules/AccountIcon/AccountIcon'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { selectedAccountsState, type Account } from '@domains/accounts'
import {
  nftCollectionItemsState,
  nftCollectionsState,
  nftsByTagState,
  useSetFavoriteNft,
  useSetHiddenNft,
  type CollectionKey,
  type Nft,
  type NftCollection,
  type NftTag,
} from '@domains/nfts'
import { useTheme } from '@emotion/react'
import { ChevronLeft, ChevronRight, ExternalLink, Eye, EyeOff, Heart } from '@talismn/icons'
import {
  Button,
  Card,
  FloatingActionButton,
  Hr,
  ListItem,
  MediaDialog,
  SegmentedButton,
  Select,
  Text,
} from '@talismn/ui'
import { usePagination } from '@talismn/utils/react'
import { shortenAddress } from '@util/format'
import { Maybe } from '@util/monads'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
  type RefCallback,
} from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

const COLLECTION_KEY = 'collectionKey'

const NFT_CARD_WIDTH = 290

const NftTagContext = createContext<NftTag | undefined>(undefined)

const toIpfsCompatibleUrl = (url: string, options?: { imgWidth?: number }) => {
  const pattern = /ipfs:\/\/(ipfs\/)?/

  if (!url.match(pattern)) {
    return url
  }

  const gatewayUrl = new URL(url.replace(/ipfs:\/\/(ipfs\/)?/, 'https://talisman.mypinata.cloud/ipfs/'))

  if (options?.imgWidth !== undefined) {
    // x3 for high DPI display
    gatewayUrl.searchParams.set('img-width', String(options.imgWidth * 3))
  }

  return gatewayUrl.toString()
}

const AccountHeader = (props: { className?: string; account: Account }) => (
  <ListItem
    className={props.className}
    leadingContent={<AccountIcon account={props.account} size="4rem" />}
    headlineText={props.account.name ?? shortenAddress(props.account.address)}
  />
)

const NftGrid = (props: PropsWithChildren) => (
  <div
    {...props}
    css={{
      'display': 'grid',
      'gap': '2.4rem',
      '@media(min-width: 425px)': {
        gridTemplateColumns: `repeat(auto-fill, minmax(${NFT_CARD_WIDTH}px, 1fr))`,
      },
    }}
  />
)

const NftCard = ({ nft }: { nft: Nft }) => {
  const theme = useTheme()

  const [dialogOpen, setDialogOpen] = useState(false)
  const { toggle: toggleFavorite } = useSetFavoriteNft(nft)
  const { toggle: toggleHidden } = useSetHiddenNft(nft)

  const favorite = nft.tags.has('favorite')
  const hidden = nft.tags.has('hidden')

  return (
    <>
      <Card
        media={
          <Card.Preview
            src={Maybe.of(nft.thumbnail ?? nft.media).mapOrUndefined(x => [
              toIpfsCompatibleUrl(x, { imgWidth: NFT_CARD_WIDTH }),
              toIpfsCompatibleUrl(x),
            ])}
            fetchMime
          />
        }
        actions={
          <Card.Actions>
            {({ hover }) => (
              <>
                {hover && (
                  <FloatingActionButton
                    containerColor={theme.color.surface}
                    contentColor={theme.color.onSurface}
                    onClick={event => {
                      event.stopPropagation()
                      toggleHidden()
                    }}
                  >
                    {hidden ? <Eye /> : <EyeOff />}
                  </FloatingActionButton>
                )}
                {(hover || favorite) && (
                  <FloatingActionButton
                    containerColor={theme.color.surface}
                    contentColor={favorite ? theme.color.primary : theme.color.onSurface}
                    onClick={event => {
                      event.stopPropagation()
                      toggleFavorite()
                    }}
                  >
                    <Heart fill={favorite ? theme.color.primary : 'transparent'} />
                  </FloatingActionButton>
                )}
              </>
            )}
          </Card.Actions>
        }
        headlineText={nft.name}
        overlineText={nft.collection?.name}
        onClick={() => setDialogOpen(true)}
      />
      <MediaDialog
        open={dialogOpen}
        onRequestDismiss={() => setDialogOpen(false)}
        title={nft.name}
        overline={nft.collection?.name}
        media={<MediaDialog.Player src={Maybe.of(nft.media).mapOrUndefined(toIpfsCompatibleUrl)} />}
        content={
          <div>
            <Text.Body as="p" css={{ whiteSpace: 'pre-wrap' }}>
              {nft.description}
            </Text.Body>
            <div css={{ display: 'flex', gap: '3.2rem', marginTop: '3.2rem', flexWrap: 'wrap' }}>
              <article>
                <Text.BodyLarge as="div">Type</Text.BodyLarge>
                <Text.BodyLarge alpha="high" css={{ textTransform: 'capitalize' }}>
                  {nft.type.replace('-', ' ')}
                </Text.BodyLarge>
              </article>
              {'chain' in nft && (
                <article>
                  <Text.BodyLarge as="div">Chain</Text.BodyLarge>
                  <Text.BodyLarge alpha="high" css={{ textTransform: 'capitalize' }}>
                    {nft.chain.replace('-', ' ')}
                  </Text.BodyLarge>
                </article>
              )}
              {(nft.externalLinks?.length ?? 0) > 0 && (
                <article>
                  <Text.BodyLarge as="div">View on</Text.BodyLarge>
                  {nft.externalLinks?.map((link, index) => (
                    <Text.BodyLarge.A key={index} target="_blank" href={link.url}>
                      {link.name} <ExternalLink size="1em" css={{ verticalAlign: 'middle' }} />
                    </Text.BodyLarge.A>
                  ))}
                </article>
              )}
              {nft.serialNumber !== undefined && (
                <article>
                  <Text.BodyLarge as="div">Edition</Text.BodyLarge>
                  <Text.BodyLarge alpha="high">
                    #{nft.serialNumber}
                    {nft.collection?.totalSupply && ` / ${nft.collection.totalSupply}`}
                  </Text.BodyLarge>
                </article>
              )}
            </div>
          </div>
        }
      />
    </>
  )
}

const NftCollectionCard = ({ collection }: { collection: NftCollection }) => (
  <Link to={`/portfolio/collectibles?collectionKey=${collection.key}`}>
    <Card
      media={
        <Card.MultiPreview>
          {collection.items
            .map(nft => (
              <Card.Preview
                key={nft.id}
                src={Maybe.of(nft.thumbnail ?? nft.media).mapOrUndefined(x => [
                  toIpfsCompatibleUrl(x, { imgWidth: NFT_CARD_WIDTH / 4 }),
                  toIpfsCompatibleUrl(x),
                ])}
                fetchMime
              />
            ))
            .slice(0, 4)}
        </Card.MultiPreview>
      }
      mediaLabel={collection.items.length <= 4 ? undefined : `+${collection.items.length - 4}`}
      headlineText={collection.name}
    />
  </Link>
)

const AccountNfts = (props: { account: Account; view: 'collections' | 'items' }) => {
  const [searchParams] = useSearchParams()
  const collectionKey = searchParams.get(COLLECTION_KEY) as CollectionKey | null

  const gap = 8
  const targetRows = 3
  const [availableWidth, setAvailableWidth] = useState<number>()

  const limit = useMemo(
    () =>
      (availableWidth === undefined || NFT_CARD_WIDTH >= availableWidth
        ? 10
        : Math.floor(availableWidth / (NFT_CARD_WIDTH + gap))) * targetRows,
    [availableWidth]
  )

  const view = collectionKey !== null ? ('items' as const) : props.view

  const nftTag = useContext(NftTagContext)
  const nftsOrCollections = useRecoilValue<ReadonlyArray<NftCollection | Nft>>(
    view === 'collections'
      ? nftCollectionsState(props.account.address)
      : collectionKey !== null
      ? nftCollectionItemsState({ address: props.account.address, collectionKey })
      : nftTag === 'hidden'
      ? nftsByTagState({ address: props.account.address, whitelist: 'hidden' })
      : nftsByTagState({ address: props.account.address, whitelist: nftTag, blacklist: 'hidden' })
  )

  const [items, { page, pageCount, previous, next }] = usePagination(nftsOrCollections, { limit }, [
    view,
    nftTag,
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
          <AccountHeader account={props.account} css={{ flex: 1, padding: 0 }} />
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
    [next, page, pageCount, previous, props.account]
  )

  if (items.length === 0) {
    return null
  }

  return (
    <>
      <section ref={ref}>
        <PaginationControls showAccount />
        <NftGrid>
          <AnimatePresence mode="popLayout">
            {items.map(item => (
              <motion.div key={item.id} layout exit={{ opacity: 0, scale: 0.8 }}>
                {'items' in item ? <NftCollectionCard collection={item} /> : <NftCard nft={item} />}
              </motion.div>
            ))}
          </AnimatePresence>
        </NftGrid>
        <PaginationControls />
      </section>
      <Hr />
    </>
  )
}

const Nfts = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const collectionKey = searchParams.get(COLLECTION_KEY)
  const [tag, setTag] = useState<NftTag>()

  const [view, setView] = useState<'collections' | 'items'>('items')
  const accounts = useRecoilValue(selectedAccountsState)

  // When account selections change, remove detailed collection view
  // because new account selections might not have that collection
  useEffect(
    () => {
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete(COLLECTION_KEY)
      setSearchParams(newSearchParams)
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [accounts]
  )

  return (
    <div>
      <div css={{ display: 'flex' }}>
        {collectionKey === null ? (
          <>
            {view === 'items' && (
              <Text.Body as="label" css={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                Show:
                <Select value={tag} onChange={setTag}>
                  <Select.Option value={undefined} headlineText="All" />
                  {['favorite', 'hidden'].map(x => (
                    <Select.Option
                      key={x}
                      value={x}
                      headlineText={<span css={{ textTransform: 'capitalize' }}>{x}</span>}
                    />
                  ))}
                </Select>
              </Text.Body>
            )}
            <SegmentedButton value={view} onChange={setView} css={{ marginLeft: 'auto' }}>
              <SegmentedButton.ButtonSegment value="collections">Collections</SegmentedButton.ButtonSegment>
              <SegmentedButton.ButtonSegment value="items">Items</SegmentedButton.ButtonSegment>
            </SegmentedButton>
          </>
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
      <section>
        {accounts.map(account => (
          <ErrorBoundary key={account.address} orientation="horizontal">
            <Suspense
              fallback={
                <div>
                  <AccountHeader account={account} />
                  <NftGrid>
                    <Card.Skeleton />
                  </NftGrid>
                  <Hr css={{ marginTop: '4.4rem' }} />
                </div>
              }
            >
              <NftTagContext.Provider value={tag}>
                <AccountNfts account={account} view={view} />
              </NftTagContext.Provider>
            </Suspense>
          </ErrorBoundary>
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
    </div>
  )
}

export default Nfts
