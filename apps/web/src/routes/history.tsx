import { TalismanHandLoader } from '@components/TalismanHandLoader'
import ExportHistoryAlertDialog from '@components/recipes/ExportHistoryAlertDialog'
import {
  ExtrinsicDetailsSideSheet,
  type ExtrinsicDetailsSideSheetProps,
} from '@components/recipes/ExtrinsicDetailsSideSheet'
import TransactionLineItem, { TransactionList } from '@components/recipes/TransactionLineItem'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { selectedAccountsState, type Account } from '@domains/accounts'
import * as Sentry from '@sentry/react'
import { Codepen, Globe } from '@talismn/icons'
import { Button, CircularProgressIndicator, DateInput, Select, Text, TextInput, toast } from '@talismn/ui'
import { encodeAnyAddress } from '@talismn/util'
import { tryParseSubstrateOrEthereumAddress } from '@util/addressValidation'
import { Maybe } from '@util/monads'
import BigNumber from 'bignumber.js'
import { stringify as stringifyCsv } from 'csv-stringify/browser/esm'
import { endOfDay, startOfDay } from 'date-fns'
import request from 'graphql-request'
import { isNil } from 'lodash'
import { Suspense, useCallback, useMemo, useState, type PropsWithChildren, type ReactNode } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { selector, useRecoilValue } from 'recoil'
import { isHex } from 'viem'
import { graphql } from '../../generated/gql/extrinsicHistory/gql'
import { ExtrinsicOrderByInput, type ExtrinsicsQuery } from '../../generated/gql/extrinsicHistory/gql/graphql'
import { TitlePortal } from './layout'

type ExtrinsicNode = ExtrinsicsQuery['extrinsics']['edges'][number]['node']

const filtersState = selector({
  key: 'History/Filters',
  get: async () =>
    await request(
      import.meta.env.REACT_APP_EX_HISTORY_INDEXER,
      graphql(`
        query filters {
          modules
          chains {
            genesisHash
            name
            logo
          }
        }
      `)
    ),
})

const getExtrinsicTotalAmount = (extrinsic: ExtrinsicNode, accounts: Account[]) => {
  const encodedAddresses = accounts.map(x => encodeAnyAddress(x.address)) ?? []
  return [...extrinsic.transfers.edges, ...extrinsic.rewards.edges]
    .map(x => x.node)
    .filter(
      x =>
        encodedAddresses.includes(encodeAnyAddress(x.debit)) ||
        (x.credit !== 'reserve' && encodedAddresses.includes(encodeAnyAddress(x.credit)))
    )
    .reduce((prev, curr) => prev.plus(curr.amount.value), new BigNumber(0))
}

const getExtrinsicBalanceChangeAmount = (extrinsic: ExtrinsicNode, accounts: Account[]) => {
  const encodedAddresses = accounts.map(x => encodeAnyAddress(x.address)) ?? []
  return [...extrinsic.transfers.edges, ...extrinsic.rewards.edges]
    .map(x => x.node)
    .reduce(
      (prev, curr) =>
        encodedAddresses.includes(encodeAnyAddress(curr.debit))
          ? prev.plus(curr.amount.value)
          : encodedAddresses.includes(encodeAnyAddress(curr.credit))
          ? prev.minus(curr.amount.value)
          : prev,
      new BigNumber(0)
    )
}

const LabelledInput = (props: PropsWithChildren & { label?: ReactNode }) => (
  <Text.BodySmall as="label" css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
    <div>{props.label ?? <wbr />}</div>
    {props.children}
  </Text.BodySmall>
)

type ExportHistoryButtonProps = {
  accounts: Account[]
  extrinsics: ExtrinsicNode[]
}

const ExportHistoryButton = (props: ExportHistoryButtonProps) => {
  const [open, setOpen] = useState(false)

  const encodedAddresses = useMemo(() => props.accounts?.map(x => encodeAnyAddress(x.address)) ?? [], [props.accounts])

  if (props.extrinsics.length === 0) {
    return null
  }

  return (
    <>
      <Button
        css={theme => ({ position: 'fixed', right: '2.4rem', bottom: '4rem', background: theme.color.background })}
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        Export {props.extrinsics.length} records
      </Button>
      {open && (
        <ExportHistoryAlertDialog
          onRequestDismiss={() => setOpen(false)}
          onConfirm={() => {
            const records = [
              [
                'type',
                'timestamp',
                'chain',
                'module',
                'call',
                'hash',
                'amount',
                'changeInBalance',
                'symbol',
                'subscanUrl',
              ],
              ...props.extrinsics.map(extrinsic => {
                const selfSigned = !extrinsic.signer
                  ? false
                  : encodedAddresses.includes(encodeAnyAddress(extrinsic.signer))

                const totalAmountOfInterest = getExtrinsicTotalAmount(extrinsic, props.accounts)
                const balanceChangeAmount = getExtrinsicBalanceChangeAmount(extrinsic, props.accounts)
                const [module, call] = extrinsic.call.name.split('.')

                return [
                  selfSigned ? 'outgoing' : 'incoming',
                  extrinsic.block.timestamp,
                  extrinsic.chain.name,
                  module,
                  call,
                  extrinsic.hash,
                  totalAmountOfInterest.toString(),
                  balanceChangeAmount.toString(),
                  extrinsic.transfers.edges.at(0)?.node.amount.symbol ??
                    extrinsic.rewards.edges.at(0)?.node.amount.symbol,
                  extrinsic.subscanLink?.url,
                ]
              }),
            ]

            const promise = new Promise<void>((resolve, reject) =>
              stringifyCsv(records, (error, output) => {
                if (error !== undefined) {
                  reject(error)
                } else {
                  const csv = 'data:text/csv;charset=utf-8,' + output
                  window.open(encodeURI(csv))
                  resolve()
                }
              })
            ).catch(error => {
              Sentry.captureException(error)
              throw new Error('An error has occurred while generating CSV')
            })

            void toast.promise(promise, {
              loading: 'Generating CSV',
              error: error => error.message,
              success: 'Successfully generated CSV',
            })

            setOpen(false)
          }}
          recordCount={props.extrinsics.length}
        />
      )}
    </>
  )
}

type HistoryResultProps = {
  accounts?: Account[]
  hash?: string
  chain?: string
  module?: string
  timestampGte?: Date
  timestampLte?: Date
  timestampOrder: 'asc' | 'desc'
}

// TODO: lots of repetitive account look up using `encodeAnyAddress`
const HistoryResult = (props: HistoryResultProps) => {
  const accounts = useRecoilValue(selectedAccountsState)

  const [items, setItems] = useState<ExtrinsicNode[]>([])
  const [viewingItem, setViewingItem] = useState<Omit<ExtrinsicDetailsSideSheetProps, 'onRequestDismiss'>>()

  const [hasNextPage, setHasNextPage] = useState(true)

  const generator = useMemo(
    () =>
      (async function* generate() {
        let after: string | undefined
        let hasNextPage = true

        let items: ExtrinsicNode[] = []

        while (hasNextPage) {
          const response = await request(
            import.meta.env.REACT_APP_EX_HISTORY_INDEXER,
            graphql(`
              query extrinsics(
                $after: String
                $first: Int!
                $where: ExtrinsicWhereInput
                $orderBy: ExtrinsicOrderByInput
              ) {
                extrinsics(after: $after, first: $first, where: $where, orderBy: $orderBy) {
                  edges {
                    node {
                      chain {
                        genesisHash
                        name
                        logo
                        subscanUrl
                      }
                      signer
                      hash
                      success
                      block {
                        height
                        timestamp
                      }
                      call {
                        name
                        args
                      }
                      fee {
                        value
                        symbol
                      }
                      transfers {
                        edges {
                          node {
                            debit
                            credit
                            amount {
                              value
                              symbol
                            }
                          }
                        }
                      }
                      rewards {
                        edges {
                          node {
                            debit
                            credit
                            amount {
                              value
                              symbol
                            }
                          }
                        }
                      }
                      subscanLink {
                        id
                        url
                      }
                    }
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }
            `),
            {
              after,
              first: 25,
              where: {
                addressIn: props.accounts?.map(x => x.address),
                chainEq: props.chain,
                hashEq: props.hash,
                moduleEq: props.module,
                timestampGte: props.timestampGte,
                timestampLte: props.timestampLte,
              },
              orderBy:
                props.timestampOrder === 'asc'
                  ? ExtrinsicOrderByInput.TimestampAsc
                  : ExtrinsicOrderByInput.TimestampDesc,
            }
          )

          hasNextPage = response.extrinsics.pageInfo.hasNextPage

          const endCursor = response.extrinsics.pageInfo.endCursor
          if (!isNil(endCursor)) {
            after = endCursor
          }

          items = [...items, ...response.extrinsics.edges.map(edge => edge.node)]

          yield items
        }
      })(),
    [
      props.accounts,
      props.chain,
      props.hash,
      props.module,
      props.timestampGte,
      props.timestampLte,
      props.timestampOrder,
    ]
  )

  const loadMore = useCallback(async () => {
    const next = await generator.next()

    if (!next.done) {
      setItems(next.value)
    } else {
      setHasNextPage(false)
    }
  }, [generator])

  const encodedAddresses = useMemo(() => props.accounts?.map(x => encodeAnyAddress(x.address)) ?? [], [props.accounts])

  if (!hasNextPage && items.length === 0) {
    return (
      <div css={{ textAlign: 'center', marginTop: '5.6rem' }}>
        <Text.H3>No results found.</Text.H3>
        <Text.Body>
          We were not able to find a match.
          <br />
          For help and support please visit our{' '}
          <Text.Noop.A href="https://discord.gg/talisman" target="_blank">
            Discord
          </Text.Noop.A>
        </Text.Body>
      </div>
    )
  }

  return (
    <div>
      <InfiniteScroll
        loadMore={() => {
          void loadMore()
        }}
        hasMore={hasNextPage}
        loader={
          <div
            css={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.25em',
              marginTop: '0.8rem',
            }}
          >
            <Text.BodyLarge as="div" css={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
              Searching the Paraverse
            </Text.BodyLarge>{' '}
            <CircularProgressIndicator size="1em" />
          </div>
        }
      >
        <TransactionList
          data={items}
          renderItem={extrinsic => {
            const [module, call] = extrinsic.call.name.split('.')
            const totalAmountOfInterest = getExtrinsicTotalAmount(extrinsic, props.accounts ?? []).toNumber()

            const signer = Maybe.of(extrinsic.signer).mapOrUndefined(signer => ({
              address: signer,
              name: accounts.find(account => encodeAnyAddress(account.address) === encodeAnyAddress(signer))?.name,
            }))

            const transfer =
              totalAmountOfInterest === 0
                ? undefined
                : {
                    amount: totalAmountOfInterest.toLocaleString(undefined, { maximumFractionDigits: 4 }),
                    symbol:
                      extrinsic.transfers.edges.at(0)?.node.amount.symbol ??
                      extrinsic.rewards.edges.at(0)?.node.amount.symbol ??
                      '',
                  }

            return (
              <TransactionLineItem
                id={extrinsic.subscanLink?.id ?? ''}
                origin={
                  !isNil(extrinsic.signer) && encodedAddresses.includes(encodeAnyAddress(extrinsic.signer))
                    ? 'self'
                    : 'others'
                }
                signer={signer}
                module={module ?? ''}
                call={call ?? ''}
                transfer={transfer}
                fee={
                  isNil(extrinsic.fee)
                    ? undefined
                    : {
                        amount: Number(extrinsic.fee.value).toLocaleString(undefined, { maximumFractionDigits: 4 }),
                        symbol: extrinsic.fee.symbol ?? '',
                      }
                }
                timestamp={new Date(extrinsic.block.timestamp)}
                subscanUrl={extrinsic.subscanLink?.url}
                chain={extrinsic.chain.name ?? undefined}
                chainLogo={extrinsic.chain.logo ?? undefined}
                onClick={() =>
                  setViewingItem({
                    chain: extrinsic.chain.name ?? '',
                    id: extrinsic.subscanLink?.id ?? '',
                    subscanUrl: extrinsic.subscanLink?.url,
                    blockHeight: extrinsic.block.height,
                    hash: extrinsic.hash,
                    module: module ?? '',
                    call: call ?? '',
                    signer,
                    date: new Date(extrinsic.block.timestamp),
                    success: extrinsic.success,
                    arguments: extrinsic.call.args,
                    transfers: extrinsic.transfers.edges
                      .map(x => x.node)
                      .map(({ debit, credit, amount }) => ({
                        debit: {
                          address: debit,
                          name: accounts.find(x => encodeAnyAddress(x.address) === encodeAnyAddress(debit))?.name,
                        },
                        credit: {
                          address: credit,
                          name: accounts.find(x => encodeAnyAddress(x.address) === encodeAnyAddress(credit))?.name,
                        },
                        amount: `${parseFloat(amount.value)} ${amount.symbol ?? ''}`,
                      })),
                    rewards: extrinsic.rewards.edges
                      .map(x => x.node)
                      .map(({ debit, amount }) => ({
                        debit: {
                          address: debit,
                          name: accounts.find(x => encodeAnyAddress(x.address) === encodeAnyAddress(debit))?.name,
                        },
                        amount: `${parseFloat(amount.value)} ${amount.symbol ?? ''}`,
                      })),
                  })
                }
              />
            )
          }}
          keyExtractor={(_, index) => index.toString()}
        />
      </InfiniteScroll>
      {viewingItem && <ExtrinsicDetailsSideSheet {...viewingItem} onRequestDismiss={() => setViewingItem(undefined)} />}
      <ExportHistoryButton extrinsics={items} accounts={props.accounts ?? []} />
    </div>
  )
}

const History = () => {
  const selectedAccounts = useRecoilValue(selectedAccountsState)
  const { chains, modules } = useRecoilValue(filtersState)

  const [search, setSearch] = useState('')
  const [chain, setChain] = useState<string>()
  const [module, setModule] = useState<string>()
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [dateOrder, setDateOrder] = useState<'asc' | 'desc'>('desc')

  const searchAddress = useMemo(
    () => tryParseSubstrateOrEthereumAddress(search, { acceptSubstratePublicKey: false }),
    [search]
  )
  const searchAddressOrHash = useMemo(
    () =>
      searchAddress !== undefined
        ? { accounts: [{ address: searchAddress }] }
        : isHex(search)
        ? { hash: search }
        : { accounts: selectedAccounts },
    [search, searchAddress, selectedAccounts]
  )
  const searchValidationError = useMemo(() => {
    if (search !== '' && searchAddress === undefined && !isHex(search)) {
      return 'Must be valid address or hash'
    }

    return undefined
  }, [search, searchAddress])

  // To invalidate page after query changes
  const key = useMemo(
    () =>
      [
        selectedAccounts.map(x => x.address).join(),
        search,
        chain,
        module,
        fromDate?.getTime(),
        toDate?.getTime(),
        dateOrder,
      ].join(),
    [selectedAccounts, search, chain, module, fromDate, toDate, dateOrder]
  )

  const today = useMemo(() => new Date(), [])

  return (
    <section>
      <TitlePortal>Transaction history</TitlePortal>
      <div css={{ marginBottom: '1.6rem' }}>
        <header
          css={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '2.4rem',
          }}
        ></header>
        <div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '0.8rem',
          }}
        >
          <LabelledInput>
            <TextInput
              placeholder="Search for TX hash or account address"
              value={search}
              onChange={event => setSearch(event.target.value)}
              leadingSupportingText={<TextInput.ErrorLabel>{searchValidationError}</TextInput.ErrorLabel>}
            />
          </LabelledInput>
          <div css={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
            <LabelledInput label="Chain">
              <Select
                placeholder={
                  <>
                    <Globe size="1em" css={{ verticalAlign: '-0.1em' }} /> Chain
                  </>
                }
                value={chain}
                onChange={setChain}
                clearRequired
                detached
              >
                {chains.map(x => (
                  <Select.Option
                    key={x.genesisHash}
                    value={x.genesisHash}
                    leadingIcon={
                      <img
                        alt={x.name ?? undefined}
                        src={x.logo ?? undefined}
                        css={{ width: '1.6rem', height: '1.6rem' }}
                      />
                    }
                    headlineText={x.name}
                  />
                ))}
              </Select>
            </LabelledInput>
            <LabelledInput label="Module">
              <Select
                placeholder={
                  <>
                    <Codepen size="1em" css={{ verticalAlign: '-0.1em' }} /> Module
                  </>
                }
                value={module}
                onChange={setModule}
                clearRequired
                detached
              >
                {modules.map(x => (
                  <Select.Option key={x} value={x} headlineText={x} />
                ))}
              </Select>
            </LabelledInput>
            <div css={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
              <LabelledInput label="From date">
                <DateInput
                  value={fromDate}
                  max={toDate ?? today}
                  onChangeDate={x => setFromDate(Maybe.of(x).mapOrUndefined(startOfDay))}
                  css={{ padding: '1.1rem' }}
                />
              </LabelledInput>
              <LabelledInput label="To date">
                <DateInput
                  value={toDate}
                  max={today}
                  onChangeDate={x => setToDate(Maybe.of(x).mapOrUndefined(endOfDay))}
                  css={{ padding: '1.1rem' }}
                />
              </LabelledInput>
            </div>
            <div>
              <LabelledInput label="Order by">
                <Select value={dateOrder} onChange={setDateOrder}>
                  <Select.Option value="desc" headlineText="Newest" />
                  <Select.Option value="asc" headlineText="Oldest" />
                </Select>
              </LabelledInput>
            </div>
          </div>
        </div>
      </div>
      {searchValidationError === undefined && (
        <HistoryResult
          key={key}
          {...searchAddressOrHash}
          chain={chain}
          module={module}
          timestampGte={fromDate}
          timestampLte={toDate}
          timestampOrder={dateOrder}
        />
      )}
    </section>
  )
}

export default () => (
  <ErrorBoundary>
    <Suspense
      fallback={
        <div css={{ display: 'flex', justifyContent: 'center' }}>
          <TalismanHandLoader />
        </div>
      }
    >
      <History />
    </Suspense>
  </ErrorBoundary>
)
