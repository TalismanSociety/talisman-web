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

export type AssetEntitiesConnection = {
  __typename?: 'AssetEntitiesConnection'
  edges: Array<AssetEntityEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type AssetEntity = {
  __typename?: 'AssetEntity'
  decimals?: Maybe<Scalars['Int']['output']>
  id: Scalars['String']['output']
  name?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
}

export type AssetEntityEdge = {
  __typename?: 'AssetEntityEdge'
  cursor: Scalars['String']['output']
  node: AssetEntity
}

export enum AssetEntityOrderByInput {
  DecimalsAsc = 'decimals_ASC',
  DecimalsAscNullsFirst = 'decimals_ASC_NULLS_FIRST',
  DecimalsAscNullsLast = 'decimals_ASC_NULLS_LAST',
  DecimalsDesc = 'decimals_DESC',
  DecimalsDescNullsFirst = 'decimals_DESC_NULLS_FIRST',
  DecimalsDescNullsLast = 'decimals_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameAscNullsLast = 'name_ASC_NULLS_LAST',
  NameDesc = 'name_DESC',
  NameDescNullsFirst = 'name_DESC_NULLS_FIRST',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  SymbolAsc = 'symbol_ASC',
  SymbolAscNullsFirst = 'symbol_ASC_NULLS_FIRST',
  SymbolAscNullsLast = 'symbol_ASC_NULLS_LAST',
  SymbolDesc = 'symbol_DESC',
  SymbolDescNullsFirst = 'symbol_DESC_NULLS_FIRST',
  SymbolDescNullsLast = 'symbol_DESC_NULLS_LAST',
}

export type AssetEntityWhereInput = {
  AND?: InputMaybe<Array<AssetEntityWhereInput>>
  OR?: InputMaybe<Array<AssetEntityWhereInput>>
  decimals_eq?: InputMaybe<Scalars['Int']['input']>
  decimals_gt?: InputMaybe<Scalars['Int']['input']>
  decimals_gte?: InputMaybe<Scalars['Int']['input']>
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>
  decimals_isNull?: InputMaybe<Scalars['Boolean']['input']>
  decimals_lt?: InputMaybe<Scalars['Int']['input']>
  decimals_lte?: InputMaybe<Scalars['Int']['input']>
  decimals_not_eq?: InputMaybe<Scalars['Int']['input']>
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
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
}

export type Attribute = {
  __typename?: 'Attribute'
  display?: Maybe<Scalars['String']['output']>
  trait?: Maybe<Scalars['String']['output']>
  value: Scalars['String']['output']
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
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  LastBlockTimestampAsc = 'lastBlockTimestamp_ASC',
  LastBlockTimestampAscNullsFirst = 'lastBlockTimestamp_ASC_NULLS_FIRST',
  LastBlockTimestampAscNullsLast = 'lastBlockTimestamp_ASC_NULLS_LAST',
  LastBlockTimestampDesc = 'lastBlockTimestamp_DESC',
  LastBlockTimestampDescNullsFirst = 'lastBlockTimestamp_DESC_NULLS_FIRST',
  LastBlockTimestampDescNullsLast = 'lastBlockTimestamp_DESC_NULLS_LAST',
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

export type Cheapest = {
  __typename?: 'Cheapest'
  currentOwner?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['String']['output']>
  price?: Maybe<Scalars['BigInt']['output']>
}

export type Collection = {
  __typename?: 'Collection'
  id?: Maybe<Scalars['String']['output']>
  kind?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
}

export type CollectionEntitiesConnection = {
  __typename?: 'CollectionEntitiesConnection'
  edges: Array<CollectionEntityEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type CollectionEntity = {
  __typename?: 'CollectionEntity'
  attributes?: Maybe<Array<Attribute>>
  baseUri?: Maybe<Scalars['String']['output']>
  blockNumber?: Maybe<Scalars['BigInt']['output']>
  burned: Scalars['Boolean']['output']
  createdAt: Scalars['DateTime']['output']
  currentOwner: Scalars['String']['output']
  distribution: Scalars['Int']['output']
  events: Array<CollectionEvent>
  floor: Scalars['BigInt']['output']
  hash: Scalars['String']['output']
  highestSale: Scalars['BigInt']['output']
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  issuer: Scalars['String']['output']
  kind?: Maybe<Kind>
  max?: Maybe<Scalars['Int']['output']>
  media?: Maybe<Scalars['String']['output']>
  meta?: Maybe<MetadataEntity>
  metadata?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  nftCount: Scalars['Int']['output']
  nfts: Array<NftEntity>
  ownerCount: Scalars['Int']['output']
  recipient?: Maybe<Scalars['String']['output']>
  royalty?: Maybe<Scalars['Float']['output']>
  settings?: Maybe<CollectionSettings>
  supply: Scalars['Int']['output']
  type?: Maybe<CollectionType>
  updatedAt: Scalars['DateTime']['output']
  version: Scalars['Int']['output']
  volume: Scalars['BigInt']['output']
}

export type CollectionEntityEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CollectionEventOrderByInput>>
  where?: InputMaybe<CollectionEventWhereInput>
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
  BaseUriAsc = 'baseUri_ASC',
  BaseUriAscNullsFirst = 'baseUri_ASC_NULLS_FIRST',
  BaseUriAscNullsLast = 'baseUri_ASC_NULLS_LAST',
  BaseUriDesc = 'baseUri_DESC',
  BaseUriDescNullsFirst = 'baseUri_DESC_NULLS_FIRST',
  BaseUriDescNullsLast = 'baseUri_DESC_NULLS_LAST',
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  BurnedAsc = 'burned_ASC',
  BurnedAscNullsFirst = 'burned_ASC_NULLS_FIRST',
  BurnedAscNullsLast = 'burned_ASC_NULLS_LAST',
  BurnedDesc = 'burned_DESC',
  BurnedDescNullsFirst = 'burned_DESC_NULLS_FIRST',
  BurnedDescNullsLast = 'burned_DESC_NULLS_LAST',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
  CreatedAtAscNullsLast = 'createdAt_ASC_NULLS_LAST',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedAtDescNullsFirst = 'createdAt_DESC_NULLS_FIRST',
  CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
  CurrentOwnerAsc = 'currentOwner_ASC',
  CurrentOwnerAscNullsFirst = 'currentOwner_ASC_NULLS_FIRST',
  CurrentOwnerAscNullsLast = 'currentOwner_ASC_NULLS_LAST',
  CurrentOwnerDesc = 'currentOwner_DESC',
  CurrentOwnerDescNullsFirst = 'currentOwner_DESC_NULLS_FIRST',
  CurrentOwnerDescNullsLast = 'currentOwner_DESC_NULLS_LAST',
  DistributionAsc = 'distribution_ASC',
  DistributionAscNullsFirst = 'distribution_ASC_NULLS_FIRST',
  DistributionAscNullsLast = 'distribution_ASC_NULLS_LAST',
  DistributionDesc = 'distribution_DESC',
  DistributionDescNullsFirst = 'distribution_DESC_NULLS_FIRST',
  DistributionDescNullsLast = 'distribution_DESC_NULLS_LAST',
  FloorAsc = 'floor_ASC',
  FloorAscNullsFirst = 'floor_ASC_NULLS_FIRST',
  FloorAscNullsLast = 'floor_ASC_NULLS_LAST',
  FloorDesc = 'floor_DESC',
  FloorDescNullsFirst = 'floor_DESC_NULLS_FIRST',
  FloorDescNullsLast = 'floor_DESC_NULLS_LAST',
  HashAsc = 'hash_ASC',
  HashAscNullsFirst = 'hash_ASC_NULLS_FIRST',
  HashAscNullsLast = 'hash_ASC_NULLS_LAST',
  HashDesc = 'hash_DESC',
  HashDescNullsFirst = 'hash_DESC_NULLS_FIRST',
  HashDescNullsLast = 'hash_DESC_NULLS_LAST',
  HighestSaleAsc = 'highestSale_ASC',
  HighestSaleAscNullsFirst = 'highestSale_ASC_NULLS_FIRST',
  HighestSaleAscNullsLast = 'highestSale_ASC_NULLS_LAST',
  HighestSaleDesc = 'highestSale_DESC',
  HighestSaleDescNullsFirst = 'highestSale_DESC_NULLS_FIRST',
  HighestSaleDescNullsLast = 'highestSale_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  ImageAsc = 'image_ASC',
  ImageAscNullsFirst = 'image_ASC_NULLS_FIRST',
  ImageAscNullsLast = 'image_ASC_NULLS_LAST',
  ImageDesc = 'image_DESC',
  ImageDescNullsFirst = 'image_DESC_NULLS_FIRST',
  ImageDescNullsLast = 'image_DESC_NULLS_LAST',
  IssuerAsc = 'issuer_ASC',
  IssuerAscNullsFirst = 'issuer_ASC_NULLS_FIRST',
  IssuerAscNullsLast = 'issuer_ASC_NULLS_LAST',
  IssuerDesc = 'issuer_DESC',
  IssuerDescNullsFirst = 'issuer_DESC_NULLS_FIRST',
  IssuerDescNullsLast = 'issuer_DESC_NULLS_LAST',
  KindAsc = 'kind_ASC',
  KindAscNullsFirst = 'kind_ASC_NULLS_FIRST',
  KindAscNullsLast = 'kind_ASC_NULLS_LAST',
  KindDesc = 'kind_DESC',
  KindDescNullsFirst = 'kind_DESC_NULLS_FIRST',
  KindDescNullsLast = 'kind_DESC_NULLS_LAST',
  MaxAsc = 'max_ASC',
  MaxAscNullsFirst = 'max_ASC_NULLS_FIRST',
  MaxAscNullsLast = 'max_ASC_NULLS_LAST',
  MaxDesc = 'max_DESC',
  MaxDescNullsFirst = 'max_DESC_NULLS_FIRST',
  MaxDescNullsLast = 'max_DESC_NULLS_LAST',
  MediaAsc = 'media_ASC',
  MediaAscNullsFirst = 'media_ASC_NULLS_FIRST',
  MediaAscNullsLast = 'media_ASC_NULLS_LAST',
  MediaDesc = 'media_DESC',
  MediaDescNullsFirst = 'media_DESC_NULLS_FIRST',
  MediaDescNullsLast = 'media_DESC_NULLS_LAST',
  MetaAnimationUrlAsc = 'meta_animationUrl_ASC',
  MetaAnimationUrlAscNullsFirst = 'meta_animationUrl_ASC_NULLS_FIRST',
  MetaAnimationUrlAscNullsLast = 'meta_animationUrl_ASC_NULLS_LAST',
  MetaAnimationUrlDesc = 'meta_animationUrl_DESC',
  MetaAnimationUrlDescNullsFirst = 'meta_animationUrl_DESC_NULLS_FIRST',
  MetaAnimationUrlDescNullsLast = 'meta_animationUrl_DESC_NULLS_LAST',
  MetaBannerAsc = 'meta_banner_ASC',
  MetaBannerAscNullsFirst = 'meta_banner_ASC_NULLS_FIRST',
  MetaBannerAscNullsLast = 'meta_banner_ASC_NULLS_LAST',
  MetaBannerDesc = 'meta_banner_DESC',
  MetaBannerDescNullsFirst = 'meta_banner_DESC_NULLS_FIRST',
  MetaBannerDescNullsLast = 'meta_banner_DESC_NULLS_LAST',
  MetaDescriptionAsc = 'meta_description_ASC',
  MetaDescriptionAscNullsFirst = 'meta_description_ASC_NULLS_FIRST',
  MetaDescriptionAscNullsLast = 'meta_description_ASC_NULLS_LAST',
  MetaDescriptionDesc = 'meta_description_DESC',
  MetaDescriptionDescNullsFirst = 'meta_description_DESC_NULLS_FIRST',
  MetaDescriptionDescNullsLast = 'meta_description_DESC_NULLS_LAST',
  MetaIdAsc = 'meta_id_ASC',
  MetaIdAscNullsFirst = 'meta_id_ASC_NULLS_FIRST',
  MetaIdAscNullsLast = 'meta_id_ASC_NULLS_LAST',
  MetaIdDesc = 'meta_id_DESC',
  MetaIdDescNullsFirst = 'meta_id_DESC_NULLS_FIRST',
  MetaIdDescNullsLast = 'meta_id_DESC_NULLS_LAST',
  MetaImageAsc = 'meta_image_ASC',
  MetaImageAscNullsFirst = 'meta_image_ASC_NULLS_FIRST',
  MetaImageAscNullsLast = 'meta_image_ASC_NULLS_LAST',
  MetaImageDesc = 'meta_image_DESC',
  MetaImageDescNullsFirst = 'meta_image_DESC_NULLS_FIRST',
  MetaImageDescNullsLast = 'meta_image_DESC_NULLS_LAST',
  MetaKindAsc = 'meta_kind_ASC',
  MetaKindAscNullsFirst = 'meta_kind_ASC_NULLS_FIRST',
  MetaKindAscNullsLast = 'meta_kind_ASC_NULLS_LAST',
  MetaKindDesc = 'meta_kind_DESC',
  MetaKindDescNullsFirst = 'meta_kind_DESC_NULLS_FIRST',
  MetaKindDescNullsLast = 'meta_kind_DESC_NULLS_LAST',
  MetaNameAsc = 'meta_name_ASC',
  MetaNameAscNullsFirst = 'meta_name_ASC_NULLS_FIRST',
  MetaNameAscNullsLast = 'meta_name_ASC_NULLS_LAST',
  MetaNameDesc = 'meta_name_DESC',
  MetaNameDescNullsFirst = 'meta_name_DESC_NULLS_FIRST',
  MetaNameDescNullsLast = 'meta_name_DESC_NULLS_LAST',
  MetaTypeAsc = 'meta_type_ASC',
  MetaTypeAscNullsFirst = 'meta_type_ASC_NULLS_FIRST',
  MetaTypeAscNullsLast = 'meta_type_ASC_NULLS_LAST',
  MetaTypeDesc = 'meta_type_DESC',
  MetaTypeDescNullsFirst = 'meta_type_DESC_NULLS_FIRST',
  MetaTypeDescNullsLast = 'meta_type_DESC_NULLS_LAST',
  MetadataAsc = 'metadata_ASC',
  MetadataAscNullsFirst = 'metadata_ASC_NULLS_FIRST',
  MetadataAscNullsLast = 'metadata_ASC_NULLS_LAST',
  MetadataDesc = 'metadata_DESC',
  MetadataDescNullsFirst = 'metadata_DESC_NULLS_FIRST',
  MetadataDescNullsLast = 'metadata_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameAscNullsLast = 'name_ASC_NULLS_LAST',
  NameDesc = 'name_DESC',
  NameDescNullsFirst = 'name_DESC_NULLS_FIRST',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  NftCountAsc = 'nftCount_ASC',
  NftCountAscNullsFirst = 'nftCount_ASC_NULLS_FIRST',
  NftCountAscNullsLast = 'nftCount_ASC_NULLS_LAST',
  NftCountDesc = 'nftCount_DESC',
  NftCountDescNullsFirst = 'nftCount_DESC_NULLS_FIRST',
  NftCountDescNullsLast = 'nftCount_DESC_NULLS_LAST',
  OwnerCountAsc = 'ownerCount_ASC',
  OwnerCountAscNullsFirst = 'ownerCount_ASC_NULLS_FIRST',
  OwnerCountAscNullsLast = 'ownerCount_ASC_NULLS_LAST',
  OwnerCountDesc = 'ownerCount_DESC',
  OwnerCountDescNullsFirst = 'ownerCount_DESC_NULLS_FIRST',
  OwnerCountDescNullsLast = 'ownerCount_DESC_NULLS_LAST',
  RecipientAsc = 'recipient_ASC',
  RecipientAscNullsFirst = 'recipient_ASC_NULLS_FIRST',
  RecipientAscNullsLast = 'recipient_ASC_NULLS_LAST',
  RecipientDesc = 'recipient_DESC',
  RecipientDescNullsFirst = 'recipient_DESC_NULLS_FIRST',
  RecipientDescNullsLast = 'recipient_DESC_NULLS_LAST',
  RoyaltyAsc = 'royalty_ASC',
  RoyaltyAscNullsFirst = 'royalty_ASC_NULLS_FIRST',
  RoyaltyAscNullsLast = 'royalty_ASC_NULLS_LAST',
  RoyaltyDesc = 'royalty_DESC',
  RoyaltyDescNullsFirst = 'royalty_DESC_NULLS_FIRST',
  RoyaltyDescNullsLast = 'royalty_DESC_NULLS_LAST',
  SettingsEndBlockAsc = 'settings_endBlock_ASC',
  SettingsEndBlockAscNullsFirst = 'settings_endBlock_ASC_NULLS_FIRST',
  SettingsEndBlockAscNullsLast = 'settings_endBlock_ASC_NULLS_LAST',
  SettingsEndBlockDesc = 'settings_endBlock_DESC',
  SettingsEndBlockDescNullsFirst = 'settings_endBlock_DESC_NULLS_FIRST',
  SettingsEndBlockDescNullsLast = 'settings_endBlock_DESC_NULLS_LAST',
  SettingsPriceAsc = 'settings_price_ASC',
  SettingsPriceAscNullsFirst = 'settings_price_ASC_NULLS_FIRST',
  SettingsPriceAscNullsLast = 'settings_price_ASC_NULLS_LAST',
  SettingsPriceDesc = 'settings_price_DESC',
  SettingsPriceDescNullsFirst = 'settings_price_DESC_NULLS_FIRST',
  SettingsPriceDescNullsLast = 'settings_price_DESC_NULLS_LAST',
  SettingsStartBlockAsc = 'settings_startBlock_ASC',
  SettingsStartBlockAscNullsFirst = 'settings_startBlock_ASC_NULLS_FIRST',
  SettingsStartBlockAscNullsLast = 'settings_startBlock_ASC_NULLS_LAST',
  SettingsStartBlockDesc = 'settings_startBlock_DESC',
  SettingsStartBlockDescNullsFirst = 'settings_startBlock_DESC_NULLS_FIRST',
  SettingsStartBlockDescNullsLast = 'settings_startBlock_DESC_NULLS_LAST',
  SettingsValueAsc = 'settings_value_ASC',
  SettingsValueAscNullsFirst = 'settings_value_ASC_NULLS_FIRST',
  SettingsValueAscNullsLast = 'settings_value_ASC_NULLS_LAST',
  SettingsValueDesc = 'settings_value_DESC',
  SettingsValueDescNullsFirst = 'settings_value_DESC_NULLS_FIRST',
  SettingsValueDescNullsLast = 'settings_value_DESC_NULLS_LAST',
  SupplyAsc = 'supply_ASC',
  SupplyAscNullsFirst = 'supply_ASC_NULLS_FIRST',
  SupplyAscNullsLast = 'supply_ASC_NULLS_LAST',
  SupplyDesc = 'supply_DESC',
  SupplyDescNullsFirst = 'supply_DESC_NULLS_FIRST',
  SupplyDescNullsLast = 'supply_DESC_NULLS_LAST',
  TypeAsc = 'type_ASC',
  TypeAscNullsFirst = 'type_ASC_NULLS_FIRST',
  TypeAscNullsLast = 'type_ASC_NULLS_LAST',
  TypeDesc = 'type_DESC',
  TypeDescNullsFirst = 'type_DESC_NULLS_FIRST',
  TypeDescNullsLast = 'type_DESC_NULLS_LAST',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
  UpdatedAtAscNullsLast = 'updatedAt_ASC_NULLS_LAST',
  UpdatedAtDesc = 'updatedAt_DESC',
  UpdatedAtDescNullsFirst = 'updatedAt_DESC_NULLS_FIRST',
  UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
  VersionAsc = 'version_ASC',
  VersionAscNullsFirst = 'version_ASC_NULLS_FIRST',
  VersionAscNullsLast = 'version_ASC_NULLS_LAST',
  VersionDesc = 'version_DESC',
  VersionDescNullsFirst = 'version_DESC_NULLS_FIRST',
  VersionDescNullsLast = 'version_DESC_NULLS_LAST',
  VolumeAsc = 'volume_ASC',
  VolumeAscNullsFirst = 'volume_ASC_NULLS_FIRST',
  VolumeAscNullsLast = 'volume_ASC_NULLS_LAST',
  VolumeDesc = 'volume_DESC',
  VolumeDescNullsFirst = 'volume_DESC_NULLS_FIRST',
  VolumeDescNullsLast = 'volume_DESC_NULLS_LAST',
}

export type CollectionEntityWhereInput = {
  AND?: InputMaybe<Array<CollectionEntityWhereInput>>
  OR?: InputMaybe<Array<CollectionEntityWhereInput>>
  attributes_isNull?: InputMaybe<Scalars['Boolean']['input']>
  baseUri_contains?: InputMaybe<Scalars['String']['input']>
  baseUri_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  baseUri_endsWith?: InputMaybe<Scalars['String']['input']>
  baseUri_eq?: InputMaybe<Scalars['String']['input']>
  baseUri_gt?: InputMaybe<Scalars['String']['input']>
  baseUri_gte?: InputMaybe<Scalars['String']['input']>
  baseUri_in?: InputMaybe<Array<Scalars['String']['input']>>
  baseUri_isNull?: InputMaybe<Scalars['Boolean']['input']>
  baseUri_lt?: InputMaybe<Scalars['String']['input']>
  baseUri_lte?: InputMaybe<Scalars['String']['input']>
  baseUri_not_contains?: InputMaybe<Scalars['String']['input']>
  baseUri_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  baseUri_not_endsWith?: InputMaybe<Scalars['String']['input']>
  baseUri_not_eq?: InputMaybe<Scalars['String']['input']>
  baseUri_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  baseUri_not_startsWith?: InputMaybe<Scalars['String']['input']>
  baseUri_startsWith?: InputMaybe<Scalars['String']['input']>
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
  distribution_eq?: InputMaybe<Scalars['Int']['input']>
  distribution_gt?: InputMaybe<Scalars['Int']['input']>
  distribution_gte?: InputMaybe<Scalars['Int']['input']>
  distribution_in?: InputMaybe<Array<Scalars['Int']['input']>>
  distribution_isNull?: InputMaybe<Scalars['Boolean']['input']>
  distribution_lt?: InputMaybe<Scalars['Int']['input']>
  distribution_lte?: InputMaybe<Scalars['Int']['input']>
  distribution_not_eq?: InputMaybe<Scalars['Int']['input']>
  distribution_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  events_every?: InputMaybe<CollectionEventWhereInput>
  events_none?: InputMaybe<CollectionEventWhereInput>
  events_some?: InputMaybe<CollectionEventWhereInput>
  floor_eq?: InputMaybe<Scalars['BigInt']['input']>
  floor_gt?: InputMaybe<Scalars['BigInt']['input']>
  floor_gte?: InputMaybe<Scalars['BigInt']['input']>
  floor_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  floor_isNull?: InputMaybe<Scalars['Boolean']['input']>
  floor_lt?: InputMaybe<Scalars['BigInt']['input']>
  floor_lte?: InputMaybe<Scalars['BigInt']['input']>
  floor_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  floor_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
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
  kind_eq?: InputMaybe<Kind>
  kind_in?: InputMaybe<Array<Kind>>
  kind_isNull?: InputMaybe<Scalars['Boolean']['input']>
  kind_not_eq?: InputMaybe<Kind>
  kind_not_in?: InputMaybe<Array<Kind>>
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
  ownerCount_eq?: InputMaybe<Scalars['Int']['input']>
  ownerCount_gt?: InputMaybe<Scalars['Int']['input']>
  ownerCount_gte?: InputMaybe<Scalars['Int']['input']>
  ownerCount_in?: InputMaybe<Array<Scalars['Int']['input']>>
  ownerCount_isNull?: InputMaybe<Scalars['Boolean']['input']>
  ownerCount_lt?: InputMaybe<Scalars['Int']['input']>
  ownerCount_lte?: InputMaybe<Scalars['Int']['input']>
  ownerCount_not_eq?: InputMaybe<Scalars['Int']['input']>
  ownerCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
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
  royalty_eq?: InputMaybe<Scalars['Float']['input']>
  royalty_gt?: InputMaybe<Scalars['Float']['input']>
  royalty_gte?: InputMaybe<Scalars['Float']['input']>
  royalty_in?: InputMaybe<Array<Scalars['Float']['input']>>
  royalty_isNull?: InputMaybe<Scalars['Boolean']['input']>
  royalty_lt?: InputMaybe<Scalars['Float']['input']>
  royalty_lte?: InputMaybe<Scalars['Float']['input']>
  royalty_not_eq?: InputMaybe<Scalars['Float']['input']>
  royalty_not_in?: InputMaybe<Array<Scalars['Float']['input']>>
  settings?: InputMaybe<CollectionSettingsWhereInput>
  settings_isNull?: InputMaybe<Scalars['Boolean']['input']>
  supply_eq?: InputMaybe<Scalars['Int']['input']>
  supply_gt?: InputMaybe<Scalars['Int']['input']>
  supply_gte?: InputMaybe<Scalars['Int']['input']>
  supply_in?: InputMaybe<Array<Scalars['Int']['input']>>
  supply_isNull?: InputMaybe<Scalars['Boolean']['input']>
  supply_lt?: InputMaybe<Scalars['Int']['input']>
  supply_lte?: InputMaybe<Scalars['Int']['input']>
  supply_not_eq?: InputMaybe<Scalars['Int']['input']>
  supply_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  type_eq?: InputMaybe<CollectionType>
  type_in?: InputMaybe<Array<CollectionType>>
  type_isNull?: InputMaybe<Scalars['Boolean']['input']>
  type_not_eq?: InputMaybe<CollectionType>
  type_not_in?: InputMaybe<Array<CollectionType>>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  version_eq?: InputMaybe<Scalars['Int']['input']>
  version_gt?: InputMaybe<Scalars['Int']['input']>
  version_gte?: InputMaybe<Scalars['Int']['input']>
  version_in?: InputMaybe<Array<Scalars['Int']['input']>>
  version_isNull?: InputMaybe<Scalars['Boolean']['input']>
  version_lt?: InputMaybe<Scalars['Int']['input']>
  version_lte?: InputMaybe<Scalars['Int']['input']>
  version_not_eq?: InputMaybe<Scalars['Int']['input']>
  version_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
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

export type CollectionEvent = EventType & {
  __typename?: 'CollectionEvent'
  blockNumber?: Maybe<Scalars['BigInt']['output']>
  caller: Scalars['String']['output']
  collection: CollectionEntity
  currentOwner?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  interaction: Interaction
  meta: Scalars['String']['output']
  timestamp: Scalars['DateTime']['output']
}

export type CollectionEventEdge = {
  __typename?: 'CollectionEventEdge'
  cursor: Scalars['String']['output']
  node: CollectionEvent
}

export enum CollectionEventOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  CallerAsc = 'caller_ASC',
  CallerAscNullsFirst = 'caller_ASC_NULLS_FIRST',
  CallerAscNullsLast = 'caller_ASC_NULLS_LAST',
  CallerDesc = 'caller_DESC',
  CallerDescNullsFirst = 'caller_DESC_NULLS_FIRST',
  CallerDescNullsLast = 'caller_DESC_NULLS_LAST',
  CollectionBaseUriAsc = 'collection_baseUri_ASC',
  CollectionBaseUriAscNullsFirst = 'collection_baseUri_ASC_NULLS_FIRST',
  CollectionBaseUriAscNullsLast = 'collection_baseUri_ASC_NULLS_LAST',
  CollectionBaseUriDesc = 'collection_baseUri_DESC',
  CollectionBaseUriDescNullsFirst = 'collection_baseUri_DESC_NULLS_FIRST',
  CollectionBaseUriDescNullsLast = 'collection_baseUri_DESC_NULLS_LAST',
  CollectionBlockNumberAsc = 'collection_blockNumber_ASC',
  CollectionBlockNumberAscNullsFirst = 'collection_blockNumber_ASC_NULLS_FIRST',
  CollectionBlockNumberAscNullsLast = 'collection_blockNumber_ASC_NULLS_LAST',
  CollectionBlockNumberDesc = 'collection_blockNumber_DESC',
  CollectionBlockNumberDescNullsFirst = 'collection_blockNumber_DESC_NULLS_FIRST',
  CollectionBlockNumberDescNullsLast = 'collection_blockNumber_DESC_NULLS_LAST',
  CollectionBurnedAsc = 'collection_burned_ASC',
  CollectionBurnedAscNullsFirst = 'collection_burned_ASC_NULLS_FIRST',
  CollectionBurnedAscNullsLast = 'collection_burned_ASC_NULLS_LAST',
  CollectionBurnedDesc = 'collection_burned_DESC',
  CollectionBurnedDescNullsFirst = 'collection_burned_DESC_NULLS_FIRST',
  CollectionBurnedDescNullsLast = 'collection_burned_DESC_NULLS_LAST',
  CollectionCreatedAtAsc = 'collection_createdAt_ASC',
  CollectionCreatedAtAscNullsFirst = 'collection_createdAt_ASC_NULLS_FIRST',
  CollectionCreatedAtAscNullsLast = 'collection_createdAt_ASC_NULLS_LAST',
  CollectionCreatedAtDesc = 'collection_createdAt_DESC',
  CollectionCreatedAtDescNullsFirst = 'collection_createdAt_DESC_NULLS_FIRST',
  CollectionCreatedAtDescNullsLast = 'collection_createdAt_DESC_NULLS_LAST',
  CollectionCurrentOwnerAsc = 'collection_currentOwner_ASC',
  CollectionCurrentOwnerAscNullsFirst = 'collection_currentOwner_ASC_NULLS_FIRST',
  CollectionCurrentOwnerAscNullsLast = 'collection_currentOwner_ASC_NULLS_LAST',
  CollectionCurrentOwnerDesc = 'collection_currentOwner_DESC',
  CollectionCurrentOwnerDescNullsFirst = 'collection_currentOwner_DESC_NULLS_FIRST',
  CollectionCurrentOwnerDescNullsLast = 'collection_currentOwner_DESC_NULLS_LAST',
  CollectionDistributionAsc = 'collection_distribution_ASC',
  CollectionDistributionAscNullsFirst = 'collection_distribution_ASC_NULLS_FIRST',
  CollectionDistributionAscNullsLast = 'collection_distribution_ASC_NULLS_LAST',
  CollectionDistributionDesc = 'collection_distribution_DESC',
  CollectionDistributionDescNullsFirst = 'collection_distribution_DESC_NULLS_FIRST',
  CollectionDistributionDescNullsLast = 'collection_distribution_DESC_NULLS_LAST',
  CollectionFloorAsc = 'collection_floor_ASC',
  CollectionFloorAscNullsFirst = 'collection_floor_ASC_NULLS_FIRST',
  CollectionFloorAscNullsLast = 'collection_floor_ASC_NULLS_LAST',
  CollectionFloorDesc = 'collection_floor_DESC',
  CollectionFloorDescNullsFirst = 'collection_floor_DESC_NULLS_FIRST',
  CollectionFloorDescNullsLast = 'collection_floor_DESC_NULLS_LAST',
  CollectionHashAsc = 'collection_hash_ASC',
  CollectionHashAscNullsFirst = 'collection_hash_ASC_NULLS_FIRST',
  CollectionHashAscNullsLast = 'collection_hash_ASC_NULLS_LAST',
  CollectionHashDesc = 'collection_hash_DESC',
  CollectionHashDescNullsFirst = 'collection_hash_DESC_NULLS_FIRST',
  CollectionHashDescNullsLast = 'collection_hash_DESC_NULLS_LAST',
  CollectionHighestSaleAsc = 'collection_highestSale_ASC',
  CollectionHighestSaleAscNullsFirst = 'collection_highestSale_ASC_NULLS_FIRST',
  CollectionHighestSaleAscNullsLast = 'collection_highestSale_ASC_NULLS_LAST',
  CollectionHighestSaleDesc = 'collection_highestSale_DESC',
  CollectionHighestSaleDescNullsFirst = 'collection_highestSale_DESC_NULLS_FIRST',
  CollectionHighestSaleDescNullsLast = 'collection_highestSale_DESC_NULLS_LAST',
  CollectionIdAsc = 'collection_id_ASC',
  CollectionIdAscNullsFirst = 'collection_id_ASC_NULLS_FIRST',
  CollectionIdAscNullsLast = 'collection_id_ASC_NULLS_LAST',
  CollectionIdDesc = 'collection_id_DESC',
  CollectionIdDescNullsFirst = 'collection_id_DESC_NULLS_FIRST',
  CollectionIdDescNullsLast = 'collection_id_DESC_NULLS_LAST',
  CollectionImageAsc = 'collection_image_ASC',
  CollectionImageAscNullsFirst = 'collection_image_ASC_NULLS_FIRST',
  CollectionImageAscNullsLast = 'collection_image_ASC_NULLS_LAST',
  CollectionImageDesc = 'collection_image_DESC',
  CollectionImageDescNullsFirst = 'collection_image_DESC_NULLS_FIRST',
  CollectionImageDescNullsLast = 'collection_image_DESC_NULLS_LAST',
  CollectionIssuerAsc = 'collection_issuer_ASC',
  CollectionIssuerAscNullsFirst = 'collection_issuer_ASC_NULLS_FIRST',
  CollectionIssuerAscNullsLast = 'collection_issuer_ASC_NULLS_LAST',
  CollectionIssuerDesc = 'collection_issuer_DESC',
  CollectionIssuerDescNullsFirst = 'collection_issuer_DESC_NULLS_FIRST',
  CollectionIssuerDescNullsLast = 'collection_issuer_DESC_NULLS_LAST',
  CollectionKindAsc = 'collection_kind_ASC',
  CollectionKindAscNullsFirst = 'collection_kind_ASC_NULLS_FIRST',
  CollectionKindAscNullsLast = 'collection_kind_ASC_NULLS_LAST',
  CollectionKindDesc = 'collection_kind_DESC',
  CollectionKindDescNullsFirst = 'collection_kind_DESC_NULLS_FIRST',
  CollectionKindDescNullsLast = 'collection_kind_DESC_NULLS_LAST',
  CollectionMaxAsc = 'collection_max_ASC',
  CollectionMaxAscNullsFirst = 'collection_max_ASC_NULLS_FIRST',
  CollectionMaxAscNullsLast = 'collection_max_ASC_NULLS_LAST',
  CollectionMaxDesc = 'collection_max_DESC',
  CollectionMaxDescNullsFirst = 'collection_max_DESC_NULLS_FIRST',
  CollectionMaxDescNullsLast = 'collection_max_DESC_NULLS_LAST',
  CollectionMediaAsc = 'collection_media_ASC',
  CollectionMediaAscNullsFirst = 'collection_media_ASC_NULLS_FIRST',
  CollectionMediaAscNullsLast = 'collection_media_ASC_NULLS_LAST',
  CollectionMediaDesc = 'collection_media_DESC',
  CollectionMediaDescNullsFirst = 'collection_media_DESC_NULLS_FIRST',
  CollectionMediaDescNullsLast = 'collection_media_DESC_NULLS_LAST',
  CollectionMetadataAsc = 'collection_metadata_ASC',
  CollectionMetadataAscNullsFirst = 'collection_metadata_ASC_NULLS_FIRST',
  CollectionMetadataAscNullsLast = 'collection_metadata_ASC_NULLS_LAST',
  CollectionMetadataDesc = 'collection_metadata_DESC',
  CollectionMetadataDescNullsFirst = 'collection_metadata_DESC_NULLS_FIRST',
  CollectionMetadataDescNullsLast = 'collection_metadata_DESC_NULLS_LAST',
  CollectionNameAsc = 'collection_name_ASC',
  CollectionNameAscNullsFirst = 'collection_name_ASC_NULLS_FIRST',
  CollectionNameAscNullsLast = 'collection_name_ASC_NULLS_LAST',
  CollectionNameDesc = 'collection_name_DESC',
  CollectionNameDescNullsFirst = 'collection_name_DESC_NULLS_FIRST',
  CollectionNameDescNullsLast = 'collection_name_DESC_NULLS_LAST',
  CollectionNftCountAsc = 'collection_nftCount_ASC',
  CollectionNftCountAscNullsFirst = 'collection_nftCount_ASC_NULLS_FIRST',
  CollectionNftCountAscNullsLast = 'collection_nftCount_ASC_NULLS_LAST',
  CollectionNftCountDesc = 'collection_nftCount_DESC',
  CollectionNftCountDescNullsFirst = 'collection_nftCount_DESC_NULLS_FIRST',
  CollectionNftCountDescNullsLast = 'collection_nftCount_DESC_NULLS_LAST',
  CollectionOwnerCountAsc = 'collection_ownerCount_ASC',
  CollectionOwnerCountAscNullsFirst = 'collection_ownerCount_ASC_NULLS_FIRST',
  CollectionOwnerCountAscNullsLast = 'collection_ownerCount_ASC_NULLS_LAST',
  CollectionOwnerCountDesc = 'collection_ownerCount_DESC',
  CollectionOwnerCountDescNullsFirst = 'collection_ownerCount_DESC_NULLS_FIRST',
  CollectionOwnerCountDescNullsLast = 'collection_ownerCount_DESC_NULLS_LAST',
  CollectionRecipientAsc = 'collection_recipient_ASC',
  CollectionRecipientAscNullsFirst = 'collection_recipient_ASC_NULLS_FIRST',
  CollectionRecipientAscNullsLast = 'collection_recipient_ASC_NULLS_LAST',
  CollectionRecipientDesc = 'collection_recipient_DESC',
  CollectionRecipientDescNullsFirst = 'collection_recipient_DESC_NULLS_FIRST',
  CollectionRecipientDescNullsLast = 'collection_recipient_DESC_NULLS_LAST',
  CollectionRoyaltyAsc = 'collection_royalty_ASC',
  CollectionRoyaltyAscNullsFirst = 'collection_royalty_ASC_NULLS_FIRST',
  CollectionRoyaltyAscNullsLast = 'collection_royalty_ASC_NULLS_LAST',
  CollectionRoyaltyDesc = 'collection_royalty_DESC',
  CollectionRoyaltyDescNullsFirst = 'collection_royalty_DESC_NULLS_FIRST',
  CollectionRoyaltyDescNullsLast = 'collection_royalty_DESC_NULLS_LAST',
  CollectionSupplyAsc = 'collection_supply_ASC',
  CollectionSupplyAscNullsFirst = 'collection_supply_ASC_NULLS_FIRST',
  CollectionSupplyAscNullsLast = 'collection_supply_ASC_NULLS_LAST',
  CollectionSupplyDesc = 'collection_supply_DESC',
  CollectionSupplyDescNullsFirst = 'collection_supply_DESC_NULLS_FIRST',
  CollectionSupplyDescNullsLast = 'collection_supply_DESC_NULLS_LAST',
  CollectionTypeAsc = 'collection_type_ASC',
  CollectionTypeAscNullsFirst = 'collection_type_ASC_NULLS_FIRST',
  CollectionTypeAscNullsLast = 'collection_type_ASC_NULLS_LAST',
  CollectionTypeDesc = 'collection_type_DESC',
  CollectionTypeDescNullsFirst = 'collection_type_DESC_NULLS_FIRST',
  CollectionTypeDescNullsLast = 'collection_type_DESC_NULLS_LAST',
  CollectionUpdatedAtAsc = 'collection_updatedAt_ASC',
  CollectionUpdatedAtAscNullsFirst = 'collection_updatedAt_ASC_NULLS_FIRST',
  CollectionUpdatedAtAscNullsLast = 'collection_updatedAt_ASC_NULLS_LAST',
  CollectionUpdatedAtDesc = 'collection_updatedAt_DESC',
  CollectionUpdatedAtDescNullsFirst = 'collection_updatedAt_DESC_NULLS_FIRST',
  CollectionUpdatedAtDescNullsLast = 'collection_updatedAt_DESC_NULLS_LAST',
  CollectionVersionAsc = 'collection_version_ASC',
  CollectionVersionAscNullsFirst = 'collection_version_ASC_NULLS_FIRST',
  CollectionVersionAscNullsLast = 'collection_version_ASC_NULLS_LAST',
  CollectionVersionDesc = 'collection_version_DESC',
  CollectionVersionDescNullsFirst = 'collection_version_DESC_NULLS_FIRST',
  CollectionVersionDescNullsLast = 'collection_version_DESC_NULLS_LAST',
  CollectionVolumeAsc = 'collection_volume_ASC',
  CollectionVolumeAscNullsFirst = 'collection_volume_ASC_NULLS_FIRST',
  CollectionVolumeAscNullsLast = 'collection_volume_ASC_NULLS_LAST',
  CollectionVolumeDesc = 'collection_volume_DESC',
  CollectionVolumeDescNullsFirst = 'collection_volume_DESC_NULLS_FIRST',
  CollectionVolumeDescNullsLast = 'collection_volume_DESC_NULLS_LAST',
  CurrentOwnerAsc = 'currentOwner_ASC',
  CurrentOwnerAscNullsFirst = 'currentOwner_ASC_NULLS_FIRST',
  CurrentOwnerAscNullsLast = 'currentOwner_ASC_NULLS_LAST',
  CurrentOwnerDesc = 'currentOwner_DESC',
  CurrentOwnerDescNullsFirst = 'currentOwner_DESC_NULLS_FIRST',
  CurrentOwnerDescNullsLast = 'currentOwner_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  InteractionAsc = 'interaction_ASC',
  InteractionAscNullsFirst = 'interaction_ASC_NULLS_FIRST',
  InteractionAscNullsLast = 'interaction_ASC_NULLS_LAST',
  InteractionDesc = 'interaction_DESC',
  InteractionDescNullsFirst = 'interaction_DESC_NULLS_FIRST',
  InteractionDescNullsLast = 'interaction_DESC_NULLS_LAST',
  MetaAsc = 'meta_ASC',
  MetaAscNullsFirst = 'meta_ASC_NULLS_FIRST',
  MetaAscNullsLast = 'meta_ASC_NULLS_LAST',
  MetaDesc = 'meta_DESC',
  MetaDescNullsFirst = 'meta_DESC_NULLS_FIRST',
  MetaDescNullsLast = 'meta_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampAscNullsLast = 'timestamp_ASC_NULLS_LAST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsFirst = 'timestamp_DESC_NULLS_FIRST',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST',
}

export type CollectionEventWhereInput = {
  AND?: InputMaybe<Array<CollectionEventWhereInput>>
  OR?: InputMaybe<Array<CollectionEventWhereInput>>
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
  collection?: InputMaybe<CollectionEntityWhereInput>
  collection_isNull?: InputMaybe<Scalars['Boolean']['input']>
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

export type CollectionEventsConnection = {
  __typename?: 'CollectionEventsConnection'
  edges: Array<CollectionEventEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type CollectionSettings = {
  __typename?: 'CollectionSettings'
  endBlock?: Maybe<Scalars['BigInt']['output']>
  price?: Maybe<Scalars['BigInt']['output']>
  startBlock?: Maybe<Scalars['BigInt']['output']>
  value?: Maybe<Scalars['String']['output']>
}

export type CollectionSettingsWhereInput = {
  endBlock_eq?: InputMaybe<Scalars['BigInt']['input']>
  endBlock_gt?: InputMaybe<Scalars['BigInt']['input']>
  endBlock_gte?: InputMaybe<Scalars['BigInt']['input']>
  endBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  endBlock_isNull?: InputMaybe<Scalars['Boolean']['input']>
  endBlock_lt?: InputMaybe<Scalars['BigInt']['input']>
  endBlock_lte?: InputMaybe<Scalars['BigInt']['input']>
  endBlock_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  endBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  price_eq?: InputMaybe<Scalars['BigInt']['input']>
  price_gt?: InputMaybe<Scalars['BigInt']['input']>
  price_gte?: InputMaybe<Scalars['BigInt']['input']>
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  price_isNull?: InputMaybe<Scalars['Boolean']['input']>
  price_lt?: InputMaybe<Scalars['BigInt']['input']>
  price_lte?: InputMaybe<Scalars['BigInt']['input']>
  price_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  startBlock_eq?: InputMaybe<Scalars['BigInt']['input']>
  startBlock_gt?: InputMaybe<Scalars['BigInt']['input']>
  startBlock_gte?: InputMaybe<Scalars['BigInt']['input']>
  startBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  startBlock_isNull?: InputMaybe<Scalars['Boolean']['input']>
  startBlock_lt?: InputMaybe<Scalars['BigInt']['input']>
  startBlock_lte?: InputMaybe<Scalars['BigInt']['input']>
  startBlock_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  startBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
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
}

export enum CollectionType {
  HolderOf = 'HolderOf',
  Issuer = 'Issuer',
  Public = 'Public',
}

export type CountEntity = {
  __typename?: 'CountEntity'
  totalCount: Scalars['Float']['output']
}

export type CountEntityQueryResult = {
  __typename?: 'CountEntityQueryResult'
  total_count: Scalars['Float']['output']
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
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  CallerAsc = 'caller_ASC',
  CallerAscNullsFirst = 'caller_ASC_NULLS_FIRST',
  CallerAscNullsLast = 'caller_ASC_NULLS_LAST',
  CallerDesc = 'caller_DESC',
  CallerDescNullsFirst = 'caller_DESC_NULLS_FIRST',
  CallerDescNullsLast = 'caller_DESC_NULLS_LAST',
  CurrentOwnerAsc = 'currentOwner_ASC',
  CurrentOwnerAscNullsFirst = 'currentOwner_ASC_NULLS_FIRST',
  CurrentOwnerAscNullsLast = 'currentOwner_ASC_NULLS_LAST',
  CurrentOwnerDesc = 'currentOwner_DESC',
  CurrentOwnerDescNullsFirst = 'currentOwner_DESC_NULLS_FIRST',
  CurrentOwnerDescNullsLast = 'currentOwner_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  InteractionAsc = 'interaction_ASC',
  InteractionAscNullsFirst = 'interaction_ASC_NULLS_FIRST',
  InteractionAscNullsLast = 'interaction_ASC_NULLS_LAST',
  InteractionDesc = 'interaction_DESC',
  InteractionDescNullsFirst = 'interaction_DESC_NULLS_FIRST',
  InteractionDescNullsLast = 'interaction_DESC_NULLS_LAST',
  MetaAsc = 'meta_ASC',
  MetaAscNullsFirst = 'meta_ASC_NULLS_FIRST',
  MetaAscNullsLast = 'meta_ASC_NULLS_LAST',
  MetaDesc = 'meta_DESC',
  MetaDescNullsFirst = 'meta_DESC_NULLS_FIRST',
  MetaDescNullsLast = 'meta_DESC_NULLS_LAST',
  NftBlockNumberAsc = 'nft_blockNumber_ASC',
  NftBlockNumberAscNullsFirst = 'nft_blockNumber_ASC_NULLS_FIRST',
  NftBlockNumberAscNullsLast = 'nft_blockNumber_ASC_NULLS_LAST',
  NftBlockNumberDesc = 'nft_blockNumber_DESC',
  NftBlockNumberDescNullsFirst = 'nft_blockNumber_DESC_NULLS_FIRST',
  NftBlockNumberDescNullsLast = 'nft_blockNumber_DESC_NULLS_LAST',
  NftBurnedAsc = 'nft_burned_ASC',
  NftBurnedAscNullsFirst = 'nft_burned_ASC_NULLS_FIRST',
  NftBurnedAscNullsLast = 'nft_burned_ASC_NULLS_LAST',
  NftBurnedDesc = 'nft_burned_DESC',
  NftBurnedDescNullsFirst = 'nft_burned_DESC_NULLS_FIRST',
  NftBurnedDescNullsLast = 'nft_burned_DESC_NULLS_LAST',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtAscNullsFirst = 'nft_createdAt_ASC_NULLS_FIRST',
  NftCreatedAtAscNullsLast = 'nft_createdAt_ASC_NULLS_LAST',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatedAtDescNullsFirst = 'nft_createdAt_DESC_NULLS_FIRST',
  NftCreatedAtDescNullsLast = 'nft_createdAt_DESC_NULLS_LAST',
  NftCurrentOwnerAsc = 'nft_currentOwner_ASC',
  NftCurrentOwnerAscNullsFirst = 'nft_currentOwner_ASC_NULLS_FIRST',
  NftCurrentOwnerAscNullsLast = 'nft_currentOwner_ASC_NULLS_LAST',
  NftCurrentOwnerDesc = 'nft_currentOwner_DESC',
  NftCurrentOwnerDescNullsFirst = 'nft_currentOwner_DESC_NULLS_FIRST',
  NftCurrentOwnerDescNullsLast = 'nft_currentOwner_DESC_NULLS_LAST',
  NftHashAsc = 'nft_hash_ASC',
  NftHashAscNullsFirst = 'nft_hash_ASC_NULLS_FIRST',
  NftHashAscNullsLast = 'nft_hash_ASC_NULLS_LAST',
  NftHashDesc = 'nft_hash_DESC',
  NftHashDescNullsFirst = 'nft_hash_DESC_NULLS_FIRST',
  NftHashDescNullsLast = 'nft_hash_DESC_NULLS_LAST',
  NftIdAsc = 'nft_id_ASC',
  NftIdAscNullsFirst = 'nft_id_ASC_NULLS_FIRST',
  NftIdAscNullsLast = 'nft_id_ASC_NULLS_LAST',
  NftIdDesc = 'nft_id_DESC',
  NftIdDescNullsFirst = 'nft_id_DESC_NULLS_FIRST',
  NftIdDescNullsLast = 'nft_id_DESC_NULLS_LAST',
  NftImageAsc = 'nft_image_ASC',
  NftImageAscNullsFirst = 'nft_image_ASC_NULLS_FIRST',
  NftImageAscNullsLast = 'nft_image_ASC_NULLS_LAST',
  NftImageDesc = 'nft_image_DESC',
  NftImageDescNullsFirst = 'nft_image_DESC_NULLS_FIRST',
  NftImageDescNullsLast = 'nft_image_DESC_NULLS_LAST',
  NftIssuerAsc = 'nft_issuer_ASC',
  NftIssuerAscNullsFirst = 'nft_issuer_ASC_NULLS_FIRST',
  NftIssuerAscNullsLast = 'nft_issuer_ASC_NULLS_LAST',
  NftIssuerDesc = 'nft_issuer_DESC',
  NftIssuerDescNullsFirst = 'nft_issuer_DESC_NULLS_FIRST',
  NftIssuerDescNullsLast = 'nft_issuer_DESC_NULLS_LAST',
  NftLewdAsc = 'nft_lewd_ASC',
  NftLewdAscNullsFirst = 'nft_lewd_ASC_NULLS_FIRST',
  NftLewdAscNullsLast = 'nft_lewd_ASC_NULLS_LAST',
  NftLewdDesc = 'nft_lewd_DESC',
  NftLewdDescNullsFirst = 'nft_lewd_DESC_NULLS_FIRST',
  NftLewdDescNullsLast = 'nft_lewd_DESC_NULLS_LAST',
  NftMediaAsc = 'nft_media_ASC',
  NftMediaAscNullsFirst = 'nft_media_ASC_NULLS_FIRST',
  NftMediaAscNullsLast = 'nft_media_ASC_NULLS_LAST',
  NftMediaDesc = 'nft_media_DESC',
  NftMediaDescNullsFirst = 'nft_media_DESC_NULLS_FIRST',
  NftMediaDescNullsLast = 'nft_media_DESC_NULLS_LAST',
  NftMetadataAsc = 'nft_metadata_ASC',
  NftMetadataAscNullsFirst = 'nft_metadata_ASC_NULLS_FIRST',
  NftMetadataAscNullsLast = 'nft_metadata_ASC_NULLS_LAST',
  NftMetadataDesc = 'nft_metadata_DESC',
  NftMetadataDescNullsFirst = 'nft_metadata_DESC_NULLS_FIRST',
  NftMetadataDescNullsLast = 'nft_metadata_DESC_NULLS_LAST',
  NftNameAsc = 'nft_name_ASC',
  NftNameAscNullsFirst = 'nft_name_ASC_NULLS_FIRST',
  NftNameAscNullsLast = 'nft_name_ASC_NULLS_LAST',
  NftNameDesc = 'nft_name_DESC',
  NftNameDescNullsFirst = 'nft_name_DESC_NULLS_FIRST',
  NftNameDescNullsLast = 'nft_name_DESC_NULLS_LAST',
  NftPriceAsc = 'nft_price_ASC',
  NftPriceAscNullsFirst = 'nft_price_ASC_NULLS_FIRST',
  NftPriceAscNullsLast = 'nft_price_ASC_NULLS_LAST',
  NftPriceDesc = 'nft_price_DESC',
  NftPriceDescNullsFirst = 'nft_price_DESC_NULLS_FIRST',
  NftPriceDescNullsLast = 'nft_price_DESC_NULLS_LAST',
  NftRecipientAsc = 'nft_recipient_ASC',
  NftRecipientAscNullsFirst = 'nft_recipient_ASC_NULLS_FIRST',
  NftRecipientAscNullsLast = 'nft_recipient_ASC_NULLS_LAST',
  NftRecipientDesc = 'nft_recipient_DESC',
  NftRecipientDescNullsFirst = 'nft_recipient_DESC_NULLS_FIRST',
  NftRecipientDescNullsLast = 'nft_recipient_DESC_NULLS_LAST',
  NftRoyaltyAsc = 'nft_royalty_ASC',
  NftRoyaltyAscNullsFirst = 'nft_royalty_ASC_NULLS_FIRST',
  NftRoyaltyAscNullsLast = 'nft_royalty_ASC_NULLS_LAST',
  NftRoyaltyDesc = 'nft_royalty_DESC',
  NftRoyaltyDescNullsFirst = 'nft_royalty_DESC_NULLS_FIRST',
  NftRoyaltyDescNullsLast = 'nft_royalty_DESC_NULLS_LAST',
  NftSnAsc = 'nft_sn_ASC',
  NftSnAscNullsFirst = 'nft_sn_ASC_NULLS_FIRST',
  NftSnAscNullsLast = 'nft_sn_ASC_NULLS_LAST',
  NftSnDesc = 'nft_sn_DESC',
  NftSnDescNullsFirst = 'nft_sn_DESC_NULLS_FIRST',
  NftSnDescNullsLast = 'nft_sn_DESC_NULLS_LAST',
  NftUpdatedAtAsc = 'nft_updatedAt_ASC',
  NftUpdatedAtAscNullsFirst = 'nft_updatedAt_ASC_NULLS_FIRST',
  NftUpdatedAtAscNullsLast = 'nft_updatedAt_ASC_NULLS_LAST',
  NftUpdatedAtDesc = 'nft_updatedAt_DESC',
  NftUpdatedAtDescNullsFirst = 'nft_updatedAt_DESC_NULLS_FIRST',
  NftUpdatedAtDescNullsLast = 'nft_updatedAt_DESC_NULLS_LAST',
  NftVersionAsc = 'nft_version_ASC',
  NftVersionAscNullsFirst = 'nft_version_ASC_NULLS_FIRST',
  NftVersionAscNullsLast = 'nft_version_ASC_NULLS_LAST',
  NftVersionDesc = 'nft_version_DESC',
  NftVersionDescNullsFirst = 'nft_version_DESC_NULLS_FIRST',
  NftVersionDescNullsLast = 'nft_version_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampAscNullsLast = 'timestamp_ASC_NULLS_LAST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsFirst = 'timestamp_DESC_NULLS_FIRST',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST',
}

export type EventType = {
  blockNumber?: Maybe<Scalars['BigInt']['output']>
  caller: Scalars['String']['output']
  currentOwner?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  interaction: Interaction
  meta: Scalars['String']['output']
  timestamp: Scalars['DateTime']['output']
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
}

export type EventsConnection = {
  __typename?: 'EventsConnection'
  edges: Array<EventEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type HistoryEntity = {
  __typename?: 'HistoryEntity'
  count: Scalars['Float']['output']
  date: Scalars['DateTime']['output']
  id: Scalars['String']['output']
}

export enum Interaction {
  Burn = 'BURN',
  Buy = 'BUY',
  Changeissuer = 'CHANGEISSUER',
  Create = 'CREATE',
  Destroy = 'DESTROY',
  List = 'LIST',
  Lock = 'LOCK',
  Mint = 'MINT',
  Offer = 'OFFER',
  PayRoyalty = 'PAY_ROYALTY',
  Send = 'SEND',
  Swap = 'SWAP',
  Unlist = 'UNLIST',
}

export enum Kind {
  Genart = 'genart',
  Mixed = 'mixed',
  Pfp = 'pfp',
  Poap = 'poap',
}

export type LastEventEntity = {
  __typename?: 'LastEventEntity'
  animationUrl?: Maybe<Scalars['String']['output']>
  collectionId: Scalars['String']['output']
  collectionName?: Maybe<Scalars['String']['output']>
  currentOwner: Scalars['String']['output']
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  issuer: Scalars['String']['output']
  metadata: Scalars['String']['output']
  name: Scalars['String']['output']
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
  banner?: Maybe<Scalars['String']['output']>
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  kind?: Maybe<Kind>
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
  AnimationUrlAscNullsFirst = 'animationUrl_ASC_NULLS_FIRST',
  AnimationUrlAscNullsLast = 'animationUrl_ASC_NULLS_LAST',
  AnimationUrlDesc = 'animationUrl_DESC',
  AnimationUrlDescNullsFirst = 'animationUrl_DESC_NULLS_FIRST',
  AnimationUrlDescNullsLast = 'animationUrl_DESC_NULLS_LAST',
  BannerAsc = 'banner_ASC',
  BannerAscNullsFirst = 'banner_ASC_NULLS_FIRST',
  BannerAscNullsLast = 'banner_ASC_NULLS_LAST',
  BannerDesc = 'banner_DESC',
  BannerDescNullsFirst = 'banner_DESC_NULLS_FIRST',
  BannerDescNullsLast = 'banner_DESC_NULLS_LAST',
  DescriptionAsc = 'description_ASC',
  DescriptionAscNullsFirst = 'description_ASC_NULLS_FIRST',
  DescriptionAscNullsLast = 'description_ASC_NULLS_LAST',
  DescriptionDesc = 'description_DESC',
  DescriptionDescNullsFirst = 'description_DESC_NULLS_FIRST',
  DescriptionDescNullsLast = 'description_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  ImageAsc = 'image_ASC',
  ImageAscNullsFirst = 'image_ASC_NULLS_FIRST',
  ImageAscNullsLast = 'image_ASC_NULLS_LAST',
  ImageDesc = 'image_DESC',
  ImageDescNullsFirst = 'image_DESC_NULLS_FIRST',
  ImageDescNullsLast = 'image_DESC_NULLS_LAST',
  KindAsc = 'kind_ASC',
  KindAscNullsFirst = 'kind_ASC_NULLS_FIRST',
  KindAscNullsLast = 'kind_ASC_NULLS_LAST',
  KindDesc = 'kind_DESC',
  KindDescNullsFirst = 'kind_DESC_NULLS_FIRST',
  KindDescNullsLast = 'kind_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameAscNullsLast = 'name_ASC_NULLS_LAST',
  NameDesc = 'name_DESC',
  NameDescNullsFirst = 'name_DESC_NULLS_FIRST',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  TypeAsc = 'type_ASC',
  TypeAscNullsFirst = 'type_ASC_NULLS_FIRST',
  TypeAscNullsLast = 'type_ASC_NULLS_LAST',
  TypeDesc = 'type_DESC',
  TypeDescNullsFirst = 'type_DESC_NULLS_FIRST',
  TypeDescNullsLast = 'type_DESC_NULLS_LAST',
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
  banner_contains?: InputMaybe<Scalars['String']['input']>
  banner_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  banner_endsWith?: InputMaybe<Scalars['String']['input']>
  banner_eq?: InputMaybe<Scalars['String']['input']>
  banner_gt?: InputMaybe<Scalars['String']['input']>
  banner_gte?: InputMaybe<Scalars['String']['input']>
  banner_in?: InputMaybe<Array<Scalars['String']['input']>>
  banner_isNull?: InputMaybe<Scalars['Boolean']['input']>
  banner_lt?: InputMaybe<Scalars['String']['input']>
  banner_lte?: InputMaybe<Scalars['String']['input']>
  banner_not_contains?: InputMaybe<Scalars['String']['input']>
  banner_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>
  banner_not_endsWith?: InputMaybe<Scalars['String']['input']>
  banner_not_eq?: InputMaybe<Scalars['String']['input']>
  banner_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  banner_not_startsWith?: InputMaybe<Scalars['String']['input']>
  banner_startsWith?: InputMaybe<Scalars['String']['input']>
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
  kind_eq?: InputMaybe<Kind>
  kind_in?: InputMaybe<Array<Kind>>
  kind_isNull?: InputMaybe<Scalars['Boolean']['input']>
  kind_not_eq?: InputMaybe<Kind>
  kind_not_in?: InputMaybe<Array<Kind>>
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
  attributes?: Maybe<Array<Attribute>>
  blockNumber?: Maybe<Scalars['BigInt']['output']>
  burned: Scalars['Boolean']['output']
  collection: CollectionEntity
  createdAt: Scalars['DateTime']['output']
  currentOwner: Scalars['String']['output']
  events: Array<Event>
  hash: Scalars['String']['output']
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  issuer: Scalars['String']['output']
  lewd: Scalars['Boolean']['output']
  media?: Maybe<Scalars['String']['output']>
  meta?: Maybe<MetadataEntity>
  metadata?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  price?: Maybe<Scalars['BigInt']['output']>
  recipient?: Maybe<Scalars['String']['output']>
  royalty?: Maybe<Scalars['Float']['output']>
  sn: Scalars['BigInt']['output']
  token?: Maybe<TokenEntity>
  updatedAt: Scalars['DateTime']['output']
  version: Scalars['Int']['output']
}

export type NftEntityEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<EventOrderByInput>>
  where?: InputMaybe<EventWhereInput>
}

export type NftEntityEdge = {
  __typename?: 'NFTEntityEdge'
  cursor: Scalars['String']['output']
  node: NftEntity
}

export enum NftEntityOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  BurnedAsc = 'burned_ASC',
  BurnedAscNullsFirst = 'burned_ASC_NULLS_FIRST',
  BurnedAscNullsLast = 'burned_ASC_NULLS_LAST',
  BurnedDesc = 'burned_DESC',
  BurnedDescNullsFirst = 'burned_DESC_NULLS_FIRST',
  BurnedDescNullsLast = 'burned_DESC_NULLS_LAST',
  CollectionBaseUriAsc = 'collection_baseUri_ASC',
  CollectionBaseUriAscNullsFirst = 'collection_baseUri_ASC_NULLS_FIRST',
  CollectionBaseUriAscNullsLast = 'collection_baseUri_ASC_NULLS_LAST',
  CollectionBaseUriDesc = 'collection_baseUri_DESC',
  CollectionBaseUriDescNullsFirst = 'collection_baseUri_DESC_NULLS_FIRST',
  CollectionBaseUriDescNullsLast = 'collection_baseUri_DESC_NULLS_LAST',
  CollectionBlockNumberAsc = 'collection_blockNumber_ASC',
  CollectionBlockNumberAscNullsFirst = 'collection_blockNumber_ASC_NULLS_FIRST',
  CollectionBlockNumberAscNullsLast = 'collection_blockNumber_ASC_NULLS_LAST',
  CollectionBlockNumberDesc = 'collection_blockNumber_DESC',
  CollectionBlockNumberDescNullsFirst = 'collection_blockNumber_DESC_NULLS_FIRST',
  CollectionBlockNumberDescNullsLast = 'collection_blockNumber_DESC_NULLS_LAST',
  CollectionBurnedAsc = 'collection_burned_ASC',
  CollectionBurnedAscNullsFirst = 'collection_burned_ASC_NULLS_FIRST',
  CollectionBurnedAscNullsLast = 'collection_burned_ASC_NULLS_LAST',
  CollectionBurnedDesc = 'collection_burned_DESC',
  CollectionBurnedDescNullsFirst = 'collection_burned_DESC_NULLS_FIRST',
  CollectionBurnedDescNullsLast = 'collection_burned_DESC_NULLS_LAST',
  CollectionCreatedAtAsc = 'collection_createdAt_ASC',
  CollectionCreatedAtAscNullsFirst = 'collection_createdAt_ASC_NULLS_FIRST',
  CollectionCreatedAtAscNullsLast = 'collection_createdAt_ASC_NULLS_LAST',
  CollectionCreatedAtDesc = 'collection_createdAt_DESC',
  CollectionCreatedAtDescNullsFirst = 'collection_createdAt_DESC_NULLS_FIRST',
  CollectionCreatedAtDescNullsLast = 'collection_createdAt_DESC_NULLS_LAST',
  CollectionCurrentOwnerAsc = 'collection_currentOwner_ASC',
  CollectionCurrentOwnerAscNullsFirst = 'collection_currentOwner_ASC_NULLS_FIRST',
  CollectionCurrentOwnerAscNullsLast = 'collection_currentOwner_ASC_NULLS_LAST',
  CollectionCurrentOwnerDesc = 'collection_currentOwner_DESC',
  CollectionCurrentOwnerDescNullsFirst = 'collection_currentOwner_DESC_NULLS_FIRST',
  CollectionCurrentOwnerDescNullsLast = 'collection_currentOwner_DESC_NULLS_LAST',
  CollectionDistributionAsc = 'collection_distribution_ASC',
  CollectionDistributionAscNullsFirst = 'collection_distribution_ASC_NULLS_FIRST',
  CollectionDistributionAscNullsLast = 'collection_distribution_ASC_NULLS_LAST',
  CollectionDistributionDesc = 'collection_distribution_DESC',
  CollectionDistributionDescNullsFirst = 'collection_distribution_DESC_NULLS_FIRST',
  CollectionDistributionDescNullsLast = 'collection_distribution_DESC_NULLS_LAST',
  CollectionFloorAsc = 'collection_floor_ASC',
  CollectionFloorAscNullsFirst = 'collection_floor_ASC_NULLS_FIRST',
  CollectionFloorAscNullsLast = 'collection_floor_ASC_NULLS_LAST',
  CollectionFloorDesc = 'collection_floor_DESC',
  CollectionFloorDescNullsFirst = 'collection_floor_DESC_NULLS_FIRST',
  CollectionFloorDescNullsLast = 'collection_floor_DESC_NULLS_LAST',
  CollectionHashAsc = 'collection_hash_ASC',
  CollectionHashAscNullsFirst = 'collection_hash_ASC_NULLS_FIRST',
  CollectionHashAscNullsLast = 'collection_hash_ASC_NULLS_LAST',
  CollectionHashDesc = 'collection_hash_DESC',
  CollectionHashDescNullsFirst = 'collection_hash_DESC_NULLS_FIRST',
  CollectionHashDescNullsLast = 'collection_hash_DESC_NULLS_LAST',
  CollectionHighestSaleAsc = 'collection_highestSale_ASC',
  CollectionHighestSaleAscNullsFirst = 'collection_highestSale_ASC_NULLS_FIRST',
  CollectionHighestSaleAscNullsLast = 'collection_highestSale_ASC_NULLS_LAST',
  CollectionHighestSaleDesc = 'collection_highestSale_DESC',
  CollectionHighestSaleDescNullsFirst = 'collection_highestSale_DESC_NULLS_FIRST',
  CollectionHighestSaleDescNullsLast = 'collection_highestSale_DESC_NULLS_LAST',
  CollectionIdAsc = 'collection_id_ASC',
  CollectionIdAscNullsFirst = 'collection_id_ASC_NULLS_FIRST',
  CollectionIdAscNullsLast = 'collection_id_ASC_NULLS_LAST',
  CollectionIdDesc = 'collection_id_DESC',
  CollectionIdDescNullsFirst = 'collection_id_DESC_NULLS_FIRST',
  CollectionIdDescNullsLast = 'collection_id_DESC_NULLS_LAST',
  CollectionImageAsc = 'collection_image_ASC',
  CollectionImageAscNullsFirst = 'collection_image_ASC_NULLS_FIRST',
  CollectionImageAscNullsLast = 'collection_image_ASC_NULLS_LAST',
  CollectionImageDesc = 'collection_image_DESC',
  CollectionImageDescNullsFirst = 'collection_image_DESC_NULLS_FIRST',
  CollectionImageDescNullsLast = 'collection_image_DESC_NULLS_LAST',
  CollectionIssuerAsc = 'collection_issuer_ASC',
  CollectionIssuerAscNullsFirst = 'collection_issuer_ASC_NULLS_FIRST',
  CollectionIssuerAscNullsLast = 'collection_issuer_ASC_NULLS_LAST',
  CollectionIssuerDesc = 'collection_issuer_DESC',
  CollectionIssuerDescNullsFirst = 'collection_issuer_DESC_NULLS_FIRST',
  CollectionIssuerDescNullsLast = 'collection_issuer_DESC_NULLS_LAST',
  CollectionKindAsc = 'collection_kind_ASC',
  CollectionKindAscNullsFirst = 'collection_kind_ASC_NULLS_FIRST',
  CollectionKindAscNullsLast = 'collection_kind_ASC_NULLS_LAST',
  CollectionKindDesc = 'collection_kind_DESC',
  CollectionKindDescNullsFirst = 'collection_kind_DESC_NULLS_FIRST',
  CollectionKindDescNullsLast = 'collection_kind_DESC_NULLS_LAST',
  CollectionMaxAsc = 'collection_max_ASC',
  CollectionMaxAscNullsFirst = 'collection_max_ASC_NULLS_FIRST',
  CollectionMaxAscNullsLast = 'collection_max_ASC_NULLS_LAST',
  CollectionMaxDesc = 'collection_max_DESC',
  CollectionMaxDescNullsFirst = 'collection_max_DESC_NULLS_FIRST',
  CollectionMaxDescNullsLast = 'collection_max_DESC_NULLS_LAST',
  CollectionMediaAsc = 'collection_media_ASC',
  CollectionMediaAscNullsFirst = 'collection_media_ASC_NULLS_FIRST',
  CollectionMediaAscNullsLast = 'collection_media_ASC_NULLS_LAST',
  CollectionMediaDesc = 'collection_media_DESC',
  CollectionMediaDescNullsFirst = 'collection_media_DESC_NULLS_FIRST',
  CollectionMediaDescNullsLast = 'collection_media_DESC_NULLS_LAST',
  CollectionMetadataAsc = 'collection_metadata_ASC',
  CollectionMetadataAscNullsFirst = 'collection_metadata_ASC_NULLS_FIRST',
  CollectionMetadataAscNullsLast = 'collection_metadata_ASC_NULLS_LAST',
  CollectionMetadataDesc = 'collection_metadata_DESC',
  CollectionMetadataDescNullsFirst = 'collection_metadata_DESC_NULLS_FIRST',
  CollectionMetadataDescNullsLast = 'collection_metadata_DESC_NULLS_LAST',
  CollectionNameAsc = 'collection_name_ASC',
  CollectionNameAscNullsFirst = 'collection_name_ASC_NULLS_FIRST',
  CollectionNameAscNullsLast = 'collection_name_ASC_NULLS_LAST',
  CollectionNameDesc = 'collection_name_DESC',
  CollectionNameDescNullsFirst = 'collection_name_DESC_NULLS_FIRST',
  CollectionNameDescNullsLast = 'collection_name_DESC_NULLS_LAST',
  CollectionNftCountAsc = 'collection_nftCount_ASC',
  CollectionNftCountAscNullsFirst = 'collection_nftCount_ASC_NULLS_FIRST',
  CollectionNftCountAscNullsLast = 'collection_nftCount_ASC_NULLS_LAST',
  CollectionNftCountDesc = 'collection_nftCount_DESC',
  CollectionNftCountDescNullsFirst = 'collection_nftCount_DESC_NULLS_FIRST',
  CollectionNftCountDescNullsLast = 'collection_nftCount_DESC_NULLS_LAST',
  CollectionOwnerCountAsc = 'collection_ownerCount_ASC',
  CollectionOwnerCountAscNullsFirst = 'collection_ownerCount_ASC_NULLS_FIRST',
  CollectionOwnerCountAscNullsLast = 'collection_ownerCount_ASC_NULLS_LAST',
  CollectionOwnerCountDesc = 'collection_ownerCount_DESC',
  CollectionOwnerCountDescNullsFirst = 'collection_ownerCount_DESC_NULLS_FIRST',
  CollectionOwnerCountDescNullsLast = 'collection_ownerCount_DESC_NULLS_LAST',
  CollectionRecipientAsc = 'collection_recipient_ASC',
  CollectionRecipientAscNullsFirst = 'collection_recipient_ASC_NULLS_FIRST',
  CollectionRecipientAscNullsLast = 'collection_recipient_ASC_NULLS_LAST',
  CollectionRecipientDesc = 'collection_recipient_DESC',
  CollectionRecipientDescNullsFirst = 'collection_recipient_DESC_NULLS_FIRST',
  CollectionRecipientDescNullsLast = 'collection_recipient_DESC_NULLS_LAST',
  CollectionRoyaltyAsc = 'collection_royalty_ASC',
  CollectionRoyaltyAscNullsFirst = 'collection_royalty_ASC_NULLS_FIRST',
  CollectionRoyaltyAscNullsLast = 'collection_royalty_ASC_NULLS_LAST',
  CollectionRoyaltyDesc = 'collection_royalty_DESC',
  CollectionRoyaltyDescNullsFirst = 'collection_royalty_DESC_NULLS_FIRST',
  CollectionRoyaltyDescNullsLast = 'collection_royalty_DESC_NULLS_LAST',
  CollectionSupplyAsc = 'collection_supply_ASC',
  CollectionSupplyAscNullsFirst = 'collection_supply_ASC_NULLS_FIRST',
  CollectionSupplyAscNullsLast = 'collection_supply_ASC_NULLS_LAST',
  CollectionSupplyDesc = 'collection_supply_DESC',
  CollectionSupplyDescNullsFirst = 'collection_supply_DESC_NULLS_FIRST',
  CollectionSupplyDescNullsLast = 'collection_supply_DESC_NULLS_LAST',
  CollectionTypeAsc = 'collection_type_ASC',
  CollectionTypeAscNullsFirst = 'collection_type_ASC_NULLS_FIRST',
  CollectionTypeAscNullsLast = 'collection_type_ASC_NULLS_LAST',
  CollectionTypeDesc = 'collection_type_DESC',
  CollectionTypeDescNullsFirst = 'collection_type_DESC_NULLS_FIRST',
  CollectionTypeDescNullsLast = 'collection_type_DESC_NULLS_LAST',
  CollectionUpdatedAtAsc = 'collection_updatedAt_ASC',
  CollectionUpdatedAtAscNullsFirst = 'collection_updatedAt_ASC_NULLS_FIRST',
  CollectionUpdatedAtAscNullsLast = 'collection_updatedAt_ASC_NULLS_LAST',
  CollectionUpdatedAtDesc = 'collection_updatedAt_DESC',
  CollectionUpdatedAtDescNullsFirst = 'collection_updatedAt_DESC_NULLS_FIRST',
  CollectionUpdatedAtDescNullsLast = 'collection_updatedAt_DESC_NULLS_LAST',
  CollectionVersionAsc = 'collection_version_ASC',
  CollectionVersionAscNullsFirst = 'collection_version_ASC_NULLS_FIRST',
  CollectionVersionAscNullsLast = 'collection_version_ASC_NULLS_LAST',
  CollectionVersionDesc = 'collection_version_DESC',
  CollectionVersionDescNullsFirst = 'collection_version_DESC_NULLS_FIRST',
  CollectionVersionDescNullsLast = 'collection_version_DESC_NULLS_LAST',
  CollectionVolumeAsc = 'collection_volume_ASC',
  CollectionVolumeAscNullsFirst = 'collection_volume_ASC_NULLS_FIRST',
  CollectionVolumeAscNullsLast = 'collection_volume_ASC_NULLS_LAST',
  CollectionVolumeDesc = 'collection_volume_DESC',
  CollectionVolumeDescNullsFirst = 'collection_volume_DESC_NULLS_FIRST',
  CollectionVolumeDescNullsLast = 'collection_volume_DESC_NULLS_LAST',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
  CreatedAtAscNullsLast = 'createdAt_ASC_NULLS_LAST',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedAtDescNullsFirst = 'createdAt_DESC_NULLS_FIRST',
  CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
  CurrentOwnerAsc = 'currentOwner_ASC',
  CurrentOwnerAscNullsFirst = 'currentOwner_ASC_NULLS_FIRST',
  CurrentOwnerAscNullsLast = 'currentOwner_ASC_NULLS_LAST',
  CurrentOwnerDesc = 'currentOwner_DESC',
  CurrentOwnerDescNullsFirst = 'currentOwner_DESC_NULLS_FIRST',
  CurrentOwnerDescNullsLast = 'currentOwner_DESC_NULLS_LAST',
  HashAsc = 'hash_ASC',
  HashAscNullsFirst = 'hash_ASC_NULLS_FIRST',
  HashAscNullsLast = 'hash_ASC_NULLS_LAST',
  HashDesc = 'hash_DESC',
  HashDescNullsFirst = 'hash_DESC_NULLS_FIRST',
  HashDescNullsLast = 'hash_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  ImageAsc = 'image_ASC',
  ImageAscNullsFirst = 'image_ASC_NULLS_FIRST',
  ImageAscNullsLast = 'image_ASC_NULLS_LAST',
  ImageDesc = 'image_DESC',
  ImageDescNullsFirst = 'image_DESC_NULLS_FIRST',
  ImageDescNullsLast = 'image_DESC_NULLS_LAST',
  IssuerAsc = 'issuer_ASC',
  IssuerAscNullsFirst = 'issuer_ASC_NULLS_FIRST',
  IssuerAscNullsLast = 'issuer_ASC_NULLS_LAST',
  IssuerDesc = 'issuer_DESC',
  IssuerDescNullsFirst = 'issuer_DESC_NULLS_FIRST',
  IssuerDescNullsLast = 'issuer_DESC_NULLS_LAST',
  LewdAsc = 'lewd_ASC',
  LewdAscNullsFirst = 'lewd_ASC_NULLS_FIRST',
  LewdAscNullsLast = 'lewd_ASC_NULLS_LAST',
  LewdDesc = 'lewd_DESC',
  LewdDescNullsFirst = 'lewd_DESC_NULLS_FIRST',
  LewdDescNullsLast = 'lewd_DESC_NULLS_LAST',
  MediaAsc = 'media_ASC',
  MediaAscNullsFirst = 'media_ASC_NULLS_FIRST',
  MediaAscNullsLast = 'media_ASC_NULLS_LAST',
  MediaDesc = 'media_DESC',
  MediaDescNullsFirst = 'media_DESC_NULLS_FIRST',
  MediaDescNullsLast = 'media_DESC_NULLS_LAST',
  MetaAnimationUrlAsc = 'meta_animationUrl_ASC',
  MetaAnimationUrlAscNullsFirst = 'meta_animationUrl_ASC_NULLS_FIRST',
  MetaAnimationUrlAscNullsLast = 'meta_animationUrl_ASC_NULLS_LAST',
  MetaAnimationUrlDesc = 'meta_animationUrl_DESC',
  MetaAnimationUrlDescNullsFirst = 'meta_animationUrl_DESC_NULLS_FIRST',
  MetaAnimationUrlDescNullsLast = 'meta_animationUrl_DESC_NULLS_LAST',
  MetaBannerAsc = 'meta_banner_ASC',
  MetaBannerAscNullsFirst = 'meta_banner_ASC_NULLS_FIRST',
  MetaBannerAscNullsLast = 'meta_banner_ASC_NULLS_LAST',
  MetaBannerDesc = 'meta_banner_DESC',
  MetaBannerDescNullsFirst = 'meta_banner_DESC_NULLS_FIRST',
  MetaBannerDescNullsLast = 'meta_banner_DESC_NULLS_LAST',
  MetaDescriptionAsc = 'meta_description_ASC',
  MetaDescriptionAscNullsFirst = 'meta_description_ASC_NULLS_FIRST',
  MetaDescriptionAscNullsLast = 'meta_description_ASC_NULLS_LAST',
  MetaDescriptionDesc = 'meta_description_DESC',
  MetaDescriptionDescNullsFirst = 'meta_description_DESC_NULLS_FIRST',
  MetaDescriptionDescNullsLast = 'meta_description_DESC_NULLS_LAST',
  MetaIdAsc = 'meta_id_ASC',
  MetaIdAscNullsFirst = 'meta_id_ASC_NULLS_FIRST',
  MetaIdAscNullsLast = 'meta_id_ASC_NULLS_LAST',
  MetaIdDesc = 'meta_id_DESC',
  MetaIdDescNullsFirst = 'meta_id_DESC_NULLS_FIRST',
  MetaIdDescNullsLast = 'meta_id_DESC_NULLS_LAST',
  MetaImageAsc = 'meta_image_ASC',
  MetaImageAscNullsFirst = 'meta_image_ASC_NULLS_FIRST',
  MetaImageAscNullsLast = 'meta_image_ASC_NULLS_LAST',
  MetaImageDesc = 'meta_image_DESC',
  MetaImageDescNullsFirst = 'meta_image_DESC_NULLS_FIRST',
  MetaImageDescNullsLast = 'meta_image_DESC_NULLS_LAST',
  MetaKindAsc = 'meta_kind_ASC',
  MetaKindAscNullsFirst = 'meta_kind_ASC_NULLS_FIRST',
  MetaKindAscNullsLast = 'meta_kind_ASC_NULLS_LAST',
  MetaKindDesc = 'meta_kind_DESC',
  MetaKindDescNullsFirst = 'meta_kind_DESC_NULLS_FIRST',
  MetaKindDescNullsLast = 'meta_kind_DESC_NULLS_LAST',
  MetaNameAsc = 'meta_name_ASC',
  MetaNameAscNullsFirst = 'meta_name_ASC_NULLS_FIRST',
  MetaNameAscNullsLast = 'meta_name_ASC_NULLS_LAST',
  MetaNameDesc = 'meta_name_DESC',
  MetaNameDescNullsFirst = 'meta_name_DESC_NULLS_FIRST',
  MetaNameDescNullsLast = 'meta_name_DESC_NULLS_LAST',
  MetaTypeAsc = 'meta_type_ASC',
  MetaTypeAscNullsFirst = 'meta_type_ASC_NULLS_FIRST',
  MetaTypeAscNullsLast = 'meta_type_ASC_NULLS_LAST',
  MetaTypeDesc = 'meta_type_DESC',
  MetaTypeDescNullsFirst = 'meta_type_DESC_NULLS_FIRST',
  MetaTypeDescNullsLast = 'meta_type_DESC_NULLS_LAST',
  MetadataAsc = 'metadata_ASC',
  MetadataAscNullsFirst = 'metadata_ASC_NULLS_FIRST',
  MetadataAscNullsLast = 'metadata_ASC_NULLS_LAST',
  MetadataDesc = 'metadata_DESC',
  MetadataDescNullsFirst = 'metadata_DESC_NULLS_FIRST',
  MetadataDescNullsLast = 'metadata_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameAscNullsLast = 'name_ASC_NULLS_LAST',
  NameDesc = 'name_DESC',
  NameDescNullsFirst = 'name_DESC_NULLS_FIRST',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  PriceAsc = 'price_ASC',
  PriceAscNullsFirst = 'price_ASC_NULLS_FIRST',
  PriceAscNullsLast = 'price_ASC_NULLS_LAST',
  PriceDesc = 'price_DESC',
  PriceDescNullsFirst = 'price_DESC_NULLS_FIRST',
  PriceDescNullsLast = 'price_DESC_NULLS_LAST',
  RecipientAsc = 'recipient_ASC',
  RecipientAscNullsFirst = 'recipient_ASC_NULLS_FIRST',
  RecipientAscNullsLast = 'recipient_ASC_NULLS_LAST',
  RecipientDesc = 'recipient_DESC',
  RecipientDescNullsFirst = 'recipient_DESC_NULLS_FIRST',
  RecipientDescNullsLast = 'recipient_DESC_NULLS_LAST',
  RoyaltyAsc = 'royalty_ASC',
  RoyaltyAscNullsFirst = 'royalty_ASC_NULLS_FIRST',
  RoyaltyAscNullsLast = 'royalty_ASC_NULLS_LAST',
  RoyaltyDesc = 'royalty_DESC',
  RoyaltyDescNullsFirst = 'royalty_DESC_NULLS_FIRST',
  RoyaltyDescNullsLast = 'royalty_DESC_NULLS_LAST',
  SnAsc = 'sn_ASC',
  SnAscNullsFirst = 'sn_ASC_NULLS_FIRST',
  SnAscNullsLast = 'sn_ASC_NULLS_LAST',
  SnDesc = 'sn_DESC',
  SnDescNullsFirst = 'sn_DESC_NULLS_FIRST',
  SnDescNullsLast = 'sn_DESC_NULLS_LAST',
  TokenBlockNumberAsc = 'token_blockNumber_ASC',
  TokenBlockNumberAscNullsFirst = 'token_blockNumber_ASC_NULLS_FIRST',
  TokenBlockNumberAscNullsLast = 'token_blockNumber_ASC_NULLS_LAST',
  TokenBlockNumberDesc = 'token_blockNumber_DESC',
  TokenBlockNumberDescNullsFirst = 'token_blockNumber_DESC_NULLS_FIRST',
  TokenBlockNumberDescNullsLast = 'token_blockNumber_DESC_NULLS_LAST',
  TokenCountAsc = 'token_count_ASC',
  TokenCountAscNullsFirst = 'token_count_ASC_NULLS_FIRST',
  TokenCountAscNullsLast = 'token_count_ASC_NULLS_LAST',
  TokenCountDesc = 'token_count_DESC',
  TokenCountDescNullsFirst = 'token_count_DESC_NULLS_FIRST',
  TokenCountDescNullsLast = 'token_count_DESC_NULLS_LAST',
  TokenCreatedAtAsc = 'token_createdAt_ASC',
  TokenCreatedAtAscNullsFirst = 'token_createdAt_ASC_NULLS_FIRST',
  TokenCreatedAtAscNullsLast = 'token_createdAt_ASC_NULLS_LAST',
  TokenCreatedAtDesc = 'token_createdAt_DESC',
  TokenCreatedAtDescNullsFirst = 'token_createdAt_DESC_NULLS_FIRST',
  TokenCreatedAtDescNullsLast = 'token_createdAt_DESC_NULLS_LAST',
  TokenDeletedAsc = 'token_deleted_ASC',
  TokenDeletedAscNullsFirst = 'token_deleted_ASC_NULLS_FIRST',
  TokenDeletedAscNullsLast = 'token_deleted_ASC_NULLS_LAST',
  TokenDeletedDesc = 'token_deleted_DESC',
  TokenDeletedDescNullsFirst = 'token_deleted_DESC_NULLS_FIRST',
  TokenDeletedDescNullsLast = 'token_deleted_DESC_NULLS_LAST',
  TokenHashAsc = 'token_hash_ASC',
  TokenHashAscNullsFirst = 'token_hash_ASC_NULLS_FIRST',
  TokenHashAscNullsLast = 'token_hash_ASC_NULLS_LAST',
  TokenHashDesc = 'token_hash_DESC',
  TokenHashDescNullsFirst = 'token_hash_DESC_NULLS_FIRST',
  TokenHashDescNullsLast = 'token_hash_DESC_NULLS_LAST',
  TokenIdAsc = 'token_id_ASC',
  TokenIdAscNullsFirst = 'token_id_ASC_NULLS_FIRST',
  TokenIdAscNullsLast = 'token_id_ASC_NULLS_LAST',
  TokenIdDesc = 'token_id_DESC',
  TokenIdDescNullsFirst = 'token_id_DESC_NULLS_FIRST',
  TokenIdDescNullsLast = 'token_id_DESC_NULLS_LAST',
  TokenImageAsc = 'token_image_ASC',
  TokenImageAscNullsFirst = 'token_image_ASC_NULLS_FIRST',
  TokenImageAscNullsLast = 'token_image_ASC_NULLS_LAST',
  TokenImageDesc = 'token_image_DESC',
  TokenImageDescNullsFirst = 'token_image_DESC_NULLS_FIRST',
  TokenImageDescNullsLast = 'token_image_DESC_NULLS_LAST',
  TokenMediaAsc = 'token_media_ASC',
  TokenMediaAscNullsFirst = 'token_media_ASC_NULLS_FIRST',
  TokenMediaAscNullsLast = 'token_media_ASC_NULLS_LAST',
  TokenMediaDesc = 'token_media_DESC',
  TokenMediaDescNullsFirst = 'token_media_DESC_NULLS_FIRST',
  TokenMediaDescNullsLast = 'token_media_DESC_NULLS_LAST',
  TokenMetadataAsc = 'token_metadata_ASC',
  TokenMetadataAscNullsFirst = 'token_metadata_ASC_NULLS_FIRST',
  TokenMetadataAscNullsLast = 'token_metadata_ASC_NULLS_LAST',
  TokenMetadataDesc = 'token_metadata_DESC',
  TokenMetadataDescNullsFirst = 'token_metadata_DESC_NULLS_FIRST',
  TokenMetadataDescNullsLast = 'token_metadata_DESC_NULLS_LAST',
  TokenNameAsc = 'token_name_ASC',
  TokenNameAscNullsFirst = 'token_name_ASC_NULLS_FIRST',
  TokenNameAscNullsLast = 'token_name_ASC_NULLS_LAST',
  TokenNameDesc = 'token_name_DESC',
  TokenNameDescNullsFirst = 'token_name_DESC_NULLS_FIRST',
  TokenNameDescNullsLast = 'token_name_DESC_NULLS_LAST',
  TokenSupplyAsc = 'token_supply_ASC',
  TokenSupplyAscNullsFirst = 'token_supply_ASC_NULLS_FIRST',
  TokenSupplyAscNullsLast = 'token_supply_ASC_NULLS_LAST',
  TokenSupplyDesc = 'token_supply_DESC',
  TokenSupplyDescNullsFirst = 'token_supply_DESC_NULLS_FIRST',
  TokenSupplyDescNullsLast = 'token_supply_DESC_NULLS_LAST',
  TokenUpdatedAtAsc = 'token_updatedAt_ASC',
  TokenUpdatedAtAscNullsFirst = 'token_updatedAt_ASC_NULLS_FIRST',
  TokenUpdatedAtAscNullsLast = 'token_updatedAt_ASC_NULLS_LAST',
  TokenUpdatedAtDesc = 'token_updatedAt_DESC',
  TokenUpdatedAtDescNullsFirst = 'token_updatedAt_DESC_NULLS_FIRST',
  TokenUpdatedAtDescNullsLast = 'token_updatedAt_DESC_NULLS_LAST',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
  UpdatedAtAscNullsLast = 'updatedAt_ASC_NULLS_LAST',
  UpdatedAtDesc = 'updatedAt_DESC',
  UpdatedAtDescNullsFirst = 'updatedAt_DESC_NULLS_FIRST',
  UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
  VersionAsc = 'version_ASC',
  VersionAscNullsFirst = 'version_ASC_NULLS_FIRST',
  VersionAscNullsLast = 'version_ASC_NULLS_LAST',
  VersionDesc = 'version_DESC',
  VersionDescNullsFirst = 'version_DESC_NULLS_FIRST',
  VersionDescNullsLast = 'version_DESC_NULLS_LAST',
}

export type NftEntityWhereInput = {
  AND?: InputMaybe<Array<NftEntityWhereInput>>
  OR?: InputMaybe<Array<NftEntityWhereInput>>
  attributes_isNull?: InputMaybe<Scalars['Boolean']['input']>
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
  lewd_eq?: InputMaybe<Scalars['Boolean']['input']>
  lewd_isNull?: InputMaybe<Scalars['Boolean']['input']>
  lewd_not_eq?: InputMaybe<Scalars['Boolean']['input']>
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
  royalty_eq?: InputMaybe<Scalars['Float']['input']>
  royalty_gt?: InputMaybe<Scalars['Float']['input']>
  royalty_gte?: InputMaybe<Scalars['Float']['input']>
  royalty_in?: InputMaybe<Array<Scalars['Float']['input']>>
  royalty_isNull?: InputMaybe<Scalars['Boolean']['input']>
  royalty_lt?: InputMaybe<Scalars['Float']['input']>
  royalty_lte?: InputMaybe<Scalars['Float']['input']>
  royalty_not_eq?: InputMaybe<Scalars['Float']['input']>
  royalty_not_in?: InputMaybe<Array<Scalars['Float']['input']>>
  sn_eq?: InputMaybe<Scalars['BigInt']['input']>
  sn_gt?: InputMaybe<Scalars['BigInt']['input']>
  sn_gte?: InputMaybe<Scalars['BigInt']['input']>
  sn_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  sn_isNull?: InputMaybe<Scalars['Boolean']['input']>
  sn_lt?: InputMaybe<Scalars['BigInt']['input']>
  sn_lte?: InputMaybe<Scalars['BigInt']['input']>
  sn_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  sn_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  token?: InputMaybe<TokenEntityWhereInput>
  token_isNull?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  version_eq?: InputMaybe<Scalars['Int']['input']>
  version_gt?: InputMaybe<Scalars['Int']['input']>
  version_gte?: InputMaybe<Scalars['Int']['input']>
  version_in?: InputMaybe<Array<Scalars['Int']['input']>>
  version_isNull?: InputMaybe<Scalars['Boolean']['input']>
  version_lt?: InputMaybe<Scalars['Int']['input']>
  version_lte?: InputMaybe<Scalars['Int']['input']>
  version_not_eq?: InputMaybe<Scalars['Int']['input']>
  version_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
}

export type Offer = {
  __typename?: 'Offer'
  blockNumber: Scalars['BigInt']['output']
  caller: Scalars['String']['output']
  considered: CollectionEntity
  createdAt: Scalars['DateTime']['output']
  desired?: Maybe<NftEntity>
  expiration: Scalars['BigInt']['output']
  id: Scalars['String']['output']
  nft: NftEntity
  price: Scalars['BigInt']['output']
  status: TradeStatus
  updatedAt?: Maybe<Scalars['DateTime']['output']>
}

export type OfferEdge = {
  __typename?: 'OfferEdge'
  cursor: Scalars['String']['output']
  node: Offer
}

export enum OfferOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  CallerAsc = 'caller_ASC',
  CallerAscNullsFirst = 'caller_ASC_NULLS_FIRST',
  CallerAscNullsLast = 'caller_ASC_NULLS_LAST',
  CallerDesc = 'caller_DESC',
  CallerDescNullsFirst = 'caller_DESC_NULLS_FIRST',
  CallerDescNullsLast = 'caller_DESC_NULLS_LAST',
  ConsideredBaseUriAsc = 'considered_baseUri_ASC',
  ConsideredBaseUriAscNullsFirst = 'considered_baseUri_ASC_NULLS_FIRST',
  ConsideredBaseUriAscNullsLast = 'considered_baseUri_ASC_NULLS_LAST',
  ConsideredBaseUriDesc = 'considered_baseUri_DESC',
  ConsideredBaseUriDescNullsFirst = 'considered_baseUri_DESC_NULLS_FIRST',
  ConsideredBaseUriDescNullsLast = 'considered_baseUri_DESC_NULLS_LAST',
  ConsideredBlockNumberAsc = 'considered_blockNumber_ASC',
  ConsideredBlockNumberAscNullsFirst = 'considered_blockNumber_ASC_NULLS_FIRST',
  ConsideredBlockNumberAscNullsLast = 'considered_blockNumber_ASC_NULLS_LAST',
  ConsideredBlockNumberDesc = 'considered_blockNumber_DESC',
  ConsideredBlockNumberDescNullsFirst = 'considered_blockNumber_DESC_NULLS_FIRST',
  ConsideredBlockNumberDescNullsLast = 'considered_blockNumber_DESC_NULLS_LAST',
  ConsideredBurnedAsc = 'considered_burned_ASC',
  ConsideredBurnedAscNullsFirst = 'considered_burned_ASC_NULLS_FIRST',
  ConsideredBurnedAscNullsLast = 'considered_burned_ASC_NULLS_LAST',
  ConsideredBurnedDesc = 'considered_burned_DESC',
  ConsideredBurnedDescNullsFirst = 'considered_burned_DESC_NULLS_FIRST',
  ConsideredBurnedDescNullsLast = 'considered_burned_DESC_NULLS_LAST',
  ConsideredCreatedAtAsc = 'considered_createdAt_ASC',
  ConsideredCreatedAtAscNullsFirst = 'considered_createdAt_ASC_NULLS_FIRST',
  ConsideredCreatedAtAscNullsLast = 'considered_createdAt_ASC_NULLS_LAST',
  ConsideredCreatedAtDesc = 'considered_createdAt_DESC',
  ConsideredCreatedAtDescNullsFirst = 'considered_createdAt_DESC_NULLS_FIRST',
  ConsideredCreatedAtDescNullsLast = 'considered_createdAt_DESC_NULLS_LAST',
  ConsideredCurrentOwnerAsc = 'considered_currentOwner_ASC',
  ConsideredCurrentOwnerAscNullsFirst = 'considered_currentOwner_ASC_NULLS_FIRST',
  ConsideredCurrentOwnerAscNullsLast = 'considered_currentOwner_ASC_NULLS_LAST',
  ConsideredCurrentOwnerDesc = 'considered_currentOwner_DESC',
  ConsideredCurrentOwnerDescNullsFirst = 'considered_currentOwner_DESC_NULLS_FIRST',
  ConsideredCurrentOwnerDescNullsLast = 'considered_currentOwner_DESC_NULLS_LAST',
  ConsideredDistributionAsc = 'considered_distribution_ASC',
  ConsideredDistributionAscNullsFirst = 'considered_distribution_ASC_NULLS_FIRST',
  ConsideredDistributionAscNullsLast = 'considered_distribution_ASC_NULLS_LAST',
  ConsideredDistributionDesc = 'considered_distribution_DESC',
  ConsideredDistributionDescNullsFirst = 'considered_distribution_DESC_NULLS_FIRST',
  ConsideredDistributionDescNullsLast = 'considered_distribution_DESC_NULLS_LAST',
  ConsideredFloorAsc = 'considered_floor_ASC',
  ConsideredFloorAscNullsFirst = 'considered_floor_ASC_NULLS_FIRST',
  ConsideredFloorAscNullsLast = 'considered_floor_ASC_NULLS_LAST',
  ConsideredFloorDesc = 'considered_floor_DESC',
  ConsideredFloorDescNullsFirst = 'considered_floor_DESC_NULLS_FIRST',
  ConsideredFloorDescNullsLast = 'considered_floor_DESC_NULLS_LAST',
  ConsideredHashAsc = 'considered_hash_ASC',
  ConsideredHashAscNullsFirst = 'considered_hash_ASC_NULLS_FIRST',
  ConsideredHashAscNullsLast = 'considered_hash_ASC_NULLS_LAST',
  ConsideredHashDesc = 'considered_hash_DESC',
  ConsideredHashDescNullsFirst = 'considered_hash_DESC_NULLS_FIRST',
  ConsideredHashDescNullsLast = 'considered_hash_DESC_NULLS_LAST',
  ConsideredHighestSaleAsc = 'considered_highestSale_ASC',
  ConsideredHighestSaleAscNullsFirst = 'considered_highestSale_ASC_NULLS_FIRST',
  ConsideredHighestSaleAscNullsLast = 'considered_highestSale_ASC_NULLS_LAST',
  ConsideredHighestSaleDesc = 'considered_highestSale_DESC',
  ConsideredHighestSaleDescNullsFirst = 'considered_highestSale_DESC_NULLS_FIRST',
  ConsideredHighestSaleDescNullsLast = 'considered_highestSale_DESC_NULLS_LAST',
  ConsideredIdAsc = 'considered_id_ASC',
  ConsideredIdAscNullsFirst = 'considered_id_ASC_NULLS_FIRST',
  ConsideredIdAscNullsLast = 'considered_id_ASC_NULLS_LAST',
  ConsideredIdDesc = 'considered_id_DESC',
  ConsideredIdDescNullsFirst = 'considered_id_DESC_NULLS_FIRST',
  ConsideredIdDescNullsLast = 'considered_id_DESC_NULLS_LAST',
  ConsideredImageAsc = 'considered_image_ASC',
  ConsideredImageAscNullsFirst = 'considered_image_ASC_NULLS_FIRST',
  ConsideredImageAscNullsLast = 'considered_image_ASC_NULLS_LAST',
  ConsideredImageDesc = 'considered_image_DESC',
  ConsideredImageDescNullsFirst = 'considered_image_DESC_NULLS_FIRST',
  ConsideredImageDescNullsLast = 'considered_image_DESC_NULLS_LAST',
  ConsideredIssuerAsc = 'considered_issuer_ASC',
  ConsideredIssuerAscNullsFirst = 'considered_issuer_ASC_NULLS_FIRST',
  ConsideredIssuerAscNullsLast = 'considered_issuer_ASC_NULLS_LAST',
  ConsideredIssuerDesc = 'considered_issuer_DESC',
  ConsideredIssuerDescNullsFirst = 'considered_issuer_DESC_NULLS_FIRST',
  ConsideredIssuerDescNullsLast = 'considered_issuer_DESC_NULLS_LAST',
  ConsideredKindAsc = 'considered_kind_ASC',
  ConsideredKindAscNullsFirst = 'considered_kind_ASC_NULLS_FIRST',
  ConsideredKindAscNullsLast = 'considered_kind_ASC_NULLS_LAST',
  ConsideredKindDesc = 'considered_kind_DESC',
  ConsideredKindDescNullsFirst = 'considered_kind_DESC_NULLS_FIRST',
  ConsideredKindDescNullsLast = 'considered_kind_DESC_NULLS_LAST',
  ConsideredMaxAsc = 'considered_max_ASC',
  ConsideredMaxAscNullsFirst = 'considered_max_ASC_NULLS_FIRST',
  ConsideredMaxAscNullsLast = 'considered_max_ASC_NULLS_LAST',
  ConsideredMaxDesc = 'considered_max_DESC',
  ConsideredMaxDescNullsFirst = 'considered_max_DESC_NULLS_FIRST',
  ConsideredMaxDescNullsLast = 'considered_max_DESC_NULLS_LAST',
  ConsideredMediaAsc = 'considered_media_ASC',
  ConsideredMediaAscNullsFirst = 'considered_media_ASC_NULLS_FIRST',
  ConsideredMediaAscNullsLast = 'considered_media_ASC_NULLS_LAST',
  ConsideredMediaDesc = 'considered_media_DESC',
  ConsideredMediaDescNullsFirst = 'considered_media_DESC_NULLS_FIRST',
  ConsideredMediaDescNullsLast = 'considered_media_DESC_NULLS_LAST',
  ConsideredMetadataAsc = 'considered_metadata_ASC',
  ConsideredMetadataAscNullsFirst = 'considered_metadata_ASC_NULLS_FIRST',
  ConsideredMetadataAscNullsLast = 'considered_metadata_ASC_NULLS_LAST',
  ConsideredMetadataDesc = 'considered_metadata_DESC',
  ConsideredMetadataDescNullsFirst = 'considered_metadata_DESC_NULLS_FIRST',
  ConsideredMetadataDescNullsLast = 'considered_metadata_DESC_NULLS_LAST',
  ConsideredNameAsc = 'considered_name_ASC',
  ConsideredNameAscNullsFirst = 'considered_name_ASC_NULLS_FIRST',
  ConsideredNameAscNullsLast = 'considered_name_ASC_NULLS_LAST',
  ConsideredNameDesc = 'considered_name_DESC',
  ConsideredNameDescNullsFirst = 'considered_name_DESC_NULLS_FIRST',
  ConsideredNameDescNullsLast = 'considered_name_DESC_NULLS_LAST',
  ConsideredNftCountAsc = 'considered_nftCount_ASC',
  ConsideredNftCountAscNullsFirst = 'considered_nftCount_ASC_NULLS_FIRST',
  ConsideredNftCountAscNullsLast = 'considered_nftCount_ASC_NULLS_LAST',
  ConsideredNftCountDesc = 'considered_nftCount_DESC',
  ConsideredNftCountDescNullsFirst = 'considered_nftCount_DESC_NULLS_FIRST',
  ConsideredNftCountDescNullsLast = 'considered_nftCount_DESC_NULLS_LAST',
  ConsideredOwnerCountAsc = 'considered_ownerCount_ASC',
  ConsideredOwnerCountAscNullsFirst = 'considered_ownerCount_ASC_NULLS_FIRST',
  ConsideredOwnerCountAscNullsLast = 'considered_ownerCount_ASC_NULLS_LAST',
  ConsideredOwnerCountDesc = 'considered_ownerCount_DESC',
  ConsideredOwnerCountDescNullsFirst = 'considered_ownerCount_DESC_NULLS_FIRST',
  ConsideredOwnerCountDescNullsLast = 'considered_ownerCount_DESC_NULLS_LAST',
  ConsideredRecipientAsc = 'considered_recipient_ASC',
  ConsideredRecipientAscNullsFirst = 'considered_recipient_ASC_NULLS_FIRST',
  ConsideredRecipientAscNullsLast = 'considered_recipient_ASC_NULLS_LAST',
  ConsideredRecipientDesc = 'considered_recipient_DESC',
  ConsideredRecipientDescNullsFirst = 'considered_recipient_DESC_NULLS_FIRST',
  ConsideredRecipientDescNullsLast = 'considered_recipient_DESC_NULLS_LAST',
  ConsideredRoyaltyAsc = 'considered_royalty_ASC',
  ConsideredRoyaltyAscNullsFirst = 'considered_royalty_ASC_NULLS_FIRST',
  ConsideredRoyaltyAscNullsLast = 'considered_royalty_ASC_NULLS_LAST',
  ConsideredRoyaltyDesc = 'considered_royalty_DESC',
  ConsideredRoyaltyDescNullsFirst = 'considered_royalty_DESC_NULLS_FIRST',
  ConsideredRoyaltyDescNullsLast = 'considered_royalty_DESC_NULLS_LAST',
  ConsideredSupplyAsc = 'considered_supply_ASC',
  ConsideredSupplyAscNullsFirst = 'considered_supply_ASC_NULLS_FIRST',
  ConsideredSupplyAscNullsLast = 'considered_supply_ASC_NULLS_LAST',
  ConsideredSupplyDesc = 'considered_supply_DESC',
  ConsideredSupplyDescNullsFirst = 'considered_supply_DESC_NULLS_FIRST',
  ConsideredSupplyDescNullsLast = 'considered_supply_DESC_NULLS_LAST',
  ConsideredTypeAsc = 'considered_type_ASC',
  ConsideredTypeAscNullsFirst = 'considered_type_ASC_NULLS_FIRST',
  ConsideredTypeAscNullsLast = 'considered_type_ASC_NULLS_LAST',
  ConsideredTypeDesc = 'considered_type_DESC',
  ConsideredTypeDescNullsFirst = 'considered_type_DESC_NULLS_FIRST',
  ConsideredTypeDescNullsLast = 'considered_type_DESC_NULLS_LAST',
  ConsideredUpdatedAtAsc = 'considered_updatedAt_ASC',
  ConsideredUpdatedAtAscNullsFirst = 'considered_updatedAt_ASC_NULLS_FIRST',
  ConsideredUpdatedAtAscNullsLast = 'considered_updatedAt_ASC_NULLS_LAST',
  ConsideredUpdatedAtDesc = 'considered_updatedAt_DESC',
  ConsideredUpdatedAtDescNullsFirst = 'considered_updatedAt_DESC_NULLS_FIRST',
  ConsideredUpdatedAtDescNullsLast = 'considered_updatedAt_DESC_NULLS_LAST',
  ConsideredVersionAsc = 'considered_version_ASC',
  ConsideredVersionAscNullsFirst = 'considered_version_ASC_NULLS_FIRST',
  ConsideredVersionAscNullsLast = 'considered_version_ASC_NULLS_LAST',
  ConsideredVersionDesc = 'considered_version_DESC',
  ConsideredVersionDescNullsFirst = 'considered_version_DESC_NULLS_FIRST',
  ConsideredVersionDescNullsLast = 'considered_version_DESC_NULLS_LAST',
  ConsideredVolumeAsc = 'considered_volume_ASC',
  ConsideredVolumeAscNullsFirst = 'considered_volume_ASC_NULLS_FIRST',
  ConsideredVolumeAscNullsLast = 'considered_volume_ASC_NULLS_LAST',
  ConsideredVolumeDesc = 'considered_volume_DESC',
  ConsideredVolumeDescNullsFirst = 'considered_volume_DESC_NULLS_FIRST',
  ConsideredVolumeDescNullsLast = 'considered_volume_DESC_NULLS_LAST',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
  CreatedAtAscNullsLast = 'createdAt_ASC_NULLS_LAST',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedAtDescNullsFirst = 'createdAt_DESC_NULLS_FIRST',
  CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
  DesiredBlockNumberAsc = 'desired_blockNumber_ASC',
  DesiredBlockNumberAscNullsFirst = 'desired_blockNumber_ASC_NULLS_FIRST',
  DesiredBlockNumberAscNullsLast = 'desired_blockNumber_ASC_NULLS_LAST',
  DesiredBlockNumberDesc = 'desired_blockNumber_DESC',
  DesiredBlockNumberDescNullsFirst = 'desired_blockNumber_DESC_NULLS_FIRST',
  DesiredBlockNumberDescNullsLast = 'desired_blockNumber_DESC_NULLS_LAST',
  DesiredBurnedAsc = 'desired_burned_ASC',
  DesiredBurnedAscNullsFirst = 'desired_burned_ASC_NULLS_FIRST',
  DesiredBurnedAscNullsLast = 'desired_burned_ASC_NULLS_LAST',
  DesiredBurnedDesc = 'desired_burned_DESC',
  DesiredBurnedDescNullsFirst = 'desired_burned_DESC_NULLS_FIRST',
  DesiredBurnedDescNullsLast = 'desired_burned_DESC_NULLS_LAST',
  DesiredCreatedAtAsc = 'desired_createdAt_ASC',
  DesiredCreatedAtAscNullsFirst = 'desired_createdAt_ASC_NULLS_FIRST',
  DesiredCreatedAtAscNullsLast = 'desired_createdAt_ASC_NULLS_LAST',
  DesiredCreatedAtDesc = 'desired_createdAt_DESC',
  DesiredCreatedAtDescNullsFirst = 'desired_createdAt_DESC_NULLS_FIRST',
  DesiredCreatedAtDescNullsLast = 'desired_createdAt_DESC_NULLS_LAST',
  DesiredCurrentOwnerAsc = 'desired_currentOwner_ASC',
  DesiredCurrentOwnerAscNullsFirst = 'desired_currentOwner_ASC_NULLS_FIRST',
  DesiredCurrentOwnerAscNullsLast = 'desired_currentOwner_ASC_NULLS_LAST',
  DesiredCurrentOwnerDesc = 'desired_currentOwner_DESC',
  DesiredCurrentOwnerDescNullsFirst = 'desired_currentOwner_DESC_NULLS_FIRST',
  DesiredCurrentOwnerDescNullsLast = 'desired_currentOwner_DESC_NULLS_LAST',
  DesiredHashAsc = 'desired_hash_ASC',
  DesiredHashAscNullsFirst = 'desired_hash_ASC_NULLS_FIRST',
  DesiredHashAscNullsLast = 'desired_hash_ASC_NULLS_LAST',
  DesiredHashDesc = 'desired_hash_DESC',
  DesiredHashDescNullsFirst = 'desired_hash_DESC_NULLS_FIRST',
  DesiredHashDescNullsLast = 'desired_hash_DESC_NULLS_LAST',
  DesiredIdAsc = 'desired_id_ASC',
  DesiredIdAscNullsFirst = 'desired_id_ASC_NULLS_FIRST',
  DesiredIdAscNullsLast = 'desired_id_ASC_NULLS_LAST',
  DesiredIdDesc = 'desired_id_DESC',
  DesiredIdDescNullsFirst = 'desired_id_DESC_NULLS_FIRST',
  DesiredIdDescNullsLast = 'desired_id_DESC_NULLS_LAST',
  DesiredImageAsc = 'desired_image_ASC',
  DesiredImageAscNullsFirst = 'desired_image_ASC_NULLS_FIRST',
  DesiredImageAscNullsLast = 'desired_image_ASC_NULLS_LAST',
  DesiredImageDesc = 'desired_image_DESC',
  DesiredImageDescNullsFirst = 'desired_image_DESC_NULLS_FIRST',
  DesiredImageDescNullsLast = 'desired_image_DESC_NULLS_LAST',
  DesiredIssuerAsc = 'desired_issuer_ASC',
  DesiredIssuerAscNullsFirst = 'desired_issuer_ASC_NULLS_FIRST',
  DesiredIssuerAscNullsLast = 'desired_issuer_ASC_NULLS_LAST',
  DesiredIssuerDesc = 'desired_issuer_DESC',
  DesiredIssuerDescNullsFirst = 'desired_issuer_DESC_NULLS_FIRST',
  DesiredIssuerDescNullsLast = 'desired_issuer_DESC_NULLS_LAST',
  DesiredLewdAsc = 'desired_lewd_ASC',
  DesiredLewdAscNullsFirst = 'desired_lewd_ASC_NULLS_FIRST',
  DesiredLewdAscNullsLast = 'desired_lewd_ASC_NULLS_LAST',
  DesiredLewdDesc = 'desired_lewd_DESC',
  DesiredLewdDescNullsFirst = 'desired_lewd_DESC_NULLS_FIRST',
  DesiredLewdDescNullsLast = 'desired_lewd_DESC_NULLS_LAST',
  DesiredMediaAsc = 'desired_media_ASC',
  DesiredMediaAscNullsFirst = 'desired_media_ASC_NULLS_FIRST',
  DesiredMediaAscNullsLast = 'desired_media_ASC_NULLS_LAST',
  DesiredMediaDesc = 'desired_media_DESC',
  DesiredMediaDescNullsFirst = 'desired_media_DESC_NULLS_FIRST',
  DesiredMediaDescNullsLast = 'desired_media_DESC_NULLS_LAST',
  DesiredMetadataAsc = 'desired_metadata_ASC',
  DesiredMetadataAscNullsFirst = 'desired_metadata_ASC_NULLS_FIRST',
  DesiredMetadataAscNullsLast = 'desired_metadata_ASC_NULLS_LAST',
  DesiredMetadataDesc = 'desired_metadata_DESC',
  DesiredMetadataDescNullsFirst = 'desired_metadata_DESC_NULLS_FIRST',
  DesiredMetadataDescNullsLast = 'desired_metadata_DESC_NULLS_LAST',
  DesiredNameAsc = 'desired_name_ASC',
  DesiredNameAscNullsFirst = 'desired_name_ASC_NULLS_FIRST',
  DesiredNameAscNullsLast = 'desired_name_ASC_NULLS_LAST',
  DesiredNameDesc = 'desired_name_DESC',
  DesiredNameDescNullsFirst = 'desired_name_DESC_NULLS_FIRST',
  DesiredNameDescNullsLast = 'desired_name_DESC_NULLS_LAST',
  DesiredPriceAsc = 'desired_price_ASC',
  DesiredPriceAscNullsFirst = 'desired_price_ASC_NULLS_FIRST',
  DesiredPriceAscNullsLast = 'desired_price_ASC_NULLS_LAST',
  DesiredPriceDesc = 'desired_price_DESC',
  DesiredPriceDescNullsFirst = 'desired_price_DESC_NULLS_FIRST',
  DesiredPriceDescNullsLast = 'desired_price_DESC_NULLS_LAST',
  DesiredRecipientAsc = 'desired_recipient_ASC',
  DesiredRecipientAscNullsFirst = 'desired_recipient_ASC_NULLS_FIRST',
  DesiredRecipientAscNullsLast = 'desired_recipient_ASC_NULLS_LAST',
  DesiredRecipientDesc = 'desired_recipient_DESC',
  DesiredRecipientDescNullsFirst = 'desired_recipient_DESC_NULLS_FIRST',
  DesiredRecipientDescNullsLast = 'desired_recipient_DESC_NULLS_LAST',
  DesiredRoyaltyAsc = 'desired_royalty_ASC',
  DesiredRoyaltyAscNullsFirst = 'desired_royalty_ASC_NULLS_FIRST',
  DesiredRoyaltyAscNullsLast = 'desired_royalty_ASC_NULLS_LAST',
  DesiredRoyaltyDesc = 'desired_royalty_DESC',
  DesiredRoyaltyDescNullsFirst = 'desired_royalty_DESC_NULLS_FIRST',
  DesiredRoyaltyDescNullsLast = 'desired_royalty_DESC_NULLS_LAST',
  DesiredSnAsc = 'desired_sn_ASC',
  DesiredSnAscNullsFirst = 'desired_sn_ASC_NULLS_FIRST',
  DesiredSnAscNullsLast = 'desired_sn_ASC_NULLS_LAST',
  DesiredSnDesc = 'desired_sn_DESC',
  DesiredSnDescNullsFirst = 'desired_sn_DESC_NULLS_FIRST',
  DesiredSnDescNullsLast = 'desired_sn_DESC_NULLS_LAST',
  DesiredUpdatedAtAsc = 'desired_updatedAt_ASC',
  DesiredUpdatedAtAscNullsFirst = 'desired_updatedAt_ASC_NULLS_FIRST',
  DesiredUpdatedAtAscNullsLast = 'desired_updatedAt_ASC_NULLS_LAST',
  DesiredUpdatedAtDesc = 'desired_updatedAt_DESC',
  DesiredUpdatedAtDescNullsFirst = 'desired_updatedAt_DESC_NULLS_FIRST',
  DesiredUpdatedAtDescNullsLast = 'desired_updatedAt_DESC_NULLS_LAST',
  DesiredVersionAsc = 'desired_version_ASC',
  DesiredVersionAscNullsFirst = 'desired_version_ASC_NULLS_FIRST',
  DesiredVersionAscNullsLast = 'desired_version_ASC_NULLS_LAST',
  DesiredVersionDesc = 'desired_version_DESC',
  DesiredVersionDescNullsFirst = 'desired_version_DESC_NULLS_FIRST',
  DesiredVersionDescNullsLast = 'desired_version_DESC_NULLS_LAST',
  ExpirationAsc = 'expiration_ASC',
  ExpirationAscNullsFirst = 'expiration_ASC_NULLS_FIRST',
  ExpirationAscNullsLast = 'expiration_ASC_NULLS_LAST',
  ExpirationDesc = 'expiration_DESC',
  ExpirationDescNullsFirst = 'expiration_DESC_NULLS_FIRST',
  ExpirationDescNullsLast = 'expiration_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  NftBlockNumberAsc = 'nft_blockNumber_ASC',
  NftBlockNumberAscNullsFirst = 'nft_blockNumber_ASC_NULLS_FIRST',
  NftBlockNumberAscNullsLast = 'nft_blockNumber_ASC_NULLS_LAST',
  NftBlockNumberDesc = 'nft_blockNumber_DESC',
  NftBlockNumberDescNullsFirst = 'nft_blockNumber_DESC_NULLS_FIRST',
  NftBlockNumberDescNullsLast = 'nft_blockNumber_DESC_NULLS_LAST',
  NftBurnedAsc = 'nft_burned_ASC',
  NftBurnedAscNullsFirst = 'nft_burned_ASC_NULLS_FIRST',
  NftBurnedAscNullsLast = 'nft_burned_ASC_NULLS_LAST',
  NftBurnedDesc = 'nft_burned_DESC',
  NftBurnedDescNullsFirst = 'nft_burned_DESC_NULLS_FIRST',
  NftBurnedDescNullsLast = 'nft_burned_DESC_NULLS_LAST',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtAscNullsFirst = 'nft_createdAt_ASC_NULLS_FIRST',
  NftCreatedAtAscNullsLast = 'nft_createdAt_ASC_NULLS_LAST',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatedAtDescNullsFirst = 'nft_createdAt_DESC_NULLS_FIRST',
  NftCreatedAtDescNullsLast = 'nft_createdAt_DESC_NULLS_LAST',
  NftCurrentOwnerAsc = 'nft_currentOwner_ASC',
  NftCurrentOwnerAscNullsFirst = 'nft_currentOwner_ASC_NULLS_FIRST',
  NftCurrentOwnerAscNullsLast = 'nft_currentOwner_ASC_NULLS_LAST',
  NftCurrentOwnerDesc = 'nft_currentOwner_DESC',
  NftCurrentOwnerDescNullsFirst = 'nft_currentOwner_DESC_NULLS_FIRST',
  NftCurrentOwnerDescNullsLast = 'nft_currentOwner_DESC_NULLS_LAST',
  NftHashAsc = 'nft_hash_ASC',
  NftHashAscNullsFirst = 'nft_hash_ASC_NULLS_FIRST',
  NftHashAscNullsLast = 'nft_hash_ASC_NULLS_LAST',
  NftHashDesc = 'nft_hash_DESC',
  NftHashDescNullsFirst = 'nft_hash_DESC_NULLS_FIRST',
  NftHashDescNullsLast = 'nft_hash_DESC_NULLS_LAST',
  NftIdAsc = 'nft_id_ASC',
  NftIdAscNullsFirst = 'nft_id_ASC_NULLS_FIRST',
  NftIdAscNullsLast = 'nft_id_ASC_NULLS_LAST',
  NftIdDesc = 'nft_id_DESC',
  NftIdDescNullsFirst = 'nft_id_DESC_NULLS_FIRST',
  NftIdDescNullsLast = 'nft_id_DESC_NULLS_LAST',
  NftImageAsc = 'nft_image_ASC',
  NftImageAscNullsFirst = 'nft_image_ASC_NULLS_FIRST',
  NftImageAscNullsLast = 'nft_image_ASC_NULLS_LAST',
  NftImageDesc = 'nft_image_DESC',
  NftImageDescNullsFirst = 'nft_image_DESC_NULLS_FIRST',
  NftImageDescNullsLast = 'nft_image_DESC_NULLS_LAST',
  NftIssuerAsc = 'nft_issuer_ASC',
  NftIssuerAscNullsFirst = 'nft_issuer_ASC_NULLS_FIRST',
  NftIssuerAscNullsLast = 'nft_issuer_ASC_NULLS_LAST',
  NftIssuerDesc = 'nft_issuer_DESC',
  NftIssuerDescNullsFirst = 'nft_issuer_DESC_NULLS_FIRST',
  NftIssuerDescNullsLast = 'nft_issuer_DESC_NULLS_LAST',
  NftLewdAsc = 'nft_lewd_ASC',
  NftLewdAscNullsFirst = 'nft_lewd_ASC_NULLS_FIRST',
  NftLewdAscNullsLast = 'nft_lewd_ASC_NULLS_LAST',
  NftLewdDesc = 'nft_lewd_DESC',
  NftLewdDescNullsFirst = 'nft_lewd_DESC_NULLS_FIRST',
  NftLewdDescNullsLast = 'nft_lewd_DESC_NULLS_LAST',
  NftMediaAsc = 'nft_media_ASC',
  NftMediaAscNullsFirst = 'nft_media_ASC_NULLS_FIRST',
  NftMediaAscNullsLast = 'nft_media_ASC_NULLS_LAST',
  NftMediaDesc = 'nft_media_DESC',
  NftMediaDescNullsFirst = 'nft_media_DESC_NULLS_FIRST',
  NftMediaDescNullsLast = 'nft_media_DESC_NULLS_LAST',
  NftMetadataAsc = 'nft_metadata_ASC',
  NftMetadataAscNullsFirst = 'nft_metadata_ASC_NULLS_FIRST',
  NftMetadataAscNullsLast = 'nft_metadata_ASC_NULLS_LAST',
  NftMetadataDesc = 'nft_metadata_DESC',
  NftMetadataDescNullsFirst = 'nft_metadata_DESC_NULLS_FIRST',
  NftMetadataDescNullsLast = 'nft_metadata_DESC_NULLS_LAST',
  NftNameAsc = 'nft_name_ASC',
  NftNameAscNullsFirst = 'nft_name_ASC_NULLS_FIRST',
  NftNameAscNullsLast = 'nft_name_ASC_NULLS_LAST',
  NftNameDesc = 'nft_name_DESC',
  NftNameDescNullsFirst = 'nft_name_DESC_NULLS_FIRST',
  NftNameDescNullsLast = 'nft_name_DESC_NULLS_LAST',
  NftPriceAsc = 'nft_price_ASC',
  NftPriceAscNullsFirst = 'nft_price_ASC_NULLS_FIRST',
  NftPriceAscNullsLast = 'nft_price_ASC_NULLS_LAST',
  NftPriceDesc = 'nft_price_DESC',
  NftPriceDescNullsFirst = 'nft_price_DESC_NULLS_FIRST',
  NftPriceDescNullsLast = 'nft_price_DESC_NULLS_LAST',
  NftRecipientAsc = 'nft_recipient_ASC',
  NftRecipientAscNullsFirst = 'nft_recipient_ASC_NULLS_FIRST',
  NftRecipientAscNullsLast = 'nft_recipient_ASC_NULLS_LAST',
  NftRecipientDesc = 'nft_recipient_DESC',
  NftRecipientDescNullsFirst = 'nft_recipient_DESC_NULLS_FIRST',
  NftRecipientDescNullsLast = 'nft_recipient_DESC_NULLS_LAST',
  NftRoyaltyAsc = 'nft_royalty_ASC',
  NftRoyaltyAscNullsFirst = 'nft_royalty_ASC_NULLS_FIRST',
  NftRoyaltyAscNullsLast = 'nft_royalty_ASC_NULLS_LAST',
  NftRoyaltyDesc = 'nft_royalty_DESC',
  NftRoyaltyDescNullsFirst = 'nft_royalty_DESC_NULLS_FIRST',
  NftRoyaltyDescNullsLast = 'nft_royalty_DESC_NULLS_LAST',
  NftSnAsc = 'nft_sn_ASC',
  NftSnAscNullsFirst = 'nft_sn_ASC_NULLS_FIRST',
  NftSnAscNullsLast = 'nft_sn_ASC_NULLS_LAST',
  NftSnDesc = 'nft_sn_DESC',
  NftSnDescNullsFirst = 'nft_sn_DESC_NULLS_FIRST',
  NftSnDescNullsLast = 'nft_sn_DESC_NULLS_LAST',
  NftUpdatedAtAsc = 'nft_updatedAt_ASC',
  NftUpdatedAtAscNullsFirst = 'nft_updatedAt_ASC_NULLS_FIRST',
  NftUpdatedAtAscNullsLast = 'nft_updatedAt_ASC_NULLS_LAST',
  NftUpdatedAtDesc = 'nft_updatedAt_DESC',
  NftUpdatedAtDescNullsFirst = 'nft_updatedAt_DESC_NULLS_FIRST',
  NftUpdatedAtDescNullsLast = 'nft_updatedAt_DESC_NULLS_LAST',
  NftVersionAsc = 'nft_version_ASC',
  NftVersionAscNullsFirst = 'nft_version_ASC_NULLS_FIRST',
  NftVersionAscNullsLast = 'nft_version_ASC_NULLS_LAST',
  NftVersionDesc = 'nft_version_DESC',
  NftVersionDescNullsFirst = 'nft_version_DESC_NULLS_FIRST',
  NftVersionDescNullsLast = 'nft_version_DESC_NULLS_LAST',
  PriceAsc = 'price_ASC',
  PriceAscNullsFirst = 'price_ASC_NULLS_FIRST',
  PriceAscNullsLast = 'price_ASC_NULLS_LAST',
  PriceDesc = 'price_DESC',
  PriceDescNullsFirst = 'price_DESC_NULLS_FIRST',
  PriceDescNullsLast = 'price_DESC_NULLS_LAST',
  StatusAsc = 'status_ASC',
  StatusAscNullsFirst = 'status_ASC_NULLS_FIRST',
  StatusAscNullsLast = 'status_ASC_NULLS_LAST',
  StatusDesc = 'status_DESC',
  StatusDescNullsFirst = 'status_DESC_NULLS_FIRST',
  StatusDescNullsLast = 'status_DESC_NULLS_LAST',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
  UpdatedAtAscNullsLast = 'updatedAt_ASC_NULLS_LAST',
  UpdatedAtDesc = 'updatedAt_DESC',
  UpdatedAtDescNullsFirst = 'updatedAt_DESC_NULLS_FIRST',
  UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
}

export type OfferWhereInput = {
  AND?: InputMaybe<Array<OfferWhereInput>>
  OR?: InputMaybe<Array<OfferWhereInput>>
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
  considered?: InputMaybe<CollectionEntityWhereInput>
  considered_isNull?: InputMaybe<Scalars['Boolean']['input']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  desired?: InputMaybe<NftEntityWhereInput>
  desired_isNull?: InputMaybe<Scalars['Boolean']['input']>
  expiration_eq?: InputMaybe<Scalars['BigInt']['input']>
  expiration_gt?: InputMaybe<Scalars['BigInt']['input']>
  expiration_gte?: InputMaybe<Scalars['BigInt']['input']>
  expiration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  expiration_isNull?: InputMaybe<Scalars['Boolean']['input']>
  expiration_lt?: InputMaybe<Scalars['BigInt']['input']>
  expiration_lte?: InputMaybe<Scalars['BigInt']['input']>
  expiration_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  expiration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
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
  price_eq?: InputMaybe<Scalars['BigInt']['input']>
  price_gt?: InputMaybe<Scalars['BigInt']['input']>
  price_gte?: InputMaybe<Scalars['BigInt']['input']>
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  price_isNull?: InputMaybe<Scalars['Boolean']['input']>
  price_lt?: InputMaybe<Scalars['BigInt']['input']>
  price_lte?: InputMaybe<Scalars['BigInt']['input']>
  price_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  status_eq?: InputMaybe<TradeStatus>
  status_in?: InputMaybe<Array<TradeStatus>>
  status_isNull?: InputMaybe<Scalars['Boolean']['input']>
  status_not_eq?: InputMaybe<TradeStatus>
  status_not_in?: InputMaybe<Array<TradeStatus>>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
}

export type OffersConnection = {
  __typename?: 'OffersConnection'
  edges: Array<OfferEdge>
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

export type PartialMetadataEntity = {
  __typename?: 'PartialMetadataEntity'
  animationUrl?: Maybe<Scalars['String']['output']>
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
}

export type Query = {
  __typename?: 'Query'
  activeWallets: Array<CountEntity>
  assetEntities: Array<AssetEntity>
  assetEntitiesConnection: AssetEntitiesConnection
  assetEntityById?: Maybe<AssetEntity>
  cacheStatusById?: Maybe<CacheStatus>
  cacheStatuses: Array<CacheStatus>
  cacheStatusesConnection: CacheStatusesConnection
  collectionBuyEventStatsById: Array<EventEntity>
  collectionEntities: Array<CollectionEntity>
  collectionEntitiesConnection: CollectionEntitiesConnection
  collectionEntityById?: Maybe<CollectionEntity>
  collectionEventById?: Maybe<CollectionEvent>
  collectionEvents: Array<CollectionEvent>
  collectionEventsConnection: CollectionEventsConnection
  eventById?: Maybe<Event>
  events: Array<Event>
  eventsConnection: EventsConnection
  lastEvent: Array<LastEventEntity>
  metadataEntities: Array<MetadataEntity>
  metadataEntitiesConnection: MetadataEntitiesConnection
  metadataEntityById?: Maybe<MetadataEntity>
  nftEntities: Array<NftEntity>
  nftEntitiesConnection: NftEntitiesConnection
  nftEntityById?: Maybe<NftEntity>
  offerById?: Maybe<Offer>
  offers: Array<Offer>
  offersConnection: OffersConnection
  seriesInsightBuyHistory: Array<LastEventEntity>
  seriesInsightTable: Array<SeriesEntity>
  spotlightTable: Array<SpotlightEntity>
  squidStatus?: Maybe<SquidStatus>
  swapById?: Maybe<Swap>
  swaps: Array<Swap>
  swapsConnection: SwapsConnection
  tokenEntities: Array<TokenEntity>
  tokenEntitiesConnection: TokenEntitiesConnection
  tokenEntityById?: Maybe<TokenEntity>
  tokenEntityCount: CountEntity
  tokenEntityList: Array<TokenEntityModel>
}

export type QueryAssetEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AssetEntityOrderByInput>>
  where?: InputMaybe<AssetEntityWhereInput>
}

export type QueryAssetEntitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<AssetEntityOrderByInput>
  where?: InputMaybe<AssetEntityWhereInput>
}

export type QueryAssetEntityByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryCacheStatusByIdArgs = {
  id: Scalars['String']['input']
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

export type QueryCollectionEventByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryCollectionEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CollectionEventOrderByInput>>
  where?: InputMaybe<CollectionEventWhereInput>
}

export type QueryCollectionEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<CollectionEventOrderByInput>
  where?: InputMaybe<CollectionEventWhereInput>
}

export type QueryEventByIdArgs = {
  id: Scalars['String']['input']
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

export type QueryLastEventArgs = {
  interaction?: InputMaybe<Scalars['String']['input']>
  limit?: InputMaybe<Scalars['Float']['input']>
  offset?: InputMaybe<Scalars['Float']['input']>
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

export type QueryOfferByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryOffersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<OfferOrderByInput>>
  where?: InputMaybe<OfferWhereInput>
}

export type QueryOffersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<OfferOrderByInput>
  where?: InputMaybe<OfferWhereInput>
}

export type QuerySeriesInsightBuyHistoryArgs = {
  dateRange?: Scalars['String']['input']
  ids: Array<Scalars['String']['input']>
}

export type QuerySeriesInsightTableArgs = {
  dateRange?: Scalars['String']['input']
  limit?: InputMaybe<Scalars['Float']['input']>
  offset?: InputMaybe<Scalars['Float']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
}

export type QuerySpotlightTableArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>
  offset?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
}

export type QuerySwapByIdArgs = {
  id: Scalars['String']['input']
}

export type QuerySwapsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<SwapOrderByInput>>
  where?: InputMaybe<SwapWhereInput>
}

export type QuerySwapsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<SwapOrderByInput>
  where?: InputMaybe<SwapWhereInput>
}

export type QueryTokenEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<TokenEntityOrderByInput>>
  where?: InputMaybe<TokenEntityWhereInput>
}

export type QueryTokenEntitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy: Array<TokenEntityOrderByInput>
  where?: InputMaybe<TokenEntityWhereInput>
}

export type QueryTokenEntityByIdArgs = {
  id: Scalars['String']['input']
}

export type QueryTokenEntityCountArgs = {
  collections?: InputMaybe<Array<Scalars['String']['input']>>
  denyList?: InputMaybe<Array<Scalars['String']['input']>>
  issuer?: InputMaybe<Scalars['String']['input']>
  kind?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  owner?: InputMaybe<Scalars['String']['input']>
  price_gt?: InputMaybe<Scalars['Float']['input']>
  price_gte?: InputMaybe<Scalars['Float']['input']>
  price_lte?: InputMaybe<Scalars['Float']['input']>
}

export type QueryTokenEntityListArgs = {
  collections?: InputMaybe<Array<Scalars['String']['input']>>
  denyList?: InputMaybe<Array<Scalars['String']['input']>>
  issuer?: InputMaybe<Scalars['String']['input']>
  kind?: InputMaybe<Scalars['String']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<Scalars['String']['input']>>
  owner?: InputMaybe<Scalars['String']['input']>
  price_gt?: InputMaybe<Scalars['Float']['input']>
  price_gte?: InputMaybe<Scalars['Float']['input']>
  price_lte?: InputMaybe<Scalars['Float']['input']>
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

export type SpotlightEntity = {
  __typename?: 'SpotlightEntity'
  average?: Maybe<Scalars['BigInt']['output']>
  collections: Scalars['Float']['output']
  id: Scalars['String']['output']
  sold: Scalars['Float']['output']
  total: Scalars['Float']['output']
  unique: Scalars['Float']['output']
  uniqueCollectors: Scalars['Float']['output']
  volume?: Maybe<Scalars['BigInt']['output']>
}

export type SquidStatus = {
  __typename?: 'SquidStatus'
  /** The hash of the last processed finalized block */
  finalizedHash?: Maybe<Scalars['String']['output']>
  /** The height of the last processed finalized block */
  finalizedHeight?: Maybe<Scalars['Int']['output']>
  /** The hash of the last processed block */
  hash?: Maybe<Scalars['String']['output']>
  /** The height of the last processed block */
  height?: Maybe<Scalars['Int']['output']>
}

export type Subscription = {
  __typename?: 'Subscription'
  assetEntities: Array<AssetEntity>
  assetEntityById?: Maybe<AssetEntity>
  cacheStatusById?: Maybe<CacheStatus>
  cacheStatuses: Array<CacheStatus>
  collectionEntities: Array<CollectionEntity>
  collectionEntityById?: Maybe<CollectionEntity>
  collectionEventById?: Maybe<CollectionEvent>
  collectionEvents: Array<CollectionEvent>
  eventById?: Maybe<Event>
  events: Array<Event>
  metadataEntities: Array<MetadataEntity>
  metadataEntityById?: Maybe<MetadataEntity>
  nftEntities: Array<NftEntity>
  nftEntityById?: Maybe<NftEntity>
  offerById?: Maybe<Offer>
  offers: Array<Offer>
  swapById?: Maybe<Swap>
  swaps: Array<Swap>
  tokenEntities: Array<TokenEntity>
  tokenEntityById?: Maybe<TokenEntity>
}

export type SubscriptionAssetEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<AssetEntityOrderByInput>>
  where?: InputMaybe<AssetEntityWhereInput>
}

export type SubscriptionAssetEntityByIdArgs = {
  id: Scalars['String']['input']
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

export type SubscriptionCollectionEventByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionCollectionEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CollectionEventOrderByInput>>
  where?: InputMaybe<CollectionEventWhereInput>
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

export type SubscriptionOfferByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionOffersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<OfferOrderByInput>>
  where?: InputMaybe<OfferWhereInput>
}

export type SubscriptionSwapByIdArgs = {
  id: Scalars['String']['input']
}

export type SubscriptionSwapsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<SwapOrderByInput>>
  where?: InputMaybe<SwapWhereInput>
}

export type SubscriptionTokenEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<TokenEntityOrderByInput>>
  where?: InputMaybe<TokenEntityWhereInput>
}

export type SubscriptionTokenEntityByIdArgs = {
  id: Scalars['String']['input']
}

export enum Surcharge {
  Receive = 'Receive',
  Send = 'Send',
}

export type Swap = {
  __typename?: 'Swap'
  blockNumber: Scalars['BigInt']['output']
  caller: Scalars['String']['output']
  considered: CollectionEntity
  createdAt: Scalars['DateTime']['output']
  desired?: Maybe<NftEntity>
  expiration: Scalars['BigInt']['output']
  id: Scalars['String']['output']
  nft: NftEntity
  price?: Maybe<Scalars['BigInt']['output']>
  status: TradeStatus
  surcharge?: Maybe<Surcharge>
  updatedAt?: Maybe<Scalars['DateTime']['output']>
}

export type SwapEdge = {
  __typename?: 'SwapEdge'
  cursor: Scalars['String']['output']
  node: Swap
}

export enum SwapOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  CallerAsc = 'caller_ASC',
  CallerAscNullsFirst = 'caller_ASC_NULLS_FIRST',
  CallerAscNullsLast = 'caller_ASC_NULLS_LAST',
  CallerDesc = 'caller_DESC',
  CallerDescNullsFirst = 'caller_DESC_NULLS_FIRST',
  CallerDescNullsLast = 'caller_DESC_NULLS_LAST',
  ConsideredBaseUriAsc = 'considered_baseUri_ASC',
  ConsideredBaseUriAscNullsFirst = 'considered_baseUri_ASC_NULLS_FIRST',
  ConsideredBaseUriAscNullsLast = 'considered_baseUri_ASC_NULLS_LAST',
  ConsideredBaseUriDesc = 'considered_baseUri_DESC',
  ConsideredBaseUriDescNullsFirst = 'considered_baseUri_DESC_NULLS_FIRST',
  ConsideredBaseUriDescNullsLast = 'considered_baseUri_DESC_NULLS_LAST',
  ConsideredBlockNumberAsc = 'considered_blockNumber_ASC',
  ConsideredBlockNumberAscNullsFirst = 'considered_blockNumber_ASC_NULLS_FIRST',
  ConsideredBlockNumberAscNullsLast = 'considered_blockNumber_ASC_NULLS_LAST',
  ConsideredBlockNumberDesc = 'considered_blockNumber_DESC',
  ConsideredBlockNumberDescNullsFirst = 'considered_blockNumber_DESC_NULLS_FIRST',
  ConsideredBlockNumberDescNullsLast = 'considered_blockNumber_DESC_NULLS_LAST',
  ConsideredBurnedAsc = 'considered_burned_ASC',
  ConsideredBurnedAscNullsFirst = 'considered_burned_ASC_NULLS_FIRST',
  ConsideredBurnedAscNullsLast = 'considered_burned_ASC_NULLS_LAST',
  ConsideredBurnedDesc = 'considered_burned_DESC',
  ConsideredBurnedDescNullsFirst = 'considered_burned_DESC_NULLS_FIRST',
  ConsideredBurnedDescNullsLast = 'considered_burned_DESC_NULLS_LAST',
  ConsideredCreatedAtAsc = 'considered_createdAt_ASC',
  ConsideredCreatedAtAscNullsFirst = 'considered_createdAt_ASC_NULLS_FIRST',
  ConsideredCreatedAtAscNullsLast = 'considered_createdAt_ASC_NULLS_LAST',
  ConsideredCreatedAtDesc = 'considered_createdAt_DESC',
  ConsideredCreatedAtDescNullsFirst = 'considered_createdAt_DESC_NULLS_FIRST',
  ConsideredCreatedAtDescNullsLast = 'considered_createdAt_DESC_NULLS_LAST',
  ConsideredCurrentOwnerAsc = 'considered_currentOwner_ASC',
  ConsideredCurrentOwnerAscNullsFirst = 'considered_currentOwner_ASC_NULLS_FIRST',
  ConsideredCurrentOwnerAscNullsLast = 'considered_currentOwner_ASC_NULLS_LAST',
  ConsideredCurrentOwnerDesc = 'considered_currentOwner_DESC',
  ConsideredCurrentOwnerDescNullsFirst = 'considered_currentOwner_DESC_NULLS_FIRST',
  ConsideredCurrentOwnerDescNullsLast = 'considered_currentOwner_DESC_NULLS_LAST',
  ConsideredDistributionAsc = 'considered_distribution_ASC',
  ConsideredDistributionAscNullsFirst = 'considered_distribution_ASC_NULLS_FIRST',
  ConsideredDistributionAscNullsLast = 'considered_distribution_ASC_NULLS_LAST',
  ConsideredDistributionDesc = 'considered_distribution_DESC',
  ConsideredDistributionDescNullsFirst = 'considered_distribution_DESC_NULLS_FIRST',
  ConsideredDistributionDescNullsLast = 'considered_distribution_DESC_NULLS_LAST',
  ConsideredFloorAsc = 'considered_floor_ASC',
  ConsideredFloorAscNullsFirst = 'considered_floor_ASC_NULLS_FIRST',
  ConsideredFloorAscNullsLast = 'considered_floor_ASC_NULLS_LAST',
  ConsideredFloorDesc = 'considered_floor_DESC',
  ConsideredFloorDescNullsFirst = 'considered_floor_DESC_NULLS_FIRST',
  ConsideredFloorDescNullsLast = 'considered_floor_DESC_NULLS_LAST',
  ConsideredHashAsc = 'considered_hash_ASC',
  ConsideredHashAscNullsFirst = 'considered_hash_ASC_NULLS_FIRST',
  ConsideredHashAscNullsLast = 'considered_hash_ASC_NULLS_LAST',
  ConsideredHashDesc = 'considered_hash_DESC',
  ConsideredHashDescNullsFirst = 'considered_hash_DESC_NULLS_FIRST',
  ConsideredHashDescNullsLast = 'considered_hash_DESC_NULLS_LAST',
  ConsideredHighestSaleAsc = 'considered_highestSale_ASC',
  ConsideredHighestSaleAscNullsFirst = 'considered_highestSale_ASC_NULLS_FIRST',
  ConsideredHighestSaleAscNullsLast = 'considered_highestSale_ASC_NULLS_LAST',
  ConsideredHighestSaleDesc = 'considered_highestSale_DESC',
  ConsideredHighestSaleDescNullsFirst = 'considered_highestSale_DESC_NULLS_FIRST',
  ConsideredHighestSaleDescNullsLast = 'considered_highestSale_DESC_NULLS_LAST',
  ConsideredIdAsc = 'considered_id_ASC',
  ConsideredIdAscNullsFirst = 'considered_id_ASC_NULLS_FIRST',
  ConsideredIdAscNullsLast = 'considered_id_ASC_NULLS_LAST',
  ConsideredIdDesc = 'considered_id_DESC',
  ConsideredIdDescNullsFirst = 'considered_id_DESC_NULLS_FIRST',
  ConsideredIdDescNullsLast = 'considered_id_DESC_NULLS_LAST',
  ConsideredImageAsc = 'considered_image_ASC',
  ConsideredImageAscNullsFirst = 'considered_image_ASC_NULLS_FIRST',
  ConsideredImageAscNullsLast = 'considered_image_ASC_NULLS_LAST',
  ConsideredImageDesc = 'considered_image_DESC',
  ConsideredImageDescNullsFirst = 'considered_image_DESC_NULLS_FIRST',
  ConsideredImageDescNullsLast = 'considered_image_DESC_NULLS_LAST',
  ConsideredIssuerAsc = 'considered_issuer_ASC',
  ConsideredIssuerAscNullsFirst = 'considered_issuer_ASC_NULLS_FIRST',
  ConsideredIssuerAscNullsLast = 'considered_issuer_ASC_NULLS_LAST',
  ConsideredIssuerDesc = 'considered_issuer_DESC',
  ConsideredIssuerDescNullsFirst = 'considered_issuer_DESC_NULLS_FIRST',
  ConsideredIssuerDescNullsLast = 'considered_issuer_DESC_NULLS_LAST',
  ConsideredKindAsc = 'considered_kind_ASC',
  ConsideredKindAscNullsFirst = 'considered_kind_ASC_NULLS_FIRST',
  ConsideredKindAscNullsLast = 'considered_kind_ASC_NULLS_LAST',
  ConsideredKindDesc = 'considered_kind_DESC',
  ConsideredKindDescNullsFirst = 'considered_kind_DESC_NULLS_FIRST',
  ConsideredKindDescNullsLast = 'considered_kind_DESC_NULLS_LAST',
  ConsideredMaxAsc = 'considered_max_ASC',
  ConsideredMaxAscNullsFirst = 'considered_max_ASC_NULLS_FIRST',
  ConsideredMaxAscNullsLast = 'considered_max_ASC_NULLS_LAST',
  ConsideredMaxDesc = 'considered_max_DESC',
  ConsideredMaxDescNullsFirst = 'considered_max_DESC_NULLS_FIRST',
  ConsideredMaxDescNullsLast = 'considered_max_DESC_NULLS_LAST',
  ConsideredMediaAsc = 'considered_media_ASC',
  ConsideredMediaAscNullsFirst = 'considered_media_ASC_NULLS_FIRST',
  ConsideredMediaAscNullsLast = 'considered_media_ASC_NULLS_LAST',
  ConsideredMediaDesc = 'considered_media_DESC',
  ConsideredMediaDescNullsFirst = 'considered_media_DESC_NULLS_FIRST',
  ConsideredMediaDescNullsLast = 'considered_media_DESC_NULLS_LAST',
  ConsideredMetadataAsc = 'considered_metadata_ASC',
  ConsideredMetadataAscNullsFirst = 'considered_metadata_ASC_NULLS_FIRST',
  ConsideredMetadataAscNullsLast = 'considered_metadata_ASC_NULLS_LAST',
  ConsideredMetadataDesc = 'considered_metadata_DESC',
  ConsideredMetadataDescNullsFirst = 'considered_metadata_DESC_NULLS_FIRST',
  ConsideredMetadataDescNullsLast = 'considered_metadata_DESC_NULLS_LAST',
  ConsideredNameAsc = 'considered_name_ASC',
  ConsideredNameAscNullsFirst = 'considered_name_ASC_NULLS_FIRST',
  ConsideredNameAscNullsLast = 'considered_name_ASC_NULLS_LAST',
  ConsideredNameDesc = 'considered_name_DESC',
  ConsideredNameDescNullsFirst = 'considered_name_DESC_NULLS_FIRST',
  ConsideredNameDescNullsLast = 'considered_name_DESC_NULLS_LAST',
  ConsideredNftCountAsc = 'considered_nftCount_ASC',
  ConsideredNftCountAscNullsFirst = 'considered_nftCount_ASC_NULLS_FIRST',
  ConsideredNftCountAscNullsLast = 'considered_nftCount_ASC_NULLS_LAST',
  ConsideredNftCountDesc = 'considered_nftCount_DESC',
  ConsideredNftCountDescNullsFirst = 'considered_nftCount_DESC_NULLS_FIRST',
  ConsideredNftCountDescNullsLast = 'considered_nftCount_DESC_NULLS_LAST',
  ConsideredOwnerCountAsc = 'considered_ownerCount_ASC',
  ConsideredOwnerCountAscNullsFirst = 'considered_ownerCount_ASC_NULLS_FIRST',
  ConsideredOwnerCountAscNullsLast = 'considered_ownerCount_ASC_NULLS_LAST',
  ConsideredOwnerCountDesc = 'considered_ownerCount_DESC',
  ConsideredOwnerCountDescNullsFirst = 'considered_ownerCount_DESC_NULLS_FIRST',
  ConsideredOwnerCountDescNullsLast = 'considered_ownerCount_DESC_NULLS_LAST',
  ConsideredRecipientAsc = 'considered_recipient_ASC',
  ConsideredRecipientAscNullsFirst = 'considered_recipient_ASC_NULLS_FIRST',
  ConsideredRecipientAscNullsLast = 'considered_recipient_ASC_NULLS_LAST',
  ConsideredRecipientDesc = 'considered_recipient_DESC',
  ConsideredRecipientDescNullsFirst = 'considered_recipient_DESC_NULLS_FIRST',
  ConsideredRecipientDescNullsLast = 'considered_recipient_DESC_NULLS_LAST',
  ConsideredRoyaltyAsc = 'considered_royalty_ASC',
  ConsideredRoyaltyAscNullsFirst = 'considered_royalty_ASC_NULLS_FIRST',
  ConsideredRoyaltyAscNullsLast = 'considered_royalty_ASC_NULLS_LAST',
  ConsideredRoyaltyDesc = 'considered_royalty_DESC',
  ConsideredRoyaltyDescNullsFirst = 'considered_royalty_DESC_NULLS_FIRST',
  ConsideredRoyaltyDescNullsLast = 'considered_royalty_DESC_NULLS_LAST',
  ConsideredSupplyAsc = 'considered_supply_ASC',
  ConsideredSupplyAscNullsFirst = 'considered_supply_ASC_NULLS_FIRST',
  ConsideredSupplyAscNullsLast = 'considered_supply_ASC_NULLS_LAST',
  ConsideredSupplyDesc = 'considered_supply_DESC',
  ConsideredSupplyDescNullsFirst = 'considered_supply_DESC_NULLS_FIRST',
  ConsideredSupplyDescNullsLast = 'considered_supply_DESC_NULLS_LAST',
  ConsideredTypeAsc = 'considered_type_ASC',
  ConsideredTypeAscNullsFirst = 'considered_type_ASC_NULLS_FIRST',
  ConsideredTypeAscNullsLast = 'considered_type_ASC_NULLS_LAST',
  ConsideredTypeDesc = 'considered_type_DESC',
  ConsideredTypeDescNullsFirst = 'considered_type_DESC_NULLS_FIRST',
  ConsideredTypeDescNullsLast = 'considered_type_DESC_NULLS_LAST',
  ConsideredUpdatedAtAsc = 'considered_updatedAt_ASC',
  ConsideredUpdatedAtAscNullsFirst = 'considered_updatedAt_ASC_NULLS_FIRST',
  ConsideredUpdatedAtAscNullsLast = 'considered_updatedAt_ASC_NULLS_LAST',
  ConsideredUpdatedAtDesc = 'considered_updatedAt_DESC',
  ConsideredUpdatedAtDescNullsFirst = 'considered_updatedAt_DESC_NULLS_FIRST',
  ConsideredUpdatedAtDescNullsLast = 'considered_updatedAt_DESC_NULLS_LAST',
  ConsideredVersionAsc = 'considered_version_ASC',
  ConsideredVersionAscNullsFirst = 'considered_version_ASC_NULLS_FIRST',
  ConsideredVersionAscNullsLast = 'considered_version_ASC_NULLS_LAST',
  ConsideredVersionDesc = 'considered_version_DESC',
  ConsideredVersionDescNullsFirst = 'considered_version_DESC_NULLS_FIRST',
  ConsideredVersionDescNullsLast = 'considered_version_DESC_NULLS_LAST',
  ConsideredVolumeAsc = 'considered_volume_ASC',
  ConsideredVolumeAscNullsFirst = 'considered_volume_ASC_NULLS_FIRST',
  ConsideredVolumeAscNullsLast = 'considered_volume_ASC_NULLS_LAST',
  ConsideredVolumeDesc = 'considered_volume_DESC',
  ConsideredVolumeDescNullsFirst = 'considered_volume_DESC_NULLS_FIRST',
  ConsideredVolumeDescNullsLast = 'considered_volume_DESC_NULLS_LAST',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
  CreatedAtAscNullsLast = 'createdAt_ASC_NULLS_LAST',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedAtDescNullsFirst = 'createdAt_DESC_NULLS_FIRST',
  CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
  DesiredBlockNumberAsc = 'desired_blockNumber_ASC',
  DesiredBlockNumberAscNullsFirst = 'desired_blockNumber_ASC_NULLS_FIRST',
  DesiredBlockNumberAscNullsLast = 'desired_blockNumber_ASC_NULLS_LAST',
  DesiredBlockNumberDesc = 'desired_blockNumber_DESC',
  DesiredBlockNumberDescNullsFirst = 'desired_blockNumber_DESC_NULLS_FIRST',
  DesiredBlockNumberDescNullsLast = 'desired_blockNumber_DESC_NULLS_LAST',
  DesiredBurnedAsc = 'desired_burned_ASC',
  DesiredBurnedAscNullsFirst = 'desired_burned_ASC_NULLS_FIRST',
  DesiredBurnedAscNullsLast = 'desired_burned_ASC_NULLS_LAST',
  DesiredBurnedDesc = 'desired_burned_DESC',
  DesiredBurnedDescNullsFirst = 'desired_burned_DESC_NULLS_FIRST',
  DesiredBurnedDescNullsLast = 'desired_burned_DESC_NULLS_LAST',
  DesiredCreatedAtAsc = 'desired_createdAt_ASC',
  DesiredCreatedAtAscNullsFirst = 'desired_createdAt_ASC_NULLS_FIRST',
  DesiredCreatedAtAscNullsLast = 'desired_createdAt_ASC_NULLS_LAST',
  DesiredCreatedAtDesc = 'desired_createdAt_DESC',
  DesiredCreatedAtDescNullsFirst = 'desired_createdAt_DESC_NULLS_FIRST',
  DesiredCreatedAtDescNullsLast = 'desired_createdAt_DESC_NULLS_LAST',
  DesiredCurrentOwnerAsc = 'desired_currentOwner_ASC',
  DesiredCurrentOwnerAscNullsFirst = 'desired_currentOwner_ASC_NULLS_FIRST',
  DesiredCurrentOwnerAscNullsLast = 'desired_currentOwner_ASC_NULLS_LAST',
  DesiredCurrentOwnerDesc = 'desired_currentOwner_DESC',
  DesiredCurrentOwnerDescNullsFirst = 'desired_currentOwner_DESC_NULLS_FIRST',
  DesiredCurrentOwnerDescNullsLast = 'desired_currentOwner_DESC_NULLS_LAST',
  DesiredHashAsc = 'desired_hash_ASC',
  DesiredHashAscNullsFirst = 'desired_hash_ASC_NULLS_FIRST',
  DesiredHashAscNullsLast = 'desired_hash_ASC_NULLS_LAST',
  DesiredHashDesc = 'desired_hash_DESC',
  DesiredHashDescNullsFirst = 'desired_hash_DESC_NULLS_FIRST',
  DesiredHashDescNullsLast = 'desired_hash_DESC_NULLS_LAST',
  DesiredIdAsc = 'desired_id_ASC',
  DesiredIdAscNullsFirst = 'desired_id_ASC_NULLS_FIRST',
  DesiredIdAscNullsLast = 'desired_id_ASC_NULLS_LAST',
  DesiredIdDesc = 'desired_id_DESC',
  DesiredIdDescNullsFirst = 'desired_id_DESC_NULLS_FIRST',
  DesiredIdDescNullsLast = 'desired_id_DESC_NULLS_LAST',
  DesiredImageAsc = 'desired_image_ASC',
  DesiredImageAscNullsFirst = 'desired_image_ASC_NULLS_FIRST',
  DesiredImageAscNullsLast = 'desired_image_ASC_NULLS_LAST',
  DesiredImageDesc = 'desired_image_DESC',
  DesiredImageDescNullsFirst = 'desired_image_DESC_NULLS_FIRST',
  DesiredImageDescNullsLast = 'desired_image_DESC_NULLS_LAST',
  DesiredIssuerAsc = 'desired_issuer_ASC',
  DesiredIssuerAscNullsFirst = 'desired_issuer_ASC_NULLS_FIRST',
  DesiredIssuerAscNullsLast = 'desired_issuer_ASC_NULLS_LAST',
  DesiredIssuerDesc = 'desired_issuer_DESC',
  DesiredIssuerDescNullsFirst = 'desired_issuer_DESC_NULLS_FIRST',
  DesiredIssuerDescNullsLast = 'desired_issuer_DESC_NULLS_LAST',
  DesiredLewdAsc = 'desired_lewd_ASC',
  DesiredLewdAscNullsFirst = 'desired_lewd_ASC_NULLS_FIRST',
  DesiredLewdAscNullsLast = 'desired_lewd_ASC_NULLS_LAST',
  DesiredLewdDesc = 'desired_lewd_DESC',
  DesiredLewdDescNullsFirst = 'desired_lewd_DESC_NULLS_FIRST',
  DesiredLewdDescNullsLast = 'desired_lewd_DESC_NULLS_LAST',
  DesiredMediaAsc = 'desired_media_ASC',
  DesiredMediaAscNullsFirst = 'desired_media_ASC_NULLS_FIRST',
  DesiredMediaAscNullsLast = 'desired_media_ASC_NULLS_LAST',
  DesiredMediaDesc = 'desired_media_DESC',
  DesiredMediaDescNullsFirst = 'desired_media_DESC_NULLS_FIRST',
  DesiredMediaDescNullsLast = 'desired_media_DESC_NULLS_LAST',
  DesiredMetadataAsc = 'desired_metadata_ASC',
  DesiredMetadataAscNullsFirst = 'desired_metadata_ASC_NULLS_FIRST',
  DesiredMetadataAscNullsLast = 'desired_metadata_ASC_NULLS_LAST',
  DesiredMetadataDesc = 'desired_metadata_DESC',
  DesiredMetadataDescNullsFirst = 'desired_metadata_DESC_NULLS_FIRST',
  DesiredMetadataDescNullsLast = 'desired_metadata_DESC_NULLS_LAST',
  DesiredNameAsc = 'desired_name_ASC',
  DesiredNameAscNullsFirst = 'desired_name_ASC_NULLS_FIRST',
  DesiredNameAscNullsLast = 'desired_name_ASC_NULLS_LAST',
  DesiredNameDesc = 'desired_name_DESC',
  DesiredNameDescNullsFirst = 'desired_name_DESC_NULLS_FIRST',
  DesiredNameDescNullsLast = 'desired_name_DESC_NULLS_LAST',
  DesiredPriceAsc = 'desired_price_ASC',
  DesiredPriceAscNullsFirst = 'desired_price_ASC_NULLS_FIRST',
  DesiredPriceAscNullsLast = 'desired_price_ASC_NULLS_LAST',
  DesiredPriceDesc = 'desired_price_DESC',
  DesiredPriceDescNullsFirst = 'desired_price_DESC_NULLS_FIRST',
  DesiredPriceDescNullsLast = 'desired_price_DESC_NULLS_LAST',
  DesiredRecipientAsc = 'desired_recipient_ASC',
  DesiredRecipientAscNullsFirst = 'desired_recipient_ASC_NULLS_FIRST',
  DesiredRecipientAscNullsLast = 'desired_recipient_ASC_NULLS_LAST',
  DesiredRecipientDesc = 'desired_recipient_DESC',
  DesiredRecipientDescNullsFirst = 'desired_recipient_DESC_NULLS_FIRST',
  DesiredRecipientDescNullsLast = 'desired_recipient_DESC_NULLS_LAST',
  DesiredRoyaltyAsc = 'desired_royalty_ASC',
  DesiredRoyaltyAscNullsFirst = 'desired_royalty_ASC_NULLS_FIRST',
  DesiredRoyaltyAscNullsLast = 'desired_royalty_ASC_NULLS_LAST',
  DesiredRoyaltyDesc = 'desired_royalty_DESC',
  DesiredRoyaltyDescNullsFirst = 'desired_royalty_DESC_NULLS_FIRST',
  DesiredRoyaltyDescNullsLast = 'desired_royalty_DESC_NULLS_LAST',
  DesiredSnAsc = 'desired_sn_ASC',
  DesiredSnAscNullsFirst = 'desired_sn_ASC_NULLS_FIRST',
  DesiredSnAscNullsLast = 'desired_sn_ASC_NULLS_LAST',
  DesiredSnDesc = 'desired_sn_DESC',
  DesiredSnDescNullsFirst = 'desired_sn_DESC_NULLS_FIRST',
  DesiredSnDescNullsLast = 'desired_sn_DESC_NULLS_LAST',
  DesiredUpdatedAtAsc = 'desired_updatedAt_ASC',
  DesiredUpdatedAtAscNullsFirst = 'desired_updatedAt_ASC_NULLS_FIRST',
  DesiredUpdatedAtAscNullsLast = 'desired_updatedAt_ASC_NULLS_LAST',
  DesiredUpdatedAtDesc = 'desired_updatedAt_DESC',
  DesiredUpdatedAtDescNullsFirst = 'desired_updatedAt_DESC_NULLS_FIRST',
  DesiredUpdatedAtDescNullsLast = 'desired_updatedAt_DESC_NULLS_LAST',
  DesiredVersionAsc = 'desired_version_ASC',
  DesiredVersionAscNullsFirst = 'desired_version_ASC_NULLS_FIRST',
  DesiredVersionAscNullsLast = 'desired_version_ASC_NULLS_LAST',
  DesiredVersionDesc = 'desired_version_DESC',
  DesiredVersionDescNullsFirst = 'desired_version_DESC_NULLS_FIRST',
  DesiredVersionDescNullsLast = 'desired_version_DESC_NULLS_LAST',
  ExpirationAsc = 'expiration_ASC',
  ExpirationAscNullsFirst = 'expiration_ASC_NULLS_FIRST',
  ExpirationAscNullsLast = 'expiration_ASC_NULLS_LAST',
  ExpirationDesc = 'expiration_DESC',
  ExpirationDescNullsFirst = 'expiration_DESC_NULLS_FIRST',
  ExpirationDescNullsLast = 'expiration_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  NftBlockNumberAsc = 'nft_blockNumber_ASC',
  NftBlockNumberAscNullsFirst = 'nft_blockNumber_ASC_NULLS_FIRST',
  NftBlockNumberAscNullsLast = 'nft_blockNumber_ASC_NULLS_LAST',
  NftBlockNumberDesc = 'nft_blockNumber_DESC',
  NftBlockNumberDescNullsFirst = 'nft_blockNumber_DESC_NULLS_FIRST',
  NftBlockNumberDescNullsLast = 'nft_blockNumber_DESC_NULLS_LAST',
  NftBurnedAsc = 'nft_burned_ASC',
  NftBurnedAscNullsFirst = 'nft_burned_ASC_NULLS_FIRST',
  NftBurnedAscNullsLast = 'nft_burned_ASC_NULLS_LAST',
  NftBurnedDesc = 'nft_burned_DESC',
  NftBurnedDescNullsFirst = 'nft_burned_DESC_NULLS_FIRST',
  NftBurnedDescNullsLast = 'nft_burned_DESC_NULLS_LAST',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtAscNullsFirst = 'nft_createdAt_ASC_NULLS_FIRST',
  NftCreatedAtAscNullsLast = 'nft_createdAt_ASC_NULLS_LAST',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatedAtDescNullsFirst = 'nft_createdAt_DESC_NULLS_FIRST',
  NftCreatedAtDescNullsLast = 'nft_createdAt_DESC_NULLS_LAST',
  NftCurrentOwnerAsc = 'nft_currentOwner_ASC',
  NftCurrentOwnerAscNullsFirst = 'nft_currentOwner_ASC_NULLS_FIRST',
  NftCurrentOwnerAscNullsLast = 'nft_currentOwner_ASC_NULLS_LAST',
  NftCurrentOwnerDesc = 'nft_currentOwner_DESC',
  NftCurrentOwnerDescNullsFirst = 'nft_currentOwner_DESC_NULLS_FIRST',
  NftCurrentOwnerDescNullsLast = 'nft_currentOwner_DESC_NULLS_LAST',
  NftHashAsc = 'nft_hash_ASC',
  NftHashAscNullsFirst = 'nft_hash_ASC_NULLS_FIRST',
  NftHashAscNullsLast = 'nft_hash_ASC_NULLS_LAST',
  NftHashDesc = 'nft_hash_DESC',
  NftHashDescNullsFirst = 'nft_hash_DESC_NULLS_FIRST',
  NftHashDescNullsLast = 'nft_hash_DESC_NULLS_LAST',
  NftIdAsc = 'nft_id_ASC',
  NftIdAscNullsFirst = 'nft_id_ASC_NULLS_FIRST',
  NftIdAscNullsLast = 'nft_id_ASC_NULLS_LAST',
  NftIdDesc = 'nft_id_DESC',
  NftIdDescNullsFirst = 'nft_id_DESC_NULLS_FIRST',
  NftIdDescNullsLast = 'nft_id_DESC_NULLS_LAST',
  NftImageAsc = 'nft_image_ASC',
  NftImageAscNullsFirst = 'nft_image_ASC_NULLS_FIRST',
  NftImageAscNullsLast = 'nft_image_ASC_NULLS_LAST',
  NftImageDesc = 'nft_image_DESC',
  NftImageDescNullsFirst = 'nft_image_DESC_NULLS_FIRST',
  NftImageDescNullsLast = 'nft_image_DESC_NULLS_LAST',
  NftIssuerAsc = 'nft_issuer_ASC',
  NftIssuerAscNullsFirst = 'nft_issuer_ASC_NULLS_FIRST',
  NftIssuerAscNullsLast = 'nft_issuer_ASC_NULLS_LAST',
  NftIssuerDesc = 'nft_issuer_DESC',
  NftIssuerDescNullsFirst = 'nft_issuer_DESC_NULLS_FIRST',
  NftIssuerDescNullsLast = 'nft_issuer_DESC_NULLS_LAST',
  NftLewdAsc = 'nft_lewd_ASC',
  NftLewdAscNullsFirst = 'nft_lewd_ASC_NULLS_FIRST',
  NftLewdAscNullsLast = 'nft_lewd_ASC_NULLS_LAST',
  NftLewdDesc = 'nft_lewd_DESC',
  NftLewdDescNullsFirst = 'nft_lewd_DESC_NULLS_FIRST',
  NftLewdDescNullsLast = 'nft_lewd_DESC_NULLS_LAST',
  NftMediaAsc = 'nft_media_ASC',
  NftMediaAscNullsFirst = 'nft_media_ASC_NULLS_FIRST',
  NftMediaAscNullsLast = 'nft_media_ASC_NULLS_LAST',
  NftMediaDesc = 'nft_media_DESC',
  NftMediaDescNullsFirst = 'nft_media_DESC_NULLS_FIRST',
  NftMediaDescNullsLast = 'nft_media_DESC_NULLS_LAST',
  NftMetadataAsc = 'nft_metadata_ASC',
  NftMetadataAscNullsFirst = 'nft_metadata_ASC_NULLS_FIRST',
  NftMetadataAscNullsLast = 'nft_metadata_ASC_NULLS_LAST',
  NftMetadataDesc = 'nft_metadata_DESC',
  NftMetadataDescNullsFirst = 'nft_metadata_DESC_NULLS_FIRST',
  NftMetadataDescNullsLast = 'nft_metadata_DESC_NULLS_LAST',
  NftNameAsc = 'nft_name_ASC',
  NftNameAscNullsFirst = 'nft_name_ASC_NULLS_FIRST',
  NftNameAscNullsLast = 'nft_name_ASC_NULLS_LAST',
  NftNameDesc = 'nft_name_DESC',
  NftNameDescNullsFirst = 'nft_name_DESC_NULLS_FIRST',
  NftNameDescNullsLast = 'nft_name_DESC_NULLS_LAST',
  NftPriceAsc = 'nft_price_ASC',
  NftPriceAscNullsFirst = 'nft_price_ASC_NULLS_FIRST',
  NftPriceAscNullsLast = 'nft_price_ASC_NULLS_LAST',
  NftPriceDesc = 'nft_price_DESC',
  NftPriceDescNullsFirst = 'nft_price_DESC_NULLS_FIRST',
  NftPriceDescNullsLast = 'nft_price_DESC_NULLS_LAST',
  NftRecipientAsc = 'nft_recipient_ASC',
  NftRecipientAscNullsFirst = 'nft_recipient_ASC_NULLS_FIRST',
  NftRecipientAscNullsLast = 'nft_recipient_ASC_NULLS_LAST',
  NftRecipientDesc = 'nft_recipient_DESC',
  NftRecipientDescNullsFirst = 'nft_recipient_DESC_NULLS_FIRST',
  NftRecipientDescNullsLast = 'nft_recipient_DESC_NULLS_LAST',
  NftRoyaltyAsc = 'nft_royalty_ASC',
  NftRoyaltyAscNullsFirst = 'nft_royalty_ASC_NULLS_FIRST',
  NftRoyaltyAscNullsLast = 'nft_royalty_ASC_NULLS_LAST',
  NftRoyaltyDesc = 'nft_royalty_DESC',
  NftRoyaltyDescNullsFirst = 'nft_royalty_DESC_NULLS_FIRST',
  NftRoyaltyDescNullsLast = 'nft_royalty_DESC_NULLS_LAST',
  NftSnAsc = 'nft_sn_ASC',
  NftSnAscNullsFirst = 'nft_sn_ASC_NULLS_FIRST',
  NftSnAscNullsLast = 'nft_sn_ASC_NULLS_LAST',
  NftSnDesc = 'nft_sn_DESC',
  NftSnDescNullsFirst = 'nft_sn_DESC_NULLS_FIRST',
  NftSnDescNullsLast = 'nft_sn_DESC_NULLS_LAST',
  NftUpdatedAtAsc = 'nft_updatedAt_ASC',
  NftUpdatedAtAscNullsFirst = 'nft_updatedAt_ASC_NULLS_FIRST',
  NftUpdatedAtAscNullsLast = 'nft_updatedAt_ASC_NULLS_LAST',
  NftUpdatedAtDesc = 'nft_updatedAt_DESC',
  NftUpdatedAtDescNullsFirst = 'nft_updatedAt_DESC_NULLS_FIRST',
  NftUpdatedAtDescNullsLast = 'nft_updatedAt_DESC_NULLS_LAST',
  NftVersionAsc = 'nft_version_ASC',
  NftVersionAscNullsFirst = 'nft_version_ASC_NULLS_FIRST',
  NftVersionAscNullsLast = 'nft_version_ASC_NULLS_LAST',
  NftVersionDesc = 'nft_version_DESC',
  NftVersionDescNullsFirst = 'nft_version_DESC_NULLS_FIRST',
  NftVersionDescNullsLast = 'nft_version_DESC_NULLS_LAST',
  PriceAsc = 'price_ASC',
  PriceAscNullsFirst = 'price_ASC_NULLS_FIRST',
  PriceAscNullsLast = 'price_ASC_NULLS_LAST',
  PriceDesc = 'price_DESC',
  PriceDescNullsFirst = 'price_DESC_NULLS_FIRST',
  PriceDescNullsLast = 'price_DESC_NULLS_LAST',
  StatusAsc = 'status_ASC',
  StatusAscNullsFirst = 'status_ASC_NULLS_FIRST',
  StatusAscNullsLast = 'status_ASC_NULLS_LAST',
  StatusDesc = 'status_DESC',
  StatusDescNullsFirst = 'status_DESC_NULLS_FIRST',
  StatusDescNullsLast = 'status_DESC_NULLS_LAST',
  SurchargeAsc = 'surcharge_ASC',
  SurchargeAscNullsFirst = 'surcharge_ASC_NULLS_FIRST',
  SurchargeAscNullsLast = 'surcharge_ASC_NULLS_LAST',
  SurchargeDesc = 'surcharge_DESC',
  SurchargeDescNullsFirst = 'surcharge_DESC_NULLS_FIRST',
  SurchargeDescNullsLast = 'surcharge_DESC_NULLS_LAST',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
  UpdatedAtAscNullsLast = 'updatedAt_ASC_NULLS_LAST',
  UpdatedAtDesc = 'updatedAt_DESC',
  UpdatedAtDescNullsFirst = 'updatedAt_DESC_NULLS_FIRST',
  UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
}

export type SwapWhereInput = {
  AND?: InputMaybe<Array<SwapWhereInput>>
  OR?: InputMaybe<Array<SwapWhereInput>>
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
  considered?: InputMaybe<CollectionEntityWhereInput>
  considered_isNull?: InputMaybe<Scalars['Boolean']['input']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  desired?: InputMaybe<NftEntityWhereInput>
  desired_isNull?: InputMaybe<Scalars['Boolean']['input']>
  expiration_eq?: InputMaybe<Scalars['BigInt']['input']>
  expiration_gt?: InputMaybe<Scalars['BigInt']['input']>
  expiration_gte?: InputMaybe<Scalars['BigInt']['input']>
  expiration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  expiration_isNull?: InputMaybe<Scalars['Boolean']['input']>
  expiration_lt?: InputMaybe<Scalars['BigInt']['input']>
  expiration_lte?: InputMaybe<Scalars['BigInt']['input']>
  expiration_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  expiration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
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
  price_eq?: InputMaybe<Scalars['BigInt']['input']>
  price_gt?: InputMaybe<Scalars['BigInt']['input']>
  price_gte?: InputMaybe<Scalars['BigInt']['input']>
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  price_isNull?: InputMaybe<Scalars['Boolean']['input']>
  price_lt?: InputMaybe<Scalars['BigInt']['input']>
  price_lte?: InputMaybe<Scalars['BigInt']['input']>
  price_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  status_eq?: InputMaybe<TradeStatus>
  status_in?: InputMaybe<Array<TradeStatus>>
  status_isNull?: InputMaybe<Scalars['Boolean']['input']>
  status_not_eq?: InputMaybe<TradeStatus>
  status_not_in?: InputMaybe<Array<TradeStatus>>
  surcharge_eq?: InputMaybe<Surcharge>
  surcharge_in?: InputMaybe<Array<Surcharge>>
  surcharge_isNull?: InputMaybe<Scalars['Boolean']['input']>
  surcharge_not_eq?: InputMaybe<Surcharge>
  surcharge_not_in?: InputMaybe<Array<Surcharge>>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
}

export type SwapsConnection = {
  __typename?: 'SwapsConnection'
  edges: Array<SwapEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type TokenEntitiesConnection = {
  __typename?: 'TokenEntitiesConnection'
  edges: Array<TokenEntityEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type TokenEntity = {
  __typename?: 'TokenEntity'
  blockNumber?: Maybe<Scalars['BigInt']['output']>
  collection?: Maybe<CollectionEntity>
  count: Scalars['Int']['output']
  createdAt: Scalars['DateTime']['output']
  deleted: Scalars['Boolean']['output']
  hash: Scalars['String']['output']
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  media?: Maybe<Scalars['String']['output']>
  meta?: Maybe<MetadataEntity>
  metadata?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  nfts: Array<NftEntity>
  supply: Scalars['Int']['output']
  updatedAt: Scalars['DateTime']['output']
}

export type TokenEntityNftsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<NftEntityOrderByInput>>
  where?: InputMaybe<NftEntityWhereInput>
}

export type TokenEntityEdge = {
  __typename?: 'TokenEntityEdge'
  cursor: Scalars['String']['output']
  node: TokenEntity
}

export type TokenEntityModel = {
  __typename?: 'TokenEntityModel'
  blockNumber: Scalars['BigInt']['output']
  cheapest: Cheapest
  collection: Collection
  count: Scalars['Float']['output']
  createdAt: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  kind?: Maybe<Scalars['String']['output']>
  media?: Maybe<Scalars['String']['output']>
  meta?: Maybe<PartialMetadataEntity>
  metadata?: Maybe<Scalars['String']['output']>
  name: Scalars['String']['output']
  supply: Scalars['Float']['output']
  updatedAt: Scalars['DateTime']['output']
}

export enum TokenEntityOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  CollectionBaseUriAsc = 'collection_baseUri_ASC',
  CollectionBaseUriAscNullsFirst = 'collection_baseUri_ASC_NULLS_FIRST',
  CollectionBaseUriAscNullsLast = 'collection_baseUri_ASC_NULLS_LAST',
  CollectionBaseUriDesc = 'collection_baseUri_DESC',
  CollectionBaseUriDescNullsFirst = 'collection_baseUri_DESC_NULLS_FIRST',
  CollectionBaseUriDescNullsLast = 'collection_baseUri_DESC_NULLS_LAST',
  CollectionBlockNumberAsc = 'collection_blockNumber_ASC',
  CollectionBlockNumberAscNullsFirst = 'collection_blockNumber_ASC_NULLS_FIRST',
  CollectionBlockNumberAscNullsLast = 'collection_blockNumber_ASC_NULLS_LAST',
  CollectionBlockNumberDesc = 'collection_blockNumber_DESC',
  CollectionBlockNumberDescNullsFirst = 'collection_blockNumber_DESC_NULLS_FIRST',
  CollectionBlockNumberDescNullsLast = 'collection_blockNumber_DESC_NULLS_LAST',
  CollectionBurnedAsc = 'collection_burned_ASC',
  CollectionBurnedAscNullsFirst = 'collection_burned_ASC_NULLS_FIRST',
  CollectionBurnedAscNullsLast = 'collection_burned_ASC_NULLS_LAST',
  CollectionBurnedDesc = 'collection_burned_DESC',
  CollectionBurnedDescNullsFirst = 'collection_burned_DESC_NULLS_FIRST',
  CollectionBurnedDescNullsLast = 'collection_burned_DESC_NULLS_LAST',
  CollectionCreatedAtAsc = 'collection_createdAt_ASC',
  CollectionCreatedAtAscNullsFirst = 'collection_createdAt_ASC_NULLS_FIRST',
  CollectionCreatedAtAscNullsLast = 'collection_createdAt_ASC_NULLS_LAST',
  CollectionCreatedAtDesc = 'collection_createdAt_DESC',
  CollectionCreatedAtDescNullsFirst = 'collection_createdAt_DESC_NULLS_FIRST',
  CollectionCreatedAtDescNullsLast = 'collection_createdAt_DESC_NULLS_LAST',
  CollectionCurrentOwnerAsc = 'collection_currentOwner_ASC',
  CollectionCurrentOwnerAscNullsFirst = 'collection_currentOwner_ASC_NULLS_FIRST',
  CollectionCurrentOwnerAscNullsLast = 'collection_currentOwner_ASC_NULLS_LAST',
  CollectionCurrentOwnerDesc = 'collection_currentOwner_DESC',
  CollectionCurrentOwnerDescNullsFirst = 'collection_currentOwner_DESC_NULLS_FIRST',
  CollectionCurrentOwnerDescNullsLast = 'collection_currentOwner_DESC_NULLS_LAST',
  CollectionDistributionAsc = 'collection_distribution_ASC',
  CollectionDistributionAscNullsFirst = 'collection_distribution_ASC_NULLS_FIRST',
  CollectionDistributionAscNullsLast = 'collection_distribution_ASC_NULLS_LAST',
  CollectionDistributionDesc = 'collection_distribution_DESC',
  CollectionDistributionDescNullsFirst = 'collection_distribution_DESC_NULLS_FIRST',
  CollectionDistributionDescNullsLast = 'collection_distribution_DESC_NULLS_LAST',
  CollectionFloorAsc = 'collection_floor_ASC',
  CollectionFloorAscNullsFirst = 'collection_floor_ASC_NULLS_FIRST',
  CollectionFloorAscNullsLast = 'collection_floor_ASC_NULLS_LAST',
  CollectionFloorDesc = 'collection_floor_DESC',
  CollectionFloorDescNullsFirst = 'collection_floor_DESC_NULLS_FIRST',
  CollectionFloorDescNullsLast = 'collection_floor_DESC_NULLS_LAST',
  CollectionHashAsc = 'collection_hash_ASC',
  CollectionHashAscNullsFirst = 'collection_hash_ASC_NULLS_FIRST',
  CollectionHashAscNullsLast = 'collection_hash_ASC_NULLS_LAST',
  CollectionHashDesc = 'collection_hash_DESC',
  CollectionHashDescNullsFirst = 'collection_hash_DESC_NULLS_FIRST',
  CollectionHashDescNullsLast = 'collection_hash_DESC_NULLS_LAST',
  CollectionHighestSaleAsc = 'collection_highestSale_ASC',
  CollectionHighestSaleAscNullsFirst = 'collection_highestSale_ASC_NULLS_FIRST',
  CollectionHighestSaleAscNullsLast = 'collection_highestSale_ASC_NULLS_LAST',
  CollectionHighestSaleDesc = 'collection_highestSale_DESC',
  CollectionHighestSaleDescNullsFirst = 'collection_highestSale_DESC_NULLS_FIRST',
  CollectionHighestSaleDescNullsLast = 'collection_highestSale_DESC_NULLS_LAST',
  CollectionIdAsc = 'collection_id_ASC',
  CollectionIdAscNullsFirst = 'collection_id_ASC_NULLS_FIRST',
  CollectionIdAscNullsLast = 'collection_id_ASC_NULLS_LAST',
  CollectionIdDesc = 'collection_id_DESC',
  CollectionIdDescNullsFirst = 'collection_id_DESC_NULLS_FIRST',
  CollectionIdDescNullsLast = 'collection_id_DESC_NULLS_LAST',
  CollectionImageAsc = 'collection_image_ASC',
  CollectionImageAscNullsFirst = 'collection_image_ASC_NULLS_FIRST',
  CollectionImageAscNullsLast = 'collection_image_ASC_NULLS_LAST',
  CollectionImageDesc = 'collection_image_DESC',
  CollectionImageDescNullsFirst = 'collection_image_DESC_NULLS_FIRST',
  CollectionImageDescNullsLast = 'collection_image_DESC_NULLS_LAST',
  CollectionIssuerAsc = 'collection_issuer_ASC',
  CollectionIssuerAscNullsFirst = 'collection_issuer_ASC_NULLS_FIRST',
  CollectionIssuerAscNullsLast = 'collection_issuer_ASC_NULLS_LAST',
  CollectionIssuerDesc = 'collection_issuer_DESC',
  CollectionIssuerDescNullsFirst = 'collection_issuer_DESC_NULLS_FIRST',
  CollectionIssuerDescNullsLast = 'collection_issuer_DESC_NULLS_LAST',
  CollectionKindAsc = 'collection_kind_ASC',
  CollectionKindAscNullsFirst = 'collection_kind_ASC_NULLS_FIRST',
  CollectionKindAscNullsLast = 'collection_kind_ASC_NULLS_LAST',
  CollectionKindDesc = 'collection_kind_DESC',
  CollectionKindDescNullsFirst = 'collection_kind_DESC_NULLS_FIRST',
  CollectionKindDescNullsLast = 'collection_kind_DESC_NULLS_LAST',
  CollectionMaxAsc = 'collection_max_ASC',
  CollectionMaxAscNullsFirst = 'collection_max_ASC_NULLS_FIRST',
  CollectionMaxAscNullsLast = 'collection_max_ASC_NULLS_LAST',
  CollectionMaxDesc = 'collection_max_DESC',
  CollectionMaxDescNullsFirst = 'collection_max_DESC_NULLS_FIRST',
  CollectionMaxDescNullsLast = 'collection_max_DESC_NULLS_LAST',
  CollectionMediaAsc = 'collection_media_ASC',
  CollectionMediaAscNullsFirst = 'collection_media_ASC_NULLS_FIRST',
  CollectionMediaAscNullsLast = 'collection_media_ASC_NULLS_LAST',
  CollectionMediaDesc = 'collection_media_DESC',
  CollectionMediaDescNullsFirst = 'collection_media_DESC_NULLS_FIRST',
  CollectionMediaDescNullsLast = 'collection_media_DESC_NULLS_LAST',
  CollectionMetadataAsc = 'collection_metadata_ASC',
  CollectionMetadataAscNullsFirst = 'collection_metadata_ASC_NULLS_FIRST',
  CollectionMetadataAscNullsLast = 'collection_metadata_ASC_NULLS_LAST',
  CollectionMetadataDesc = 'collection_metadata_DESC',
  CollectionMetadataDescNullsFirst = 'collection_metadata_DESC_NULLS_FIRST',
  CollectionMetadataDescNullsLast = 'collection_metadata_DESC_NULLS_LAST',
  CollectionNameAsc = 'collection_name_ASC',
  CollectionNameAscNullsFirst = 'collection_name_ASC_NULLS_FIRST',
  CollectionNameAscNullsLast = 'collection_name_ASC_NULLS_LAST',
  CollectionNameDesc = 'collection_name_DESC',
  CollectionNameDescNullsFirst = 'collection_name_DESC_NULLS_FIRST',
  CollectionNameDescNullsLast = 'collection_name_DESC_NULLS_LAST',
  CollectionNftCountAsc = 'collection_nftCount_ASC',
  CollectionNftCountAscNullsFirst = 'collection_nftCount_ASC_NULLS_FIRST',
  CollectionNftCountAscNullsLast = 'collection_nftCount_ASC_NULLS_LAST',
  CollectionNftCountDesc = 'collection_nftCount_DESC',
  CollectionNftCountDescNullsFirst = 'collection_nftCount_DESC_NULLS_FIRST',
  CollectionNftCountDescNullsLast = 'collection_nftCount_DESC_NULLS_LAST',
  CollectionOwnerCountAsc = 'collection_ownerCount_ASC',
  CollectionOwnerCountAscNullsFirst = 'collection_ownerCount_ASC_NULLS_FIRST',
  CollectionOwnerCountAscNullsLast = 'collection_ownerCount_ASC_NULLS_LAST',
  CollectionOwnerCountDesc = 'collection_ownerCount_DESC',
  CollectionOwnerCountDescNullsFirst = 'collection_ownerCount_DESC_NULLS_FIRST',
  CollectionOwnerCountDescNullsLast = 'collection_ownerCount_DESC_NULLS_LAST',
  CollectionRecipientAsc = 'collection_recipient_ASC',
  CollectionRecipientAscNullsFirst = 'collection_recipient_ASC_NULLS_FIRST',
  CollectionRecipientAscNullsLast = 'collection_recipient_ASC_NULLS_LAST',
  CollectionRecipientDesc = 'collection_recipient_DESC',
  CollectionRecipientDescNullsFirst = 'collection_recipient_DESC_NULLS_FIRST',
  CollectionRecipientDescNullsLast = 'collection_recipient_DESC_NULLS_LAST',
  CollectionRoyaltyAsc = 'collection_royalty_ASC',
  CollectionRoyaltyAscNullsFirst = 'collection_royalty_ASC_NULLS_FIRST',
  CollectionRoyaltyAscNullsLast = 'collection_royalty_ASC_NULLS_LAST',
  CollectionRoyaltyDesc = 'collection_royalty_DESC',
  CollectionRoyaltyDescNullsFirst = 'collection_royalty_DESC_NULLS_FIRST',
  CollectionRoyaltyDescNullsLast = 'collection_royalty_DESC_NULLS_LAST',
  CollectionSupplyAsc = 'collection_supply_ASC',
  CollectionSupplyAscNullsFirst = 'collection_supply_ASC_NULLS_FIRST',
  CollectionSupplyAscNullsLast = 'collection_supply_ASC_NULLS_LAST',
  CollectionSupplyDesc = 'collection_supply_DESC',
  CollectionSupplyDescNullsFirst = 'collection_supply_DESC_NULLS_FIRST',
  CollectionSupplyDescNullsLast = 'collection_supply_DESC_NULLS_LAST',
  CollectionTypeAsc = 'collection_type_ASC',
  CollectionTypeAscNullsFirst = 'collection_type_ASC_NULLS_FIRST',
  CollectionTypeAscNullsLast = 'collection_type_ASC_NULLS_LAST',
  CollectionTypeDesc = 'collection_type_DESC',
  CollectionTypeDescNullsFirst = 'collection_type_DESC_NULLS_FIRST',
  CollectionTypeDescNullsLast = 'collection_type_DESC_NULLS_LAST',
  CollectionUpdatedAtAsc = 'collection_updatedAt_ASC',
  CollectionUpdatedAtAscNullsFirst = 'collection_updatedAt_ASC_NULLS_FIRST',
  CollectionUpdatedAtAscNullsLast = 'collection_updatedAt_ASC_NULLS_LAST',
  CollectionUpdatedAtDesc = 'collection_updatedAt_DESC',
  CollectionUpdatedAtDescNullsFirst = 'collection_updatedAt_DESC_NULLS_FIRST',
  CollectionUpdatedAtDescNullsLast = 'collection_updatedAt_DESC_NULLS_LAST',
  CollectionVersionAsc = 'collection_version_ASC',
  CollectionVersionAscNullsFirst = 'collection_version_ASC_NULLS_FIRST',
  CollectionVersionAscNullsLast = 'collection_version_ASC_NULLS_LAST',
  CollectionVersionDesc = 'collection_version_DESC',
  CollectionVersionDescNullsFirst = 'collection_version_DESC_NULLS_FIRST',
  CollectionVersionDescNullsLast = 'collection_version_DESC_NULLS_LAST',
  CollectionVolumeAsc = 'collection_volume_ASC',
  CollectionVolumeAscNullsFirst = 'collection_volume_ASC_NULLS_FIRST',
  CollectionVolumeAscNullsLast = 'collection_volume_ASC_NULLS_LAST',
  CollectionVolumeDesc = 'collection_volume_DESC',
  CollectionVolumeDescNullsFirst = 'collection_volume_DESC_NULLS_FIRST',
  CollectionVolumeDescNullsLast = 'collection_volume_DESC_NULLS_LAST',
  CountAsc = 'count_ASC',
  CountAscNullsFirst = 'count_ASC_NULLS_FIRST',
  CountAscNullsLast = 'count_ASC_NULLS_LAST',
  CountDesc = 'count_DESC',
  CountDescNullsFirst = 'count_DESC_NULLS_FIRST',
  CountDescNullsLast = 'count_DESC_NULLS_LAST',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
  CreatedAtAscNullsLast = 'createdAt_ASC_NULLS_LAST',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedAtDescNullsFirst = 'createdAt_DESC_NULLS_FIRST',
  CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
  DeletedAsc = 'deleted_ASC',
  DeletedAscNullsFirst = 'deleted_ASC_NULLS_FIRST',
  DeletedAscNullsLast = 'deleted_ASC_NULLS_LAST',
  DeletedDesc = 'deleted_DESC',
  DeletedDescNullsFirst = 'deleted_DESC_NULLS_FIRST',
  DeletedDescNullsLast = 'deleted_DESC_NULLS_LAST',
  HashAsc = 'hash_ASC',
  HashAscNullsFirst = 'hash_ASC_NULLS_FIRST',
  HashAscNullsLast = 'hash_ASC_NULLS_LAST',
  HashDesc = 'hash_DESC',
  HashDescNullsFirst = 'hash_DESC_NULLS_FIRST',
  HashDescNullsLast = 'hash_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  ImageAsc = 'image_ASC',
  ImageAscNullsFirst = 'image_ASC_NULLS_FIRST',
  ImageAscNullsLast = 'image_ASC_NULLS_LAST',
  ImageDesc = 'image_DESC',
  ImageDescNullsFirst = 'image_DESC_NULLS_FIRST',
  ImageDescNullsLast = 'image_DESC_NULLS_LAST',
  MediaAsc = 'media_ASC',
  MediaAscNullsFirst = 'media_ASC_NULLS_FIRST',
  MediaAscNullsLast = 'media_ASC_NULLS_LAST',
  MediaDesc = 'media_DESC',
  MediaDescNullsFirst = 'media_DESC_NULLS_FIRST',
  MediaDescNullsLast = 'media_DESC_NULLS_LAST',
  MetaAnimationUrlAsc = 'meta_animationUrl_ASC',
  MetaAnimationUrlAscNullsFirst = 'meta_animationUrl_ASC_NULLS_FIRST',
  MetaAnimationUrlAscNullsLast = 'meta_animationUrl_ASC_NULLS_LAST',
  MetaAnimationUrlDesc = 'meta_animationUrl_DESC',
  MetaAnimationUrlDescNullsFirst = 'meta_animationUrl_DESC_NULLS_FIRST',
  MetaAnimationUrlDescNullsLast = 'meta_animationUrl_DESC_NULLS_LAST',
  MetaBannerAsc = 'meta_banner_ASC',
  MetaBannerAscNullsFirst = 'meta_banner_ASC_NULLS_FIRST',
  MetaBannerAscNullsLast = 'meta_banner_ASC_NULLS_LAST',
  MetaBannerDesc = 'meta_banner_DESC',
  MetaBannerDescNullsFirst = 'meta_banner_DESC_NULLS_FIRST',
  MetaBannerDescNullsLast = 'meta_banner_DESC_NULLS_LAST',
  MetaDescriptionAsc = 'meta_description_ASC',
  MetaDescriptionAscNullsFirst = 'meta_description_ASC_NULLS_FIRST',
  MetaDescriptionAscNullsLast = 'meta_description_ASC_NULLS_LAST',
  MetaDescriptionDesc = 'meta_description_DESC',
  MetaDescriptionDescNullsFirst = 'meta_description_DESC_NULLS_FIRST',
  MetaDescriptionDescNullsLast = 'meta_description_DESC_NULLS_LAST',
  MetaIdAsc = 'meta_id_ASC',
  MetaIdAscNullsFirst = 'meta_id_ASC_NULLS_FIRST',
  MetaIdAscNullsLast = 'meta_id_ASC_NULLS_LAST',
  MetaIdDesc = 'meta_id_DESC',
  MetaIdDescNullsFirst = 'meta_id_DESC_NULLS_FIRST',
  MetaIdDescNullsLast = 'meta_id_DESC_NULLS_LAST',
  MetaImageAsc = 'meta_image_ASC',
  MetaImageAscNullsFirst = 'meta_image_ASC_NULLS_FIRST',
  MetaImageAscNullsLast = 'meta_image_ASC_NULLS_LAST',
  MetaImageDesc = 'meta_image_DESC',
  MetaImageDescNullsFirst = 'meta_image_DESC_NULLS_FIRST',
  MetaImageDescNullsLast = 'meta_image_DESC_NULLS_LAST',
  MetaKindAsc = 'meta_kind_ASC',
  MetaKindAscNullsFirst = 'meta_kind_ASC_NULLS_FIRST',
  MetaKindAscNullsLast = 'meta_kind_ASC_NULLS_LAST',
  MetaKindDesc = 'meta_kind_DESC',
  MetaKindDescNullsFirst = 'meta_kind_DESC_NULLS_FIRST',
  MetaKindDescNullsLast = 'meta_kind_DESC_NULLS_LAST',
  MetaNameAsc = 'meta_name_ASC',
  MetaNameAscNullsFirst = 'meta_name_ASC_NULLS_FIRST',
  MetaNameAscNullsLast = 'meta_name_ASC_NULLS_LAST',
  MetaNameDesc = 'meta_name_DESC',
  MetaNameDescNullsFirst = 'meta_name_DESC_NULLS_FIRST',
  MetaNameDescNullsLast = 'meta_name_DESC_NULLS_LAST',
  MetaTypeAsc = 'meta_type_ASC',
  MetaTypeAscNullsFirst = 'meta_type_ASC_NULLS_FIRST',
  MetaTypeAscNullsLast = 'meta_type_ASC_NULLS_LAST',
  MetaTypeDesc = 'meta_type_DESC',
  MetaTypeDescNullsFirst = 'meta_type_DESC_NULLS_FIRST',
  MetaTypeDescNullsLast = 'meta_type_DESC_NULLS_LAST',
  MetadataAsc = 'metadata_ASC',
  MetadataAscNullsFirst = 'metadata_ASC_NULLS_FIRST',
  MetadataAscNullsLast = 'metadata_ASC_NULLS_LAST',
  MetadataDesc = 'metadata_DESC',
  MetadataDescNullsFirst = 'metadata_DESC_NULLS_FIRST',
  MetadataDescNullsLast = 'metadata_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameAscNullsLast = 'name_ASC_NULLS_LAST',
  NameDesc = 'name_DESC',
  NameDescNullsFirst = 'name_DESC_NULLS_FIRST',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  SupplyAsc = 'supply_ASC',
  SupplyAscNullsFirst = 'supply_ASC_NULLS_FIRST',
  SupplyAscNullsLast = 'supply_ASC_NULLS_LAST',
  SupplyDesc = 'supply_DESC',
  SupplyDescNullsFirst = 'supply_DESC_NULLS_FIRST',
  SupplyDescNullsLast = 'supply_DESC_NULLS_LAST',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
  UpdatedAtAscNullsLast = 'updatedAt_ASC_NULLS_LAST',
  UpdatedAtDesc = 'updatedAt_DESC',
  UpdatedAtDescNullsFirst = 'updatedAt_DESC_NULLS_FIRST',
  UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
}

export type TokenEntityQueryResult = {
  __typename?: 'TokenEntityQueryResult'
  block_number: Scalars['BigInt']['output']
  cheapest_current_owner?: Maybe<Scalars['String']['output']>
  cheapest_id?: Maybe<Scalars['String']['output']>
  cheapest_price?: Maybe<Scalars['BigInt']['output']>
  collection_id: Scalars['String']['output']
  collection_name: Scalars['String']['output']
  count: Scalars['Float']['output']
  created_at: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  kind?: Maybe<Scalars['String']['output']>
  media?: Maybe<Scalars['String']['output']>
  meta_animation_url?: Maybe<Scalars['String']['output']>
  meta_description?: Maybe<Scalars['String']['output']>
  meta_id: Scalars['String']['output']
  meta_image?: Maybe<Scalars['String']['output']>
  name: Scalars['String']['output']
  supply: Scalars['Float']['output']
  updated_at: Scalars['DateTime']['output']
}

export type TokenEntityWhereInput = {
  AND?: InputMaybe<Array<TokenEntityWhereInput>>
  OR?: InputMaybe<Array<TokenEntityWhereInput>>
  blockNumber_eq?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_eq?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  collection?: InputMaybe<CollectionEntityWhereInput>
  collection_isNull?: InputMaybe<Scalars['Boolean']['input']>
  count_eq?: InputMaybe<Scalars['Int']['input']>
  count_gt?: InputMaybe<Scalars['Int']['input']>
  count_gte?: InputMaybe<Scalars['Int']['input']>
  count_in?: InputMaybe<Array<Scalars['Int']['input']>>
  count_isNull?: InputMaybe<Scalars['Boolean']['input']>
  count_lt?: InputMaybe<Scalars['Int']['input']>
  count_lte?: InputMaybe<Scalars['Int']['input']>
  count_not_eq?: InputMaybe<Scalars['Int']['input']>
  count_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  deleted_eq?: InputMaybe<Scalars['Boolean']['input']>
  deleted_isNull?: InputMaybe<Scalars['Boolean']['input']>
  deleted_not_eq?: InputMaybe<Scalars['Boolean']['input']>
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
  updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>
}

export enum TradeStatus {
  Accepted = 'ACCEPTED',
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  Invalid = 'INVALID',
  Withdrawn = 'WITHDRAWN',
}

export type CollectionListWithSearchQueryVariables = Exact<{
  first: Scalars['Int']['input']
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<CollectionEntityOrderByInput> | CollectionEntityOrderByInput>
  address: Scalars['String']['input']
}>

export type CollectionListWithSearchQuery = {
  __typename?: 'Query'
  collections: Array<{
    __typename?: 'CollectionEntity'
    id: string
    name?: string | null
    max?: number | null
    nfts: Array<{
      __typename?: 'NFTEntity'
      id: string
      sn: any
      currentOwner: string
      meta?: {
        __typename?: 'MetadataEntity'
        name?: string | null
        description?: string | null
        image?: string | null
        attributes?: Array<{ __typename?: 'Attribute'; trait?: string | null; value: string }> | null
      } | null
    }>
  }>
}

export const CollectionListWithSearchDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'collectionListWithSearch' },
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
              type: { kind: 'NamedType', name: { kind: 'Name', value: 'CollectionEntityOrderByInput' } },
            },
          },
          defaultValue: { kind: 'ListValue', values: [{ kind: 'EnumValue', value: 'blockNumber_DESC' }] },
        },
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
            alias: { kind: 'Name', value: 'collections' },
            name: { kind: 'Name', value: 'collectionEntities' },
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
                      name: { kind: 'Name', value: 'nfts_some' },
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
                            name: { kind: 'Name', value: 'currentOwner_eq' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nfts' },
                  arguments: [
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
                            name: { kind: 'Name', value: 'currentOwner_eq' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
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
} as unknown as DocumentNode<CollectionListWithSearchQuery, CollectionListWithSearchQueryVariables>
