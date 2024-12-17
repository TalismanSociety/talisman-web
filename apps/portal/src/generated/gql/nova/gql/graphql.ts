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
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   */
  Datetime: { input: any; output: any }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any }
}

export type AccountPoolReward = Node & {
  __typename?: 'AccountPoolReward'
  accumulatedAmount: Scalars['BigFloat']['output']
  address: Scalars['String']['output']
  amount: Scalars['BigFloat']['output']
  blockNumber: Scalars['Int']['output']
  id: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  poolId: Scalars['Int']['output']
  timestamp: Scalars['BigFloat']['output']
  type: RewardType
}

export type AccountPoolRewardAggregates = {
  __typename?: 'AccountPoolRewardAggregates'
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<AccountPoolRewardAverageAggregates>
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<AccountPoolRewardDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<AccountPoolRewardMaxAggregates>
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<AccountPoolRewardMinAggregates>
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<AccountPoolRewardStddevPopulationAggregates>
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<AccountPoolRewardStddevSampleAggregates>
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<AccountPoolRewardSumAggregates>
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<AccountPoolRewardVariancePopulationAggregates>
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<AccountPoolRewardVarianceSampleAggregates>
}

export type AccountPoolRewardAverageAggregates = {
  __typename?: 'AccountPoolRewardAverageAggregates'
  /** Mean average of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type AccountPoolRewardDistinctCountAggregates = {
  __typename?: 'AccountPoolRewardDistinctCountAggregates'
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of address across the matching connection */
  address?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of amount across the matching connection */
  amount?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of type across the matching connection */
  type?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `AccountPoolReward` object types. All fields are combined with a logical ‘and.’ */
export type AccountPoolRewardFilter = {
  /** Filter by the object’s `accumulatedAmount` field. */
  accumulatedAmount?: InputMaybe<BigFloatFilter>
  /** Filter by the object’s `address` field. */
  address?: InputMaybe<StringFilter>
  /** Filter by the object’s `amount` field. */
  amount?: InputMaybe<BigFloatFilter>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AccountPoolRewardFilter>>
  /** Filter by the object’s `blockNumber` field. */
  blockNumber?: InputMaybe<IntFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<AccountPoolRewardFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AccountPoolRewardFilter>>
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<IntFilter>
  /** Filter by the object’s `timestamp` field. */
  timestamp?: InputMaybe<BigFloatFilter>
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<RewardTypeFilter>
}

export type AccountPoolRewardMaxAggregates = {
  __typename?: 'AccountPoolRewardMaxAggregates'
  /** Maximum of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Maximum of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Maximum of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['Int']['output']>
  /** Maximum of poolId across the matching connection */
  poolId?: Maybe<Scalars['Int']['output']>
  /** Maximum of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type AccountPoolRewardMinAggregates = {
  __typename?: 'AccountPoolRewardMinAggregates'
  /** Minimum of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Minimum of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Minimum of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['Int']['output']>
  /** Minimum of poolId across the matching connection */
  poolId?: Maybe<Scalars['Int']['output']>
  /** Minimum of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type AccountPoolRewardStddevPopulationAggregates = {
  __typename?: 'AccountPoolRewardStddevPopulationAggregates'
  /** Population standard deviation of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type AccountPoolRewardStddevSampleAggregates = {
  __typename?: 'AccountPoolRewardStddevSampleAggregates'
  /** Sample standard deviation of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type AccountPoolRewardSumAggregates = {
  __typename?: 'AccountPoolRewardSumAggregates'
  /** Sum of accumulatedAmount across the matching connection */
  accumulatedAmount: Scalars['BigFloat']['output']
  /** Sum of amount across the matching connection */
  amount: Scalars['BigFloat']['output']
  /** Sum of blockNumber across the matching connection */
  blockNumber: Scalars['BigInt']['output']
  /** Sum of poolId across the matching connection */
  poolId: Scalars['BigInt']['output']
  /** Sum of timestamp across the matching connection */
  timestamp: Scalars['BigFloat']['output']
}

export type AccountPoolRewardVariancePopulationAggregates = {
  __typename?: 'AccountPoolRewardVariancePopulationAggregates'
  /** Population variance of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type AccountPoolRewardVarianceSampleAggregates = {
  __typename?: 'AccountPoolRewardVarianceSampleAggregates'
  /** Sample variance of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

/** A connection to a list of `AccountPoolReward` values. */
export type AccountPoolRewardsConnection = {
  __typename?: 'AccountPoolRewardsConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountPoolRewardAggregates>
  /** A list of edges which contains the `AccountPoolReward` and cursor to aid in pagination. */
  edges: Array<AccountPoolRewardsEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<AccountPoolRewardAggregates>>
  /** A list of `AccountPoolReward` objects. */
  nodes: Array<Maybe<AccountPoolReward>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AccountPoolReward` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `AccountPoolReward` values. */
export type AccountPoolRewardsConnectionGroupedAggregatesArgs = {
  groupBy: Array<AccountPoolRewardsGroupBy>
  having?: InputMaybe<AccountPoolRewardsHavingInput>
}

/** A `AccountPoolReward` edge in the connection. */
export type AccountPoolRewardsEdge = {
  __typename?: 'AccountPoolRewardsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `AccountPoolReward` at the end of the edge. */
  node?: Maybe<AccountPoolReward>
}

/** Grouping methods for `AccountPoolReward` for usage during aggregation. */
export enum AccountPoolRewardsGroupBy {
  AccumulatedAmount = 'ACCUMULATED_AMOUNT',
  Address = 'ADDRESS',
  Amount = 'AMOUNT',
  BlockNumber = 'BLOCK_NUMBER',
  Id = 'ID',
  PoolId = 'POOL_ID',
  Timestamp = 'TIMESTAMP',
  Type = 'TYPE',
}

export type AccountPoolRewardsHavingAverageInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  poolId?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountPoolRewardsHavingDistinctCountInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  poolId?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

/** Conditions for `AccountPoolReward` aggregates. */
export type AccountPoolRewardsHavingInput = {
  AND?: InputMaybe<Array<AccountPoolRewardsHavingInput>>
  OR?: InputMaybe<Array<AccountPoolRewardsHavingInput>>
  average?: InputMaybe<AccountPoolRewardsHavingAverageInput>
  distinctCount?: InputMaybe<AccountPoolRewardsHavingDistinctCountInput>
  max?: InputMaybe<AccountPoolRewardsHavingMaxInput>
  min?: InputMaybe<AccountPoolRewardsHavingMinInput>
  stddevPopulation?: InputMaybe<AccountPoolRewardsHavingStddevPopulationInput>
  stddevSample?: InputMaybe<AccountPoolRewardsHavingStddevSampleInput>
  sum?: InputMaybe<AccountPoolRewardsHavingSumInput>
  variancePopulation?: InputMaybe<AccountPoolRewardsHavingVariancePopulationInput>
  varianceSample?: InputMaybe<AccountPoolRewardsHavingVarianceSampleInput>
}

export type AccountPoolRewardsHavingMaxInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  poolId?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountPoolRewardsHavingMinInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  poolId?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountPoolRewardsHavingStddevPopulationInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  poolId?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountPoolRewardsHavingStddevSampleInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  poolId?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountPoolRewardsHavingSumInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  poolId?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountPoolRewardsHavingVariancePopulationInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  poolId?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountPoolRewardsHavingVarianceSampleInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  poolId?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

/** Methods to use when ordering `AccountPoolReward`. */
export enum AccountPoolRewardsOrderBy {
  AccumulatedAmountAsc = 'ACCUMULATED_AMOUNT_ASC',
  AccumulatedAmountDesc = 'ACCUMULATED_AMOUNT_DESC',
  AddressAsc = 'ADDRESS_ASC',
  AddressDesc = 'ADDRESS_DESC',
  AmountAsc = 'AMOUNT_ASC',
  AmountDesc = 'AMOUNT_DESC',
  BlockNumberAsc = 'BLOCK_NUMBER_ASC',
  BlockNumberDesc = 'BLOCK_NUMBER_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
}

export type AccountReward = Node & {
  __typename?: 'AccountReward'
  accumulatedAmount: Scalars['BigFloat']['output']
  address: Scalars['String']['output']
  amount: Scalars['BigFloat']['output']
  blockNumber: Scalars['Int']['output']
  id: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  timestamp: Scalars['BigFloat']['output']
  type: RewardType
}

export type AccountRewardAggregates = {
  __typename?: 'AccountRewardAggregates'
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<AccountRewardAverageAggregates>
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<AccountRewardDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<AccountRewardMaxAggregates>
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<AccountRewardMinAggregates>
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<AccountRewardStddevPopulationAggregates>
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<AccountRewardStddevSampleAggregates>
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<AccountRewardSumAggregates>
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<AccountRewardVariancePopulationAggregates>
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<AccountRewardVarianceSampleAggregates>
}

export type AccountRewardAverageAggregates = {
  __typename?: 'AccountRewardAverageAggregates'
  /** Mean average of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type AccountRewardDistinctCountAggregates = {
  __typename?: 'AccountRewardDistinctCountAggregates'
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of address across the matching connection */
  address?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of amount across the matching connection */
  amount?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of type across the matching connection */
  type?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `AccountReward` object types. All fields are combined with a logical ‘and.’ */
export type AccountRewardFilter = {
  /** Filter by the object’s `accumulatedAmount` field. */
  accumulatedAmount?: InputMaybe<BigFloatFilter>
  /** Filter by the object’s `address` field. */
  address?: InputMaybe<StringFilter>
  /** Filter by the object’s `amount` field. */
  amount?: InputMaybe<BigFloatFilter>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AccountRewardFilter>>
  /** Filter by the object’s `blockNumber` field. */
  blockNumber?: InputMaybe<IntFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<AccountRewardFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AccountRewardFilter>>
  /** Filter by the object’s `timestamp` field. */
  timestamp?: InputMaybe<BigFloatFilter>
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<RewardTypeFilter>
}

export type AccountRewardMaxAggregates = {
  __typename?: 'AccountRewardMaxAggregates'
  /** Maximum of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Maximum of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Maximum of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['Int']['output']>
  /** Maximum of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type AccountRewardMinAggregates = {
  __typename?: 'AccountRewardMinAggregates'
  /** Minimum of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Minimum of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Minimum of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['Int']['output']>
  /** Minimum of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type AccountRewardStddevPopulationAggregates = {
  __typename?: 'AccountRewardStddevPopulationAggregates'
  /** Population standard deviation of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type AccountRewardStddevSampleAggregates = {
  __typename?: 'AccountRewardStddevSampleAggregates'
  /** Sample standard deviation of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type AccountRewardSumAggregates = {
  __typename?: 'AccountRewardSumAggregates'
  /** Sum of accumulatedAmount across the matching connection */
  accumulatedAmount: Scalars['BigFloat']['output']
  /** Sum of amount across the matching connection */
  amount: Scalars['BigFloat']['output']
  /** Sum of blockNumber across the matching connection */
  blockNumber: Scalars['BigInt']['output']
  /** Sum of timestamp across the matching connection */
  timestamp: Scalars['BigFloat']['output']
}

export type AccountRewardVariancePopulationAggregates = {
  __typename?: 'AccountRewardVariancePopulationAggregates'
  /** Population variance of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type AccountRewardVarianceSampleAggregates = {
  __typename?: 'AccountRewardVarianceSampleAggregates'
  /** Sample variance of accumulatedAmount across the matching connection */
  accumulatedAmount?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

/** A connection to a list of `AccountReward` values. */
export type AccountRewardsConnection = {
  __typename?: 'AccountRewardsConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountRewardAggregates>
  /** A list of edges which contains the `AccountReward` and cursor to aid in pagination. */
  edges: Array<AccountRewardsEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<AccountRewardAggregates>>
  /** A list of `AccountReward` objects. */
  nodes: Array<Maybe<AccountReward>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AccountReward` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `AccountReward` values. */
export type AccountRewardsConnectionGroupedAggregatesArgs = {
  groupBy: Array<AccountRewardsGroupBy>
  having?: InputMaybe<AccountRewardsHavingInput>
}

/** A `AccountReward` edge in the connection. */
export type AccountRewardsEdge = {
  __typename?: 'AccountRewardsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `AccountReward` at the end of the edge. */
  node?: Maybe<AccountReward>
}

/** Grouping methods for `AccountReward` for usage during aggregation. */
export enum AccountRewardsGroupBy {
  AccumulatedAmount = 'ACCUMULATED_AMOUNT',
  Address = 'ADDRESS',
  Amount = 'AMOUNT',
  BlockNumber = 'BLOCK_NUMBER',
  Id = 'ID',
  Timestamp = 'TIMESTAMP',
  Type = 'TYPE',
}

export type AccountRewardsHavingAverageInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountRewardsHavingDistinctCountInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

/** Conditions for `AccountReward` aggregates. */
export type AccountRewardsHavingInput = {
  AND?: InputMaybe<Array<AccountRewardsHavingInput>>
  OR?: InputMaybe<Array<AccountRewardsHavingInput>>
  average?: InputMaybe<AccountRewardsHavingAverageInput>
  distinctCount?: InputMaybe<AccountRewardsHavingDistinctCountInput>
  max?: InputMaybe<AccountRewardsHavingMaxInput>
  min?: InputMaybe<AccountRewardsHavingMinInput>
  stddevPopulation?: InputMaybe<AccountRewardsHavingStddevPopulationInput>
  stddevSample?: InputMaybe<AccountRewardsHavingStddevSampleInput>
  sum?: InputMaybe<AccountRewardsHavingSumInput>
  variancePopulation?: InputMaybe<AccountRewardsHavingVariancePopulationInput>
  varianceSample?: InputMaybe<AccountRewardsHavingVarianceSampleInput>
}

export type AccountRewardsHavingMaxInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountRewardsHavingMinInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountRewardsHavingStddevPopulationInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountRewardsHavingStddevSampleInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountRewardsHavingSumInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountRewardsHavingVariancePopulationInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type AccountRewardsHavingVarianceSampleInput = {
  accumulatedAmount?: InputMaybe<HavingBigfloatFilter>
  amount?: InputMaybe<HavingBigfloatFilter>
  blockNumber?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

/** Methods to use when ordering `AccountReward`. */
export enum AccountRewardsOrderBy {
  AccumulatedAmountAsc = 'ACCUMULATED_AMOUNT_ASC',
  AccumulatedAmountDesc = 'ACCUMULATED_AMOUNT_DESC',
  AddressAsc = 'ADDRESS_ASC',
  AddressDesc = 'ADDRESS_DESC',
  AmountAsc = 'AMOUNT_ASC',
  AmountDesc = 'AMOUNT_DESC',
  BlockNumberAsc = 'BLOCK_NUMBER_ASC',
  BlockNumberDesc = 'BLOCK_NUMBER_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
}

export type AccumulatedPoolReward = Node & {
  __typename?: 'AccumulatedPoolReward'
  amount: Scalars['BigFloat']['output']
  id: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
}

export type AccumulatedPoolRewardAggregates = {
  __typename?: 'AccumulatedPoolRewardAggregates'
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<AccumulatedPoolRewardAverageAggregates>
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<AccumulatedPoolRewardDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<AccumulatedPoolRewardMaxAggregates>
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<AccumulatedPoolRewardMinAggregates>
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<AccumulatedPoolRewardStddevPopulationAggregates>
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<AccumulatedPoolRewardStddevSampleAggregates>
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<AccumulatedPoolRewardSumAggregates>
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<AccumulatedPoolRewardVariancePopulationAggregates>
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<AccumulatedPoolRewardVarianceSampleAggregates>
}

export type AccumulatedPoolRewardAverageAggregates = {
  __typename?: 'AccumulatedPoolRewardAverageAggregates'
  /** Mean average of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

export type AccumulatedPoolRewardDistinctCountAggregates = {
  __typename?: 'AccumulatedPoolRewardDistinctCountAggregates'
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of amount across the matching connection */
  amount?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `AccumulatedPoolReward` object types. All fields are combined with a logical ‘and.’ */
export type AccumulatedPoolRewardFilter = {
  /** Filter by the object’s `amount` field. */
  amount?: InputMaybe<BigFloatFilter>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AccumulatedPoolRewardFilter>>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<AccumulatedPoolRewardFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AccumulatedPoolRewardFilter>>
}

export type AccumulatedPoolRewardMaxAggregates = {
  __typename?: 'AccumulatedPoolRewardMaxAggregates'
  /** Maximum of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

export type AccumulatedPoolRewardMinAggregates = {
  __typename?: 'AccumulatedPoolRewardMinAggregates'
  /** Minimum of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

export type AccumulatedPoolRewardStddevPopulationAggregates = {
  __typename?: 'AccumulatedPoolRewardStddevPopulationAggregates'
  /** Population standard deviation of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

export type AccumulatedPoolRewardStddevSampleAggregates = {
  __typename?: 'AccumulatedPoolRewardStddevSampleAggregates'
  /** Sample standard deviation of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

export type AccumulatedPoolRewardSumAggregates = {
  __typename?: 'AccumulatedPoolRewardSumAggregates'
  /** Sum of amount across the matching connection */
  amount: Scalars['BigFloat']['output']
}

export type AccumulatedPoolRewardVariancePopulationAggregates = {
  __typename?: 'AccumulatedPoolRewardVariancePopulationAggregates'
  /** Population variance of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

export type AccumulatedPoolRewardVarianceSampleAggregates = {
  __typename?: 'AccumulatedPoolRewardVarianceSampleAggregates'
  /** Sample variance of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

/** A connection to a list of `AccumulatedPoolReward` values. */
export type AccumulatedPoolRewardsConnection = {
  __typename?: 'AccumulatedPoolRewardsConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccumulatedPoolRewardAggregates>
  /** A list of edges which contains the `AccumulatedPoolReward` and cursor to aid in pagination. */
  edges: Array<AccumulatedPoolRewardsEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<AccumulatedPoolRewardAggregates>>
  /** A list of `AccumulatedPoolReward` objects. */
  nodes: Array<Maybe<AccumulatedPoolReward>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AccumulatedPoolReward` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `AccumulatedPoolReward` values. */
export type AccumulatedPoolRewardsConnectionGroupedAggregatesArgs = {
  groupBy: Array<AccumulatedPoolRewardsGroupBy>
  having?: InputMaybe<AccumulatedPoolRewardsHavingInput>
}

/** A `AccumulatedPoolReward` edge in the connection. */
export type AccumulatedPoolRewardsEdge = {
  __typename?: 'AccumulatedPoolRewardsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `AccumulatedPoolReward` at the end of the edge. */
  node?: Maybe<AccumulatedPoolReward>
}

/** Grouping methods for `AccumulatedPoolReward` for usage during aggregation. */
export enum AccumulatedPoolRewardsGroupBy {
  Amount = 'AMOUNT',
  Id = 'ID',
}

export type AccumulatedPoolRewardsHavingAverageInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedPoolRewardsHavingDistinctCountInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

/** Conditions for `AccumulatedPoolReward` aggregates. */
export type AccumulatedPoolRewardsHavingInput = {
  AND?: InputMaybe<Array<AccumulatedPoolRewardsHavingInput>>
  OR?: InputMaybe<Array<AccumulatedPoolRewardsHavingInput>>
  average?: InputMaybe<AccumulatedPoolRewardsHavingAverageInput>
  distinctCount?: InputMaybe<AccumulatedPoolRewardsHavingDistinctCountInput>
  max?: InputMaybe<AccumulatedPoolRewardsHavingMaxInput>
  min?: InputMaybe<AccumulatedPoolRewardsHavingMinInput>
  stddevPopulation?: InputMaybe<AccumulatedPoolRewardsHavingStddevPopulationInput>
  stddevSample?: InputMaybe<AccumulatedPoolRewardsHavingStddevSampleInput>
  sum?: InputMaybe<AccumulatedPoolRewardsHavingSumInput>
  variancePopulation?: InputMaybe<AccumulatedPoolRewardsHavingVariancePopulationInput>
  varianceSample?: InputMaybe<AccumulatedPoolRewardsHavingVarianceSampleInput>
}

export type AccumulatedPoolRewardsHavingMaxInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedPoolRewardsHavingMinInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedPoolRewardsHavingStddevPopulationInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedPoolRewardsHavingStddevSampleInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedPoolRewardsHavingSumInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedPoolRewardsHavingVariancePopulationInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedPoolRewardsHavingVarianceSampleInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

/** Methods to use when ordering `AccumulatedPoolReward`. */
export enum AccumulatedPoolRewardsOrderBy {
  AmountAsc = 'AMOUNT_ASC',
  AmountDesc = 'AMOUNT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
}

export type AccumulatedReward = Node & {
  __typename?: 'AccumulatedReward'
  amount: Scalars['BigFloat']['output']
  id: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
}

export type AccumulatedRewardAggregates = {
  __typename?: 'AccumulatedRewardAggregates'
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<AccumulatedRewardAverageAggregates>
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<AccumulatedRewardDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<AccumulatedRewardMaxAggregates>
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<AccumulatedRewardMinAggregates>
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<AccumulatedRewardStddevPopulationAggregates>
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<AccumulatedRewardStddevSampleAggregates>
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<AccumulatedRewardSumAggregates>
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<AccumulatedRewardVariancePopulationAggregates>
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<AccumulatedRewardVarianceSampleAggregates>
}

export type AccumulatedRewardAverageAggregates = {
  __typename?: 'AccumulatedRewardAverageAggregates'
  /** Mean average of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

export type AccumulatedRewardDistinctCountAggregates = {
  __typename?: 'AccumulatedRewardDistinctCountAggregates'
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of amount across the matching connection */
  amount?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `AccumulatedReward` object types. All fields are combined with a logical ‘and.’ */
export type AccumulatedRewardFilter = {
  /** Filter by the object’s `amount` field. */
  amount?: InputMaybe<BigFloatFilter>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AccumulatedRewardFilter>>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<AccumulatedRewardFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AccumulatedRewardFilter>>
}

export type AccumulatedRewardMaxAggregates = {
  __typename?: 'AccumulatedRewardMaxAggregates'
  /** Maximum of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

export type AccumulatedRewardMinAggregates = {
  __typename?: 'AccumulatedRewardMinAggregates'
  /** Minimum of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

export type AccumulatedRewardStddevPopulationAggregates = {
  __typename?: 'AccumulatedRewardStddevPopulationAggregates'
  /** Population standard deviation of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

export type AccumulatedRewardStddevSampleAggregates = {
  __typename?: 'AccumulatedRewardStddevSampleAggregates'
  /** Sample standard deviation of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

export type AccumulatedRewardSumAggregates = {
  __typename?: 'AccumulatedRewardSumAggregates'
  /** Sum of amount across the matching connection */
  amount: Scalars['BigFloat']['output']
}

export type AccumulatedRewardVariancePopulationAggregates = {
  __typename?: 'AccumulatedRewardVariancePopulationAggregates'
  /** Population variance of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

export type AccumulatedRewardVarianceSampleAggregates = {
  __typename?: 'AccumulatedRewardVarianceSampleAggregates'
  /** Sample variance of amount across the matching connection */
  amount?: Maybe<Scalars['BigFloat']['output']>
}

/** A connection to a list of `AccumulatedReward` values. */
export type AccumulatedRewardsConnection = {
  __typename?: 'AccumulatedRewardsConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccumulatedRewardAggregates>
  /** A list of edges which contains the `AccumulatedReward` and cursor to aid in pagination. */
  edges: Array<AccumulatedRewardsEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<AccumulatedRewardAggregates>>
  /** A list of `AccumulatedReward` objects. */
  nodes: Array<Maybe<AccumulatedReward>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AccumulatedReward` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `AccumulatedReward` values. */
export type AccumulatedRewardsConnectionGroupedAggregatesArgs = {
  groupBy: Array<AccumulatedRewardsGroupBy>
  having?: InputMaybe<AccumulatedRewardsHavingInput>
}

/** A `AccumulatedReward` edge in the connection. */
export type AccumulatedRewardsEdge = {
  __typename?: 'AccumulatedRewardsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `AccumulatedReward` at the end of the edge. */
  node?: Maybe<AccumulatedReward>
}

/** Grouping methods for `AccumulatedReward` for usage during aggregation. */
export enum AccumulatedRewardsGroupBy {
  Amount = 'AMOUNT',
  Id = 'ID',
}

export type AccumulatedRewardsHavingAverageInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedRewardsHavingDistinctCountInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

/** Conditions for `AccumulatedReward` aggregates. */
export type AccumulatedRewardsHavingInput = {
  AND?: InputMaybe<Array<AccumulatedRewardsHavingInput>>
  OR?: InputMaybe<Array<AccumulatedRewardsHavingInput>>
  average?: InputMaybe<AccumulatedRewardsHavingAverageInput>
  distinctCount?: InputMaybe<AccumulatedRewardsHavingDistinctCountInput>
  max?: InputMaybe<AccumulatedRewardsHavingMaxInput>
  min?: InputMaybe<AccumulatedRewardsHavingMinInput>
  stddevPopulation?: InputMaybe<AccumulatedRewardsHavingStddevPopulationInput>
  stddevSample?: InputMaybe<AccumulatedRewardsHavingStddevSampleInput>
  sum?: InputMaybe<AccumulatedRewardsHavingSumInput>
  variancePopulation?: InputMaybe<AccumulatedRewardsHavingVariancePopulationInput>
  varianceSample?: InputMaybe<AccumulatedRewardsHavingVarianceSampleInput>
}

export type AccumulatedRewardsHavingMaxInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedRewardsHavingMinInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedRewardsHavingStddevPopulationInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedRewardsHavingStddevSampleInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedRewardsHavingSumInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedRewardsHavingVariancePopulationInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

export type AccumulatedRewardsHavingVarianceSampleInput = {
  amount?: InputMaybe<HavingBigfloatFilter>
}

/** Methods to use when ordering `AccumulatedReward`. */
export enum AccumulatedRewardsOrderBy {
  AmountAsc = 'AMOUNT_ASC',
  AmountDesc = 'AMOUNT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
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

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']['input']>>
}

export type EraValidatorInfo = Node & {
  __typename?: 'EraValidatorInfo'
  address: Scalars['String']['output']
  era: Scalars['Int']['output']
  id: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  others: Scalars['JSON']['output']
  own: Scalars['BigFloat']['output']
  total: Scalars['BigFloat']['output']
}

export type EraValidatorInfoAggregates = {
  __typename?: 'EraValidatorInfoAggregates'
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<EraValidatorInfoAverageAggregates>
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<EraValidatorInfoDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<EraValidatorInfoMaxAggregates>
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<EraValidatorInfoMinAggregates>
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<EraValidatorInfoStddevPopulationAggregates>
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<EraValidatorInfoStddevSampleAggregates>
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<EraValidatorInfoSumAggregates>
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<EraValidatorInfoVariancePopulationAggregates>
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<EraValidatorInfoVarianceSampleAggregates>
}

export type EraValidatorInfoAverageAggregates = {
  __typename?: 'EraValidatorInfoAverageAggregates'
  /** Mean average of era across the matching connection */
  era?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of own across the matching connection */
  own?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of total across the matching connection */
  total?: Maybe<Scalars['BigFloat']['output']>
}

export type EraValidatorInfoDistinctCountAggregates = {
  __typename?: 'EraValidatorInfoDistinctCountAggregates'
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of address across the matching connection */
  address?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of era across the matching connection */
  era?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of others across the matching connection */
  others?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of own across the matching connection */
  own?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of total across the matching connection */
  total?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `EraValidatorInfo` object types. All fields are combined with a logical ‘and.’ */
export type EraValidatorInfoFilter = {
  /** Filter by the object’s `address` field. */
  address?: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EraValidatorInfoFilter>>
  /** Filter by the object’s `era` field. */
  era?: InputMaybe<IntFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<EraValidatorInfoFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EraValidatorInfoFilter>>
  /** Filter by the object’s `others` field. */
  others?: InputMaybe<JsonFilter>
  /** Filter by the object’s `own` field. */
  own?: InputMaybe<BigFloatFilter>
  /** Filter by the object’s `total` field. */
  total?: InputMaybe<BigFloatFilter>
}

export type EraValidatorInfoMaxAggregates = {
  __typename?: 'EraValidatorInfoMaxAggregates'
  /** Maximum of era across the matching connection */
  era?: Maybe<Scalars['Int']['output']>
  /** Maximum of own across the matching connection */
  own?: Maybe<Scalars['BigFloat']['output']>
  /** Maximum of total across the matching connection */
  total?: Maybe<Scalars['BigFloat']['output']>
}

export type EraValidatorInfoMinAggregates = {
  __typename?: 'EraValidatorInfoMinAggregates'
  /** Minimum of era across the matching connection */
  era?: Maybe<Scalars['Int']['output']>
  /** Minimum of own across the matching connection */
  own?: Maybe<Scalars['BigFloat']['output']>
  /** Minimum of total across the matching connection */
  total?: Maybe<Scalars['BigFloat']['output']>
}

export type EraValidatorInfoStddevPopulationAggregates = {
  __typename?: 'EraValidatorInfoStddevPopulationAggregates'
  /** Population standard deviation of era across the matching connection */
  era?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of own across the matching connection */
  own?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of total across the matching connection */
  total?: Maybe<Scalars['BigFloat']['output']>
}

export type EraValidatorInfoStddevSampleAggregates = {
  __typename?: 'EraValidatorInfoStddevSampleAggregates'
  /** Sample standard deviation of era across the matching connection */
  era?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of own across the matching connection */
  own?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of total across the matching connection */
  total?: Maybe<Scalars['BigFloat']['output']>
}

export type EraValidatorInfoSumAggregates = {
  __typename?: 'EraValidatorInfoSumAggregates'
  /** Sum of era across the matching connection */
  era: Scalars['BigInt']['output']
  /** Sum of own across the matching connection */
  own: Scalars['BigFloat']['output']
  /** Sum of total across the matching connection */
  total: Scalars['BigFloat']['output']
}

export type EraValidatorInfoVariancePopulationAggregates = {
  __typename?: 'EraValidatorInfoVariancePopulationAggregates'
  /** Population variance of era across the matching connection */
  era?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of own across the matching connection */
  own?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of total across the matching connection */
  total?: Maybe<Scalars['BigFloat']['output']>
}

export type EraValidatorInfoVarianceSampleAggregates = {
  __typename?: 'EraValidatorInfoVarianceSampleAggregates'
  /** Sample variance of era across the matching connection */
  era?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of own across the matching connection */
  own?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of total across the matching connection */
  total?: Maybe<Scalars['BigFloat']['output']>
}

/** A connection to a list of `EraValidatorInfo` values. */
export type EraValidatorInfosConnection = {
  __typename?: 'EraValidatorInfosConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<EraValidatorInfoAggregates>
  /** A list of edges which contains the `EraValidatorInfo` and cursor to aid in pagination. */
  edges: Array<EraValidatorInfosEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<EraValidatorInfoAggregates>>
  /** A list of `EraValidatorInfo` objects. */
  nodes: Array<Maybe<EraValidatorInfo>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `EraValidatorInfo` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `EraValidatorInfo` values. */
export type EraValidatorInfosConnectionGroupedAggregatesArgs = {
  groupBy: Array<EraValidatorInfosGroupBy>
  having?: InputMaybe<EraValidatorInfosHavingInput>
}

/** A `EraValidatorInfo` edge in the connection. */
export type EraValidatorInfosEdge = {
  __typename?: 'EraValidatorInfosEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `EraValidatorInfo` at the end of the edge. */
  node?: Maybe<EraValidatorInfo>
}

/** Grouping methods for `EraValidatorInfo` for usage during aggregation. */
export enum EraValidatorInfosGroupBy {
  Address = 'ADDRESS',
  Era = 'ERA',
  Id = 'ID',
  Others = 'OTHERS',
  Own = 'OWN',
  Total = 'TOTAL',
}

export type EraValidatorInfosHavingAverageInput = {
  era?: InputMaybe<HavingIntFilter>
  own?: InputMaybe<HavingBigfloatFilter>
  total?: InputMaybe<HavingBigfloatFilter>
}

export type EraValidatorInfosHavingDistinctCountInput = {
  era?: InputMaybe<HavingIntFilter>
  own?: InputMaybe<HavingBigfloatFilter>
  total?: InputMaybe<HavingBigfloatFilter>
}

/** Conditions for `EraValidatorInfo` aggregates. */
export type EraValidatorInfosHavingInput = {
  AND?: InputMaybe<Array<EraValidatorInfosHavingInput>>
  OR?: InputMaybe<Array<EraValidatorInfosHavingInput>>
  average?: InputMaybe<EraValidatorInfosHavingAverageInput>
  distinctCount?: InputMaybe<EraValidatorInfosHavingDistinctCountInput>
  max?: InputMaybe<EraValidatorInfosHavingMaxInput>
  min?: InputMaybe<EraValidatorInfosHavingMinInput>
  stddevPopulation?: InputMaybe<EraValidatorInfosHavingStddevPopulationInput>
  stddevSample?: InputMaybe<EraValidatorInfosHavingStddevSampleInput>
  sum?: InputMaybe<EraValidatorInfosHavingSumInput>
  variancePopulation?: InputMaybe<EraValidatorInfosHavingVariancePopulationInput>
  varianceSample?: InputMaybe<EraValidatorInfosHavingVarianceSampleInput>
}

export type EraValidatorInfosHavingMaxInput = {
  era?: InputMaybe<HavingIntFilter>
  own?: InputMaybe<HavingBigfloatFilter>
  total?: InputMaybe<HavingBigfloatFilter>
}

export type EraValidatorInfosHavingMinInput = {
  era?: InputMaybe<HavingIntFilter>
  own?: InputMaybe<HavingBigfloatFilter>
  total?: InputMaybe<HavingBigfloatFilter>
}

export type EraValidatorInfosHavingStddevPopulationInput = {
  era?: InputMaybe<HavingIntFilter>
  own?: InputMaybe<HavingBigfloatFilter>
  total?: InputMaybe<HavingBigfloatFilter>
}

export type EraValidatorInfosHavingStddevSampleInput = {
  era?: InputMaybe<HavingIntFilter>
  own?: InputMaybe<HavingBigfloatFilter>
  total?: InputMaybe<HavingBigfloatFilter>
}

export type EraValidatorInfosHavingSumInput = {
  era?: InputMaybe<HavingIntFilter>
  own?: InputMaybe<HavingBigfloatFilter>
  total?: InputMaybe<HavingBigfloatFilter>
}

export type EraValidatorInfosHavingVariancePopulationInput = {
  era?: InputMaybe<HavingIntFilter>
  own?: InputMaybe<HavingBigfloatFilter>
  total?: InputMaybe<HavingBigfloatFilter>
}

export type EraValidatorInfosHavingVarianceSampleInput = {
  era?: InputMaybe<HavingIntFilter>
  own?: InputMaybe<HavingBigfloatFilter>
  total?: InputMaybe<HavingBigfloatFilter>
}

/** Methods to use when ordering `EraValidatorInfo`. */
export enum EraValidatorInfosOrderBy {
  AddressAsc = 'ADDRESS_ASC',
  AddressDesc = 'ADDRESS_DESC',
  EraAsc = 'ERA_ASC',
  EraDesc = 'ERA_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  OthersAsc = 'OTHERS_ASC',
  OthersDesc = 'OTHERS_DESC',
  OwnAsc = 'OWN_ASC',
  OwnDesc = 'OWN_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TotalAsc = 'TOTAL_ASC',
  TotalDesc = 'TOTAL_DESC',
}

export type ErrorEvent = Node & {
  __typename?: 'ErrorEvent'
  description: Scalars['String']['output']
  id: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
}

export type ErrorEventAggregates = {
  __typename?: 'ErrorEventAggregates'
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<ErrorEventDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
}

export type ErrorEventDistinctCountAggregates = {
  __typename?: 'ErrorEventDistinctCountAggregates'
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of description across the matching connection */
  description?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `ErrorEvent` object types. All fields are combined with a logical ‘and.’ */
export type ErrorEventFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ErrorEventFilter>>
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<ErrorEventFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ErrorEventFilter>>
}

/** A connection to a list of `ErrorEvent` values. */
export type ErrorEventsConnection = {
  __typename?: 'ErrorEventsConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<ErrorEventAggregates>
  /** A list of edges which contains the `ErrorEvent` and cursor to aid in pagination. */
  edges: Array<ErrorEventsEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<ErrorEventAggregates>>
  /** A list of `ErrorEvent` objects. */
  nodes: Array<Maybe<ErrorEvent>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `ErrorEvent` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `ErrorEvent` values. */
export type ErrorEventsConnectionGroupedAggregatesArgs = {
  groupBy: Array<ErrorEventsGroupBy>
  having?: InputMaybe<ErrorEventsHavingInput>
}

/** A `ErrorEvent` edge in the connection. */
export type ErrorEventsEdge = {
  __typename?: 'ErrorEventsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `ErrorEvent` at the end of the edge. */
  node?: Maybe<ErrorEvent>
}

/** Grouping methods for `ErrorEvent` for usage during aggregation. */
export enum ErrorEventsGroupBy {
  Description = 'DESCRIPTION',
  Id = 'ID',
}

/** Conditions for `ErrorEvent` aggregates. */
export type ErrorEventsHavingInput = {
  AND?: InputMaybe<Array<ErrorEventsHavingInput>>
  OR?: InputMaybe<Array<ErrorEventsHavingInput>>
}

/** Methods to use when ordering `ErrorEvent`. */
export enum ErrorEventsOrderBy {
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
}

export type HavingBigfloatFilter = {
  equalTo?: InputMaybe<Scalars['BigFloat']['input']>
  greaterThan?: InputMaybe<Scalars['BigFloat']['input']>
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>
  lessThan?: InputMaybe<Scalars['BigFloat']['input']>
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>
  notEqualTo?: InputMaybe<Scalars['BigFloat']['input']>
}

export type HavingDatetimeFilter = {
  equalTo?: InputMaybe<Scalars['Datetime']['input']>
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>
  lessThan?: InputMaybe<Scalars['Datetime']['input']>
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>
  notEqualTo?: InputMaybe<Scalars['Datetime']['input']>
}

export type HavingIntFilter = {
  equalTo?: InputMaybe<Scalars['Int']['input']>
  greaterThan?: InputMaybe<Scalars['Int']['input']>
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>
  lessThan?: InputMaybe<Scalars['Int']['input']>
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>
  notEqualTo?: InputMaybe<Scalars['Int']['input']>
}

export type HistoryElement = Node & {
  __typename?: 'HistoryElement'
  address: Scalars['String']['output']
  assetTransfer?: Maybe<Scalars['JSON']['output']>
  blockNumber: Scalars['Int']['output']
  extrinsic?: Maybe<Scalars['JSON']['output']>
  extrinsicHash?: Maybe<Scalars['String']['output']>
  extrinsicIdx?: Maybe<Scalars['Int']['output']>
  id: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  poolReward?: Maybe<Scalars['JSON']['output']>
  reward?: Maybe<Scalars['JSON']['output']>
  swap?: Maybe<Scalars['JSON']['output']>
  timestamp: Scalars['BigFloat']['output']
  transfer?: Maybe<Scalars['JSON']['output']>
}

export type HistoryElementAggregates = {
  __typename?: 'HistoryElementAggregates'
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<HistoryElementAverageAggregates>
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<HistoryElementDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<HistoryElementMaxAggregates>
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<HistoryElementMinAggregates>
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<HistoryElementStddevPopulationAggregates>
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<HistoryElementStddevSampleAggregates>
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<HistoryElementSumAggregates>
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<HistoryElementVariancePopulationAggregates>
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<HistoryElementVarianceSampleAggregates>
}

export type HistoryElementAverageAggregates = {
  __typename?: 'HistoryElementAverageAggregates'
  /** Mean average of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of extrinsicIdx across the matching connection */
  extrinsicIdx?: Maybe<Scalars['BigFloat']['output']>
  /** Mean average of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type HistoryElementDistinctCountAggregates = {
  __typename?: 'HistoryElementDistinctCountAggregates'
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of address across the matching connection */
  address?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of assetTransfer across the matching connection */
  assetTransfer?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of extrinsic across the matching connection */
  extrinsic?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of extrinsicHash across the matching connection */
  extrinsicHash?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of extrinsicIdx across the matching connection */
  extrinsicIdx?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of poolReward across the matching connection */
  poolReward?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of reward across the matching connection */
  reward?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of swap across the matching connection */
  swap?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of transfer across the matching connection */
  transfer?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `HistoryElement` object types. All fields are combined with a logical ‘and.’ */
export type HistoryElementFilter = {
  /** Filter by the object’s `address` field. */
  address?: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<HistoryElementFilter>>
  /** Filter by the object’s `assetTransfer` field. */
  assetTransfer?: InputMaybe<JsonFilter>
  /** Filter by the object’s `blockNumber` field. */
  blockNumber?: InputMaybe<IntFilter>
  /** Filter by the object’s `extrinsic` field. */
  extrinsic?: InputMaybe<JsonFilter>
  /** Filter by the object’s `extrinsicHash` field. */
  extrinsicHash?: InputMaybe<StringFilter>
  /** Filter by the object’s `extrinsicIdx` field. */
  extrinsicIdx?: InputMaybe<IntFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<HistoryElementFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<HistoryElementFilter>>
  /** Filter by the object’s `poolReward` field. */
  poolReward?: InputMaybe<JsonFilter>
  /** Filter by the object’s `reward` field. */
  reward?: InputMaybe<JsonFilter>
  /** Filter by the object’s `swap` field. */
  swap?: InputMaybe<JsonFilter>
  /** Filter by the object’s `timestamp` field. */
  timestamp?: InputMaybe<BigFloatFilter>
  /** Filter by the object’s `transfer` field. */
  transfer?: InputMaybe<JsonFilter>
}

export type HistoryElementMaxAggregates = {
  __typename?: 'HistoryElementMaxAggregates'
  /** Maximum of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['Int']['output']>
  /** Maximum of extrinsicIdx across the matching connection */
  extrinsicIdx?: Maybe<Scalars['Int']['output']>
  /** Maximum of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type HistoryElementMinAggregates = {
  __typename?: 'HistoryElementMinAggregates'
  /** Minimum of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['Int']['output']>
  /** Minimum of extrinsicIdx across the matching connection */
  extrinsicIdx?: Maybe<Scalars['Int']['output']>
  /** Minimum of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type HistoryElementStddevPopulationAggregates = {
  __typename?: 'HistoryElementStddevPopulationAggregates'
  /** Population standard deviation of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of extrinsicIdx across the matching connection */
  extrinsicIdx?: Maybe<Scalars['BigFloat']['output']>
  /** Population standard deviation of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type HistoryElementStddevSampleAggregates = {
  __typename?: 'HistoryElementStddevSampleAggregates'
  /** Sample standard deviation of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of extrinsicIdx across the matching connection */
  extrinsicIdx?: Maybe<Scalars['BigFloat']['output']>
  /** Sample standard deviation of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type HistoryElementSumAggregates = {
  __typename?: 'HistoryElementSumAggregates'
  /** Sum of blockNumber across the matching connection */
  blockNumber: Scalars['BigInt']['output']
  /** Sum of extrinsicIdx across the matching connection */
  extrinsicIdx: Scalars['BigInt']['output']
  /** Sum of timestamp across the matching connection */
  timestamp: Scalars['BigFloat']['output']
}

export type HistoryElementVariancePopulationAggregates = {
  __typename?: 'HistoryElementVariancePopulationAggregates'
  /** Population variance of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of extrinsicIdx across the matching connection */
  extrinsicIdx?: Maybe<Scalars['BigFloat']['output']>
  /** Population variance of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

export type HistoryElementVarianceSampleAggregates = {
  __typename?: 'HistoryElementVarianceSampleAggregates'
  /** Sample variance of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of extrinsicIdx across the matching connection */
  extrinsicIdx?: Maybe<Scalars['BigFloat']['output']>
  /** Sample variance of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>
}

/** A connection to a list of `HistoryElement` values. */
export type HistoryElementsConnection = {
  __typename?: 'HistoryElementsConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<HistoryElementAggregates>
  /** A list of edges which contains the `HistoryElement` and cursor to aid in pagination. */
  edges: Array<HistoryElementsEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<HistoryElementAggregates>>
  /** A list of `HistoryElement` objects. */
  nodes: Array<Maybe<HistoryElement>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `HistoryElement` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `HistoryElement` values. */
export type HistoryElementsConnectionGroupedAggregatesArgs = {
  groupBy: Array<HistoryElementsGroupBy>
  having?: InputMaybe<HistoryElementsHavingInput>
}

/** A `HistoryElement` edge in the connection. */
export type HistoryElementsEdge = {
  __typename?: 'HistoryElementsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `HistoryElement` at the end of the edge. */
  node?: Maybe<HistoryElement>
}

/** Grouping methods for `HistoryElement` for usage during aggregation. */
export enum HistoryElementsGroupBy {
  Address = 'ADDRESS',
  AssetTransfer = 'ASSET_TRANSFER',
  BlockNumber = 'BLOCK_NUMBER',
  Extrinsic = 'EXTRINSIC',
  ExtrinsicHash = 'EXTRINSIC_HASH',
  ExtrinsicIdx = 'EXTRINSIC_IDX',
  Id = 'ID',
  PoolReward = 'POOL_REWARD',
  Reward = 'REWARD',
  Swap = 'SWAP',
  Timestamp = 'TIMESTAMP',
  Transfer = 'TRANSFER',
}

export type HistoryElementsHavingAverageInput = {
  blockNumber?: InputMaybe<HavingIntFilter>
  extrinsicIdx?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type HistoryElementsHavingDistinctCountInput = {
  blockNumber?: InputMaybe<HavingIntFilter>
  extrinsicIdx?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

/** Conditions for `HistoryElement` aggregates. */
export type HistoryElementsHavingInput = {
  AND?: InputMaybe<Array<HistoryElementsHavingInput>>
  OR?: InputMaybe<Array<HistoryElementsHavingInput>>
  average?: InputMaybe<HistoryElementsHavingAverageInput>
  distinctCount?: InputMaybe<HistoryElementsHavingDistinctCountInput>
  max?: InputMaybe<HistoryElementsHavingMaxInput>
  min?: InputMaybe<HistoryElementsHavingMinInput>
  stddevPopulation?: InputMaybe<HistoryElementsHavingStddevPopulationInput>
  stddevSample?: InputMaybe<HistoryElementsHavingStddevSampleInput>
  sum?: InputMaybe<HistoryElementsHavingSumInput>
  variancePopulation?: InputMaybe<HistoryElementsHavingVariancePopulationInput>
  varianceSample?: InputMaybe<HistoryElementsHavingVarianceSampleInput>
}

export type HistoryElementsHavingMaxInput = {
  blockNumber?: InputMaybe<HavingIntFilter>
  extrinsicIdx?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type HistoryElementsHavingMinInput = {
  blockNumber?: InputMaybe<HavingIntFilter>
  extrinsicIdx?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type HistoryElementsHavingStddevPopulationInput = {
  blockNumber?: InputMaybe<HavingIntFilter>
  extrinsicIdx?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type HistoryElementsHavingStddevSampleInput = {
  blockNumber?: InputMaybe<HavingIntFilter>
  extrinsicIdx?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type HistoryElementsHavingSumInput = {
  blockNumber?: InputMaybe<HavingIntFilter>
  extrinsicIdx?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type HistoryElementsHavingVariancePopulationInput = {
  blockNumber?: InputMaybe<HavingIntFilter>
  extrinsicIdx?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

export type HistoryElementsHavingVarianceSampleInput = {
  blockNumber?: InputMaybe<HavingIntFilter>
  extrinsicIdx?: InputMaybe<HavingIntFilter>
  timestamp?: InputMaybe<HavingBigfloatFilter>
}

/** Methods to use when ordering `HistoryElement`. */
export enum HistoryElementsOrderBy {
  AddressAsc = 'ADDRESS_ASC',
  AddressDesc = 'ADDRESS_DESC',
  AssetTransferAsc = 'ASSET_TRANSFER_ASC',
  AssetTransferDesc = 'ASSET_TRANSFER_DESC',
  BlockNumberAsc = 'BLOCK_NUMBER_ASC',
  BlockNumberDesc = 'BLOCK_NUMBER_DESC',
  ExtrinsicAsc = 'EXTRINSIC_ASC',
  ExtrinsicDesc = 'EXTRINSIC_DESC',
  ExtrinsicHashAsc = 'EXTRINSIC_HASH_ASC',
  ExtrinsicHashDesc = 'EXTRINSIC_HASH_DESC',
  ExtrinsicIdxAsc = 'EXTRINSIC_IDX_ASC',
  ExtrinsicIdxDesc = 'EXTRINSIC_IDX_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PoolRewardAsc = 'POOL_REWARD_ASC',
  PoolRewardDesc = 'POOL_REWARD_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RewardAsc = 'REWARD_ASC',
  RewardDesc = 'REWARD_DESC',
  SwapAsc = 'SWAP_ASC',
  SwapDesc = 'SWAP_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC',
  TransferAsc = 'TRANSFER_ASC',
  TransferDesc = 'TRANSFER_DESC',
}

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Int']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Int']['input']>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>
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
  _poi?: Maybe<_Poi>
  _poiByChainBlockHash?: Maybe<_Poi>
  _poiByHash?: Maybe<_Poi>
  /** Reads a single `_Poi` using its globally unique `ID`. */
  _poiByNodeId?: Maybe<_Poi>
  _poiByParentHash?: Maybe<_Poi>
  /** Reads and enables pagination through a set of `_Poi`. */
  _pois?: Maybe<_PoisConnection>
  accountPoolReward?: Maybe<AccountPoolReward>
  /** Reads a single `AccountPoolReward` using its globally unique `ID`. */
  accountPoolRewardByNodeId?: Maybe<AccountPoolReward>
  /** Reads and enables pagination through a set of `AccountPoolReward`. */
  accountPoolRewards?: Maybe<AccountPoolRewardsConnection>
  accountReward?: Maybe<AccountReward>
  /** Reads a single `AccountReward` using its globally unique `ID`. */
  accountRewardByNodeId?: Maybe<AccountReward>
  /** Reads and enables pagination through a set of `AccountReward`. */
  accountRewards?: Maybe<AccountRewardsConnection>
  accumulatedPoolReward?: Maybe<AccumulatedPoolReward>
  /** Reads a single `AccumulatedPoolReward` using its globally unique `ID`. */
  accumulatedPoolRewardByNodeId?: Maybe<AccumulatedPoolReward>
  /** Reads and enables pagination through a set of `AccumulatedPoolReward`. */
  accumulatedPoolRewards?: Maybe<AccumulatedPoolRewardsConnection>
  accumulatedReward?: Maybe<AccumulatedReward>
  /** Reads a single `AccumulatedReward` using its globally unique `ID`. */
  accumulatedRewardByNodeId?: Maybe<AccumulatedReward>
  /** Reads and enables pagination through a set of `AccumulatedReward`. */
  accumulatedRewards?: Maybe<AccumulatedRewardsConnection>
  eraValidatorInfo?: Maybe<EraValidatorInfo>
  /** Reads a single `EraValidatorInfo` using its globally unique `ID`. */
  eraValidatorInfoByNodeId?: Maybe<EraValidatorInfo>
  /** Reads and enables pagination through a set of `EraValidatorInfo`. */
  eraValidatorInfos?: Maybe<EraValidatorInfosConnection>
  errorEvent?: Maybe<ErrorEvent>
  /** Reads a single `ErrorEvent` using its globally unique `ID`. */
  errorEventByNodeId?: Maybe<ErrorEvent>
  /** Reads and enables pagination through a set of `ErrorEvent`. */
  errorEvents?: Maybe<ErrorEventsConnection>
  historyElement?: Maybe<HistoryElement>
  /** Reads a single `HistoryElement` using its globally unique `ID`. */
  historyElementByNodeId?: Maybe<HistoryElement>
  /** Reads and enables pagination through a set of `HistoryElement`. */
  historyElements?: Maybe<HistoryElementsConnection>
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output']
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query
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
export type Query_PoiArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type Query_PoiByChainBlockHashArgs = {
  chainBlockHash: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type Query_PoiByHashArgs = {
  hash: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type Query_PoiByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<_Poi_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type Query_PoiByParentHashArgs = {
  parentHash: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type Query_PoisArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  distinct?: InputMaybe<Array<InputMaybe<_Poi_Distinct_Enum>>>
  filter?: InputMaybe<_PoiFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<_PoisOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAccountPoolRewardArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryAccountPoolRewardByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Account_Pool_Rewards_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryAccountPoolRewardsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  blockHeight?: InputMaybe<Scalars['String']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Account_Pool_Rewards_Distinct_Enum>>>
  filter?: InputMaybe<AccountPoolRewardFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AccountPoolRewardsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAccountRewardArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryAccountRewardByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Account_Rewards_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryAccountRewardsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  blockHeight?: InputMaybe<Scalars['String']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Account_Rewards_Distinct_Enum>>>
  filter?: InputMaybe<AccountRewardFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AccountRewardsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAccumulatedPoolRewardArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryAccumulatedPoolRewardByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Accumulated_Pool_Rewards_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryAccumulatedPoolRewardsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  blockHeight?: InputMaybe<Scalars['String']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Accumulated_Pool_Rewards_Distinct_Enum>>>
  filter?: InputMaybe<AccumulatedPoolRewardFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AccumulatedPoolRewardsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAccumulatedRewardArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryAccumulatedRewardByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Accumulated_Rewards_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryAccumulatedRewardsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  blockHeight?: InputMaybe<Scalars['String']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Accumulated_Rewards_Distinct_Enum>>>
  filter?: InputMaybe<AccumulatedRewardFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AccumulatedRewardsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryEraValidatorInfoArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryEraValidatorInfoByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Era_Validator_Infos_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryEraValidatorInfosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  blockHeight?: InputMaybe<Scalars['String']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Era_Validator_Infos_Distinct_Enum>>>
  filter?: InputMaybe<EraValidatorInfoFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<EraValidatorInfosOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryErrorEventArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryErrorEventByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<Error_Events_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryErrorEventsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  blockHeight?: InputMaybe<Scalars['String']['input']>
  distinct?: InputMaybe<Array<InputMaybe<Error_Events_Distinct_Enum>>>
  filter?: InputMaybe<ErrorEventFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ErrorEventsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryHistoryElementArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>
  id: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryHistoryElementByNodeIdArgs = {
  distinct?: InputMaybe<Array<InputMaybe<History_Elements_Distinct_Enum>>>
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryHistoryElementsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  blockHeight?: InputMaybe<Scalars['String']['input']>
  distinct?: InputMaybe<Array<InputMaybe<History_Elements_Distinct_Enum>>>
  filter?: InputMaybe<HistoryElementFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<HistoryElementsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input']
}

export enum RewardType {
  Reward = 'reward',
  Slash = 'slash',
}

/** A filter to be used against RewardType fields. All fields are combined with a logical ‘and.’ */
export type RewardTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<RewardType>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<RewardType>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<RewardType>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<RewardType>
  /** Included in the specified list. */
  in?: InputMaybe<Array<RewardType>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<RewardType>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<RewardType>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<RewardType>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<RewardType>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<RewardType>>
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

export type _Poi = Node & {
  __typename?: '_Poi'
  chainBlockHash?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['Datetime']['output']
  hash?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  operationHashRoot?: Maybe<Scalars['String']['output']>
  parentHash?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Datetime']['output']
}

export type _PoiAggregates = {
  __typename?: '_PoiAggregates'
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<_PoiAverageAggregates>
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<_PoiDistinctCountAggregates>
  keys?: Maybe<Array<Scalars['String']['output']>>
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<_PoiMaxAggregates>
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<_PoiMinAggregates>
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<_PoiStddevPopulationAggregates>
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<_PoiStddevSampleAggregates>
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<_PoiSumAggregates>
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<_PoiVariancePopulationAggregates>
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<_PoiVarianceSampleAggregates>
}

export type _PoiAverageAggregates = {
  __typename?: '_PoiAverageAggregates'
  /** Mean average of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']['output']>
}

export type _PoiDistinctCountAggregates = {
  __typename?: '_PoiDistinctCountAggregates'
  /** Distinct count of chainBlockHash across the matching connection */
  chainBlockHash?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of hash across the matching connection */
  hash?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of operationHashRoot across the matching connection */
  operationHashRoot?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of parentHash across the matching connection */
  parentHash?: Maybe<Scalars['BigInt']['output']>
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>
}

/** A filter to be used against `_Poi` object types. All fields are combined with a logical ‘and.’ */
export type _PoiFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<_PoiFilter>>
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Negates the expression. */
  not?: InputMaybe<_PoiFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<_PoiFilter>>
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>
}

/** Grouping methods for `_Poi` for usage during aggregation. */
export enum _PoiGroupBy {
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  OperationHashRoot = 'OPERATION_HASH_ROOT',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR',
}

export type _PoiHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>
  id?: InputMaybe<HavingIntFilter>
  updatedAt?: InputMaybe<HavingDatetimeFilter>
}

export type _PoiHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>
  id?: InputMaybe<HavingIntFilter>
  updatedAt?: InputMaybe<HavingDatetimeFilter>
}

/** Conditions for `_Poi` aggregates. */
export type _PoiHavingInput = {
  AND?: InputMaybe<Array<_PoiHavingInput>>
  OR?: InputMaybe<Array<_PoiHavingInput>>
  average?: InputMaybe<_PoiHavingAverageInput>
  distinctCount?: InputMaybe<_PoiHavingDistinctCountInput>
  max?: InputMaybe<_PoiHavingMaxInput>
  min?: InputMaybe<_PoiHavingMinInput>
  stddevPopulation?: InputMaybe<_PoiHavingStddevPopulationInput>
  stddevSample?: InputMaybe<_PoiHavingStddevSampleInput>
  sum?: InputMaybe<_PoiHavingSumInput>
  variancePopulation?: InputMaybe<_PoiHavingVariancePopulationInput>
  varianceSample?: InputMaybe<_PoiHavingVarianceSampleInput>
}

export type _PoiHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>
  id?: InputMaybe<HavingIntFilter>
  updatedAt?: InputMaybe<HavingDatetimeFilter>
}

export type _PoiHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>
  id?: InputMaybe<HavingIntFilter>
  updatedAt?: InputMaybe<HavingDatetimeFilter>
}

export type _PoiHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>
  id?: InputMaybe<HavingIntFilter>
  updatedAt?: InputMaybe<HavingDatetimeFilter>
}

export type _PoiHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>
  id?: InputMaybe<HavingIntFilter>
  updatedAt?: InputMaybe<HavingDatetimeFilter>
}

export type _PoiHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>
  id?: InputMaybe<HavingIntFilter>
  updatedAt?: InputMaybe<HavingDatetimeFilter>
}

export type _PoiHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>
  id?: InputMaybe<HavingIntFilter>
  updatedAt?: InputMaybe<HavingDatetimeFilter>
}

export type _PoiHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>
  id?: InputMaybe<HavingIntFilter>
  updatedAt?: InputMaybe<HavingDatetimeFilter>
}

export type _PoiMaxAggregates = {
  __typename?: '_PoiMaxAggregates'
  /** Maximum of id across the matching connection */
  id?: Maybe<Scalars['Int']['output']>
}

export type _PoiMinAggregates = {
  __typename?: '_PoiMinAggregates'
  /** Minimum of id across the matching connection */
  id?: Maybe<Scalars['Int']['output']>
}

export type _PoiStddevPopulationAggregates = {
  __typename?: '_PoiStddevPopulationAggregates'
  /** Population standard deviation of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']['output']>
}

export type _PoiStddevSampleAggregates = {
  __typename?: '_PoiStddevSampleAggregates'
  /** Sample standard deviation of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']['output']>
}

export type _PoiSumAggregates = {
  __typename?: '_PoiSumAggregates'
  /** Sum of id across the matching connection */
  id: Scalars['BigInt']['output']
}

export type _PoiVariancePopulationAggregates = {
  __typename?: '_PoiVariancePopulationAggregates'
  /** Population variance of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']['output']>
}

export type _PoiVarianceSampleAggregates = {
  __typename?: '_PoiVarianceSampleAggregates'
  /** Sample variance of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']['output']>
}

/** A connection to a list of `_Poi` values. */
export type _PoisConnection = {
  __typename?: '_PoisConnection'
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<_PoiAggregates>
  /** A list of edges which contains the `_Poi` and cursor to aid in pagination. */
  edges: Array<_PoisEdge>
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<_PoiAggregates>>
  /** A list of `_Poi` objects. */
  nodes: Array<Maybe<_Poi>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `_Poi` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A connection to a list of `_Poi` values. */
export type _PoisConnectionGroupedAggregatesArgs = {
  groupBy: Array<_PoiGroupBy>
  having?: InputMaybe<_PoiHavingInput>
}

/** A `_Poi` edge in the connection. */
export type _PoisEdge = {
  __typename?: '_PoisEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `_Poi` at the end of the edge. */
  node?: Maybe<_Poi>
}

/** Methods to use when ordering `_Poi`. */
export enum _PoisOrderBy {
  ChainBlockHashAsc = 'CHAIN_BLOCK_HASH_ASC',
  ChainBlockHashDesc = 'CHAIN_BLOCK_HASH_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  HashAsc = 'HASH_ASC',
  HashDesc = 'HASH_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  OperationHashRootAsc = 'OPERATION_HASH_ROOT_ASC',
  OperationHashRootDesc = 'OPERATION_HASH_ROOT_DESC',
  ParentHashAsc = 'PARENT_HASH_ASC',
  ParentHashDesc = 'PARENT_HASH_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
}

export enum _Poi_Distinct_Enum {
  Chainblockhash = 'CHAINBLOCKHASH',
  Createdat = 'CREATEDAT',
  Hash = 'HASH',
  Id = 'ID',
  Operationhashroot = 'OPERATIONHASHROOT',
  Parenthash = 'PARENTHASH',
  Updatedat = 'UPDATEDAT',
}

export enum Account_Pool_Rewards_Distinct_Enum {
  AccumulatedAmount = 'ACCUMULATED_AMOUNT',
  Address = 'ADDRESS',
  Amount = 'AMOUNT',
  BlockNumber = 'BLOCK_NUMBER',
  Id = 'ID',
  PoolId = 'POOL_ID',
  Timestamp = 'TIMESTAMP',
  Type = 'TYPE',
}

export enum Account_Rewards_Distinct_Enum {
  AccumulatedAmount = 'ACCUMULATED_AMOUNT',
  Address = 'ADDRESS',
  Amount = 'AMOUNT',
  BlockNumber = 'BLOCK_NUMBER',
  Id = 'ID',
  Timestamp = 'TIMESTAMP',
  Type = 'TYPE',
}

export enum Accumulated_Pool_Rewards_Distinct_Enum {
  Amount = 'AMOUNT',
  Id = 'ID',
}

export enum Accumulated_Rewards_Distinct_Enum {
  Amount = 'AMOUNT',
  Id = 'ID',
}

export enum Era_Validator_Infos_Distinct_Enum {
  Address = 'ADDRESS',
  Era = 'ERA',
  Id = 'ID',
  Others = 'OTHERS',
  Own = 'OWN',
  Total = 'TOTAL',
}

export enum Error_Events_Distinct_Enum {
  Description = 'DESCRIPTION',
  Id = 'ID',
}

export enum History_Elements_Distinct_Enum {
  Address = 'ADDRESS',
  AssetTransfer = 'ASSET_TRANSFER',
  BlockNumber = 'BLOCK_NUMBER',
  Extrinsic = 'EXTRINSIC',
  ExtrinsicHash = 'EXTRINSIC_HASH',
  ExtrinsicIdx = 'EXTRINSIC_IDX',
  Id = 'ID',
  PoolReward = 'POOL_REWARD',
  Reward = 'REWARD',
  Swap = 'SWAP',
  Timestamp = 'TIMESTAMP',
  Transfer = 'TRANSFER',
}

export type PoolRewardsQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type PoolRewardsQuery = {
  __typename?: 'Query'
  accumulatedPoolReward?: { __typename?: 'AccumulatedPoolReward'; amount: any } | null
}

export type ValidatorStakingRewardQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type ValidatorStakingRewardQuery = {
  __typename?: 'Query'
  accumulatedReward?: { __typename?: 'AccumulatedReward'; amount: any } | null
}

export const PoolRewardsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PoolRewards' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'accumulatedPoolReward' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'amount' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PoolRewardsQuery, PoolRewardsQueryVariables>
export const ValidatorStakingRewardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ValidatorStakingReward' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'accumulatedReward' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'amount' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ValidatorStakingRewardQuery, ValidatorStakingRewardQueryVariables>
