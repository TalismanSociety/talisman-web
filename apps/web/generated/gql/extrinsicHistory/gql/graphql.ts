/* eslint-disable */
import { type TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /** Big number decimal */
  BigDecimal: { input: any; output: any }
  /** A date-time string in simplified extended ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) */
  DateTime: { input: any; output: any }
  /** A scalar that can represent any JSON value */
  JSON: { input: any; output: any }
}

export type Block = {
  __typename?: 'Block'
  height: Scalars['Int']['output']
  timestamp: Scalars['DateTime']['output']
}

export type Call = {
  __typename?: 'Call'
  args?: Maybe<Scalars['JSON']['output']>
  name: Scalars['String']['output']
}

export type Chain = {
  __typename?: 'Chain'
  genesisHash: Scalars['String']['output']
  logo?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  subscanUrl?: Maybe<Scalars['String']['output']>
}

export type Extrinsic = {
  __typename?: 'Extrinsic'
  block: Block
  call: Call
  chain: Chain
  error?: Maybe<Scalars['JSON']['output']>
  fee?: Maybe<TokenAmount>
  hash: Scalars['String']['output']
  id: Scalars['String']['output']
  rewards: RewardsConnection
  signature?: Maybe<Scalars['JSON']['output']>
  signer?: Maybe<Scalars['String']['output']>
  subscanLink?: Maybe<SubscanLink>
  success: Scalars['Boolean']['output']
  transfers: TransferConnection
}

export type ExtrinsicConnection = {
  __typename?: 'ExtrinsicConnection'
  edges: Array<ExtrinsicEdge>
  pageInfo: PageInfo
}

export type ExtrinsicCsvWhereInput = {
  addressIn: Array<Scalars['String']['input']>
  timestampGte: Scalars['DateTime']['input']
  timestampLte: Scalars['DateTime']['input']
}

export type ExtrinsicEdge = {
  __typename?: 'ExtrinsicEdge'
  cursor: Scalars['String']['output']
  node: Extrinsic
}

export enum ExtrinsicOrderByInput {
  TimestampAsc = 'timestampAsc',
  TimestampDesc = 'timestampDesc',
}

export type ExtrinsicWhereInput = {
  addressIn?: InputMaybe<Array<Scalars['String']['input']>>
  callEq?: InputMaybe<Scalars['String']['input']>
  chainEq?: InputMaybe<Scalars['String']['input']>
  hashEq?: InputMaybe<Scalars['String']['input']>
  moduleEq?: InputMaybe<Scalars['String']['input']>
  timestampGte?: InputMaybe<Scalars['DateTime']['input']>
  timestampLte?: InputMaybe<Scalars['DateTime']['input']>
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor?: Maybe<Scalars['String']['output']>
  hasNextPage: Scalars['Boolean']['output']
  startCursor?: Maybe<Scalars['String']['output']>
}

export type Query = {
  __typename?: 'Query'
  calls: Array<Scalars['String']['output']>
  chains: Array<Chain>
  extrinsicCsv: Array<Array<Scalars['String']['output']>>
  extrinsics: ExtrinsicConnection
  modules: Array<Scalars['String']['output']>
  squidStatus?: Maybe<SquidStatus>
}

export type QueryExtrinsicCsvArgs = {
  where: ExtrinsicCsvWhereInput
}

export type QueryExtrinsicsArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: Scalars['Int']['input']
  orderBy?: ExtrinsicOrderByInput
  where?: InputMaybe<ExtrinsicWhereInput>
}

export type RewardsConnection = {
  __typename?: 'RewardsConnection'
  edges: Array<RewardsEdge>
}

export type RewardsEdge = {
  __typename?: 'RewardsEdge'
  node: Transfer
}

export type SquidStatus = {
  __typename?: 'SquidStatus'
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']['output']>
}

export type SubscanLink = {
  __typename?: 'SubscanLink'
  id: Scalars['String']['output']
  url: Scalars['String']['output']
}

export type TokenAmount = {
  __typename?: 'TokenAmount'
  decimals?: Maybe<Scalars['Int']['output']>
  planck: Scalars['String']['output']
  symbol?: Maybe<Scalars['String']['output']>
  value?: Maybe<Scalars['BigDecimal']['output']>
}

export type Transfer = {
  __typename?: 'Transfer'
  amount: TokenAmount
  credit: Scalars['String']['output']
  debit: Scalars['String']['output']
}

export type TransferConnection = {
  __typename?: 'TransferConnection'
  edges: Array<TransferEdge>
}

export type TransferEdge = {
  __typename?: 'TransferEdge'
  node: Transfer
}

export type ExtrinsicCsvQueryVariables = Exact<{
  address: Scalars['String']['input']
  timestampGte: Scalars['DateTime']['input']
  timestampLte: Scalars['DateTime']['input']
}>

export type ExtrinsicCsvQuery = { __typename?: 'Query'; extrinsicCsv: Array<Array<string>> }

export type FiltersQueryVariables = Exact<{ [key: string]: never }>

export type FiltersQuery = {
  __typename?: 'Query'
  modules: Array<string>
  chains: Array<{ __typename?: 'Chain'; genesisHash: string; name?: string | null; logo?: string | null }>
}

export type ExtrinsicsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  where?: InputMaybe<ExtrinsicWhereInput>
  orderBy?: InputMaybe<ExtrinsicOrderByInput>
}>

export type ExtrinsicsQuery = {
  __typename?: 'Query'
  extrinsics: {
    __typename?: 'ExtrinsicConnection'
    edges: Array<{
      __typename?: 'ExtrinsicEdge'
      node: {
        __typename?: 'Extrinsic'
        signer?: string | null
        hash: string
        success: boolean
        chain: {
          __typename?: 'Chain'
          genesisHash: string
          name?: string | null
          logo?: string | null
          subscanUrl?: string | null
        }
        block: { __typename?: 'Block'; height: number; timestamp: any }
        call: { __typename?: 'Call'; name: string; args?: any | null }
        fee?: { __typename?: 'TokenAmount'; value?: any | null; symbol?: string | null } | null
        transfers: {
          __typename?: 'TransferConnection'
          edges: Array<{
            __typename?: 'TransferEdge'
            node: {
              __typename?: 'Transfer'
              debit: string
              credit: string
              amount: { __typename?: 'TokenAmount'; value?: any | null; symbol?: string | null }
            }
          }>
        }
        rewards: {
          __typename?: 'RewardsConnection'
          edges: Array<{
            __typename?: 'RewardsEdge'
            node: {
              __typename?: 'Transfer'
              debit: string
              credit: string
              amount: { __typename?: 'TokenAmount'; value?: any | null; symbol?: string | null }
            }
          }>
        }
        subscanLink?: { __typename?: 'SubscanLink'; id: string; url: string } | null
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null }
  }
}

export const ExtrinsicCsvDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'extrinsicCsv' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'timestampGte' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'DateTime' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'timestampLte' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'DateTime' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'extrinsicCsv' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'addressIn' },
                      value: {
                        kind: 'ListValue',
                        values: [{ kind: 'Variable', name: { kind: 'Name', value: 'address' } }],
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'timestampGte' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'timestampGte' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'timestampLte' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'timestampLte' } },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ExtrinsicCsvQuery, ExtrinsicCsvQueryVariables>
export const FiltersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'filters' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'modules' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'chains' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'genesisHash' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'logo' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FiltersQuery, FiltersQueryVariables>
export const ExtrinsicsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'extrinsics' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'where' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ExtrinsicWhereInput' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ExtrinsicOrderByInput' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'extrinsics' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'after' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'where' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'chain' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'genesisHash' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'logo' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'subscanUrl' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'signer' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'hash' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'block' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'height' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'call' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'args' } },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fee' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'transfers' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'node' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              { kind: 'Field', name: { kind: 'Name', value: 'debit' } },
                                              { kind: 'Field', name: { kind: 'Name', value: 'credit' } },
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'amount' },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                                                    { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'rewards' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'node' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              { kind: 'Field', name: { kind: 'Name', value: 'debit' } },
                                              { kind: 'Field', name: { kind: 'Name', value: 'credit' } },
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'amount' },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                                                    { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'subscanLink' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ExtrinsicsQuery, ExtrinsicsQueryVariables>
