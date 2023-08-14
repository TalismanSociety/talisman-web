import {
  ExtrinsicDetailsSideSheet,
  type ExtrinsicDetailsSideSheetProps,
} from '@components/recipes/ExtrinsicDetailsSideSheet'
import TransactionLineItem, { TransactionList } from '@components/recipes/TransactionLineItem'
import { accountsState, selectedAccountsState, type Account } from '@domains/accounts'
import { CircularProgressIndicator, Text } from '@talismn/ui'
import { encodeAnyAddress } from '@talismn/util'
import { Maybe } from '@util/monads'
import request from 'graphql-request'
import { isNil } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useRecoilValue } from 'recoil'
import { graphql } from '../../generated/gql/extrinsicHistory/gql'
import type { ExtrinsicsQuery } from '../../generated/gql/extrinsicHistory/gql/graphql'

type HistoryResultProps = {
  accounts: Account[]
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
              query extrinsics($after: String, $first: Int!, $addresses: [String!]!) {
                extrinsics(after: $after, first: $first, where: { addressIn: $addresses }) {
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
            { after, first: 10, addresses: props.accounts.map(x => x.address) }
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
    [props.accounts]
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
            const encodedAddresses = props.accounts.map(x => encodeAnyAddress(x.address))
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

  // To invalidate page after query changes
  const key = useMemo(() => selectedAccounts.map(x => x.address).join(), [selectedAccounts])

  return (
    <section>
      <header>
        <Text.H2>Transaction history</Text.H2>
      </header>
      <HistoryResult key={key} accounts={selectedAccounts} />
    </section>
  )
}

export default History
