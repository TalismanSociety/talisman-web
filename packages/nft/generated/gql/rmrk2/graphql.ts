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

export type Attribute = {
  __typename?: 'Attribute'
  display?: Maybe<Scalars['String']['output']>
  trait?: Maybe<Scalars['String']['output']>
  value: Scalars['String']['output']
}

export type Base = {
  __typename?: 'Base'
  currentOwner: Scalars['String']['output']
  id: Scalars['String']['output']
  issuer: Scalars['String']['output']
  meta?: Maybe<MetadataEntity>
  metadata?: Maybe<Scalars['String']['output']>
  symbol: Scalars['String']['output']
  type: BaseType
}

export type BaseEdge = {
  __typename?: 'BaseEdge'
  cursor: Scalars['String']['output']
  node: Base
}

export enum BaseOrderByInput {
  CurrentOwnerAsc = 'currentOwner_ASC',
  CurrentOwnerDesc = 'currentOwner_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IssuerAsc = 'issuer_ASC',
  IssuerDesc = 'issuer_DESC',
  MetaAnimationUrlAsc = 'meta_animationUrl_ASC',
  MetaAnimationUrlDesc = 'meta_animationUrl_DESC',
  MetaDescriptionAsc = 'meta_description_ASC',
  MetaDescriptionDesc = 'meta_description_DESC',
  MetaIdAsc = 'meta_id_ASC',
  MetaIdDesc = 'meta_id_DESC',
  MetaImageAsc = 'meta_image_ASC',
  MetaImageDesc = 'meta_image_DESC',
  MetaNameAsc = 'meta_name_ASC',
  MetaNameDesc = 'meta_name_DESC',
  MetaTypeAsc = 'meta_type_ASC',
  MetaTypeDesc = 'meta_type_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  SymbolAsc = 'symbol_ASC',
  SymbolDesc = 'symbol_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

export enum BaseType {
  Audio = 'audio',
  Mixed = 'mixed',
  Png = 'png',
  Svg = 'svg',
  Video = 'video',
}

export type BaseWhereInput = {
  AND?: InputMaybe<Array<BaseWhereInput>>
  OR?: InputMaybe<Array<BaseWhereInput>>
  currentOwner_contains?: InputMaybe<Scalars['String']['input']>
  currentOwner_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  currentOwner_endsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_eq?: InputMaybe<Scalars['String']['input']>
  currentOwner_gt?: InputMaybe<Scalars['String']['input']>
  currentOwner_gte?: InputMaybe<Scalars['String']['input']>
  currentOwner_in?: InputMaybe<Array<Scalars['String']['input']>>
  currentOwner_isNull?: InputMaybe<Scalars['Boolean']['input']>
  currentOwner_lt?: InputMaybe<Scalars['String']['input']>
  currentOwner_lte?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_contains?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_endsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_eq?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  currentOwner_not_startsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_startsWith?: InputMaybe<Scalars['String']['input']>
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
  issuer_contains?: InputMaybe<Scalars['String']['input']>
  issuer_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  issuer_endsWith?: InputMaybe<Scalars['String']['input']>
  issuer_eq?: InputMaybe<Scalars['String']['input']>
  issuer_gt?: InputMaybe<Scalars['String']['input']>
  issuer_gte?: InputMaybe<Scalars['String']['input']>
  issuer_in?: InputMaybe<Array<Scalars['String']['input']>>
  issuer_isNull?: InputMaybe<Scalars['Boolean']['input']>
  issuer_lt?: InputMaybe<Scalars['String']['input']>
  issuer_lte?: InputMaybe<Scalars['String']['input']>
  issuer_not_contains?: InputMaybe<Scalars['String']['input']>
  issuer_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  issuer_not_endsWith?: InputMaybe<Scalars['String']['input']>
  issuer_not_eq?: InputMaybe<Scalars['String']['input']>
  issuer_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  issuer_not_startsWith?: InputMaybe<Scalars['String']['input']>
  issuer_startsWith?: InputMaybe<Scalars['String']['input']>
  meta?: InputMaybe<MetadataEntityWhereInput>
  meta_isNull?: InputMaybe<Scalars['Boolean']['input']>
  metadata_contains?: InputMaybe<Scalars['String']['input']>
  metadata_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  metadata_endsWith?: InputMaybe<Scalars['String']['input']>
  metadata_eq?: InputMaybe<Scalars['String']['input']>
  metadata_gt?: InputMaybe<Scalars['String']['input']>
  metadata_gte?: InputMaybe<Scalars['String']['input']>
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>
  metadata_isNull?: InputMaybe<Scalars['Boolean']['input']>
  metadata_lt?: InputMaybe<Scalars['String']['input']>
  metadata_lte?: InputMaybe<Scalars['String']['input']>
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>
  metadata_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  metadata_not_endsWith?: InputMaybe<Scalars['String']['input']>
  metadata_not_eq?: InputMaybe<Scalars['String']['input']>
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  metadata_not_startsWith?: InputMaybe<Scalars['String']['input']>
  metadata_startsWith?: InputMaybe<Scalars['String']['input']>
  symbol_contains?: InputMaybe<Scalars['String']['input']>
  symbol_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  symbol_endsWith?: InputMaybe<Scalars['String']['input']>
  symbol_eq?: InputMaybe<Scalars['String']['input']>
  symbol_gt?: InputMaybe<Scalars['String']['input']>
  symbol_gte?: InputMaybe<Scalars['String']['input']>
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>
  symbol_isNull?: InputMaybe<Scalars['Boolean']['input']>
  symbol_lt?: InputMaybe<Scalars['String']['input']>
  symbol_lte?: InputMaybe<Scalars['String']['input']>
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  symbol_not_endsWith?: InputMaybe<Scalars['String']['input']>
  symbol_not_eq?: InputMaybe<Scalars['String']['input']>
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  symbol_not_startsWith?: InputMaybe<Scalars['String']['input']>
  symbol_startsWith?: InputMaybe<Scalars['String']['input']>
  type_eq?: InputMaybe<BaseType>
  type_in?: InputMaybe<Array<BaseType>>
  type_isNull?: InputMaybe<Scalars['Boolean']['input']>
  type_not_eq?: InputMaybe<BaseType>
  type_not_in?: InputMaybe<Array<BaseType>>
}

export type BasesConnection = {
  __typename?: 'BasesConnection'
  edges: Array<BaseEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type CacheStatus = {
  __typename?: 'CacheStatus'
  id: Scalars['String']['output']
  lastBlockTimestamp: Scalars['DateTime']['output']
}

export type CacheStatusEdge = {
  __typename?: 'CacheStatusEdge'
  cursor: Scalars['String']['output']
  node: CacheStatus
}

export enum CacheStatusOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LastBlockTimestampAsc = 'lastBlockTimestamp_ASC',
  LastBlockTimestampDesc = 'lastBlockTimestamp_DESC',
}

export type CacheStatusWhereInput = {
  AND?: InputMaybe<Array<CacheStatusWhereInput>>
  OR?: InputMaybe<Array<CacheStatusWhereInput>>
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
  lastBlockTimestamp_eq?: InputMaybe<Scalars['DateTime']['input']>
  lastBlockTimestamp_gt?: InputMaybe<Scalars['DateTime']['input']>
  lastBlockTimestamp_gte?: InputMaybe<Scalars['DateTime']['input']>
  lastBlockTimestamp_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  lastBlockTimestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>
  lastBlockTimestamp_lt?: InputMaybe<Scalars['DateTime']['input']>
  lastBlockTimestamp_lte?: InputMaybe<Scalars['DateTime']['input']>
  lastBlockTimestamp_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  lastBlockTimestamp_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
}

export type CacheStatusesConnection = {
  __typename?: 'CacheStatusesConnection'
  edges: Array<CacheStatusEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type ChartEntity = {
  __typename?: 'ChartEntity'
  average?: Maybe<Scalars['BigInt']['output']>
  count?: Maybe<Scalars['Float']['output']>
  date: Scalars['DateTime']['output']
  value?: Maybe<Scalars['BigInt']['output']>
}

export type CollectionEntitiesConnection = {
  __typename?: 'CollectionEntitiesConnection'
  edges: Array<CollectionEntityEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type CollectionEntity = {
  __typename?: 'CollectionEntity'
  blockNumber?: Maybe<Scalars['BigInt']['output']>
  createdAt: Scalars['DateTime']['output']
  currentOwner?: Maybe<Scalars['String']['output']>
  events?: Maybe<Array<CollectionEvent>>
  hash: Scalars['String']['output']
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  issuer?: Maybe<Scalars['String']['output']>
  max: Scalars['Int']['output']
  media?: Maybe<Scalars['String']['output']>
  meta?: Maybe<MetadataEntity>
  metadata?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  nftCount: Scalars['Int']['output']
  nfts: Array<NftEntity>
  supply: Scalars['Int']['output']
  symbol: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
  version: Scalars['String']['output']
}

export type CollectionEntityNftsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NftEntityOrderByInput>>
  where?: InputMaybe<NftEntityWhereInput>
}

export type CollectionEntityEdge = {
  __typename?: 'CollectionEntityEdge'
  cursor: Scalars['String']['output']
  node: CollectionEntity
}

export enum CollectionEntityOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CurrentOwnerAsc = 'currentOwner_ASC',
  CurrentOwnerDesc = 'currentOwner_DESC',
  HashAsc = 'hash_ASC',
  HashDesc = 'hash_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  IssuerAsc = 'issuer_ASC',
  IssuerDesc = 'issuer_DESC',
  MaxAsc = 'max_ASC',
  MaxDesc = 'max_DESC',
  MediaAsc = 'media_ASC',
  MediaDesc = 'media_DESC',
  MetaAnimationUrlAsc = 'meta_animationUrl_ASC',
  MetaAnimationUrlDesc = 'meta_animationUrl_DESC',
  MetaDescriptionAsc = 'meta_description_ASC',
  MetaDescriptionDesc = 'meta_description_DESC',
  MetaIdAsc = 'meta_id_ASC',
  MetaIdDesc = 'meta_id_DESC',
  MetaImageAsc = 'meta_image_ASC',
  MetaImageDesc = 'meta_image_DESC',
  MetaNameAsc = 'meta_name_ASC',
  MetaNameDesc = 'meta_name_DESC',
  MetaTypeAsc = 'meta_type_ASC',
  MetaTypeDesc = 'meta_type_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  NftCountAsc = 'nftCount_ASC',
  NftCountDesc = 'nftCount_DESC',
  SupplyAsc = 'supply_ASC',
  SupplyDesc = 'supply_DESC',
  SymbolAsc = 'symbol_ASC',
  SymbolDesc = 'symbol_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  VersionAsc = 'version_ASC',
  VersionDesc = 'version_DESC',
}

export type CollectionEntityWhereInput = {
  AND?: InputMaybe<Array<CollectionEntityWhereInput>>
  OR?: InputMaybe<Array<CollectionEntityWhereInput>>
  blockNumber_eq?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  currentOwner_contains?: InputMaybe<Scalars['String']['input']>
  currentOwner_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  currentOwner_endsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_eq?: InputMaybe<Scalars['String']['input']>
  currentOwner_gt?: InputMaybe<Scalars['String']['input']>
  currentOwner_gte?: InputMaybe<Scalars['String']['input']>
  currentOwner_in?: InputMaybe<Array<Scalars['String']['input']>>
  currentOwner_isNull?: InputMaybe<Scalars['Boolean']['input']>
  currentOwner_lt?: InputMaybe<Scalars['String']['input']>
  currentOwner_lte?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_contains?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_endsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_eq?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  currentOwner_not_startsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_startsWith?: InputMaybe<Scalars['String']['input']>
  events_isNull?: InputMaybe<Scalars['Boolean']['input']>
  hash_contains?: InputMaybe<Scalars['String']['input']>
  hash_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  hash_endsWith?: InputMaybe<Scalars['String']['input']>
  hash_eq?: InputMaybe<Scalars['String']['input']>
  hash_gt?: InputMaybe<Scalars['String']['input']>
  hash_gte?: InputMaybe<Scalars['String']['input']>
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>
  hash_isNull?: InputMaybe<Scalars['Boolean']['input']>
  hash_lt?: InputMaybe<Scalars['String']['input']>
  hash_lte?: InputMaybe<Scalars['String']['input']>
  hash_not_contains?: InputMaybe<Scalars['String']['input']>
  hash_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  hash_not_endsWith?: InputMaybe<Scalars['String']['input']>
  hash_not_eq?: InputMaybe<Scalars['String']['input']>
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  hash_not_startsWith?: InputMaybe<Scalars['String']['input']>
  hash_startsWith?: InputMaybe<Scalars['String']['input']>
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
  image_contains?: InputMaybe<Scalars['String']['input']>
  image_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  image_endsWith?: InputMaybe<Scalars['String']['input']>
  image_eq?: InputMaybe<Scalars['String']['input']>
  image_gt?: InputMaybe<Scalars['String']['input']>
  image_gte?: InputMaybe<Scalars['String']['input']>
  image_in?: InputMaybe<Array<Scalars['String']['input']>>
  image_isNull?: InputMaybe<Scalars['Boolean']['input']>
  image_lt?: InputMaybe<Scalars['String']['input']>
  image_lte?: InputMaybe<Scalars['String']['input']>
  image_not_contains?: InputMaybe<Scalars['String']['input']>
  image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  image_not_endsWith?: InputMaybe<Scalars['String']['input']>
  image_not_eq?: InputMaybe<Scalars['String']['input']>
  image_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  image_not_startsWith?: InputMaybe<Scalars['String']['input']>
  image_startsWith?: InputMaybe<Scalars['String']['input']>
  issuer_contains?: InputMaybe<Scalars['String']['input']>
  issuer_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  issuer_endsWith?: InputMaybe<Scalars['String']['input']>
  issuer_eq?: InputMaybe<Scalars['String']['input']>
  issuer_gt?: InputMaybe<Scalars['String']['input']>
  issuer_gte?: InputMaybe<Scalars['String']['input']>
  issuer_in?: InputMaybe<Array<Scalars['String']['input']>>
  issuer_isNull?: InputMaybe<Scalars['Boolean']['input']>
  issuer_lt?: InputMaybe<Scalars['String']['input']>
  issuer_lte?: InputMaybe<Scalars['String']['input']>
  issuer_not_contains?: InputMaybe<Scalars['String']['input']>
  issuer_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  issuer_not_endsWith?: InputMaybe<Scalars['String']['input']>
  issuer_not_eq?: InputMaybe<Scalars['String']['input']>
  issuer_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  issuer_not_startsWith?: InputMaybe<Scalars['String']['input']>
  issuer_startsWith?: InputMaybe<Scalars['String']['input']>
  max_eq?: InputMaybe<Scalars['Int']['input']>
  max_gt?: InputMaybe<Scalars['Int']['input']>
  max_gte?: InputMaybe<Scalars['Int']['input']>
  max_in?: InputMaybe<Array<Scalars['Int']['input']>>
  max_isNull?: InputMaybe<Scalars['Boolean']['input']>
  max_lt?: InputMaybe<Scalars['Int']['input']>
  max_lte?: InputMaybe<Scalars['Int']['input']>
  max_not_eq?: InputMaybe<Scalars['Int']['input']>
  max_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  media_contains?: InputMaybe<Scalars['String']['input']>
  media_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  media_endsWith?: InputMaybe<Scalars['String']['input']>
  media_eq?: InputMaybe<Scalars['String']['input']>
  media_gt?: InputMaybe<Scalars['String']['input']>
  media_gte?: InputMaybe<Scalars['String']['input']>
  media_in?: InputMaybe<Array<Scalars['String']['input']>>
  media_isNull?: InputMaybe<Scalars['Boolean']['input']>
  media_lt?: InputMaybe<Scalars['String']['input']>
  media_lte?: InputMaybe<Scalars['String']['input']>
  media_not_contains?: InputMaybe<Scalars['String']['input']>
  media_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  media_not_endsWith?: InputMaybe<Scalars['String']['input']>
  media_not_eq?: InputMaybe<Scalars['String']['input']>
  media_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  media_not_startsWith?: InputMaybe<Scalars['String']['input']>
  media_startsWith?: InputMaybe<Scalars['String']['input']>
  meta?: InputMaybe<MetadataEntityWhereInput>
  meta_isNull?: InputMaybe<Scalars['Boolean']['input']>
  metadata_contains?: InputMaybe<Scalars['String']['input']>
  metadata_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  metadata_endsWith?: InputMaybe<Scalars['String']['input']>
  metadata_eq?: InputMaybe<Scalars['String']['input']>
  metadata_gt?: InputMaybe<Scalars['String']['input']>
  metadata_gte?: InputMaybe<Scalars['String']['input']>
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>
  metadata_isNull?: InputMaybe<Scalars['Boolean']['input']>
  metadata_lt?: InputMaybe<Scalars['String']['input']>
  metadata_lte?: InputMaybe<Scalars['String']['input']>
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>
  metadata_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  metadata_not_endsWith?: InputMaybe<Scalars['String']['input']>
  metadata_not_eq?: InputMaybe<Scalars['String']['input']>
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  metadata_not_startsWith?: InputMaybe<Scalars['String']['input']>
  metadata_startsWith?: InputMaybe<Scalars['String']['input']>
  name_contains?: InputMaybe<Scalars['String']['input']>
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  name_endsWith?: InputMaybe<Scalars['String']['input']>
  name_eq?: InputMaybe<Scalars['String']['input']>
  name_gt?: InputMaybe<Scalars['String']['input']>
  name_gte?: InputMaybe<Scalars['String']['input']>
  name_in?: InputMaybe<Array<Scalars['String']['input']>>
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>
  name_lt?: InputMaybe<Scalars['String']['input']>
  name_lte?: InputMaybe<Scalars['String']['input']>
  name_not_contains?: InputMaybe<Scalars['String']['input']>
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>
  name_not_eq?: InputMaybe<Scalars['String']['input']>
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>
  name_startsWith?: InputMaybe<Scalars['String']['input']>
  nftCount_eq?: InputMaybe<Scalars['Int']['input']>
  nftCount_gt?: InputMaybe<Scalars['Int']['input']>
  nftCount_gte?: InputMaybe<Scalars['Int']['input']>
  nftCount_in?: InputMaybe<Array<Scalars['Int']['input']>>
  nftCount_isNull?: InputMaybe<Scalars['Boolean']['input']>
  nftCount_lt?: InputMaybe<Scalars['Int']['input']>
  nftCount_lte?: InputMaybe<Scalars['Int']['input']>
  nftCount_not_eq?: InputMaybe<Scalars['Int']['input']>
  nftCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  nfts_every?: InputMaybe<NftEntityWhereInput>
  nfts_none?: InputMaybe<NftEntityWhereInput>
  nfts_some?: InputMaybe<NftEntityWhereInput>
  supply_eq?: InputMaybe<Scalars['Int']['input']>
  supply_gt?: InputMaybe<Scalars['Int']['input']>
  supply_gte?: InputMaybe<Scalars['Int']['input']>
  supply_in?: InputMaybe<Array<Scalars['Int']['input']>>
  supply_isNull?: InputMaybe<Scalars['Boolean']['input']>
  supply_lt?: InputMaybe<Scalars['Int']['input']>
  supply_lte?: InputMaybe<Scalars['Int']['input']>
  supply_not_eq?: InputMaybe<Scalars['Int']['input']>
  supply_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  symbol_contains?: InputMaybe<Scalars['String']['input']>
  symbol_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  symbol_endsWith?: InputMaybe<Scalars['String']['input']>
  symbol_eq?: InputMaybe<Scalars['String']['input']>
  symbol_gt?: InputMaybe<Scalars['String']['input']>
  symbol_gte?: InputMaybe<Scalars['String']['input']>
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>
  symbol_isNull?: InputMaybe<Scalars['Boolean']['input']>
  symbol_lt?: InputMaybe<Scalars['String']['input']>
  symbol_lte?: InputMaybe<Scalars['String']['input']>
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  symbol_not_endsWith?: InputMaybe<Scalars['String']['input']>
  symbol_not_eq?: InputMaybe<Scalars['String']['input']>
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  symbol_not_startsWith?: InputMaybe<Scalars['String']['input']>
  symbol_startsWith?: InputMaybe<Scalars['String']['input']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  version_contains?: InputMaybe<Scalars['String']['input']>
  version_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  version_endsWith?: InputMaybe<Scalars['String']['input']>
  version_eq?: InputMaybe<Scalars['String']['input']>
  version_gt?: InputMaybe<Scalars['String']['input']>
  version_gte?: InputMaybe<Scalars['String']['input']>
  version_in?: InputMaybe<Array<Scalars['String']['input']>>
  version_isNull?: InputMaybe<Scalars['Boolean']['input']>
  version_lt?: InputMaybe<Scalars['String']['input']>
  version_lte?: InputMaybe<Scalars['String']['input']>
  version_not_contains?: InputMaybe<Scalars['String']['input']>
  version_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  version_not_endsWith?: InputMaybe<Scalars['String']['input']>
  version_not_eq?: InputMaybe<Scalars['String']['input']>
  version_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  version_not_startsWith?: InputMaybe<Scalars['String']['input']>
  version_startsWith?: InputMaybe<Scalars['String']['input']>
}

export type CollectionEvent = {
  __typename?: 'CollectionEvent'
  blockNumber?: Maybe<Scalars['String']['output']>
  caller: Scalars['String']['output']
  interaction: Scalars['String']['output']
  meta: Scalars['String']['output']
  timestamp?: Maybe<Scalars['DateTime']['output']>
}

export type Collector = {
  __typename?: 'Collector'
  average?: Maybe<Scalars['Float']['output']>
  collections: Scalars['Int']['output']
  id: Scalars['String']['output']
  max?: Maybe<Scalars['BigInt']['output']>
  name: Scalars['String']['output']
  total: Scalars['Int']['output']
  unique: Scalars['Int']['output']
  uniqueCollectors: Scalars['Int']['output']
  volume?: Maybe<Scalars['BigInt']['output']>
}

export type CollectorEdge = {
  __typename?: 'CollectorEdge'
  cursor: Scalars['String']['output']
  node: Collector
}

export enum CollectorOrderByInput {
  AverageAsc = 'average_ASC',
  AverageDesc = 'average_DESC',
  CollectionsAsc = 'collections_ASC',
  CollectionsDesc = 'collections_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MaxAsc = 'max_ASC',
  MaxDesc = 'max_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  TotalAsc = 'total_ASC',
  TotalDesc = 'total_DESC',
  UniqueCollectorsAsc = 'uniqueCollectors_ASC',
  UniqueCollectorsDesc = 'uniqueCollectors_DESC',
  UniqueAsc = 'unique_ASC',
  UniqueDesc = 'unique_DESC',
  VolumeAsc = 'volume_ASC',
  VolumeDesc = 'volume_DESC',
}

export type CollectorWhereInput = {
  AND?: InputMaybe<Array<CollectorWhereInput>>
  OR?: InputMaybe<Array<CollectorWhereInput>>
  average_eq?: InputMaybe<Scalars['Float']['input']>
  average_gt?: InputMaybe<Scalars['Float']['input']>
  average_gte?: InputMaybe<Scalars['Float']['input']>
  average_in?: InputMaybe<Array<Scalars['Float']['input']>>
  average_isNull?: InputMaybe<Scalars['Boolean']['input']>
  average_lt?: InputMaybe<Scalars['Float']['input']>
  average_lte?: InputMaybe<Scalars['Float']['input']>
  average_not_eq?: InputMaybe<Scalars['Float']['input']>
  average_not_in?: InputMaybe<Array<Scalars['Float']['input']>>
  collections_eq?: InputMaybe<Scalars['Int']['input']>
  collections_gt?: InputMaybe<Scalars['Int']['input']>
  collections_gte?: InputMaybe<Scalars['Int']['input']>
  collections_in?: InputMaybe<Array<Scalars['Int']['input']>>
  collections_isNull?: InputMaybe<Scalars['Boolean']['input']>
  collections_lt?: InputMaybe<Scalars['Int']['input']>
  collections_lte?: InputMaybe<Scalars['Int']['input']>
  collections_not_eq?: InputMaybe<Scalars['Int']['input']>
  collections_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
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
  max_eq?: InputMaybe<Scalars['BigInt']['input']>
  max_gt?: InputMaybe<Scalars['BigInt']['input']>
  max_gte?: InputMaybe<Scalars['BigInt']['input']>
  max_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  max_isNull?: InputMaybe<Scalars['Boolean']['input']>
  max_lt?: InputMaybe<Scalars['BigInt']['input']>
  max_lte?: InputMaybe<Scalars['BigInt']['input']>
  max_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  max_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  name_contains?: InputMaybe<Scalars['String']['input']>
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  name_endsWith?: InputMaybe<Scalars['String']['input']>
  name_eq?: InputMaybe<Scalars['String']['input']>
  name_gt?: InputMaybe<Scalars['String']['input']>
  name_gte?: InputMaybe<Scalars['String']['input']>
  name_in?: InputMaybe<Array<Scalars['String']['input']>>
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>
  name_lt?: InputMaybe<Scalars['String']['input']>
  name_lte?: InputMaybe<Scalars['String']['input']>
  name_not_contains?: InputMaybe<Scalars['String']['input']>
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>
  name_not_eq?: InputMaybe<Scalars['String']['input']>
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>
  name_startsWith?: InputMaybe<Scalars['String']['input']>
  total_eq?: InputMaybe<Scalars['Int']['input']>
  total_gt?: InputMaybe<Scalars['Int']['input']>
  total_gte?: InputMaybe<Scalars['Int']['input']>
  total_in?: InputMaybe<Array<Scalars['Int']['input']>>
  total_isNull?: InputMaybe<Scalars['Boolean']['input']>
  total_lt?: InputMaybe<Scalars['Int']['input']>
  total_lte?: InputMaybe<Scalars['Int']['input']>
  total_not_eq?: InputMaybe<Scalars['Int']['input']>
  total_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  uniqueCollectors_eq?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_gt?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_gte?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_in?: InputMaybe<Array<Scalars['Int']['input']>>
  uniqueCollectors_isNull?: InputMaybe<Scalars['Boolean']['input']>
  uniqueCollectors_lt?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_lte?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_not_eq?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  unique_eq?: InputMaybe<Scalars['Int']['input']>
  unique_gt?: InputMaybe<Scalars['Int']['input']>
  unique_gte?: InputMaybe<Scalars['Int']['input']>
  unique_in?: InputMaybe<Array<Scalars['Int']['input']>>
  unique_isNull?: InputMaybe<Scalars['Boolean']['input']>
  unique_lt?: InputMaybe<Scalars['Int']['input']>
  unique_lte?: InputMaybe<Scalars['Int']['input']>
  unique_not_eq?: InputMaybe<Scalars['Int']['input']>
  unique_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  volume_eq?: InputMaybe<Scalars['BigInt']['input']>
  volume_gt?: InputMaybe<Scalars['BigInt']['input']>
  volume_gte?: InputMaybe<Scalars['BigInt']['input']>
  volume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  volume_isNull?: InputMaybe<Scalars['Boolean']['input']>
  volume_lt?: InputMaybe<Scalars['BigInt']['input']>
  volume_lte?: InputMaybe<Scalars['BigInt']['input']>
  volume_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  volume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
}

export type CollectorsConnection = {
  __typename?: 'CollectorsConnection'
  edges: Array<CollectorEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type Emote = {
  __typename?: 'Emote'
  caller: Scalars['String']['output']
  id: Scalars['String']['output']
  nft: NftEntity
  value: Scalars['String']['output']
  version: Scalars['String']['output']
}

export type EmoteCountEntity = {
  __typename?: 'EmoteCountEntity'
  id: Scalars['String']['output']
  value: Scalars['Float']['output']
}

export type EmoteCountMapEntity = {
  __typename?: 'EmoteCountMapEntity'
  counts: Scalars['String']['output']
}

export type EmoteEdge = {
  __typename?: 'EmoteEdge'
  cursor: Scalars['String']['output']
  node: Emote
}

export enum EmoteOrderByInput {
  CallerAsc = 'caller_ASC',
  CallerDesc = 'caller_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NftBlockNumberAsc = 'nft_blockNumber_ASC',
  NftBlockNumberDesc = 'nft_blockNumber_DESC',
  NftBurnedAsc = 'nft_burned_ASC',
  NftBurnedDesc = 'nft_burned_DESC',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCurrentOwnerAsc = 'nft_currentOwner_ASC',
  NftCurrentOwnerDesc = 'nft_currentOwner_DESC',
  NftEmoteCountAsc = 'nft_emoteCount_ASC',
  NftEmoteCountDesc = 'nft_emoteCount_DESC',
  NftHashAsc = 'nft_hash_ASC',
  NftHashDesc = 'nft_hash_DESC',
  NftIdAsc = 'nft_id_ASC',
  NftIdDesc = 'nft_id_DESC',
  NftImageAsc = 'nft_image_ASC',
  NftImageDesc = 'nft_image_DESC',
  NftInstanceAsc = 'nft_instance_ASC',
  NftInstanceDesc = 'nft_instance_DESC',
  NftIssuerAsc = 'nft_issuer_ASC',
  NftIssuerDesc = 'nft_issuer_DESC',
  NftMediaAsc = 'nft_media_ASC',
  NftMediaDesc = 'nft_media_DESC',
  NftMetadataAsc = 'nft_metadata_ASC',
  NftMetadataDesc = 'nft_metadata_DESC',
  NftNameAsc = 'nft_name_ASC',
  NftNameDesc = 'nft_name_DESC',
  NftPendingAsc = 'nft_pending_ASC',
  NftPendingDesc = 'nft_pending_DESC',
  NftPriceAsc = 'nft_price_ASC',
  NftPriceDesc = 'nft_price_DESC',
  NftRecipientAsc = 'nft_recipient_ASC',
  NftRecipientDesc = 'nft_recipient_DESC',
  NftRoyaltyAsc = 'nft_royalty_ASC',
  NftRoyaltyDesc = 'nft_royalty_DESC',
  NftSnAsc = 'nft_sn_ASC',
  NftSnDesc = 'nft_sn_DESC',
  NftTransferableAsc = 'nft_transferable_ASC',
  NftTransferableDesc = 'nft_transferable_DESC',
  NftUpdatedAtAsc = 'nft_updatedAt_ASC',
  NftUpdatedAtDesc = 'nft_updatedAt_DESC',
  NftVersionAsc = 'nft_version_ASC',
  NftVersionDesc = 'nft_version_DESC',
  ValueAsc = 'value_ASC',
  ValueDesc = 'value_DESC',
  VersionAsc = 'version_ASC',
  VersionDesc = 'version_DESC',
}

export type EmoteWhereInput = {
  AND?: InputMaybe<Array<EmoteWhereInput>>
  OR?: InputMaybe<Array<EmoteWhereInput>>
  caller_contains?: InputMaybe<Scalars['String']['input']>
  caller_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  caller_endsWith?: InputMaybe<Scalars['String']['input']>
  caller_eq?: InputMaybe<Scalars['String']['input']>
  caller_gt?: InputMaybe<Scalars['String']['input']>
  caller_gte?: InputMaybe<Scalars['String']['input']>
  caller_in?: InputMaybe<Array<Scalars['String']['input']>>
  caller_isNull?: InputMaybe<Scalars['Boolean']['input']>
  caller_lt?: InputMaybe<Scalars['String']['input']>
  caller_lte?: InputMaybe<Scalars['String']['input']>
  caller_not_contains?: InputMaybe<Scalars['String']['input']>
  caller_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  caller_not_endsWith?: InputMaybe<Scalars['String']['input']>
  caller_not_eq?: InputMaybe<Scalars['String']['input']>
  caller_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  caller_not_startsWith?: InputMaybe<Scalars['String']['input']>
  caller_startsWith?: InputMaybe<Scalars['String']['input']>
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
  nft?: InputMaybe<NftEntityWhereInput>
  nft_isNull?: InputMaybe<Scalars['Boolean']['input']>
  value_contains?: InputMaybe<Scalars['String']['input']>
  value_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  value_endsWith?: InputMaybe<Scalars['String']['input']>
  value_eq?: InputMaybe<Scalars['String']['input']>
  value_gt?: InputMaybe<Scalars['String']['input']>
  value_gte?: InputMaybe<Scalars['String']['input']>
  value_in?: InputMaybe<Array<Scalars['String']['input']>>
  value_isNull?: InputMaybe<Scalars['Boolean']['input']>
  value_lt?: InputMaybe<Scalars['String']['input']>
  value_lte?: InputMaybe<Scalars['String']['input']>
  value_not_contains?: InputMaybe<Scalars['String']['input']>
  value_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  value_not_endsWith?: InputMaybe<Scalars['String']['input']>
  value_not_eq?: InputMaybe<Scalars['String']['input']>
  value_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  value_not_startsWith?: InputMaybe<Scalars['String']['input']>
  value_startsWith?: InputMaybe<Scalars['String']['input']>
  version_contains?: InputMaybe<Scalars['String']['input']>
  version_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  version_endsWith?: InputMaybe<Scalars['String']['input']>
  version_eq?: InputMaybe<Scalars['String']['input']>
  version_gt?: InputMaybe<Scalars['String']['input']>
  version_gte?: InputMaybe<Scalars['String']['input']>
  version_in?: InputMaybe<Array<Scalars['String']['input']>>
  version_isNull?: InputMaybe<Scalars['Boolean']['input']>
  version_lt?: InputMaybe<Scalars['String']['input']>
  version_lte?: InputMaybe<Scalars['String']['input']>
  version_not_contains?: InputMaybe<Scalars['String']['input']>
  version_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  version_not_endsWith?: InputMaybe<Scalars['String']['input']>
  version_not_eq?: InputMaybe<Scalars['String']['input']>
  version_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  version_not_startsWith?: InputMaybe<Scalars['String']['input']>
  version_startsWith?: InputMaybe<Scalars['String']['input']>
}

export type EmotesConnection = {
  __typename?: 'EmotesConnection'
  edges: Array<EmoteEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type Event = EventType & {
  __typename?: 'Event'
  blockNumber?: Maybe<Scalars['BigInt']['output']>
  caller: Scalars['String']['output']
  currentOwner: Scalars['String']['output']
  id: Scalars['String']['output']
  interaction: Interaction
  meta: Scalars['String']['output']
  nft: NftEntity
  timestamp: Scalars['DateTime']['output']
  version: Scalars['String']['output']
}

export type EventEdge = {
  __typename?: 'EventEdge'
  cursor: Scalars['String']['output']
  node: Event
}

export type EventEntity = {
  __typename?: 'EventEntity'
  count?: Maybe<Scalars['Float']['output']>
  date: Scalars['DateTime']['output']
  max?: Maybe<Scalars['BigInt']['output']>
}

export enum EventOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  CallerAsc = 'caller_ASC',
  CallerDesc = 'caller_DESC',
  CurrentOwnerAsc = 'currentOwner_ASC',
  CurrentOwnerDesc = 'currentOwner_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  InteractionAsc = 'interaction_ASC',
  InteractionDesc = 'interaction_DESC',
  MetaAsc = 'meta_ASC',
  MetaDesc = 'meta_DESC',
  NftBlockNumberAsc = 'nft_blockNumber_ASC',
  NftBlockNumberDesc = 'nft_blockNumber_DESC',
  NftBurnedAsc = 'nft_burned_ASC',
  NftBurnedDesc = 'nft_burned_DESC',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCurrentOwnerAsc = 'nft_currentOwner_ASC',
  NftCurrentOwnerDesc = 'nft_currentOwner_DESC',
  NftEmoteCountAsc = 'nft_emoteCount_ASC',
  NftEmoteCountDesc = 'nft_emoteCount_DESC',
  NftHashAsc = 'nft_hash_ASC',
  NftHashDesc = 'nft_hash_DESC',
  NftIdAsc = 'nft_id_ASC',
  NftIdDesc = 'nft_id_DESC',
  NftImageAsc = 'nft_image_ASC',
  NftImageDesc = 'nft_image_DESC',
  NftInstanceAsc = 'nft_instance_ASC',
  NftInstanceDesc = 'nft_instance_DESC',
  NftIssuerAsc = 'nft_issuer_ASC',
  NftIssuerDesc = 'nft_issuer_DESC',
  NftMediaAsc = 'nft_media_ASC',
  NftMediaDesc = 'nft_media_DESC',
  NftMetadataAsc = 'nft_metadata_ASC',
  NftMetadataDesc = 'nft_metadata_DESC',
  NftNameAsc = 'nft_name_ASC',
  NftNameDesc = 'nft_name_DESC',
  NftPendingAsc = 'nft_pending_ASC',
  NftPendingDesc = 'nft_pending_DESC',
  NftPriceAsc = 'nft_price_ASC',
  NftPriceDesc = 'nft_price_DESC',
  NftRecipientAsc = 'nft_recipient_ASC',
  NftRecipientDesc = 'nft_recipient_DESC',
  NftRoyaltyAsc = 'nft_royalty_ASC',
  NftRoyaltyDesc = 'nft_royalty_DESC',
  NftSnAsc = 'nft_sn_ASC',
  NftSnDesc = 'nft_sn_DESC',
  NftTransferableAsc = 'nft_transferable_ASC',
  NftTransferableDesc = 'nft_transferable_DESC',
  NftUpdatedAtAsc = 'nft_updatedAt_ASC',
  NftUpdatedAtDesc = 'nft_updatedAt_DESC',
  NftVersionAsc = 'nft_version_ASC',
  NftVersionDesc = 'nft_version_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  VersionAsc = 'version_ASC',
  VersionDesc = 'version_DESC',
}

export type EventType = {
  blockNumber?: Maybe<Scalars['BigInt']['output']>
  caller: Scalars['String']['output']
  currentOwner?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  interaction: Interaction
  meta: Scalars['String']['output']
  timestamp: Scalars['DateTime']['output']
  version: Scalars['String']['output']
}

export type EventWhereInput = {
  AND?: InputMaybe<Array<EventWhereInput>>
  OR?: InputMaybe<Array<EventWhereInput>>
  blockNumber_eq?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  caller_contains?: InputMaybe<Scalars['String']['input']>
  caller_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  caller_endsWith?: InputMaybe<Scalars['String']['input']>
  caller_eq?: InputMaybe<Scalars['String']['input']>
  caller_gt?: InputMaybe<Scalars['String']['input']>
  caller_gte?: InputMaybe<Scalars['String']['input']>
  caller_in?: InputMaybe<Array<Scalars['String']['input']>>
  caller_isNull?: InputMaybe<Scalars['Boolean']['input']>
  caller_lt?: InputMaybe<Scalars['String']['input']>
  caller_lte?: InputMaybe<Scalars['String']['input']>
  caller_not_contains?: InputMaybe<Scalars['String']['input']>
  caller_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  caller_not_endsWith?: InputMaybe<Scalars['String']['input']>
  caller_not_eq?: InputMaybe<Scalars['String']['input']>
  caller_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  caller_not_startsWith?: InputMaybe<Scalars['String']['input']>
  caller_startsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_contains?: InputMaybe<Scalars['String']['input']>
  currentOwner_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  currentOwner_endsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_eq?: InputMaybe<Scalars['String']['input']>
  currentOwner_gt?: InputMaybe<Scalars['String']['input']>
  currentOwner_gte?: InputMaybe<Scalars['String']['input']>
  currentOwner_in?: InputMaybe<Array<Scalars['String']['input']>>
  currentOwner_isNull?: InputMaybe<Scalars['Boolean']['input']>
  currentOwner_lt?: InputMaybe<Scalars['String']['input']>
  currentOwner_lte?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_contains?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_endsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_eq?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  currentOwner_not_startsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_startsWith?: InputMaybe<Scalars['String']['input']>
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
  interaction_eq?: InputMaybe<Interaction>
  interaction_in?: InputMaybe<Array<Interaction>>
  interaction_isNull?: InputMaybe<Scalars['Boolean']['input']>
  interaction_not_eq?: InputMaybe<Interaction>
  interaction_not_in?: InputMaybe<Array<Interaction>>
  meta_contains?: InputMaybe<Scalars['String']['input']>
  meta_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  meta_endsWith?: InputMaybe<Scalars['String']['input']>
  meta_eq?: InputMaybe<Scalars['String']['input']>
  meta_gt?: InputMaybe<Scalars['String']['input']>
  meta_gte?: InputMaybe<Scalars['String']['input']>
  meta_in?: InputMaybe<Array<Scalars['String']['input']>>
  meta_isNull?: InputMaybe<Scalars['Boolean']['input']>
  meta_lt?: InputMaybe<Scalars['String']['input']>
  meta_lte?: InputMaybe<Scalars['String']['input']>
  meta_not_contains?: InputMaybe<Scalars['String']['input']>
  meta_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  meta_not_endsWith?: InputMaybe<Scalars['String']['input']>
  meta_not_eq?: InputMaybe<Scalars['String']['input']>
  meta_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  meta_not_startsWith?: InputMaybe<Scalars['String']['input']>
  meta_startsWith?: InputMaybe<Scalars['String']['input']>
  nft?: InputMaybe<NftEntityWhereInput>
  nft_isNull?: InputMaybe<Scalars['Boolean']['input']>
  timestamp_eq?: InputMaybe<Scalars['DateTime']['input']>
  timestamp_gt?: InputMaybe<Scalars['DateTime']['input']>
  timestamp_gte?: InputMaybe<Scalars['DateTime']['input']>
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  timestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>
  timestamp_lt?: InputMaybe<Scalars['DateTime']['input']>
  timestamp_lte?: InputMaybe<Scalars['DateTime']['input']>
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  version_contains?: InputMaybe<Scalars['String']['input']>
  version_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  version_endsWith?: InputMaybe<Scalars['String']['input']>
  version_eq?: InputMaybe<Scalars['String']['input']>
  version_gt?: InputMaybe<Scalars['String']['input']>
  version_gte?: InputMaybe<Scalars['String']['input']>
  version_in?: InputMaybe<Array<Scalars['String']['input']>>
  version_isNull?: InputMaybe<Scalars['Boolean']['input']>
  version_lt?: InputMaybe<Scalars['String']['input']>
  version_lte?: InputMaybe<Scalars['String']['input']>
  version_not_contains?: InputMaybe<Scalars['String']['input']>
  version_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  version_not_endsWith?: InputMaybe<Scalars['String']['input']>
  version_not_eq?: InputMaybe<Scalars['String']['input']>
  version_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  version_not_startsWith?: InputMaybe<Scalars['String']['input']>
  version_startsWith?: InputMaybe<Scalars['String']['input']>
}

export type EventsConnection = {
  __typename?: 'EventsConnection'
  edges: Array<EventEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type Hello = {
  __typename?: 'Hello'
  greeting: Scalars['String']['output']
}

export type HistoryEntity = {
  __typename?: 'HistoryEntity'
  count: Scalars['Float']['output']
  date: Scalars['DateTime']['output']
  id: Scalars['String']['output']
}

export type HotNftEntity = {
  __typename?: 'HotNFTEntity'
  collectionId: Scalars['String']['output']
  collectionName: Scalars['String']['output']
  meta?: Maybe<Scalars['String']['output']>
  timestamp: Scalars['DateTime']['output']
}

export enum Interaction {
  Accept = 'ACCEPT',
  Base = 'BASE',
  Burn = 'BURN',
  Buy = 'BUY',
  Changeissuer = 'CHANGEISSUER',
  Create = 'CREATE',
  Destroy = 'DESTROY',
  Emote = 'EMOTE',
  Equip = 'EQUIP',
  Equippable = 'EQUIPPABLE',
  List = 'LIST',
  Lock = 'LOCK',
  Mint = 'MINT',
  PayRoyalty = 'PAY_ROYALTY',
  Resadd = 'RESADD',
  Royalty = 'ROYALTY',
  Send = 'SEND',
  Setpriority = 'SETPRIORITY',
  Setproperty = 'SETPROPERTY',
  Themeadd = 'THEMEADD',
  Unlist = 'UNLIST',
}

export type LastEventEntity = {
  __typename?: 'LastEventEntity'
  animationUrl?: Maybe<Scalars['String']['output']>
  collectionId: Scalars['String']['output']
  collectionName: Scalars['String']['output']
  currentOwner: Scalars['String']['output']
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  issuer: Scalars['String']['output']
  metadata: Scalars['String']['output']
  name: Scalars['String']['output']
  resources?: Maybe<Array<Resource>>
  timestamp: Scalars['DateTime']['output']
  value: Scalars['String']['output']
}

export type MetadataEntitiesConnection = {
  __typename?: 'MetadataEntitiesConnection'
  edges: Array<MetadataEntityEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type MetadataEntity = {
  __typename?: 'MetadataEntity'
  animationUrl?: Maybe<Scalars['String']['output']>
  attributes?: Maybe<Array<Attribute>>
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  type?: Maybe<Scalars['String']['output']>
}

export type MetadataEntityEdge = {
  __typename?: 'MetadataEntityEdge'
  cursor: Scalars['String']['output']
  node: MetadataEntity
}

export enum MetadataEntityOrderByInput {
  AnimationUrlAsc = 'animationUrl_ASC',
  AnimationUrlDesc = 'animationUrl_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

export type MetadataEntityWhereInput = {
  AND?: InputMaybe<Array<MetadataEntityWhereInput>>
  OR?: InputMaybe<Array<MetadataEntityWhereInput>>
  animationUrl_contains?: InputMaybe<Scalars['String']['input']>
  animationUrl_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  animationUrl_endsWith?: InputMaybe<Scalars['String']['input']>
  animationUrl_eq?: InputMaybe<Scalars['String']['input']>
  animationUrl_gt?: InputMaybe<Scalars['String']['input']>
  animationUrl_gte?: InputMaybe<Scalars['String']['input']>
  animationUrl_in?: InputMaybe<Array<Scalars['String']['input']>>
  animationUrl_isNull?: InputMaybe<Scalars['Boolean']['input']>
  animationUrl_lt?: InputMaybe<Scalars['String']['input']>
  animationUrl_lte?: InputMaybe<Scalars['String']['input']>
  animationUrl_not_contains?: InputMaybe<Scalars['String']['input']>
  animationUrl_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  animationUrl_not_endsWith?: InputMaybe<Scalars['String']['input']>
  animationUrl_not_eq?: InputMaybe<Scalars['String']['input']>
  animationUrl_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  animationUrl_not_startsWith?: InputMaybe<Scalars['String']['input']>
  animationUrl_startsWith?: InputMaybe<Scalars['String']['input']>
  attributes_isNull?: InputMaybe<Scalars['Boolean']['input']>
  description_contains?: InputMaybe<Scalars['String']['input']>
  description_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  description_endsWith?: InputMaybe<Scalars['String']['input']>
  description_eq?: InputMaybe<Scalars['String']['input']>
  description_gt?: InputMaybe<Scalars['String']['input']>
  description_gte?: InputMaybe<Scalars['String']['input']>
  description_in?: InputMaybe<Array<Scalars['String']['input']>>
  description_isNull?: InputMaybe<Scalars['Boolean']['input']>
  description_lt?: InputMaybe<Scalars['String']['input']>
  description_lte?: InputMaybe<Scalars['String']['input']>
  description_not_contains?: InputMaybe<Scalars['String']['input']>
  description_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  description_not_endsWith?: InputMaybe<Scalars['String']['input']>
  description_not_eq?: InputMaybe<Scalars['String']['input']>
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  description_not_startsWith?: InputMaybe<Scalars['String']['input']>
  description_startsWith?: InputMaybe<Scalars['String']['input']>
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
  image_contains?: InputMaybe<Scalars['String']['input']>
  image_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  image_endsWith?: InputMaybe<Scalars['String']['input']>
  image_eq?: InputMaybe<Scalars['String']['input']>
  image_gt?: InputMaybe<Scalars['String']['input']>
  image_gte?: InputMaybe<Scalars['String']['input']>
  image_in?: InputMaybe<Array<Scalars['String']['input']>>
  image_isNull?: InputMaybe<Scalars['Boolean']['input']>
  image_lt?: InputMaybe<Scalars['String']['input']>
  image_lte?: InputMaybe<Scalars['String']['input']>
  image_not_contains?: InputMaybe<Scalars['String']['input']>
  image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  image_not_endsWith?: InputMaybe<Scalars['String']['input']>
  image_not_eq?: InputMaybe<Scalars['String']['input']>
  image_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  image_not_startsWith?: InputMaybe<Scalars['String']['input']>
  image_startsWith?: InputMaybe<Scalars['String']['input']>
  name_contains?: InputMaybe<Scalars['String']['input']>
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  name_endsWith?: InputMaybe<Scalars['String']['input']>
  name_eq?: InputMaybe<Scalars['String']['input']>
  name_gt?: InputMaybe<Scalars['String']['input']>
  name_gte?: InputMaybe<Scalars['String']['input']>
  name_in?: InputMaybe<Array<Scalars['String']['input']>>
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>
  name_lt?: InputMaybe<Scalars['String']['input']>
  name_lte?: InputMaybe<Scalars['String']['input']>
  name_not_contains?: InputMaybe<Scalars['String']['input']>
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>
  name_not_eq?: InputMaybe<Scalars['String']['input']>
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>
  name_startsWith?: InputMaybe<Scalars['String']['input']>
  type_contains?: InputMaybe<Scalars['String']['input']>
  type_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  type_endsWith?: InputMaybe<Scalars['String']['input']>
  type_eq?: InputMaybe<Scalars['String']['input']>
  type_gt?: InputMaybe<Scalars['String']['input']>
  type_gte?: InputMaybe<Scalars['String']['input']>
  type_in?: InputMaybe<Array<Scalars['String']['input']>>
  type_isNull?: InputMaybe<Scalars['Boolean']['input']>
  type_lt?: InputMaybe<Scalars['String']['input']>
  type_lte?: InputMaybe<Scalars['String']['input']>
  type_not_contains?: InputMaybe<Scalars['String']['input']>
  type_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  type_not_endsWith?: InputMaybe<Scalars['String']['input']>
  type_not_eq?: InputMaybe<Scalars['String']['input']>
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  type_not_startsWith?: InputMaybe<Scalars['String']['input']>
  type_startsWith?: InputMaybe<Scalars['String']['input']>
}

export type NftEntitiesConnection = {
  __typename?: 'NFTEntitiesConnection'
  edges: Array<NftEntityEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type NftEntity = {
  __typename?: 'NFTEntity'
  blockNumber?: Maybe<Scalars['BigInt']['output']>
  burned: Scalars['Boolean']['output']
  collection: CollectionEntity
  createdAt: Scalars['DateTime']['output']
  currentOwner?: Maybe<Scalars['String']['output']>
  emoteCount: Scalars['Int']['output']
  emotes: Array<Emote>
  events: Array<Event>
  hash: Scalars['String']['output']
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  instance?: Maybe<Scalars['String']['output']>
  issuer?: Maybe<Scalars['String']['output']>
  media?: Maybe<Scalars['String']['output']>
  meta?: Maybe<MetadataEntity>
  metadata?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  parent?: Maybe<NftEntity>
  pending: Scalars['Boolean']['output']
  price: Scalars['BigInt']['output']
  recipient?: Maybe<Scalars['String']['output']>
  resources: Array<Resource>
  royalty?: Maybe<Scalars['Float']['output']>
  sn?: Maybe<Scalars['String']['output']>
  transferable?: Maybe<Scalars['Int']['output']>
  updatedAt: Scalars['DateTime']['output']
  version: Scalars['String']['output']
}

export type NftEntityEmotesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<EmoteOrderByInput>>
  where?: InputMaybe<EmoteWhereInput>
}

export type NftEntityEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<EventOrderByInput>>
  where?: InputMaybe<EventWhereInput>
}

export type NftEntityResourcesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ResourceOrderByInput>>
  where?: InputMaybe<ResourceWhereInput>
}

export type NftEntityEdge = {
  __typename?: 'NFTEntityEdge'
  cursor: Scalars['String']['output']
  node: NftEntity
}

export enum NftEntityOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  BurnedAsc = 'burned_ASC',
  BurnedDesc = 'burned_DESC',
  CollectionBlockNumberAsc = 'collection_blockNumber_ASC',
  CollectionBlockNumberDesc = 'collection_blockNumber_DESC',
  CollectionCreatedAtAsc = 'collection_createdAt_ASC',
  CollectionCreatedAtDesc = 'collection_createdAt_DESC',
  CollectionCurrentOwnerAsc = 'collection_currentOwner_ASC',
  CollectionCurrentOwnerDesc = 'collection_currentOwner_DESC',
  CollectionHashAsc = 'collection_hash_ASC',
  CollectionHashDesc = 'collection_hash_DESC',
  CollectionIdAsc = 'collection_id_ASC',
  CollectionIdDesc = 'collection_id_DESC',
  CollectionImageAsc = 'collection_image_ASC',
  CollectionImageDesc = 'collection_image_DESC',
  CollectionIssuerAsc = 'collection_issuer_ASC',
  CollectionIssuerDesc = 'collection_issuer_DESC',
  CollectionMaxAsc = 'collection_max_ASC',
  CollectionMaxDesc = 'collection_max_DESC',
  CollectionMediaAsc = 'collection_media_ASC',
  CollectionMediaDesc = 'collection_media_DESC',
  CollectionMetadataAsc = 'collection_metadata_ASC',
  CollectionMetadataDesc = 'collection_metadata_DESC',
  CollectionNameAsc = 'collection_name_ASC',
  CollectionNameDesc = 'collection_name_DESC',
  CollectionNftCountAsc = 'collection_nftCount_ASC',
  CollectionNftCountDesc = 'collection_nftCount_DESC',
  CollectionSupplyAsc = 'collection_supply_ASC',
  CollectionSupplyDesc = 'collection_supply_DESC',
  CollectionSymbolAsc = 'collection_symbol_ASC',
  CollectionSymbolDesc = 'collection_symbol_DESC',
  CollectionUpdatedAtAsc = 'collection_updatedAt_ASC',
  CollectionUpdatedAtDesc = 'collection_updatedAt_DESC',
  CollectionVersionAsc = 'collection_version_ASC',
  CollectionVersionDesc = 'collection_version_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CurrentOwnerAsc = 'currentOwner_ASC',
  CurrentOwnerDesc = 'currentOwner_DESC',
  EmoteCountAsc = 'emoteCount_ASC',
  EmoteCountDesc = 'emoteCount_DESC',
  HashAsc = 'hash_ASC',
  HashDesc = 'hash_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  InstanceAsc = 'instance_ASC',
  InstanceDesc = 'instance_DESC',
  IssuerAsc = 'issuer_ASC',
  IssuerDesc = 'issuer_DESC',
  MediaAsc = 'media_ASC',
  MediaDesc = 'media_DESC',
  MetaAnimationUrlAsc = 'meta_animationUrl_ASC',
  MetaAnimationUrlDesc = 'meta_animationUrl_DESC',
  MetaDescriptionAsc = 'meta_description_ASC',
  MetaDescriptionDesc = 'meta_description_DESC',
  MetaIdAsc = 'meta_id_ASC',
  MetaIdDesc = 'meta_id_DESC',
  MetaImageAsc = 'meta_image_ASC',
  MetaImageDesc = 'meta_image_DESC',
  MetaNameAsc = 'meta_name_ASC',
  MetaNameDesc = 'meta_name_DESC',
  MetaTypeAsc = 'meta_type_ASC',
  MetaTypeDesc = 'meta_type_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  ParentBlockNumberAsc = 'parent_blockNumber_ASC',
  ParentBlockNumberDesc = 'parent_blockNumber_DESC',
  ParentBurnedAsc = 'parent_burned_ASC',
  ParentBurnedDesc = 'parent_burned_DESC',
  ParentCreatedAtAsc = 'parent_createdAt_ASC',
  ParentCreatedAtDesc = 'parent_createdAt_DESC',
  ParentCurrentOwnerAsc = 'parent_currentOwner_ASC',
  ParentCurrentOwnerDesc = 'parent_currentOwner_DESC',
  ParentEmoteCountAsc = 'parent_emoteCount_ASC',
  ParentEmoteCountDesc = 'parent_emoteCount_DESC',
  ParentHashAsc = 'parent_hash_ASC',
  ParentHashDesc = 'parent_hash_DESC',
  ParentIdAsc = 'parent_id_ASC',
  ParentIdDesc = 'parent_id_DESC',
  ParentImageAsc = 'parent_image_ASC',
  ParentImageDesc = 'parent_image_DESC',
  ParentInstanceAsc = 'parent_instance_ASC',
  ParentInstanceDesc = 'parent_instance_DESC',
  ParentIssuerAsc = 'parent_issuer_ASC',
  ParentIssuerDesc = 'parent_issuer_DESC',
  ParentMediaAsc = 'parent_media_ASC',
  ParentMediaDesc = 'parent_media_DESC',
  ParentMetadataAsc = 'parent_metadata_ASC',
  ParentMetadataDesc = 'parent_metadata_DESC',
  ParentNameAsc = 'parent_name_ASC',
  ParentNameDesc = 'parent_name_DESC',
  ParentPendingAsc = 'parent_pending_ASC',
  ParentPendingDesc = 'parent_pending_DESC',
  ParentPriceAsc = 'parent_price_ASC',
  ParentPriceDesc = 'parent_price_DESC',
  ParentRecipientAsc = 'parent_recipient_ASC',
  ParentRecipientDesc = 'parent_recipient_DESC',
  ParentRoyaltyAsc = 'parent_royalty_ASC',
  ParentRoyaltyDesc = 'parent_royalty_DESC',
  ParentSnAsc = 'parent_sn_ASC',
  ParentSnDesc = 'parent_sn_DESC',
  ParentTransferableAsc = 'parent_transferable_ASC',
  ParentTransferableDesc = 'parent_transferable_DESC',
  ParentUpdatedAtAsc = 'parent_updatedAt_ASC',
  ParentUpdatedAtDesc = 'parent_updatedAt_DESC',
  ParentVersionAsc = 'parent_version_ASC',
  ParentVersionDesc = 'parent_version_DESC',
  PendingAsc = 'pending_ASC',
  PendingDesc = 'pending_DESC',
  PriceAsc = 'price_ASC',
  PriceDesc = 'price_DESC',
  RecipientAsc = 'recipient_ASC',
  RecipientDesc = 'recipient_DESC',
  RoyaltyAsc = 'royalty_ASC',
  RoyaltyDesc = 'royalty_DESC',
  SnAsc = 'sn_ASC',
  SnDesc = 'sn_DESC',
  TransferableAsc = 'transferable_ASC',
  TransferableDesc = 'transferable_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  VersionAsc = 'version_ASC',
  VersionDesc = 'version_DESC',
}

export type NftEntityWhereInput = {
  AND?: InputMaybe<Array<NftEntityWhereInput>>
  OR?: InputMaybe<Array<NftEntityWhereInput>>
  blockNumber_eq?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  burned_eq?: InputMaybe<Scalars['Boolean']['input']>
  burned_isNull?: InputMaybe<Scalars['Boolean']['input']>
  burned_not_eq?: InputMaybe<Scalars['Boolean']['input']>
  collection?: InputMaybe<CollectionEntityWhereInput>
  collection_isNull?: InputMaybe<Scalars['Boolean']['input']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  currentOwner_contains?: InputMaybe<Scalars['String']['input']>
  currentOwner_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  currentOwner_endsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_eq?: InputMaybe<Scalars['String']['input']>
  currentOwner_gt?: InputMaybe<Scalars['String']['input']>
  currentOwner_gte?: InputMaybe<Scalars['String']['input']>
  currentOwner_in?: InputMaybe<Array<Scalars['String']['input']>>
  currentOwner_isNull?: InputMaybe<Scalars['Boolean']['input']>
  currentOwner_lt?: InputMaybe<Scalars['String']['input']>
  currentOwner_lte?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_contains?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_endsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_eq?: InputMaybe<Scalars['String']['input']>
  currentOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  currentOwner_not_startsWith?: InputMaybe<Scalars['String']['input']>
  currentOwner_startsWith?: InputMaybe<Scalars['String']['input']>
  emoteCount_eq?: InputMaybe<Scalars['Int']['input']>
  emoteCount_gt?: InputMaybe<Scalars['Int']['input']>
  emoteCount_gte?: InputMaybe<Scalars['Int']['input']>
  emoteCount_in?: InputMaybe<Array<Scalars['Int']['input']>>
  emoteCount_isNull?: InputMaybe<Scalars['Boolean']['input']>
  emoteCount_lt?: InputMaybe<Scalars['Int']['input']>
  emoteCount_lte?: InputMaybe<Scalars['Int']['input']>
  emoteCount_not_eq?: InputMaybe<Scalars['Int']['input']>
  emoteCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  emotes_every?: InputMaybe<EmoteWhereInput>
  emotes_none?: InputMaybe<EmoteWhereInput>
  emotes_some?: InputMaybe<EmoteWhereInput>
  events_every?: InputMaybe<EventWhereInput>
  events_none?: InputMaybe<EventWhereInput>
  events_some?: InputMaybe<EventWhereInput>
  hash_contains?: InputMaybe<Scalars['String']['input']>
  hash_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  hash_endsWith?: InputMaybe<Scalars['String']['input']>
  hash_eq?: InputMaybe<Scalars['String']['input']>
  hash_gt?: InputMaybe<Scalars['String']['input']>
  hash_gte?: InputMaybe<Scalars['String']['input']>
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>
  hash_isNull?: InputMaybe<Scalars['Boolean']['input']>
  hash_lt?: InputMaybe<Scalars['String']['input']>
  hash_lte?: InputMaybe<Scalars['String']['input']>
  hash_not_contains?: InputMaybe<Scalars['String']['input']>
  hash_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  hash_not_endsWith?: InputMaybe<Scalars['String']['input']>
  hash_not_eq?: InputMaybe<Scalars['String']['input']>
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  hash_not_startsWith?: InputMaybe<Scalars['String']['input']>
  hash_startsWith?: InputMaybe<Scalars['String']['input']>
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
  image_contains?: InputMaybe<Scalars['String']['input']>
  image_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  image_endsWith?: InputMaybe<Scalars['String']['input']>
  image_eq?: InputMaybe<Scalars['String']['input']>
  image_gt?: InputMaybe<Scalars['String']['input']>
  image_gte?: InputMaybe<Scalars['String']['input']>
  image_in?: InputMaybe<Array<Scalars['String']['input']>>
  image_isNull?: InputMaybe<Scalars['Boolean']['input']>
  image_lt?: InputMaybe<Scalars['String']['input']>
  image_lte?: InputMaybe<Scalars['String']['input']>
  image_not_contains?: InputMaybe<Scalars['String']['input']>
  image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  image_not_endsWith?: InputMaybe<Scalars['String']['input']>
  image_not_eq?: InputMaybe<Scalars['String']['input']>
  image_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  image_not_startsWith?: InputMaybe<Scalars['String']['input']>
  image_startsWith?: InputMaybe<Scalars['String']['input']>
  instance_contains?: InputMaybe<Scalars['String']['input']>
  instance_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  instance_endsWith?: InputMaybe<Scalars['String']['input']>
  instance_eq?: InputMaybe<Scalars['String']['input']>
  instance_gt?: InputMaybe<Scalars['String']['input']>
  instance_gte?: InputMaybe<Scalars['String']['input']>
  instance_in?: InputMaybe<Array<Scalars['String']['input']>>
  instance_isNull?: InputMaybe<Scalars['Boolean']['input']>
  instance_lt?: InputMaybe<Scalars['String']['input']>
  instance_lte?: InputMaybe<Scalars['String']['input']>
  instance_not_contains?: InputMaybe<Scalars['String']['input']>
  instance_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  instance_not_endsWith?: InputMaybe<Scalars['String']['input']>
  instance_not_eq?: InputMaybe<Scalars['String']['input']>
  instance_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  instance_not_startsWith?: InputMaybe<Scalars['String']['input']>
  instance_startsWith?: InputMaybe<Scalars['String']['input']>
  issuer_contains?: InputMaybe<Scalars['String']['input']>
  issuer_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  issuer_endsWith?: InputMaybe<Scalars['String']['input']>
  issuer_eq?: InputMaybe<Scalars['String']['input']>
  issuer_gt?: InputMaybe<Scalars['String']['input']>
  issuer_gte?: InputMaybe<Scalars['String']['input']>
  issuer_in?: InputMaybe<Array<Scalars['String']['input']>>
  issuer_isNull?: InputMaybe<Scalars['Boolean']['input']>
  issuer_lt?: InputMaybe<Scalars['String']['input']>
  issuer_lte?: InputMaybe<Scalars['String']['input']>
  issuer_not_contains?: InputMaybe<Scalars['String']['input']>
  issuer_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  issuer_not_endsWith?: InputMaybe<Scalars['String']['input']>
  issuer_not_eq?: InputMaybe<Scalars['String']['input']>
  issuer_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  issuer_not_startsWith?: InputMaybe<Scalars['String']['input']>
  issuer_startsWith?: InputMaybe<Scalars['String']['input']>
  media_contains?: InputMaybe<Scalars['String']['input']>
  media_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  media_endsWith?: InputMaybe<Scalars['String']['input']>
  media_eq?: InputMaybe<Scalars['String']['input']>
  media_gt?: InputMaybe<Scalars['String']['input']>
  media_gte?: InputMaybe<Scalars['String']['input']>
  media_in?: InputMaybe<Array<Scalars['String']['input']>>
  media_isNull?: InputMaybe<Scalars['Boolean']['input']>
  media_lt?: InputMaybe<Scalars['String']['input']>
  media_lte?: InputMaybe<Scalars['String']['input']>
  media_not_contains?: InputMaybe<Scalars['String']['input']>
  media_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  media_not_endsWith?: InputMaybe<Scalars['String']['input']>
  media_not_eq?: InputMaybe<Scalars['String']['input']>
  media_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  media_not_startsWith?: InputMaybe<Scalars['String']['input']>
  media_startsWith?: InputMaybe<Scalars['String']['input']>
  meta?: InputMaybe<MetadataEntityWhereInput>
  meta_isNull?: InputMaybe<Scalars['Boolean']['input']>
  metadata_contains?: InputMaybe<Scalars['String']['input']>
  metadata_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  metadata_endsWith?: InputMaybe<Scalars['String']['input']>
  metadata_eq?: InputMaybe<Scalars['String']['input']>
  metadata_gt?: InputMaybe<Scalars['String']['input']>
  metadata_gte?: InputMaybe<Scalars['String']['input']>
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>
  metadata_isNull?: InputMaybe<Scalars['Boolean']['input']>
  metadata_lt?: InputMaybe<Scalars['String']['input']>
  metadata_lte?: InputMaybe<Scalars['String']['input']>
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>
  metadata_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  metadata_not_endsWith?: InputMaybe<Scalars['String']['input']>
  metadata_not_eq?: InputMaybe<Scalars['String']['input']>
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  metadata_not_startsWith?: InputMaybe<Scalars['String']['input']>
  metadata_startsWith?: InputMaybe<Scalars['String']['input']>
  name_contains?: InputMaybe<Scalars['String']['input']>
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  name_endsWith?: InputMaybe<Scalars['String']['input']>
  name_eq?: InputMaybe<Scalars['String']['input']>
  name_gt?: InputMaybe<Scalars['String']['input']>
  name_gte?: InputMaybe<Scalars['String']['input']>
  name_in?: InputMaybe<Array<Scalars['String']['input']>>
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>
  name_lt?: InputMaybe<Scalars['String']['input']>
  name_lte?: InputMaybe<Scalars['String']['input']>
  name_not_contains?: InputMaybe<Scalars['String']['input']>
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>
  name_not_eq?: InputMaybe<Scalars['String']['input']>
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>
  name_startsWith?: InputMaybe<Scalars['String']['input']>
  parent?: InputMaybe<NftEntityWhereInput>
  parent_isNull?: InputMaybe<Scalars['Boolean']['input']>
  pending_eq?: InputMaybe<Scalars['Boolean']['input']>
  pending_isNull?: InputMaybe<Scalars['Boolean']['input']>
  pending_not_eq?: InputMaybe<Scalars['Boolean']['input']>
  price_eq?: InputMaybe<Scalars['BigInt']['input']>
  price_gt?: InputMaybe<Scalars['BigInt']['input']>
  price_gte?: InputMaybe<Scalars['BigInt']['input']>
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  price_isNull?: InputMaybe<Scalars['Boolean']['input']>
  price_lt?: InputMaybe<Scalars['BigInt']['input']>
  price_lte?: InputMaybe<Scalars['BigInt']['input']>
  price_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  recipient_contains?: InputMaybe<Scalars['String']['input']>
  recipient_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  recipient_endsWith?: InputMaybe<Scalars['String']['input']>
  recipient_eq?: InputMaybe<Scalars['String']['input']>
  recipient_gt?: InputMaybe<Scalars['String']['input']>
  recipient_gte?: InputMaybe<Scalars['String']['input']>
  recipient_in?: InputMaybe<Array<Scalars['String']['input']>>
  recipient_isNull?: InputMaybe<Scalars['Boolean']['input']>
  recipient_lt?: InputMaybe<Scalars['String']['input']>
  recipient_lte?: InputMaybe<Scalars['String']['input']>
  recipient_not_contains?: InputMaybe<Scalars['String']['input']>
  recipient_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  recipient_not_endsWith?: InputMaybe<Scalars['String']['input']>
  recipient_not_eq?: InputMaybe<Scalars['String']['input']>
  recipient_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  recipient_not_startsWith?: InputMaybe<Scalars['String']['input']>
  recipient_startsWith?: InputMaybe<Scalars['String']['input']>
  resources_every?: InputMaybe<ResourceWhereInput>
  resources_none?: InputMaybe<ResourceWhereInput>
  resources_some?: InputMaybe<ResourceWhereInput>
  royalty_eq?: InputMaybe<Scalars['Float']['input']>
  royalty_gt?: InputMaybe<Scalars['Float']['input']>
  royalty_gte?: InputMaybe<Scalars['Float']['input']>
  royalty_in?: InputMaybe<Array<Scalars['Float']['input']>>
  royalty_isNull?: InputMaybe<Scalars['Boolean']['input']>
  royalty_lt?: InputMaybe<Scalars['Float']['input']>
  royalty_lte?: InputMaybe<Scalars['Float']['input']>
  royalty_not_eq?: InputMaybe<Scalars['Float']['input']>
  royalty_not_in?: InputMaybe<Array<Scalars['Float']['input']>>
  sn_contains?: InputMaybe<Scalars['String']['input']>
  sn_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  sn_endsWith?: InputMaybe<Scalars['String']['input']>
  sn_eq?: InputMaybe<Scalars['String']['input']>
  sn_gt?: InputMaybe<Scalars['String']['input']>
  sn_gte?: InputMaybe<Scalars['String']['input']>
  sn_in?: InputMaybe<Array<Scalars['String']['input']>>
  sn_isNull?: InputMaybe<Scalars['Boolean']['input']>
  sn_lt?: InputMaybe<Scalars['String']['input']>
  sn_lte?: InputMaybe<Scalars['String']['input']>
  sn_not_contains?: InputMaybe<Scalars['String']['input']>
  sn_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  sn_not_endsWith?: InputMaybe<Scalars['String']['input']>
  sn_not_eq?: InputMaybe<Scalars['String']['input']>
  sn_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  sn_not_startsWith?: InputMaybe<Scalars['String']['input']>
  sn_startsWith?: InputMaybe<Scalars['String']['input']>
  transferable_eq?: InputMaybe<Scalars['Int']['input']>
  transferable_gt?: InputMaybe<Scalars['Int']['input']>
  transferable_gte?: InputMaybe<Scalars['Int']['input']>
  transferable_in?: InputMaybe<Array<Scalars['Int']['input']>>
  transferable_isNull?: InputMaybe<Scalars['Boolean']['input']>
  transferable_lt?: InputMaybe<Scalars['Int']['input']>
  transferable_lte?: InputMaybe<Scalars['Int']['input']>
  transferable_not_eq?: InputMaybe<Scalars['Int']['input']>
  transferable_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  version_contains?: InputMaybe<Scalars['String']['input']>
  version_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  version_endsWith?: InputMaybe<Scalars['String']['input']>
  version_eq?: InputMaybe<Scalars['String']['input']>
  version_gt?: InputMaybe<Scalars['String']['input']>
  version_gte?: InputMaybe<Scalars['String']['input']>
  version_in?: InputMaybe<Array<Scalars['String']['input']>>
  version_isNull?: InputMaybe<Scalars['Boolean']['input']>
  version_lt?: InputMaybe<Scalars['String']['input']>
  version_lte?: InputMaybe<Scalars['String']['input']>
  version_not_contains?: InputMaybe<Scalars['String']['input']>
  version_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  version_not_endsWith?: InputMaybe<Scalars['String']['input']>
  version_not_eq?: InputMaybe<Scalars['String']['input']>
  version_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  version_not_startsWith?: InputMaybe<Scalars['String']['input']>
  version_startsWith?: InputMaybe<Scalars['String']['input']>
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor: Scalars['String']['output']
  hasNextPage: Scalars['Boolean']['output']
  hasPreviousPage: Scalars['Boolean']['output']
  startCursor: Scalars['String']['output']
}

export type PassionFeedEntity = {
  __typename?: 'PassionFeedEntity'
  id: Scalars['String']['output']
}

export type Query = {
  __typename?: 'Query'
  baseById?: Maybe<Base>
  /** @deprecated Use baseById */
  baseByUniqueInput?: Maybe<Base>
  bases: Array<Base>
  basesConnection: BasesConnection
  cacheStatusById?: Maybe<CacheStatus>
  /** @deprecated Use cacheStatusById */
  cacheStatusByUniqueInput?: Maybe<CacheStatus>
  cacheStatuses: Array<CacheStatus>
  cacheStatusesConnection: CacheStatusesConnection
  collectionBuyChartById: Array<ChartEntity>
  collectionBuyEventStatsById: Array<EventEntity>
  collectionEntities: Array<CollectionEntity>
  collectionEntitiesConnection: CollectionEntitiesConnection
  collectionEntityById?: Maybe<CollectionEntity>
  /** @deprecated Use collectionEntityById */
  collectionEntityByUniqueInput?: Maybe<CollectionEntity>
  collectionListChartById: Array<ChartEntity>
  collectorById?: Maybe<Collector>
  /** @deprecated Use collectorById */
  collectorByUniqueInput?: Maybe<Collector>
  collectors: Array<Collector>
  collectorsConnection: CollectorsConnection
  emoteById?: Maybe<Emote>
  /** @deprecated Use emoteById */
  emoteByUniqueInput?: Maybe<Emote>
  emoteListByNftId: Array<EmoteCountEntity>
  emoteMapByNftId: Scalars['String']['output']
  emotes: Array<Emote>
  emotesConnection: EmotesConnection
  eventById?: Maybe<Event>
  /** @deprecated Use eventById */
  eventByUniqueInput?: Maybe<Event>
  events: Array<Event>
  eventsConnection: EventsConnection
  hello: Hello
  hotDashboard: Array<HotNftEntity>
  lastEvent: Array<LastEventEntity>
  metadataEntities: Array<MetadataEntity>
  metadataEntitiesConnection: MetadataEntitiesConnection
  metadataEntityById?: Maybe<MetadataEntity>
  /** @deprecated Use metadataEntityById */
  metadataEntityByUniqueInput?: Maybe<MetadataEntity>
  nftEntities: Array<NftEntity>
  nftEntitiesConnection: NftEntitiesConnection
  nftEntityById?: Maybe<NftEntity>
  /** @deprecated Use nftEntityById */
  nftEntityByUniqueInput?: Maybe<NftEntity>
  passionFeed: Array<PassionFeedEntity>
  resourceById?: Maybe<Resource>
  /** @deprecated Use resourceById */
  resourceByUniqueInput?: Maybe<Resource>
  resources: Array<Resource>
  resourcesConnection: ResourcesConnection
  salesFeed: Array<SaleNftEntity>
  series: Array<Series>
  seriesById?: Maybe<Series>
  /** @deprecated Use seriesById */
  seriesByUniqueInput?: Maybe<Series>
  seriesConnection: SeriesConnection
  seriesInsightBuyHistory: Array<HistoryEntity>
  seriesInsightTable: Array<SeriesEntity>
  spotlightById?: Maybe<Spotlight>
  /** @deprecated Use spotlightById */
  spotlightByUniqueInput?: Maybe<Spotlight>
  spotlightTable: Array<SpotlightEntity>
  spotlights: Array<Spotlight>
  spotlightsConnection: SpotlightsConnection
  squidStatus?: Maybe<SquidStatus>
  totalCollections: Scalars['Float']['output']
  totalTokens: Scalars['Float']['output']
}

export type QueryBaseByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryBaseByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryBasesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<BaseOrderByInput>>
  where?: InputMaybe<BaseWhereInput>
}

export type QueryBasesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<BaseOrderByInput>
  where?: InputMaybe<BaseWhereInput>
}

export type QueryCacheStatusByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryCacheStatusByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCacheStatusesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CacheStatusOrderByInput>>
  where?: InputMaybe<CacheStatusWhereInput>
}

export type QueryCacheStatusesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<CacheStatusOrderByInput>
  where?: InputMaybe<CacheStatusWhereInput>
}

export type QueryCollectionBuyChartByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryCollectionBuyEventStatsByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryCollectionEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CollectionEntityOrderByInput>>
  where?: InputMaybe<CollectionEntityWhereInput>
}

export type QueryCollectionEntitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<CollectionEntityOrderByInput>
  where?: InputMaybe<CollectionEntityWhereInput>
}

export type QueryCollectionEntityByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryCollectionEntityByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCollectionListChartByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryCollectorByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryCollectorByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCollectorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CollectorOrderByInput>>
  where?: InputMaybe<CollectorWhereInput>
}

export type QueryCollectorsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<CollectorOrderByInput>
  where?: InputMaybe<CollectorWhereInput>
}

export type QueryEmoteByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryEmoteByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryEmoteListByNftIdArgs = {
  id: Scalars['String']['input']
}

export type QueryEmoteMapByNftIdArgs = {
  id: Scalars['String']['input']
}

export type QueryEmotesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<EmoteOrderByInput>>
  where?: InputMaybe<EmoteWhereInput>
}

export type QueryEmotesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<EmoteOrderByInput>
  where?: InputMaybe<EmoteWhereInput>
}

export type QueryEventByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryEventByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<EventOrderByInput>>
  where?: InputMaybe<EventWhereInput>
}

export type QueryEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<EventOrderByInput>
  where?: InputMaybe<EventWhereInput>
}

export type QueryHotDashboardArgs = {
  dateRange?: Scalars['String']['input']
}

export type QueryLastEventArgs = {
  interaction?: InputMaybe<Scalars['String']['input']>
  limit?: InputMaybe<Scalars['Float']['input']>
  offset?: InputMaybe<Scalars['Float']['input']>
  passionAccount?: InputMaybe<Scalars['String']['input']>
}

export type QueryMetadataEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<MetadataEntityOrderByInput>>
  where?: InputMaybe<MetadataEntityWhereInput>
}

export type QueryMetadataEntitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<MetadataEntityOrderByInput>
  where?: InputMaybe<MetadataEntityWhereInput>
}

export type QueryMetadataEntityByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryMetadataEntityByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryNftEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NftEntityOrderByInput>>
  where?: InputMaybe<NftEntityWhereInput>
}

export type QueryNftEntitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<NftEntityOrderByInput>
  where?: InputMaybe<NftEntityWhereInput>
}

export type QueryNftEntityByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryNftEntityByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryPassionFeedArgs = {
  account: Scalars['String']['input']
}

export type QueryResourceByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryResourceByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryResourcesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ResourceOrderByInput>>
  where?: InputMaybe<ResourceWhereInput>
}

export type QueryResourcesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<ResourceOrderByInput>
  where?: InputMaybe<ResourceWhereInput>
}

export type QuerySeriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<SeriesOrderByInput>>
  where?: InputMaybe<SeriesWhereInput>
}

export type QuerySeriesByIdArgs = {
  id: Scalars['String']['input']
}

export type QuerySeriesByUniqueInputArgs = {
  where: WhereIdInput
}

export type QuerySeriesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<SeriesOrderByInput>
  where?: InputMaybe<SeriesWhereInput>
}

export type QuerySeriesInsightBuyHistoryArgs = {
  dateRange?: Scalars['String']['input']
  ids: Array<Scalars['String']['input']>
}

export type QuerySeriesInsightTableArgs = {
  dateRange?: Scalars['String']['input']
  limit?: InputMaybe<Scalars['Float']['input']>
  offset?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
}

export type QuerySpotlightByIdArgs = {
  id: Scalars['String']['input']
}

export type QuerySpotlightByUniqueInputArgs = {
  where: WhereIdInput
}

export type QuerySpotlightTableArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>
  offset?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
}

export type QuerySpotlightsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<SpotlightOrderByInput>>
  where?: InputMaybe<SpotlightWhereInput>
}

export type QuerySpotlightsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<SpotlightOrderByInput>
  where?: InputMaybe<SpotlightWhereInput>
}

export type Resource = {
  __typename?: 'Resource'
  id: Scalars['String']['output']
  meta?: Maybe<MetadataEntity>
  metadata?: Maybe<Scalars['String']['output']>
  nft: NftEntity
  pending: Scalars['Boolean']['output']
  priority: Scalars['Int']['output']
  slot?: Maybe<Scalars['String']['output']>
  src?: Maybe<Scalars['String']['output']>
  thumb?: Maybe<Scalars['String']['output']>
}

export type ResourceEdge = {
  __typename?: 'ResourceEdge'
  cursor: Scalars['String']['output']
  node: Resource
}

export enum ResourceOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MetaAnimationUrlAsc = 'meta_animationUrl_ASC',
  MetaAnimationUrlDesc = 'meta_animationUrl_DESC',
  MetaDescriptionAsc = 'meta_description_ASC',
  MetaDescriptionDesc = 'meta_description_DESC',
  MetaIdAsc = 'meta_id_ASC',
  MetaIdDesc = 'meta_id_DESC',
  MetaImageAsc = 'meta_image_ASC',
  MetaImageDesc = 'meta_image_DESC',
  MetaNameAsc = 'meta_name_ASC',
  MetaNameDesc = 'meta_name_DESC',
  MetaTypeAsc = 'meta_type_ASC',
  MetaTypeDesc = 'meta_type_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  NftBlockNumberAsc = 'nft_blockNumber_ASC',
  NftBlockNumberDesc = 'nft_blockNumber_DESC',
  NftBurnedAsc = 'nft_burned_ASC',
  NftBurnedDesc = 'nft_burned_DESC',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCurrentOwnerAsc = 'nft_currentOwner_ASC',
  NftCurrentOwnerDesc = 'nft_currentOwner_DESC',
  NftEmoteCountAsc = 'nft_emoteCount_ASC',
  NftEmoteCountDesc = 'nft_emoteCount_DESC',
  NftHashAsc = 'nft_hash_ASC',
  NftHashDesc = 'nft_hash_DESC',
  NftIdAsc = 'nft_id_ASC',
  NftIdDesc = 'nft_id_DESC',
  NftImageAsc = 'nft_image_ASC',
  NftImageDesc = 'nft_image_DESC',
  NftInstanceAsc = 'nft_instance_ASC',
  NftInstanceDesc = 'nft_instance_DESC',
  NftIssuerAsc = 'nft_issuer_ASC',
  NftIssuerDesc = 'nft_issuer_DESC',
  NftMediaAsc = 'nft_media_ASC',
  NftMediaDesc = 'nft_media_DESC',
  NftMetadataAsc = 'nft_metadata_ASC',
  NftMetadataDesc = 'nft_metadata_DESC',
  NftNameAsc = 'nft_name_ASC',
  NftNameDesc = 'nft_name_DESC',
  NftPendingAsc = 'nft_pending_ASC',
  NftPendingDesc = 'nft_pending_DESC',
  NftPriceAsc = 'nft_price_ASC',
  NftPriceDesc = 'nft_price_DESC',
  NftRecipientAsc = 'nft_recipient_ASC',
  NftRecipientDesc = 'nft_recipient_DESC',
  NftRoyaltyAsc = 'nft_royalty_ASC',
  NftRoyaltyDesc = 'nft_royalty_DESC',
  NftSnAsc = 'nft_sn_ASC',
  NftSnDesc = 'nft_sn_DESC',
  NftTransferableAsc = 'nft_transferable_ASC',
  NftTransferableDesc = 'nft_transferable_DESC',
  NftUpdatedAtAsc = 'nft_updatedAt_ASC',
  NftUpdatedAtDesc = 'nft_updatedAt_DESC',
  NftVersionAsc = 'nft_version_ASC',
  NftVersionDesc = 'nft_version_DESC',
  PendingAsc = 'pending_ASC',
  PendingDesc = 'pending_DESC',
  PriorityAsc = 'priority_ASC',
  PriorityDesc = 'priority_DESC',
  SlotAsc = 'slot_ASC',
  SlotDesc = 'slot_DESC',
  SrcAsc = 'src_ASC',
  SrcDesc = 'src_DESC',
  ThumbAsc = 'thumb_ASC',
  ThumbDesc = 'thumb_DESC',
}

export type ResourceWhereInput = {
  AND?: InputMaybe<Array<ResourceWhereInput>>
  OR?: InputMaybe<Array<ResourceWhereInput>>
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
  meta?: InputMaybe<MetadataEntityWhereInput>
  meta_isNull?: InputMaybe<Scalars['Boolean']['input']>
  metadata_contains?: InputMaybe<Scalars['String']['input']>
  metadata_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  metadata_endsWith?: InputMaybe<Scalars['String']['input']>
  metadata_eq?: InputMaybe<Scalars['String']['input']>
  metadata_gt?: InputMaybe<Scalars['String']['input']>
  metadata_gte?: InputMaybe<Scalars['String']['input']>
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>
  metadata_isNull?: InputMaybe<Scalars['Boolean']['input']>
  metadata_lt?: InputMaybe<Scalars['String']['input']>
  metadata_lte?: InputMaybe<Scalars['String']['input']>
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>
  metadata_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  metadata_not_endsWith?: InputMaybe<Scalars['String']['input']>
  metadata_not_eq?: InputMaybe<Scalars['String']['input']>
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  metadata_not_startsWith?: InputMaybe<Scalars['String']['input']>
  metadata_startsWith?: InputMaybe<Scalars['String']['input']>
  nft?: InputMaybe<NftEntityWhereInput>
  nft_isNull?: InputMaybe<Scalars['Boolean']['input']>
  pending_eq?: InputMaybe<Scalars['Boolean']['input']>
  pending_isNull?: InputMaybe<Scalars['Boolean']['input']>
  pending_not_eq?: InputMaybe<Scalars['Boolean']['input']>
  priority_eq?: InputMaybe<Scalars['Int']['input']>
  priority_gt?: InputMaybe<Scalars['Int']['input']>
  priority_gte?: InputMaybe<Scalars['Int']['input']>
  priority_in?: InputMaybe<Array<Scalars['Int']['input']>>
  priority_isNull?: InputMaybe<Scalars['Boolean']['input']>
  priority_lt?: InputMaybe<Scalars['Int']['input']>
  priority_lte?: InputMaybe<Scalars['Int']['input']>
  priority_not_eq?: InputMaybe<Scalars['Int']['input']>
  priority_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  slot_contains?: InputMaybe<Scalars['String']['input']>
  slot_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  slot_endsWith?: InputMaybe<Scalars['String']['input']>
  slot_eq?: InputMaybe<Scalars['String']['input']>
  slot_gt?: InputMaybe<Scalars['String']['input']>
  slot_gte?: InputMaybe<Scalars['String']['input']>
  slot_in?: InputMaybe<Array<Scalars['String']['input']>>
  slot_isNull?: InputMaybe<Scalars['Boolean']['input']>
  slot_lt?: InputMaybe<Scalars['String']['input']>
  slot_lte?: InputMaybe<Scalars['String']['input']>
  slot_not_contains?: InputMaybe<Scalars['String']['input']>
  slot_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  slot_not_endsWith?: InputMaybe<Scalars['String']['input']>
  slot_not_eq?: InputMaybe<Scalars['String']['input']>
  slot_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  slot_not_startsWith?: InputMaybe<Scalars['String']['input']>
  slot_startsWith?: InputMaybe<Scalars['String']['input']>
  src_contains?: InputMaybe<Scalars['String']['input']>
  src_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  src_endsWith?: InputMaybe<Scalars['String']['input']>
  src_eq?: InputMaybe<Scalars['String']['input']>
  src_gt?: InputMaybe<Scalars['String']['input']>
  src_gte?: InputMaybe<Scalars['String']['input']>
  src_in?: InputMaybe<Array<Scalars['String']['input']>>
  src_isNull?: InputMaybe<Scalars['Boolean']['input']>
  src_lt?: InputMaybe<Scalars['String']['input']>
  src_lte?: InputMaybe<Scalars['String']['input']>
  src_not_contains?: InputMaybe<Scalars['String']['input']>
  src_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  src_not_endsWith?: InputMaybe<Scalars['String']['input']>
  src_not_eq?: InputMaybe<Scalars['String']['input']>
  src_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  src_not_startsWith?: InputMaybe<Scalars['String']['input']>
  src_startsWith?: InputMaybe<Scalars['String']['input']>
  thumb_contains?: InputMaybe<Scalars['String']['input']>
  thumb_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  thumb_endsWith?: InputMaybe<Scalars['String']['input']>
  thumb_eq?: InputMaybe<Scalars['String']['input']>
  thumb_gt?: InputMaybe<Scalars['String']['input']>
  thumb_gte?: InputMaybe<Scalars['String']['input']>
  thumb_in?: InputMaybe<Array<Scalars['String']['input']>>
  thumb_isNull?: InputMaybe<Scalars['Boolean']['input']>
  thumb_lt?: InputMaybe<Scalars['String']['input']>
  thumb_lte?: InputMaybe<Scalars['String']['input']>
  thumb_not_contains?: InputMaybe<Scalars['String']['input']>
  thumb_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  thumb_not_endsWith?: InputMaybe<Scalars['String']['input']>
  thumb_not_eq?: InputMaybe<Scalars['String']['input']>
  thumb_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  thumb_not_startsWith?: InputMaybe<Scalars['String']['input']>
  thumb_startsWith?: InputMaybe<Scalars['String']['input']>
}

export type ResourcesConnection = {
  __typename?: 'ResourcesConnection'
  edges: Array<ResourceEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type SaleNftEntity = {
  __typename?: 'SaleNftEntity'
  blockNumber: Scalars['String']['output']
  buyer: Scalars['String']['output']
  collectionId: Scalars['String']['output']
  collectionName: Scalars['String']['output']
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  issuer: Scalars['String']['output']
  name: Scalars['String']['output']
  salePrice: Scalars['BigInt']['output']
  timestamp: Scalars['String']['output']
}

export type Series = {
  __typename?: 'Series'
  averagePrice?: Maybe<Scalars['Float']['output']>
  buys?: Maybe<Scalars['Int']['output']>
  emoteCount?: Maybe<Scalars['Int']['output']>
  floorPrice?: Maybe<Scalars['BigInt']['output']>
  highestSale?: Maybe<Scalars['BigInt']['output']>
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  issuer?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  name: Scalars['String']['output']
  sold: Scalars['Int']['output']
  total: Scalars['Int']['output']
  unique: Scalars['Int']['output']
  uniqueCollectors: Scalars['Int']['output']
  volume?: Maybe<Scalars['BigInt']['output']>
}

export type SeriesConnection = {
  __typename?: 'SeriesConnection'
  edges: Array<SeriesEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type SeriesEdge = {
  __typename?: 'SeriesEdge'
  cursor: Scalars['String']['output']
  node: Series
}

export type SeriesEntity = {
  __typename?: 'SeriesEntity'
  averagePrice?: Maybe<Scalars['BigInt']['output']>
  buys?: Maybe<Scalars['Float']['output']>
  floorPrice?: Maybe<Scalars['BigInt']['output']>
  highestSale?: Maybe<Scalars['BigInt']['output']>
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  issuer: Scalars['String']['output']
  metadata?: Maybe<Scalars['String']['output']>
  name: Scalars['String']['output']
  sold: Scalars['Float']['output']
  total: Scalars['Float']['output']
  unique: Scalars['Float']['output']
  uniqueCollectors: Scalars['Float']['output']
  volume?: Maybe<Scalars['BigInt']['output']>
}

export enum SeriesOrderByInput {
  AveragePriceAsc = 'averagePrice_ASC',
  AveragePriceDesc = 'averagePrice_DESC',
  BuysAsc = 'buys_ASC',
  BuysDesc = 'buys_DESC',
  EmoteCountAsc = 'emoteCount_ASC',
  EmoteCountDesc = 'emoteCount_DESC',
  FloorPriceAsc = 'floorPrice_ASC',
  FloorPriceDesc = 'floorPrice_DESC',
  HighestSaleAsc = 'highestSale_ASC',
  HighestSaleDesc = 'highestSale_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  IssuerAsc = 'issuer_ASC',
  IssuerDesc = 'issuer_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SoldAsc = 'sold_ASC',
  SoldDesc = 'sold_DESC',
  TotalAsc = 'total_ASC',
  TotalDesc = 'total_DESC',
  UniqueCollectorsAsc = 'uniqueCollectors_ASC',
  UniqueCollectorsDesc = 'uniqueCollectors_DESC',
  UniqueAsc = 'unique_ASC',
  UniqueDesc = 'unique_DESC',
  VolumeAsc = 'volume_ASC',
  VolumeDesc = 'volume_DESC',
}

export type SeriesWhereInput = {
  AND?: InputMaybe<Array<SeriesWhereInput>>
  OR?: InputMaybe<Array<SeriesWhereInput>>
  averagePrice_eq?: InputMaybe<Scalars['Float']['input']>
  averagePrice_gt?: InputMaybe<Scalars['Float']['input']>
  averagePrice_gte?: InputMaybe<Scalars['Float']['input']>
  averagePrice_in?: InputMaybe<Array<Scalars['Float']['input']>>
  averagePrice_isNull?: InputMaybe<Scalars['Boolean']['input']>
  averagePrice_lt?: InputMaybe<Scalars['Float']['input']>
  averagePrice_lte?: InputMaybe<Scalars['Float']['input']>
  averagePrice_not_eq?: InputMaybe<Scalars['Float']['input']>
  averagePrice_not_in?: InputMaybe<Array<Scalars['Float']['input']>>
  buys_eq?: InputMaybe<Scalars['Int']['input']>
  buys_gt?: InputMaybe<Scalars['Int']['input']>
  buys_gte?: InputMaybe<Scalars['Int']['input']>
  buys_in?: InputMaybe<Array<Scalars['Int']['input']>>
  buys_isNull?: InputMaybe<Scalars['Boolean']['input']>
  buys_lt?: InputMaybe<Scalars['Int']['input']>
  buys_lte?: InputMaybe<Scalars['Int']['input']>
  buys_not_eq?: InputMaybe<Scalars['Int']['input']>
  buys_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  emoteCount_eq?: InputMaybe<Scalars['Int']['input']>
  emoteCount_gt?: InputMaybe<Scalars['Int']['input']>
  emoteCount_gte?: InputMaybe<Scalars['Int']['input']>
  emoteCount_in?: InputMaybe<Array<Scalars['Int']['input']>>
  emoteCount_isNull?: InputMaybe<Scalars['Boolean']['input']>
  emoteCount_lt?: InputMaybe<Scalars['Int']['input']>
  emoteCount_lte?: InputMaybe<Scalars['Int']['input']>
  emoteCount_not_eq?: InputMaybe<Scalars['Int']['input']>
  emoteCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  floorPrice_eq?: InputMaybe<Scalars['BigInt']['input']>
  floorPrice_gt?: InputMaybe<Scalars['BigInt']['input']>
  floorPrice_gte?: InputMaybe<Scalars['BigInt']['input']>
  floorPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  floorPrice_isNull?: InputMaybe<Scalars['Boolean']['input']>
  floorPrice_lt?: InputMaybe<Scalars['BigInt']['input']>
  floorPrice_lte?: InputMaybe<Scalars['BigInt']['input']>
  floorPrice_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  floorPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  highestSale_eq?: InputMaybe<Scalars['BigInt']['input']>
  highestSale_gt?: InputMaybe<Scalars['BigInt']['input']>
  highestSale_gte?: InputMaybe<Scalars['BigInt']['input']>
  highestSale_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  highestSale_isNull?: InputMaybe<Scalars['Boolean']['input']>
  highestSale_lt?: InputMaybe<Scalars['BigInt']['input']>
  highestSale_lte?: InputMaybe<Scalars['BigInt']['input']>
  highestSale_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  highestSale_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
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
  image_contains?: InputMaybe<Scalars['String']['input']>
  image_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  image_endsWith?: InputMaybe<Scalars['String']['input']>
  image_eq?: InputMaybe<Scalars['String']['input']>
  image_gt?: InputMaybe<Scalars['String']['input']>
  image_gte?: InputMaybe<Scalars['String']['input']>
  image_in?: InputMaybe<Array<Scalars['String']['input']>>
  image_isNull?: InputMaybe<Scalars['Boolean']['input']>
  image_lt?: InputMaybe<Scalars['String']['input']>
  image_lte?: InputMaybe<Scalars['String']['input']>
  image_not_contains?: InputMaybe<Scalars['String']['input']>
  image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  image_not_endsWith?: InputMaybe<Scalars['String']['input']>
  image_not_eq?: InputMaybe<Scalars['String']['input']>
  image_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  image_not_startsWith?: InputMaybe<Scalars['String']['input']>
  image_startsWith?: InputMaybe<Scalars['String']['input']>
  issuer_contains?: InputMaybe<Scalars['String']['input']>
  issuer_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  issuer_endsWith?: InputMaybe<Scalars['String']['input']>
  issuer_eq?: InputMaybe<Scalars['String']['input']>
  issuer_gt?: InputMaybe<Scalars['String']['input']>
  issuer_gte?: InputMaybe<Scalars['String']['input']>
  issuer_in?: InputMaybe<Array<Scalars['String']['input']>>
  issuer_isNull?: InputMaybe<Scalars['Boolean']['input']>
  issuer_lt?: InputMaybe<Scalars['String']['input']>
  issuer_lte?: InputMaybe<Scalars['String']['input']>
  issuer_not_contains?: InputMaybe<Scalars['String']['input']>
  issuer_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  issuer_not_endsWith?: InputMaybe<Scalars['String']['input']>
  issuer_not_eq?: InputMaybe<Scalars['String']['input']>
  issuer_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  issuer_not_startsWith?: InputMaybe<Scalars['String']['input']>
  issuer_startsWith?: InputMaybe<Scalars['String']['input']>
  metadata_contains?: InputMaybe<Scalars['String']['input']>
  metadata_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  metadata_endsWith?: InputMaybe<Scalars['String']['input']>
  metadata_eq?: InputMaybe<Scalars['String']['input']>
  metadata_gt?: InputMaybe<Scalars['String']['input']>
  metadata_gte?: InputMaybe<Scalars['String']['input']>
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>
  metadata_isNull?: InputMaybe<Scalars['Boolean']['input']>
  metadata_lt?: InputMaybe<Scalars['String']['input']>
  metadata_lte?: InputMaybe<Scalars['String']['input']>
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>
  metadata_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  metadata_not_endsWith?: InputMaybe<Scalars['String']['input']>
  metadata_not_eq?: InputMaybe<Scalars['String']['input']>
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  metadata_not_startsWith?: InputMaybe<Scalars['String']['input']>
  metadata_startsWith?: InputMaybe<Scalars['String']['input']>
  name_contains?: InputMaybe<Scalars['String']['input']>
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  name_endsWith?: InputMaybe<Scalars['String']['input']>
  name_eq?: InputMaybe<Scalars['String']['input']>
  name_gt?: InputMaybe<Scalars['String']['input']>
  name_gte?: InputMaybe<Scalars['String']['input']>
  name_in?: InputMaybe<Array<Scalars['String']['input']>>
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>
  name_lt?: InputMaybe<Scalars['String']['input']>
  name_lte?: InputMaybe<Scalars['String']['input']>
  name_not_contains?: InputMaybe<Scalars['String']['input']>
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>
  name_not_eq?: InputMaybe<Scalars['String']['input']>
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>
  name_startsWith?: InputMaybe<Scalars['String']['input']>
  sold_eq?: InputMaybe<Scalars['Int']['input']>
  sold_gt?: InputMaybe<Scalars['Int']['input']>
  sold_gte?: InputMaybe<Scalars['Int']['input']>
  sold_in?: InputMaybe<Array<Scalars['Int']['input']>>
  sold_isNull?: InputMaybe<Scalars['Boolean']['input']>
  sold_lt?: InputMaybe<Scalars['Int']['input']>
  sold_lte?: InputMaybe<Scalars['Int']['input']>
  sold_not_eq?: InputMaybe<Scalars['Int']['input']>
  sold_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  total_eq?: InputMaybe<Scalars['Int']['input']>
  total_gt?: InputMaybe<Scalars['Int']['input']>
  total_gte?: InputMaybe<Scalars['Int']['input']>
  total_in?: InputMaybe<Array<Scalars['Int']['input']>>
  total_isNull?: InputMaybe<Scalars['Boolean']['input']>
  total_lt?: InputMaybe<Scalars['Int']['input']>
  total_lte?: InputMaybe<Scalars['Int']['input']>
  total_not_eq?: InputMaybe<Scalars['Int']['input']>
  total_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  uniqueCollectors_eq?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_gt?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_gte?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_in?: InputMaybe<Array<Scalars['Int']['input']>>
  uniqueCollectors_isNull?: InputMaybe<Scalars['Boolean']['input']>
  uniqueCollectors_lt?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_lte?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_not_eq?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  unique_eq?: InputMaybe<Scalars['Int']['input']>
  unique_gt?: InputMaybe<Scalars['Int']['input']>
  unique_gte?: InputMaybe<Scalars['Int']['input']>
  unique_in?: InputMaybe<Array<Scalars['Int']['input']>>
  unique_isNull?: InputMaybe<Scalars['Boolean']['input']>
  unique_lt?: InputMaybe<Scalars['Int']['input']>
  unique_lte?: InputMaybe<Scalars['Int']['input']>
  unique_not_eq?: InputMaybe<Scalars['Int']['input']>
  unique_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  volume_eq?: InputMaybe<Scalars['BigInt']['input']>
  volume_gt?: InputMaybe<Scalars['BigInt']['input']>
  volume_gte?: InputMaybe<Scalars['BigInt']['input']>
  volume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  volume_isNull?: InputMaybe<Scalars['Boolean']['input']>
  volume_lt?: InputMaybe<Scalars['BigInt']['input']>
  volume_lte?: InputMaybe<Scalars['BigInt']['input']>
  volume_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  volume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
}

export type Spotlight = {
  __typename?: 'Spotlight'
  average?: Maybe<Scalars['Float']['output']>
  collections: Scalars['Int']['output']
  id: Scalars['String']['output']
  sold: Scalars['Int']['output']
  total: Scalars['Int']['output']
  unique: Scalars['Int']['output']
  uniqueCollectors: Scalars['Int']['output']
  volume?: Maybe<Scalars['BigInt']['output']>
}

export type SpotlightEdge = {
  __typename?: 'SpotlightEdge'
  cursor: Scalars['String']['output']
  node: Spotlight
}

export type SpotlightEntity = {
  __typename?: 'SpotlightEntity'
  average?: Maybe<Scalars['BigInt']['output']>
  collections: Scalars['Float']['output']
  id: Scalars['String']['output']
  sold: Scalars['Float']['output']
  soldHistory: Array<HistoryEntity>
  total: Scalars['Float']['output']
  unique: Scalars['Float']['output']
  uniqueCollectors: Scalars['Float']['output']
  volume?: Maybe<Scalars['BigInt']['output']>
}

export enum SpotlightOrderByInput {
  AverageAsc = 'average_ASC',
  AverageDesc = 'average_DESC',
  CollectionsAsc = 'collections_ASC',
  CollectionsDesc = 'collections_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  SoldAsc = 'sold_ASC',
  SoldDesc = 'sold_DESC',
  TotalAsc = 'total_ASC',
  TotalDesc = 'total_DESC',
  UniqueCollectorsAsc = 'uniqueCollectors_ASC',
  UniqueCollectorsDesc = 'uniqueCollectors_DESC',
  UniqueAsc = 'unique_ASC',
  UniqueDesc = 'unique_DESC',
  VolumeAsc = 'volume_ASC',
  VolumeDesc = 'volume_DESC',
}

export type SpotlightWhereInput = {
  AND?: InputMaybe<Array<SpotlightWhereInput>>
  OR?: InputMaybe<Array<SpotlightWhereInput>>
  average_eq?: InputMaybe<Scalars['Float']['input']>
  average_gt?: InputMaybe<Scalars['Float']['input']>
  average_gte?: InputMaybe<Scalars['Float']['input']>
  average_in?: InputMaybe<Array<Scalars['Float']['input']>>
  average_isNull?: InputMaybe<Scalars['Boolean']['input']>
  average_lt?: InputMaybe<Scalars['Float']['input']>
  average_lte?: InputMaybe<Scalars['Float']['input']>
  average_not_eq?: InputMaybe<Scalars['Float']['input']>
  average_not_in?: InputMaybe<Array<Scalars['Float']['input']>>
  collections_eq?: InputMaybe<Scalars['Int']['input']>
  collections_gt?: InputMaybe<Scalars['Int']['input']>
  collections_gte?: InputMaybe<Scalars['Int']['input']>
  collections_in?: InputMaybe<Array<Scalars['Int']['input']>>
  collections_isNull?: InputMaybe<Scalars['Boolean']['input']>
  collections_lt?: InputMaybe<Scalars['Int']['input']>
  collections_lte?: InputMaybe<Scalars['Int']['input']>
  collections_not_eq?: InputMaybe<Scalars['Int']['input']>
  collections_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
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
  sold_eq?: InputMaybe<Scalars['Int']['input']>
  sold_gt?: InputMaybe<Scalars['Int']['input']>
  sold_gte?: InputMaybe<Scalars['Int']['input']>
  sold_in?: InputMaybe<Array<Scalars['Int']['input']>>
  sold_isNull?: InputMaybe<Scalars['Boolean']['input']>
  sold_lt?: InputMaybe<Scalars['Int']['input']>
  sold_lte?: InputMaybe<Scalars['Int']['input']>
  sold_not_eq?: InputMaybe<Scalars['Int']['input']>
  sold_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  total_eq?: InputMaybe<Scalars['Int']['input']>
  total_gt?: InputMaybe<Scalars['Int']['input']>
  total_gte?: InputMaybe<Scalars['Int']['input']>
  total_in?: InputMaybe<Array<Scalars['Int']['input']>>
  total_isNull?: InputMaybe<Scalars['Boolean']['input']>
  total_lt?: InputMaybe<Scalars['Int']['input']>
  total_lte?: InputMaybe<Scalars['Int']['input']>
  total_not_eq?: InputMaybe<Scalars['Int']['input']>
  total_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  uniqueCollectors_eq?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_gt?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_gte?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_in?: InputMaybe<Array<Scalars['Int']['input']>>
  uniqueCollectors_isNull?: InputMaybe<Scalars['Boolean']['input']>
  uniqueCollectors_lt?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_lte?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_not_eq?: InputMaybe<Scalars['Int']['input']>
  uniqueCollectors_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  unique_eq?: InputMaybe<Scalars['Int']['input']>
  unique_gt?: InputMaybe<Scalars['Int']['input']>
  unique_gte?: InputMaybe<Scalars['Int']['input']>
  unique_in?: InputMaybe<Array<Scalars['Int']['input']>>
  unique_isNull?: InputMaybe<Scalars['Boolean']['input']>
  unique_lt?: InputMaybe<Scalars['Int']['input']>
  unique_lte?: InputMaybe<Scalars['Int']['input']>
  unique_not_eq?: InputMaybe<Scalars['Int']['input']>
  unique_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  volume_eq?: InputMaybe<Scalars['BigInt']['input']>
  volume_gt?: InputMaybe<Scalars['BigInt']['input']>
  volume_gte?: InputMaybe<Scalars['BigInt']['input']>
  volume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  volume_isNull?: InputMaybe<Scalars['Boolean']['input']>
  volume_lt?: InputMaybe<Scalars['BigInt']['input']>
  volume_lte?: InputMaybe<Scalars['BigInt']['input']>
  volume_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  volume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
}

export type SpotlightsConnection = {
  __typename?: 'SpotlightsConnection'
  edges: Array<SpotlightEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type SquidStatus = {
  __typename?: 'SquidStatus'
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']['output']>
}

export type Subscription = {
  __typename?: 'Subscription'
  baseById?: Maybe<Base>
  bases: Array<Base>
  cacheStatusById?: Maybe<CacheStatus>
  cacheStatuses: Array<CacheStatus>
  collectionEntities: Array<CollectionEntity>
  collectionEntityById?: Maybe<CollectionEntity>
  collectorById?: Maybe<Collector>
  collectors: Array<Collector>
  emoteById?: Maybe<Emote>
  emotes: Array<Emote>
  eventById?: Maybe<Event>
  events: Array<Event>
  metadataEntities: Array<MetadataEntity>
  metadataEntityById?: Maybe<MetadataEntity>
  nftEntities: Array<NftEntity>
  nftEntityById?: Maybe<NftEntity>
  resourceById?: Maybe<Resource>
  resources: Array<Resource>
  series: Array<Series>
  seriesById?: Maybe<Series>
  spotlightById?: Maybe<Spotlight>
  spotlights: Array<Spotlight>
}

export type SubscriptionBaseByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionBasesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<BaseOrderByInput>>
  where?: InputMaybe<BaseWhereInput>
}

export type SubscriptionCacheStatusByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionCacheStatusesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CacheStatusOrderByInput>>
  where?: InputMaybe<CacheStatusWhereInput>
}

export type SubscriptionCollectionEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CollectionEntityOrderByInput>>
  where?: InputMaybe<CollectionEntityWhereInput>
}

export type SubscriptionCollectionEntityByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionCollectorByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionCollectorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CollectorOrderByInput>>
  where?: InputMaybe<CollectorWhereInput>
}

export type SubscriptionEmoteByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionEmotesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<EmoteOrderByInput>>
  where?: InputMaybe<EmoteWhereInput>
}

export type SubscriptionEventByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<EventOrderByInput>>
  where?: InputMaybe<EventWhereInput>
}

export type SubscriptionMetadataEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<MetadataEntityOrderByInput>>
  where?: InputMaybe<MetadataEntityWhereInput>
}

export type SubscriptionMetadataEntityByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionNftEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NftEntityOrderByInput>>
  where?: InputMaybe<NftEntityWhereInput>
}

export type SubscriptionNftEntityByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionResourceByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionResourcesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ResourceOrderByInput>>
  where?: InputMaybe<ResourceWhereInput>
}

export type SubscriptionSeriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<SeriesOrderByInput>>
  where?: InputMaybe<SeriesWhereInput>
}

export type SubscriptionSeriesByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionSpotlightByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionSpotlightsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<SpotlightOrderByInput>>
  where?: InputMaybe<SpotlightWhereInput>
}

export type WhereIdInput = {
  id: Scalars['String']['input']
}

export type NftListWithSearchQueryVariables = Exact<{
  first: Scalars['Int']['input']
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NftEntityOrderByInput> | NftEntityOrderByInput>
  search?: InputMaybe<Array<NftEntityWhereInput> | NftEntityWhereInput>
}>

export type NftListWithSearchQuery = {
  __typename?: 'Query'
  nfts: Array<{
    __typename?: 'NFTEntity'
    id: string
    sn?: string | null
    currentOwner?: string | null
    collection: { __typename?: 'CollectionEntity'; id: string; name?: string | null; max: number }
    meta?: {
      __typename?: 'MetadataEntity'
      name?: string | null
      description?: string | null
      image?: string | null
      attributes?: Array<{ __typename?: 'Attribute'; trait?: string | null; value: string }> | null
    } | null
    resources: Array<{ __typename?: 'Resource'; thumb?: string | null }>
  }>
}

export const NftListWithSearchDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'nftListWithSearch' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: { kind: 'NamedType', name: { kind: 'Name', value: 'NFTEntityOrderByInput' } },
            },
          },
          defaultValue: { kind: 'ListValue', values: [{ kind: 'EnumValue', value: 'blockNumber_DESC' }] },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'search' } },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: { kind: 'NamedType', name: { kind: 'Name', value: 'NFTEntityWhereInput' } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'nfts' },
            name: { kind: 'Name', value: 'nftEntities' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'offset' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'burned_eq' },
                      value: { kind: 'BooleanValue', value: false },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'metadata_not_eq' },
                      value: { kind: 'StringValue', value: '', block: false },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'AND' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'search' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sn' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currentOwner' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'collection' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'meta' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'image' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'attributes' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'trait' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'resources' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'thumb' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NftListWithSearchQuery, NftListWithSearchQueryVariables>
