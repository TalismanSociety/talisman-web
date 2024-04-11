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
  /** Big number integer */
  BigInt: { input: any; output: any }
  /** A date-time string in simplified extended ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) */
  DateTime: { input: any; output: any }
}

export type Account = {
  __typename?: 'Account'
  contributions: Array<Contribution>
  /** Account address */
  id: Scalars['String']['output']
}

export type AccountContributionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ContributionOrderByInput>>
  where?: InputMaybe<ContributionWhereInput>
}

export type AccountEdge = {
  __typename?: 'AccountEdge'
  cursor: Scalars['String']['output']
  node: Account
}

export enum AccountOrderByInput {
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
}

export type AccountWhereInput = {
  AND?: InputMaybe<Array<AccountWhereInput>>
  OR?: InputMaybe<Array<AccountWhereInput>>
  contributions_every?: InputMaybe<ContributionWhereInput>
  contributions_none?: InputMaybe<ContributionWhereInput>
  contributions_some?: InputMaybe<ContributionWhereInput>
  id_contains?: InputMaybe<Scalars['String']['input']>
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  id_endsWith?: InputMaybe<Scalars['String']['input']>
  id_eq?: InputMaybe<Scalars['String']['input']>
  id_gt?: InputMaybe<Scalars['String']['input']>
  id_gte?: InputMaybe<Scalars['String']['input']>
  id_in?: InputMaybe<Array<Scalars['String']['input']>>
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>
  id_lt?: InputMaybe<Scalars['String']['input']>
  id_lte?: InputMaybe<Scalars['String']['input']>
  id_not_contains?: InputMaybe<Scalars['String']['input']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>
  id_not_eq?: InputMaybe<Scalars['String']['input']>
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>
  id_startsWith?: InputMaybe<Scalars['String']['input']>
}

export type AccountsConnection = {
  __typename?: 'AccountsConnection'
  edges: Array<AccountEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type Contribution = {
  __typename?: 'Contribution'
  account: Account
  amount: Scalars['BigInt']['output']
  blockNumber: Scalars['Int']['output']
  crowdloan: Crowdloan
  id: Scalars['String']['output']
  returned: Scalars['Boolean']['output']
  timestamp: Scalars['DateTime']['output']
}

export type ContributionEdge = {
  __typename?: 'ContributionEdge'
  cursor: Scalars['String']['output']
  node: Contribution
}

export enum ContributionOrderByInput {
  AccountIdAsc = 'account_id_ASC',
  AccountIdAscNullsFirst = 'account_id_ASC_NULLS_FIRST',
  AccountIdDesc = 'account_id_DESC',
  AccountIdDescNullsLast = 'account_id_DESC_NULLS_LAST',
  AmountAsc = 'amount_ASC',
  AmountAscNullsFirst = 'amount_ASC_NULLS_FIRST',
  AmountDesc = 'amount_DESC',
  AmountDescNullsLast = 'amount_DESC_NULLS_LAST',
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  CrowdloanCapAsc = 'crowdloan_cap_ASC',
  CrowdloanCapAscNullsFirst = 'crowdloan_cap_ASC_NULLS_FIRST',
  CrowdloanCapDesc = 'crowdloan_cap_DESC',
  CrowdloanCapDescNullsLast = 'crowdloan_cap_DESC_NULLS_LAST',
  CrowdloanCreatedBlockNumberAsc = 'crowdloan_createdBlockNumber_ASC',
  CrowdloanCreatedBlockNumberAscNullsFirst = 'crowdloan_createdBlockNumber_ASC_NULLS_FIRST',
  CrowdloanCreatedBlockNumberDesc = 'crowdloan_createdBlockNumber_DESC',
  CrowdloanCreatedBlockNumberDescNullsLast = 'crowdloan_createdBlockNumber_DESC_NULLS_LAST',
  CrowdloanCreatedTimestampAsc = 'crowdloan_createdTimestamp_ASC',
  CrowdloanCreatedTimestampAscNullsFirst = 'crowdloan_createdTimestamp_ASC_NULLS_FIRST',
  CrowdloanCreatedTimestampDesc = 'crowdloan_createdTimestamp_DESC',
  CrowdloanCreatedTimestampDescNullsLast = 'crowdloan_createdTimestamp_DESC_NULLS_LAST',
  CrowdloanDepositorAsc = 'crowdloan_depositor_ASC',
  CrowdloanDepositorAscNullsFirst = 'crowdloan_depositor_ASC_NULLS_FIRST',
  CrowdloanDepositorDesc = 'crowdloan_depositor_DESC',
  CrowdloanDepositorDescNullsLast = 'crowdloan_depositor_DESC_NULLS_LAST',
  CrowdloanDissolvedBlockNumberAsc = 'crowdloan_dissolvedBlockNumber_ASC',
  CrowdloanDissolvedBlockNumberAscNullsFirst = 'crowdloan_dissolvedBlockNumber_ASC_NULLS_FIRST',
  CrowdloanDissolvedBlockNumberDesc = 'crowdloan_dissolvedBlockNumber_DESC',
  CrowdloanDissolvedBlockNumberDescNullsLast = 'crowdloan_dissolvedBlockNumber_DESC_NULLS_LAST',
  CrowdloanDissolvedTimestampAsc = 'crowdloan_dissolvedTimestamp_ASC',
  CrowdloanDissolvedTimestampAscNullsFirst = 'crowdloan_dissolvedTimestamp_ASC_NULLS_FIRST',
  CrowdloanDissolvedTimestampDesc = 'crowdloan_dissolvedTimestamp_DESC',
  CrowdloanDissolvedTimestampDescNullsLast = 'crowdloan_dissolvedTimestamp_DESC_NULLS_LAST',
  CrowdloanDissolvedAsc = 'crowdloan_dissolved_ASC',
  CrowdloanDissolvedAscNullsFirst = 'crowdloan_dissolved_ASC_NULLS_FIRST',
  CrowdloanDissolvedDesc = 'crowdloan_dissolved_DESC',
  CrowdloanDissolvedDescNullsLast = 'crowdloan_dissolved_DESC_NULLS_LAST',
  CrowdloanEndAsc = 'crowdloan_end_ASC',
  CrowdloanEndAscNullsFirst = 'crowdloan_end_ASC_NULLS_FIRST',
  CrowdloanEndDesc = 'crowdloan_end_DESC',
  CrowdloanEndDescNullsLast = 'crowdloan_end_DESC_NULLS_LAST',
  CrowdloanFirstPeriodAsc = 'crowdloan_firstPeriod_ASC',
  CrowdloanFirstPeriodAscNullsFirst = 'crowdloan_firstPeriod_ASC_NULLS_FIRST',
  CrowdloanFirstPeriodDesc = 'crowdloan_firstPeriod_DESC',
  CrowdloanFirstPeriodDescNullsLast = 'crowdloan_firstPeriod_DESC_NULLS_LAST',
  CrowdloanFundAccountAsc = 'crowdloan_fundAccount_ASC',
  CrowdloanFundAccountAscNullsFirst = 'crowdloan_fundAccount_ASC_NULLS_FIRST',
  CrowdloanFundAccountDesc = 'crowdloan_fundAccount_DESC',
  CrowdloanFundAccountDescNullsLast = 'crowdloan_fundAccount_DESC_NULLS_LAST',
  CrowdloanFundIndexAsc = 'crowdloan_fundIndex_ASC',
  CrowdloanFundIndexAscNullsFirst = 'crowdloan_fundIndex_ASC_NULLS_FIRST',
  CrowdloanFundIndexDesc = 'crowdloan_fundIndex_DESC',
  CrowdloanFundIndexDescNullsLast = 'crowdloan_fundIndex_DESC_NULLS_LAST',
  CrowdloanIdAsc = 'crowdloan_id_ASC',
  CrowdloanIdAscNullsFirst = 'crowdloan_id_ASC_NULLS_FIRST',
  CrowdloanIdDesc = 'crowdloan_id_DESC',
  CrowdloanIdDescNullsLast = 'crowdloan_id_DESC_NULLS_LAST',
  CrowdloanLastBlockAsc = 'crowdloan_lastBlock_ASC',
  CrowdloanLastBlockAscNullsFirst = 'crowdloan_lastBlock_ASC_NULLS_FIRST',
  CrowdloanLastBlockDesc = 'crowdloan_lastBlock_DESC',
  CrowdloanLastBlockDescNullsLast = 'crowdloan_lastBlock_DESC_NULLS_LAST',
  CrowdloanLastPeriodAsc = 'crowdloan_lastPeriod_ASC',
  CrowdloanLastPeriodAscNullsFirst = 'crowdloan_lastPeriod_ASC_NULLS_FIRST',
  CrowdloanLastPeriodDesc = 'crowdloan_lastPeriod_DESC',
  CrowdloanLastPeriodDescNullsLast = 'crowdloan_lastPeriod_DESC_NULLS_LAST',
  CrowdloanParaIdAsc = 'crowdloan_paraId_ASC',
  CrowdloanParaIdAscNullsFirst = 'crowdloan_paraId_ASC_NULLS_FIRST',
  CrowdloanParaIdDesc = 'crowdloan_paraId_DESC',
  CrowdloanParaIdDescNullsLast = 'crowdloan_paraId_DESC_NULLS_LAST',
  CrowdloanRefundedAsc = 'crowdloan_refunded_ASC',
  CrowdloanRefundedAscNullsFirst = 'crowdloan_refunded_ASC_NULLS_FIRST',
  CrowdloanRefundedDesc = 'crowdloan_refunded_DESC',
  CrowdloanRefundedDescNullsLast = 'crowdloan_refunded_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  ReturnedAsc = 'returned_ASC',
  ReturnedAscNullsFirst = 'returned_ASC_NULLS_FIRST',
  ReturnedDesc = 'returned_DESC',
  ReturnedDescNullsLast = 'returned_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST',
}

export type ContributionWhereInput = {
  AND?: InputMaybe<Array<ContributionWhereInput>>
  OR?: InputMaybe<Array<ContributionWhereInput>>
  account?: InputMaybe<AccountWhereInput>
  account_isNull?: InputMaybe<Scalars['Boolean']['input']>
  amount_eq?: InputMaybe<Scalars['BigInt']['input']>
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  amount_isNull?: InputMaybe<Scalars['Boolean']['input']>
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>
  amount_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_eq?: InputMaybe<Scalars['Int']['input']>
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>
  blockNumber_not_eq?: InputMaybe<Scalars['Int']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  crowdloan?: InputMaybe<CrowdloanWhereInput>
  crowdloan_isNull?: InputMaybe<Scalars['Boolean']['input']>
  id_contains?: InputMaybe<Scalars['String']['input']>
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  id_endsWith?: InputMaybe<Scalars['String']['input']>
  id_eq?: InputMaybe<Scalars['String']['input']>
  id_gt?: InputMaybe<Scalars['String']['input']>
  id_gte?: InputMaybe<Scalars['String']['input']>
  id_in?: InputMaybe<Array<Scalars['String']['input']>>
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>
  id_lt?: InputMaybe<Scalars['String']['input']>
  id_lte?: InputMaybe<Scalars['String']['input']>
  id_not_contains?: InputMaybe<Scalars['String']['input']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>
  id_not_eq?: InputMaybe<Scalars['String']['input']>
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>
  id_startsWith?: InputMaybe<Scalars['String']['input']>
  returned_eq?: InputMaybe<Scalars['Boolean']['input']>
  returned_isNull?: InputMaybe<Scalars['Boolean']['input']>
  returned_not_eq?: InputMaybe<Scalars['Boolean']['input']>
  timestamp_eq?: InputMaybe<Scalars['DateTime']['input']>
  timestamp_gt?: InputMaybe<Scalars['DateTime']['input']>
  timestamp_gte?: InputMaybe<Scalars['DateTime']['input']>
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  timestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>
  timestamp_lt?: InputMaybe<Scalars['DateTime']['input']>
  timestamp_lte?: InputMaybe<Scalars['DateTime']['input']>
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
}

export type ContributionsConnection = {
  __typename?: 'ContributionsConnection'
  edges: Array<ContributionEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type Crowdloan = {
  __typename?: 'Crowdloan'
  cap?: Maybe<Scalars['BigInt']['output']>
  contributions: Array<Contribution>
  createdBlockNumber: Scalars['Int']['output']
  createdTimestamp: Scalars['DateTime']['output']
  depositor?: Maybe<Scalars['String']['output']>
  dissolved: Scalars['Boolean']['output']
  dissolvedBlockNumber?: Maybe<Scalars['Int']['output']>
  dissolvedTimestamp?: Maybe<Scalars['DateTime']['output']>
  end?: Maybe<Scalars['Int']['output']>
  firstPeriod?: Maybe<Scalars['Int']['output']>
  fundAccount: Scalars['String']['output']
  fundIndex: Scalars['Int']['output']
  id: Scalars['String']['output']
  lastBlock?: Maybe<Scalars['Int']['output']>
  lastPeriod?: Maybe<Scalars['Int']['output']>
  paraId: Scalars['Int']['output']
  refunded: Scalars['Boolean']['output']
}

export type CrowdloanContributionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ContributionOrderByInput>>
  where?: InputMaybe<ContributionWhereInput>
}

export type CrowdloanEdge = {
  __typename?: 'CrowdloanEdge'
  cursor: Scalars['String']['output']
  node: Crowdloan
}

export enum CrowdloanOrderByInput {
  CapAsc = 'cap_ASC',
  CapAscNullsFirst = 'cap_ASC_NULLS_FIRST',
  CapDesc = 'cap_DESC',
  CapDescNullsLast = 'cap_DESC_NULLS_LAST',
  CreatedBlockNumberAsc = 'createdBlockNumber_ASC',
  CreatedBlockNumberAscNullsFirst = 'createdBlockNumber_ASC_NULLS_FIRST',
  CreatedBlockNumberDesc = 'createdBlockNumber_DESC',
  CreatedBlockNumberDescNullsLast = 'createdBlockNumber_DESC_NULLS_LAST',
  CreatedTimestampAsc = 'createdTimestamp_ASC',
  CreatedTimestampAscNullsFirst = 'createdTimestamp_ASC_NULLS_FIRST',
  CreatedTimestampDesc = 'createdTimestamp_DESC',
  CreatedTimestampDescNullsLast = 'createdTimestamp_DESC_NULLS_LAST',
  DepositorAsc = 'depositor_ASC',
  DepositorAscNullsFirst = 'depositor_ASC_NULLS_FIRST',
  DepositorDesc = 'depositor_DESC',
  DepositorDescNullsLast = 'depositor_DESC_NULLS_LAST',
  DissolvedBlockNumberAsc = 'dissolvedBlockNumber_ASC',
  DissolvedBlockNumberAscNullsFirst = 'dissolvedBlockNumber_ASC_NULLS_FIRST',
  DissolvedBlockNumberDesc = 'dissolvedBlockNumber_DESC',
  DissolvedBlockNumberDescNullsLast = 'dissolvedBlockNumber_DESC_NULLS_LAST',
  DissolvedTimestampAsc = 'dissolvedTimestamp_ASC',
  DissolvedTimestampAscNullsFirst = 'dissolvedTimestamp_ASC_NULLS_FIRST',
  DissolvedTimestampDesc = 'dissolvedTimestamp_DESC',
  DissolvedTimestampDescNullsLast = 'dissolvedTimestamp_DESC_NULLS_LAST',
  DissolvedAsc = 'dissolved_ASC',
  DissolvedAscNullsFirst = 'dissolved_ASC_NULLS_FIRST',
  DissolvedDesc = 'dissolved_DESC',
  DissolvedDescNullsLast = 'dissolved_DESC_NULLS_LAST',
  EndAsc = 'end_ASC',
  EndAscNullsFirst = 'end_ASC_NULLS_FIRST',
  EndDesc = 'end_DESC',
  EndDescNullsLast = 'end_DESC_NULLS_LAST',
  FirstPeriodAsc = 'firstPeriod_ASC',
  FirstPeriodAscNullsFirst = 'firstPeriod_ASC_NULLS_FIRST',
  FirstPeriodDesc = 'firstPeriod_DESC',
  FirstPeriodDescNullsLast = 'firstPeriod_DESC_NULLS_LAST',
  FundAccountAsc = 'fundAccount_ASC',
  FundAccountAscNullsFirst = 'fundAccount_ASC_NULLS_FIRST',
  FundAccountDesc = 'fundAccount_DESC',
  FundAccountDescNullsLast = 'fundAccount_DESC_NULLS_LAST',
  FundIndexAsc = 'fundIndex_ASC',
  FundIndexAscNullsFirst = 'fundIndex_ASC_NULLS_FIRST',
  FundIndexDesc = 'fundIndex_DESC',
  FundIndexDescNullsLast = 'fundIndex_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  LastBlockAsc = 'lastBlock_ASC',
  LastBlockAscNullsFirst = 'lastBlock_ASC_NULLS_FIRST',
  LastBlockDesc = 'lastBlock_DESC',
  LastBlockDescNullsLast = 'lastBlock_DESC_NULLS_LAST',
  LastPeriodAsc = 'lastPeriod_ASC',
  LastPeriodAscNullsFirst = 'lastPeriod_ASC_NULLS_FIRST',
  LastPeriodDesc = 'lastPeriod_DESC',
  LastPeriodDescNullsLast = 'lastPeriod_DESC_NULLS_LAST',
  ParaIdAsc = 'paraId_ASC',
  ParaIdAscNullsFirst = 'paraId_ASC_NULLS_FIRST',
  ParaIdDesc = 'paraId_DESC',
  ParaIdDescNullsLast = 'paraId_DESC_NULLS_LAST',
  RefundedAsc = 'refunded_ASC',
  RefundedAscNullsFirst = 'refunded_ASC_NULLS_FIRST',
  RefundedDesc = 'refunded_DESC',
  RefundedDescNullsLast = 'refunded_DESC_NULLS_LAST',
}

export type CrowdloanWhereInput = {
  AND?: InputMaybe<Array<CrowdloanWhereInput>>
  OR?: InputMaybe<Array<CrowdloanWhereInput>>
  cap_eq?: InputMaybe<Scalars['BigInt']['input']>
  cap_gt?: InputMaybe<Scalars['BigInt']['input']>
  cap_gte?: InputMaybe<Scalars['BigInt']['input']>
  cap_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  cap_isNull?: InputMaybe<Scalars['Boolean']['input']>
  cap_lt?: InputMaybe<Scalars['BigInt']['input']>
  cap_lte?: InputMaybe<Scalars['BigInt']['input']>
  cap_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  cap_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  contributions_every?: InputMaybe<ContributionWhereInput>
  contributions_none?: InputMaybe<ContributionWhereInput>
  contributions_some?: InputMaybe<ContributionWhereInput>
  createdBlockNumber_eq?: InputMaybe<Scalars['Int']['input']>
  createdBlockNumber_gt?: InputMaybe<Scalars['Int']['input']>
  createdBlockNumber_gte?: InputMaybe<Scalars['Int']['input']>
  createdBlockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>
  createdBlockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>
  createdBlockNumber_lt?: InputMaybe<Scalars['Int']['input']>
  createdBlockNumber_lte?: InputMaybe<Scalars['Int']['input']>
  createdBlockNumber_not_eq?: InputMaybe<Scalars['Int']['input']>
  createdBlockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  createdTimestamp_eq?: InputMaybe<Scalars['DateTime']['input']>
  createdTimestamp_gt?: InputMaybe<Scalars['DateTime']['input']>
  createdTimestamp_gte?: InputMaybe<Scalars['DateTime']['input']>
  createdTimestamp_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  createdTimestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>
  createdTimestamp_lt?: InputMaybe<Scalars['DateTime']['input']>
  createdTimestamp_lte?: InputMaybe<Scalars['DateTime']['input']>
  createdTimestamp_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  depositor_contains?: InputMaybe<Scalars['String']['input']>
  depositor_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  depositor_endsWith?: InputMaybe<Scalars['String']['input']>
  depositor_eq?: InputMaybe<Scalars['String']['input']>
  depositor_gt?: InputMaybe<Scalars['String']['input']>
  depositor_gte?: InputMaybe<Scalars['String']['input']>
  depositor_in?: InputMaybe<Array<Scalars['String']['input']>>
  depositor_isNull?: InputMaybe<Scalars['Boolean']['input']>
  depositor_lt?: InputMaybe<Scalars['String']['input']>
  depositor_lte?: InputMaybe<Scalars['String']['input']>
  depositor_not_contains?: InputMaybe<Scalars['String']['input']>
  depositor_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  depositor_not_endsWith?: InputMaybe<Scalars['String']['input']>
  depositor_not_eq?: InputMaybe<Scalars['String']['input']>
  depositor_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  depositor_not_startsWith?: InputMaybe<Scalars['String']['input']>
  depositor_startsWith?: InputMaybe<Scalars['String']['input']>
  dissolvedBlockNumber_eq?: InputMaybe<Scalars['Int']['input']>
  dissolvedBlockNumber_gt?: InputMaybe<Scalars['Int']['input']>
  dissolvedBlockNumber_gte?: InputMaybe<Scalars['Int']['input']>
  dissolvedBlockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>
  dissolvedBlockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>
  dissolvedBlockNumber_lt?: InputMaybe<Scalars['Int']['input']>
  dissolvedBlockNumber_lte?: InputMaybe<Scalars['Int']['input']>
  dissolvedBlockNumber_not_eq?: InputMaybe<Scalars['Int']['input']>
  dissolvedBlockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  dissolvedTimestamp_eq?: InputMaybe<Scalars['DateTime']['input']>
  dissolvedTimestamp_gt?: InputMaybe<Scalars['DateTime']['input']>
  dissolvedTimestamp_gte?: InputMaybe<Scalars['DateTime']['input']>
  dissolvedTimestamp_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  dissolvedTimestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>
  dissolvedTimestamp_lt?: InputMaybe<Scalars['DateTime']['input']>
  dissolvedTimestamp_lte?: InputMaybe<Scalars['DateTime']['input']>
  dissolvedTimestamp_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  dissolvedTimestamp_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  dissolved_eq?: InputMaybe<Scalars['Boolean']['input']>
  dissolved_isNull?: InputMaybe<Scalars['Boolean']['input']>
  dissolved_not_eq?: InputMaybe<Scalars['Boolean']['input']>
  end_eq?: InputMaybe<Scalars['Int']['input']>
  end_gt?: InputMaybe<Scalars['Int']['input']>
  end_gte?: InputMaybe<Scalars['Int']['input']>
  end_in?: InputMaybe<Array<Scalars['Int']['input']>>
  end_isNull?: InputMaybe<Scalars['Boolean']['input']>
  end_lt?: InputMaybe<Scalars['Int']['input']>
  end_lte?: InputMaybe<Scalars['Int']['input']>
  end_not_eq?: InputMaybe<Scalars['Int']['input']>
  end_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  firstPeriod_eq?: InputMaybe<Scalars['Int']['input']>
  firstPeriod_gt?: InputMaybe<Scalars['Int']['input']>
  firstPeriod_gte?: InputMaybe<Scalars['Int']['input']>
  firstPeriod_in?: InputMaybe<Array<Scalars['Int']['input']>>
  firstPeriod_isNull?: InputMaybe<Scalars['Boolean']['input']>
  firstPeriod_lt?: InputMaybe<Scalars['Int']['input']>
  firstPeriod_lte?: InputMaybe<Scalars['Int']['input']>
  firstPeriod_not_eq?: InputMaybe<Scalars['Int']['input']>
  firstPeriod_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  fundAccount_contains?: InputMaybe<Scalars['String']['input']>
  fundAccount_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  fundAccount_endsWith?: InputMaybe<Scalars['String']['input']>
  fundAccount_eq?: InputMaybe<Scalars['String']['input']>
  fundAccount_gt?: InputMaybe<Scalars['String']['input']>
  fundAccount_gte?: InputMaybe<Scalars['String']['input']>
  fundAccount_in?: InputMaybe<Array<Scalars['String']['input']>>
  fundAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>
  fundAccount_lt?: InputMaybe<Scalars['String']['input']>
  fundAccount_lte?: InputMaybe<Scalars['String']['input']>
  fundAccount_not_contains?: InputMaybe<Scalars['String']['input']>
  fundAccount_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  fundAccount_not_endsWith?: InputMaybe<Scalars['String']['input']>
  fundAccount_not_eq?: InputMaybe<Scalars['String']['input']>
  fundAccount_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  fundAccount_not_startsWith?: InputMaybe<Scalars['String']['input']>
  fundAccount_startsWith?: InputMaybe<Scalars['String']['input']>
  fundIndex_eq?: InputMaybe<Scalars['Int']['input']>
  fundIndex_gt?: InputMaybe<Scalars['Int']['input']>
  fundIndex_gte?: InputMaybe<Scalars['Int']['input']>
  fundIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>
  fundIndex_isNull?: InputMaybe<Scalars['Boolean']['input']>
  fundIndex_lt?: InputMaybe<Scalars['Int']['input']>
  fundIndex_lte?: InputMaybe<Scalars['Int']['input']>
  fundIndex_not_eq?: InputMaybe<Scalars['Int']['input']>
  fundIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  id_contains?: InputMaybe<Scalars['String']['input']>
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  id_endsWith?: InputMaybe<Scalars['String']['input']>
  id_eq?: InputMaybe<Scalars['String']['input']>
  id_gt?: InputMaybe<Scalars['String']['input']>
  id_gte?: InputMaybe<Scalars['String']['input']>
  id_in?: InputMaybe<Array<Scalars['String']['input']>>
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>
  id_lt?: InputMaybe<Scalars['String']['input']>
  id_lte?: InputMaybe<Scalars['String']['input']>
  id_not_contains?: InputMaybe<Scalars['String']['input']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>
  id_not_eq?: InputMaybe<Scalars['String']['input']>
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>
  id_startsWith?: InputMaybe<Scalars['String']['input']>
  lastBlock_eq?: InputMaybe<Scalars['Int']['input']>
  lastBlock_gt?: InputMaybe<Scalars['Int']['input']>
  lastBlock_gte?: InputMaybe<Scalars['Int']['input']>
  lastBlock_in?: InputMaybe<Array<Scalars['Int']['input']>>
  lastBlock_isNull?: InputMaybe<Scalars['Boolean']['input']>
  lastBlock_lt?: InputMaybe<Scalars['Int']['input']>
  lastBlock_lte?: InputMaybe<Scalars['Int']['input']>
  lastBlock_not_eq?: InputMaybe<Scalars['Int']['input']>
  lastBlock_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  lastPeriod_eq?: InputMaybe<Scalars['Int']['input']>
  lastPeriod_gt?: InputMaybe<Scalars['Int']['input']>
  lastPeriod_gte?: InputMaybe<Scalars['Int']['input']>
  lastPeriod_in?: InputMaybe<Array<Scalars['Int']['input']>>
  lastPeriod_isNull?: InputMaybe<Scalars['Boolean']['input']>
  lastPeriod_lt?: InputMaybe<Scalars['Int']['input']>
  lastPeriod_lte?: InputMaybe<Scalars['Int']['input']>
  lastPeriod_not_eq?: InputMaybe<Scalars['Int']['input']>
  lastPeriod_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  paraId_eq?: InputMaybe<Scalars['Int']['input']>
  paraId_gt?: InputMaybe<Scalars['Int']['input']>
  paraId_gte?: InputMaybe<Scalars['Int']['input']>
  paraId_in?: InputMaybe<Array<Scalars['Int']['input']>>
  paraId_isNull?: InputMaybe<Scalars['Boolean']['input']>
  paraId_lt?: InputMaybe<Scalars['Int']['input']>
  paraId_lte?: InputMaybe<Scalars['Int']['input']>
  paraId_not_eq?: InputMaybe<Scalars['Int']['input']>
  paraId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  refunded_eq?: InputMaybe<Scalars['Boolean']['input']>
  refunded_isNull?: InputMaybe<Scalars['Boolean']['input']>
  refunded_not_eq?: InputMaybe<Scalars['Boolean']['input']>
}

export type CrowdloansConnection = {
  __typename?: 'CrowdloansConnection'
  edges: Array<CrowdloanEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor: Scalars['String']['output']
  hasNextPage: Scalars['Boolean']['output']
  hasPreviousPage: Scalars['Boolean']['output']
  startCursor: Scalars['String']['output']
}

export type Query = {
  __typename?: 'Query'
  accountById?: Maybe<Account>
  /** @deprecated Use accountById */
  accountByUniqueInput?: Maybe<Account>
  accounts: Array<Account>
  accountsConnection: AccountsConnection
  contributionById?: Maybe<Contribution>
  /** @deprecated Use contributionById */
  contributionByUniqueInput?: Maybe<Contribution>
  contributions: Array<Contribution>
  contributionsConnection: ContributionsConnection
  crowdloanById?: Maybe<Crowdloan>
  /** @deprecated Use crowdloanById */
  crowdloanByUniqueInput?: Maybe<Crowdloan>
  crowdloans: Array<Crowdloan>
  crowdloansConnection: CrowdloansConnection
  squidStatus?: Maybe<SquidStatus>
}

export type QueryAccountByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryAccountByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AccountOrderByInput>>
  where?: InputMaybe<AccountWhereInput>
}

export type QueryAccountsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<AccountOrderByInput>
  where?: InputMaybe<AccountWhereInput>
}

export type QueryContributionByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryContributionByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryContributionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ContributionOrderByInput>>
  where?: InputMaybe<ContributionWhereInput>
}

export type QueryContributionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<ContributionOrderByInput>
  where?: InputMaybe<ContributionWhereInput>
}

export type QueryCrowdloanByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryCrowdloanByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCrowdloansArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CrowdloanOrderByInput>>
  where?: InputMaybe<CrowdloanWhereInput>
}

export type QueryCrowdloansConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<CrowdloanOrderByInput>
  where?: InputMaybe<CrowdloanWhereInput>
}

export type SquidStatus = {
  __typename?: 'SquidStatus'
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']['output']>
}

export type WhereIdInput = {
  id: Scalars['String']['input']
}

export type ContributionsQueryVariables = Exact<{
  addresses: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type ContributionsQuery = {
  __typename?: 'Query'
  contributions: Array<{
    __typename?: 'Contribution'
    id: string
    amount: any
    returned: boolean
    blockNumber: number
    timestamp: any
    crowdloan: {
      __typename?: 'Crowdloan'
      id: string
      fundIndex: number
      fundAccount: string
      paraId: number
      depositor?: string | null
      end?: number | null
      cap?: any | null
      firstPeriod?: number | null
      lastPeriod?: number | null
      lastBlock?: number | null
      createdBlockNumber: number
      createdTimestamp: any
      dissolved: boolean
      dissolvedBlockNumber?: number | null
      dissolvedTimestamp?: any | null
    }
    account: { __typename?: 'Account'; id: string }
  }>
}

export const ContributionsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'contributions' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'addresses' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'contributions' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'account' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'id_in' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'addresses' } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'EnumValue', value: 'id_ASC' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'crowdloan' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fundIndex' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fundAccount' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'paraId' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'depositor' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'end' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'cap' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstPeriod' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lastPeriod' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lastBlock' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdBlockNumber' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdTimestamp' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'dissolved' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'dissolvedBlockNumber' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'dissolvedTimestamp' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'account' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'returned' } },
                { kind: 'Field', name: { kind: 'Name', value: 'blockNumber' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ContributionsQuery, ContributionsQueryVariables>
