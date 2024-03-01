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
import { ExtrinsicOrderByInput } from '../../../../generated/gql/extrinsicHistory/gql/graphql'
import { graphql } from './../../../../generated/gql/extrinsicHistory/gql'
import HistoryExportFloatingActionButton from './HistoryExportFloatingActionButton'
import { getExtrinsicTotalAmount, type ExtrinsicNode } from './utils'

type HistoryProps = {
  accounts?: Account[]
  hash?: string
  chain?: string
  module?: string
  timestampGte?: Date
  timestampLte?: Date
  timestampOrder?: 'asc' | 'desc'
  maxCount?: number
  withExportFloatingActionButton?: boolean
}

// TODO: lots of repetitive account look up using `encodeAnyAddress`
const _History = (props: HistoryProps) => {
  const allAccounts = useRecoilValue(accountsState)

  const [items, setItems] = useState<ExtrinsicNode[]>([])
  const [viewingItem, setViewingItem] = useState<Omit<ExtrinsicDetailsSideSheetProps, 'onRequestDismiss'>>()

  const [hasNextPage, setHasNextPage] = useState(true)

  const generator = useMemo(
    () =>
      (async function* generate() {
        if ((props.accounts?.length ?? 0) === 0 && props.hash === undefined) {
          yield []
          return
        }

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
              first: props.maxCount ?? 25,
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

          // Don't fetch next page if maxCount is specified
          hasNextPage = props.maxCount === undefined && response.extrinsics.pageInfo.hasNextPage

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
      props.maxCount,
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
          Connect a valid address to load its transaction history.
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
              name: allAccounts.find(account => encodeAnyAddress(account.address) === encodeAnyAddress(signer))?.name,
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
                          name: allAccounts.find(x => encodeAnyAddress(x.address) === encodeAnyAddress(debit))?.name,
                        },
                        credit: {
                          address: credit,
                          name: allAccounts.find(x => encodeAnyAddress(x.address) === encodeAnyAddress(credit))?.name,
                        },
                        amount: `${parseFloat(amount.value)} ${amount.symbol ?? ''}`,
                      })),
                    rewards: extrinsic.rewards.edges
                      .map(x => x.node)
                      .map(({ debit, amount }) => ({
                        debit: {
                          address: debit,
                          name: allAccounts.find(x => encodeAnyAddress(x.address) === encodeAnyAddress(debit))?.name,
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
      {props.withExportFloatingActionButton && (
        <HistoryExportFloatingActionButton accounts={allAccounts} extrinsics={items} />
      )}
    </div>
  )
}

const History = (props: HistoryProps) => {
  // To invalidate component after query changes
  const key = useMemo(() => JSON.stringify(props), [props])

  return <_History key={key} {...props} />
}

export default History

export const SelectedAccountsHistory = (props: Omit<HistoryProps, 'accounts'>) => {
  const accountsToSearch = useRecoilValue(selectedAccountsState)

  return <History {...props} accounts={accountsToSearch} />
}
