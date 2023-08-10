import TransactionLineItem, {
  TransactionList,
  type TransactionLineItemProps,
} from '@components/recipes/TransactionLineItem'
import { accountsState, selectedAccountsState } from '@domains/accounts'
import { ArrowRight, CheckCircle } from '@talismn/icons'
import { DescriptionList, SideSheet, Surface, Text, SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, Identicon } from '@talismn/ui'
import { encodeAnyAddress } from '@talismn/util'
import { shortenAddress } from '@util/format'
import { Maybe } from '@util/monads'
import request from 'graphql-request'
import { isNil } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { ObjectView } from 'react-object-view'
import { useRecoilValue } from 'recoil'
import { graphql } from '../../generated/gql/extrinsicHistory/gql'

const History = () => {
  const accounts = useRecoilValue(accountsState)
  const selectedAccounts = useRecoilValue(selectedAccountsState)
  const selectedAccountAddresses = useMemo(
    () => selectedAccounts.map(x => encodeAnyAddress(x.address)),
    [selectedAccounts]
  )

  const [items, setItems] = useState<TransactionLineItemProps[]>([])

  const generatorKey = useMemo(
    () =>
      selectedAccounts
        .map(x => x.address)
        .sort()
        .join(),
    [selectedAccounts]
  )

  const generator = useMemo(
    () =>
      (async function* generate() {
        let after: string | undefined
        let hasNextPage = true

        while (hasNextPage) {
          const response = await request(
            'http://localhost:4350/graphql',
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
            { after, first: 25, addresses: selectedAccounts.map(x => x.address) }
          )

          hasNextPage = response.extrinsics.pageInfo.hasNextPage

          const endCursor = response.extrinsics.pageInfo.endCursor
          if (!isNil(endCursor)) {
            after = endCursor
          }

          const newItems = response.extrinsics.edges
            .map(edge => edge.node)
            .map(extrinsic => {
              const [module, call] = extrinsic.call.name.split('.')
              const totalAmountOfInterest = [...extrinsic.transfers.edges, ...extrinsic.rewards.edges]
                .map(x => x.node)
                .filter(
                  x =>
                    selectedAccountAddresses.includes(encodeAnyAddress(x.debit)) ||
                    (x.credit !== 'reserve' && selectedAccountAddresses.includes(encodeAnyAddress(x.credit)))
                )
                .reduce((prev, curr) => prev + parseFloat(curr.amount.value), 0)

              const transfer =
                totalAmountOfInterest === 0
                  ? undefined
                  : {
                      amount: totalAmountOfInterest.toLocaleString(undefined, { maximumFractionDigits: 4 }),
                      symbol:
                        extrinsic.transfers.edges.at(0)?.node.amount.symbol ??
                        extrinsic.rewards.edges.at(0)?.node.amount.symbol,
                    }

              return {
                id: extrinsic.subscanLink?.id,
                signer: Maybe.of(extrinsic.signer).mapOrUndefined(signer => ({
                  address: signer,
                  name: accounts.find(account => encodeAnyAddress(account.address) === encodeAnyAddress(signer))?.name,
                })),
                module,
                call,
                transfer,
                fee: isNil(extrinsic.fee)
                  ? undefined
                  : {
                      amount: Number(extrinsic.fee.value).toLocaleString(undefined, { maximumFractionDigits: 4 }),
                      symbol: extrinsic.fee.symbol,
                    },
                timestamp: new Date(extrinsic.block.timestamp),
                subscanUrl: extrinsic.subscanLink?.url,
                chainLogo: extrinsic.chain.logo,
              }
            })

          setItems(items => [...items, ...newItems])

          yield
        }
      })(),
    [generatorKey]
  )

  const sortedItems = useMemo(() => items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()), [items])

  useEffect(() => {
    console.log('fetch')
    setItems([])
    void (async () => {
      await generator.next()
      await generator.next()
      await generator.next()
    })()
  }, [generator])

  console.log(items)

  return (
    <section>
      <header>
        <Text.H2>Transaction history</Text.H2>
      </header>
      <TransactionList
        data={sortedItems}
        renderItem={props => <TransactionLineItem {...props} />}
        keyExtractor={(_, index) => index.toString()}
      />
      <SideSheet open={false} title="Extrinsic details">
        <DescriptionList>
          <DescriptionList.Description>
            <DescriptionList.Term>Extrinsic ID</DescriptionList.Term>
            <DescriptionList.Details>16682150-7</DescriptionList.Details>
          </DescriptionList.Description>
          <DescriptionList.Description>
            <DescriptionList.Term>Block</DescriptionList.Term>
            <DescriptionList.Details>16682150</DescriptionList.Details>
          </DescriptionList.Description>
          <DescriptionList.Description>
            <DescriptionList.Term>Extrinsic hash</DescriptionList.Term>
            <DescriptionList.Details>
              {shortenAddress('0xbae40a865e1b719d7c0e076c935de340c4b9759fbb1362415e87feb33353fcd2')}
            </DescriptionList.Details>
          </DescriptionList.Description>
          <DescriptionList.Description>
            <DescriptionList.Term>Time</DescriptionList.Term>
            <DescriptionList.Details>6 days 15 hrs ago</DescriptionList.Details>
          </DescriptionList.Description>
          <DescriptionList.Description>
            <DescriptionList.Term>Result</DescriptionList.Term>
            <DescriptionList.Details>
              <CheckCircle size="1em" />
            </DescriptionList.Details>
          </DescriptionList.Description>
        </DescriptionList>
        <section css={{ marginTop: '4.8rem' }}>
          <header>
            <Text.H4 alpha="high" css={{ marginBottom: '1.6rem' }}>
              Transfers
            </Text.H4>
          </header>
          <table
            css={{
              'width': '100%',
              '*:is(th,td)': { textAlign: 'start' },
              '*:is(th,td):last-child': { textAlign: 'end' },
            }}
          >
            <thead>
              <tr>
                <Text.BodySmall as="th">From</Text.BodySmall>
                <Text.BodySmall as="th">To</Text.BodySmall>
                <Text.BodySmall as="th">Amount</Text.BodySmall>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Text.Body as="td" alpha="high">
                  <Identicon value="foo" size="1em" /> 13Kcw...ZQ4K
                </Text.Body>
                <Text.Body as="td" alpha="high">
                  <Identicon value="foo" size="1em" /> 13Kcw...ZQ4K
                </Text.Body>
                <Text.Body as="td" alpha="high">
                  1 DOT
                </Text.Body>
              </tr>
            </tbody>
          </table>
        </section>
        <section css={{ marginTop: '4.8rem' }}>
          <header>
            <Text.H4 alpha="high" css={{ marginBottom: '1.6rem' }}>
              Rewards
            </Text.H4>
          </header>
          <table
            css={{
              'width': '100%',
              '*:is(th,td)': { textAlign: 'start' },
              '*:is(th,td):last-child': { textAlign: 'end' },
            }}
          >
            <thead>
              <tr>
                <Text.BodySmall as="th">For</Text.BodySmall>
                <Text.BodySmall as="th">Amount</Text.BodySmall>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Text.Body as="td" alpha="high">
                  <Identicon value="foo" size="1em" /> 13Kcw...ZQ4K
                </Text.Body>
                <Text.Body as="td" alpha="high">
                  1 DOT
                </Text.Body>
              </tr>
            </tbody>
          </table>
        </section>
        <Surface
          css={{ marginTop: '4.8rem', borderRadius: '1.6rem', padding: '1.6rem', ol: { margin: '0 !important' } }}
        >
          <Text.Body as="header" alpha="high" css={{ marginBottom: '1.6rem' }}>
            Parameters
          </Text.Body>
          <Surface
            css={{
              borderRadius: '0.8rem',
              padding: '1rem',
              overflow: 'auto',
              [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { maxWidth: '40rem' },
            }}
          >
            <ObjectView
              data={{
                dest: '0x20a7ba7956bfd969c6c8b945ebfede70fa58ba7c2f9fd4ac6b4e3c7255ea1c52',
                value: '116358000000000000',
              }}
              palette={{ base00: 'transparent' }}
              options={{ expandLevel: 10 }}
            />
          </Surface>
        </Surface>
      </SideSheet>
    </section>
  )
}

export default History
