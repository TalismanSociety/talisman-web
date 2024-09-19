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
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any }
}

export type AccountDataResponse = {
  __typename?: 'AccountDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Account>>
  timestamp: Scalars['Float']['output']
}

export type AccountOrderByParams = {
  account_id?: InputMaybe<GqlOrderByParamsArgs>
  available_balance?: InputMaybe<GqlOrderByParamsArgs>
  balances?: InputMaybe<GqlOrderByParamsArgs>
  block_height?: InputMaybe<GqlOrderByParamsArgs>
  free_balance?: InputMaybe<GqlOrderByParamsArgs>
  locked_balance?: InputMaybe<GqlOrderByParamsArgs>
  timestamp?: InputMaybe<GqlOrderByParamsArgs>
}

export type AccountWhereParams = {
  _and?: InputMaybe<Array<AccountWhereParams>>
  _or?: InputMaybe<Array<AccountWhereParams>>
  account_id?: InputMaybe<GqlWhereOpsString>
  account_id_normalized?: InputMaybe<GqlWhereOpsString>
  balances?: InputMaybe<GqlWhereOpsString>
  block_height?: InputMaybe<GqlWhereOpsString>
}

export type AllEventsResponseDto = {
  __typename?: 'AllEventsResponseDto'
  items: Array<AllEventsResponseItemDto>
}

export type AllEventsResponseItemDto = {
  __typename?: 'AllEventsResponseItemDto'
  count: Scalars['Float']['output']
  method: Scalars['String']['output']
  section: Scalars['String']['output']
}

export type AttributeV1FilterValue = {
  /** The 'key' of attribute from 'attributes' object from the attributes query */
  key: Scalars['String']['input']
  /** The 'raw_value' of the attribute value from 'attributes[key].values[N]' object from the attributes query */
  raw_value: Scalars['String']['input']
}

export type AttributesDataResponse = {
  __typename?: 'AttributesDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Attribute>>
  timestamp: Scalars['Float']['output']
}

export type AttributesOrderByParams = {
  collection_id?: InputMaybe<GqlOrderByParamsArgs>
  token_id?: InputMaybe<GqlOrderByParamsArgs>
  trait_type?: InputMaybe<GqlOrderByParamsArgs>
  value?: InputMaybe<GqlOrderByParamsArgs>
  value_number?: InputMaybe<GqlOrderByParamsArgs>
  value_string?: InputMaybe<GqlOrderByParamsArgs>
}

export type AttributesV1DataResponse = {
  __typename?: 'AttributesV1DataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Attribute_V1>>
  timestamp: Scalars['Float']['output']
}

export type AttributesV1OrderByParams = {
  key?: InputMaybe<GqlOrderByParamsArgs>
  name?: InputMaybe<GqlOrderByParamsArgs>
}

export type AttributesV1WhereParams = {
  collection_id: GqlWhereOpsIntEq
}

export type AttributesWhereParams = {
  collection_id?: InputMaybe<GqlWhereOpsIntEq>
  token_id?: InputMaybe<GqlWhereOpsIntEq>
}

export type BlockDataResponse = {
  __typename?: 'BlockDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Block>>
  timestamp: Scalars['Float']['output']
}

export type BlockNumbersResponseDto = {
  __typename?: 'BlockNumbersResponseDto'
  groupByInterval: GroupByIntervalEnum
  items: Array<BlockNumbersResponseItemDto>
  timestampType: TimestampTypeEnum
}

export type BlockNumbersResponseItemDto = {
  __typename?: 'BlockNumbersResponseItemDto'
  firstBlockNumber: Scalars['Float']['output']
  intervalTimestamp: Scalars['Float']['output']
  lastBlockNumber: Scalars['Float']['output']
}

export type BlockOrderByParams = {
  block_hash?: InputMaybe<GqlOrderByParamsArgs>
  block_number?: InputMaybe<GqlOrderByParamsArgs>
  extrinsics_root?: InputMaybe<GqlOrderByParamsArgs>
  parent_hash?: InputMaybe<GqlOrderByParamsArgs>
  timestamp?: InputMaybe<GqlOrderByParamsArgs>
  total_events?: InputMaybe<GqlOrderByParamsArgs>
  total_extrinsics?: InputMaybe<GqlOrderByParamsArgs>
}

export type BlockWhereParams = {
  _and?: InputMaybe<Array<BlockWhereParams>>
  _or?: InputMaybe<Array<BlockWhereParams>>
  block_hash?: InputMaybe<GqlWhereOpsString>
  block_number?: InputMaybe<GqlWhereOpsInt>
  extrinsics_root?: InputMaybe<GqlWhereOpsString>
  parent_hash?: InputMaybe<GqlWhereOpsString>
  total_events?: InputMaybe<GqlWhereOpsInt>
  total_extrinsics?: InputMaybe<GqlWhereOpsInt>
}

export type CollectionDataResponse = {
  __typename?: 'CollectionDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<CollectionEntity>>
  timestamp: Scalars['Float']['output']
}

export type CollectionEntity = {
  __typename?: 'CollectionEntity'
  actions_count: Scalars['Int']['output']
  attributes_schema?: Maybe<Scalars['JSON']['output']>
  burned: Scalars['Boolean']['output']
  collection_cover?: Maybe<Scalars['String']['output']>
  collection_id: Scalars['Int']['output']
  const_chain_schema?: Maybe<Scalars['JSON']['output']>
  created_at_block_hash?: Maybe<Scalars['String']['output']>
  created_at_block_number?: Maybe<Scalars['Int']['output']>
  customizing?: Maybe<Scalars['JSONObject']['output']>
  date_of_creation?: Maybe<Scalars['Int']['output']>
  default_token_image?: Maybe<Scalars['JSONObject']['output']>
  description?: Maybe<Scalars['String']['output']>
  holders_count: Scalars['Int']['output']
  limits_account_ownership?: Maybe<Scalars['Int']['output']>
  limits_sponsore_data_rate?: Maybe<Scalars['Float']['output']>
  limits_sponsore_data_size?: Maybe<Scalars['Float']['output']>
  mint_mode: Scalars['Boolean']['output']
  mode: Scalars['String']['output']
  name: Scalars['String']['output']
  nesting_enabled: Scalars['Boolean']['output']
  offchain_schema?: Maybe<Scalars['String']['output']>
  original_schema_version?: Maybe<Scalars['String']['output']>
  owner: Scalars['String']['output']
  owner_can_destroy?: Maybe<Scalars['Boolean']['output']>
  owner_can_transfer?: Maybe<Scalars['Boolean']['output']>
  owner_normalized: Scalars['String']['output']
  permissions?: Maybe<Scalars['JSONObject']['output']>
  potential_attributes?: Maybe<Scalars['JSON']['output']>
  properties?: Maybe<Scalars['JSON']['output']>
  schema_v2?: Maybe<Scalars['JSONObject']['output']>
  schema_version?: Maybe<Scalars['String']['output']>
  sponsorship?: Maybe<Scalars['String']['output']>
  token_limit: Scalars['Float']['output']
  token_prefix: Scalars['String']['output']
  token_property_permissions?: Maybe<Scalars['JSON']['output']>
  tokens?: Maybe<Array<Token>>
  tokens_count: Scalars['Int']['output']
  transfers_count: Scalars['Int']['output']
  updated_at_block_hash?: Maybe<Scalars['String']['output']>
  updated_at_block_number?: Maybe<Scalars['Int']['output']>
  variable_on_chain_schema?: Maybe<Scalars['JSON']['output']>
}

export type CollectionEntityTokensArgs = {
  attributes_v1_filter?: InputMaybe<Array<AttributeV1FilterValue>>
  distinct_on?: InputMaybe<TokenEnum>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<TokenOrderByParams>
  where?: InputMaybe<TokenWhereParams>
}

export enum CollectionEnum {
  CollectionId = 'collection_id',
  Name = 'name',
  Owner = 'owner',
  OwnerNormalized = 'owner_normalized',
  TokenPrefix = 'token_prefix',
}

export type CollectionEventDataResponse = {
  __typename?: 'CollectionEventDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Collection_Event>>
  timestamp: Scalars['Float']['output']
}

export type CollectionEventOrderByParams = {
  action?: InputMaybe<GqlOrderByParamsArgs>
  collection_id?: InputMaybe<GqlOrderByParamsArgs>
  fee?: InputMaybe<GqlOrderByParamsArgs>
  timestamp?: InputMaybe<GqlOrderByParamsArgs>
}

export type CollectionEventWhereParams = {
  _and?: InputMaybe<Array<CollectionEventWhereParams>>
  _or?: InputMaybe<Array<CollectionEventWhereParams>>
  action?: InputMaybe<GqlWhereOpsString>
  author?: InputMaybe<GqlWhereOpsString>
  collection_id?: InputMaybe<GqlWhereOpsInt>
  result?: InputMaybe<GqlWhereOpsBoolean>
}

export type CollectionOrderByParams = {
  actions_count?: InputMaybe<GqlOrderByParamsArgs>
  collection_cover?: InputMaybe<GqlOrderByParamsArgs>
  collection_id?: InputMaybe<GqlOrderByParamsArgs>
  created_at_block_number?: InputMaybe<GqlOrderByParamsArgs>
  date_of_creation?: InputMaybe<GqlOrderByParamsArgs>
  description?: InputMaybe<GqlOrderByParamsArgs>
  holders_count?: InputMaybe<GqlOrderByParamsArgs>
  limits_account_ownership?: InputMaybe<GqlOrderByParamsArgs>
  limits_sponsore_data_rate?: InputMaybe<GqlOrderByParamsArgs>
  limits_sponsore_data_size?: InputMaybe<GqlOrderByParamsArgs>
  name?: InputMaybe<GqlOrderByParamsArgs>
  nesting_enabled?: InputMaybe<GqlOrderByParamsArgs>
  owner?: InputMaybe<GqlOrderByParamsArgs>
  owner_can_transfer?: InputMaybe<GqlOrderByParamsArgs>
  owner_normalized?: InputMaybe<GqlOrderByParamsArgs>
  token_limit?: InputMaybe<GqlOrderByParamsArgs>
  tokens_count?: InputMaybe<GqlOrderByParamsArgs>
  transfers_count?: InputMaybe<GqlOrderByParamsArgs>
  updated_at_block_number?: InputMaybe<GqlOrderByParamsArgs>
}

export type CollectionWhereParams = {
  _and?: InputMaybe<Array<CollectionWhereParams>>
  _or?: InputMaybe<Array<CollectionWhereParams>>
  burned?: InputMaybe<GqlWhereOpsString>
  collection_id?: InputMaybe<GqlWhereOpsInt>
  created_at_block_hash?: InputMaybe<GqlWhereOpsString>
  created_at_block_number?: InputMaybe<GqlWhereOpsInt>
  description?: InputMaybe<GqlWhereOpsString>
  mint_mode?: InputMaybe<GqlWhereOpsString>
  mode?: InputMaybe<GqlWhereOpsString>
  name?: InputMaybe<GqlWhereOpsString>
  nesting_enabled?: InputMaybe<GqlWhereOpsString>
  owner?: InputMaybe<GqlWhereOpsString>
  owner_normalized?: InputMaybe<GqlWhereOpsString>
  token_prefix?: InputMaybe<GqlWhereOpsString>
  tokens?: InputMaybe<TokenWhereParams>
  tokens_count?: InputMaybe<GqlWhereOpsInt>
  updated_at_block_hash?: InputMaybe<GqlWhereOpsString>
  updated_at_block_number?: InputMaybe<GqlWhereOpsInt>
}

export type EmvTransactionDataResponse = {
  __typename?: 'EmvTransactionDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<EvmTransaction>>
  timestamp: Scalars['Float']['output']
}

export type EventDataResponse = {
  __typename?: 'EventDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Event>>
  timestamp: Scalars['Float']['output']
}

export type EventOrderByParams = {
  amount?: InputMaybe<GqlOrderByParamsArgs>
  block_index?: InputMaybe<GqlOrderByParamsArgs>
  block_number?: InputMaybe<GqlOrderByParamsArgs>
  fee?: InputMaybe<GqlOrderByParamsArgs>
}

export type EventWhereParams = {
  _and?: InputMaybe<Array<EventWhereParams>>
  _or?: InputMaybe<Array<EventWhereParams>>
  amount?: InputMaybe<GqlWhereOpsString>
  block_index?: InputMaybe<GqlWhereOpsString>
  block_number?: InputMaybe<GqlWhereOpsString>
  collection_id?: InputMaybe<GqlWhereOpsInt>
  fee?: InputMaybe<GqlWhereOpsString>
  method?: InputMaybe<GqlWhereOpsString>
  section?: InputMaybe<GqlWhereOpsString>
  token_id?: InputMaybe<GqlWhereOpsInt>
}

export type EvmTransactionOrderByParams = {
  block_number?: InputMaybe<GqlOrderByParamsArgs>
  timestamp?: InputMaybe<GqlOrderByParamsArgs>
}

export type EvmTransactionWhereParams = {
  _and?: InputMaybe<Array<EvmTransactionWhereParams>>
  _or?: InputMaybe<Array<EvmTransactionWhereParams>>
  block_hash?: InputMaybe<GqlWhereOpsString>
  block_number?: InputMaybe<GqlWhereOpsInt>
  from?: InputMaybe<GqlWhereOpsString>
  to?: InputMaybe<GqlWhereOpsString>
  transaction_hash?: InputMaybe<GqlWhereOpsString>
}

export type ExtrinsicDataResponse = {
  __typename?: 'ExtrinsicDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Extrinsic>>
  timestamp: Scalars['Float']['output']
}

export type ExtrinsicOrderByParams = {
  amount?: InputMaybe<GqlOrderByParamsArgs>
  block_index?: InputMaybe<GqlOrderByParamsArgs>
  block_number?: InputMaybe<GqlOrderByParamsArgs>
  fee?: InputMaybe<GqlOrderByParamsArgs>
  from_owner?: InputMaybe<GqlOrderByParamsArgs>
  from_owner_normalized?: InputMaybe<GqlOrderByParamsArgs>
  timestamp?: InputMaybe<GqlOrderByParamsArgs>
  to_owner?: InputMaybe<GqlOrderByParamsArgs>
  to_owner_normalized?: InputMaybe<GqlOrderByParamsArgs>
}

export type ExtrinsicWhereParams = {
  _and?: InputMaybe<Array<ExtrinsicWhereParams>>
  _or?: InputMaybe<Array<ExtrinsicWhereParams>>
  amount?: InputMaybe<GqlWhereOpsInt>
  block_index?: InputMaybe<GqlWhereOpsString>
  block_number?: InputMaybe<GqlWhereOpsString>
  fee?: InputMaybe<GqlWhereOpsInt>
  from_owner?: InputMaybe<GqlWhereOpsString>
  from_owner_normalized?: InputMaybe<GqlWhereOpsString>
  hash?: InputMaybe<GqlWhereOpsString>
  method?: InputMaybe<GqlWhereOpsString>
  section?: InputMaybe<GqlWhereOpsString>
  timestamp?: InputMaybe<GqlWhereOpsString>
  to_owner?: InputMaybe<GqlWhereOpsString>
  to_owner_normalized?: InputMaybe<GqlWhereOpsString>
}

export enum ExtrinsicsStatsTypeEnum {
  Coins = 'COINS',
  Tokens = 'TOKENS',
}

export enum GqlOrderByParamsArgs {
  Asc = 'asc',
  AscNullsFirst = 'asc_nulls_first',
  AscNullsLast = 'asc_nulls_last',
  Desc = 'desc',
  DescNullsFirst = 'desc_nulls_first',
  DescNullsLast = 'desc_nulls_last',
}

export type GqlWhereOpsBoolean = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>
  _neq?: InputMaybe<Scalars['String']['input']>
}

export type GqlWhereOpsInt = {
  _eq?: InputMaybe<Scalars['Float']['input']>
  _ilike?: InputMaybe<Scalars['Float']['input']>
  _in?: InputMaybe<Array<Scalars['Float']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _like?: InputMaybe<Scalars['Float']['input']>
  _neq?: InputMaybe<Scalars['Float']['input']>
}

export type GqlWhereOpsIntEq = {
  _eq: Scalars['Float']['input']
}

export type GqlWhereOpsString = {
  _eq?: InputMaybe<Scalars['String']['input']>
  _ilike?: InputMaybe<Scalars['String']['input']>
  _in?: InputMaybe<Array<Scalars['String']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _like?: InputMaybe<Scalars['String']['input']>
  _neq?: InputMaybe<Scalars['String']['input']>
}

export type GqlWhereTokensType = {
  _eq?: InputMaybe<TokenTypeEnum>
  _in?: InputMaybe<Array<TokenTypeEnum>>
  _neq?: InputMaybe<TokenTypeEnum>
}

export enum GroupByIntervalEnum {
  Day = 'day',
  Hour = 'hour',
  Month = 'month',
  Week = 'week',
  Year = 'year',
}

export type GroupedEventsResponseDto = {
  __typename?: 'GroupedEventsResponseDto'
  groupByInterval: GroupByIntervalEnum
  items: Array<GroupedEventsResponseItemDto>
  timestampType: TimestampTypeEnum
}

export type GroupedEventsResponseItemDto = {
  __typename?: 'GroupedEventsResponseItemDto'
  count: Scalars['Float']['output']
  intervalTimestamp: Scalars['Float']['output']
}

export type HolderDataResponse = {
  __typename?: 'HolderDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Holder>>
  timestamp: Scalars['Float']['output']
}

export type HolderOrderByParams = {
  collection_id?: InputMaybe<GqlOrderByParamsArgs>
  count?: InputMaybe<GqlOrderByParamsArgs>
  owner?: InputMaybe<GqlOrderByParamsArgs>
  owner_normalized?: InputMaybe<GqlOrderByParamsArgs>
}

export type HolderWhereParams = {
  _and?: InputMaybe<Array<HolderWhereParams>>
  _or?: InputMaybe<Array<HolderWhereParams>>
  collection_id?: InputMaybe<GqlWhereOpsInt>
  owner?: InputMaybe<GqlWhereOpsString>
  owner_normalized?: InputMaybe<GqlWhereOpsString>
}

export type NestingArgs = {
  collection_id: Scalars['Int']['input']
  token_id: Scalars['Int']['input']
}

export type NestingToken = {
  __typename?: 'NestingToken'
  amount?: Maybe<Scalars['String']['output']>
  animation_details?: Maybe<Scalars['JSONObject']['output']>
  animation_url?: Maybe<Scalars['String']['output']>
  attributes?: Maybe<Scalars['JSON']['output']>
  attributes_v1?: Maybe<Scalars['JSONObject']['output']>
  background_color?: Maybe<Scalars['String']['output']>
  bundle_created?: Maybe<Scalars['Int']['output']>
  burned: Scalars['Boolean']['output']
  children_count?: Maybe<Scalars['Int']['output']>
  collection_id: Scalars['Int']['output']
  created_by?: Maybe<Scalars['String']['output']>
  customizing?: Maybe<Scalars['JSONObject']['output']>
  customizing_overrides?: Maybe<Scalars['JSONObject']['output']>
  date_of_creation?: Maybe<Scalars['Int']['output']>
  description?: Maybe<Scalars['String']['output']>
  external_url?: Maybe<Scalars['String']['output']>
  image?: Maybe<Scalars['String']['output']>
  image_details?: Maybe<Scalars['JSONObject']['output']>
  image_v1?: Maybe<Scalars['JSONObject']['output']>
  is_sold: Scalars['Boolean']['output']
  locale?: Maybe<Scalars['String']['output']>
  media?: Maybe<Scalars['JSONObject']['output']>
  name?: Maybe<Scalars['String']['output']>
  nested: Scalars['Boolean']['output']
  nestingChildren?: Maybe<Array<NestingToken>>
  owner: Scalars['String']['output']
  owner_normalized: Scalars['String']['output']
  parent_id?: Maybe<Scalars['String']['output']>
  properties?: Maybe<Scalars['JSON']['output']>
  royalties?: Maybe<Scalars['JSONObject']['output']>
  token_id: Scalars['Int']['output']
  token_name?: Maybe<Scalars['String']['output']>
  token_prefix: Scalars['String']['output']
  total_pieces?: Maybe<Scalars['String']['output']>
  type?: Maybe<TokenTypeEnum>
  youtube_url?: Maybe<Scalars['String']['output']>
}

export type Query = {
  __typename?: 'Query'
  accounts: AccountDataResponse
  accountsStatistics: StatisticDataResponse
  allEvents: AllEventsResponseDto
  allExtrinsics: AllEventsResponseDto
  attributes: AttributesDataResponse
  attributes_v1: AttributesV1DataResponse
  block: BlockDataResponse
  blockNumbersByInterval: BlockNumbersResponseDto
  bundleTree?: Maybe<NestingToken>
  collection_events: CollectionEventDataResponse
  collections: CollectionDataResponse
  collectionsStatistics: StatisticDataResponse
  events: EventDataResponse
  eventsGroupedByInterval: GroupedEventsResponseDto
  evmTransactions: EmvTransactionDataResponse
  extrinsics: ExtrinsicDataResponse
  extrinsicsGroupedByInterval: GroupedEventsResponseDto
  extrinsicsStatistics: StatisticDataResponse
  holders: HolderDataResponse
  statistics: StatisticsDataResponse
  tokenBundles: TokenDataResponse
  tokenStatistics: StatisticDataResponse
  tokenTransactions: TransactionsDataResponse
  token_events: TokenEventDataResponse
  token_owners: TokenOwnersDataResponse
  tokens: TokenDataResponse
  transfers: TransferDataResponse
}

export type QueryAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<AccountOrderByParams>
  where?: InputMaybe<AccountWhereParams>
}

export type QueryAccountsStatisticsArgs = {
  fromDate?: InputMaybe<Scalars['DateTime']['input']>
  toDate?: InputMaybe<Scalars['DateTime']['input']>
}

export type QueryAttributesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<AttributesOrderByParams>
  where?: InputMaybe<AttributesWhereParams>
}

export type QueryAttributes_V1Args = {
  order_by?: InputMaybe<AttributesV1OrderByParams>
  where: AttributesV1WhereParams
}

export type QueryBlockArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<BlockOrderByParams>
  where?: InputMaybe<BlockWhereParams>
}

export type QueryBlockNumbersByIntervalArgs = {
  from?: InputMaybe<Scalars['Float']['input']>
  groupByInterval?: InputMaybe<GroupByIntervalEnum>
  timestampType?: InputMaybe<TimestampTypeEnum>
  to?: InputMaybe<Scalars['Float']['input']>
}

export type QueryBundleTreeArgs = {
  input: NestingArgs
}

export type QueryCollection_EventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<CollectionEventOrderByParams>
  where?: InputMaybe<CollectionEventWhereParams>
}

export type QueryCollectionsArgs = {
  distinct_on?: InputMaybe<CollectionEnum>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<CollectionOrderByParams>
  where?: InputMaybe<CollectionWhereParams>
}

export type QueryCollectionsStatisticsArgs = {
  fromDate?: InputMaybe<Scalars['DateTime']['input']>
  toDate?: InputMaybe<Scalars['DateTime']['input']>
}

export type QueryEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<EventOrderByParams>
  where?: InputMaybe<EventWhereParams>
}

export type QueryEventsGroupedByIntervalArgs = {
  from?: InputMaybe<Scalars['Float']['input']>
  groupByInterval?: InputMaybe<GroupByIntervalEnum>
  methodIn?: InputMaybe<Array<Scalars['String']['input']>>
  methodNotIn?: InputMaybe<Array<Scalars['String']['input']>>
  sectionIn?: InputMaybe<Array<Scalars['String']['input']>>
  sectionNotIn?: InputMaybe<Array<Scalars['String']['input']>>
  timestampType?: InputMaybe<TimestampTypeEnum>
  to?: InputMaybe<Scalars['Float']['input']>
}

export type QueryEvmTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<EvmTransactionOrderByParams>
  where?: InputMaybe<EvmTransactionWhereParams>
}

export type QueryExtrinsicsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<ExtrinsicOrderByParams>
  where?: InputMaybe<ExtrinsicWhereParams>
}

export type QueryExtrinsicsGroupedByIntervalArgs = {
  from?: InputMaybe<Scalars['Float']['input']>
  groupByInterval?: InputMaybe<GroupByIntervalEnum>
  methodIn?: InputMaybe<Array<Scalars['String']['input']>>
  methodNotIn?: InputMaybe<Array<Scalars['String']['input']>>
  sectionIn?: InputMaybe<Array<Scalars['String']['input']>>
  sectionNotIn?: InputMaybe<Array<Scalars['String']['input']>>
  timestampType?: InputMaybe<TimestampTypeEnum>
  to?: InputMaybe<Scalars['Float']['input']>
}

export type QueryExtrinsicsStatisticsArgs = {
  fromDate?: InputMaybe<Scalars['DateTime']['input']>
  toDate?: InputMaybe<Scalars['DateTime']['input']>
  type?: InputMaybe<ExtrinsicsStatsTypeEnum>
}

export type QueryHoldersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<HolderOrderByParams>
  where?: InputMaybe<HolderWhereParams>
}

export type QueryStatisticsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<StatisticsOrderByParams>
  where?: InputMaybe<StatisticsWhereParams>
}

export type QueryTokenBundlesArgs = {
  attributes_v1_filter?: InputMaybe<Array<AttributeV1FilterValue>>
  distinct_on?: InputMaybe<TokenEnum>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<TokenOrderByParams>
  where?: InputMaybe<TokenWhereParams>
}

export type QueryTokenStatisticsArgs = {
  fromDate?: InputMaybe<Scalars['DateTime']['input']>
  toDate?: InputMaybe<Scalars['DateTime']['input']>
}

export type QueryTokenTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<TransactionsOrderByParams>
  where?: InputMaybe<TransactionWhereParams>
}

export type QueryToken_EventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<TokenEventOrderByParams>
  where?: InputMaybe<TokenEventWhereParams>
}

export type QueryToken_OwnersArgs = {
  distinct_on?: InputMaybe<TokenOwnersEnum>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<TokenOwnersOrderByParams>
  where?: InputMaybe<TokenOwnersWhereParams>
}

export type QueryTokensArgs = {
  attributes_v1_filter?: InputMaybe<Array<AttributeV1FilterValue>>
  distinct_on?: InputMaybe<TokenEnum>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<TokenOrderByParams>
  where?: InputMaybe<TokenWhereParams>
}

export type QueryTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<TransferOrderByParams>
  where?: InputMaybe<TransferWhereParams>
}

export type StatisticDataEntity = {
  __typename?: 'StatisticDataEntity'
  count: Scalars['Int']['output']
  date?: Maybe<Scalars['DateTime']['output']>
}

export type StatisticDataResponse = {
  __typename?: 'StatisticDataResponse'
  data?: Maybe<Array<StatisticDataEntity>>
}

export type StatisticsDataResponse = {
  __typename?: 'StatisticsDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Statistics>>
  timestamp: Scalars['Float']['output']
}

export type StatisticsOrderByParams = {
  count?: InputMaybe<GqlOrderByParamsArgs>
  name?: InputMaybe<GqlOrderByParamsArgs>
}

export type StatisticsWhereParams = {
  _and?: InputMaybe<Array<StatisticsWhereParams>>
  _or?: InputMaybe<Array<StatisticsWhereParams>>
  count?: InputMaybe<GqlWhereOpsInt>
  name?: InputMaybe<GqlWhereOpsString>
}

export enum TimestampTypeEnum {
  Milliseconds = 'MILLISECONDS',
  Unix = 'UNIX',
}

export type TokenDataResponse = {
  __typename?: 'TokenDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<TokenEntity>>
  timestamp: Scalars['Float']['output']
}

export type TokenEntity = {
  __typename?: 'TokenEntity'
  amount?: Maybe<Scalars['String']['output']>
  animation_details?: Maybe<Scalars['JSONObject']['output']>
  animation_url?: Maybe<Scalars['String']['output']>
  attributes?: Maybe<Scalars['JSON']['output']>
  attributes_v1?: Maybe<Scalars['JSONObject']['output']>
  background_color?: Maybe<Scalars['String']['output']>
  bundle_created?: Maybe<Scalars['Int']['output']>
  burned: Scalars['Boolean']['output']
  children_count?: Maybe<Scalars['Int']['output']>
  collection?: Maybe<Collection>
  collection_cover?: Maybe<Scalars['String']['output']>
  collection_description?: Maybe<Scalars['String']['output']>
  collection_id: Scalars['Int']['output']
  collection_name: Scalars['String']['output']
  collection_owner?: Maybe<Scalars['String']['output']>
  collection_owner_normalized?: Maybe<Scalars['String']['output']>
  created_at_block_hash?: Maybe<Scalars['String']['output']>
  created_at_block_number?: Maybe<Scalars['Int']['output']>
  created_by?: Maybe<Scalars['String']['output']>
  customizing?: Maybe<Scalars['JSONObject']['output']>
  customizing_overrides?: Maybe<Scalars['JSONObject']['output']>
  date_of_creation?: Maybe<Scalars['Int']['output']>
  description?: Maybe<Scalars['String']['output']>
  external_url?: Maybe<Scalars['String']['output']>
  image?: Maybe<Scalars['String']['output']>
  image_details?: Maybe<Scalars['JSONObject']['output']>
  image_v1?: Maybe<Scalars['JSONObject']['output']>
  is_sold: Scalars['Boolean']['output']
  locale?: Maybe<Scalars['String']['output']>
  media?: Maybe<Scalars['JSONObject']['output']>
  name?: Maybe<Scalars['String']['output']>
  nested: Scalars['Boolean']['output']
  owner: Scalars['String']['output']
  owner_normalized: Scalars['String']['output']
  parent_id?: Maybe<Scalars['String']['output']>
  properties?: Maybe<Scalars['JSON']['output']>
  royalties?: Maybe<Scalars['JSONObject']['output']>
  schema_v2?: Maybe<Scalars['JSONObject']['output']>
  token_id: Scalars['Int']['output']
  token_name?: Maybe<Scalars['String']['output']>
  token_prefix: Scalars['String']['output']
  tokensOwners?: Maybe<Tokens_Owners>
  tokens_amount?: Maybe<Scalars['String']['output']>
  tokens_children?: Maybe<Array<Scalars['JSONObject']['output']>>
  tokens_owner?: Maybe<Scalars['String']['output']>
  tokens_parent?: Maybe<Scalars['String']['output']>
  total_pieces?: Maybe<Scalars['String']['output']>
  transfers_count?: Maybe<Scalars['Int']['output']>
  type?: Maybe<TokenTypeEnum>
  updated_at_block_hash?: Maybe<Scalars['String']['output']>
  updated_at_block_number?: Maybe<Scalars['Int']['output']>
  youtube_url?: Maybe<Scalars['String']['output']>
}

export enum TokenEnum {
  CollectionId = 'collection_id',
  CollectionName = 'collection_name',
  Owner = 'owner',
  OwnerNormalized = 'owner_normalized',
  TokenId = 'token_id',
  TokenName = 'token_name',
  TokenPrefix = 'token_prefix',
  TokensOwner = 'tokens_owner',
}

export type TokenEventDataResponse = {
  __typename?: 'TokenEventDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Token_Event>>
  timestamp: Scalars['Float']['output']
}

export type TokenEventOrderByParams = {
  action?: InputMaybe<GqlOrderByParamsArgs>
  collection_id?: InputMaybe<GqlOrderByParamsArgs>
  fee?: InputMaybe<GqlOrderByParamsArgs>
  result?: InputMaybe<GqlOrderByParamsArgs>
  timestamp?: InputMaybe<GqlOrderByParamsArgs>
  token_id?: InputMaybe<GqlOrderByParamsArgs>
  token_name?: InputMaybe<GqlOrderByParamsArgs>
  type?: InputMaybe<GqlOrderByParamsArgs>
}

export type TokenEventWhereParams = {
  _and?: InputMaybe<Array<TokenEventWhereParams>>
  _or?: InputMaybe<Array<TokenEventWhereParams>>
  action?: InputMaybe<GqlWhereOpsString>
  author?: InputMaybe<GqlWhereOpsString>
  collection_id?: InputMaybe<GqlWhereOpsInt>
  data?: InputMaybe<GqlWhereOpsString>
  result?: InputMaybe<GqlWhereOpsBoolean>
  token_id?: InputMaybe<GqlWhereOpsInt>
  type?: InputMaybe<GqlWhereOpsString>
}

export type TokenOrderByParams = {
  amount?: InputMaybe<GqlOrderByParamsArgs>
  bundle_created?: InputMaybe<GqlOrderByParamsArgs>
  children_count?: InputMaybe<GqlOrderByParamsArgs>
  collection_id?: InputMaybe<GqlOrderByParamsArgs>
  collection_name?: InputMaybe<GqlOrderByParamsArgs>
  created_at_block_number?: InputMaybe<GqlOrderByParamsArgs>
  date_of_creation?: InputMaybe<GqlOrderByParamsArgs>
  is_sold?: InputMaybe<GqlOrderByParamsArgs>
  owner?: InputMaybe<GqlOrderByParamsArgs>
  owner_normalized?: InputMaybe<GqlOrderByParamsArgs>
  parent_id?: InputMaybe<GqlOrderByParamsArgs>
  token_id?: InputMaybe<GqlOrderByParamsArgs>
  token_name?: InputMaybe<GqlOrderByParamsArgs>
  tokens_amount?: InputMaybe<GqlOrderByParamsArgs>
  tokens_children?: InputMaybe<GqlOrderByParamsArgs>
  tokens_owner?: InputMaybe<GqlOrderByParamsArgs>
  tokens_parent?: InputMaybe<GqlOrderByParamsArgs>
  total_pieces?: InputMaybe<GqlOrderByParamsArgs>
  transfers_count?: InputMaybe<GqlOrderByParamsArgs>
  updated_at_block_number?: InputMaybe<GqlOrderByParamsArgs>
}

export type TokenOwnersDataResponse = {
  __typename?: 'TokenOwnersDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Tokens_Owners>>
  timestamp: Scalars['Float']['output']
}

export enum TokenOwnersEnum {
  Amount = 'amount',
  CollectionId = 'collection_id',
  DateCreated = 'date_created',
  Owner = 'owner',
  OwnerNormalized = 'owner_normalized',
  TokenId = 'token_id',
}

export type TokenOwnersOrderByParams = {
  amount?: InputMaybe<GqlOrderByParamsArgs>
  collection_id?: InputMaybe<GqlOrderByParamsArgs>
  date_of_creation?: InputMaybe<GqlOrderByParamsArgs>
  owner?: InputMaybe<GqlOrderByParamsArgs>
  owner_normalized?: InputMaybe<GqlOrderByParamsArgs>
  token_id?: InputMaybe<GqlOrderByParamsArgs>
}

export type TokenOwnersWhereParams = {
  _and?: InputMaybe<Array<TokenOwnersWhereParams>>
  _or?: InputMaybe<Array<TokenOwnersWhereParams>>
  amount?: InputMaybe<GqlWhereOpsString>
  collection_id?: InputMaybe<GqlWhereOpsInt>
  owner?: InputMaybe<GqlWhereOpsString>
  owner_normalized?: InputMaybe<GqlWhereOpsString>
  token_id?: InputMaybe<GqlWhereOpsInt>
}

export enum TokenTypeEnum {
  Fractional = 'FRACTIONAL',
  Nft = 'NFT',
  Rft = 'RFT',
}

export type TokenWhereParams = {
  _and?: InputMaybe<Array<TokenWhereParams>>
  _or?: InputMaybe<Array<TokenWhereParams>>
  burned?: InputMaybe<GqlWhereOpsString>
  collection_id?: InputMaybe<GqlWhereOpsInt>
  collection_name?: InputMaybe<GqlWhereOpsString>
  collection_owner?: InputMaybe<GqlWhereOpsString>
  collection_owner_normalized?: InputMaybe<GqlWhereOpsString>
  created_at_block_hash?: InputMaybe<GqlWhereOpsString>
  created_at_block_number?: InputMaybe<GqlWhereOpsInt>
  is_sold?: InputMaybe<GqlWhereOpsString>
  nested?: InputMaybe<GqlWhereOpsString>
  owner?: InputMaybe<GqlWhereOpsString>
  owner_normalized?: InputMaybe<GqlWhereOpsString>
  parent_id?: InputMaybe<GqlWhereOpsString>
  token_id?: InputMaybe<GqlWhereOpsInt>
  token_name?: InputMaybe<GqlWhereOpsString>
  token_prefix?: InputMaybe<GqlWhereOpsString>
  tokens_amount?: InputMaybe<GqlWhereOpsString>
  tokens_owner?: InputMaybe<GqlWhereOpsString>
  tokens_parent?: InputMaybe<GqlWhereOpsString>
  total_pieces?: InputMaybe<GqlWhereOpsString>
  type?: InputMaybe<GqlWhereTokensType>
  updated_at_block_hash?: InputMaybe<GqlWhereOpsString>
  updated_at_block_number?: InputMaybe<GqlWhereOpsInt>
}

export type TransactionWhereParams = {
  _and?: InputMaybe<Array<TransactionWhereParams>>
  _or?: InputMaybe<Array<TransactionWhereParams>>
  block_index?: InputMaybe<GqlWhereOpsString>
  owner?: InputMaybe<GqlWhereOpsString>
  owner_normalized?: InputMaybe<GqlWhereOpsString>
  to_owner?: InputMaybe<GqlWhereOpsString>
  to_owner_normalized?: InputMaybe<GqlWhereOpsString>
}

export type TransactionsDataResponse = {
  __typename?: 'TransactionsDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Transaction>>
  timestamp: Scalars['Float']['output']
}

export type TransactionsOrderByParams = {
  block_index?: InputMaybe<GqlOrderByParamsArgs>
  owner?: InputMaybe<GqlOrderByParamsArgs>
  owner_normalized?: InputMaybe<GqlOrderByParamsArgs>
  timestamp?: InputMaybe<GqlOrderByParamsArgs>
  to_owner?: InputMaybe<GqlOrderByParamsArgs>
  to_owner_normalized?: InputMaybe<GqlOrderByParamsArgs>
}

export type TransferDataResponse = {
  __typename?: 'TransferDataResponse'
  count: Scalars['Int']['output']
  data?: Maybe<Array<Transfer>>
  timestamp: Scalars['Float']['output']
}

export type TransferOrderByParams = {
  block_index?: InputMaybe<GqlOrderByParamsArgs>
  method?: InputMaybe<GqlOrderByParamsArgs>
  section?: InputMaybe<GqlOrderByParamsArgs>
}

export type TransferWhereParams = {
  _and?: InputMaybe<Array<TransferWhereParams>>
  _or?: InputMaybe<Array<TransferWhereParams>>
  block_index?: InputMaybe<GqlWhereOpsString>
  method?: InputMaybe<GqlWhereOpsString>
  section?: InputMaybe<GqlWhereOpsString>
}

export type Account = {
  __typename?: 'account'
  account_id: Scalars['String']['output']
  account_id_normalized: Scalars['String']['output']
  available_balance: Scalars['String']['output']
  block_height: Scalars['Int']['output']
  free_balance: Scalars['String']['output']
  locked_balance: Scalars['String']['output']
  timestamp: Scalars['Int']['output']
}

export type Attribute = {
  __typename?: 'attribute'
  collection_id: Scalars['Int']['output']
  display_type?: Maybe<Scalars['String']['output']>
  token_id: Scalars['Int']['output']
  trait_type: Scalars['String']['output']
  value_number?: Maybe<Scalars['Float']['output']>
  value_string?: Maybe<Scalars['String']['output']>
}

export type Attribute_V1 = {
  __typename?: 'attribute_v1'
  key: Scalars['String']['output']
  name: Scalars['JSONObject']['output']
  values: Array<Attribute_V1_Value>
}

export type Attribute_V1_Value = {
  __typename?: 'attribute_v1_value'
  raw_value?: Maybe<Scalars['String']['output']>
  tokens_count?: Maybe<Scalars['Int']['output']>
  value?: Maybe<Scalars['JSONObject']['output']>
}

export type Block = {
  __typename?: 'block'
  block_hash?: Maybe<Scalars['String']['output']>
  block_number?: Maybe<Scalars['Int']['output']>
  extrinsics_root?: Maybe<Scalars['String']['output']>
  new_accounts?: Maybe<Scalars['Int']['output']>
  num_transfers?: Maybe<Scalars['Int']['output']>
  parent_hash?: Maybe<Scalars['String']['output']>
  spec_name?: Maybe<Scalars['String']['output']>
  spec_version?: Maybe<Scalars['Int']['output']>
  state_root?: Maybe<Scalars['String']['output']>
  timestamp?: Maybe<Scalars['Int']['output']>
  total_events?: Maybe<Scalars['Int']['output']>
  total_extrinsics?: Maybe<Scalars['Int']['output']>
}

export type Collection = {
  __typename?: 'collection'
  actions_count: Scalars['Int']['output']
  attributes_schema?: Maybe<Scalars['JSON']['output']>
  burned: Scalars['Boolean']['output']
  collection_cover?: Maybe<Scalars['String']['output']>
  collection_id: Scalars['Int']['output']
  const_chain_schema?: Maybe<Scalars['JSON']['output']>
  created_at_block_hash?: Maybe<Scalars['String']['output']>
  created_at_block_number?: Maybe<Scalars['Int']['output']>
  customizing?: Maybe<Scalars['JSONObject']['output']>
  date_of_creation?: Maybe<Scalars['Int']['output']>
  default_token_image?: Maybe<Scalars['JSONObject']['output']>
  description?: Maybe<Scalars['String']['output']>
  holders_count: Scalars['Int']['output']
  limits_account_ownership?: Maybe<Scalars['Int']['output']>
  limits_sponsore_data_rate?: Maybe<Scalars['Float']['output']>
  limits_sponsore_data_size?: Maybe<Scalars['Float']['output']>
  mint_mode: Scalars['Boolean']['output']
  mode: Scalars['String']['output']
  name: Scalars['String']['output']
  nesting_enabled: Scalars['Boolean']['output']
  offchain_schema?: Maybe<Scalars['String']['output']>
  original_schema_version?: Maybe<Scalars['String']['output']>
  owner: Scalars['String']['output']
  owner_can_destroy?: Maybe<Scalars['Boolean']['output']>
  owner_can_transfer?: Maybe<Scalars['Boolean']['output']>
  owner_normalized: Scalars['String']['output']
  permissions?: Maybe<Scalars['JSONObject']['output']>
  potential_attributes?: Maybe<Scalars['JSON']['output']>
  properties?: Maybe<Scalars['JSON']['output']>
  schema_v2?: Maybe<Scalars['JSONObject']['output']>
  schema_version?: Maybe<Scalars['String']['output']>
  sponsorship?: Maybe<Scalars['String']['output']>
  token_limit: Scalars['Float']['output']
  token_prefix: Scalars['String']['output']
  token_property_permissions?: Maybe<Scalars['JSON']['output']>
  tokens_count: Scalars['Int']['output']
  transfers_count: Scalars['Int']['output']
  updated_at_block_hash?: Maybe<Scalars['String']['output']>
  updated_at_block_number?: Maybe<Scalars['Int']['output']>
  variable_on_chain_schema?: Maybe<Scalars['JSON']['output']>
}

export type Collection_Event = {
  __typename?: 'collection_event'
  action: Scalars['String']['output']
  author?: Maybe<Scalars['String']['output']>
  collection_id: Scalars['Int']['output']
  fee?: Maybe<Scalars['Float']['output']>
  result: Scalars['Boolean']['output']
  timestamp: Scalars['Float']['output']
}

export type Event = {
  __typename?: 'event'
  amount?: Maybe<Scalars['Float']['output']>
  block_index?: Maybe<Scalars['String']['output']>
  block_number: Scalars['String']['output']
  collection_id?: Maybe<Scalars['Int']['output']>
  fee?: Maybe<Scalars['Float']['output']>
  method: Scalars['String']['output']
  section: Scalars['String']['output']
  token_id?: Maybe<Scalars['Int']['output']>
}

export type EvmTransaction = {
  __typename?: 'evmTransaction'
  block_hash: Scalars['String']['output']
  block_number: Scalars['Int']['output']
  byzantium: Scalars['Boolean']['output']
  confirmations: Scalars['Int']['output']
  contract_address?: Maybe<Scalars['String']['output']>
  cumulative_gas_used: Scalars['Float']['output']
  effective_gas_price: Scalars['Float']['output']
  from: Scalars['String']['output']
  gas_used: Scalars['Float']['output']
  logs_bloom: Scalars['String']['output']
  status: Scalars['Int']['output']
  timestamp?: Maybe<Scalars['Int']['output']>
  to: Scalars['String']['output']
  transaction_hash: Scalars['String']['output']
  transaction_index: Scalars['Int']['output']
  type: Scalars['Int']['output']
}

export type Extrinsic = {
  __typename?: 'extrinsic'
  amount?: Maybe<Scalars['Float']['output']>
  block_index: Scalars['String']['output']
  block_number: Scalars['String']['output']
  fee?: Maybe<Scalars['Float']['output']>
  from_owner?: Maybe<Scalars['String']['output']>
  from_owner_normalized?: Maybe<Scalars['String']['output']>
  hash: Scalars['String']['output']
  method: Scalars['String']['output']
  section: Scalars['String']['output']
  success: Scalars['Boolean']['output']
  timestamp: Scalars['Int']['output']
  to_owner?: Maybe<Scalars['String']['output']>
  to_owner_normalized?: Maybe<Scalars['String']['output']>
}

export type Holder = {
  __typename?: 'holder'
  collection_id: Scalars['Int']['output']
  count: Scalars['Int']['output']
  owner: Scalars['String']['output']
  owner_normalized: Scalars['String']['output']
}

export type Statistics = {
  __typename?: 'statistics'
  count?: Maybe<Scalars['Float']['output']>
  name?: Maybe<Scalars['String']['output']>
}

export type Token = {
  __typename?: 'token'
  amount?: Maybe<Scalars['String']['output']>
  animation_details?: Maybe<Scalars['JSONObject']['output']>
  animation_url?: Maybe<Scalars['String']['output']>
  attributes?: Maybe<Scalars['JSON']['output']>
  attributes_v1?: Maybe<Scalars['JSONObject']['output']>
  background_color?: Maybe<Scalars['String']['output']>
  bundle_created?: Maybe<Scalars['Int']['output']>
  burned: Scalars['Boolean']['output']
  children_count?: Maybe<Scalars['Int']['output']>
  collection_cover?: Maybe<Scalars['String']['output']>
  collection_description?: Maybe<Scalars['String']['output']>
  collection_id: Scalars['Int']['output']
  collection_name: Scalars['String']['output']
  collection_owner?: Maybe<Scalars['String']['output']>
  collection_owner_normalized?: Maybe<Scalars['String']['output']>
  created_at_block_hash?: Maybe<Scalars['String']['output']>
  created_at_block_number?: Maybe<Scalars['Int']['output']>
  created_by?: Maybe<Scalars['String']['output']>
  customizing?: Maybe<Scalars['JSONObject']['output']>
  customizing_overrides?: Maybe<Scalars['JSONObject']['output']>
  date_of_creation?: Maybe<Scalars['Int']['output']>
  description?: Maybe<Scalars['String']['output']>
  external_url?: Maybe<Scalars['String']['output']>
  image?: Maybe<Scalars['String']['output']>
  image_details?: Maybe<Scalars['JSONObject']['output']>
  image_v1?: Maybe<Scalars['JSONObject']['output']>
  is_sold: Scalars['Boolean']['output']
  locale?: Maybe<Scalars['String']['output']>
  media?: Maybe<Scalars['JSONObject']['output']>
  name?: Maybe<Scalars['String']['output']>
  nested: Scalars['Boolean']['output']
  owner: Scalars['String']['output']
  owner_normalized: Scalars['String']['output']
  parent_id?: Maybe<Scalars['String']['output']>
  properties?: Maybe<Scalars['JSON']['output']>
  royalties?: Maybe<Scalars['JSONObject']['output']>
  schema_v2?: Maybe<Scalars['JSONObject']['output']>
  token_id: Scalars['Int']['output']
  token_name?: Maybe<Scalars['String']['output']>
  token_prefix: Scalars['String']['output']
  tokens_amount?: Maybe<Scalars['String']['output']>
  tokens_children?: Maybe<Array<Scalars['JSONObject']['output']>>
  tokens_owner?: Maybe<Scalars['String']['output']>
  tokens_parent?: Maybe<Scalars['String']['output']>
  total_pieces?: Maybe<Scalars['String']['output']>
  transfers_count?: Maybe<Scalars['Int']['output']>
  type?: Maybe<TokenTypeEnum>
  updated_at_block_hash?: Maybe<Scalars['String']['output']>
  updated_at_block_number?: Maybe<Scalars['Int']['output']>
  youtube_url?: Maybe<Scalars['String']['output']>
}

export type Token_Event = {
  __typename?: 'token_event'
  action: Scalars['String']['output']
  author?: Maybe<Scalars['String']['output']>
  collection_id: Scalars['Int']['output']
  data?: Maybe<Scalars['JSON']['output']>
  fee?: Maybe<Scalars['Float']['output']>
  result?: Maybe<Scalars['Boolean']['output']>
  timestamp: Scalars['Float']['output']
  token_id?: Maybe<Scalars['Int']['output']>
  token_name?: Maybe<Scalars['String']['output']>
  tokens?: Maybe<Scalars['JSON']['output']>
  type?: Maybe<TokenTypeEnum>
  values?: Maybe<Scalars['JSONObject']['output']>
}

export type Tokens_Owners = {
  __typename?: 'tokens_owners'
  amount: Scalars['String']['output']
  collection_id: Scalars['Int']['output']
  date_created?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  owner: Scalars['String']['output']
  owner_normalized: Scalars['String']['output']
  token_id: Scalars['Int']['output']
}

export type Transaction = {
  __typename?: 'transaction'
  block_index: Scalars['String']['output']
  collection_id: Scalars['Int']['output']
  collection_name?: Maybe<Scalars['String']['output']>
  image?: Maybe<Scalars['String']['output']>
  owner: Scalars['String']['output']
  owner_normalized: Scalars['String']['output']
  timestamp?: Maybe<Scalars['Int']['output']>
  to_owner: Scalars['String']['output']
  to_owner_normalized: Scalars['String']['output']
  token_id: Scalars['Int']['output']
  token_name?: Maybe<Scalars['String']['output']>
  token_prefix?: Maybe<Scalars['String']['output']>
}

export type Transfer = {
  __typename?: 'transfer'
  block_index: Scalars['String']['output']
  data: Scalars['String']['output']
  method: Scalars['String']['output']
  section: Scalars['String']['output']
}

export type NftsQueryVariables = Exact<{
  address?: InputMaybe<Scalars['String']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
}>

export type NftsQuery = {
  __typename?: 'Query'
  tokens: {
    __typename?: 'TokenDataResponse'
    data?: Array<{
      __typename?: 'TokenEntity'
      token_id: number
      token_name?: string | null
      image?: string | null
      collection_id: number
      collection?: { __typename?: 'collection'; name: string; description?: string | null } | null
    }> | null
  }
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
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tokens' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'offset' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: '_or' },
                      value: {
                        kind: 'ListValue',
                        values: [
                          {
                            kind: 'ObjectValue',
                            fields: [
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'owner' },
                                value: {
                                  kind: 'ObjectValue',
                                  fields: [
                                    {
                                      kind: 'ObjectField',
                                      name: { kind: 'Name', value: '_eq' },
                                      value: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                          {
                            kind: 'ObjectValue',
                            fields: [
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'owner_normalized' },
                                value: {
                                  kind: 'ObjectValue',
                                  fields: [
                                    {
                                      kind: 'ObjectField',
                                      name: { kind: 'Name', value: '_eq' },
                                      value: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                          {
                            kind: 'ObjectValue',
                            fields: [
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'tokens_owner' },
                                value: {
                                  kind: 'ObjectValue',
                                  fields: [
                                    {
                                      kind: 'ObjectField',
                                      name: { kind: 'Name', value: '_eq' },
                                      value: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
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
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'token_id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'token_name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'image' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'collection_id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'collection' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'description' } },
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
  ],
} as unknown as DocumentNode<NftsQuery, NftsQueryVariables>
