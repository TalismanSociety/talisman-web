import {
  ExtrinsicDetailsSideSheet,
  type ExtrinsicDetailsSideSheetProps,
} from '@components/recipes/ExtrinsicDetailsSideSheet'
import TransactionLineItem, { TransactionList } from '@components/recipes/TransactionLineItem'
import { accountsState, selectedAccountsState, type Account } from '@domains/accounts'
import { Button, CircularProgressIndicator, DateInput, Select, Text, TextInput } from '@talismn/ui'
import { encodeAnyAddress } from '@talismn/util'
import { tryParseSubstrateOrEthereumAddress } from '@util/addressValidation'
import { Maybe } from '@util/monads'
import request from 'graphql-request'
import { isNil } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { selector, useRecoilValue } from 'recoil'
import { graphql } from '../../generated/gql/extrinsicHistory/gql'
import type { ExtrinsicsQuery } from '../../generated/gql/extrinsicHistory/gql/graphql'
import ExportTxHistoryWidget from '@components/widgets/ExportTxHistoryWidget'

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

type HistoryResultProps = {
  accounts?: Account[]
  hash?: string
  chain?: string
  module?: string
  timestampLte?: Date
}

// TODO: lots of repetitive account look up using `encodeAnyAddress`
const HistoryResult = (props: HistoryResultProps) => {
  type ExtrinsicNode = ExtrinsicsQuery['extrinsics']['edges'][number]['node']

  const accounts = useRecoilValue(accountsState)

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
              query extrinsics($after: String, $first: Int!, $where: ExtrinsicWhereInput) {
                extrinsics(after: $after, first: $first, where: $where) {
                  edges {
                    node {
                      chain {
                        genesisHash
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
              first: 10,
              where: {
                addressIn: props.accounts?.map(x => x.address),
                chainEq: props.chain,
                hashEq: props.hash,
                moduleEq: props.module,
                timestampLte: props.timestampLte,
              },
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
    [props.accounts, props.chain, props.timestampLte, props.hash, props.module]
  )

  const loadMore = useCallback(async () => {
    const next = await generator.next()

    if (!next.done) {
      setItems(next.value)
    } else {
      setHasNextPage(false)
    }
  }, [generator])

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
            const encodedAddresses = props.accounts?.map(x => encodeAnyAddress(x.address)) ?? []
            const totalAmountOfInterest = [...extrinsic.transfers.edges, ...extrinsic.rewards.edges]
              .map(x => x.node)
              .filter(
                x =>
                  encodedAddresses.includes(encodeAnyAddress(x.debit)) ||
                  (x.credit !== 'reserve' && encodedAddresses.includes(encodeAnyAddress(x.credit)))
              )
              .reduce((prev, curr) => prev + parseFloat(curr.amount.value), 0)

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
                chainLogo={extrinsic.chain.logo ?? undefined}
                onClick={() =>
                  setViewingItem({
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
    </div>
  )
}

const History = () => {
  const selectedAccounts = useRecoilValue(selectedAccountsState)
  const { chains, modules } = useRecoilValue(filtersState)

  const [search, setSearch] = useState('')
  const [chain, setChain] = useState<string>()
  const [module, setModule] = useState<string>()
  const [date, setDate] = useState<Date>()

  const searchAddress = useMemo(() => tryParseSubstrateOrEthereumAddress(search), [search])
  const searchAddressOrHash = useMemo(
    () =>
      searchAddress !== undefined
        ? { accounts: [{ address: searchAddress }] }
        : search.startsWith('0x')
        ? { hash: search }
        : { accounts: selectedAccounts },
    [search, searchAddress, selectedAccounts]
  )

  // To invalidate page after query changes
  const key = useMemo(
    () => [selectedAccounts.map(x => x.address).join(), search, chain, module].join(),
    [chain, module, search, selectedAccounts]
  )

  return (
    <section>
      <header
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem',
          marginBottom: '2.4rem',
        }}
      >
        <Text.H2 css={{ marginBottom: 0 }}>Transaction history</Text.H2>
        <ExportTxHistoryWidget>
          {({ onToggleOpen }) => (
            <Button variant="surface" onClick={onToggleOpen}>
              Export
            </Button>
          )}
        </ExportTxHistoryWidget>
      </header>
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem',
        }}
      >
        <TextInput
          placeholder="Search for TX hash or account address"
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
        <div css={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
          <DateInput
            value={date}
            onChange={event => setDate(new Date(event.target.value))}
            // TODO: better to sync size between all input component
            css={{ padding: '1.1rem' }}
          />
          <Select placeholder="Chain" value={chain} onChange={setChain} clearRequired>
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
          <Select placeholder="Module" value={module} onChange={setModule} clearRequired>
            {modules.map(x => (
              <Select.Option key={x} value={x} headlineText={x} />
            ))}
          </Select>
        </div>
      </div>
      <HistoryResult key={key} {...searchAddressOrHash} chain={chain} module={module} timestampLte={date} />
    </section>
  )
}

export default History
