/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
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
  /** A floating point number that requires more precision than IEEE 754 binary 64 */
  BigFloat: { input: any; output: any }
  /**
   * A signed eight-byte integer. The upper big integer values are greater than the
   * max value for a JavaScript number. Therefore all big integers will be output as
   * strings and not numbers.
   */
  BigInt: { input: any; output: any }
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: { input: any; output: any }
  /** The day, does not include a time. */
  Date: { input: any; output: any }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any }
}

export type Account = Node & {
  __typename?: 'Account'
  /** Reads and enables pagination through a set of `Address`. */
  addresses: AddressesConnection
  /** Id is a base58 encoded public key */
  id: Scalars['String']['output']
  /** Reads and enables pagination through a set of `Network`. */
  networksByAddressAccountIdAndNetworkId: AccountNetworksByAddressAccountIdAndNetworkIdManyToManyConnection
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
}

export type AccountAddressesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Addresses_Distinct_Enum>>>
  filter?: InputMaybe<AddressFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AddressesOrderBy>>
}

export type AccountNetworksByAddressAccountIdAndNetworkIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Networks_Distinct_Enum>>>
  filter?: InputMaybe<NetworkFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NetworksOrderBy>>
}

export type AccountAggregates = {
  __typename?: 'AccountAggregates'
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<AccountDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
}

export type AccountDistinctCountAggregates = {
  __typename?: 'AccountDistinctCountAggregates'
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `Account` object types. All fields are combined with a logical ‘and.’ */
export type AccountFilter = {
  /** Filter by the object’s `addresses` relation. */
  addresses?: InputMaybe<AccountToManyAddressFilter>
  /** Some related `addresses` exist. */
  addressesExist?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AccountFilter>>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<AccountFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AccountFilter>>
}

/** A connection to a list of `Network` values, with data from `Address`. */
export type AccountNetworksByAddressAccountIdAndNetworkIdManyToManyConnection = {
  __typename?: 'AccountNetworksByAddressAccountIdAndNetworkIdManyToManyConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<NetworkAggregates>
  /** A list of edges which contains the `Network`, info from the `Address`, and the cursor to aid in pagination. */
  edges: Array<AccountNetworksByAddressAccountIdAndNetworkIdManyToManyEdge>
  /** A list of `Network` objects. */
  nodes: Array<Maybe<Network>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Network` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Network` edge in the connection, with data from `Address`. */
export type AccountNetworksByAddressAccountIdAndNetworkIdManyToManyEdge = {
  __typename?: 'AccountNetworksByAddressAccountIdAndNetworkIdManyToManyEdge'
  /** Reads and enables pagination through a set of `Address`. */
  addresses: AddressesConnection
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Network` at the end of the edge. */
  node?: Maybe<Network>
}

/** A `Network` edge in the connection, with data from `Address`. */
export type AccountNetworksByAddressAccountIdAndNetworkIdManyToManyEdgeAddressesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Addresses_Distinct_Enum>>>
  filter?: InputMaybe<AddressFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AddressesOrderBy>>
}

/** A filter to be used against many `Address` object types. All fields are combined with a logical ‘and.’ */
export type AccountToManyAddressFilter = {
  /** Aggregates across related `Address` match the filter criteria. */
  aggregates?: InputMaybe<AddressAggregatesFilter>
  /** Every related `Address` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<AddressFilter>
  /** No related `Address` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<AddressFilter>
  /** Some related `Address` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<AddressFilter>
}

/** A connection to a list of `Account` values. */
export type AccountsConnection = {
  __typename?: 'AccountsConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>
  /** A list of edges which contains the `Account` and cursor to aid in pagination. */
  edges: Array<AccountsEdge>
  /** A list of `Account` objects. */
  nodes: Array<Maybe<Account>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Account` edge in the connection. */
export type AccountsEdge = {
  __typename?: 'AccountsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>
}

/** Methods to use when ordering `Account`. */
export enum AccountsOrderBy {
  AddressesAverageAccountIdAsc = 'ADDRESSES_AVERAGE_ACCOUNT_ID_ASC',
  AddressesAverageAccountIdDesc = 'ADDRESSES_AVERAGE_ACCOUNT_ID_DESC',
  AddressesAverageIdAsc = 'ADDRESSES_AVERAGE_ID_ASC',
  AddressesAverageIdDesc = 'ADDRESSES_AVERAGE_ID_DESC',
  AddressesAverageNetworkIdAsc = 'ADDRESSES_AVERAGE_NETWORK_ID_ASC',
  AddressesAverageNetworkIdDesc = 'ADDRESSES_AVERAGE_NETWORK_ID_DESC',
  AddressesCountAsc = 'ADDRESSES_COUNT_ASC',
  AddressesCountDesc = 'ADDRESSES_COUNT_DESC',
  AddressesDistinctCountAccountIdAsc = 'ADDRESSES_DISTINCT_COUNT_ACCOUNT_ID_ASC',
  AddressesDistinctCountAccountIdDesc = 'ADDRESSES_DISTINCT_COUNT_ACCOUNT_ID_DESC',
  AddressesDistinctCountIdAsc = 'ADDRESSES_DISTINCT_COUNT_ID_ASC',
  AddressesDistinctCountIdDesc = 'ADDRESSES_DISTINCT_COUNT_ID_DESC',
  AddressesDistinctCountNetworkIdAsc = 'ADDRESSES_DISTINCT_COUNT_NETWORK_ID_ASC',
  AddressesDistinctCountNetworkIdDesc = 'ADDRESSES_DISTINCT_COUNT_NETWORK_ID_DESC',
  AddressesMaxAccountIdAsc = 'ADDRESSES_MAX_ACCOUNT_ID_ASC',
  AddressesMaxAccountIdDesc = 'ADDRESSES_MAX_ACCOUNT_ID_DESC',
  AddressesMaxIdAsc = 'ADDRESSES_MAX_ID_ASC',
  AddressesMaxIdDesc = 'ADDRESSES_MAX_ID_DESC',
  AddressesMaxNetworkIdAsc = 'ADDRESSES_MAX_NETWORK_ID_ASC',
  AddressesMaxNetworkIdDesc = 'ADDRESSES_MAX_NETWORK_ID_DESC',
  AddressesMinAccountIdAsc = 'ADDRESSES_MIN_ACCOUNT_ID_ASC',
  AddressesMinAccountIdDesc = 'ADDRESSES_MIN_ACCOUNT_ID_DESC',
  AddressesMinIdAsc = 'ADDRESSES_MIN_ID_ASC',
  AddressesMinIdDesc = 'ADDRESSES_MIN_ID_DESC',
  AddressesMinNetworkIdAsc = 'ADDRESSES_MIN_NETWORK_ID_ASC',
  AddressesMinNetworkIdDesc = 'ADDRESSES_MIN_NETWORK_ID_DESC',
  AddressesStddevPopulationAccountIdAsc = 'ADDRESSES_STDDEV_POPULATION_ACCOUNT_ID_ASC',
  AddressesStddevPopulationAccountIdDesc = 'ADDRESSES_STDDEV_POPULATION_ACCOUNT_ID_DESC',
  AddressesStddevPopulationIdAsc = 'ADDRESSES_STDDEV_POPULATION_ID_ASC',
  AddressesStddevPopulationIdDesc = 'ADDRESSES_STDDEV_POPULATION_ID_DESC',
  AddressesStddevPopulationNetworkIdAsc = 'ADDRESSES_STDDEV_POPULATION_NETWORK_ID_ASC',
  AddressesStddevPopulationNetworkIdDesc = 'ADDRESSES_STDDEV_POPULATION_NETWORK_ID_DESC',
  AddressesStddevSampleAccountIdAsc = 'ADDRESSES_STDDEV_SAMPLE_ACCOUNT_ID_ASC',
  AddressesStddevSampleAccountIdDesc = 'ADDRESSES_STDDEV_SAMPLE_ACCOUNT_ID_DESC',
  AddressesStddevSampleIdAsc = 'ADDRESSES_STDDEV_SAMPLE_ID_ASC',
  AddressesStddevSampleIdDesc = 'ADDRESSES_STDDEV_SAMPLE_ID_DESC',
  AddressesStddevSampleNetworkIdAsc = 'ADDRESSES_STDDEV_SAMPLE_NETWORK_ID_ASC',
  AddressesStddevSampleNetworkIdDesc = 'ADDRESSES_STDDEV_SAMPLE_NETWORK_ID_DESC',
  AddressesSumAccountIdAsc = 'ADDRESSES_SUM_ACCOUNT_ID_ASC',
  AddressesSumAccountIdDesc = 'ADDRESSES_SUM_ACCOUNT_ID_DESC',
  AddressesSumIdAsc = 'ADDRESSES_SUM_ID_ASC',
  AddressesSumIdDesc = 'ADDRESSES_SUM_ID_DESC',
  AddressesSumNetworkIdAsc = 'ADDRESSES_SUM_NETWORK_ID_ASC',
  AddressesSumNetworkIdDesc = 'ADDRESSES_SUM_NETWORK_ID_DESC',
  AddressesVariancePopulationAccountIdAsc = 'ADDRESSES_VARIANCE_POPULATION_ACCOUNT_ID_ASC',
  AddressesVariancePopulationAccountIdDesc = 'ADDRESSES_VARIANCE_POPULATION_ACCOUNT_ID_DESC',
  AddressesVariancePopulationIdAsc = 'ADDRESSES_VARIANCE_POPULATION_ID_ASC',
  AddressesVariancePopulationIdDesc = 'ADDRESSES_VARIANCE_POPULATION_ID_DESC',
  AddressesVariancePopulationNetworkIdAsc = 'ADDRESSES_VARIANCE_POPULATION_NETWORK_ID_ASC',
  AddressesVariancePopulationNetworkIdDesc = 'ADDRESSES_VARIANCE_POPULATION_NETWORK_ID_DESC',
  AddressesVarianceSampleAccountIdAsc = 'ADDRESSES_VARIANCE_SAMPLE_ACCOUNT_ID_ASC',
  AddressesVarianceSampleAccountIdDesc = 'ADDRESSES_VARIANCE_SAMPLE_ACCOUNT_ID_DESC',
  AddressesVarianceSampleIdAsc = 'ADDRESSES_VARIANCE_SAMPLE_ID_ASC',
  AddressesVarianceSampleIdDesc = 'ADDRESSES_VARIANCE_SAMPLE_ID_DESC',
  AddressesVarianceSampleNetworkIdAsc = 'ADDRESSES_VARIANCE_SAMPLE_NETWORK_ID_ASC',
  AddressesVarianceSampleNetworkIdDesc = 'ADDRESSES_VARIANCE_SAMPLE_NETWORK_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
}

export type Address = Node & {
  __typename?: 'Address'
  /** Reads a single `Account` that is related to this `Address`. */
  account?: Maybe<Account>
  accountId?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  /** Reads a single `Network` that is related to this `Address`. */
  network?: Maybe<Network>
  networkId: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
}

export type AddressAggregates = {
  __typename?: 'AddressAggregates'
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<AddressDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
}

/** A filter to be used against aggregates of `Address` object types. */
export type AddressAggregatesFilter = {
  /** Distinct count aggregate over matching `Address` objects. */
  distinctCount?: InputMaybe<AddressDistinctCountAggregateFilter>
  /** A filter that must pass for the relevant `Address` object to be included within the aggregate. */
  filter?: InputMaybe<AddressFilter>
}

export type AddressDistinctCountAggregateFilter = {
  accountId?: InputMaybe<BigIntFilter>
  id?: InputMaybe<BigIntFilter>
  networkId?: InputMaybe<BigIntFilter>
}

export type AddressDistinctCountAggregates = {
  __typename?: 'AddressDistinctCountAggregates'
  /** Distinct count of accountId across the matching connection */
  accountId?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of networkId across the matching connection */
  networkId?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `Address` object types. All fields are combined with a logical ‘and.’ */
export type AddressFilter = {
  /** Filter by the object’s `account` relation. */
  account?: InputMaybe<AccountFilter>
  /** A related `account` exists. */
  accountExists?: InputMaybe<Scalars['Boolean']['input']>
  /** Filter by the object’s `accountId` field. */
  accountId?: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AddressFilter>>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Filter by the object’s `network` relation. */
  network?: InputMaybe<NetworkFilter>
  /** Filter by the object’s `networkId` field. */
  networkId?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<AddressFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AddressFilter>>
}

/** A connection to a list of `Address` values. */
export type AddressesConnection = {
  __typename?: 'AddressesConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AddressAggregates>
  /** A list of edges which contains the `Address` and cursor to aid in pagination. */
  edges: Array<AddressesEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<AddressAggregates>>
  /** A list of `Address` objects. */
  nodes: Array<Maybe<Address>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Address` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `Address` values. */
export type AddressesConnectionGroupedAggregatesArgs = {
  groupBy: Array<AddressesGroupBy>
  having?: InputMaybe<AddressesHavingInput>
}

/** A `Address` edge in the connection. */
export type AddressesEdge = {
  __typename?: 'AddressesEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Address` at the end of the edge. */
  node?: Maybe<Address>
}

/** Grouping methods for `Address` for usage during aggregation. */
export enum AddressesGroupBy {
  AccountId = 'ACCOUNT_ID',
  NetworkId = 'NETWORK_ID',
}

/** Conditions for `Address` aggregates. */
export type AddressesHavingInput = {
  AND?: InputMaybe<Array<AddressesHavingInput>>
  OR?: InputMaybe<Array<AddressesHavingInput>>
}

/** Methods to use when ordering `Address`. */
export enum AddressesOrderBy {
  AccountIdAsc = 'ACCOUNT_ID_ASC',
  AccountIdDesc = 'ACCOUNT_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  NetworkIdAsc = 'NETWORK_ID_ASC',
  NetworkIdDesc = 'NETWORK_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
}

/** A filter to be used against BigFloat fields. All fields are combined with a logical ‘and.’ */
export type BigFloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigFloat']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigFloat']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigFloat']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigFloat']['input']>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigFloat']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigFloat']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigFloat']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigFloat']['input']>>
}

/** A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’ */
export type BigIntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigInt']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigInt']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigInt']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigInt']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigInt']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigInt']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigInt']['input']>>
}

export type BlockedAddress = Node & {
  __typename?: 'BlockedAddress'
  /** Addresses that does not implement desired interfaces */
  id: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
}

export type BlockedAddressAggregates = {
  __typename?: 'BlockedAddressAggregates'
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<BlockedAddressDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
}

export type BlockedAddressDistinctCountAggregates = {
  __typename?: 'BlockedAddressDistinctCountAggregates'
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `BlockedAddress` object types. All fields are combined with a logical ‘and.’ */
export type BlockedAddressFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<BlockedAddressFilter>>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<BlockedAddressFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<BlockedAddressFilter>>
}

/** A connection to a list of `BlockedAddress` values. */
export type BlockedAddressesConnection = {
  __typename?: 'BlockedAddressesConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<BlockedAddressAggregates>
  /** A list of edges which contains the `BlockedAddress` and cursor to aid in pagination. */
  edges: Array<BlockedAddressesEdge>
  /** A list of `BlockedAddress` objects. */
  nodes: Array<Maybe<BlockedAddress>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `BlockedAddress` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `BlockedAddress` edge in the connection. */
export type BlockedAddressesEdge = {
  __typename?: 'BlockedAddressesEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `BlockedAddress` at the end of the edge. */
  node?: Maybe<BlockedAddress>
}

/** Methods to use when ordering `BlockedAddress`. */
export enum BlockedAddressesOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
}

export type Collection = Node & {
  __typename?: 'Collection'
  contractAddress: Scalars['String']['output']
  contractType: ContractType
  createdBlock: Scalars['BigFloat']['output']
  createdTimestamp: Scalars['BigFloat']['output']
  creatorAddress: Scalars['String']['output']
  id: Scalars['String']['output']
  /** Reads and enables pagination through a set of `Metadatum`. */
  metadataByNftCollectionIdAndMetadataId: CollectionMetadataByNftCollectionIdAndMetadataIdManyToManyConnection
  name?: Maybe<Scalars['String']['output']>
  /** Reads a single `Network` that is related to this `Collection`. */
  network?: Maybe<Network>
  networkId: Scalars['String']['output']
  /** Reads and enables pagination through a set of `Nft`. */
  nfts: NftsConnection
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  symbol?: Maybe<Scalars['String']['output']>
  totalSupply: Scalars['BigFloat']['output']
}

export type CollectionMetadataByNftCollectionIdAndMetadataIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Metadata_Distinct_Enum>>>
  filter?: InputMaybe<MetadatumFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<MetadataOrderBy>>
}

export type CollectionNftsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Nfts_Distinct_Enum>>>
  filter?: InputMaybe<NftFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NftsOrderBy>>
}

export type CollectionAggregates = {
  __typename?: 'CollectionAggregates'
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<CollectionAverageAggregates>
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<CollectionDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<CollectionMaxAggregates>
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<CollectionMinAggregates>
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<CollectionStddevPopulationAggregates>
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<CollectionStddevSampleAggregates>
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<CollectionSumAggregates>
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<CollectionVariancePopulationAggregates>
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<CollectionVarianceSampleAggregates>
}

/** A filter to be used against aggregates of `Collection` object types. */
export type CollectionAggregatesFilter = {
  /** Mean average aggregate over matching `Collection` objects. */
  average?: InputMaybe<CollectionAverageAggregateFilter>
  /** Distinct count aggregate over matching `Collection` objects. */
  distinctCount?: InputMaybe<CollectionDistinctCountAggregateFilter>
  /** A filter that must pass for the relevant `Collection` object to be included within the aggregate. */
  filter?: InputMaybe<CollectionFilter>
  /** Maximum aggregate over matching `Collection` objects. */
  max?: InputMaybe<CollectionMaxAggregateFilter>
  /** Minimum aggregate over matching `Collection` objects. */
  min?: InputMaybe<CollectionMinAggregateFilter>
  /** Population standard deviation aggregate over matching `Collection` objects. */
  stddevPopulation?: InputMaybe<CollectionStddevPopulationAggregateFilter>
  /** Sample standard deviation aggregate over matching `Collection` objects. */
  stddevSample?: InputMaybe<CollectionStddevSampleAggregateFilter>
  /** Sum aggregate over matching `Collection` objects. */
  sum?: InputMaybe<CollectionSumAggregateFilter>
  /** Population variance aggregate over matching `Collection` objects. */
  variancePopulation?: InputMaybe<CollectionVariancePopulationAggregateFilter>
  /** Sample variance aggregate over matching `Collection` objects. */
  varianceSample?: InputMaybe<CollectionVarianceSampleAggregateFilter>
}

export type CollectionAverageAggregateFilter = {
  createdBlock?: InputMaybe<BigFloatFilter>
  createdTimestamp?: InputMaybe<BigFloatFilter>
  totalSupply?: InputMaybe<BigFloatFilter>
}

export type CollectionAverageAggregates = {
  __typename?: 'CollectionAverageAggregates'
  /** Mean average of createdBlock across the matching connection */
  createdBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of createdTimestamp across the matching connection */
  createdTimestamp?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>
}

export type CollectionDistinctCountAggregateFilter = {
  contractAddress?: InputMaybe<BigIntFilter>
  contractType?: InputMaybe<BigIntFilter>
  createdBlock?: InputMaybe<BigIntFilter>
  createdTimestamp?: InputMaybe<BigIntFilter>
  creatorAddress?: InputMaybe<BigIntFilter>
  id?: InputMaybe<BigIntFilter>
  name?: InputMaybe<BigIntFilter>
  networkId?: InputMaybe<BigIntFilter>
  symbol?: InputMaybe<BigIntFilter>
  totalSupply?: InputMaybe<BigIntFilter>
}

export type CollectionDistinctCountAggregates = {
  __typename?: 'CollectionDistinctCountAggregates'
  /** Distinct count of contractAddress across the matching connection */
  contractAddress?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of contractType across the matching connection */
  contractType?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of createdBlock across the matching connection */
  createdBlock?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of createdTimestamp across the matching connection */
  createdTimestamp?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of creatorAddress across the matching connection */
  creatorAddress?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of networkId across the matching connection */
  networkId?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of symbol across the matching connection */
  symbol?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `Collection` object types. All fields are combined with a logical ‘and.’ */
export type CollectionFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CollectionFilter>>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress?: InputMaybe<StringFilter>
  /** Filter by the object’s `contractType` field. */
  contractType?: InputMaybe<ContractTypeFilter>
  /** Filter by the object’s `createdBlock` field. */
  createdBlock?: InputMaybe<BigFloatFilter>
  /** Filter by the object’s `createdTimestamp` field. */
  createdTimestamp?: InputMaybe<BigFloatFilter>
  /** Filter by the object’s `creatorAddress` field. */
  creatorAddress?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>
  /** Filter by the object’s `network` relation. */
  network?: InputMaybe<NetworkFilter>
  /** Filter by the object’s `networkId` field. */
  networkId?: InputMaybe<StringFilter>
  /** Filter by the object’s `nfts` relation. */
  nfts?: InputMaybe<CollectionToManyNftFilter>
  /** Some related `nfts` exist. */
  nftsExist?: InputMaybe<Scalars['Boolean']['input']>
  /** Negates the expression. */
  not?: InputMaybe<CollectionFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CollectionFilter>>
  /** Filter by the object’s `symbol` field. */
  symbol?: InputMaybe<StringFilter>
  /** Filter by the object’s `totalSupply` field. */
  totalSupply?: InputMaybe<BigFloatFilter>
}

export type CollectionMaxAggregateFilter = {
  createdBlock?: InputMaybe<BigFloatFilter>
  createdTimestamp?: InputMaybe<BigFloatFilter>
  totalSupply?: InputMaybe<BigFloatFilter>
}

export type CollectionMaxAggregates = {
  __typename?: 'CollectionMaxAggregates'
  /** Maximum of createdBlock across the matching connection */
  createdBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Maximum of createdTimestamp across the matching connection */
  createdTimestamp?: Maybe<Scalars['BigFloat']['output']>
  /** Maximum of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>
}

/** A connection to a list of `Metadatum` values, with data from `Nft`. */
export type CollectionMetadataByNftCollectionIdAndMetadataIdManyToManyConnection = {
  __typename?: 'CollectionMetadataByNftCollectionIdAndMetadataIdManyToManyConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<MetadatumAggregates>
  /** A list of edges which contains the `Metadatum`, info from the `Nft`, and the cursor to aid in pagination. */
  edges: Array<CollectionMetadataByNftCollectionIdAndMetadataIdManyToManyEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<MetadatumAggregates>>
  /** A list of `Metadatum` objects. */
  nodes: Array<Maybe<Metadatum>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Metadatum` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `Metadatum` values, with data from `Nft`. */
export type CollectionMetadataByNftCollectionIdAndMetadataIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: Array<MetadataGroupBy>
  having?: InputMaybe<MetadataHavingInput>
}

/** A `Metadatum` edge in the connection, with data from `Nft`. */
export type CollectionMetadataByNftCollectionIdAndMetadataIdManyToManyEdge = {
  __typename?: 'CollectionMetadataByNftCollectionIdAndMetadataIdManyToManyEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** Reads and enables pagination through a set of `Nft`. */
  nftsByMetadataId: NftsConnection
  /** The `Metadatum` at the end of the edge. */
  node?: Maybe<Metadatum>
}

/** A `Metadatum` edge in the connection, with data from `Nft`. */
export type CollectionMetadataByNftCollectionIdAndMetadataIdManyToManyEdgeNftsByMetadataIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Nfts_Distinct_Enum>>>
  filter?: InputMaybe<NftFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NftsOrderBy>>
}

export type CollectionMinAggregateFilter = {
  createdBlock?: InputMaybe<BigFloatFilter>
  createdTimestamp?: InputMaybe<BigFloatFilter>
  totalSupply?: InputMaybe<BigFloatFilter>
}

export type CollectionMinAggregates = {
  __typename?: 'CollectionMinAggregates'
  /** Minimum of createdBlock across the matching connection */
  createdBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Minimum of createdTimestamp across the matching connection */
  createdTimestamp?: Maybe<Scalars['BigFloat']['output']>
  /** Minimum of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>
}

export type CollectionStddevPopulationAggregateFilter = {
  createdBlock?: InputMaybe<BigFloatFilter>
  createdTimestamp?: InputMaybe<BigFloatFilter>
  totalSupply?: InputMaybe<BigFloatFilter>
}

export type CollectionStddevPopulationAggregates = {
  __typename?: 'CollectionStddevPopulationAggregates'
  /** Population standard deviation of createdBlock across the matching connection */
  createdBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of createdTimestamp across the matching connection */
  createdTimestamp?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>
}

export type CollectionStddevSampleAggregateFilter = {
  createdBlock?: InputMaybe<BigFloatFilter>
  createdTimestamp?: InputMaybe<BigFloatFilter>
  totalSupply?: InputMaybe<BigFloatFilter>
}

export type CollectionStddevSampleAggregates = {
  __typename?: 'CollectionStddevSampleAggregates'
  /** Sample standard deviation of createdBlock across the matching connection */
  createdBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of createdTimestamp across the matching connection */
  createdTimestamp?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>
}

export type CollectionSumAggregateFilter = {
  createdBlock?: InputMaybe<BigFloatFilter>
  createdTimestamp?: InputMaybe<BigFloatFilter>
  totalSupply?: InputMaybe<BigFloatFilter>
}

export type CollectionSumAggregates = {
  __typename?: 'CollectionSumAggregates'
  /** Sum of createdBlock across the matching connection */
  createdBlock: Scalars['BigFloat']['output']
  /** Sum of createdTimestamp across the matching connection */
  createdTimestamp: Scalars['BigFloat']['output']
  /** Sum of totalSupply across the matching connection */
  totalSupply: Scalars['BigFloat']['output']
}

/** A filter to be used against many `Nft` object types. All fields are combined with a logical ‘and.’ */
export type CollectionToManyNftFilter = {
  /** Aggregates across related `Nft` match the filter criteria. */
  aggregates?: InputMaybe<NftAggregatesFilter>
  /** Every related `Nft` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<NftFilter>
  /** No related `Nft` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<NftFilter>
  /** Some related `Nft` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<NftFilter>
}

export type CollectionVariancePopulationAggregateFilter = {
  createdBlock?: InputMaybe<BigFloatFilter>
  createdTimestamp?: InputMaybe<BigFloatFilter>
  totalSupply?: InputMaybe<BigFloatFilter>
}

export type CollectionVariancePopulationAggregates = {
  __typename?: 'CollectionVariancePopulationAggregates'
  /** Population variance of createdBlock across the matching connection */
  createdBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of createdTimestamp across the matching connection */
  createdTimestamp?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>
}

export type CollectionVarianceSampleAggregateFilter = {
  createdBlock?: InputMaybe<BigFloatFilter>
  createdTimestamp?: InputMaybe<BigFloatFilter>
  totalSupply?: InputMaybe<BigFloatFilter>
}

export type CollectionVarianceSampleAggregates = {
  __typename?: 'CollectionVarianceSampleAggregates'
  /** Sample variance of createdBlock across the matching connection */
  createdBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of createdTimestamp across the matching connection */
  createdTimestamp?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>
}

/** A connection to a list of `Collection` values. */
export type CollectionsConnection = {
  __typename?: 'CollectionsConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<CollectionAggregates>
  /** A list of edges which contains the `Collection` and cursor to aid in pagination. */
  edges: Array<CollectionsEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<CollectionAggregates>>
  /** A list of `Collection` objects. */
  nodes: Array<Maybe<Collection>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Collection` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `Collection` values. */
export type CollectionsConnectionGroupedAggregatesArgs = {
  groupBy: Array<CollectionsGroupBy>
  having?: InputMaybe<CollectionsHavingInput>
}

/** A `Collection` edge in the connection. */
export type CollectionsEdge = {
  __typename?: 'CollectionsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Collection` at the end of the edge. */
  node?: Maybe<Collection>
}

/** Grouping methods for `Collection` for usage during aggregation. */
export enum CollectionsGroupBy {
  ContractAddress = 'CONTRACT_ADDRESS',
  ContractType = 'CONTRACT_TYPE',
  CreatedBlock = 'CREATED_BLOCK',
  CreatedTimestamp = 'CREATED_TIMESTAMP',
  CreatorAddress = 'CREATOR_ADDRESS',
  Name = 'NAME',
  NetworkId = 'NETWORK_ID',
  Symbol = 'SYMBOL',
  TotalSupply = 'TOTAL_SUPPLY',
}

export type CollectionsHavingAverageInput = {
  createdBlock?: InputMaybe<HavingBigfloatFilter>
  createdTimestamp?: InputMaybe<HavingBigfloatFilter>
  totalSupply?: InputMaybe<HavingBigfloatFilter>
}

export type CollectionsHavingDistinctCountInput = {
  createdBlock?: InputMaybe<HavingBigfloatFilter>
  createdTimestamp?: InputMaybe<HavingBigfloatFilter>
  totalSupply?: InputMaybe<HavingBigfloatFilter>
}

/** Conditions for `Collection` aggregates. */
export type CollectionsHavingInput = {
  AND?: InputMaybe<Array<CollectionsHavingInput>>
  OR?: InputMaybe<Array<CollectionsHavingInput>>
  average?: InputMaybe<CollectionsHavingAverageInput>
  distinctCount?: InputMaybe<CollectionsHavingDistinctCountInput>
  max?: InputMaybe<CollectionsHavingMaxInput>
  min?: InputMaybe<CollectionsHavingMinInput>
  stddevPopulation?: InputMaybe<CollectionsHavingStddevPopulationInput>
  stddevSample?: InputMaybe<CollectionsHavingStddevSampleInput>
  sum?: InputMaybe<CollectionsHavingSumInput>
  variancePopulation?: InputMaybe<CollectionsHavingVariancePopulationInput>
  varianceSample?: InputMaybe<CollectionsHavingVarianceSampleInput>
}

export type CollectionsHavingMaxInput = {
  createdBlock?: InputMaybe<HavingBigfloatFilter>
  createdTimestamp?: InputMaybe<HavingBigfloatFilter>
  totalSupply?: InputMaybe<HavingBigfloatFilter>
}

export type CollectionsHavingMinInput = {
  createdBlock?: InputMaybe<HavingBigfloatFilter>
  createdTimestamp?: InputMaybe<HavingBigfloatFilter>
  totalSupply?: InputMaybe<HavingBigfloatFilter>
}

export type CollectionsHavingStddevPopulationInput = {
  createdBlock?: InputMaybe<HavingBigfloatFilter>
  createdTimestamp?: InputMaybe<HavingBigfloatFilter>
  totalSupply?: InputMaybe<HavingBigfloatFilter>
}

export type CollectionsHavingStddevSampleInput = {
  createdBlock?: InputMaybe<HavingBigfloatFilter>
  createdTimestamp?: InputMaybe<HavingBigfloatFilter>
  totalSupply?: InputMaybe<HavingBigfloatFilter>
}

export type CollectionsHavingSumInput = {
  createdBlock?: InputMaybe<HavingBigfloatFilter>
  createdTimestamp?: InputMaybe<HavingBigfloatFilter>
  totalSupply?: InputMaybe<HavingBigfloatFilter>
}

export type CollectionsHavingVariancePopulationInput = {
  createdBlock?: InputMaybe<HavingBigfloatFilter>
  createdTimestamp?: InputMaybe<HavingBigfloatFilter>
  totalSupply?: InputMaybe<HavingBigfloatFilter>
}

export type CollectionsHavingVarianceSampleInput = {
  createdBlock?: InputMaybe<HavingBigfloatFilter>
  createdTimestamp?: InputMaybe<HavingBigfloatFilter>
  totalSupply?: InputMaybe<HavingBigfloatFilter>
}

/** Methods to use when ordering `Collection`. */
export enum CollectionsOrderBy {
  ContractAddressAsc = 'CONTRACT_ADDRESS_ASC',
  ContractAddressDesc = 'CONTRACT_ADDRESS_DESC',
  ContractTypeAsc = 'CONTRACT_TYPE_ASC',
  ContractTypeDesc = 'CONTRACT_TYPE_DESC',
  CreatedBlockAsc = 'CREATED_BLOCK_ASC',
  CreatedBlockDesc = 'CREATED_BLOCK_DESC',
  CreatedTimestampAsc = 'CREATED_TIMESTAMP_ASC',
  CreatedTimestampDesc = 'CREATED_TIMESTAMP_DESC',
  CreatorAddressAsc = 'CREATOR_ADDRESS_ASC',
  CreatorAddressDesc = 'CREATOR_ADDRESS_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  NetworkIdAsc = 'NETWORK_ID_ASC',
  NetworkIdDesc = 'NETWORK_ID_DESC',
  NftsAverageAmountAsc = 'NFTS_AVERAGE_AMOUNT_ASC',
  NftsAverageAmountDesc = 'NFTS_AVERAGE_AMOUNT_DESC',
  NftsAverageCollectionIdAsc = 'NFTS_AVERAGE_COLLECTION_ID_ASC',
  NftsAverageCollectionIdDesc = 'NFTS_AVERAGE_COLLECTION_ID_DESC',
  NftsAverageCurrentOwnerAsc = 'NFTS_AVERAGE_CURRENT_OWNER_ASC',
  NftsAverageCurrentOwnerDesc = 'NFTS_AVERAGE_CURRENT_OWNER_DESC',
  NftsAverageIdAsc = 'NFTS_AVERAGE_ID_ASC',
  NftsAverageIdDesc = 'NFTS_AVERAGE_ID_DESC',
  NftsAverageMetadataIdAsc = 'NFTS_AVERAGE_METADATA_ID_ASC',
  NftsAverageMetadataIdDesc = 'NFTS_AVERAGE_METADATA_ID_DESC',
  NftsAverageMintedBlockAsc = 'NFTS_AVERAGE_MINTED_BLOCK_ASC',
  NftsAverageMintedBlockDesc = 'NFTS_AVERAGE_MINTED_BLOCK_DESC',
  NftsAverageMintedTimestampAsc = 'NFTS_AVERAGE_MINTED_TIMESTAMP_ASC',
  NftsAverageMintedTimestampDesc = 'NFTS_AVERAGE_MINTED_TIMESTAMP_DESC',
  NftsAverageMinterAddressAsc = 'NFTS_AVERAGE_MINTER_ADDRESS_ASC',
  NftsAverageMinterAddressDesc = 'NFTS_AVERAGE_MINTER_ADDRESS_DESC',
  NftsAverageTokenIdAsc = 'NFTS_AVERAGE_TOKEN_ID_ASC',
  NftsAverageTokenIdDesc = 'NFTS_AVERAGE_TOKEN_ID_DESC',
  NftsCountAsc = 'NFTS_COUNT_ASC',
  NftsCountDesc = 'NFTS_COUNT_DESC',
  NftsDistinctCountAmountAsc = 'NFTS_DISTINCT_COUNT_AMOUNT_ASC',
  NftsDistinctCountAmountDesc = 'NFTS_DISTINCT_COUNT_AMOUNT_DESC',
  NftsDistinctCountCollectionIdAsc = 'NFTS_DISTINCT_COUNT_COLLECTION_ID_ASC',
  NftsDistinctCountCollectionIdDesc = 'NFTS_DISTINCT_COUNT_COLLECTION_ID_DESC',
  NftsDistinctCountCurrentOwnerAsc = 'NFTS_DISTINCT_COUNT_CURRENT_OWNER_ASC',
  NftsDistinctCountCurrentOwnerDesc = 'NFTS_DISTINCT_COUNT_CURRENT_OWNER_DESC',
  NftsDistinctCountIdAsc = 'NFTS_DISTINCT_COUNT_ID_ASC',
  NftsDistinctCountIdDesc = 'NFTS_DISTINCT_COUNT_ID_DESC',
  NftsDistinctCountMetadataIdAsc = 'NFTS_DISTINCT_COUNT_METADATA_ID_ASC',
  NftsDistinctCountMetadataIdDesc = 'NFTS_DISTINCT_COUNT_METADATA_ID_DESC',
  NftsDistinctCountMintedBlockAsc = 'NFTS_DISTINCT_COUNT_MINTED_BLOCK_ASC',
  NftsDistinctCountMintedBlockDesc = 'NFTS_DISTINCT_COUNT_MINTED_BLOCK_DESC',
  NftsDistinctCountMintedTimestampAsc = 'NFTS_DISTINCT_COUNT_MINTED_TIMESTAMP_ASC',
  NftsDistinctCountMintedTimestampDesc = 'NFTS_DISTINCT_COUNT_MINTED_TIMESTAMP_DESC',
  NftsDistinctCountMinterAddressAsc = 'NFTS_DISTINCT_COUNT_MINTER_ADDRESS_ASC',
  NftsDistinctCountMinterAddressDesc = 'NFTS_DISTINCT_COUNT_MINTER_ADDRESS_DESC',
  NftsDistinctCountTokenIdAsc = 'NFTS_DISTINCT_COUNT_TOKEN_ID_ASC',
  NftsDistinctCountTokenIdDesc = 'NFTS_DISTINCT_COUNT_TOKEN_ID_DESC',
  NftsMaxAmountAsc = 'NFTS_MAX_AMOUNT_ASC',
  NftsMaxAmountDesc = 'NFTS_MAX_AMOUNT_DESC',
  NftsMaxCollectionIdAsc = 'NFTS_MAX_COLLECTION_ID_ASC',
  NftsMaxCollectionIdDesc = 'NFTS_MAX_COLLECTION_ID_DESC',
  NftsMaxCurrentOwnerAsc = 'NFTS_MAX_CURRENT_OWNER_ASC',
  NftsMaxCurrentOwnerDesc = 'NFTS_MAX_CURRENT_OWNER_DESC',
  NftsMaxIdAsc = 'NFTS_MAX_ID_ASC',
  NftsMaxIdDesc = 'NFTS_MAX_ID_DESC',
  NftsMaxMetadataIdAsc = 'NFTS_MAX_METADATA_ID_ASC',
  NftsMaxMetadataIdDesc = 'NFTS_MAX_METADATA_ID_DESC',
  NftsMaxMintedBlockAsc = 'NFTS_MAX_MINTED_BLOCK_ASC',
  NftsMaxMintedBlockDesc = 'NFTS_MAX_MINTED_BLOCK_DESC',
  NftsMaxMintedTimestampAsc = 'NFTS_MAX_MINTED_TIMESTAMP_ASC',
  NftsMaxMintedTimestampDesc = 'NFTS_MAX_MINTED_TIMESTAMP_DESC',
  NftsMaxMinterAddressAsc = 'NFTS_MAX_MINTER_ADDRESS_ASC',
  NftsMaxMinterAddressDesc = 'NFTS_MAX_MINTER_ADDRESS_DESC',
  NftsMaxTokenIdAsc = 'NFTS_MAX_TOKEN_ID_ASC',
  NftsMaxTokenIdDesc = 'NFTS_MAX_TOKEN_ID_DESC',
  NftsMinAmountAsc = 'NFTS_MIN_AMOUNT_ASC',
  NftsMinAmountDesc = 'NFTS_MIN_AMOUNT_DESC',
  NftsMinCollectionIdAsc = 'NFTS_MIN_COLLECTION_ID_ASC',
  NftsMinCollectionIdDesc = 'NFTS_MIN_COLLECTION_ID_DESC',
  NftsMinCurrentOwnerAsc = 'NFTS_MIN_CURRENT_OWNER_ASC',
  NftsMinCurrentOwnerDesc = 'NFTS_MIN_CURRENT_OWNER_DESC',
  NftsMinIdAsc = 'NFTS_MIN_ID_ASC',
  NftsMinIdDesc = 'NFTS_MIN_ID_DESC',
  NftsMinMetadataIdAsc = 'NFTS_MIN_METADATA_ID_ASC',
  NftsMinMetadataIdDesc = 'NFTS_MIN_METADATA_ID_DESC',
  NftsMinMintedBlockAsc = 'NFTS_MIN_MINTED_BLOCK_ASC',
  NftsMinMintedBlockDesc = 'NFTS_MIN_MINTED_BLOCK_DESC',
  NftsMinMintedTimestampAsc = 'NFTS_MIN_MINTED_TIMESTAMP_ASC',
  NftsMinMintedTimestampDesc = 'NFTS_MIN_MINTED_TIMESTAMP_DESC',
  NftsMinMinterAddressAsc = 'NFTS_MIN_MINTER_ADDRESS_ASC',
  NftsMinMinterAddressDesc = 'NFTS_MIN_MINTER_ADDRESS_DESC',
  NftsMinTokenIdAsc = 'NFTS_MIN_TOKEN_ID_ASC',
  NftsMinTokenIdDesc = 'NFTS_MIN_TOKEN_ID_DESC',
  NftsStddevPopulationAmountAsc = 'NFTS_STDDEV_POPULATION_AMOUNT_ASC',
  NftsStddevPopulationAmountDesc = 'NFTS_STDDEV_POPULATION_AMOUNT_DESC',
  NftsStddevPopulationCollectionIdAsc = 'NFTS_STDDEV_POPULATION_COLLECTION_ID_ASC',
  NftsStddevPopulationCollectionIdDesc = 'NFTS_STDDEV_POPULATION_COLLECTION_ID_DESC',
  NftsStddevPopulationCurrentOwnerAsc = 'NFTS_STDDEV_POPULATION_CURRENT_OWNER_ASC',
  NftsStddevPopulationCurrentOwnerDesc = 'NFTS_STDDEV_POPULATION_CURRENT_OWNER_DESC',
  NftsStddevPopulationIdAsc = 'NFTS_STDDEV_POPULATION_ID_ASC',
  NftsStddevPopulationIdDesc = 'NFTS_STDDEV_POPULATION_ID_DESC',
  NftsStddevPopulationMetadataIdAsc = 'NFTS_STDDEV_POPULATION_METADATA_ID_ASC',
  NftsStddevPopulationMetadataIdDesc = 'NFTS_STDDEV_POPULATION_METADATA_ID_DESC',
  NftsStddevPopulationMintedBlockAsc = 'NFTS_STDDEV_POPULATION_MINTED_BLOCK_ASC',
  NftsStddevPopulationMintedBlockDesc = 'NFTS_STDDEV_POPULATION_MINTED_BLOCK_DESC',
  NftsStddevPopulationMintedTimestampAsc = 'NFTS_STDDEV_POPULATION_MINTED_TIMESTAMP_ASC',
  NftsStddevPopulationMintedTimestampDesc = 'NFTS_STDDEV_POPULATION_MINTED_TIMESTAMP_DESC',
  NftsStddevPopulationMinterAddressAsc = 'NFTS_STDDEV_POPULATION_MINTER_ADDRESS_ASC',
  NftsStddevPopulationMinterAddressDesc = 'NFTS_STDDEV_POPULATION_MINTER_ADDRESS_DESC',
  NftsStddevPopulationTokenIdAsc = 'NFTS_STDDEV_POPULATION_TOKEN_ID_ASC',
  NftsStddevPopulationTokenIdDesc = 'NFTS_STDDEV_POPULATION_TOKEN_ID_DESC',
  NftsStddevSampleAmountAsc = 'NFTS_STDDEV_SAMPLE_AMOUNT_ASC',
  NftsStddevSampleAmountDesc = 'NFTS_STDDEV_SAMPLE_AMOUNT_DESC',
  NftsStddevSampleCollectionIdAsc = 'NFTS_STDDEV_SAMPLE_COLLECTION_ID_ASC',
  NftsStddevSampleCollectionIdDesc = 'NFTS_STDDEV_SAMPLE_COLLECTION_ID_DESC',
  NftsStddevSampleCurrentOwnerAsc = 'NFTS_STDDEV_SAMPLE_CURRENT_OWNER_ASC',
  NftsStddevSampleCurrentOwnerDesc = 'NFTS_STDDEV_SAMPLE_CURRENT_OWNER_DESC',
  NftsStddevSampleIdAsc = 'NFTS_STDDEV_SAMPLE_ID_ASC',
  NftsStddevSampleIdDesc = 'NFTS_STDDEV_SAMPLE_ID_DESC',
  NftsStddevSampleMetadataIdAsc = 'NFTS_STDDEV_SAMPLE_METADATA_ID_ASC',
  NftsStddevSampleMetadataIdDesc = 'NFTS_STDDEV_SAMPLE_METADATA_ID_DESC',
  NftsStddevSampleMintedBlockAsc = 'NFTS_STDDEV_SAMPLE_MINTED_BLOCK_ASC',
  NftsStddevSampleMintedBlockDesc = 'NFTS_STDDEV_SAMPLE_MINTED_BLOCK_DESC',
  NftsStddevSampleMintedTimestampAsc = 'NFTS_STDDEV_SAMPLE_MINTED_TIMESTAMP_ASC',
  NftsStddevSampleMintedTimestampDesc = 'NFTS_STDDEV_SAMPLE_MINTED_TIMESTAMP_DESC',
  NftsStddevSampleMinterAddressAsc = 'NFTS_STDDEV_SAMPLE_MINTER_ADDRESS_ASC',
  NftsStddevSampleMinterAddressDesc = 'NFTS_STDDEV_SAMPLE_MINTER_ADDRESS_DESC',
  NftsStddevSampleTokenIdAsc = 'NFTS_STDDEV_SAMPLE_TOKEN_ID_ASC',
  NftsStddevSampleTokenIdDesc = 'NFTS_STDDEV_SAMPLE_TOKEN_ID_DESC',
  NftsSumAmountAsc = 'NFTS_SUM_AMOUNT_ASC',
  NftsSumAmountDesc = 'NFTS_SUM_AMOUNT_DESC',
  NftsSumCollectionIdAsc = 'NFTS_SUM_COLLECTION_ID_ASC',
  NftsSumCollectionIdDesc = 'NFTS_SUM_COLLECTION_ID_DESC',
  NftsSumCurrentOwnerAsc = 'NFTS_SUM_CURRENT_OWNER_ASC',
  NftsSumCurrentOwnerDesc = 'NFTS_SUM_CURRENT_OWNER_DESC',
  NftsSumIdAsc = 'NFTS_SUM_ID_ASC',
  NftsSumIdDesc = 'NFTS_SUM_ID_DESC',
  NftsSumMetadataIdAsc = 'NFTS_SUM_METADATA_ID_ASC',
  NftsSumMetadataIdDesc = 'NFTS_SUM_METADATA_ID_DESC',
  NftsSumMintedBlockAsc = 'NFTS_SUM_MINTED_BLOCK_ASC',
  NftsSumMintedBlockDesc = 'NFTS_SUM_MINTED_BLOCK_DESC',
  NftsSumMintedTimestampAsc = 'NFTS_SUM_MINTED_TIMESTAMP_ASC',
  NftsSumMintedTimestampDesc = 'NFTS_SUM_MINTED_TIMESTAMP_DESC',
  NftsSumMinterAddressAsc = 'NFTS_SUM_MINTER_ADDRESS_ASC',
  NftsSumMinterAddressDesc = 'NFTS_SUM_MINTER_ADDRESS_DESC',
  NftsSumTokenIdAsc = 'NFTS_SUM_TOKEN_ID_ASC',
  NftsSumTokenIdDesc = 'NFTS_SUM_TOKEN_ID_DESC',
  NftsVariancePopulationAmountAsc = 'NFTS_VARIANCE_POPULATION_AMOUNT_ASC',
  NftsVariancePopulationAmountDesc = 'NFTS_VARIANCE_POPULATION_AMOUNT_DESC',
  NftsVariancePopulationCollectionIdAsc = 'NFTS_VARIANCE_POPULATION_COLLECTION_ID_ASC',
  NftsVariancePopulationCollectionIdDesc = 'NFTS_VARIANCE_POPULATION_COLLECTION_ID_DESC',
  NftsVariancePopulationCurrentOwnerAsc = 'NFTS_VARIANCE_POPULATION_CURRENT_OWNER_ASC',
  NftsVariancePopulationCurrentOwnerDesc = 'NFTS_VARIANCE_POPULATION_CURRENT_OWNER_DESC',
  NftsVariancePopulationIdAsc = 'NFTS_VARIANCE_POPULATION_ID_ASC',
  NftsVariancePopulationIdDesc = 'NFTS_VARIANCE_POPULATION_ID_DESC',
  NftsVariancePopulationMetadataIdAsc = 'NFTS_VARIANCE_POPULATION_METADATA_ID_ASC',
  NftsVariancePopulationMetadataIdDesc = 'NFTS_VARIANCE_POPULATION_METADATA_ID_DESC',
  NftsVariancePopulationMintedBlockAsc = 'NFTS_VARIANCE_POPULATION_MINTED_BLOCK_ASC',
  NftsVariancePopulationMintedBlockDesc = 'NFTS_VARIANCE_POPULATION_MINTED_BLOCK_DESC',
  NftsVariancePopulationMintedTimestampAsc = 'NFTS_VARIANCE_POPULATION_MINTED_TIMESTAMP_ASC',
  NftsVariancePopulationMintedTimestampDesc = 'NFTS_VARIANCE_POPULATION_MINTED_TIMESTAMP_DESC',
  NftsVariancePopulationMinterAddressAsc = 'NFTS_VARIANCE_POPULATION_MINTER_ADDRESS_ASC',
  NftsVariancePopulationMinterAddressDesc = 'NFTS_VARIANCE_POPULATION_MINTER_ADDRESS_DESC',
  NftsVariancePopulationTokenIdAsc = 'NFTS_VARIANCE_POPULATION_TOKEN_ID_ASC',
  NftsVariancePopulationTokenIdDesc = 'NFTS_VARIANCE_POPULATION_TOKEN_ID_DESC',
  NftsVarianceSampleAmountAsc = 'NFTS_VARIANCE_SAMPLE_AMOUNT_ASC',
  NftsVarianceSampleAmountDesc = 'NFTS_VARIANCE_SAMPLE_AMOUNT_DESC',
  NftsVarianceSampleCollectionIdAsc = 'NFTS_VARIANCE_SAMPLE_COLLECTION_ID_ASC',
  NftsVarianceSampleCollectionIdDesc = 'NFTS_VARIANCE_SAMPLE_COLLECTION_ID_DESC',
  NftsVarianceSampleCurrentOwnerAsc = 'NFTS_VARIANCE_SAMPLE_CURRENT_OWNER_ASC',
  NftsVarianceSampleCurrentOwnerDesc = 'NFTS_VARIANCE_SAMPLE_CURRENT_OWNER_DESC',
  NftsVarianceSampleIdAsc = 'NFTS_VARIANCE_SAMPLE_ID_ASC',
  NftsVarianceSampleIdDesc = 'NFTS_VARIANCE_SAMPLE_ID_DESC',
  NftsVarianceSampleMetadataIdAsc = 'NFTS_VARIANCE_SAMPLE_METADATA_ID_ASC',
  NftsVarianceSampleMetadataIdDesc = 'NFTS_VARIANCE_SAMPLE_METADATA_ID_DESC',
  NftsVarianceSampleMintedBlockAsc = 'NFTS_VARIANCE_SAMPLE_MINTED_BLOCK_ASC',
  NftsVarianceSampleMintedBlockDesc = 'NFTS_VARIANCE_SAMPLE_MINTED_BLOCK_DESC',
  NftsVarianceSampleMintedTimestampAsc = 'NFTS_VARIANCE_SAMPLE_MINTED_TIMESTAMP_ASC',
  NftsVarianceSampleMintedTimestampDesc = 'NFTS_VARIANCE_SAMPLE_MINTED_TIMESTAMP_DESC',
  NftsVarianceSampleMinterAddressAsc = 'NFTS_VARIANCE_SAMPLE_MINTER_ADDRESS_ASC',
  NftsVarianceSampleMinterAddressDesc = 'NFTS_VARIANCE_SAMPLE_MINTER_ADDRESS_DESC',
  NftsVarianceSampleTokenIdAsc = 'NFTS_VARIANCE_SAMPLE_TOKEN_ID_ASC',
  NftsVarianceSampleTokenIdDesc = 'NFTS_VARIANCE_SAMPLE_TOKEN_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SymbolAsc = 'SYMBOL_ASC',
  SymbolDesc = 'SYMBOL_DESC',
  TotalSupplyAsc = 'TOTAL_SUPPLY_ASC',
  TotalSupplyDesc = 'TOTAL_SUPPLY_DESC',
}

export enum ContractType {
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155',
}

/** A filter to be used against ContractType fields. All fields are combined with a logical ‘and.’ */
export type ContractTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<ContractType>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<ContractType>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<ContractType>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<ContractType>
  /** Included in the specified list. */
  in?: InputMaybe<Array<ContractType>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<ContractType>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<ContractType>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<ContractType>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<ContractType>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<ContractType>>
}

export type HavingBigfloatFilter = {
  equalTo?: InputMaybe<Scalars['BigFloat']['input']>
  greaterThan?: InputMaybe<Scalars['BigFloat']['input']>
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>
  lessThan?: InputMaybe<Scalars['BigFloat']['input']>
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>
  notEqualTo?: InputMaybe<Scalars['BigFloat']['input']>
}

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Contained by the specified JSON. */
  containedBy?: InputMaybe<Scalars['JSON']['input']>
  /** Contains the specified JSON. */
  contains?: InputMaybe<Scalars['JSON']['input']>
  /** Contains all of the specified keys. */
  containsAllKeys?: InputMaybe<Array<Scalars['String']['input']>>
  /** Contains any of the specified keys. */
  containsAnyKeys?: InputMaybe<Array<Scalars['String']['input']>>
  /** Contains the specified key. */
  containsKey?: InputMaybe<Scalars['String']['input']>
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['JSON']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['JSON']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['JSON']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['JSON']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['JSON']['input']>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['JSON']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['JSON']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['JSON']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['JSON']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['JSON']['input']>>
}

/** A connection to a list of `Metadatum` values. */
export type MetadataConnection = {
  __typename?: 'MetadataConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<MetadatumAggregates>
  /** A list of edges which contains the `Metadatum` and cursor to aid in pagination. */
  edges: Array<MetadataEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<MetadatumAggregates>>
  /** A list of `Metadatum` objects. */
  nodes: Array<Maybe<Metadatum>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Metadatum` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `Metadatum` values. */
export type MetadataConnectionGroupedAggregatesArgs = {
  groupBy: Array<MetadataGroupBy>
  having?: InputMaybe<MetadataHavingInput>
}

/** A `Metadatum` edge in the connection. */
export type MetadataEdge = {
  __typename?: 'MetadataEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Metadatum` at the end of the edge. */
  node?: Maybe<Metadatum>
}

/** Grouping methods for `Metadatum` for usage during aggregation. */
export enum MetadataGroupBy {
  Description = 'DESCRIPTION',
  ImageUri = 'IMAGE_URI',
  MetadataStatus = 'METADATA_STATUS',
  MetadataUri = 'METADATA_URI',
  Name = 'NAME',
  Raw = 'RAW',
  Symbol = 'SYMBOL',
  TokenUri = 'TOKEN_URI',
}

/** Conditions for `Metadatum` aggregates. */
export type MetadataHavingInput = {
  AND?: InputMaybe<Array<MetadataHavingInput>>
  OR?: InputMaybe<Array<MetadataHavingInput>>
}

/** Methods to use when ordering `Metadatum`. */
export enum MetadataOrderBy {
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ImageUriAsc = 'IMAGE_URI_ASC',
  ImageUriDesc = 'IMAGE_URI_DESC',
  MetadataStatusAsc = 'METADATA_STATUS_ASC',
  MetadataStatusDesc = 'METADATA_STATUS_DESC',
  MetadataUriAsc = 'METADATA_URI_ASC',
  MetadataUriDesc = 'METADATA_URI_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  NftsByMetadataIdAverageAmountAsc = 'NFTS_BY_METADATA_ID_AVERAGE_AMOUNT_ASC',
  NftsByMetadataIdAverageAmountDesc = 'NFTS_BY_METADATA_ID_AVERAGE_AMOUNT_DESC',
  NftsByMetadataIdAverageCollectionIdAsc = 'NFTS_BY_METADATA_ID_AVERAGE_COLLECTION_ID_ASC',
  NftsByMetadataIdAverageCollectionIdDesc = 'NFTS_BY_METADATA_ID_AVERAGE_COLLECTION_ID_DESC',
  NftsByMetadataIdAverageCurrentOwnerAsc = 'NFTS_BY_METADATA_ID_AVERAGE_CURRENT_OWNER_ASC',
  NftsByMetadataIdAverageCurrentOwnerDesc = 'NFTS_BY_METADATA_ID_AVERAGE_CURRENT_OWNER_DESC',
  NftsByMetadataIdAverageIdAsc = 'NFTS_BY_METADATA_ID_AVERAGE_ID_ASC',
  NftsByMetadataIdAverageIdDesc = 'NFTS_BY_METADATA_ID_AVERAGE_ID_DESC',
  NftsByMetadataIdAverageMetadataIdAsc = 'NFTS_BY_METADATA_ID_AVERAGE_METADATA_ID_ASC',
  NftsByMetadataIdAverageMetadataIdDesc = 'NFTS_BY_METADATA_ID_AVERAGE_METADATA_ID_DESC',
  NftsByMetadataIdAverageMintedBlockAsc = 'NFTS_BY_METADATA_ID_AVERAGE_MINTED_BLOCK_ASC',
  NftsByMetadataIdAverageMintedBlockDesc = 'NFTS_BY_METADATA_ID_AVERAGE_MINTED_BLOCK_DESC',
  NftsByMetadataIdAverageMintedTimestampAsc = 'NFTS_BY_METADATA_ID_AVERAGE_MINTED_TIMESTAMP_ASC',
  NftsByMetadataIdAverageMintedTimestampDesc = 'NFTS_BY_METADATA_ID_AVERAGE_MINTED_TIMESTAMP_DESC',
  NftsByMetadataIdAverageMinterAddressAsc = 'NFTS_BY_METADATA_ID_AVERAGE_MINTER_ADDRESS_ASC',
  NftsByMetadataIdAverageMinterAddressDesc = 'NFTS_BY_METADATA_ID_AVERAGE_MINTER_ADDRESS_DESC',
  NftsByMetadataIdAverageTokenIdAsc = 'NFTS_BY_METADATA_ID_AVERAGE_TOKEN_ID_ASC',
  NftsByMetadataIdAverageTokenIdDesc = 'NFTS_BY_METADATA_ID_AVERAGE_TOKEN_ID_DESC',
  NftsByMetadataIdCountAsc = 'NFTS_BY_METADATA_ID_COUNT_ASC',
  NftsByMetadataIdCountDesc = 'NFTS_BY_METADATA_ID_COUNT_DESC',
  NftsByMetadataIdDistinctCountAmountAsc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_AMOUNT_ASC',
  NftsByMetadataIdDistinctCountAmountDesc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_AMOUNT_DESC',
  NftsByMetadataIdDistinctCountCollectionIdAsc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_COLLECTION_ID_ASC',
  NftsByMetadataIdDistinctCountCollectionIdDesc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_COLLECTION_ID_DESC',
  NftsByMetadataIdDistinctCountCurrentOwnerAsc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_CURRENT_OWNER_ASC',
  NftsByMetadataIdDistinctCountCurrentOwnerDesc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_CURRENT_OWNER_DESC',
  NftsByMetadataIdDistinctCountIdAsc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_ID_ASC',
  NftsByMetadataIdDistinctCountIdDesc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_ID_DESC',
  NftsByMetadataIdDistinctCountMetadataIdAsc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_METADATA_ID_ASC',
  NftsByMetadataIdDistinctCountMetadataIdDesc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_METADATA_ID_DESC',
  NftsByMetadataIdDistinctCountMintedBlockAsc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_MINTED_BLOCK_ASC',
  NftsByMetadataIdDistinctCountMintedBlockDesc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_MINTED_BLOCK_DESC',
  NftsByMetadataIdDistinctCountMintedTimestampAsc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_MINTED_TIMESTAMP_ASC',
  NftsByMetadataIdDistinctCountMintedTimestampDesc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_MINTED_TIMESTAMP_DESC',
  NftsByMetadataIdDistinctCountMinterAddressAsc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_MINTER_ADDRESS_ASC',
  NftsByMetadataIdDistinctCountMinterAddressDesc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_MINTER_ADDRESS_DESC',
  NftsByMetadataIdDistinctCountTokenIdAsc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_TOKEN_ID_ASC',
  NftsByMetadataIdDistinctCountTokenIdDesc = 'NFTS_BY_METADATA_ID_DISTINCT_COUNT_TOKEN_ID_DESC',
  NftsByMetadataIdMaxAmountAsc = 'NFTS_BY_METADATA_ID_MAX_AMOUNT_ASC',
  NftsByMetadataIdMaxAmountDesc = 'NFTS_BY_METADATA_ID_MAX_AMOUNT_DESC',
  NftsByMetadataIdMaxCollectionIdAsc = 'NFTS_BY_METADATA_ID_MAX_COLLECTION_ID_ASC',
  NftsByMetadataIdMaxCollectionIdDesc = 'NFTS_BY_METADATA_ID_MAX_COLLECTION_ID_DESC',
  NftsByMetadataIdMaxCurrentOwnerAsc = 'NFTS_BY_METADATA_ID_MAX_CURRENT_OWNER_ASC',
  NftsByMetadataIdMaxCurrentOwnerDesc = 'NFTS_BY_METADATA_ID_MAX_CURRENT_OWNER_DESC',
  NftsByMetadataIdMaxIdAsc = 'NFTS_BY_METADATA_ID_MAX_ID_ASC',
  NftsByMetadataIdMaxIdDesc = 'NFTS_BY_METADATA_ID_MAX_ID_DESC',
  NftsByMetadataIdMaxMetadataIdAsc = 'NFTS_BY_METADATA_ID_MAX_METADATA_ID_ASC',
  NftsByMetadataIdMaxMetadataIdDesc = 'NFTS_BY_METADATA_ID_MAX_METADATA_ID_DESC',
  NftsByMetadataIdMaxMintedBlockAsc = 'NFTS_BY_METADATA_ID_MAX_MINTED_BLOCK_ASC',
  NftsByMetadataIdMaxMintedBlockDesc = 'NFTS_BY_METADATA_ID_MAX_MINTED_BLOCK_DESC',
  NftsByMetadataIdMaxMintedTimestampAsc = 'NFTS_BY_METADATA_ID_MAX_MINTED_TIMESTAMP_ASC',
  NftsByMetadataIdMaxMintedTimestampDesc = 'NFTS_BY_METADATA_ID_MAX_MINTED_TIMESTAMP_DESC',
  NftsByMetadataIdMaxMinterAddressAsc = 'NFTS_BY_METADATA_ID_MAX_MINTER_ADDRESS_ASC',
  NftsByMetadataIdMaxMinterAddressDesc = 'NFTS_BY_METADATA_ID_MAX_MINTER_ADDRESS_DESC',
  NftsByMetadataIdMaxTokenIdAsc = 'NFTS_BY_METADATA_ID_MAX_TOKEN_ID_ASC',
  NftsByMetadataIdMaxTokenIdDesc = 'NFTS_BY_METADATA_ID_MAX_TOKEN_ID_DESC',
  NftsByMetadataIdMinAmountAsc = 'NFTS_BY_METADATA_ID_MIN_AMOUNT_ASC',
  NftsByMetadataIdMinAmountDesc = 'NFTS_BY_METADATA_ID_MIN_AMOUNT_DESC',
  NftsByMetadataIdMinCollectionIdAsc = 'NFTS_BY_METADATA_ID_MIN_COLLECTION_ID_ASC',
  NftsByMetadataIdMinCollectionIdDesc = 'NFTS_BY_METADATA_ID_MIN_COLLECTION_ID_DESC',
  NftsByMetadataIdMinCurrentOwnerAsc = 'NFTS_BY_METADATA_ID_MIN_CURRENT_OWNER_ASC',
  NftsByMetadataIdMinCurrentOwnerDesc = 'NFTS_BY_METADATA_ID_MIN_CURRENT_OWNER_DESC',
  NftsByMetadataIdMinIdAsc = 'NFTS_BY_METADATA_ID_MIN_ID_ASC',
  NftsByMetadataIdMinIdDesc = 'NFTS_BY_METADATA_ID_MIN_ID_DESC',
  NftsByMetadataIdMinMetadataIdAsc = 'NFTS_BY_METADATA_ID_MIN_METADATA_ID_ASC',
  NftsByMetadataIdMinMetadataIdDesc = 'NFTS_BY_METADATA_ID_MIN_METADATA_ID_DESC',
  NftsByMetadataIdMinMintedBlockAsc = 'NFTS_BY_METADATA_ID_MIN_MINTED_BLOCK_ASC',
  NftsByMetadataIdMinMintedBlockDesc = 'NFTS_BY_METADATA_ID_MIN_MINTED_BLOCK_DESC',
  NftsByMetadataIdMinMintedTimestampAsc = 'NFTS_BY_METADATA_ID_MIN_MINTED_TIMESTAMP_ASC',
  NftsByMetadataIdMinMintedTimestampDesc = 'NFTS_BY_METADATA_ID_MIN_MINTED_TIMESTAMP_DESC',
  NftsByMetadataIdMinMinterAddressAsc = 'NFTS_BY_METADATA_ID_MIN_MINTER_ADDRESS_ASC',
  NftsByMetadataIdMinMinterAddressDesc = 'NFTS_BY_METADATA_ID_MIN_MINTER_ADDRESS_DESC',
  NftsByMetadataIdMinTokenIdAsc = 'NFTS_BY_METADATA_ID_MIN_TOKEN_ID_ASC',
  NftsByMetadataIdMinTokenIdDesc = 'NFTS_BY_METADATA_ID_MIN_TOKEN_ID_DESC',
  NftsByMetadataIdStddevPopulationAmountAsc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_AMOUNT_ASC',
  NftsByMetadataIdStddevPopulationAmountDesc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_AMOUNT_DESC',
  NftsByMetadataIdStddevPopulationCollectionIdAsc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_COLLECTION_ID_ASC',
  NftsByMetadataIdStddevPopulationCollectionIdDesc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_COLLECTION_ID_DESC',
  NftsByMetadataIdStddevPopulationCurrentOwnerAsc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_CURRENT_OWNER_ASC',
  NftsByMetadataIdStddevPopulationCurrentOwnerDesc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_CURRENT_OWNER_DESC',
  NftsByMetadataIdStddevPopulationIdAsc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_ID_ASC',
  NftsByMetadataIdStddevPopulationIdDesc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_ID_DESC',
  NftsByMetadataIdStddevPopulationMetadataIdAsc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_METADATA_ID_ASC',
  NftsByMetadataIdStddevPopulationMetadataIdDesc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_METADATA_ID_DESC',
  NftsByMetadataIdStddevPopulationMintedBlockAsc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_MINTED_BLOCK_ASC',
  NftsByMetadataIdStddevPopulationMintedBlockDesc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_MINTED_BLOCK_DESC',
  NftsByMetadataIdStddevPopulationMintedTimestampAsc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_MINTED_TIMESTAMP_ASC',
  NftsByMetadataIdStddevPopulationMintedTimestampDesc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_MINTED_TIMESTAMP_DESC',
  NftsByMetadataIdStddevPopulationMinterAddressAsc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_MINTER_ADDRESS_ASC',
  NftsByMetadataIdStddevPopulationMinterAddressDesc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_MINTER_ADDRESS_DESC',
  NftsByMetadataIdStddevPopulationTokenIdAsc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_TOKEN_ID_ASC',
  NftsByMetadataIdStddevPopulationTokenIdDesc = 'NFTS_BY_METADATA_ID_STDDEV_POPULATION_TOKEN_ID_DESC',
  NftsByMetadataIdStddevSampleAmountAsc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_AMOUNT_ASC',
  NftsByMetadataIdStddevSampleAmountDesc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_AMOUNT_DESC',
  NftsByMetadataIdStddevSampleCollectionIdAsc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_COLLECTION_ID_ASC',
  NftsByMetadataIdStddevSampleCollectionIdDesc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_COLLECTION_ID_DESC',
  NftsByMetadataIdStddevSampleCurrentOwnerAsc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_CURRENT_OWNER_ASC',
  NftsByMetadataIdStddevSampleCurrentOwnerDesc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_CURRENT_OWNER_DESC',
  NftsByMetadataIdStddevSampleIdAsc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_ID_ASC',
  NftsByMetadataIdStddevSampleIdDesc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_ID_DESC',
  NftsByMetadataIdStddevSampleMetadataIdAsc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_METADATA_ID_ASC',
  NftsByMetadataIdStddevSampleMetadataIdDesc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_METADATA_ID_DESC',
  NftsByMetadataIdStddevSampleMintedBlockAsc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_MINTED_BLOCK_ASC',
  NftsByMetadataIdStddevSampleMintedBlockDesc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_MINTED_BLOCK_DESC',
  NftsByMetadataIdStddevSampleMintedTimestampAsc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_MINTED_TIMESTAMP_ASC',
  NftsByMetadataIdStddevSampleMintedTimestampDesc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_MINTED_TIMESTAMP_DESC',
  NftsByMetadataIdStddevSampleMinterAddressAsc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_MINTER_ADDRESS_ASC',
  NftsByMetadataIdStddevSampleMinterAddressDesc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_MINTER_ADDRESS_DESC',
  NftsByMetadataIdStddevSampleTokenIdAsc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_TOKEN_ID_ASC',
  NftsByMetadataIdStddevSampleTokenIdDesc = 'NFTS_BY_METADATA_ID_STDDEV_SAMPLE_TOKEN_ID_DESC',
  NftsByMetadataIdSumAmountAsc = 'NFTS_BY_METADATA_ID_SUM_AMOUNT_ASC',
  NftsByMetadataIdSumAmountDesc = 'NFTS_BY_METADATA_ID_SUM_AMOUNT_DESC',
  NftsByMetadataIdSumCollectionIdAsc = 'NFTS_BY_METADATA_ID_SUM_COLLECTION_ID_ASC',
  NftsByMetadataIdSumCollectionIdDesc = 'NFTS_BY_METADATA_ID_SUM_COLLECTION_ID_DESC',
  NftsByMetadataIdSumCurrentOwnerAsc = 'NFTS_BY_METADATA_ID_SUM_CURRENT_OWNER_ASC',
  NftsByMetadataIdSumCurrentOwnerDesc = 'NFTS_BY_METADATA_ID_SUM_CURRENT_OWNER_DESC',
  NftsByMetadataIdSumIdAsc = 'NFTS_BY_METADATA_ID_SUM_ID_ASC',
  NftsByMetadataIdSumIdDesc = 'NFTS_BY_METADATA_ID_SUM_ID_DESC',
  NftsByMetadataIdSumMetadataIdAsc = 'NFTS_BY_METADATA_ID_SUM_METADATA_ID_ASC',
  NftsByMetadataIdSumMetadataIdDesc = 'NFTS_BY_METADATA_ID_SUM_METADATA_ID_DESC',
  NftsByMetadataIdSumMintedBlockAsc = 'NFTS_BY_METADATA_ID_SUM_MINTED_BLOCK_ASC',
  NftsByMetadataIdSumMintedBlockDesc = 'NFTS_BY_METADATA_ID_SUM_MINTED_BLOCK_DESC',
  NftsByMetadataIdSumMintedTimestampAsc = 'NFTS_BY_METADATA_ID_SUM_MINTED_TIMESTAMP_ASC',
  NftsByMetadataIdSumMintedTimestampDesc = 'NFTS_BY_METADATA_ID_SUM_MINTED_TIMESTAMP_DESC',
  NftsByMetadataIdSumMinterAddressAsc = 'NFTS_BY_METADATA_ID_SUM_MINTER_ADDRESS_ASC',
  NftsByMetadataIdSumMinterAddressDesc = 'NFTS_BY_METADATA_ID_SUM_MINTER_ADDRESS_DESC',
  NftsByMetadataIdSumTokenIdAsc = 'NFTS_BY_METADATA_ID_SUM_TOKEN_ID_ASC',
  NftsByMetadataIdSumTokenIdDesc = 'NFTS_BY_METADATA_ID_SUM_TOKEN_ID_DESC',
  NftsByMetadataIdVariancePopulationAmountAsc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_AMOUNT_ASC',
  NftsByMetadataIdVariancePopulationAmountDesc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_AMOUNT_DESC',
  NftsByMetadataIdVariancePopulationCollectionIdAsc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_COLLECTION_ID_ASC',
  NftsByMetadataIdVariancePopulationCollectionIdDesc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_COLLECTION_ID_DESC',
  NftsByMetadataIdVariancePopulationCurrentOwnerAsc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_CURRENT_OWNER_ASC',
  NftsByMetadataIdVariancePopulationCurrentOwnerDesc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_CURRENT_OWNER_DESC',
  NftsByMetadataIdVariancePopulationIdAsc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_ID_ASC',
  NftsByMetadataIdVariancePopulationIdDesc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_ID_DESC',
  NftsByMetadataIdVariancePopulationMetadataIdAsc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_METADATA_ID_ASC',
  NftsByMetadataIdVariancePopulationMetadataIdDesc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_METADATA_ID_DESC',
  NftsByMetadataIdVariancePopulationMintedBlockAsc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_MINTED_BLOCK_ASC',
  NftsByMetadataIdVariancePopulationMintedBlockDesc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_MINTED_BLOCK_DESC',
  NftsByMetadataIdVariancePopulationMintedTimestampAsc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_MINTED_TIMESTAMP_ASC',
  NftsByMetadataIdVariancePopulationMintedTimestampDesc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_MINTED_TIMESTAMP_DESC',
  NftsByMetadataIdVariancePopulationMinterAddressAsc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_MINTER_ADDRESS_ASC',
  NftsByMetadataIdVariancePopulationMinterAddressDesc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_MINTER_ADDRESS_DESC',
  NftsByMetadataIdVariancePopulationTokenIdAsc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_TOKEN_ID_ASC',
  NftsByMetadataIdVariancePopulationTokenIdDesc = 'NFTS_BY_METADATA_ID_VARIANCE_POPULATION_TOKEN_ID_DESC',
  NftsByMetadataIdVarianceSampleAmountAsc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_AMOUNT_ASC',
  NftsByMetadataIdVarianceSampleAmountDesc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_AMOUNT_DESC',
  NftsByMetadataIdVarianceSampleCollectionIdAsc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_COLLECTION_ID_ASC',
  NftsByMetadataIdVarianceSampleCollectionIdDesc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_COLLECTION_ID_DESC',
  NftsByMetadataIdVarianceSampleCurrentOwnerAsc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_CURRENT_OWNER_ASC',
  NftsByMetadataIdVarianceSampleCurrentOwnerDesc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_CURRENT_OWNER_DESC',
  NftsByMetadataIdVarianceSampleIdAsc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_ID_ASC',
  NftsByMetadataIdVarianceSampleIdDesc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_ID_DESC',
  NftsByMetadataIdVarianceSampleMetadataIdAsc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_METADATA_ID_ASC',
  NftsByMetadataIdVarianceSampleMetadataIdDesc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_METADATA_ID_DESC',
  NftsByMetadataIdVarianceSampleMintedBlockAsc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_MINTED_BLOCK_ASC',
  NftsByMetadataIdVarianceSampleMintedBlockDesc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_MINTED_BLOCK_DESC',
  NftsByMetadataIdVarianceSampleMintedTimestampAsc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_MINTED_TIMESTAMP_ASC',
  NftsByMetadataIdVarianceSampleMintedTimestampDesc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_MINTED_TIMESTAMP_DESC',
  NftsByMetadataIdVarianceSampleMinterAddressAsc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_MINTER_ADDRESS_ASC',
  NftsByMetadataIdVarianceSampleMinterAddressDesc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_MINTER_ADDRESS_DESC',
  NftsByMetadataIdVarianceSampleTokenIdAsc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_TOKEN_ID_ASC',
  NftsByMetadataIdVarianceSampleTokenIdDesc = 'NFTS_BY_METADATA_ID_VARIANCE_SAMPLE_TOKEN_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RawAsc = 'RAW_ASC',
  RawDesc = 'RAW_DESC',
  SymbolAsc = 'SYMBOL_ASC',
  SymbolDesc = 'SYMBOL_DESC',
  TokenUriAsc = 'TOKEN_URI_ASC',
  TokenUriDesc = 'TOKEN_URI_DESC',
}

export type Metadatum = Node & {
  __typename?: 'Metadatum'
  /** Reads and enables pagination through a set of `Collection`. */
  collectionsByNftMetadataIdAndCollectionId: MetadatumCollectionsByNftMetadataIdAndCollectionIdManyToManyConnection
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  imageUri?: Maybe<Scalars['String']['output']>
  metadataStatus: StatusType
  metadataUri: Scalars['String']['output']
  name?: Maybe<Scalars['String']['output']>
  /** Reads and enables pagination through a set of `Nft`. */
  nftsByMetadataId: NftsConnection
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  raw?: Maybe<Scalars['JSON']['output']>
  symbol?: Maybe<Scalars['String']['output']>
  tokenUri?: Maybe<Scalars['String']['output']>
}

export type MetadatumCollectionsByNftMetadataIdAndCollectionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Collections_Distinct_Enum>>>
  filter?: InputMaybe<CollectionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CollectionsOrderBy>>
}

export type MetadatumNftsByMetadataIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Nfts_Distinct_Enum>>>
  filter?: InputMaybe<NftFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NftsOrderBy>>
}

export type MetadatumAggregates = {
  __typename?: 'MetadatumAggregates'
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<MetadatumDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
}

/** A connection to a list of `Collection` values, with data from `Nft`. */
export type MetadatumCollectionsByNftMetadataIdAndCollectionIdManyToManyConnection = {
  __typename?: 'MetadatumCollectionsByNftMetadataIdAndCollectionIdManyToManyConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<CollectionAggregates>
  /** A list of edges which contains the `Collection`, info from the `Nft`, and the cursor to aid in pagination. */
  edges: Array<MetadatumCollectionsByNftMetadataIdAndCollectionIdManyToManyEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<CollectionAggregates>>
  /** A list of `Collection` objects. */
  nodes: Array<Maybe<Collection>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Collection` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `Collection` values, with data from `Nft`. */
export type MetadatumCollectionsByNftMetadataIdAndCollectionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: Array<CollectionsGroupBy>
  having?: InputMaybe<CollectionsHavingInput>
}

/** A `Collection` edge in the connection, with data from `Nft`. */
export type MetadatumCollectionsByNftMetadataIdAndCollectionIdManyToManyEdge = {
  __typename?: 'MetadatumCollectionsByNftMetadataIdAndCollectionIdManyToManyEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** Reads and enables pagination through a set of `Nft`. */
  nfts: NftsConnection
  /** The `Collection` at the end of the edge. */
  node?: Maybe<Collection>
}

/** A `Collection` edge in the connection, with data from `Nft`. */
export type MetadatumCollectionsByNftMetadataIdAndCollectionIdManyToManyEdgeNftsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Nfts_Distinct_Enum>>>
  filter?: InputMaybe<NftFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NftsOrderBy>>
}

export type MetadatumDistinctCountAggregates = {
  __typename?: 'MetadatumDistinctCountAggregates'
  /** Distinct count of description across the matching connection */
  description?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of imageUri across the matching connection */
  imageUri?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of metadataStatus across the matching connection */
  metadataStatus?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of metadataUri across the matching connection */
  metadataUri?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of raw across the matching connection */
  raw?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of symbol across the matching connection */
  symbol?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of tokenUri across the matching connection */
  tokenUri?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `Metadatum` object types. All fields are combined with a logical ‘and.’ */
export type MetadatumFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MetadatumFilter>>
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Filter by the object’s `imageUri` field. */
  imageUri?: InputMaybe<StringFilter>
  /** Filter by the object’s `metadataStatus` field. */
  metadataStatus?: InputMaybe<StatusTypeFilter>
  /** Filter by the object’s `metadataUri` field. */
  metadataUri?: InputMaybe<StringFilter>
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>
  /** Filter by the object’s `nftsByMetadataId` relation. */
  nftsByMetadataId?: InputMaybe<MetadatumToManyNftFilter>
  /** Some related `nftsByMetadataId` exist. */
  nftsByMetadataIdExist?: InputMaybe<Scalars['Boolean']['input']>
  /** Negates the expression. */
  not?: InputMaybe<MetadatumFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MetadatumFilter>>
  /** Filter by the object’s `raw` field. */
  raw?: InputMaybe<JsonFilter>
  /** Filter by the object’s `symbol` field. */
  symbol?: InputMaybe<StringFilter>
  /** Filter by the object’s `tokenUri` field. */
  tokenUri?: InputMaybe<StringFilter>
}

/** A filter to be used against many `Nft` object types. All fields are combined with a logical ‘and.’ */
export type MetadatumToManyNftFilter = {
  /** Aggregates across related `Nft` match the filter criteria. */
  aggregates?: InputMaybe<NftAggregatesFilter>
  /** Every related `Nft` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<NftFilter>
  /** No related `Nft` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<NftFilter>
  /** Some related `Nft` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<NftFilter>
}

export type Network = Node & {
  __typename?: 'Network'
  /** Reads and enables pagination through a set of `Account`. */
  accountsByAddressNetworkIdAndAccountId: NetworkAccountsByAddressNetworkIdAndAccountIdManyToManyConnection
  /** Reads and enables pagination through a set of `Address`. */
  addresses: AddressesConnection
  /** Reads and enables pagination through a set of `Collection`. */
  collections: CollectionsConnection
  id: Scalars['String']['output']
  /** Reads and enables pagination through a set of `Nft`. */
  nftsByTransferNetworkIdAndNftId: NetworkNftsByTransferNetworkIdAndNftIdManyToManyConnection
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  /** Reads and enables pagination through a set of `Transfer`. */
  transfers: TransfersConnection
}

export type NetworkAccountsByAddressNetworkIdAndAccountIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Accounts_Distinct_Enum>>>
  filter?: InputMaybe<AccountFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AccountsOrderBy>>
}

export type NetworkAddressesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Addresses_Distinct_Enum>>>
  filter?: InputMaybe<AddressFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AddressesOrderBy>>
}

export type NetworkCollectionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Collections_Distinct_Enum>>>
  filter?: InputMaybe<CollectionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CollectionsOrderBy>>
}

export type NetworkNftsByTransferNetworkIdAndNftIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Nfts_Distinct_Enum>>>
  filter?: InputMaybe<NftFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NftsOrderBy>>
}

export type NetworkTransfersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Transfers_Distinct_Enum>>>
  filter?: InputMaybe<TransferFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<TransfersOrderBy>>
}

/** A connection to a list of `Account` values, with data from `Address`. */
export type NetworkAccountsByAddressNetworkIdAndAccountIdManyToManyConnection = {
  __typename?: 'NetworkAccountsByAddressNetworkIdAndAccountIdManyToManyConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>
  /** A list of edges which contains the `Account`, info from the `Address`, and the cursor to aid in pagination. */
  edges: Array<NetworkAccountsByAddressNetworkIdAndAccountIdManyToManyEdge>
  /** A list of `Account` objects. */
  nodes: Array<Maybe<Account>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Account` edge in the connection, with data from `Address`. */
export type NetworkAccountsByAddressNetworkIdAndAccountIdManyToManyEdge = {
  __typename?: 'NetworkAccountsByAddressNetworkIdAndAccountIdManyToManyEdge'
  /** Reads and enables pagination through a set of `Address`. */
  addresses: AddressesConnection
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>
}

/** A `Account` edge in the connection, with data from `Address`. */
export type NetworkAccountsByAddressNetworkIdAndAccountIdManyToManyEdgeAddressesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Addresses_Distinct_Enum>>>
  filter?: InputMaybe<AddressFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AddressesOrderBy>>
}

export type NetworkAggregates = {
  __typename?: 'NetworkAggregates'
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<NetworkDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
}

export type NetworkDistinctCountAggregates = {
  __typename?: 'NetworkDistinctCountAggregates'
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `Network` object types. All fields are combined with a logical ‘and.’ */
export type NetworkFilter = {
  /** Filter by the object’s `addresses` relation. */
  addresses?: InputMaybe<NetworkToManyAddressFilter>
  /** Some related `addresses` exist. */
  addressesExist?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<NetworkFilter>>
  /** Filter by the object’s `collections` relation. */
  collections?: InputMaybe<NetworkToManyCollectionFilter>
  /** Some related `collections` exist. */
  collectionsExist?: InputMaybe<Scalars['Boolean']['input']>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<NetworkFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<NetworkFilter>>
  /** Filter by the object’s `transfers` relation. */
  transfers?: InputMaybe<NetworkToManyTransferFilter>
  /** Some related `transfers` exist. */
  transfersExist?: InputMaybe<Scalars['Boolean']['input']>
}

/** A connection to a list of `Nft` values, with data from `Transfer`. */
export type NetworkNftsByTransferNetworkIdAndNftIdManyToManyConnection = {
  __typename?: 'NetworkNftsByTransferNetworkIdAndNftIdManyToManyConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<NftAggregates>
  /** A list of edges which contains the `Nft`, info from the `Transfer`, and the cursor to aid in pagination. */
  edges: Array<NetworkNftsByTransferNetworkIdAndNftIdManyToManyEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<NftAggregates>>
  /** A list of `Nft` objects. */
  nodes: Array<Maybe<Nft>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Nft` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `Nft` values, with data from `Transfer`. */
export type NetworkNftsByTransferNetworkIdAndNftIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: Array<NftsGroupBy>
  having?: InputMaybe<NftsHavingInput>
}

/** A `Nft` edge in the connection, with data from `Transfer`. */
export type NetworkNftsByTransferNetworkIdAndNftIdManyToManyEdge = {
  __typename?: 'NetworkNftsByTransferNetworkIdAndNftIdManyToManyEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Nft` at the end of the edge. */
  node?: Maybe<Nft>
  /** Reads and enables pagination through a set of `Transfer`. */
  transfers: TransfersConnection
}

/** A `Nft` edge in the connection, with data from `Transfer`. */
export type NetworkNftsByTransferNetworkIdAndNftIdManyToManyEdgeTransfersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Transfers_Distinct_Enum>>>
  filter?: InputMaybe<TransferFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<TransfersOrderBy>>
}

/** A filter to be used against many `Address` object types. All fields are combined with a logical ‘and.’ */
export type NetworkToManyAddressFilter = {
  /** Aggregates across related `Address` match the filter criteria. */
  aggregates?: InputMaybe<AddressAggregatesFilter>
  /** Every related `Address` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<AddressFilter>
  /** No related `Address` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<AddressFilter>
  /** Some related `Address` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<AddressFilter>
}

/** A filter to be used against many `Collection` object types. All fields are combined with a logical ‘and.’ */
export type NetworkToManyCollectionFilter = {
  /** Aggregates across related `Collection` match the filter criteria. */
  aggregates?: InputMaybe<CollectionAggregatesFilter>
  /** Every related `Collection` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CollectionFilter>
  /** No related `Collection` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CollectionFilter>
  /** Some related `Collection` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CollectionFilter>
}

/** A filter to be used against many `Transfer` object types. All fields are combined with a logical ‘and.’ */
export type NetworkToManyTransferFilter = {
  /** Aggregates across related `Transfer` match the filter criteria. */
  aggregates?: InputMaybe<TransferAggregatesFilter>
  /** Every related `Transfer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TransferFilter>
  /** No related `Transfer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TransferFilter>
  /** Some related `Transfer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TransferFilter>
}

/** A connection to a list of `Network` values. */
export type NetworksConnection = {
  __typename?: 'NetworksConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<NetworkAggregates>
  /** A list of edges which contains the `Network` and cursor to aid in pagination. */
  edges: Array<NetworksEdge>
  /** A list of `Network` objects. */
  nodes: Array<Maybe<Network>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Network` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Network` edge in the connection. */
export type NetworksEdge = {
  __typename?: 'NetworksEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Network` at the end of the edge. */
  node?: Maybe<Network>
}

/** Methods to use when ordering `Network`. */
export enum NetworksOrderBy {
  AddressesAverageAccountIdAsc = 'ADDRESSES_AVERAGE_ACCOUNT_ID_ASC',
  AddressesAverageAccountIdDesc = 'ADDRESSES_AVERAGE_ACCOUNT_ID_DESC',
  AddressesAverageIdAsc = 'ADDRESSES_AVERAGE_ID_ASC',
  AddressesAverageIdDesc = 'ADDRESSES_AVERAGE_ID_DESC',
  AddressesAverageNetworkIdAsc = 'ADDRESSES_AVERAGE_NETWORK_ID_ASC',
  AddressesAverageNetworkIdDesc = 'ADDRESSES_AVERAGE_NETWORK_ID_DESC',
  AddressesCountAsc = 'ADDRESSES_COUNT_ASC',
  AddressesCountDesc = 'ADDRESSES_COUNT_DESC',
  AddressesDistinctCountAccountIdAsc = 'ADDRESSES_DISTINCT_COUNT_ACCOUNT_ID_ASC',
  AddressesDistinctCountAccountIdDesc = 'ADDRESSES_DISTINCT_COUNT_ACCOUNT_ID_DESC',
  AddressesDistinctCountIdAsc = 'ADDRESSES_DISTINCT_COUNT_ID_ASC',
  AddressesDistinctCountIdDesc = 'ADDRESSES_DISTINCT_COUNT_ID_DESC',
  AddressesDistinctCountNetworkIdAsc = 'ADDRESSES_DISTINCT_COUNT_NETWORK_ID_ASC',
  AddressesDistinctCountNetworkIdDesc = 'ADDRESSES_DISTINCT_COUNT_NETWORK_ID_DESC',
  AddressesMaxAccountIdAsc = 'ADDRESSES_MAX_ACCOUNT_ID_ASC',
  AddressesMaxAccountIdDesc = 'ADDRESSES_MAX_ACCOUNT_ID_DESC',
  AddressesMaxIdAsc = 'ADDRESSES_MAX_ID_ASC',
  AddressesMaxIdDesc = 'ADDRESSES_MAX_ID_DESC',
  AddressesMaxNetworkIdAsc = 'ADDRESSES_MAX_NETWORK_ID_ASC',
  AddressesMaxNetworkIdDesc = 'ADDRESSES_MAX_NETWORK_ID_DESC',
  AddressesMinAccountIdAsc = 'ADDRESSES_MIN_ACCOUNT_ID_ASC',
  AddressesMinAccountIdDesc = 'ADDRESSES_MIN_ACCOUNT_ID_DESC',
  AddressesMinIdAsc = 'ADDRESSES_MIN_ID_ASC',
  AddressesMinIdDesc = 'ADDRESSES_MIN_ID_DESC',
  AddressesMinNetworkIdAsc = 'ADDRESSES_MIN_NETWORK_ID_ASC',
  AddressesMinNetworkIdDesc = 'ADDRESSES_MIN_NETWORK_ID_DESC',
  AddressesStddevPopulationAccountIdAsc = 'ADDRESSES_STDDEV_POPULATION_ACCOUNT_ID_ASC',
  AddressesStddevPopulationAccountIdDesc = 'ADDRESSES_STDDEV_POPULATION_ACCOUNT_ID_DESC',
  AddressesStddevPopulationIdAsc = 'ADDRESSES_STDDEV_POPULATION_ID_ASC',
  AddressesStddevPopulationIdDesc = 'ADDRESSES_STDDEV_POPULATION_ID_DESC',
  AddressesStddevPopulationNetworkIdAsc = 'ADDRESSES_STDDEV_POPULATION_NETWORK_ID_ASC',
  AddressesStddevPopulationNetworkIdDesc = 'ADDRESSES_STDDEV_POPULATION_NETWORK_ID_DESC',
  AddressesStddevSampleAccountIdAsc = 'ADDRESSES_STDDEV_SAMPLE_ACCOUNT_ID_ASC',
  AddressesStddevSampleAccountIdDesc = 'ADDRESSES_STDDEV_SAMPLE_ACCOUNT_ID_DESC',
  AddressesStddevSampleIdAsc = 'ADDRESSES_STDDEV_SAMPLE_ID_ASC',
  AddressesStddevSampleIdDesc = 'ADDRESSES_STDDEV_SAMPLE_ID_DESC',
  AddressesStddevSampleNetworkIdAsc = 'ADDRESSES_STDDEV_SAMPLE_NETWORK_ID_ASC',
  AddressesStddevSampleNetworkIdDesc = 'ADDRESSES_STDDEV_SAMPLE_NETWORK_ID_DESC',
  AddressesSumAccountIdAsc = 'ADDRESSES_SUM_ACCOUNT_ID_ASC',
  AddressesSumAccountIdDesc = 'ADDRESSES_SUM_ACCOUNT_ID_DESC',
  AddressesSumIdAsc = 'ADDRESSES_SUM_ID_ASC',
  AddressesSumIdDesc = 'ADDRESSES_SUM_ID_DESC',
  AddressesSumNetworkIdAsc = 'ADDRESSES_SUM_NETWORK_ID_ASC',
  AddressesSumNetworkIdDesc = 'ADDRESSES_SUM_NETWORK_ID_DESC',
  AddressesVariancePopulationAccountIdAsc = 'ADDRESSES_VARIANCE_POPULATION_ACCOUNT_ID_ASC',
  AddressesVariancePopulationAccountIdDesc = 'ADDRESSES_VARIANCE_POPULATION_ACCOUNT_ID_DESC',
  AddressesVariancePopulationIdAsc = 'ADDRESSES_VARIANCE_POPULATION_ID_ASC',
  AddressesVariancePopulationIdDesc = 'ADDRESSES_VARIANCE_POPULATION_ID_DESC',
  AddressesVariancePopulationNetworkIdAsc = 'ADDRESSES_VARIANCE_POPULATION_NETWORK_ID_ASC',
  AddressesVariancePopulationNetworkIdDesc = 'ADDRESSES_VARIANCE_POPULATION_NETWORK_ID_DESC',
  AddressesVarianceSampleAccountIdAsc = 'ADDRESSES_VARIANCE_SAMPLE_ACCOUNT_ID_ASC',
  AddressesVarianceSampleAccountIdDesc = 'ADDRESSES_VARIANCE_SAMPLE_ACCOUNT_ID_DESC',
  AddressesVarianceSampleIdAsc = 'ADDRESSES_VARIANCE_SAMPLE_ID_ASC',
  AddressesVarianceSampleIdDesc = 'ADDRESSES_VARIANCE_SAMPLE_ID_DESC',
  AddressesVarianceSampleNetworkIdAsc = 'ADDRESSES_VARIANCE_SAMPLE_NETWORK_ID_ASC',
  AddressesVarianceSampleNetworkIdDesc = 'ADDRESSES_VARIANCE_SAMPLE_NETWORK_ID_DESC',
  CollectionsAverageContractAddressAsc = 'COLLECTIONS_AVERAGE_CONTRACT_ADDRESS_ASC',
  CollectionsAverageContractAddressDesc = 'COLLECTIONS_AVERAGE_CONTRACT_ADDRESS_DESC',
  CollectionsAverageContractTypeAsc = 'COLLECTIONS_AVERAGE_CONTRACT_TYPE_ASC',
  CollectionsAverageContractTypeDesc = 'COLLECTIONS_AVERAGE_CONTRACT_TYPE_DESC',
  CollectionsAverageCreatedBlockAsc = 'COLLECTIONS_AVERAGE_CREATED_BLOCK_ASC',
  CollectionsAverageCreatedBlockDesc = 'COLLECTIONS_AVERAGE_CREATED_BLOCK_DESC',
  CollectionsAverageCreatedTimestampAsc = 'COLLECTIONS_AVERAGE_CREATED_TIMESTAMP_ASC',
  CollectionsAverageCreatedTimestampDesc = 'COLLECTIONS_AVERAGE_CREATED_TIMESTAMP_DESC',
  CollectionsAverageCreatorAddressAsc = 'COLLECTIONS_AVERAGE_CREATOR_ADDRESS_ASC',
  CollectionsAverageCreatorAddressDesc = 'COLLECTIONS_AVERAGE_CREATOR_ADDRESS_DESC',
  CollectionsAverageIdAsc = 'COLLECTIONS_AVERAGE_ID_ASC',
  CollectionsAverageIdDesc = 'COLLECTIONS_AVERAGE_ID_DESC',
  CollectionsAverageNameAsc = 'COLLECTIONS_AVERAGE_NAME_ASC',
  CollectionsAverageNameDesc = 'COLLECTIONS_AVERAGE_NAME_DESC',
  CollectionsAverageNetworkIdAsc = 'COLLECTIONS_AVERAGE_NETWORK_ID_ASC',
  CollectionsAverageNetworkIdDesc = 'COLLECTIONS_AVERAGE_NETWORK_ID_DESC',
  CollectionsAverageSymbolAsc = 'COLLECTIONS_AVERAGE_SYMBOL_ASC',
  CollectionsAverageSymbolDesc = 'COLLECTIONS_AVERAGE_SYMBOL_DESC',
  CollectionsAverageTotalSupplyAsc = 'COLLECTIONS_AVERAGE_TOTAL_SUPPLY_ASC',
  CollectionsAverageTotalSupplyDesc = 'COLLECTIONS_AVERAGE_TOTAL_SUPPLY_DESC',
  CollectionsCountAsc = 'COLLECTIONS_COUNT_ASC',
  CollectionsCountDesc = 'COLLECTIONS_COUNT_DESC',
  CollectionsDistinctCountContractAddressAsc = 'COLLECTIONS_DISTINCT_COUNT_CONTRACT_ADDRESS_ASC',
  CollectionsDistinctCountContractAddressDesc = 'COLLECTIONS_DISTINCT_COUNT_CONTRACT_ADDRESS_DESC',
  CollectionsDistinctCountContractTypeAsc = 'COLLECTIONS_DISTINCT_COUNT_CONTRACT_TYPE_ASC',
  CollectionsDistinctCountContractTypeDesc = 'COLLECTIONS_DISTINCT_COUNT_CONTRACT_TYPE_DESC',
  CollectionsDistinctCountCreatedBlockAsc = 'COLLECTIONS_DISTINCT_COUNT_CREATED_BLOCK_ASC',
  CollectionsDistinctCountCreatedBlockDesc = 'COLLECTIONS_DISTINCT_COUNT_CREATED_BLOCK_DESC',
  CollectionsDistinctCountCreatedTimestampAsc = 'COLLECTIONS_DISTINCT_COUNT_CREATED_TIMESTAMP_ASC',
  CollectionsDistinctCountCreatedTimestampDesc = 'COLLECTIONS_DISTINCT_COUNT_CREATED_TIMESTAMP_DESC',
  CollectionsDistinctCountCreatorAddressAsc = 'COLLECTIONS_DISTINCT_COUNT_CREATOR_ADDRESS_ASC',
  CollectionsDistinctCountCreatorAddressDesc = 'COLLECTIONS_DISTINCT_COUNT_CREATOR_ADDRESS_DESC',
  CollectionsDistinctCountIdAsc = 'COLLECTIONS_DISTINCT_COUNT_ID_ASC',
  CollectionsDistinctCountIdDesc = 'COLLECTIONS_DISTINCT_COUNT_ID_DESC',
  CollectionsDistinctCountNameAsc = 'COLLECTIONS_DISTINCT_COUNT_NAME_ASC',
  CollectionsDistinctCountNameDesc = 'COLLECTIONS_DISTINCT_COUNT_NAME_DESC',
  CollectionsDistinctCountNetworkIdAsc = 'COLLECTIONS_DISTINCT_COUNT_NETWORK_ID_ASC',
  CollectionsDistinctCountNetworkIdDesc = 'COLLECTIONS_DISTINCT_COUNT_NETWORK_ID_DESC',
  CollectionsDistinctCountSymbolAsc = 'COLLECTIONS_DISTINCT_COUNT_SYMBOL_ASC',
  CollectionsDistinctCountSymbolDesc = 'COLLECTIONS_DISTINCT_COUNT_SYMBOL_DESC',
  CollectionsDistinctCountTotalSupplyAsc = 'COLLECTIONS_DISTINCT_COUNT_TOTAL_SUPPLY_ASC',
  CollectionsDistinctCountTotalSupplyDesc = 'COLLECTIONS_DISTINCT_COUNT_TOTAL_SUPPLY_DESC',
  CollectionsMaxContractAddressAsc = 'COLLECTIONS_MAX_CONTRACT_ADDRESS_ASC',
  CollectionsMaxContractAddressDesc = 'COLLECTIONS_MAX_CONTRACT_ADDRESS_DESC',
  CollectionsMaxContractTypeAsc = 'COLLECTIONS_MAX_CONTRACT_TYPE_ASC',
  CollectionsMaxContractTypeDesc = 'COLLECTIONS_MAX_CONTRACT_TYPE_DESC',
  CollectionsMaxCreatedBlockAsc = 'COLLECTIONS_MAX_CREATED_BLOCK_ASC',
  CollectionsMaxCreatedBlockDesc = 'COLLECTIONS_MAX_CREATED_BLOCK_DESC',
  CollectionsMaxCreatedTimestampAsc = 'COLLECTIONS_MAX_CREATED_TIMESTAMP_ASC',
  CollectionsMaxCreatedTimestampDesc = 'COLLECTIONS_MAX_CREATED_TIMESTAMP_DESC',
  CollectionsMaxCreatorAddressAsc = 'COLLECTIONS_MAX_CREATOR_ADDRESS_ASC',
  CollectionsMaxCreatorAddressDesc = 'COLLECTIONS_MAX_CREATOR_ADDRESS_DESC',
  CollectionsMaxIdAsc = 'COLLECTIONS_MAX_ID_ASC',
  CollectionsMaxIdDesc = 'COLLECTIONS_MAX_ID_DESC',
  CollectionsMaxNameAsc = 'COLLECTIONS_MAX_NAME_ASC',
  CollectionsMaxNameDesc = 'COLLECTIONS_MAX_NAME_DESC',
  CollectionsMaxNetworkIdAsc = 'COLLECTIONS_MAX_NETWORK_ID_ASC',
  CollectionsMaxNetworkIdDesc = 'COLLECTIONS_MAX_NETWORK_ID_DESC',
  CollectionsMaxSymbolAsc = 'COLLECTIONS_MAX_SYMBOL_ASC',
  CollectionsMaxSymbolDesc = 'COLLECTIONS_MAX_SYMBOL_DESC',
  CollectionsMaxTotalSupplyAsc = 'COLLECTIONS_MAX_TOTAL_SUPPLY_ASC',
  CollectionsMaxTotalSupplyDesc = 'COLLECTIONS_MAX_TOTAL_SUPPLY_DESC',
  CollectionsMinContractAddressAsc = 'COLLECTIONS_MIN_CONTRACT_ADDRESS_ASC',
  CollectionsMinContractAddressDesc = 'COLLECTIONS_MIN_CONTRACT_ADDRESS_DESC',
  CollectionsMinContractTypeAsc = 'COLLECTIONS_MIN_CONTRACT_TYPE_ASC',
  CollectionsMinContractTypeDesc = 'COLLECTIONS_MIN_CONTRACT_TYPE_DESC',
  CollectionsMinCreatedBlockAsc = 'COLLECTIONS_MIN_CREATED_BLOCK_ASC',
  CollectionsMinCreatedBlockDesc = 'COLLECTIONS_MIN_CREATED_BLOCK_DESC',
  CollectionsMinCreatedTimestampAsc = 'COLLECTIONS_MIN_CREATED_TIMESTAMP_ASC',
  CollectionsMinCreatedTimestampDesc = 'COLLECTIONS_MIN_CREATED_TIMESTAMP_DESC',
  CollectionsMinCreatorAddressAsc = 'COLLECTIONS_MIN_CREATOR_ADDRESS_ASC',
  CollectionsMinCreatorAddressDesc = 'COLLECTIONS_MIN_CREATOR_ADDRESS_DESC',
  CollectionsMinIdAsc = 'COLLECTIONS_MIN_ID_ASC',
  CollectionsMinIdDesc = 'COLLECTIONS_MIN_ID_DESC',
  CollectionsMinNameAsc = 'COLLECTIONS_MIN_NAME_ASC',
  CollectionsMinNameDesc = 'COLLECTIONS_MIN_NAME_DESC',
  CollectionsMinNetworkIdAsc = 'COLLECTIONS_MIN_NETWORK_ID_ASC',
  CollectionsMinNetworkIdDesc = 'COLLECTIONS_MIN_NETWORK_ID_DESC',
  CollectionsMinSymbolAsc = 'COLLECTIONS_MIN_SYMBOL_ASC',
  CollectionsMinSymbolDesc = 'COLLECTIONS_MIN_SYMBOL_DESC',
  CollectionsMinTotalSupplyAsc = 'COLLECTIONS_MIN_TOTAL_SUPPLY_ASC',
  CollectionsMinTotalSupplyDesc = 'COLLECTIONS_MIN_TOTAL_SUPPLY_DESC',
  CollectionsStddevPopulationContractAddressAsc = 'COLLECTIONS_STDDEV_POPULATION_CONTRACT_ADDRESS_ASC',
  CollectionsStddevPopulationContractAddressDesc = 'COLLECTIONS_STDDEV_POPULATION_CONTRACT_ADDRESS_DESC',
  CollectionsStddevPopulationContractTypeAsc = 'COLLECTIONS_STDDEV_POPULATION_CONTRACT_TYPE_ASC',
  CollectionsStddevPopulationContractTypeDesc = 'COLLECTIONS_STDDEV_POPULATION_CONTRACT_TYPE_DESC',
  CollectionsStddevPopulationCreatedBlockAsc = 'COLLECTIONS_STDDEV_POPULATION_CREATED_BLOCK_ASC',
  CollectionsStddevPopulationCreatedBlockDesc = 'COLLECTIONS_STDDEV_POPULATION_CREATED_BLOCK_DESC',
  CollectionsStddevPopulationCreatedTimestampAsc = 'COLLECTIONS_STDDEV_POPULATION_CREATED_TIMESTAMP_ASC',
  CollectionsStddevPopulationCreatedTimestampDesc = 'COLLECTIONS_STDDEV_POPULATION_CREATED_TIMESTAMP_DESC',
  CollectionsStddevPopulationCreatorAddressAsc = 'COLLECTIONS_STDDEV_POPULATION_CREATOR_ADDRESS_ASC',
  CollectionsStddevPopulationCreatorAddressDesc = 'COLLECTIONS_STDDEV_POPULATION_CREATOR_ADDRESS_DESC',
  CollectionsStddevPopulationIdAsc = 'COLLECTIONS_STDDEV_POPULATION_ID_ASC',
  CollectionsStddevPopulationIdDesc = 'COLLECTIONS_STDDEV_POPULATION_ID_DESC',
  CollectionsStddevPopulationNameAsc = 'COLLECTIONS_STDDEV_POPULATION_NAME_ASC',
  CollectionsStddevPopulationNameDesc = 'COLLECTIONS_STDDEV_POPULATION_NAME_DESC',
  CollectionsStddevPopulationNetworkIdAsc = 'COLLECTIONS_STDDEV_POPULATION_NETWORK_ID_ASC',
  CollectionsStddevPopulationNetworkIdDesc = 'COLLECTIONS_STDDEV_POPULATION_NETWORK_ID_DESC',
  CollectionsStddevPopulationSymbolAsc = 'COLLECTIONS_STDDEV_POPULATION_SYMBOL_ASC',
  CollectionsStddevPopulationSymbolDesc = 'COLLECTIONS_STDDEV_POPULATION_SYMBOL_DESC',
  CollectionsStddevPopulationTotalSupplyAsc = 'COLLECTIONS_STDDEV_POPULATION_TOTAL_SUPPLY_ASC',
  CollectionsStddevPopulationTotalSupplyDesc = 'COLLECTIONS_STDDEV_POPULATION_TOTAL_SUPPLY_DESC',
  CollectionsStddevSampleContractAddressAsc = 'COLLECTIONS_STDDEV_SAMPLE_CONTRACT_ADDRESS_ASC',
  CollectionsStddevSampleContractAddressDesc = 'COLLECTIONS_STDDEV_SAMPLE_CONTRACT_ADDRESS_DESC',
  CollectionsStddevSampleContractTypeAsc = 'COLLECTIONS_STDDEV_SAMPLE_CONTRACT_TYPE_ASC',
  CollectionsStddevSampleContractTypeDesc = 'COLLECTIONS_STDDEV_SAMPLE_CONTRACT_TYPE_DESC',
  CollectionsStddevSampleCreatedBlockAsc = 'COLLECTIONS_STDDEV_SAMPLE_CREATED_BLOCK_ASC',
  CollectionsStddevSampleCreatedBlockDesc = 'COLLECTIONS_STDDEV_SAMPLE_CREATED_BLOCK_DESC',
  CollectionsStddevSampleCreatedTimestampAsc = 'COLLECTIONS_STDDEV_SAMPLE_CREATED_TIMESTAMP_ASC',
  CollectionsStddevSampleCreatedTimestampDesc = 'COLLECTIONS_STDDEV_SAMPLE_CREATED_TIMESTAMP_DESC',
  CollectionsStddevSampleCreatorAddressAsc = 'COLLECTIONS_STDDEV_SAMPLE_CREATOR_ADDRESS_ASC',
  CollectionsStddevSampleCreatorAddressDesc = 'COLLECTIONS_STDDEV_SAMPLE_CREATOR_ADDRESS_DESC',
  CollectionsStddevSampleIdAsc = 'COLLECTIONS_STDDEV_SAMPLE_ID_ASC',
  CollectionsStddevSampleIdDesc = 'COLLECTIONS_STDDEV_SAMPLE_ID_DESC',
  CollectionsStddevSampleNameAsc = 'COLLECTIONS_STDDEV_SAMPLE_NAME_ASC',
  CollectionsStddevSampleNameDesc = 'COLLECTIONS_STDDEV_SAMPLE_NAME_DESC',
  CollectionsStddevSampleNetworkIdAsc = 'COLLECTIONS_STDDEV_SAMPLE_NETWORK_ID_ASC',
  CollectionsStddevSampleNetworkIdDesc = 'COLLECTIONS_STDDEV_SAMPLE_NETWORK_ID_DESC',
  CollectionsStddevSampleSymbolAsc = 'COLLECTIONS_STDDEV_SAMPLE_SYMBOL_ASC',
  CollectionsStddevSampleSymbolDesc = 'COLLECTIONS_STDDEV_SAMPLE_SYMBOL_DESC',
  CollectionsStddevSampleTotalSupplyAsc = 'COLLECTIONS_STDDEV_SAMPLE_TOTAL_SUPPLY_ASC',
  CollectionsStddevSampleTotalSupplyDesc = 'COLLECTIONS_STDDEV_SAMPLE_TOTAL_SUPPLY_DESC',
  CollectionsSumContractAddressAsc = 'COLLECTIONS_SUM_CONTRACT_ADDRESS_ASC',
  CollectionsSumContractAddressDesc = 'COLLECTIONS_SUM_CONTRACT_ADDRESS_DESC',
  CollectionsSumContractTypeAsc = 'COLLECTIONS_SUM_CONTRACT_TYPE_ASC',
  CollectionsSumContractTypeDesc = 'COLLECTIONS_SUM_CONTRACT_TYPE_DESC',
  CollectionsSumCreatedBlockAsc = 'COLLECTIONS_SUM_CREATED_BLOCK_ASC',
  CollectionsSumCreatedBlockDesc = 'COLLECTIONS_SUM_CREATED_BLOCK_DESC',
  CollectionsSumCreatedTimestampAsc = 'COLLECTIONS_SUM_CREATED_TIMESTAMP_ASC',
  CollectionsSumCreatedTimestampDesc = 'COLLECTIONS_SUM_CREATED_TIMESTAMP_DESC',
  CollectionsSumCreatorAddressAsc = 'COLLECTIONS_SUM_CREATOR_ADDRESS_ASC',
  CollectionsSumCreatorAddressDesc = 'COLLECTIONS_SUM_CREATOR_ADDRESS_DESC',
  CollectionsSumIdAsc = 'COLLECTIONS_SUM_ID_ASC',
  CollectionsSumIdDesc = 'COLLECTIONS_SUM_ID_DESC',
  CollectionsSumNameAsc = 'COLLECTIONS_SUM_NAME_ASC',
  CollectionsSumNameDesc = 'COLLECTIONS_SUM_NAME_DESC',
  CollectionsSumNetworkIdAsc = 'COLLECTIONS_SUM_NETWORK_ID_ASC',
  CollectionsSumNetworkIdDesc = 'COLLECTIONS_SUM_NETWORK_ID_DESC',
  CollectionsSumSymbolAsc = 'COLLECTIONS_SUM_SYMBOL_ASC',
  CollectionsSumSymbolDesc = 'COLLECTIONS_SUM_SYMBOL_DESC',
  CollectionsSumTotalSupplyAsc = 'COLLECTIONS_SUM_TOTAL_SUPPLY_ASC',
  CollectionsSumTotalSupplyDesc = 'COLLECTIONS_SUM_TOTAL_SUPPLY_DESC',
  CollectionsVariancePopulationContractAddressAsc = 'COLLECTIONS_VARIANCE_POPULATION_CONTRACT_ADDRESS_ASC',
  CollectionsVariancePopulationContractAddressDesc = 'COLLECTIONS_VARIANCE_POPULATION_CONTRACT_ADDRESS_DESC',
  CollectionsVariancePopulationContractTypeAsc = 'COLLECTIONS_VARIANCE_POPULATION_CONTRACT_TYPE_ASC',
  CollectionsVariancePopulationContractTypeDesc = 'COLLECTIONS_VARIANCE_POPULATION_CONTRACT_TYPE_DESC',
  CollectionsVariancePopulationCreatedBlockAsc = 'COLLECTIONS_VARIANCE_POPULATION_CREATED_BLOCK_ASC',
  CollectionsVariancePopulationCreatedBlockDesc = 'COLLECTIONS_VARIANCE_POPULATION_CREATED_BLOCK_DESC',
  CollectionsVariancePopulationCreatedTimestampAsc = 'COLLECTIONS_VARIANCE_POPULATION_CREATED_TIMESTAMP_ASC',
  CollectionsVariancePopulationCreatedTimestampDesc = 'COLLECTIONS_VARIANCE_POPULATION_CREATED_TIMESTAMP_DESC',
  CollectionsVariancePopulationCreatorAddressAsc = 'COLLECTIONS_VARIANCE_POPULATION_CREATOR_ADDRESS_ASC',
  CollectionsVariancePopulationCreatorAddressDesc = 'COLLECTIONS_VARIANCE_POPULATION_CREATOR_ADDRESS_DESC',
  CollectionsVariancePopulationIdAsc = 'COLLECTIONS_VARIANCE_POPULATION_ID_ASC',
  CollectionsVariancePopulationIdDesc = 'COLLECTIONS_VARIANCE_POPULATION_ID_DESC',
  CollectionsVariancePopulationNameAsc = 'COLLECTIONS_VARIANCE_POPULATION_NAME_ASC',
  CollectionsVariancePopulationNameDesc = 'COLLECTIONS_VARIANCE_POPULATION_NAME_DESC',
  CollectionsVariancePopulationNetworkIdAsc = 'COLLECTIONS_VARIANCE_POPULATION_NETWORK_ID_ASC',
  CollectionsVariancePopulationNetworkIdDesc = 'COLLECTIONS_VARIANCE_POPULATION_NETWORK_ID_DESC',
  CollectionsVariancePopulationSymbolAsc = 'COLLECTIONS_VARIANCE_POPULATION_SYMBOL_ASC',
  CollectionsVariancePopulationSymbolDesc = 'COLLECTIONS_VARIANCE_POPULATION_SYMBOL_DESC',
  CollectionsVariancePopulationTotalSupplyAsc = 'COLLECTIONS_VARIANCE_POPULATION_TOTAL_SUPPLY_ASC',
  CollectionsVariancePopulationTotalSupplyDesc = 'COLLECTIONS_VARIANCE_POPULATION_TOTAL_SUPPLY_DESC',
  CollectionsVarianceSampleContractAddressAsc = 'COLLECTIONS_VARIANCE_SAMPLE_CONTRACT_ADDRESS_ASC',
  CollectionsVarianceSampleContractAddressDesc = 'COLLECTIONS_VARIANCE_SAMPLE_CONTRACT_ADDRESS_DESC',
  CollectionsVarianceSampleContractTypeAsc = 'COLLECTIONS_VARIANCE_SAMPLE_CONTRACT_TYPE_ASC',
  CollectionsVarianceSampleContractTypeDesc = 'COLLECTIONS_VARIANCE_SAMPLE_CONTRACT_TYPE_DESC',
  CollectionsVarianceSampleCreatedBlockAsc = 'COLLECTIONS_VARIANCE_SAMPLE_CREATED_BLOCK_ASC',
  CollectionsVarianceSampleCreatedBlockDesc = 'COLLECTIONS_VARIANCE_SAMPLE_CREATED_BLOCK_DESC',
  CollectionsVarianceSampleCreatedTimestampAsc = 'COLLECTIONS_VARIANCE_SAMPLE_CREATED_TIMESTAMP_ASC',
  CollectionsVarianceSampleCreatedTimestampDesc = 'COLLECTIONS_VARIANCE_SAMPLE_CREATED_TIMESTAMP_DESC',
  CollectionsVarianceSampleCreatorAddressAsc = 'COLLECTIONS_VARIANCE_SAMPLE_CREATOR_ADDRESS_ASC',
  CollectionsVarianceSampleCreatorAddressDesc = 'COLLECTIONS_VARIANCE_SAMPLE_CREATOR_ADDRESS_DESC',
  CollectionsVarianceSampleIdAsc = 'COLLECTIONS_VARIANCE_SAMPLE_ID_ASC',
  CollectionsVarianceSampleIdDesc = 'COLLECTIONS_VARIANCE_SAMPLE_ID_DESC',
  CollectionsVarianceSampleNameAsc = 'COLLECTIONS_VARIANCE_SAMPLE_NAME_ASC',
  CollectionsVarianceSampleNameDesc = 'COLLECTIONS_VARIANCE_SAMPLE_NAME_DESC',
  CollectionsVarianceSampleNetworkIdAsc = 'COLLECTIONS_VARIANCE_SAMPLE_NETWORK_ID_ASC',
  CollectionsVarianceSampleNetworkIdDesc = 'COLLECTIONS_VARIANCE_SAMPLE_NETWORK_ID_DESC',
  CollectionsVarianceSampleSymbolAsc = 'COLLECTIONS_VARIANCE_SAMPLE_SYMBOL_ASC',
  CollectionsVarianceSampleSymbolDesc = 'COLLECTIONS_VARIANCE_SAMPLE_SYMBOL_DESC',
  CollectionsVarianceSampleTotalSupplyAsc = 'COLLECTIONS_VARIANCE_SAMPLE_TOTAL_SUPPLY_ASC',
  CollectionsVarianceSampleTotalSupplyDesc = 'COLLECTIONS_VARIANCE_SAMPLE_TOTAL_SUPPLY_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TransfersAverageAmountAsc = 'TRANSFERS_AVERAGE_AMOUNT_ASC',
  TransfersAverageAmountDesc = 'TRANSFERS_AVERAGE_AMOUNT_DESC',
  TransfersAverageBlockAsc = 'TRANSFERS_AVERAGE_BLOCK_ASC',
  TransfersAverageBlockDesc = 'TRANSFERS_AVERAGE_BLOCK_DESC',
  TransfersAverageFromAsc = 'TRANSFERS_AVERAGE_FROM_ASC',
  TransfersAverageFromDesc = 'TRANSFERS_AVERAGE_FROM_DESC',
  TransfersAverageIdAsc = 'TRANSFERS_AVERAGE_ID_ASC',
  TransfersAverageIdDesc = 'TRANSFERS_AVERAGE_ID_DESC',
  TransfersAverageNetworkIdAsc = 'TRANSFERS_AVERAGE_NETWORK_ID_ASC',
  TransfersAverageNetworkIdDesc = 'TRANSFERS_AVERAGE_NETWORK_ID_DESC',
  TransfersAverageNftIdAsc = 'TRANSFERS_AVERAGE_NFT_ID_ASC',
  TransfersAverageNftIdDesc = 'TRANSFERS_AVERAGE_NFT_ID_DESC',
  TransfersAverageTimestampAsc = 'TRANSFERS_AVERAGE_TIMESTAMP_ASC',
  TransfersAverageTimestampDesc = 'TRANSFERS_AVERAGE_TIMESTAMP_DESC',
  TransfersAverageTokenIdAsc = 'TRANSFERS_AVERAGE_TOKEN_ID_ASC',
  TransfersAverageTokenIdDesc = 'TRANSFERS_AVERAGE_TOKEN_ID_DESC',
  TransfersAverageToAsc = 'TRANSFERS_AVERAGE_TO_ASC',
  TransfersAverageToDesc = 'TRANSFERS_AVERAGE_TO_DESC',
  TransfersAverageTransactionHashAsc = 'TRANSFERS_AVERAGE_TRANSACTION_HASH_ASC',
  TransfersAverageTransactionHashDesc = 'TRANSFERS_AVERAGE_TRANSACTION_HASH_DESC',
  TransfersCountAsc = 'TRANSFERS_COUNT_ASC',
  TransfersCountDesc = 'TRANSFERS_COUNT_DESC',
  TransfersDistinctCountAmountAsc = 'TRANSFERS_DISTINCT_COUNT_AMOUNT_ASC',
  TransfersDistinctCountAmountDesc = 'TRANSFERS_DISTINCT_COUNT_AMOUNT_DESC',
  TransfersDistinctCountBlockAsc = 'TRANSFERS_DISTINCT_COUNT_BLOCK_ASC',
  TransfersDistinctCountBlockDesc = 'TRANSFERS_DISTINCT_COUNT_BLOCK_DESC',
  TransfersDistinctCountFromAsc = 'TRANSFERS_DISTINCT_COUNT_FROM_ASC',
  TransfersDistinctCountFromDesc = 'TRANSFERS_DISTINCT_COUNT_FROM_DESC',
  TransfersDistinctCountIdAsc = 'TRANSFERS_DISTINCT_COUNT_ID_ASC',
  TransfersDistinctCountIdDesc = 'TRANSFERS_DISTINCT_COUNT_ID_DESC',
  TransfersDistinctCountNetworkIdAsc = 'TRANSFERS_DISTINCT_COUNT_NETWORK_ID_ASC',
  TransfersDistinctCountNetworkIdDesc = 'TRANSFERS_DISTINCT_COUNT_NETWORK_ID_DESC',
  TransfersDistinctCountNftIdAsc = 'TRANSFERS_DISTINCT_COUNT_NFT_ID_ASC',
  TransfersDistinctCountNftIdDesc = 'TRANSFERS_DISTINCT_COUNT_NFT_ID_DESC',
  TransfersDistinctCountTimestampAsc = 'TRANSFERS_DISTINCT_COUNT_TIMESTAMP_ASC',
  TransfersDistinctCountTimestampDesc = 'TRANSFERS_DISTINCT_COUNT_TIMESTAMP_DESC',
  TransfersDistinctCountTokenIdAsc = 'TRANSFERS_DISTINCT_COUNT_TOKEN_ID_ASC',
  TransfersDistinctCountTokenIdDesc = 'TRANSFERS_DISTINCT_COUNT_TOKEN_ID_DESC',
  TransfersDistinctCountToAsc = 'TRANSFERS_DISTINCT_COUNT_TO_ASC',
  TransfersDistinctCountToDesc = 'TRANSFERS_DISTINCT_COUNT_TO_DESC',
  TransfersDistinctCountTransactionHashAsc = 'TRANSFERS_DISTINCT_COUNT_TRANSACTION_HASH_ASC',
  TransfersDistinctCountTransactionHashDesc = 'TRANSFERS_DISTINCT_COUNT_TRANSACTION_HASH_DESC',
  TransfersMaxAmountAsc = 'TRANSFERS_MAX_AMOUNT_ASC',
  TransfersMaxAmountDesc = 'TRANSFERS_MAX_AMOUNT_DESC',
  TransfersMaxBlockAsc = 'TRANSFERS_MAX_BLOCK_ASC',
  TransfersMaxBlockDesc = 'TRANSFERS_MAX_BLOCK_DESC',
  TransfersMaxFromAsc = 'TRANSFERS_MAX_FROM_ASC',
  TransfersMaxFromDesc = 'TRANSFERS_MAX_FROM_DESC',
  TransfersMaxIdAsc = 'TRANSFERS_MAX_ID_ASC',
  TransfersMaxIdDesc = 'TRANSFERS_MAX_ID_DESC',
  TransfersMaxNetworkIdAsc = 'TRANSFERS_MAX_NETWORK_ID_ASC',
  TransfersMaxNetworkIdDesc = 'TRANSFERS_MAX_NETWORK_ID_DESC',
  TransfersMaxNftIdAsc = 'TRANSFERS_MAX_NFT_ID_ASC',
  TransfersMaxNftIdDesc = 'TRANSFERS_MAX_NFT_ID_DESC',
  TransfersMaxTimestampAsc = 'TRANSFERS_MAX_TIMESTAMP_ASC',
  TransfersMaxTimestampDesc = 'TRANSFERS_MAX_TIMESTAMP_DESC',
  TransfersMaxTokenIdAsc = 'TRANSFERS_MAX_TOKEN_ID_ASC',
  TransfersMaxTokenIdDesc = 'TRANSFERS_MAX_TOKEN_ID_DESC',
  TransfersMaxToAsc = 'TRANSFERS_MAX_TO_ASC',
  TransfersMaxToDesc = 'TRANSFERS_MAX_TO_DESC',
  TransfersMaxTransactionHashAsc = 'TRANSFERS_MAX_TRANSACTION_HASH_ASC',
  TransfersMaxTransactionHashDesc = 'TRANSFERS_MAX_TRANSACTION_HASH_DESC',
  TransfersMinAmountAsc = 'TRANSFERS_MIN_AMOUNT_ASC',
  TransfersMinAmountDesc = 'TRANSFERS_MIN_AMOUNT_DESC',
  TransfersMinBlockAsc = 'TRANSFERS_MIN_BLOCK_ASC',
  TransfersMinBlockDesc = 'TRANSFERS_MIN_BLOCK_DESC',
  TransfersMinFromAsc = 'TRANSFERS_MIN_FROM_ASC',
  TransfersMinFromDesc = 'TRANSFERS_MIN_FROM_DESC',
  TransfersMinIdAsc = 'TRANSFERS_MIN_ID_ASC',
  TransfersMinIdDesc = 'TRANSFERS_MIN_ID_DESC',
  TransfersMinNetworkIdAsc = 'TRANSFERS_MIN_NETWORK_ID_ASC',
  TransfersMinNetworkIdDesc = 'TRANSFERS_MIN_NETWORK_ID_DESC',
  TransfersMinNftIdAsc = 'TRANSFERS_MIN_NFT_ID_ASC',
  TransfersMinNftIdDesc = 'TRANSFERS_MIN_NFT_ID_DESC',
  TransfersMinTimestampAsc = 'TRANSFERS_MIN_TIMESTAMP_ASC',
  TransfersMinTimestampDesc = 'TRANSFERS_MIN_TIMESTAMP_DESC',
  TransfersMinTokenIdAsc = 'TRANSFERS_MIN_TOKEN_ID_ASC',
  TransfersMinTokenIdDesc = 'TRANSFERS_MIN_TOKEN_ID_DESC',
  TransfersMinToAsc = 'TRANSFERS_MIN_TO_ASC',
  TransfersMinToDesc = 'TRANSFERS_MIN_TO_DESC',
  TransfersMinTransactionHashAsc = 'TRANSFERS_MIN_TRANSACTION_HASH_ASC',
  TransfersMinTransactionHashDesc = 'TRANSFERS_MIN_TRANSACTION_HASH_DESC',
  TransfersStddevPopulationAmountAsc = 'TRANSFERS_STDDEV_POPULATION_AMOUNT_ASC',
  TransfersStddevPopulationAmountDesc = 'TRANSFERS_STDDEV_POPULATION_AMOUNT_DESC',
  TransfersStddevPopulationBlockAsc = 'TRANSFERS_STDDEV_POPULATION_BLOCK_ASC',
  TransfersStddevPopulationBlockDesc = 'TRANSFERS_STDDEV_POPULATION_BLOCK_DESC',
  TransfersStddevPopulationFromAsc = 'TRANSFERS_STDDEV_POPULATION_FROM_ASC',
  TransfersStddevPopulationFromDesc = 'TRANSFERS_STDDEV_POPULATION_FROM_DESC',
  TransfersStddevPopulationIdAsc = 'TRANSFERS_STDDEV_POPULATION_ID_ASC',
  TransfersStddevPopulationIdDesc = 'TRANSFERS_STDDEV_POPULATION_ID_DESC',
  TransfersStddevPopulationNetworkIdAsc = 'TRANSFERS_STDDEV_POPULATION_NETWORK_ID_ASC',
  TransfersStddevPopulationNetworkIdDesc = 'TRANSFERS_STDDEV_POPULATION_NETWORK_ID_DESC',
  TransfersStddevPopulationNftIdAsc = 'TRANSFERS_STDDEV_POPULATION_NFT_ID_ASC',
  TransfersStddevPopulationNftIdDesc = 'TRANSFERS_STDDEV_POPULATION_NFT_ID_DESC',
  TransfersStddevPopulationTimestampAsc = 'TRANSFERS_STDDEV_POPULATION_TIMESTAMP_ASC',
  TransfersStddevPopulationTimestampDesc = 'TRANSFERS_STDDEV_POPULATION_TIMESTAMP_DESC',
  TransfersStddevPopulationTokenIdAsc = 'TRANSFERS_STDDEV_POPULATION_TOKEN_ID_ASC',
  TransfersStddevPopulationTokenIdDesc = 'TRANSFERS_STDDEV_POPULATION_TOKEN_ID_DESC',
  TransfersStddevPopulationToAsc = 'TRANSFERS_STDDEV_POPULATION_TO_ASC',
  TransfersStddevPopulationToDesc = 'TRANSFERS_STDDEV_POPULATION_TO_DESC',
  TransfersStddevPopulationTransactionHashAsc = 'TRANSFERS_STDDEV_POPULATION_TRANSACTION_HASH_ASC',
  TransfersStddevPopulationTransactionHashDesc = 'TRANSFERS_STDDEV_POPULATION_TRANSACTION_HASH_DESC',
  TransfersStddevSampleAmountAsc = 'TRANSFERS_STDDEV_SAMPLE_AMOUNT_ASC',
  TransfersStddevSampleAmountDesc = 'TRANSFERS_STDDEV_SAMPLE_AMOUNT_DESC',
  TransfersStddevSampleBlockAsc = 'TRANSFERS_STDDEV_SAMPLE_BLOCK_ASC',
  TransfersStddevSampleBlockDesc = 'TRANSFERS_STDDEV_SAMPLE_BLOCK_DESC',
  TransfersStddevSampleFromAsc = 'TRANSFERS_STDDEV_SAMPLE_FROM_ASC',
  TransfersStddevSampleFromDesc = 'TRANSFERS_STDDEV_SAMPLE_FROM_DESC',
  TransfersStddevSampleIdAsc = 'TRANSFERS_STDDEV_SAMPLE_ID_ASC',
  TransfersStddevSampleIdDesc = 'TRANSFERS_STDDEV_SAMPLE_ID_DESC',
  TransfersStddevSampleNetworkIdAsc = 'TRANSFERS_STDDEV_SAMPLE_NETWORK_ID_ASC',
  TransfersStddevSampleNetworkIdDesc = 'TRANSFERS_STDDEV_SAMPLE_NETWORK_ID_DESC',
  TransfersStddevSampleNftIdAsc = 'TRANSFERS_STDDEV_SAMPLE_NFT_ID_ASC',
  TransfersStddevSampleNftIdDesc = 'TRANSFERS_STDDEV_SAMPLE_NFT_ID_DESC',
  TransfersStddevSampleTimestampAsc = 'TRANSFERS_STDDEV_SAMPLE_TIMESTAMP_ASC',
  TransfersStddevSampleTimestampDesc = 'TRANSFERS_STDDEV_SAMPLE_TIMESTAMP_DESC',
  TransfersStddevSampleTokenIdAsc = 'TRANSFERS_STDDEV_SAMPLE_TOKEN_ID_ASC',
  TransfersStddevSampleTokenIdDesc = 'TRANSFERS_STDDEV_SAMPLE_TOKEN_ID_DESC',
  TransfersStddevSampleToAsc = 'TRANSFERS_STDDEV_SAMPLE_TO_ASC',
  TransfersStddevSampleToDesc = 'TRANSFERS_STDDEV_SAMPLE_TO_DESC',
  TransfersStddevSampleTransactionHashAsc = 'TRANSFERS_STDDEV_SAMPLE_TRANSACTION_HASH_ASC',
  TransfersStddevSampleTransactionHashDesc = 'TRANSFERS_STDDEV_SAMPLE_TRANSACTION_HASH_DESC',
  TransfersSumAmountAsc = 'TRANSFERS_SUM_AMOUNT_ASC',
  TransfersSumAmountDesc = 'TRANSFERS_SUM_AMOUNT_DESC',
  TransfersSumBlockAsc = 'TRANSFERS_SUM_BLOCK_ASC',
  TransfersSumBlockDesc = 'TRANSFERS_SUM_BLOCK_DESC',
  TransfersSumFromAsc = 'TRANSFERS_SUM_FROM_ASC',
  TransfersSumFromDesc = 'TRANSFERS_SUM_FROM_DESC',
  TransfersSumIdAsc = 'TRANSFERS_SUM_ID_ASC',
  TransfersSumIdDesc = 'TRANSFERS_SUM_ID_DESC',
  TransfersSumNetworkIdAsc = 'TRANSFERS_SUM_NETWORK_ID_ASC',
  TransfersSumNetworkIdDesc = 'TRANSFERS_SUM_NETWORK_ID_DESC',
  TransfersSumNftIdAsc = 'TRANSFERS_SUM_NFT_ID_ASC',
  TransfersSumNftIdDesc = 'TRANSFERS_SUM_NFT_ID_DESC',
  TransfersSumTimestampAsc = 'TRANSFERS_SUM_TIMESTAMP_ASC',
  TransfersSumTimestampDesc = 'TRANSFERS_SUM_TIMESTAMP_DESC',
  TransfersSumTokenIdAsc = 'TRANSFERS_SUM_TOKEN_ID_ASC',
  TransfersSumTokenIdDesc = 'TRANSFERS_SUM_TOKEN_ID_DESC',
  TransfersSumToAsc = 'TRANSFERS_SUM_TO_ASC',
  TransfersSumToDesc = 'TRANSFERS_SUM_TO_DESC',
  TransfersSumTransactionHashAsc = 'TRANSFERS_SUM_TRANSACTION_HASH_ASC',
  TransfersSumTransactionHashDesc = 'TRANSFERS_SUM_TRANSACTION_HASH_DESC',
  TransfersVariancePopulationAmountAsc = 'TRANSFERS_VARIANCE_POPULATION_AMOUNT_ASC',
  TransfersVariancePopulationAmountDesc = 'TRANSFERS_VARIANCE_POPULATION_AMOUNT_DESC',
  TransfersVariancePopulationBlockAsc = 'TRANSFERS_VARIANCE_POPULATION_BLOCK_ASC',
  TransfersVariancePopulationBlockDesc = 'TRANSFERS_VARIANCE_POPULATION_BLOCK_DESC',
  TransfersVariancePopulationFromAsc = 'TRANSFERS_VARIANCE_POPULATION_FROM_ASC',
  TransfersVariancePopulationFromDesc = 'TRANSFERS_VARIANCE_POPULATION_FROM_DESC',
  TransfersVariancePopulationIdAsc = 'TRANSFERS_VARIANCE_POPULATION_ID_ASC',
  TransfersVariancePopulationIdDesc = 'TRANSFERS_VARIANCE_POPULATION_ID_DESC',
  TransfersVariancePopulationNetworkIdAsc = 'TRANSFERS_VARIANCE_POPULATION_NETWORK_ID_ASC',
  TransfersVariancePopulationNetworkIdDesc = 'TRANSFERS_VARIANCE_POPULATION_NETWORK_ID_DESC',
  TransfersVariancePopulationNftIdAsc = 'TRANSFERS_VARIANCE_POPULATION_NFT_ID_ASC',
  TransfersVariancePopulationNftIdDesc = 'TRANSFERS_VARIANCE_POPULATION_NFT_ID_DESC',
  TransfersVariancePopulationTimestampAsc = 'TRANSFERS_VARIANCE_POPULATION_TIMESTAMP_ASC',
  TransfersVariancePopulationTimestampDesc = 'TRANSFERS_VARIANCE_POPULATION_TIMESTAMP_DESC',
  TransfersVariancePopulationTokenIdAsc = 'TRANSFERS_VARIANCE_POPULATION_TOKEN_ID_ASC',
  TransfersVariancePopulationTokenIdDesc = 'TRANSFERS_VARIANCE_POPULATION_TOKEN_ID_DESC',
  TransfersVariancePopulationToAsc = 'TRANSFERS_VARIANCE_POPULATION_TO_ASC',
  TransfersVariancePopulationToDesc = 'TRANSFERS_VARIANCE_POPULATION_TO_DESC',
  TransfersVariancePopulationTransactionHashAsc = 'TRANSFERS_VARIANCE_POPULATION_TRANSACTION_HASH_ASC',
  TransfersVariancePopulationTransactionHashDesc = 'TRANSFERS_VARIANCE_POPULATION_TRANSACTION_HASH_DESC',
  TransfersVarianceSampleAmountAsc = 'TRANSFERS_VARIANCE_SAMPLE_AMOUNT_ASC',
  TransfersVarianceSampleAmountDesc = 'TRANSFERS_VARIANCE_SAMPLE_AMOUNT_DESC',
  TransfersVarianceSampleBlockAsc = 'TRANSFERS_VARIANCE_SAMPLE_BLOCK_ASC',
  TransfersVarianceSampleBlockDesc = 'TRANSFERS_VARIANCE_SAMPLE_BLOCK_DESC',
  TransfersVarianceSampleFromAsc = 'TRANSFERS_VARIANCE_SAMPLE_FROM_ASC',
  TransfersVarianceSampleFromDesc = 'TRANSFERS_VARIANCE_SAMPLE_FROM_DESC',
  TransfersVarianceSampleIdAsc = 'TRANSFERS_VARIANCE_SAMPLE_ID_ASC',
  TransfersVarianceSampleIdDesc = 'TRANSFERS_VARIANCE_SAMPLE_ID_DESC',
  TransfersVarianceSampleNetworkIdAsc = 'TRANSFERS_VARIANCE_SAMPLE_NETWORK_ID_ASC',
  TransfersVarianceSampleNetworkIdDesc = 'TRANSFERS_VARIANCE_SAMPLE_NETWORK_ID_DESC',
  TransfersVarianceSampleNftIdAsc = 'TRANSFERS_VARIANCE_SAMPLE_NFT_ID_ASC',
  TransfersVarianceSampleNftIdDesc = 'TRANSFERS_VARIANCE_SAMPLE_NFT_ID_DESC',
  TransfersVarianceSampleTimestampAsc = 'TRANSFERS_VARIANCE_SAMPLE_TIMESTAMP_ASC',
  TransfersVarianceSampleTimestampDesc = 'TRANSFERS_VARIANCE_SAMPLE_TIMESTAMP_DESC',
  TransfersVarianceSampleTokenIdAsc = 'TRANSFERS_VARIANCE_SAMPLE_TOKEN_ID_ASC',
  TransfersVarianceSampleTokenIdDesc = 'TRANSFERS_VARIANCE_SAMPLE_TOKEN_ID_DESC',
  TransfersVarianceSampleToAsc = 'TRANSFERS_VARIANCE_SAMPLE_TO_ASC',
  TransfersVarianceSampleToDesc = 'TRANSFERS_VARIANCE_SAMPLE_TO_DESC',
  TransfersVarianceSampleTransactionHashAsc = 'TRANSFERS_VARIANCE_SAMPLE_TRANSACTION_HASH_ASC',
  TransfersVarianceSampleTransactionHashDesc = 'TRANSFERS_VARIANCE_SAMPLE_TRANSACTION_HASH_DESC',
}

export type Nft = Node & {
  __typename?: 'Nft'
  amount: Scalars['BigFloat']['output']
  /** Reads a single `Collection` that is related to this `Nft`. */
  collection?: Maybe<Collection>
  collectionId: Scalars['String']['output']
  currentOwner: Scalars['String']['output']
  id: Scalars['String']['output']
  /** Reads a single `Metadatum` that is related to this `Nft`. */
  metadata?: Maybe<Metadatum>
  metadataId?: Maybe<Scalars['String']['output']>
  mintedBlock: Scalars['BigFloat']['output']
  mintedTimestamp: Scalars['BigFloat']['output']
  minterAddress: Scalars['String']['output']
  /** Reads and enables pagination through a set of `Network`. */
  networksByTransferNftIdAndNetworkId: NftNetworksByTransferNftIdAndNetworkIdManyToManyConnection
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  tokenId: Scalars['String']['output']
  /** Reads and enables pagination through a set of `Transfer`. */
  transfers: TransfersConnection
}

export type NftNetworksByTransferNftIdAndNetworkIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Networks_Distinct_Enum>>>
  filter?: InputMaybe<NetworkFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NetworksOrderBy>>
}

export type NftTransfersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Transfers_Distinct_Enum>>>
  filter?: InputMaybe<TransferFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<TransfersOrderBy>>
}

export type NftAggregates = {
  __typename?: 'NftAggregates'
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<NftAverageAggregates>
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<NftDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<NftMaxAggregates>
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<NftMinAggregates>
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<NftStddevPopulationAggregates>
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<NftStddevSampleAggregates>
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<NftSumAggregates>
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<NftVariancePopulationAggregates>
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<NftVarianceSampleAggregates>
}

/** A filter to be used against aggregates of `Nft` object types. */
export type NftAggregatesFilter = {
  /** Mean average aggregate over matching `Nft` objects. */
  average?: InputMaybe<NftAverageAggregateFilter>
  /** Distinct count aggregate over matching `Nft` objects. */
  distinctCount?: InputMaybe<NftDistinctCountAggregateFilter>
  /** A filter that must pass for the relevant `Nft` object to be included within the aggregate. */
  filter?: InputMaybe<NftFilter>
  /** Maximum aggregate over matching `Nft` objects. */
  max?: InputMaybe<NftMaxAggregateFilter>
  /** Minimum aggregate over matching `Nft` objects. */
  min?: InputMaybe<NftMinAggregateFilter>
  /** Population standard deviation aggregate over matching `Nft` objects. */
  stddevPopulation?: InputMaybe<NftStddevPopulationAggregateFilter>
  /** Sample standard deviation aggregate over matching `Nft` objects. */
  stddevSample?: InputMaybe<NftStddevSampleAggregateFilter>
  /** Sum aggregate over matching `Nft` objects. */
  sum?: InputMaybe<NftSumAggregateFilter>
  /** Population variance aggregate over matching `Nft` objects. */
  variancePopulation?: InputMaybe<NftVariancePopulationAggregateFilter>
  /** Sample variance aggregate over matching `Nft` objects. */
  varianceSample?: InputMaybe<NftVarianceSampleAggregateFilter>
}

export type NftAverageAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  mintedBlock?: InputMaybe<BigFloatFilter>
  mintedTimestamp?: InputMaybe<BigFloatFilter>
}

export type NftAverageAggregates = {
  __typename?: 'NftAverageAggregates'
  /** Mean average of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of mintedBlock across the matching connection */
  mintedBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of mintedTimestamp across the matching connection */
  mintedTimestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type NftDistinctCountAggregateFilter = {
  amount?: InputMaybe<BigIntFilter>
  collectionId?: InputMaybe<BigIntFilter>
  currentOwner?: InputMaybe<BigIntFilter>
  id?: InputMaybe<BigIntFilter>
  metadataId?: InputMaybe<BigIntFilter>
  mintedBlock?: InputMaybe<BigIntFilter>
  mintedTimestamp?: InputMaybe<BigIntFilter>
  minterAddress?: InputMaybe<BigIntFilter>
  tokenId?: InputMaybe<BigIntFilter>
}

export type NftDistinctCountAggregates = {
  __typename?: 'NftDistinctCountAggregates'
  /** Distinct count of amount across the matching connection */
  amount?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of collectionId across the matching connection */
  collectionId?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of currentOwner across the matching connection */
  currentOwner?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of metadataId across the matching connection */
  metadataId?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of mintedBlock across the matching connection */
  mintedBlock?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of mintedTimestamp across the matching connection */
  mintedTimestamp?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of minterAddress across the matching connection */
  minterAddress?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of tokenId across the matching connection */
  tokenId?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `Nft` object types. All fields are combined with a logical ‘and.’ */
export type NftFilter = {
  /** Filter by the object’s `amount` field. */
  amount?: InputMaybe<BigFloatFilter>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<NftFilter>>
  /** Filter by the object’s `collection` relation. */
  collection?: InputMaybe<CollectionFilter>
  /** Filter by the object’s `collectionId` field. */
  collectionId?: InputMaybe<StringFilter>
  /** Filter by the object’s `currentOwner` field. */
  currentOwner?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Filter by the object’s `metadata` relation. */
  metadata?: InputMaybe<MetadatumFilter>
  /** A related `metadata` exists. */
  metadataExists?: InputMaybe<Scalars['Boolean']['input']>
  /** Filter by the object’s `metadataId` field. */
  metadataId?: InputMaybe<StringFilter>
  /** Filter by the object’s `mintedBlock` field. */
  mintedBlock?: InputMaybe<BigFloatFilter>
  /** Filter by the object’s `mintedTimestamp` field. */
  mintedTimestamp?: InputMaybe<BigFloatFilter>
  /** Filter by the object’s `minterAddress` field. */
  minterAddress?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<NftFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<NftFilter>>
  /** Filter by the object’s `tokenId` field. */
  tokenId?: InputMaybe<StringFilter>
  /** Filter by the object’s `transfers` relation. */
  transfers?: InputMaybe<NftToManyTransferFilter>
  /** Some related `transfers` exist. */
  transfersExist?: InputMaybe<Scalars['Boolean']['input']>
}

export type NftMaxAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  mintedBlock?: InputMaybe<BigFloatFilter>
  mintedTimestamp?: InputMaybe<BigFloatFilter>
}

export type NftMaxAggregates = {
  __typename?: 'NftMaxAggregates'
  /** Maximum of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Maximum of mintedBlock across the matching connection */
  mintedBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Maximum of mintedTimestamp across the matching connection */
  mintedTimestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type NftMinAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  mintedBlock?: InputMaybe<BigFloatFilter>
  mintedTimestamp?: InputMaybe<BigFloatFilter>
}

export type NftMinAggregates = {
  __typename?: 'NftMinAggregates'
  /** Minimum of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Minimum of mintedBlock across the matching connection */
  mintedBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Minimum of mintedTimestamp across the matching connection */
  mintedTimestamp?: Maybe<Scalars['BigFloat']['output']>
}

/** A connection to a list of `Network` values, with data from `Transfer`. */
export type NftNetworksByTransferNftIdAndNetworkIdManyToManyConnection = {
  __typename?: 'NftNetworksByTransferNftIdAndNetworkIdManyToManyConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<NetworkAggregates>
  /** A list of edges which contains the `Network`, info from the `Transfer`, and the cursor to aid in pagination. */
  edges: Array<NftNetworksByTransferNftIdAndNetworkIdManyToManyEdge>
  /** A list of `Network` objects. */
  nodes: Array<Maybe<Network>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Network` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Network` edge in the connection, with data from `Transfer`. */
export type NftNetworksByTransferNftIdAndNetworkIdManyToManyEdge = {
  __typename?: 'NftNetworksByTransferNftIdAndNetworkIdManyToManyEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Network` at the end of the edge. */
  node?: Maybe<Network>
  /** Reads and enables pagination through a set of `Transfer`. */
  transfers: TransfersConnection
}

/** A `Network` edge in the connection, with data from `Transfer`. */
export type NftNetworksByTransferNftIdAndNetworkIdManyToManyEdgeTransfersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Transfers_Distinct_Enum>>>
  filter?: InputMaybe<TransferFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<TransfersOrderBy>>
}

export type NftStddevPopulationAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  mintedBlock?: InputMaybe<BigFloatFilter>
  mintedTimestamp?: InputMaybe<BigFloatFilter>
}

export type NftStddevPopulationAggregates = {
  __typename?: 'NftStddevPopulationAggregates'
  /** Population standard deviation of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of mintedBlock across the matching connection */
  mintedBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of mintedTimestamp across the matching connection */
  mintedTimestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type NftStddevSampleAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  mintedBlock?: InputMaybe<BigFloatFilter>
  mintedTimestamp?: InputMaybe<BigFloatFilter>
}

export type NftStddevSampleAggregates = {
  __typename?: 'NftStddevSampleAggregates'
  /** Sample standard deviation of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of mintedBlock across the matching connection */
  mintedBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of mintedTimestamp across the matching connection */
  mintedTimestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type NftSumAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  mintedBlock?: InputMaybe<BigFloatFilter>
  mintedTimestamp?: InputMaybe<BigFloatFilter>
}

export type NftSumAggregates = {
  __typename?: 'NftSumAggregates'
  /** Sum of amount across the matching connection */
  amount: Scalars['BigFloat']['output']
  /** Sum of mintedBlock across the matching connection */
  mintedBlock: Scalars['BigFloat']['output']
  /** Sum of mintedTimestamp across the matching connection */
  mintedTimestamp: Scalars['BigFloat']['output']
}

/** A filter to be used against many `Transfer` object types. All fields are combined with a logical ‘and.’ */
export type NftToManyTransferFilter = {
  /** Aggregates across related `Transfer` match the filter criteria. */
  aggregates?: InputMaybe<TransferAggregatesFilter>
  /** Every related `Transfer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TransferFilter>
  /** No related `Transfer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TransferFilter>
  /** Some related `Transfer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TransferFilter>
}

export type NftVariancePopulationAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  mintedBlock?: InputMaybe<BigFloatFilter>
  mintedTimestamp?: InputMaybe<BigFloatFilter>
}

export type NftVariancePopulationAggregates = {
  __typename?: 'NftVariancePopulationAggregates'
  /** Population variance of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of mintedBlock across the matching connection */
  mintedBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of mintedTimestamp across the matching connection */
  mintedTimestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type NftVarianceSampleAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  mintedBlock?: InputMaybe<BigFloatFilter>
  mintedTimestamp?: InputMaybe<BigFloatFilter>
}

export type NftVarianceSampleAggregates = {
  __typename?: 'NftVarianceSampleAggregates'
  /** Sample variance of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of mintedBlock across the matching connection */
  mintedBlock?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of mintedTimestamp across the matching connection */
  mintedTimestamp?: Maybe<Scalars['BigFloat']['output']>
}

/** A connection to a list of `Nft` values. */
export type NftsConnection = {
  __typename?: 'NftsConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<NftAggregates>
  /** A list of edges which contains the `Nft` and cursor to aid in pagination. */
  edges: Array<NftsEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<NftAggregates>>
  /** A list of `Nft` objects. */
  nodes: Array<Maybe<Nft>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Nft` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `Nft` values. */
export type NftsConnectionGroupedAggregatesArgs = {
  groupBy: Array<NftsGroupBy>
  having?: InputMaybe<NftsHavingInput>
}

/** A `Nft` edge in the connection. */
export type NftsEdge = {
  __typename?: 'NftsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Nft` at the end of the edge. */
  node?: Maybe<Nft>
}

/** Grouping methods for `Nft` for usage during aggregation. */
export enum NftsGroupBy {
  Amount = 'AMOUNT',
  CollectionId = 'COLLECTION_ID',
  CurrentOwner = 'CURRENT_OWNER',
  MetadataId = 'METADATA_ID',
  MintedBlock = 'MINTED_BLOCK',
  MintedTimestamp = 'MINTED_TIMESTAMP',
  MinterAddress = 'MINTER_ADDRESS',
  TokenId = 'TOKEN_ID',
}

export type NftsHavingAverageInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  mintedBlock?: InputMaybe<HavingBigfloatFilter>
  mintedTimestamp?: InputMaybe<HavingBigfloatFilter>
}

export type NftsHavingDistinctCountInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  mintedBlock?: InputMaybe<HavingBigfloatFilter>
  mintedTimestamp?: InputMaybe<HavingBigfloatFilter>
}

/** Conditions for `Nft` aggregates. */
export type NftsHavingInput = {
  AND?: InputMaybe<Array<NftsHavingInput>>
  OR?: InputMaybe<Array<NftsHavingInput>>
  average?: InputMaybe<NftsHavingAverageInput>
  distinctCount?: InputMaybe<NftsHavingDistinctCountInput>
  max?: InputMaybe<NftsHavingMaxInput>
  min?: InputMaybe<NftsHavingMinInput>
  stddevPopulation?: InputMaybe<NftsHavingStddevPopulationInput>
  stddevSample?: InputMaybe<NftsHavingStddevSampleInput>
  sum?: InputMaybe<NftsHavingSumInput>
  variancePopulation?: InputMaybe<NftsHavingVariancePopulationInput>
  varianceSample?: InputMaybe<NftsHavingVarianceSampleInput>
}

export type NftsHavingMaxInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  mintedBlock?: InputMaybe<HavingBigfloatFilter>
  mintedTimestamp?: InputMaybe<HavingBigfloatFilter>
}

export type NftsHavingMinInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  mintedBlock?: InputMaybe<HavingBigfloatFilter>
  mintedTimestamp?: InputMaybe<HavingBigfloatFilter>
}

export type NftsHavingStddevPopulationInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  mintedBlock?: InputMaybe<HavingBigfloatFilter>
  mintedTimestamp?: InputMaybe<HavingBigfloatFilter>
}

export type NftsHavingStddevSampleInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  mintedBlock?: InputMaybe<HavingBigfloatFilter>
  mintedTimestamp?: InputMaybe<HavingBigfloatFilter>
}

export type NftsHavingSumInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  mintedBlock?: InputMaybe<HavingBigfloatFilter>
  mintedTimestamp?: InputMaybe<HavingBigfloatFilter>
}

export type NftsHavingVariancePopulationInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  mintedBlock?: InputMaybe<HavingBigfloatFilter>
  mintedTimestamp?: InputMaybe<HavingBigfloatFilter>
}

export type NftsHavingVarianceSampleInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  mintedBlock?: InputMaybe<HavingBigfloatFilter>
  mintedTimestamp?: InputMaybe<HavingBigfloatFilter>
}

/** Methods to use when ordering `Nft`. */
export enum NftsOrderBy {
  AmountAsc = 'AMOUNT_ASC',
  AmountDesc = 'AMOUNT_DESC',
  CollectionIdAsc = 'COLLECTION_ID_ASC',
  CollectionIdDesc = 'COLLECTION_ID_DESC',
  CurrentOwnerAsc = 'CURRENT_OWNER_ASC',
  CurrentOwnerDesc = 'CURRENT_OWNER_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MetadataIdAsc = 'METADATA_ID_ASC',
  MetadataIdDesc = 'METADATA_ID_DESC',
  MintedBlockAsc = 'MINTED_BLOCK_ASC',
  MintedBlockDesc = 'MINTED_BLOCK_DESC',
  MintedTimestampAsc = 'MINTED_TIMESTAMP_ASC',
  MintedTimestampDesc = 'MINTED_TIMESTAMP_DESC',
  MinterAddressAsc = 'MINTER_ADDRESS_ASC',
  MinterAddressDesc = 'MINTER_ADDRESS_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TokenIdAsc = 'TOKEN_ID_ASC',
  TokenIdDesc = 'TOKEN_ID_DESC',
  TransfersAverageAmountAsc = 'TRANSFERS_AVERAGE_AMOUNT_ASC',
  TransfersAverageAmountDesc = 'TRANSFERS_AVERAGE_AMOUNT_DESC',
  TransfersAverageBlockAsc = 'TRANSFERS_AVERAGE_BLOCK_ASC',
  TransfersAverageBlockDesc = 'TRANSFERS_AVERAGE_BLOCK_DESC',
  TransfersAverageFromAsc = 'TRANSFERS_AVERAGE_FROM_ASC',
  TransfersAverageFromDesc = 'TRANSFERS_AVERAGE_FROM_DESC',
  TransfersAverageIdAsc = 'TRANSFERS_AVERAGE_ID_ASC',
  TransfersAverageIdDesc = 'TRANSFERS_AVERAGE_ID_DESC',
  TransfersAverageNetworkIdAsc = 'TRANSFERS_AVERAGE_NETWORK_ID_ASC',
  TransfersAverageNetworkIdDesc = 'TRANSFERS_AVERAGE_NETWORK_ID_DESC',
  TransfersAverageNftIdAsc = 'TRANSFERS_AVERAGE_NFT_ID_ASC',
  TransfersAverageNftIdDesc = 'TRANSFERS_AVERAGE_NFT_ID_DESC',
  TransfersAverageTimestampAsc = 'TRANSFERS_AVERAGE_TIMESTAMP_ASC',
  TransfersAverageTimestampDesc = 'TRANSFERS_AVERAGE_TIMESTAMP_DESC',
  TransfersAverageTokenIdAsc = 'TRANSFERS_AVERAGE_TOKEN_ID_ASC',
  TransfersAverageTokenIdDesc = 'TRANSFERS_AVERAGE_TOKEN_ID_DESC',
  TransfersAverageToAsc = 'TRANSFERS_AVERAGE_TO_ASC',
  TransfersAverageToDesc = 'TRANSFERS_AVERAGE_TO_DESC',
  TransfersAverageTransactionHashAsc = 'TRANSFERS_AVERAGE_TRANSACTION_HASH_ASC',
  TransfersAverageTransactionHashDesc = 'TRANSFERS_AVERAGE_TRANSACTION_HASH_DESC',
  TransfersCountAsc = 'TRANSFERS_COUNT_ASC',
  TransfersCountDesc = 'TRANSFERS_COUNT_DESC',
  TransfersDistinctCountAmountAsc = 'TRANSFERS_DISTINCT_COUNT_AMOUNT_ASC',
  TransfersDistinctCountAmountDesc = 'TRANSFERS_DISTINCT_COUNT_AMOUNT_DESC',
  TransfersDistinctCountBlockAsc = 'TRANSFERS_DISTINCT_COUNT_BLOCK_ASC',
  TransfersDistinctCountBlockDesc = 'TRANSFERS_DISTINCT_COUNT_BLOCK_DESC',
  TransfersDistinctCountFromAsc = 'TRANSFERS_DISTINCT_COUNT_FROM_ASC',
  TransfersDistinctCountFromDesc = 'TRANSFERS_DISTINCT_COUNT_FROM_DESC',
  TransfersDistinctCountIdAsc = 'TRANSFERS_DISTINCT_COUNT_ID_ASC',
  TransfersDistinctCountIdDesc = 'TRANSFERS_DISTINCT_COUNT_ID_DESC',
  TransfersDistinctCountNetworkIdAsc = 'TRANSFERS_DISTINCT_COUNT_NETWORK_ID_ASC',
  TransfersDistinctCountNetworkIdDesc = 'TRANSFERS_DISTINCT_COUNT_NETWORK_ID_DESC',
  TransfersDistinctCountNftIdAsc = 'TRANSFERS_DISTINCT_COUNT_NFT_ID_ASC',
  TransfersDistinctCountNftIdDesc = 'TRANSFERS_DISTINCT_COUNT_NFT_ID_DESC',
  TransfersDistinctCountTimestampAsc = 'TRANSFERS_DISTINCT_COUNT_TIMESTAMP_ASC',
  TransfersDistinctCountTimestampDesc = 'TRANSFERS_DISTINCT_COUNT_TIMESTAMP_DESC',
  TransfersDistinctCountTokenIdAsc = 'TRANSFERS_DISTINCT_COUNT_TOKEN_ID_ASC',
  TransfersDistinctCountTokenIdDesc = 'TRANSFERS_DISTINCT_COUNT_TOKEN_ID_DESC',
  TransfersDistinctCountToAsc = 'TRANSFERS_DISTINCT_COUNT_TO_ASC',
  TransfersDistinctCountToDesc = 'TRANSFERS_DISTINCT_COUNT_TO_DESC',
  TransfersDistinctCountTransactionHashAsc = 'TRANSFERS_DISTINCT_COUNT_TRANSACTION_HASH_ASC',
  TransfersDistinctCountTransactionHashDesc = 'TRANSFERS_DISTINCT_COUNT_TRANSACTION_HASH_DESC',
  TransfersMaxAmountAsc = 'TRANSFERS_MAX_AMOUNT_ASC',
  TransfersMaxAmountDesc = 'TRANSFERS_MAX_AMOUNT_DESC',
  TransfersMaxBlockAsc = 'TRANSFERS_MAX_BLOCK_ASC',
  TransfersMaxBlockDesc = 'TRANSFERS_MAX_BLOCK_DESC',
  TransfersMaxFromAsc = 'TRANSFERS_MAX_FROM_ASC',
  TransfersMaxFromDesc = 'TRANSFERS_MAX_FROM_DESC',
  TransfersMaxIdAsc = 'TRANSFERS_MAX_ID_ASC',
  TransfersMaxIdDesc = 'TRANSFERS_MAX_ID_DESC',
  TransfersMaxNetworkIdAsc = 'TRANSFERS_MAX_NETWORK_ID_ASC',
  TransfersMaxNetworkIdDesc = 'TRANSFERS_MAX_NETWORK_ID_DESC',
  TransfersMaxNftIdAsc = 'TRANSFERS_MAX_NFT_ID_ASC',
  TransfersMaxNftIdDesc = 'TRANSFERS_MAX_NFT_ID_DESC',
  TransfersMaxTimestampAsc = 'TRANSFERS_MAX_TIMESTAMP_ASC',
  TransfersMaxTimestampDesc = 'TRANSFERS_MAX_TIMESTAMP_DESC',
  TransfersMaxTokenIdAsc = 'TRANSFERS_MAX_TOKEN_ID_ASC',
  TransfersMaxTokenIdDesc = 'TRANSFERS_MAX_TOKEN_ID_DESC',
  TransfersMaxToAsc = 'TRANSFERS_MAX_TO_ASC',
  TransfersMaxToDesc = 'TRANSFERS_MAX_TO_DESC',
  TransfersMaxTransactionHashAsc = 'TRANSFERS_MAX_TRANSACTION_HASH_ASC',
  TransfersMaxTransactionHashDesc = 'TRANSFERS_MAX_TRANSACTION_HASH_DESC',
  TransfersMinAmountAsc = 'TRANSFERS_MIN_AMOUNT_ASC',
  TransfersMinAmountDesc = 'TRANSFERS_MIN_AMOUNT_DESC',
  TransfersMinBlockAsc = 'TRANSFERS_MIN_BLOCK_ASC',
  TransfersMinBlockDesc = 'TRANSFERS_MIN_BLOCK_DESC',
  TransfersMinFromAsc = 'TRANSFERS_MIN_FROM_ASC',
  TransfersMinFromDesc = 'TRANSFERS_MIN_FROM_DESC',
  TransfersMinIdAsc = 'TRANSFERS_MIN_ID_ASC',
  TransfersMinIdDesc = 'TRANSFERS_MIN_ID_DESC',
  TransfersMinNetworkIdAsc = 'TRANSFERS_MIN_NETWORK_ID_ASC',
  TransfersMinNetworkIdDesc = 'TRANSFERS_MIN_NETWORK_ID_DESC',
  TransfersMinNftIdAsc = 'TRANSFERS_MIN_NFT_ID_ASC',
  TransfersMinNftIdDesc = 'TRANSFERS_MIN_NFT_ID_DESC',
  TransfersMinTimestampAsc = 'TRANSFERS_MIN_TIMESTAMP_ASC',
  TransfersMinTimestampDesc = 'TRANSFERS_MIN_TIMESTAMP_DESC',
  TransfersMinTokenIdAsc = 'TRANSFERS_MIN_TOKEN_ID_ASC',
  TransfersMinTokenIdDesc = 'TRANSFERS_MIN_TOKEN_ID_DESC',
  TransfersMinToAsc = 'TRANSFERS_MIN_TO_ASC',
  TransfersMinToDesc = 'TRANSFERS_MIN_TO_DESC',
  TransfersMinTransactionHashAsc = 'TRANSFERS_MIN_TRANSACTION_HASH_ASC',
  TransfersMinTransactionHashDesc = 'TRANSFERS_MIN_TRANSACTION_HASH_DESC',
  TransfersStddevPopulationAmountAsc = 'TRANSFERS_STDDEV_POPULATION_AMOUNT_ASC',
  TransfersStddevPopulationAmountDesc = 'TRANSFERS_STDDEV_POPULATION_AMOUNT_DESC',
  TransfersStddevPopulationBlockAsc = 'TRANSFERS_STDDEV_POPULATION_BLOCK_ASC',
  TransfersStddevPopulationBlockDesc = 'TRANSFERS_STDDEV_POPULATION_BLOCK_DESC',
  TransfersStddevPopulationFromAsc = 'TRANSFERS_STDDEV_POPULATION_FROM_ASC',
  TransfersStddevPopulationFromDesc = 'TRANSFERS_STDDEV_POPULATION_FROM_DESC',
  TransfersStddevPopulationIdAsc = 'TRANSFERS_STDDEV_POPULATION_ID_ASC',
  TransfersStddevPopulationIdDesc = 'TRANSFERS_STDDEV_POPULATION_ID_DESC',
  TransfersStddevPopulationNetworkIdAsc = 'TRANSFERS_STDDEV_POPULATION_NETWORK_ID_ASC',
  TransfersStddevPopulationNetworkIdDesc = 'TRANSFERS_STDDEV_POPULATION_NETWORK_ID_DESC',
  TransfersStddevPopulationNftIdAsc = 'TRANSFERS_STDDEV_POPULATION_NFT_ID_ASC',
  TransfersStddevPopulationNftIdDesc = 'TRANSFERS_STDDEV_POPULATION_NFT_ID_DESC',
  TransfersStddevPopulationTimestampAsc = 'TRANSFERS_STDDEV_POPULATION_TIMESTAMP_ASC',
  TransfersStddevPopulationTimestampDesc = 'TRANSFERS_STDDEV_POPULATION_TIMESTAMP_DESC',
  TransfersStddevPopulationTokenIdAsc = 'TRANSFERS_STDDEV_POPULATION_TOKEN_ID_ASC',
  TransfersStddevPopulationTokenIdDesc = 'TRANSFERS_STDDEV_POPULATION_TOKEN_ID_DESC',
  TransfersStddevPopulationToAsc = 'TRANSFERS_STDDEV_POPULATION_TO_ASC',
  TransfersStddevPopulationToDesc = 'TRANSFERS_STDDEV_POPULATION_TO_DESC',
  TransfersStddevPopulationTransactionHashAsc = 'TRANSFERS_STDDEV_POPULATION_TRANSACTION_HASH_ASC',
  TransfersStddevPopulationTransactionHashDesc = 'TRANSFERS_STDDEV_POPULATION_TRANSACTION_HASH_DESC',
  TransfersStddevSampleAmountAsc = 'TRANSFERS_STDDEV_SAMPLE_AMOUNT_ASC',
  TransfersStddevSampleAmountDesc = 'TRANSFERS_STDDEV_SAMPLE_AMOUNT_DESC',
  TransfersStddevSampleBlockAsc = 'TRANSFERS_STDDEV_SAMPLE_BLOCK_ASC',
  TransfersStddevSampleBlockDesc = 'TRANSFERS_STDDEV_SAMPLE_BLOCK_DESC',
  TransfersStddevSampleFromAsc = 'TRANSFERS_STDDEV_SAMPLE_FROM_ASC',
  TransfersStddevSampleFromDesc = 'TRANSFERS_STDDEV_SAMPLE_FROM_DESC',
  TransfersStddevSampleIdAsc = 'TRANSFERS_STDDEV_SAMPLE_ID_ASC',
  TransfersStddevSampleIdDesc = 'TRANSFERS_STDDEV_SAMPLE_ID_DESC',
  TransfersStddevSampleNetworkIdAsc = 'TRANSFERS_STDDEV_SAMPLE_NETWORK_ID_ASC',
  TransfersStddevSampleNetworkIdDesc = 'TRANSFERS_STDDEV_SAMPLE_NETWORK_ID_DESC',
  TransfersStddevSampleNftIdAsc = 'TRANSFERS_STDDEV_SAMPLE_NFT_ID_ASC',
  TransfersStddevSampleNftIdDesc = 'TRANSFERS_STDDEV_SAMPLE_NFT_ID_DESC',
  TransfersStddevSampleTimestampAsc = 'TRANSFERS_STDDEV_SAMPLE_TIMESTAMP_ASC',
  TransfersStddevSampleTimestampDesc = 'TRANSFERS_STDDEV_SAMPLE_TIMESTAMP_DESC',
  TransfersStddevSampleTokenIdAsc = 'TRANSFERS_STDDEV_SAMPLE_TOKEN_ID_ASC',
  TransfersStddevSampleTokenIdDesc = 'TRANSFERS_STDDEV_SAMPLE_TOKEN_ID_DESC',
  TransfersStddevSampleToAsc = 'TRANSFERS_STDDEV_SAMPLE_TO_ASC',
  TransfersStddevSampleToDesc = 'TRANSFERS_STDDEV_SAMPLE_TO_DESC',
  TransfersStddevSampleTransactionHashAsc = 'TRANSFERS_STDDEV_SAMPLE_TRANSACTION_HASH_ASC',
  TransfersStddevSampleTransactionHashDesc = 'TRANSFERS_STDDEV_SAMPLE_TRANSACTION_HASH_DESC',
  TransfersSumAmountAsc = 'TRANSFERS_SUM_AMOUNT_ASC',
  TransfersSumAmountDesc = 'TRANSFERS_SUM_AMOUNT_DESC',
  TransfersSumBlockAsc = 'TRANSFERS_SUM_BLOCK_ASC',
  TransfersSumBlockDesc = 'TRANSFERS_SUM_BLOCK_DESC',
  TransfersSumFromAsc = 'TRANSFERS_SUM_FROM_ASC',
  TransfersSumFromDesc = 'TRANSFERS_SUM_FROM_DESC',
  TransfersSumIdAsc = 'TRANSFERS_SUM_ID_ASC',
  TransfersSumIdDesc = 'TRANSFERS_SUM_ID_DESC',
  TransfersSumNetworkIdAsc = 'TRANSFERS_SUM_NETWORK_ID_ASC',
  TransfersSumNetworkIdDesc = 'TRANSFERS_SUM_NETWORK_ID_DESC',
  TransfersSumNftIdAsc = 'TRANSFERS_SUM_NFT_ID_ASC',
  TransfersSumNftIdDesc = 'TRANSFERS_SUM_NFT_ID_DESC',
  TransfersSumTimestampAsc = 'TRANSFERS_SUM_TIMESTAMP_ASC',
  TransfersSumTimestampDesc = 'TRANSFERS_SUM_TIMESTAMP_DESC',
  TransfersSumTokenIdAsc = 'TRANSFERS_SUM_TOKEN_ID_ASC',
  TransfersSumTokenIdDesc = 'TRANSFERS_SUM_TOKEN_ID_DESC',
  TransfersSumToAsc = 'TRANSFERS_SUM_TO_ASC',
  TransfersSumToDesc = 'TRANSFERS_SUM_TO_DESC',
  TransfersSumTransactionHashAsc = 'TRANSFERS_SUM_TRANSACTION_HASH_ASC',
  TransfersSumTransactionHashDesc = 'TRANSFERS_SUM_TRANSACTION_HASH_DESC',
  TransfersVariancePopulationAmountAsc = 'TRANSFERS_VARIANCE_POPULATION_AMOUNT_ASC',
  TransfersVariancePopulationAmountDesc = 'TRANSFERS_VARIANCE_POPULATION_AMOUNT_DESC',
  TransfersVariancePopulationBlockAsc = 'TRANSFERS_VARIANCE_POPULATION_BLOCK_ASC',
  TransfersVariancePopulationBlockDesc = 'TRANSFERS_VARIANCE_POPULATION_BLOCK_DESC',
  TransfersVariancePopulationFromAsc = 'TRANSFERS_VARIANCE_POPULATION_FROM_ASC',
  TransfersVariancePopulationFromDesc = 'TRANSFERS_VARIANCE_POPULATION_FROM_DESC',
  TransfersVariancePopulationIdAsc = 'TRANSFERS_VARIANCE_POPULATION_ID_ASC',
  TransfersVariancePopulationIdDesc = 'TRANSFERS_VARIANCE_POPULATION_ID_DESC',
  TransfersVariancePopulationNetworkIdAsc = 'TRANSFERS_VARIANCE_POPULATION_NETWORK_ID_ASC',
  TransfersVariancePopulationNetworkIdDesc = 'TRANSFERS_VARIANCE_POPULATION_NETWORK_ID_DESC',
  TransfersVariancePopulationNftIdAsc = 'TRANSFERS_VARIANCE_POPULATION_NFT_ID_ASC',
  TransfersVariancePopulationNftIdDesc = 'TRANSFERS_VARIANCE_POPULATION_NFT_ID_DESC',
  TransfersVariancePopulationTimestampAsc = 'TRANSFERS_VARIANCE_POPULATION_TIMESTAMP_ASC',
  TransfersVariancePopulationTimestampDesc = 'TRANSFERS_VARIANCE_POPULATION_TIMESTAMP_DESC',
  TransfersVariancePopulationTokenIdAsc = 'TRANSFERS_VARIANCE_POPULATION_TOKEN_ID_ASC',
  TransfersVariancePopulationTokenIdDesc = 'TRANSFERS_VARIANCE_POPULATION_TOKEN_ID_DESC',
  TransfersVariancePopulationToAsc = 'TRANSFERS_VARIANCE_POPULATION_TO_ASC',
  TransfersVariancePopulationToDesc = 'TRANSFERS_VARIANCE_POPULATION_TO_DESC',
  TransfersVariancePopulationTransactionHashAsc = 'TRANSFERS_VARIANCE_POPULATION_TRANSACTION_HASH_ASC',
  TransfersVariancePopulationTransactionHashDesc = 'TRANSFERS_VARIANCE_POPULATION_TRANSACTION_HASH_DESC',
  TransfersVarianceSampleAmountAsc = 'TRANSFERS_VARIANCE_SAMPLE_AMOUNT_ASC',
  TransfersVarianceSampleAmountDesc = 'TRANSFERS_VARIANCE_SAMPLE_AMOUNT_DESC',
  TransfersVarianceSampleBlockAsc = 'TRANSFERS_VARIANCE_SAMPLE_BLOCK_ASC',
  TransfersVarianceSampleBlockDesc = 'TRANSFERS_VARIANCE_SAMPLE_BLOCK_DESC',
  TransfersVarianceSampleFromAsc = 'TRANSFERS_VARIANCE_SAMPLE_FROM_ASC',
  TransfersVarianceSampleFromDesc = 'TRANSFERS_VARIANCE_SAMPLE_FROM_DESC',
  TransfersVarianceSampleIdAsc = 'TRANSFERS_VARIANCE_SAMPLE_ID_ASC',
  TransfersVarianceSampleIdDesc = 'TRANSFERS_VARIANCE_SAMPLE_ID_DESC',
  TransfersVarianceSampleNetworkIdAsc = 'TRANSFERS_VARIANCE_SAMPLE_NETWORK_ID_ASC',
  TransfersVarianceSampleNetworkIdDesc = 'TRANSFERS_VARIANCE_SAMPLE_NETWORK_ID_DESC',
  TransfersVarianceSampleNftIdAsc = 'TRANSFERS_VARIANCE_SAMPLE_NFT_ID_ASC',
  TransfersVarianceSampleNftIdDesc = 'TRANSFERS_VARIANCE_SAMPLE_NFT_ID_DESC',
  TransfersVarianceSampleTimestampAsc = 'TRANSFERS_VARIANCE_SAMPLE_TIMESTAMP_ASC',
  TransfersVarianceSampleTimestampDesc = 'TRANSFERS_VARIANCE_SAMPLE_TIMESTAMP_DESC',
  TransfersVarianceSampleTokenIdAsc = 'TRANSFERS_VARIANCE_SAMPLE_TOKEN_ID_ASC',
  TransfersVarianceSampleTokenIdDesc = 'TRANSFERS_VARIANCE_SAMPLE_TOKEN_ID_DESC',
  TransfersVarianceSampleToAsc = 'TRANSFERS_VARIANCE_SAMPLE_TO_ASC',
  TransfersVarianceSampleToDesc = 'TRANSFERS_VARIANCE_SAMPLE_TO_DESC',
  TransfersVarianceSampleTransactionHashAsc = 'TRANSFERS_VARIANCE_SAMPLE_TRANSACTION_HASH_ASC',
  TransfersVarianceSampleTransactionHashDesc = 'TRANSFERS_VARIANCE_SAMPLE_TRANSACTION_HASH_DESC',
}

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo'
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output']
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output']
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query'
  _metadata?: Maybe<_Metadata>
  _metadatas?: Maybe<_Metadatas>
  account?: Maybe<Account>
  /** Reads a single `Account` using its globally unique `ID`. */
  accountByNodeId?: Maybe<Account>
  /** Reads and enables pagination through a set of `Account`. */
  accounts?: Maybe<AccountsConnection>
  address?: Maybe<Address>
  /** Reads a single `Address` using its globally unique `ID`. */
  addressByNodeId?: Maybe<Address>
  /** Reads and enables pagination through a set of `Address`. */
  addresses?: Maybe<AddressesConnection>
  blockedAddress?: Maybe<BlockedAddress>
  /** Reads a single `BlockedAddress` using its globally unique `ID`. */
  blockedAddressByNodeId?: Maybe<BlockedAddress>
  /** Reads and enables pagination through a set of `BlockedAddress`. */
  blockedAddresses?: Maybe<BlockedAddressesConnection>
  collection?: Maybe<Collection>
  /** Reads a single `Collection` using its globally unique `ID`. */
  collectionByNodeId?: Maybe<Collection>
  /** Reads and enables pagination through a set of `Collection`. */
  collections?: Maybe<CollectionsConnection>
  /** Reads and enables pagination through a set of `Metadatum`. */
  metadata?: Maybe<MetadataConnection>
  metadatum?: Maybe<Metadatum>
  /** Reads a single `Metadatum` using its globally unique `ID`. */
  metadatumByNodeId?: Maybe<Metadatum>
  network?: Maybe<Network>
  /** Reads a single `Network` using its globally unique `ID`. */
  networkByNodeId?: Maybe<Network>
  /** Reads and enables pagination through a set of `Network`. */
  networks?: Maybe<NetworksConnection>
  nft?: Maybe<Nft>
  /** Reads a single `Nft` using its globally unique `ID`. */
  nftByNodeId?: Maybe<Nft>
  /** Reads and enables pagination through a set of `Nft`. */
  nfts?: Maybe<NftsConnection>
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output']
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query
  transfer?: Maybe<Transfer>
  /** Reads a single `Transfer` using its globally unique `ID`. */
  transferByNodeId?: Maybe<Transfer>
  /** Reads and enables pagination through a set of `Transfer`. */
  transfers?: Maybe<TransfersConnection>
}

/** The root query type which gives access points into the data universe. */
export type Query_MetadataArgs = {
  chainId?: InputMaybe<Scalars['String']['input']>
}

/** The root query type which gives access points into the data universe. */
export type Query_MetadatasArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
}

/** The root query type which gives access points into the data universe. */
export type QueryAccountArgs = {
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryAccountByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Accounts_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryAccountsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Accounts_Distinct_Enum>>>
  filter?: InputMaybe<AccountFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AccountsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAddressArgs = {
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryAddressByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Addresses_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryAddressesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Addresses_Distinct_Enum>>>
  filter?: InputMaybe<AddressFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AddressesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryBlockedAddressArgs = {
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryBlockedAddressByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Blocked_Addresses_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryBlockedAddressesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Blocked_Addresses_Distinct_Enum>>>
  filter?: InputMaybe<BlockedAddressFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<BlockedAddressesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryCollectionArgs = {
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryCollectionByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Collections_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryCollectionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Collections_Distinct_Enum>>>
  filter?: InputMaybe<CollectionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CollectionsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryMetadataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Metadata_Distinct_Enum>>>
  filter?: InputMaybe<MetadatumFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<MetadataOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryMetadatumArgs = {
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryMetadatumByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Metadata_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryNetworkArgs = {
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryNetworkByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Networks_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryNetworksArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Networks_Distinct_Enum>>>
  filter?: InputMaybe<NetworkFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NetworksOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryNftArgs = {
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryNftByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Nfts_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryNftsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Nfts_Distinct_Enum>>>
  filter?: InputMaybe<NftFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NftsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryTransferArgs = {
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryTransferByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Transfers_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryTransfersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Transfers_Distinct_Enum>>>
  filter?: InputMaybe<TransferFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<TransfersOrderBy>>
}

export enum StatusType {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Invalid = 'INVALID',
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Unknown = 'UNKNOWN',
}

/** A filter to be used against StatusType fields. All fields are combined with a logical ‘and.’ */
export type StatusTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<StatusType>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<StatusType>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<StatusType>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<StatusType>
  /** Included in the specified list. */
  in?: InputMaybe<Array<StatusType>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<StatusType>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<StatusType>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<StatusType>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<StatusType>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<StatusType>>
}

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']['input']>
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']['input']>
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']['input']>
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']['input']>
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']['input']>>
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']['input']>
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']['input']>
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']['input']>
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']['input']>
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']['input']>
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']['input']>>
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']['input']>
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']['input']>
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']['input']>
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']['input']>
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>
}

export type TableEstimate = {
  __typename?: 'TableEstimate'
  estimate?: Maybe<Scalars['Int']['output']>
  table?: Maybe<Scalars['String']['output']>
}

export type Transfer = Node & {
  __typename?: 'Transfer'
  amount: Scalars['BigFloat']['output']
  block?: Maybe<Scalars['BigFloat']['output']>
  from: Scalars['String']['output']
  id: Scalars['String']['output']
  /** Reads a single `Network` that is related to this `Transfer`. */
  network?: Maybe<Network>
  networkId: Scalars['String']['output']
  /** Reads a single `Nft` that is related to this `Transfer`. */
  nft?: Maybe<Nft>
  nftId?: Maybe<Scalars['String']['output']>
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  timestamp?: Maybe<Scalars['BigFloat']['output']>
  to: Scalars['String']['output']
  tokenId: Scalars['String']['output']
  transactionHash?: Maybe<Scalars['String']['output']>
}

export type TransferAggregates = {
  __typename?: 'TransferAggregates'
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<TransferAverageAggregates>
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<TransferDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<TransferMaxAggregates>
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<TransferMinAggregates>
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<TransferStddevPopulationAggregates>
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<TransferStddevSampleAggregates>
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<TransferSumAggregates>
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<TransferVariancePopulationAggregates>
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<TransferVarianceSampleAggregates>
}

/** A filter to be used against aggregates of `Transfer` object types. */
export type TransferAggregatesFilter = {
  /** Mean average aggregate over matching `Transfer` objects. */
  average?: InputMaybe<TransferAverageAggregateFilter>
  /** Distinct count aggregate over matching `Transfer` objects. */
  distinctCount?: InputMaybe<TransferDistinctCountAggregateFilter>
  /** A filter that must pass for the relevant `Transfer` object to be included within the aggregate. */
  filter?: InputMaybe<TransferFilter>
  /** Maximum aggregate over matching `Transfer` objects. */
  max?: InputMaybe<TransferMaxAggregateFilter>
  /** Minimum aggregate over matching `Transfer` objects. */
  min?: InputMaybe<TransferMinAggregateFilter>
  /** Population standard deviation aggregate over matching `Transfer` objects. */
  stddevPopulation?: InputMaybe<TransferStddevPopulationAggregateFilter>
  /** Sample standard deviation aggregate over matching `Transfer` objects. */
  stddevSample?: InputMaybe<TransferStddevSampleAggregateFilter>
  /** Sum aggregate over matching `Transfer` objects. */
  sum?: InputMaybe<TransferSumAggregateFilter>
  /** Population variance aggregate over matching `Transfer` objects. */
  variancePopulation?: InputMaybe<TransferVariancePopulationAggregateFilter>
  /** Sample variance aggregate over matching `Transfer` objects. */
  varianceSample?: InputMaybe<TransferVarianceSampleAggregateFilter>
}

export type TransferAverageAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  block?: InputMaybe<BigFloatFilter>
  timestamp?: InputMaybe<BigFloatFilter>
}

export type TransferAverageAggregates = {
  __typename?: 'TransferAverageAggregates'
  /** Mean average of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of block across the matching connection */
  block?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type TransferDistinctCountAggregateFilter = {
  amount?: InputMaybe<BigIntFilter>
  block?: InputMaybe<BigIntFilter>
  from?: InputMaybe<BigIntFilter>
  id?: InputMaybe<BigIntFilter>
  networkId?: InputMaybe<BigIntFilter>
  nftId?: InputMaybe<BigIntFilter>
  timestamp?: InputMaybe<BigIntFilter>
  to?: InputMaybe<BigIntFilter>
  tokenId?: InputMaybe<BigIntFilter>
  transactionHash?: InputMaybe<BigIntFilter>
}

export type TransferDistinctCountAggregates = {
  __typename?: 'TransferDistinctCountAggregates'
  /** Distinct count of amount across the matching connection */
  amount?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of block across the matching connection */
  block?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of from across the matching connection */
  from?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of networkId across the matching connection */
  networkId?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of nftId across the matching connection */
  nftId?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of to across the matching connection */
  to?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of tokenId across the matching connection */
  tokenId?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of transactionHash across the matching connection */
  transactionHash?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `Transfer` object types. All fields are combined with a logical ‘and.’ */
export type TransferFilter = {
  /** Filter by the object’s `amount` field. */
  amount?: InputMaybe<BigFloatFilter>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TransferFilter>>
  /** Filter by the object’s `block` field. */
  block?: InputMaybe<BigFloatFilter>
  /** Filter by the object’s `from` field. */
  from?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Filter by the object’s `network` relation. */
  network?: InputMaybe<NetworkFilter>
  /** Filter by the object’s `networkId` field. */
  networkId?: InputMaybe<StringFilter>
  /** Filter by the object’s `nft` relation. */
  nft?: InputMaybe<NftFilter>
  /** A related `nft` exists. */
  nftExists?: InputMaybe<Scalars['Boolean']['input']>
  /** Filter by the object’s `nftId` field. */
  nftId?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<TransferFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TransferFilter>>
  /** Filter by the object’s `timestamp` field. */
  timestamp?: InputMaybe<BigFloatFilter>
  /** Filter by the object’s `to` field. */
  to?: InputMaybe<StringFilter>
  /** Filter by the object’s `tokenId` field. */
  tokenId?: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash?: InputMaybe<StringFilter>
}

export type TransferMaxAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  block?: InputMaybe<BigFloatFilter>
  timestamp?: InputMaybe<BigFloatFilter>
}

export type TransferMaxAggregates = {
  __typename?: 'TransferMaxAggregates'
  /** Maximum of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Maximum of block across the matching connection */
  block?: Maybe<Scalars['BigFloat']['output']>
  /** Maximum of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type TransferMinAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  block?: InputMaybe<BigFloatFilter>
  timestamp?: InputMaybe<BigFloatFilter>
}

export type TransferMinAggregates = {
  __typename?: 'TransferMinAggregates'
  /** Minimum of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Minimum of block across the matching connection */
  block?: Maybe<Scalars['BigFloat']['output']>
  /** Minimum of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type TransferStddevPopulationAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  block?: InputMaybe<BigFloatFilter>
  timestamp?: InputMaybe<BigFloatFilter>
}

export type TransferStddevPopulationAggregates = {
  __typename?: 'TransferStddevPopulationAggregates'
  /** Population standard deviation of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of block across the matching connection */
  block?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type TransferStddevSampleAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  block?: InputMaybe<BigFloatFilter>
  timestamp?: InputMaybe<BigFloatFilter>
}

export type TransferStddevSampleAggregates = {
  __typename?: 'TransferStddevSampleAggregates'
  /** Sample standard deviation of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of block across the matching connection */
  block?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type TransferSumAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  block?: InputMaybe<BigFloatFilter>
  timestamp?: InputMaybe<BigFloatFilter>
}

export type TransferSumAggregates = {
  __typename?: 'TransferSumAggregates'
  /** Sum of amount across the matching connection */
  amount: Scalars['BigFloat']['output']
  /** Sum of block across the matching connection */
  block: Scalars['BigFloat']['output']
  /** Sum of timestamp across the matching connection */
  timestamp: Scalars['BigFloat']['output']
}

export type TransferVariancePopulationAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  block?: InputMaybe<BigFloatFilter>
  timestamp?: InputMaybe<BigFloatFilter>
}

export type TransferVariancePopulationAggregates = {
  __typename?: 'TransferVariancePopulationAggregates'
  /** Population variance of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of block across the matching connection */
  block?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type TransferVarianceSampleAggregateFilter = {
  amount?: InputMaybe<BigFloatFilter>
  block?: InputMaybe<BigFloatFilter>
  timestamp?: InputMaybe<BigFloatFilter>
}

export type TransferVarianceSampleAggregates = {
  __typename?: 'TransferVarianceSampleAggregates'
  /** Sample variance of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of block across the matching connection */
  block?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

/** A connection to a list of `Transfer` values. */
export type TransfersConnection = {
  __typename?: 'TransfersConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransferAggregates>
  /** A list of edges which contains the `Transfer` and cursor to aid in pagination. */
  edges: Array<TransfersEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<TransferAggregates>>
  /** A list of `Transfer` objects. */
  nodes: Array<Maybe<Transfer>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Transfer` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `Transfer` values. */
export type TransfersConnectionGroupedAggregatesArgs = {
  groupBy: Array<TransfersGroupBy>
  having?: InputMaybe<TransfersHavingInput>
}

/** A `Transfer` edge in the connection. */
export type TransfersEdge = {
  __typename?: 'TransfersEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Transfer` at the end of the edge. */
  node?: Maybe<Transfer>
}

/** Grouping methods for `Transfer` for usage during aggregation. */
export enum TransfersGroupBy {
  Amount = 'AMOUNT',
  Block = 'BLOCK',
  From = 'FROM',
  NetworkId = 'NETWORK_ID',
  NftId = 'NFT_ID',
  Timestamp = 'TIMESTAMP',
  To = 'TO',
  TokenId = 'TOKEN_ID',
  TransactionHash = 'TRANSACTION_HASH',
}

export type TransfersHavingAverageInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  block?: InputMaybe<HavingBigfloatFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type TransfersHavingDistinctCountInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  block?: InputMaybe<HavingBigfloatFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

/** Conditions for `Transfer` aggregates. */
export type TransfersHavingInput = {
  AND?: InputMaybe<Array<TransfersHavingInput>>
  OR?: InputMaybe<Array<TransfersHavingInput>>
  average?: InputMaybe<TransfersHavingAverageInput>
  distinctCount?: InputMaybe<TransfersHavingDistinctCountInput>
  max?: InputMaybe<TransfersHavingMaxInput>
  min?: InputMaybe<TransfersHavingMinInput>
  stddevPopulation?: InputMaybe<TransfersHavingStddevPopulationInput>
  stddevSample?: InputMaybe<TransfersHavingStddevSampleInput>
  sum?: InputMaybe<TransfersHavingSumInput>
  variancePopulation?: InputMaybe<TransfersHavingVariancePopulationInput>
  varianceSample?: InputMaybe<TransfersHavingVarianceSampleInput>
}

export type TransfersHavingMaxInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  block?: InputMaybe<HavingBigfloatFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type TransfersHavingMinInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  block?: InputMaybe<HavingBigfloatFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type TransfersHavingStddevPopulationInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  block?: InputMaybe<HavingBigfloatFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type TransfersHavingStddevSampleInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  block?: InputMaybe<HavingBigfloatFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type TransfersHavingSumInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  block?: InputMaybe<HavingBigfloatFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type TransfersHavingVariancePopulationInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  block?: InputMaybe<HavingBigfloatFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type TransfersHavingVarianceSampleInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
  block?: InputMaybe<HavingBigfloatFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

/** Methods to use when ordering `Transfer`. */
export enum TransfersOrderBy {
  AmountAsc = 'AMOUNT_ASC',
  AmountDesc = 'AMOUNT_DESC',
  BlockAsc = 'BLOCK_ASC',
  BlockDesc = 'BLOCK_DESC',
  FromAsc = 'FROM_ASC',
  FromDesc = 'FROM_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  NetworkIdAsc = 'NETWORK_ID_ASC',
  NetworkIdDesc = 'NETWORK_ID_DESC',
  NftIdAsc = 'NFT_ID_ASC',
  NftIdDesc = 'NFT_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC',
  TokenIdAsc = 'TOKEN_ID_ASC',
  TokenIdDesc = 'TOKEN_ID_DESC',
  ToAsc = 'TO_ASC',
  ToDesc = 'TO_DESC',
  TransactionHashAsc = 'TRANSACTION_HASH_ASC',
  TransactionHashDesc = 'TRANSACTION_HASH_DESC',
}

export type _Metadata = {
  __typename?: '_Metadata'
  chain?: Maybe<Scalars['String']['output']>
  deployments?: Maybe<Scalars['JSON']['output']>
  dynamicDatasources?: Maybe<Scalars['String']['output']>
  evmChainId?: Maybe<Scalars['String']['output']>
  genesisHash?: Maybe<Scalars['String']['output']>
  indexerHealthy?: Maybe<Scalars['Boolean']['output']>
  indexerNodeVersion?: Maybe<Scalars['String']['output']>
  lastCreatedPoiHeight?: Maybe<Scalars['Int']['output']>
  lastFinalizedVerifiedHeight?: Maybe<Scalars['Int']['output']>
  lastProcessedHeight?: Maybe<Scalars['Int']['output']>
  lastProcessedTimestamp?: Maybe<Scalars['Date']['output']>
  latestSyncedPoiHeight?: Maybe<Scalars['Int']['output']>
  queryNodeVersion?: Maybe<Scalars['String']['output']>
  rowCountEstimate?: Maybe<Array<Maybe<TableEstimate>>>
  specName?: Maybe<Scalars['String']['output']>
  startHeight?: Maybe<Scalars['Int']['output']>
  targetHeight?: Maybe<Scalars['Int']['output']>
  unfinalizedBlocks?: Maybe<Scalars['String']['output']>
}

export type _Metadatas = {
  __typename?: '_Metadatas'
  nodes: Array<Maybe<_Metadata>>
  totalCount: Scalars['Int']['output']
}

export enum Accounts_Distinct_Enum {
  Id = 'ID',
}

export enum Addresses_Distinct_Enum {
  AccountId = 'ACCOUNT_ID',
  Id = 'ID',
  NetworkId = 'NETWORK_ID',
}

export enum Blocked_Addresses_Distinct_Enum {
  Id = 'ID',
}

export enum Collections_Distinct_Enum {
  ContractAddress = 'CONTRACT_ADDRESS',
  ContractType = 'CONTRACT_TYPE',
  CreatedBlock = 'CREATED_BLOCK',
  CreatedTimestamp = 'CREATED_TIMESTAMP',
  CreatorAddress = 'CREATOR_ADDRESS',
  Id = 'ID',
  Name = 'NAME',
  NetworkId = 'NETWORK_ID',
  Symbol = 'SYMBOL',
  TotalSupply = 'TOTAL_SUPPLY',
}

export enum Metadata_Distinct_Enum {
  Description = 'DESCRIPTION',
  Id = 'ID',
  ImageUri = 'IMAGE_URI',
  MetadataStatus = 'METADATA_STATUS',
  MetadataUri = 'METADATA_URI',
  Name = 'NAME',
  Raw = 'RAW',
  Symbol = 'SYMBOL',
  TokenUri = 'TOKEN_URI',
}

export enum Networks_Distinct_Enum {
  Id = 'ID',
}

export enum Nfts_Distinct_Enum {
  Amount = 'AMOUNT',
  CollectionId = 'COLLECTION_ID',
  CurrentOwner = 'CURRENT_OWNER',
  Id = 'ID',
  MetadataId = 'METADATA_ID',
  MintedBlock = 'MINTED_BLOCK',
  MintedTimestamp = 'MINTED_TIMESTAMP',
  MinterAddress = 'MINTER_ADDRESS',
  TokenId = 'TOKEN_ID',
}

export enum Transfers_Distinct_Enum {
  Amount = 'AMOUNT',
  Block = 'BLOCK',
  From = 'FROM',
  Id = 'ID',
  NetworkId = 'NETWORK_ID',
  NftId = 'NFT_ID',
  Timestamp = 'TIMESTAMP',
  To = 'TO',
  TokenId = 'TOKEN_ID',
  TransactionHash = 'TRANSACTION_HASH',
}

export type NftsQueryVariables = Exact<{
  address: Scalars['String']['input']
  after?: InputMaybe<Scalars['Cursor']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
}>

export type NftsQuery = {
  __typename?: 'Query'
  nfts?: {
    __typename?: 'NftsConnection'
    edges: Array<{
      __typename?: 'NftsEdge'
      node?: {
        __typename?: 'Nft'
        id: string
        tokenId: string
        collection?: {
          __typename?: 'Collection'
          id: string
          name?: string | null
          contractType: ContractType
          contractAddress: string
          networkId: string
          totalSupply: any
        } | null
        metadata?: {
          __typename?: 'Metadatum'
          name?: string | null
          description?: string | null
          imageUri?: string | null
        } | null
      } | null
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: any | null }
  } | null
}

export const NftsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'nfts' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Cursor' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'nfts' },
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
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'currentOwner' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'equalTo' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
                          },
                        ],
                      },
                    },
                  ],
                },
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
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'tokenId' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'collection' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'contractType' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'contractAddress' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'networkId' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalSupply' } },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'metadata' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'imageUri' } },
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
} as unknown as DocumentNode<NftsQuery, NftsQueryVariables>
