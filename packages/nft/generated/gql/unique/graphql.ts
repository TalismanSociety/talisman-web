/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any
}

export type AccountDataResponse = {
  __typename?: 'AccountDataResponse'
  count: Scalars['Int']
  data?: Maybe<Array<Account>>
  timestamp: Scalars['Float']
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

export type AttributeFilterValue = {
  /** The 'key' of attribute from 'attributes' object from the attributes query */
  key: Scalars['String']
  /** The 'raw_value' of the attribute value from 'attributes[key].values[N]' object from the attributes query */
  raw_value: Scalars['String']
}

export type AttributesDataResponse = {
  __typename?: 'AttributesDataResponse'
  count: Scalars['Int']
  data?: Maybe<Array<Attribute>>
  timestamp: Scalars['Float']
}

export type AttributesOrderByParams = {
  key?: InputMaybe<GqlOrderByParamsArgs>
  name?: InputMaybe<GqlOrderByParamsArgs>
}

export type AttributesWhereParams = {
  collection_id: GqlWhereOpsIntEq
}

export type BlockDataResponse = {
  __typename?: 'BlockDataResponse'
  count: Scalars['Int']
  data?: Maybe<Array<Block>>
  timestamp: Scalars['Float']
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
  count: Scalars['Int']
  data?: Maybe<Array<CollectionEntity>>
  timestamp: Scalars['Float']
}

export type CollectionEntity = {
  __typename?: 'CollectionEntity'
  actions_count: Scalars['Int']
  attributes_schema?: Maybe<Scalars['JSON']>
  burned: Scalars['Boolean']
  collection_cover?: Maybe<Scalars['String']>
  collection_id: Scalars['Int']
  const_chain_schema?: Maybe<Scalars['JSON']>
  date_of_creation?: Maybe<Scalars['Int']>
  description?: Maybe<Scalars['String']>
  holders_count: Scalars['Int']
  limits_account_ownership?: Maybe<Scalars['Int']>
  limits_sponsore_data_rate?: Maybe<Scalars['Float']>
  limits_sponsore_data_size?: Maybe<Scalars['Float']>
  mint_mode: Scalars['Boolean']
  mode: Scalars['String']
  name: Scalars['String']
  nesting_enabled: Scalars['Boolean']
  offchain_schema?: Maybe<Scalars['String']>
  owner: Scalars['String']
  owner_can_destroy: Scalars['Boolean']
  owner_can_transfer: Scalars['Boolean']
  owner_normalized: Scalars['String']
  permissions?: Maybe<Scalars['JSONObject']>
  properties?: Maybe<Scalars['JSON']>
  schema_version?: Maybe<Scalars['String']>
  sponsorship?: Maybe<Scalars['String']>
  token_limit: Scalars['Float']
  token_prefix: Scalars['String']
  token_property_permissions?: Maybe<Scalars['JSON']>
  tokens?: Maybe<Array<Token>>
  tokens_count: Scalars['Int']
  transfers_count: Scalars['Int']
  variable_on_chain_schema?: Maybe<Scalars['JSON']>
}

export type CollectionEntityTokensArgs = {
  attributes_filter?: InputMaybe<Array<AttributeFilterValue>>
  distinct_on?: InputMaybe<TokenEnum>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
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
  count: Scalars['Int']
  data?: Maybe<Array<Collection_Event>>
  timestamp: Scalars['Float']
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
}

export type CollectionWhereParams = {
  _and?: InputMaybe<Array<CollectionWhereParams>>
  _or?: InputMaybe<Array<CollectionWhereParams>>
  burned?: InputMaybe<GqlWhereOpsString>
  collection_id?: InputMaybe<GqlWhereOpsInt>
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
}

export type EmvTransactionDataResponse = {
  __typename?: 'EmvTransactionDataResponse'
  count: Scalars['Int']
  data?: Maybe<Array<EvmTransaction>>
  timestamp: Scalars['Float']
}

export type EventDataResponse = {
  __typename?: 'EventDataResponse'
  count: Scalars['Int']
  data?: Maybe<Array<Event>>
  timestamp: Scalars['Float']
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
  count: Scalars['Int']
  data?: Maybe<Array<Extrinsic>>
  timestamp: Scalars['Float']
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
  _eq?: InputMaybe<Scalars['Boolean']>
  _neq?: InputMaybe<Scalars['String']>
}

export type GqlWhereOpsInt = {
  _eq?: InputMaybe<Scalars['Float']>
  _ilike?: InputMaybe<Scalars['Float']>
  _in?: InputMaybe<Array<Scalars['Float']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _like?: InputMaybe<Scalars['Float']>
  _neq?: InputMaybe<Scalars['Float']>
}

export type GqlWhereOpsIntEq = {
  _eq: Scalars['Float']
}

export type GqlWhereOpsString = {
  _eq?: InputMaybe<Scalars['String']>
  _ilike?: InputMaybe<Scalars['String']>
  _in?: InputMaybe<Array<Scalars['String']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _like?: InputMaybe<Scalars['String']>
  _neq?: InputMaybe<Scalars['String']>
}

export type GqlWhereTokensType = {
  _eq?: InputMaybe<TokenTypeEnum>
  _in?: InputMaybe<Array<TokenTypeEnum>>
  _neq?: InputMaybe<TokenTypeEnum>
}

export type HolderDataResponse = {
  __typename?: 'HolderDataResponse'
  count: Scalars['Int']
  data?: Maybe<Array<Holder>>
  timestamp: Scalars['Float']
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
  collection_id: Scalars['Int']
  token_id: Scalars['Int']
}

export type NestingToken = {
  __typename?: 'NestingToken'
  amount?: Maybe<Scalars['String']>
  attributes?: Maybe<Scalars['JSONObject']>
  bundle_created?: Maybe<Scalars['Int']>
  burned: Scalars['Boolean']
  children_count?: Maybe<Scalars['Int']>
  collection_id: Scalars['Int']
  date_of_creation?: Maybe<Scalars['Int']>
  image?: Maybe<Scalars['JSONObject']>
  is_sold: Scalars['Boolean']
  nested: Scalars['Boolean']
  nestingChildren?: Maybe<Array<NestingToken>>
  owner: Scalars['String']
  owner_normalized: Scalars['String']
  parent_id?: Maybe<Scalars['String']>
  properties?: Maybe<Scalars['JSON']>
  token_id: Scalars['Int']
  token_name?: Maybe<Scalars['String']>
  token_prefix: Scalars['String']
  total_pieces?: Maybe<Scalars['String']>
  type?: Maybe<TokenTypeEnum>
}

export type Query = {
  __typename?: 'Query'
  accounts: AccountDataResponse
  accountsStatistics: StatisticDataResponse
  attributes: AttributesDataResponse
  block: BlockDataResponse
  bundleTree?: Maybe<NestingToken>
  collection_events: CollectionEventDataResponse
  collections: CollectionDataResponse
  collectionsStatistics: StatisticDataResponse
  events: EventDataResponse
  evmTransactions: EmvTransactionDataResponse
  extrinsics: ExtrinsicDataResponse
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
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<AccountOrderByParams>
  where?: InputMaybe<AccountWhereParams>
}

export type QueryAccountsStatisticsArgs = {
  fromDate?: InputMaybe<Scalars['DateTime']>
  toDate?: InputMaybe<Scalars['DateTime']>
}

export type QueryAttributesArgs = {
  order_by?: InputMaybe<AttributesOrderByParams>
  where: AttributesWhereParams
}

export type QueryBlockArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<BlockOrderByParams>
  where?: InputMaybe<BlockWhereParams>
}

export type QueryBundleTreeArgs = {
  input: NestingArgs
}

export type QueryCollection_EventsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<CollectionEventOrderByParams>
  where?: InputMaybe<CollectionEventWhereParams>
}

export type QueryCollectionsArgs = {
  distinct_on?: InputMaybe<CollectionEnum>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<CollectionOrderByParams>
  where?: InputMaybe<CollectionWhereParams>
}

export type QueryCollectionsStatisticsArgs = {
  fromDate?: InputMaybe<Scalars['DateTime']>
  toDate?: InputMaybe<Scalars['DateTime']>
}

export type QueryEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<EventOrderByParams>
  where?: InputMaybe<EventWhereParams>
}

export type QueryEvmTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<EvmTransactionOrderByParams>
  where?: InputMaybe<EvmTransactionWhereParams>
}

export type QueryExtrinsicsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<ExtrinsicOrderByParams>
  where?: InputMaybe<ExtrinsicWhereParams>
}

export type QueryExtrinsicsStatisticsArgs = {
  fromDate?: InputMaybe<Scalars['DateTime']>
  toDate?: InputMaybe<Scalars['DateTime']>
  type?: InputMaybe<ExtrinsicsStatsTypeEnum>
}

export type QueryHoldersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<HolderOrderByParams>
  where?: InputMaybe<HolderWhereParams>
}

export type QueryStatisticsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<StatisticsOrderByParams>
  where?: InputMaybe<StatisticsWhereParams>
}

export type QueryTokenBundlesArgs = {
  attributes_filter?: InputMaybe<Array<AttributeFilterValue>>
  distinct_on?: InputMaybe<TokenEnum>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<TokenOrderByParams>
  where?: InputMaybe<TokenWhereParams>
}

export type QueryTokenStatisticsArgs = {
  fromDate?: InputMaybe<Scalars['DateTime']>
  toDate?: InputMaybe<Scalars['DateTime']>
}

export type QueryTokenTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<TransactionsOrderByParams>
  where?: InputMaybe<TransactionWhereParams>
}

export type QueryToken_EventsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<TokenEventOrderByParams>
  where?: InputMaybe<TokenEventWhereParams>
}

export type QueryToken_OwnersArgs = {
  distinct_on?: InputMaybe<TokenOwnersEnum>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<TokenOwnersOrderByParams>
  where?: InputMaybe<TokenOwnersWhereParams>
}

export type QueryTokensArgs = {
  attributes_filter?: InputMaybe<Array<AttributeFilterValue>>
  distinct_on?: InputMaybe<TokenEnum>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<TokenOrderByParams>
  where?: InputMaybe<TokenWhereParams>
}

export type QueryTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<TransferOrderByParams>
  where?: InputMaybe<TransferWhereParams>
}

export type StatisticDataEntity = {
  __typename?: 'StatisticDataEntity'
  count: Scalars['Int']
  date?: Maybe<Scalars['DateTime']>
}

export type StatisticDataResponse = {
  __typename?: 'StatisticDataResponse'
  data?: Maybe<Array<StatisticDataEntity>>
}

export type StatisticsDataResponse = {
  __typename?: 'StatisticsDataResponse'
  count: Scalars['Int']
  data?: Maybe<Array<Statistics>>
  timestamp: Scalars['Float']
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

export type TokenDataResponse = {
  __typename?: 'TokenDataResponse'
  count: Scalars['Int']
  data?: Maybe<Array<TokenEntity>>
  timestamp: Scalars['Float']
}

export type TokenEntity = {
  __typename?: 'TokenEntity'
  amount?: Maybe<Scalars['String']>
  attributes?: Maybe<Scalars['JSONObject']>
  bundle_created?: Maybe<Scalars['Int']>
  burned: Scalars['Boolean']
  children_count?: Maybe<Scalars['Int']>
  collection?: Maybe<Collection>
  collection_cover?: Maybe<Scalars['String']>
  collection_description?: Maybe<Scalars['String']>
  collection_id: Scalars['Int']
  collection_name: Scalars['String']
  collection_owner?: Maybe<Scalars['String']>
  collection_owner_normalized?: Maybe<Scalars['String']>
  date_of_creation?: Maybe<Scalars['Int']>
  image?: Maybe<Scalars['JSONObject']>
  is_sold: Scalars['Boolean']
  nested: Scalars['Boolean']
  owner: Scalars['String']
  owner_normalized: Scalars['String']
  parent_id?: Maybe<Scalars['String']>
  properties?: Maybe<Scalars['JSON']>
  token_id: Scalars['Int']
  token_name?: Maybe<Scalars['String']>
  token_prefix: Scalars['String']
  tokensOwners?: Maybe<Tokens_Owners>
  tokens_amount?: Maybe<Scalars['String']>
  tokens_children?: Maybe<Scalars['String']>
  tokens_owner?: Maybe<Scalars['String']>
  tokens_parent?: Maybe<Scalars['String']>
  total_pieces?: Maybe<Scalars['String']>
  transfers_count?: Maybe<Scalars['Int']>
  type?: Maybe<TokenTypeEnum>
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
  count: Scalars['Int']
  data?: Maybe<Array<Token_Event>>
  timestamp: Scalars['Float']
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
}

export type TokenOwnersDataResponse = {
  __typename?: 'TokenOwnersDataResponse'
  count: Scalars['Int']
  data?: Maybe<Array<Tokens_Owners>>
  timestamp: Scalars['Float']
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
  count: Scalars['Int']
  data?: Maybe<Array<Transaction>>
  timestamp: Scalars['Float']
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
  count: Scalars['Int']
  data?: Maybe<Array<Transfer>>
  timestamp: Scalars['Float']
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
  account_id: Scalars['String']
  account_id_normalized: Scalars['String']
  available_balance: Scalars['String']
  block_height: Scalars['Int']
  free_balance: Scalars['String']
  locked_balance: Scalars['String']
  timestamp: Scalars['Int']
}

export type Attribute = {
  __typename?: 'attribute'
  key: Scalars['String']
  name: Scalars['JSONObject']
  values: Array<Attribute_Value>
}

export type Attribute_Value = {
  __typename?: 'attribute_value'
  raw_value?: Maybe<Scalars['String']>
  tokens_count?: Maybe<Scalars['Int']>
  value?: Maybe<Scalars['JSONObject']>
}

export type Block = {
  __typename?: 'block'
  block_hash?: Maybe<Scalars['String']>
  block_number?: Maybe<Scalars['Int']>
  extrinsics_root?: Maybe<Scalars['String']>
  new_accounts?: Maybe<Scalars['Int']>
  num_transfers?: Maybe<Scalars['Int']>
  parent_hash?: Maybe<Scalars['String']>
  spec_name?: Maybe<Scalars['String']>
  spec_version?: Maybe<Scalars['Int']>
  state_root?: Maybe<Scalars['String']>
  timestamp?: Maybe<Scalars['Int']>
  total_events?: Maybe<Scalars['Int']>
  total_extrinsics?: Maybe<Scalars['Int']>
}

export type Collection = {
  __typename?: 'collection'
  actions_count: Scalars['Int']
  attributes_schema?: Maybe<Scalars['JSON']>
  burned: Scalars['Boolean']
  collection_cover?: Maybe<Scalars['String']>
  collection_id: Scalars['Int']
  const_chain_schema?: Maybe<Scalars['JSON']>
  date_of_creation?: Maybe<Scalars['Int']>
  description?: Maybe<Scalars['String']>
  holders_count: Scalars['Int']
  limits_account_ownership?: Maybe<Scalars['Int']>
  limits_sponsore_data_rate?: Maybe<Scalars['Float']>
  limits_sponsore_data_size?: Maybe<Scalars['Float']>
  mint_mode: Scalars['Boolean']
  mode: Scalars['String']
  name: Scalars['String']
  nesting_enabled: Scalars['Boolean']
  offchain_schema?: Maybe<Scalars['String']>
  owner: Scalars['String']
  owner_can_destroy: Scalars['Boolean']
  owner_can_transfer: Scalars['Boolean']
  owner_normalized: Scalars['String']
  permissions?: Maybe<Scalars['JSONObject']>
  properties?: Maybe<Scalars['JSON']>
  schema_version?: Maybe<Scalars['String']>
  sponsorship?: Maybe<Scalars['String']>
  token_limit: Scalars['Float']
  token_prefix: Scalars['String']
  token_property_permissions?: Maybe<Scalars['JSON']>
  tokens_count: Scalars['Int']
  transfers_count: Scalars['Int']
  variable_on_chain_schema?: Maybe<Scalars['JSON']>
}

export type Collection_Event = {
  __typename?: 'collection_event'
  action: Scalars['String']
  author?: Maybe<Scalars['String']>
  collection_id: Scalars['Int']
  fee?: Maybe<Scalars['Float']>
  result: Scalars['Boolean']
  timestamp: Scalars['Int']
}

export type Event = {
  __typename?: 'event'
  amount?: Maybe<Scalars['Float']>
  block_index?: Maybe<Scalars['String']>
  block_number: Scalars['String']
  collection_id?: Maybe<Scalars['Int']>
  fee: Scalars['Float']
  method: Scalars['String']
  section: Scalars['String']
  token_id?: Maybe<Scalars['Int']>
}

export type EvmTransaction = {
  __typename?: 'evmTransaction'
  block_hash: Scalars['String']
  block_number: Scalars['Int']
  byzantium: Scalars['Boolean']
  confirmations: Scalars['Int']
  contract_address?: Maybe<Scalars['String']>
  cumulative_gas_used: Scalars['Float']
  effective_gas_price: Scalars['Float']
  from: Scalars['String']
  gas_used: Scalars['Float']
  logs_bloom: Scalars['String']
  status: Scalars['Int']
  timestamp?: Maybe<Scalars['Int']>
  to: Scalars['String']
  transaction_hash: Scalars['String']
  transaction_index: Scalars['Int']
  type: Scalars['Int']
}

export type Extrinsic = {
  __typename?: 'extrinsic'
  amount?: Maybe<Scalars['Float']>
  block_index: Scalars['String']
  block_number: Scalars['String']
  fee?: Maybe<Scalars['Float']>
  from_owner?: Maybe<Scalars['String']>
  from_owner_normalized?: Maybe<Scalars['String']>
  hash: Scalars['String']
  method: Scalars['String']
  section: Scalars['String']
  success: Scalars['Boolean']
  timestamp: Scalars['Int']
  to_owner?: Maybe<Scalars['String']>
  to_owner_normalized?: Maybe<Scalars['String']>
}

export type Holder = {
  __typename?: 'holder'
  collection_id: Scalars['Int']
  count: Scalars['Int']
  owner: Scalars['String']
  owner_normalized: Scalars['String']
}

export type Statistics = {
  __typename?: 'statistics'
  count?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
}

export type Token = {
  __typename?: 'token'
  amount?: Maybe<Scalars['String']>
  attributes?: Maybe<Scalars['JSONObject']>
  bundle_created?: Maybe<Scalars['Int']>
  burned: Scalars['Boolean']
  children_count?: Maybe<Scalars['Int']>
  collection_cover?: Maybe<Scalars['String']>
  collection_description?: Maybe<Scalars['String']>
  collection_id: Scalars['Int']
  collection_name: Scalars['String']
  collection_owner?: Maybe<Scalars['String']>
  collection_owner_normalized?: Maybe<Scalars['String']>
  date_of_creation?: Maybe<Scalars['Int']>
  image?: Maybe<Scalars['JSONObject']>
  is_sold: Scalars['Boolean']
  nested: Scalars['Boolean']
  owner: Scalars['String']
  owner_normalized: Scalars['String']
  parent_id?: Maybe<Scalars['String']>
  properties?: Maybe<Scalars['JSON']>
  token_id: Scalars['Int']
  token_name?: Maybe<Scalars['String']>
  token_prefix: Scalars['String']
  tokens_amount?: Maybe<Scalars['String']>
  tokens_children?: Maybe<Scalars['String']>
  tokens_owner?: Maybe<Scalars['String']>
  tokens_parent?: Maybe<Scalars['String']>
  total_pieces?: Maybe<Scalars['String']>
  transfers_count?: Maybe<Scalars['Int']>
  type?: Maybe<TokenTypeEnum>
}

export type Token_Event = {
  __typename?: 'token_event'
  action: Scalars['String']
  author?: Maybe<Scalars['String']>
  collection_id: Scalars['Int']
  data?: Maybe<Scalars['JSON']>
  fee?: Maybe<Scalars['Float']>
  result?: Maybe<Scalars['Boolean']>
  timestamp: Scalars['Int']
  token_id?: Maybe<Scalars['Int']>
  token_name?: Maybe<Scalars['String']>
  tokens?: Maybe<Scalars['JSON']>
  type?: Maybe<TokenTypeEnum>
  values?: Maybe<Scalars['JSONObject']>
}

export type Tokens_Owners = {
  __typename?: 'tokens_owners'
  amount: Scalars['String']
  collection_id: Scalars['Int']
  date_created?: Maybe<Scalars['String']>
  id: Scalars['String']
  owner: Scalars['String']
  owner_normalized: Scalars['String']
  token_id: Scalars['Int']
}

export type Transaction = {
  __typename?: 'transaction'
  block_index: Scalars['String']
  collection_id: Scalars['Int']
  collection_name?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['JSONObject']>
  owner: Scalars['String']
  owner_normalized: Scalars['String']
  timestamp?: Maybe<Scalars['Int']>
  to_owner: Scalars['String']
  to_owner_normalized: Scalars['String']
  token_id: Scalars['Int']
  token_name?: Maybe<Scalars['String']>
  token_prefix?: Maybe<Scalars['String']>
}

export type Transfer = {
  __typename?: 'transfer'
  block_index: Scalars['String']
  data: Scalars['String']
  method: Scalars['String']
  section: Scalars['String']
}

export type NftsQueryVariables = Exact<{
  address?: InputMaybe<Scalars['String']>
  offset?: InputMaybe<Scalars['Int']>
  limit?: InputMaybe<Scalars['Int']>
}>

export type NftsQuery = {
  __typename?: 'Query'
  tokens: {
    __typename?: 'TokenDataResponse'
    data?: Array<{
      __typename?: 'TokenEntity'
      token_id: number
      token_name?: string | null
      image?: any | null
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
