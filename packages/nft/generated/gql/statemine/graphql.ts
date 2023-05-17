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
  /** Big number integer */
  BigInt: any
  /** A date-time string in simplified extended ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) */
  DateTime: any
}

export type Account = {
  __typename?: 'Account'
  id: Scalars['String']
  uniqueInstances: Array<UniqueInstance>
  uniqueTransfers: Array<AccountTransfer>
}

export type AccountUniqueInstancesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UniqueInstanceOrderByInput>>
  where?: InputMaybe<UniqueInstanceWhereInput>
}

export type AccountUniqueTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AccountTransferOrderByInput>>
  where?: InputMaybe<AccountTransferWhereInput>
}

export type AccountEdge = {
  __typename?: 'AccountEdge'
  cursor: Scalars['String']
  node: Account
}

export enum AccountOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
}

export type AccountTransfer = {
  __typename?: 'AccountTransfer'
  account: Account
  direction: Direction
  event: UniqueEvent
  id: Scalars['String']
}

export type AccountTransferEdge = {
  __typename?: 'AccountTransferEdge'
  cursor: Scalars['String']
  node: AccountTransfer
}

export enum AccountTransferOrderByInput {
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  DirectionAsc = 'direction_ASC',
  DirectionDesc = 'direction_DESC',
  EventBlockHashAsc = 'event_blockHash_ASC',
  EventBlockHashDesc = 'event_blockHash_DESC',
  EventBlockNumAsc = 'event_blockNum_ASC',
  EventBlockNumDesc = 'event_blockNum_DESC',
  EventFromAsc = 'event_from_ASC',
  EventFromDesc = 'event_from_DESC',
  EventIdAsc = 'event_id_ASC',
  EventIdDesc = 'event_id_DESC',
  EventPriceAsc = 'event_price_ASC',
  EventPriceDesc = 'event_price_DESC',
  EventTimestampAsc = 'event_timestamp_ASC',
  EventTimestampDesc = 'event_timestamp_DESC',
  EventToAsc = 'event_to_ASC',
  EventToDesc = 'event_to_DESC',
  EventTypeAsc = 'event_type_ASC',
  EventTypeDesc = 'event_type_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
}

export type AccountTransferWhereInput = {
  AND?: InputMaybe<Array<AccountTransferWhereInput>>
  OR?: InputMaybe<Array<AccountTransferWhereInput>>
  account?: InputMaybe<AccountWhereInput>
  account_isNull?: InputMaybe<Scalars['Boolean']>
  direction_eq?: InputMaybe<Direction>
  direction_in?: InputMaybe<Array<Direction>>
  direction_isNull?: InputMaybe<Scalars['Boolean']>
  direction_not_eq?: InputMaybe<Direction>
  direction_not_in?: InputMaybe<Array<Direction>>
  event?: InputMaybe<UniqueEventWhereInput>
  event_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
}

export type AccountTransfersConnection = {
  __typename?: 'AccountTransfersConnection'
  edges: Array<AccountTransferEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type AccountWhereInput = {
  AND?: InputMaybe<Array<AccountWhereInput>>
  OR?: InputMaybe<Array<AccountWhereInput>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  uniqueInstances_every?: InputMaybe<UniqueInstanceWhereInput>
  uniqueInstances_none?: InputMaybe<UniqueInstanceWhereInput>
  uniqueInstances_some?: InputMaybe<UniqueInstanceWhereInput>
  uniqueTransfers_every?: InputMaybe<AccountTransferWhereInput>
  uniqueTransfers_none?: InputMaybe<AccountTransferWhereInput>
  uniqueTransfers_some?: InputMaybe<AccountTransferWhereInput>
}

export type AccountsConnection = {
  __typename?: 'AccountsConnection'
  edges: Array<AccountEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type Attribute = {
  __typename?: 'Attribute'
  key?: Maybe<Scalars['String']>
  value: Scalars['String']
}

export enum Direction {
  From = 'FROM',
  To = 'TO',
}

export enum EventType {
  AttributeClear = 'ATTRIBUTE_CLEAR',
  AttributeSet = 'ATTRIBUTE_SET',
  Bought = 'BOUGHT',
  Burn = 'BURN',
  Create = 'CREATE',
  Destroy = 'DESTROY',
  ForceCreate = 'FORCE_CREATE',
  Freeze = 'FREEZE',
  MaxSupplySet = 'MAX_SUPPLY_SET',
  MetadataClear = 'METADATA_CLEAR',
  MetadataSet = 'METADATA_SET',
  Mint = 'MINT',
  OwnerChange = 'OWNER_CHANGE',
  PriceRemoved = 'PRICE_REMOVED',
  PriceSet = 'PRICE_SET',
  TeamChange = 'TEAM_CHANGE',
  Thawe = 'THAWE',
  Trnasfer = 'TRNASFER',
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor: Scalars['String']
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  accountById?: Maybe<Account>
  /** @deprecated Use accountById */
  accountByUniqueInput?: Maybe<Account>
  accountTransferById?: Maybe<AccountTransfer>
  /** @deprecated Use accountTransferById */
  accountTransferByUniqueInput?: Maybe<AccountTransfer>
  accountTransfers: Array<AccountTransfer>
  accountTransfersConnection: AccountTransfersConnection
  accounts: Array<Account>
  accountsConnection: AccountsConnection
  squidStatus?: Maybe<SquidStatus>
  uniqueClassById?: Maybe<UniqueClass>
  /** @deprecated Use uniqueClassById */
  uniqueClassByUniqueInput?: Maybe<UniqueClass>
  uniqueClasses: Array<UniqueClass>
  uniqueClassesConnection: UniqueClassesConnection
  uniqueEventById?: Maybe<UniqueEvent>
  /** @deprecated Use uniqueEventById */
  uniqueEventByUniqueInput?: Maybe<UniqueEvent>
  uniqueEvents: Array<UniqueEvent>
  uniqueEventsConnection: UniqueEventsConnection
  uniqueInstanceById?: Maybe<UniqueInstance>
  /** @deprecated Use uniqueInstanceById */
  uniqueInstanceByUniqueInput?: Maybe<UniqueInstance>
  uniqueInstances: Array<UniqueInstance>
  uniqueInstancesConnection: UniqueInstancesConnection
}

export type QueryAccountByIdArgs = {
  id: Scalars['String']
}

export type QueryAccountByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryAccountTransferByIdArgs = {
  id: Scalars['String']
}

export type QueryAccountTransferByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryAccountTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AccountTransferOrderByInput>>
  where?: InputMaybe<AccountTransferWhereInput>
}

export type QueryAccountTransfersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<AccountTransferOrderByInput>
  where?: InputMaybe<AccountTransferWhereInput>
}

export type QueryAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AccountOrderByInput>>
  where?: InputMaybe<AccountWhereInput>
}

export type QueryAccountsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<AccountOrderByInput>
  where?: InputMaybe<AccountWhereInput>
}

export type QueryUniqueClassByIdArgs = {
  id: Scalars['String']
}

export type QueryUniqueClassByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryUniqueClassesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UniqueClassOrderByInput>>
  where?: InputMaybe<UniqueClassWhereInput>
}

export type QueryUniqueClassesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<UniqueClassOrderByInput>
  where?: InputMaybe<UniqueClassWhereInput>
}

export type QueryUniqueEventByIdArgs = {
  id: Scalars['String']
}

export type QueryUniqueEventByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryUniqueEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UniqueEventOrderByInput>>
  where?: InputMaybe<UniqueEventWhereInput>
}

export type QueryUniqueEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<UniqueEventOrderByInput>
  where?: InputMaybe<UniqueEventWhereInput>
}

export type QueryUniqueInstanceByIdArgs = {
  id: Scalars['String']
}

export type QueryUniqueInstanceByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryUniqueInstancesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UniqueInstanceOrderByInput>>
  where?: InputMaybe<UniqueInstanceWhereInput>
}

export type QueryUniqueInstancesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<UniqueInstanceOrderByInput>
  where?: InputMaybe<UniqueInstanceWhereInput>
}

export type SquidStatus = {
  __typename?: 'SquidStatus'
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']>
}

export enum Status {
  Active = 'ACTIVE',
  Destroyed = 'DESTROYED',
  Frozen = 'FROZEN',
  Listed = 'LISTED',
}

export type Subscription = {
  __typename?: 'Subscription'
  accountById?: Maybe<Account>
  accountTransferById?: Maybe<AccountTransfer>
  accountTransfers: Array<AccountTransfer>
  accounts: Array<Account>
  uniqueClassById?: Maybe<UniqueClass>
  uniqueClasses: Array<UniqueClass>
  uniqueEventById?: Maybe<UniqueEvent>
  uniqueEvents: Array<UniqueEvent>
  uniqueInstanceById?: Maybe<UniqueInstance>
  uniqueInstances: Array<UniqueInstance>
}

export type SubscriptionAccountByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionAccountTransferByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionAccountTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AccountTransferOrderByInput>>
  where?: InputMaybe<AccountTransferWhereInput>
}

export type SubscriptionAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AccountOrderByInput>>
  where?: InputMaybe<AccountWhereInput>
}

export type SubscriptionUniqueClassByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionUniqueClassesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UniqueClassOrderByInput>>
  where?: InputMaybe<UniqueClassWhereInput>
}

export type SubscriptionUniqueEventByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionUniqueEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UniqueEventOrderByInput>>
  where?: InputMaybe<UniqueEventWhereInput>
}

export type SubscriptionUniqueInstanceByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionUniqueInstancesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UniqueInstanceOrderByInput>>
  where?: InputMaybe<UniqueInstanceWhereInput>
}

export type UniqueClass = {
  __typename?: 'UniqueClass'
  admin?: Maybe<Scalars['String']>
  attributes: Array<Attribute>
  createdAt: Scalars['DateTime']
  creator?: Maybe<Scalars['String']>
  events: Array<UniqueEvent>
  freezer?: Maybe<Scalars['String']>
  id: Scalars['String']
  instances: Array<UniqueInstance>
  issuer?: Maybe<Scalars['String']>
  maxSupply?: Maybe<Scalars['Int']>
  metadata?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  status: Status
}

export type UniqueClassEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UniqueEventOrderByInput>>
  where?: InputMaybe<UniqueEventWhereInput>
}

export type UniqueClassInstancesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UniqueInstanceOrderByInput>>
  where?: InputMaybe<UniqueInstanceWhereInput>
}

export type UniqueClassEdge = {
  __typename?: 'UniqueClassEdge'
  cursor: Scalars['String']
  node: UniqueClass
}

export enum UniqueClassOrderByInput {
  AdminAsc = 'admin_ASC',
  AdminDesc = 'admin_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatorAsc = 'creator_ASC',
  CreatorDesc = 'creator_DESC',
  FreezerAsc = 'freezer_ASC',
  FreezerDesc = 'freezer_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IssuerAsc = 'issuer_ASC',
  IssuerDesc = 'issuer_DESC',
  MaxSupplyAsc = 'maxSupply_ASC',
  MaxSupplyDesc = 'maxSupply_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  OwnerAsc = 'owner_ASC',
  OwnerDesc = 'owner_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
}

export type UniqueClassWhereInput = {
  AND?: InputMaybe<Array<UniqueClassWhereInput>>
  OR?: InputMaybe<Array<UniqueClassWhereInput>>
  admin_contains?: InputMaybe<Scalars['String']>
  admin_containsInsensitive?: InputMaybe<Scalars['String']>
  admin_endsWith?: InputMaybe<Scalars['String']>
  admin_eq?: InputMaybe<Scalars['String']>
  admin_gt?: InputMaybe<Scalars['String']>
  admin_gte?: InputMaybe<Scalars['String']>
  admin_in?: InputMaybe<Array<Scalars['String']>>
  admin_isNull?: InputMaybe<Scalars['Boolean']>
  admin_lt?: InputMaybe<Scalars['String']>
  admin_lte?: InputMaybe<Scalars['String']>
  admin_not_contains?: InputMaybe<Scalars['String']>
  admin_not_containsInsensitive?: InputMaybe<Scalars['String']>
  admin_not_endsWith?: InputMaybe<Scalars['String']>
  admin_not_eq?: InputMaybe<Scalars['String']>
  admin_not_in?: InputMaybe<Array<Scalars['String']>>
  admin_not_startsWith?: InputMaybe<Scalars['String']>
  admin_startsWith?: InputMaybe<Scalars['String']>
  attributes_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  creator_contains?: InputMaybe<Scalars['String']>
  creator_containsInsensitive?: InputMaybe<Scalars['String']>
  creator_endsWith?: InputMaybe<Scalars['String']>
  creator_eq?: InputMaybe<Scalars['String']>
  creator_gt?: InputMaybe<Scalars['String']>
  creator_gte?: InputMaybe<Scalars['String']>
  creator_in?: InputMaybe<Array<Scalars['String']>>
  creator_isNull?: InputMaybe<Scalars['Boolean']>
  creator_lt?: InputMaybe<Scalars['String']>
  creator_lte?: InputMaybe<Scalars['String']>
  creator_not_contains?: InputMaybe<Scalars['String']>
  creator_not_containsInsensitive?: InputMaybe<Scalars['String']>
  creator_not_endsWith?: InputMaybe<Scalars['String']>
  creator_not_eq?: InputMaybe<Scalars['String']>
  creator_not_in?: InputMaybe<Array<Scalars['String']>>
  creator_not_startsWith?: InputMaybe<Scalars['String']>
  creator_startsWith?: InputMaybe<Scalars['String']>
  events_every?: InputMaybe<UniqueEventWhereInput>
  events_none?: InputMaybe<UniqueEventWhereInput>
  events_some?: InputMaybe<UniqueEventWhereInput>
  freezer_contains?: InputMaybe<Scalars['String']>
  freezer_containsInsensitive?: InputMaybe<Scalars['String']>
  freezer_endsWith?: InputMaybe<Scalars['String']>
  freezer_eq?: InputMaybe<Scalars['String']>
  freezer_gt?: InputMaybe<Scalars['String']>
  freezer_gte?: InputMaybe<Scalars['String']>
  freezer_in?: InputMaybe<Array<Scalars['String']>>
  freezer_isNull?: InputMaybe<Scalars['Boolean']>
  freezer_lt?: InputMaybe<Scalars['String']>
  freezer_lte?: InputMaybe<Scalars['String']>
  freezer_not_contains?: InputMaybe<Scalars['String']>
  freezer_not_containsInsensitive?: InputMaybe<Scalars['String']>
  freezer_not_endsWith?: InputMaybe<Scalars['String']>
  freezer_not_eq?: InputMaybe<Scalars['String']>
  freezer_not_in?: InputMaybe<Array<Scalars['String']>>
  freezer_not_startsWith?: InputMaybe<Scalars['String']>
  freezer_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  instances_every?: InputMaybe<UniqueInstanceWhereInput>
  instances_none?: InputMaybe<UniqueInstanceWhereInput>
  instances_some?: InputMaybe<UniqueInstanceWhereInput>
  issuer_contains?: InputMaybe<Scalars['String']>
  issuer_containsInsensitive?: InputMaybe<Scalars['String']>
  issuer_endsWith?: InputMaybe<Scalars['String']>
  issuer_eq?: InputMaybe<Scalars['String']>
  issuer_gt?: InputMaybe<Scalars['String']>
  issuer_gte?: InputMaybe<Scalars['String']>
  issuer_in?: InputMaybe<Array<Scalars['String']>>
  issuer_isNull?: InputMaybe<Scalars['Boolean']>
  issuer_lt?: InputMaybe<Scalars['String']>
  issuer_lte?: InputMaybe<Scalars['String']>
  issuer_not_contains?: InputMaybe<Scalars['String']>
  issuer_not_containsInsensitive?: InputMaybe<Scalars['String']>
  issuer_not_endsWith?: InputMaybe<Scalars['String']>
  issuer_not_eq?: InputMaybe<Scalars['String']>
  issuer_not_in?: InputMaybe<Array<Scalars['String']>>
  issuer_not_startsWith?: InputMaybe<Scalars['String']>
  issuer_startsWith?: InputMaybe<Scalars['String']>
  maxSupply_eq?: InputMaybe<Scalars['Int']>
  maxSupply_gt?: InputMaybe<Scalars['Int']>
  maxSupply_gte?: InputMaybe<Scalars['Int']>
  maxSupply_in?: InputMaybe<Array<Scalars['Int']>>
  maxSupply_isNull?: InputMaybe<Scalars['Boolean']>
  maxSupply_lt?: InputMaybe<Scalars['Int']>
  maxSupply_lte?: InputMaybe<Scalars['Int']>
  maxSupply_not_eq?: InputMaybe<Scalars['Int']>
  maxSupply_not_in?: InputMaybe<Array<Scalars['Int']>>
  metadata_contains?: InputMaybe<Scalars['String']>
  metadata_containsInsensitive?: InputMaybe<Scalars['String']>
  metadata_endsWith?: InputMaybe<Scalars['String']>
  metadata_eq?: InputMaybe<Scalars['String']>
  metadata_gt?: InputMaybe<Scalars['String']>
  metadata_gte?: InputMaybe<Scalars['String']>
  metadata_in?: InputMaybe<Array<Scalars['String']>>
  metadata_isNull?: InputMaybe<Scalars['Boolean']>
  metadata_lt?: InputMaybe<Scalars['String']>
  metadata_lte?: InputMaybe<Scalars['String']>
  metadata_not_contains?: InputMaybe<Scalars['String']>
  metadata_not_containsInsensitive?: InputMaybe<Scalars['String']>
  metadata_not_endsWith?: InputMaybe<Scalars['String']>
  metadata_not_eq?: InputMaybe<Scalars['String']>
  metadata_not_in?: InputMaybe<Array<Scalars['String']>>
  metadata_not_startsWith?: InputMaybe<Scalars['String']>
  metadata_startsWith?: InputMaybe<Scalars['String']>
  owner_contains?: InputMaybe<Scalars['String']>
  owner_containsInsensitive?: InputMaybe<Scalars['String']>
  owner_endsWith?: InputMaybe<Scalars['String']>
  owner_eq?: InputMaybe<Scalars['String']>
  owner_gt?: InputMaybe<Scalars['String']>
  owner_gte?: InputMaybe<Scalars['String']>
  owner_in?: InputMaybe<Array<Scalars['String']>>
  owner_isNull?: InputMaybe<Scalars['Boolean']>
  owner_lt?: InputMaybe<Scalars['String']>
  owner_lte?: InputMaybe<Scalars['String']>
  owner_not_contains?: InputMaybe<Scalars['String']>
  owner_not_containsInsensitive?: InputMaybe<Scalars['String']>
  owner_not_endsWith?: InputMaybe<Scalars['String']>
  owner_not_eq?: InputMaybe<Scalars['String']>
  owner_not_in?: InputMaybe<Array<Scalars['String']>>
  owner_not_startsWith?: InputMaybe<Scalars['String']>
  owner_startsWith?: InputMaybe<Scalars['String']>
  status_eq?: InputMaybe<Status>
  status_in?: InputMaybe<Array<Status>>
  status_isNull?: InputMaybe<Scalars['Boolean']>
  status_not_eq?: InputMaybe<Status>
  status_not_in?: InputMaybe<Array<Status>>
}

export type UniqueClassesConnection = {
  __typename?: 'UniqueClassesConnection'
  edges: Array<UniqueClassEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type UniqueEvent = {
  __typename?: 'UniqueEvent'
  blockHash: Scalars['String']
  blockNum: Scalars['Int']
  from?: Maybe<Scalars['String']>
  id: Scalars['String']
  price?: Maybe<Scalars['BigInt']>
  timestamp: Scalars['DateTime']
  to?: Maybe<Scalars['String']>
  type: EventType
  uniqueClass?: Maybe<UniqueClass>
  uniqueInstance?: Maybe<UniqueInstance>
}

export type UniqueEventEdge = {
  __typename?: 'UniqueEventEdge'
  cursor: Scalars['String']
  node: UniqueEvent
}

export enum UniqueEventOrderByInput {
  BlockHashAsc = 'blockHash_ASC',
  BlockHashDesc = 'blockHash_DESC',
  BlockNumAsc = 'blockNum_ASC',
  BlockNumDesc = 'blockNum_DESC',
  FromAsc = 'from_ASC',
  FromDesc = 'from_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PriceAsc = 'price_ASC',
  PriceDesc = 'price_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  ToAsc = 'to_ASC',
  ToDesc = 'to_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
  UniqueClassAdminAsc = 'uniqueClass_admin_ASC',
  UniqueClassAdminDesc = 'uniqueClass_admin_DESC',
  UniqueClassCreatedAtAsc = 'uniqueClass_createdAt_ASC',
  UniqueClassCreatedAtDesc = 'uniqueClass_createdAt_DESC',
  UniqueClassCreatorAsc = 'uniqueClass_creator_ASC',
  UniqueClassCreatorDesc = 'uniqueClass_creator_DESC',
  UniqueClassFreezerAsc = 'uniqueClass_freezer_ASC',
  UniqueClassFreezerDesc = 'uniqueClass_freezer_DESC',
  UniqueClassIdAsc = 'uniqueClass_id_ASC',
  UniqueClassIdDesc = 'uniqueClass_id_DESC',
  UniqueClassIssuerAsc = 'uniqueClass_issuer_ASC',
  UniqueClassIssuerDesc = 'uniqueClass_issuer_DESC',
  UniqueClassMaxSupplyAsc = 'uniqueClass_maxSupply_ASC',
  UniqueClassMaxSupplyDesc = 'uniqueClass_maxSupply_DESC',
  UniqueClassMetadataAsc = 'uniqueClass_metadata_ASC',
  UniqueClassMetadataDesc = 'uniqueClass_metadata_DESC',
  UniqueClassOwnerAsc = 'uniqueClass_owner_ASC',
  UniqueClassOwnerDesc = 'uniqueClass_owner_DESC',
  UniqueClassStatusAsc = 'uniqueClass_status_ASC',
  UniqueClassStatusDesc = 'uniqueClass_status_DESC',
  UniqueInstanceIdAsc = 'uniqueInstance_id_ASC',
  UniqueInstanceIdDesc = 'uniqueInstance_id_DESC',
  UniqueInstanceInnerIdAsc = 'uniqueInstance_innerID_ASC',
  UniqueInstanceInnerIdDesc = 'uniqueInstance_innerID_DESC',
  UniqueInstanceMetadataAsc = 'uniqueInstance_metadata_ASC',
  UniqueInstanceMetadataDesc = 'uniqueInstance_metadata_DESC',
  UniqueInstanceMintedAtAsc = 'uniqueInstance_mintedAt_ASC',
  UniqueInstanceMintedAtDesc = 'uniqueInstance_mintedAt_DESC',
  UniqueInstancePriceAsc = 'uniqueInstance_price_ASC',
  UniqueInstancePriceDesc = 'uniqueInstance_price_DESC',
  UniqueInstanceStatusAsc = 'uniqueInstance_status_ASC',
  UniqueInstanceStatusDesc = 'uniqueInstance_status_DESC',
}

export type UniqueEventWhereInput = {
  AND?: InputMaybe<Array<UniqueEventWhereInput>>
  OR?: InputMaybe<Array<UniqueEventWhereInput>>
  blockHash_contains?: InputMaybe<Scalars['String']>
  blockHash_containsInsensitive?: InputMaybe<Scalars['String']>
  blockHash_endsWith?: InputMaybe<Scalars['String']>
  blockHash_eq?: InputMaybe<Scalars['String']>
  blockHash_gt?: InputMaybe<Scalars['String']>
  blockHash_gte?: InputMaybe<Scalars['String']>
  blockHash_in?: InputMaybe<Array<Scalars['String']>>
  blockHash_isNull?: InputMaybe<Scalars['Boolean']>
  blockHash_lt?: InputMaybe<Scalars['String']>
  blockHash_lte?: InputMaybe<Scalars['String']>
  blockHash_not_contains?: InputMaybe<Scalars['String']>
  blockHash_not_containsInsensitive?: InputMaybe<Scalars['String']>
  blockHash_not_endsWith?: InputMaybe<Scalars['String']>
  blockHash_not_eq?: InputMaybe<Scalars['String']>
  blockHash_not_in?: InputMaybe<Array<Scalars['String']>>
  blockHash_not_startsWith?: InputMaybe<Scalars['String']>
  blockHash_startsWith?: InputMaybe<Scalars['String']>
  blockNum_eq?: InputMaybe<Scalars['Int']>
  blockNum_gt?: InputMaybe<Scalars['Int']>
  blockNum_gte?: InputMaybe<Scalars['Int']>
  blockNum_in?: InputMaybe<Array<Scalars['Int']>>
  blockNum_isNull?: InputMaybe<Scalars['Boolean']>
  blockNum_lt?: InputMaybe<Scalars['Int']>
  blockNum_lte?: InputMaybe<Scalars['Int']>
  blockNum_not_eq?: InputMaybe<Scalars['Int']>
  blockNum_not_in?: InputMaybe<Array<Scalars['Int']>>
  from_contains?: InputMaybe<Scalars['String']>
  from_containsInsensitive?: InputMaybe<Scalars['String']>
  from_endsWith?: InputMaybe<Scalars['String']>
  from_eq?: InputMaybe<Scalars['String']>
  from_gt?: InputMaybe<Scalars['String']>
  from_gte?: InputMaybe<Scalars['String']>
  from_in?: InputMaybe<Array<Scalars['String']>>
  from_isNull?: InputMaybe<Scalars['Boolean']>
  from_lt?: InputMaybe<Scalars['String']>
  from_lte?: InputMaybe<Scalars['String']>
  from_not_contains?: InputMaybe<Scalars['String']>
  from_not_containsInsensitive?: InputMaybe<Scalars['String']>
  from_not_endsWith?: InputMaybe<Scalars['String']>
  from_not_eq?: InputMaybe<Scalars['String']>
  from_not_in?: InputMaybe<Array<Scalars['String']>>
  from_not_startsWith?: InputMaybe<Scalars['String']>
  from_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  price_eq?: InputMaybe<Scalars['BigInt']>
  price_gt?: InputMaybe<Scalars['BigInt']>
  price_gte?: InputMaybe<Scalars['BigInt']>
  price_in?: InputMaybe<Array<Scalars['BigInt']>>
  price_isNull?: InputMaybe<Scalars['Boolean']>
  price_lt?: InputMaybe<Scalars['BigInt']>
  price_lte?: InputMaybe<Scalars['BigInt']>
  price_not_eq?: InputMaybe<Scalars['BigInt']>
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  timestamp_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_gt?: InputMaybe<Scalars['DateTime']>
  timestamp_gte?: InputMaybe<Scalars['DateTime']>
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>
  timestamp_lt?: InputMaybe<Scalars['DateTime']>
  timestamp_lte?: InputMaybe<Scalars['DateTime']>
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  to_contains?: InputMaybe<Scalars['String']>
  to_containsInsensitive?: InputMaybe<Scalars['String']>
  to_endsWith?: InputMaybe<Scalars['String']>
  to_eq?: InputMaybe<Scalars['String']>
  to_gt?: InputMaybe<Scalars['String']>
  to_gte?: InputMaybe<Scalars['String']>
  to_in?: InputMaybe<Array<Scalars['String']>>
  to_isNull?: InputMaybe<Scalars['Boolean']>
  to_lt?: InputMaybe<Scalars['String']>
  to_lte?: InputMaybe<Scalars['String']>
  to_not_contains?: InputMaybe<Scalars['String']>
  to_not_containsInsensitive?: InputMaybe<Scalars['String']>
  to_not_endsWith?: InputMaybe<Scalars['String']>
  to_not_eq?: InputMaybe<Scalars['String']>
  to_not_in?: InputMaybe<Array<Scalars['String']>>
  to_not_startsWith?: InputMaybe<Scalars['String']>
  to_startsWith?: InputMaybe<Scalars['String']>
  type_eq?: InputMaybe<EventType>
  type_in?: InputMaybe<Array<EventType>>
  type_isNull?: InputMaybe<Scalars['Boolean']>
  type_not_eq?: InputMaybe<EventType>
  type_not_in?: InputMaybe<Array<EventType>>
  uniqueClass?: InputMaybe<UniqueClassWhereInput>
  uniqueClass_isNull?: InputMaybe<Scalars['Boolean']>
  uniqueInstance?: InputMaybe<UniqueInstanceWhereInput>
  uniqueInstance_isNull?: InputMaybe<Scalars['Boolean']>
}

export type UniqueEventsConnection = {
  __typename?: 'UniqueEventsConnection'
  edges: Array<UniqueEventEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type UniqueInstance = {
  __typename?: 'UniqueInstance'
  attributes: Array<Attribute>
  events: Array<UniqueEvent>
  id: Scalars['String']
  innerID: Scalars['Int']
  metadata?: Maybe<Scalars['String']>
  mintedAt: Scalars['DateTime']
  owner: Account
  price: Scalars['BigInt']
  status: Status
  uniqueClass: UniqueClass
}

export type UniqueInstanceEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UniqueEventOrderByInput>>
  where?: InputMaybe<UniqueEventWhereInput>
}

export type UniqueInstanceEdge = {
  __typename?: 'UniqueInstanceEdge'
  cursor: Scalars['String']
  node: UniqueInstance
}

export enum UniqueInstanceOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  InnerIdAsc = 'innerID_ASC',
  InnerIdDesc = 'innerID_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  MintedAtAsc = 'mintedAt_ASC',
  MintedAtDesc = 'mintedAt_DESC',
  OwnerIdAsc = 'owner_id_ASC',
  OwnerIdDesc = 'owner_id_DESC',
  PriceAsc = 'price_ASC',
  PriceDesc = 'price_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  UniqueClassAdminAsc = 'uniqueClass_admin_ASC',
  UniqueClassAdminDesc = 'uniqueClass_admin_DESC',
  UniqueClassCreatedAtAsc = 'uniqueClass_createdAt_ASC',
  UniqueClassCreatedAtDesc = 'uniqueClass_createdAt_DESC',
  UniqueClassCreatorAsc = 'uniqueClass_creator_ASC',
  UniqueClassCreatorDesc = 'uniqueClass_creator_DESC',
  UniqueClassFreezerAsc = 'uniqueClass_freezer_ASC',
  UniqueClassFreezerDesc = 'uniqueClass_freezer_DESC',
  UniqueClassIdAsc = 'uniqueClass_id_ASC',
  UniqueClassIdDesc = 'uniqueClass_id_DESC',
  UniqueClassIssuerAsc = 'uniqueClass_issuer_ASC',
  UniqueClassIssuerDesc = 'uniqueClass_issuer_DESC',
  UniqueClassMaxSupplyAsc = 'uniqueClass_maxSupply_ASC',
  UniqueClassMaxSupplyDesc = 'uniqueClass_maxSupply_DESC',
  UniqueClassMetadataAsc = 'uniqueClass_metadata_ASC',
  UniqueClassMetadataDesc = 'uniqueClass_metadata_DESC',
  UniqueClassOwnerAsc = 'uniqueClass_owner_ASC',
  UniqueClassOwnerDesc = 'uniqueClass_owner_DESC',
  UniqueClassStatusAsc = 'uniqueClass_status_ASC',
  UniqueClassStatusDesc = 'uniqueClass_status_DESC',
}

export type UniqueInstanceWhereInput = {
  AND?: InputMaybe<Array<UniqueInstanceWhereInput>>
  OR?: InputMaybe<Array<UniqueInstanceWhereInput>>
  attributes_isNull?: InputMaybe<Scalars['Boolean']>
  events_every?: InputMaybe<UniqueEventWhereInput>
  events_none?: InputMaybe<UniqueEventWhereInput>
  events_some?: InputMaybe<UniqueEventWhereInput>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  innerID_eq?: InputMaybe<Scalars['Int']>
  innerID_gt?: InputMaybe<Scalars['Int']>
  innerID_gte?: InputMaybe<Scalars['Int']>
  innerID_in?: InputMaybe<Array<Scalars['Int']>>
  innerID_isNull?: InputMaybe<Scalars['Boolean']>
  innerID_lt?: InputMaybe<Scalars['Int']>
  innerID_lte?: InputMaybe<Scalars['Int']>
  innerID_not_eq?: InputMaybe<Scalars['Int']>
  innerID_not_in?: InputMaybe<Array<Scalars['Int']>>
  metadata_contains?: InputMaybe<Scalars['String']>
  metadata_containsInsensitive?: InputMaybe<Scalars['String']>
  metadata_endsWith?: InputMaybe<Scalars['String']>
  metadata_eq?: InputMaybe<Scalars['String']>
  metadata_gt?: InputMaybe<Scalars['String']>
  metadata_gte?: InputMaybe<Scalars['String']>
  metadata_in?: InputMaybe<Array<Scalars['String']>>
  metadata_isNull?: InputMaybe<Scalars['Boolean']>
  metadata_lt?: InputMaybe<Scalars['String']>
  metadata_lte?: InputMaybe<Scalars['String']>
  metadata_not_contains?: InputMaybe<Scalars['String']>
  metadata_not_containsInsensitive?: InputMaybe<Scalars['String']>
  metadata_not_endsWith?: InputMaybe<Scalars['String']>
  metadata_not_eq?: InputMaybe<Scalars['String']>
  metadata_not_in?: InputMaybe<Array<Scalars['String']>>
  metadata_not_startsWith?: InputMaybe<Scalars['String']>
  metadata_startsWith?: InputMaybe<Scalars['String']>
  mintedAt_eq?: InputMaybe<Scalars['DateTime']>
  mintedAt_gt?: InputMaybe<Scalars['DateTime']>
  mintedAt_gte?: InputMaybe<Scalars['DateTime']>
  mintedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  mintedAt_isNull?: InputMaybe<Scalars['Boolean']>
  mintedAt_lt?: InputMaybe<Scalars['DateTime']>
  mintedAt_lte?: InputMaybe<Scalars['DateTime']>
  mintedAt_not_eq?: InputMaybe<Scalars['DateTime']>
  mintedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  owner?: InputMaybe<AccountWhereInput>
  owner_isNull?: InputMaybe<Scalars['Boolean']>
  price_eq?: InputMaybe<Scalars['BigInt']>
  price_gt?: InputMaybe<Scalars['BigInt']>
  price_gte?: InputMaybe<Scalars['BigInt']>
  price_in?: InputMaybe<Array<Scalars['BigInt']>>
  price_isNull?: InputMaybe<Scalars['Boolean']>
  price_lt?: InputMaybe<Scalars['BigInt']>
  price_lte?: InputMaybe<Scalars['BigInt']>
  price_not_eq?: InputMaybe<Scalars['BigInt']>
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  status_eq?: InputMaybe<Status>
  status_in?: InputMaybe<Array<Status>>
  status_isNull?: InputMaybe<Scalars['Boolean']>
  status_not_eq?: InputMaybe<Status>
  status_not_in?: InputMaybe<Array<Status>>
  uniqueClass?: InputMaybe<UniqueClassWhereInput>
  uniqueClass_isNull?: InputMaybe<Scalars['Boolean']>
}

export type UniqueInstancesConnection = {
  __typename?: 'UniqueInstancesConnection'
  edges: Array<UniqueInstanceEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type WhereIdInput = {
  id: Scalars['String']
}

export type NftsQueryVariables = Exact<{
  addresses?: InputMaybe<Array<Scalars['String']> | Scalars['String']>
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
}>

export type NftsQuery = {
  __typename?: 'Query'
  uniqueInstancesConnection: {
    __typename?: 'UniqueInstancesConnection'
    edges: Array<{
      __typename?: 'UniqueInstanceEdge'
      node: {
        __typename?: 'UniqueInstance'
        id: string
        innerID: number
        metadata?: string | null
        price: any
        uniqueClass: { __typename?: 'UniqueClass'; id: string; metadata?: string | null; maxSupply?: number | null }
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; endCursor: string; hasNextPage: boolean }
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
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'addresses' } },
          type: {
            kind: 'ListType',
            type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
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
            name: { kind: 'Name', value: 'uniqueInstancesConnection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'EnumValue', value: 'id_ASC' },
              },
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
                value: {
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
                            name: { kind: 'Name', value: 'id_in' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'addresses' } },
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
                            { kind: 'Field', name: { kind: 'Name', value: 'innerID' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'uniqueClass' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'maxSupply' } },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
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
