import { TalismanHandLoader } from '@components/TalismanHandLoader'
import { Account, selectedAccountsState } from '@domains/accounts'
import { ChevronLeft, ChevronRight } from '@talismn/icons'
import {
  Nft,
  createAcalaNftAsyncGenerator,
  createEvmNftAsyncGenerator,
  createRmrk1NftAsyncGenerator,
  createRmrk2NftAsyncGenerator,
  createStatemineNftAsyncGenerator,
} from '@talismn/nft'
import { Button, Card, Hr, Identicon, ListItem, Text } from '@talismn/ui'
import { RefCallback, Suspense, useCallback, useMemo, useState } from 'react'
import { DefaultValue, atomFamily, useRecoilValue } from 'recoil'

const useSimplePagination = <T,>(items: T[], { limit }: { limit: number }) => {
  const [offset, setOffset] = useState(0)
  const pageCount = Math.ceil(items.length / limit)
  const page = (offset + limit) / limit - 1
  const paginatedItems = useMemo(() => items.slice(offset, offset + limit), [items, offset, limit])

  const next = useCallback(() => setOffset(x => x + limit), [limit])
  const previous = useCallback(() => setOffset(x => x - limit), [limit])

  return [
    paginatedItems,
    {
      page,
      pageCount,
      previous: offset <= 0 ? undefined : previous,
      next: offset + limit >= items.length - 1 ? undefined : next,
    },
  ] as const
}

const nftsState = atomFamily<Nft[], string>({
  key: 'Nfts',
  effects: (address: string) => [
    ({ setSelf }) => {
      let resolve = (_: Nft[]) => {}
      let reject = (_: any) => {}

      setSelf(
        new Promise<Nft[]>((_resolve, _reject) => {
          resolve = _resolve
          reject = _reject
        })
      )
      ;(address.startsWith('0x')
        ? [createEvmNftAsyncGenerator]
        : [
            createAcalaNftAsyncGenerator,
            createRmrk1NftAsyncGenerator,
            createRmrk2NftAsyncGenerator,
            createStatemineNftAsyncGenerator,
          ]
      ).map(async createNftAsyncGenerator => {
        try {
          for await (const nft of createNftAsyncGenerator(address, { batchSize: 24 })) {
            resolve([nft])
            setSelf(self => [...(self instanceof DefaultValue ? [] : self), nft])
          }
          resolve([])
          setSelf(self => (self instanceof DefaultValue || self.length === 0 ? [] : self))
        } catch (error) {
          reject(error)
        }
      })
    },
  ],
})

const AccountNfts = (props: { account: Account }) => {
  const targetWidth = 298
  const targetColumns = 3
  const [availableWidth, setAvailableWidth] = useState<number>()

  const limit = useMemo(
    () =>
      (availableWidth === undefined || targetWidth >= availableWidth ? 10 : Math.floor(availableWidth / targetWidth)) *
      targetColumns,
    [availableWidth]
  )

  const [nfts, { page, pageCount, previous, next }] = useSimplePagination(
    useRecoilValue(nftsState(props.account.address)),
    { limit }
  )

  const ref = useCallback<RefCallback<HTMLElement>>(
    element => setAvailableWidth(element?.getBoundingClientRect().width),
    []
  )

  if (nfts.length === 0) {
    return null
  }

  const paginationControls = (
    <header
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        margin: '1.6rem 0',
      }}
    >
      <ListItem
        leadingContent={<Identicon value={props.account.address} size="4rem" />}
        headlineText={props.account.name ?? props.account.address}
        css={{ flex: 1 }}
      />
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
  )

  return (
    <>
      <section ref={ref}>
        {paginationControls}
        <div
          css={{
            'display': 'grid',
            'gap': '2.4rem',
            '@media(min-width: 425px)': {
              gridTemplateColumns: `repeat(auto-fill, minmax(${targetWidth}px, 1fr))`,
            },
          }}
        >
          {nfts.map((nft, index) => (
            <div key={`${page}-${index}`}>
              <Card
                media={
                  <Card.Image
                    src={(nft.thumbnail || nft.media)?.replace(
                      /ipfs:\/\/(ipfs\/)?/,
                      'https://talisman.mypinata.cloud/ipfs/'
                    )}
                    loading="lazy"
                  />
                }
                headlineText={nft.name}
                overlineText={nft.collection?.name}
              />
            </div>
          ))}
        </div>
        {paginationControls}
      </section>
      <Hr />
    </>
  )
}

const Nfts = () => {
  const accounts = useRecoilValue(selectedAccountsState)

  return (
    <Suspense fallback={<TalismanHandLoader />}>
      <section>
        {accounts.map(account => (
          <AccountNfts key={account.address} account={account} />
        ))}
      </section>
    </Suspense>
  )
}

export default Nfts
