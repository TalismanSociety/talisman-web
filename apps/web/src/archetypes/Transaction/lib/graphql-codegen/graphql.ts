/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Big number integer */
  BigInt: any;
  /** A date-time string in simplified extended ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) */
  DateTime: any;
  JSON: any;
};

export type Address = {
  __typename?: 'Address';
  events: Array<AddressEvent>;
  id: Scalars['String'];
};


export type AddressEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AddressEventOrderByInput>>;
  where?: InputMaybe<AddressEventWhereInput>;
};

export type AddressEdge = {
  __typename?: 'AddressEdge';
  cursor: Scalars['String'];
  node: Address;
};

export type AddressEvent = {
  __typename?: 'AddressEvent';
  address: Address;
  event: Event;
  id: Scalars['String'];
};

export type AddressEventEdge = {
  __typename?: 'AddressEventEdge';
  cursor: Scalars['String'];
  node: AddressEvent;
};

export enum AddressEventOrderByInput {
  AddressIdAsc = 'address_id_ASC',
  AddressIdDesc = 'address_id_DESC',
  EventIdAsc = 'event_id_ASC',
  EventIdDesc = 'event_id_DESC',
  EventIndexInBlockAsc = 'event_indexInBlock_ASC',
  EventIndexInBlockDesc = 'event_indexInBlock_DESC',
  EventNameAsc = 'event_name_ASC',
  EventNameDesc = 'event_name_DESC',
  EventPhaseAsc = 'event_phase_ASC',
  EventPhaseDesc = 'event_phase_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type AddressEventWhereInput = {
  AND?: InputMaybe<Array<AddressEventWhereInput>>;
  OR?: InputMaybe<Array<AddressEventWhereInput>>;
  address?: InputMaybe<AddressWhereInput>;
  address_isNull?: InputMaybe<Scalars['Boolean']>;
  event?: InputMaybe<EventWhereInput>;
  event_isNull?: InputMaybe<Scalars['Boolean']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
};

export type AddressEventsConnection = {
  __typename?: 'AddressEventsConnection';
  edges: Array<AddressEventEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export enum AddressOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type AddressWhereInput = {
  AND?: InputMaybe<Array<AddressWhereInput>>;
  OR?: InputMaybe<Array<AddressWhereInput>>;
  events_every?: InputMaybe<AddressEventWhereInput>;
  events_none?: InputMaybe<AddressEventWhereInput>;
  events_some?: InputMaybe<AddressEventWhereInput>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
};

export type AddressesConnection = {
  __typename?: 'AddressesConnection';
  edges: Array<AddressEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Block = {
  __typename?: 'Block';
  blockHash: Scalars['String'];
  blockNumber: Scalars['Int'];
  calls: Array<Call>;
  chainId: Scalars['String'];
  events: Array<Event>;
  extrinsics: Array<Extrinsic>;
  id: Scalars['String'];
  ss58Format: Scalars['Int'];
  timestamp: Scalars['DateTime'];
};


export type BlockCallsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CallOrderByInput>>;
  where?: InputMaybe<CallWhereInput>;
};


export type BlockEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EventOrderByInput>>;
  where?: InputMaybe<EventWhereInput>;
};


export type BlockExtrinsicsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ExtrinsicOrderByInput>>;
  where?: InputMaybe<ExtrinsicWhereInput>;
};

export type BlockEdge = {
  __typename?: 'BlockEdge';
  cursor: Scalars['String'];
  node: Block;
};

export enum BlockOrderByInput {
  BlockHashAsc = 'blockHash_ASC',
  BlockHashDesc = 'blockHash_DESC',
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  ChainIdAsc = 'chainId_ASC',
  ChainIdDesc = 'chainId_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  Ss58FormatAsc = 'ss58Format_ASC',
  Ss58FormatDesc = 'ss58Format_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC'
}

export type BlockWhereInput = {
  AND?: InputMaybe<Array<BlockWhereInput>>;
  OR?: InputMaybe<Array<BlockWhereInput>>;
  blockHash_contains?: InputMaybe<Scalars['String']>;
  blockHash_containsInsensitive?: InputMaybe<Scalars['String']>;
  blockHash_endsWith?: InputMaybe<Scalars['String']>;
  blockHash_eq?: InputMaybe<Scalars['String']>;
  blockHash_gt?: InputMaybe<Scalars['String']>;
  blockHash_gte?: InputMaybe<Scalars['String']>;
  blockHash_in?: InputMaybe<Array<Scalars['String']>>;
  blockHash_isNull?: InputMaybe<Scalars['Boolean']>;
  blockHash_lt?: InputMaybe<Scalars['String']>;
  blockHash_lte?: InputMaybe<Scalars['String']>;
  blockHash_not_contains?: InputMaybe<Scalars['String']>;
  blockHash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  blockHash_not_endsWith?: InputMaybe<Scalars['String']>;
  blockHash_not_eq?: InputMaybe<Scalars['String']>;
  blockHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  blockHash_not_startsWith?: InputMaybe<Scalars['String']>;
  blockHash_startsWith?: InputMaybe<Scalars['String']>;
  blockNumber_eq?: InputMaybe<Scalars['Int']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']>;
  blockNumber_lt?: InputMaybe<Scalars['Int']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']>;
  blockNumber_not_eq?: InputMaybe<Scalars['Int']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  calls_every?: InputMaybe<CallWhereInput>;
  calls_none?: InputMaybe<CallWhereInput>;
  calls_some?: InputMaybe<CallWhereInput>;
  chainId_contains?: InputMaybe<Scalars['String']>;
  chainId_containsInsensitive?: InputMaybe<Scalars['String']>;
  chainId_endsWith?: InputMaybe<Scalars['String']>;
  chainId_eq?: InputMaybe<Scalars['String']>;
  chainId_gt?: InputMaybe<Scalars['String']>;
  chainId_gte?: InputMaybe<Scalars['String']>;
  chainId_in?: InputMaybe<Array<Scalars['String']>>;
  chainId_isNull?: InputMaybe<Scalars['Boolean']>;
  chainId_lt?: InputMaybe<Scalars['String']>;
  chainId_lte?: InputMaybe<Scalars['String']>;
  chainId_not_contains?: InputMaybe<Scalars['String']>;
  chainId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  chainId_not_endsWith?: InputMaybe<Scalars['String']>;
  chainId_not_eq?: InputMaybe<Scalars['String']>;
  chainId_not_in?: InputMaybe<Array<Scalars['String']>>;
  chainId_not_startsWith?: InputMaybe<Scalars['String']>;
  chainId_startsWith?: InputMaybe<Scalars['String']>;
  events_every?: InputMaybe<EventWhereInput>;
  events_none?: InputMaybe<EventWhereInput>;
  events_some?: InputMaybe<EventWhereInput>;
  extrinsics_every?: InputMaybe<ExtrinsicWhereInput>;
  extrinsics_none?: InputMaybe<ExtrinsicWhereInput>;
  extrinsics_some?: InputMaybe<ExtrinsicWhereInput>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  ss58Format_eq?: InputMaybe<Scalars['Int']>;
  ss58Format_gt?: InputMaybe<Scalars['Int']>;
  ss58Format_gte?: InputMaybe<Scalars['Int']>;
  ss58Format_in?: InputMaybe<Array<Scalars['Int']>>;
  ss58Format_isNull?: InputMaybe<Scalars['Boolean']>;
  ss58Format_lt?: InputMaybe<Scalars['Int']>;
  ss58Format_lte?: InputMaybe<Scalars['Int']>;
  ss58Format_not_eq?: InputMaybe<Scalars['Int']>;
  ss58Format_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>;
};

export type BlocksConnection = {
  __typename?: 'BlocksConnection';
  edges: Array<BlockEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Call = {
  __typename?: 'Call';
  block: Block;
  calls: Array<Call>;
  data?: Maybe<Scalars['JSON']>;
  events: Array<Event>;
  extrinsics: Array<Extrinsic>;
  id: Scalars['String'];
  name: Scalars['String'];
  parent?: Maybe<Call>;
};


export type CallCallsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CallOrderByInput>>;
  where?: InputMaybe<CallWhereInput>;
};


export type CallEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EventOrderByInput>>;
  where?: InputMaybe<EventWhereInput>;
};


export type CallExtrinsicsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ExtrinsicOrderByInput>>;
  where?: InputMaybe<ExtrinsicWhereInput>;
};

export type CallEdge = {
  __typename?: 'CallEdge';
  cursor: Scalars['String'];
  node: Call;
};

export enum CallOrderByInput {
  BlockBlockHashAsc = 'block_blockHash_ASC',
  BlockBlockHashDesc = 'block_blockHash_DESC',
  BlockBlockNumberAsc = 'block_blockNumber_ASC',
  BlockBlockNumberDesc = 'block_blockNumber_DESC',
  BlockChainIdAsc = 'block_chainId_ASC',
  BlockChainIdDesc = 'block_chainId_DESC',
  BlockIdAsc = 'block_id_ASC',
  BlockIdDesc = 'block_id_DESC',
  BlockSs58FormatAsc = 'block_ss58Format_ASC',
  BlockSs58FormatDesc = 'block_ss58Format_DESC',
  BlockTimestampAsc = 'block_timestamp_ASC',
  BlockTimestampDesc = 'block_timestamp_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  ParentIdAsc = 'parent_id_ASC',
  ParentIdDesc = 'parent_id_DESC',
  ParentNameAsc = 'parent_name_ASC',
  ParentNameDesc = 'parent_name_DESC'
}

export type CallWhereInput = {
  AND?: InputMaybe<Array<CallWhereInput>>;
  OR?: InputMaybe<Array<CallWhereInput>>;
  block?: InputMaybe<BlockWhereInput>;
  block_isNull?: InputMaybe<Scalars['Boolean']>;
  calls_every?: InputMaybe<CallWhereInput>;
  calls_none?: InputMaybe<CallWhereInput>;
  calls_some?: InputMaybe<CallWhereInput>;
  data_eq?: InputMaybe<Scalars['JSON']>;
  data_isNull?: InputMaybe<Scalars['Boolean']>;
  data_jsonContains?: InputMaybe<Scalars['JSON']>;
  data_jsonHasKey?: InputMaybe<Scalars['JSON']>;
  data_not_eq?: InputMaybe<Scalars['JSON']>;
  events_every?: InputMaybe<EventWhereInput>;
  events_none?: InputMaybe<EventWhereInput>;
  events_some?: InputMaybe<EventWhereInput>;
  extrinsics_every?: InputMaybe<ExtrinsicWhereInput>;
  extrinsics_none?: InputMaybe<ExtrinsicWhereInput>;
  extrinsics_some?: InputMaybe<ExtrinsicWhereInput>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_endsWith?: InputMaybe<Scalars['String']>;
  name_eq?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_not_endsWith?: InputMaybe<Scalars['String']>;
  name_not_eq?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']>;
  name_startsWith?: InputMaybe<Scalars['String']>;
  parent?: InputMaybe<CallWhereInput>;
  parent_isNull?: InputMaybe<Scalars['Boolean']>;
};

export type CallsConnection = {
  __typename?: 'CallsConnection';
  edges: Array<CallEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Event = {
  __typename?: 'Event';
  args?: Maybe<Scalars['JSON']>;
  block: Block;
  call?: Maybe<Call>;
  extrinsic?: Maybe<Extrinsic>;
  id: Scalars['String'];
  indexInBlock: Scalars['Int'];
  name: Scalars['String'];
  phase: Scalars['String'];
  relatedAddresses: Array<AddressEvent>;
};


export type EventRelatedAddressesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AddressEventOrderByInput>>;
  where?: InputMaybe<AddressEventWhereInput>;
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor: Scalars['String'];
  node: Event;
};

export enum EventOrderByInput {
  BlockBlockHashAsc = 'block_blockHash_ASC',
  BlockBlockHashDesc = 'block_blockHash_DESC',
  BlockBlockNumberAsc = 'block_blockNumber_ASC',
  BlockBlockNumberDesc = 'block_blockNumber_DESC',
  BlockChainIdAsc = 'block_chainId_ASC',
  BlockChainIdDesc = 'block_chainId_DESC',
  BlockIdAsc = 'block_id_ASC',
  BlockIdDesc = 'block_id_DESC',
  BlockSs58FormatAsc = 'block_ss58Format_ASC',
  BlockSs58FormatDesc = 'block_ss58Format_DESC',
  BlockTimestampAsc = 'block_timestamp_ASC',
  BlockTimestampDesc = 'block_timestamp_DESC',
  CallIdAsc = 'call_id_ASC',
  CallIdDesc = 'call_id_DESC',
  CallNameAsc = 'call_name_ASC',
  CallNameDesc = 'call_name_DESC',
  ExtrinsicErrorAsc = 'extrinsic_error_ASC',
  ExtrinsicErrorDesc = 'extrinsic_error_DESC',
  ExtrinsicFeeAsc = 'extrinsic_fee_ASC',
  ExtrinsicFeeDesc = 'extrinsic_fee_DESC',
  ExtrinsicHashAsc = 'extrinsic_hash_ASC',
  ExtrinsicHashDesc = 'extrinsic_hash_DESC',
  ExtrinsicIdAsc = 'extrinsic_id_ASC',
  ExtrinsicIdDesc = 'extrinsic_id_DESC',
  ExtrinsicIndexInBlockAsc = 'extrinsic_indexInBlock_ASC',
  ExtrinsicIndexInBlockDesc = 'extrinsic_indexInBlock_DESC',
  ExtrinsicSignatureTypeAsc = 'extrinsic_signatureType_ASC',
  ExtrinsicSignatureTypeDesc = 'extrinsic_signatureType_DESC',
  ExtrinsicSignatureAsc = 'extrinsic_signature_ASC',
  ExtrinsicSignatureDesc = 'extrinsic_signature_DESC',
  ExtrinsicSignerAsc = 'extrinsic_signer_ASC',
  ExtrinsicSignerDesc = 'extrinsic_signer_DESC',
  ExtrinsicSuccessAsc = 'extrinsic_success_ASC',
  ExtrinsicSuccessDesc = 'extrinsic_success_DESC',
  ExtrinsicTipAsc = 'extrinsic_tip_ASC',
  ExtrinsicTipDesc = 'extrinsic_tip_DESC',
  ExtrinsicVersionAsc = 'extrinsic_version_ASC',
  ExtrinsicVersionDesc = 'extrinsic_version_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IndexInBlockAsc = 'indexInBlock_ASC',
  IndexInBlockDesc = 'indexInBlock_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  PhaseAsc = 'phase_ASC',
  PhaseDesc = 'phase_DESC'
}

export type EventWhereInput = {
  AND?: InputMaybe<Array<EventWhereInput>>;
  OR?: InputMaybe<Array<EventWhereInput>>;
  args_eq?: InputMaybe<Scalars['JSON']>;
  args_isNull?: InputMaybe<Scalars['Boolean']>;
  args_jsonContains?: InputMaybe<Scalars['JSON']>;
  args_jsonHasKey?: InputMaybe<Scalars['JSON']>;
  args_not_eq?: InputMaybe<Scalars['JSON']>;
  block?: InputMaybe<BlockWhereInput>;
  block_isNull?: InputMaybe<Scalars['Boolean']>;
  call?: InputMaybe<CallWhereInput>;
  call_isNull?: InputMaybe<Scalars['Boolean']>;
  extrinsic?: InputMaybe<ExtrinsicWhereInput>;
  extrinsic_isNull?: InputMaybe<Scalars['Boolean']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  indexInBlock_eq?: InputMaybe<Scalars['Int']>;
  indexInBlock_gt?: InputMaybe<Scalars['Int']>;
  indexInBlock_gte?: InputMaybe<Scalars['Int']>;
  indexInBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  indexInBlock_isNull?: InputMaybe<Scalars['Boolean']>;
  indexInBlock_lt?: InputMaybe<Scalars['Int']>;
  indexInBlock_lte?: InputMaybe<Scalars['Int']>;
  indexInBlock_not_eq?: InputMaybe<Scalars['Int']>;
  indexInBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_endsWith?: InputMaybe<Scalars['String']>;
  name_eq?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_not_endsWith?: InputMaybe<Scalars['String']>;
  name_not_eq?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']>;
  name_startsWith?: InputMaybe<Scalars['String']>;
  phase_contains?: InputMaybe<Scalars['String']>;
  phase_containsInsensitive?: InputMaybe<Scalars['String']>;
  phase_endsWith?: InputMaybe<Scalars['String']>;
  phase_eq?: InputMaybe<Scalars['String']>;
  phase_gt?: InputMaybe<Scalars['String']>;
  phase_gte?: InputMaybe<Scalars['String']>;
  phase_in?: InputMaybe<Array<Scalars['String']>>;
  phase_isNull?: InputMaybe<Scalars['Boolean']>;
  phase_lt?: InputMaybe<Scalars['String']>;
  phase_lte?: InputMaybe<Scalars['String']>;
  phase_not_contains?: InputMaybe<Scalars['String']>;
  phase_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  phase_not_endsWith?: InputMaybe<Scalars['String']>;
  phase_not_eq?: InputMaybe<Scalars['String']>;
  phase_not_in?: InputMaybe<Array<Scalars['String']>>;
  phase_not_startsWith?: InputMaybe<Scalars['String']>;
  phase_startsWith?: InputMaybe<Scalars['String']>;
  relatedAddresses_every?: InputMaybe<AddressEventWhereInput>;
  relatedAddresses_none?: InputMaybe<AddressEventWhereInput>;
  relatedAddresses_some?: InputMaybe<AddressEventWhereInput>;
};

export type EventsConnection = {
  __typename?: 'EventsConnection';
  edges: Array<EventEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Extrinsic = {
  __typename?: 'Extrinsic';
  block: Block;
  call?: Maybe<Call>;
  error?: Maybe<Scalars['String']>;
  events: Array<Event>;
  fee?: Maybe<Scalars['BigInt']>;
  hash: Scalars['String'];
  id: Scalars['String'];
  indexInBlock: Scalars['Int'];
  signature?: Maybe<Scalars['String']>;
  signatureType?: Maybe<Scalars['String']>;
  signer?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
  tip?: Maybe<Scalars['BigInt']>;
  version: Scalars['Int'];
};


export type ExtrinsicEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EventOrderByInput>>;
  where?: InputMaybe<EventWhereInput>;
};

export type ExtrinsicEdge = {
  __typename?: 'ExtrinsicEdge';
  cursor: Scalars['String'];
  node: Extrinsic;
};

export enum ExtrinsicOrderByInput {
  BlockBlockHashAsc = 'block_blockHash_ASC',
  BlockBlockHashDesc = 'block_blockHash_DESC',
  BlockBlockNumberAsc = 'block_blockNumber_ASC',
  BlockBlockNumberDesc = 'block_blockNumber_DESC',
  BlockChainIdAsc = 'block_chainId_ASC',
  BlockChainIdDesc = 'block_chainId_DESC',
  BlockIdAsc = 'block_id_ASC',
  BlockIdDesc = 'block_id_DESC',
  BlockSs58FormatAsc = 'block_ss58Format_ASC',
  BlockSs58FormatDesc = 'block_ss58Format_DESC',
  BlockTimestampAsc = 'block_timestamp_ASC',
  BlockTimestampDesc = 'block_timestamp_DESC',
  CallIdAsc = 'call_id_ASC',
  CallIdDesc = 'call_id_DESC',
  CallNameAsc = 'call_name_ASC',
  CallNameDesc = 'call_name_DESC',
  ErrorAsc = 'error_ASC',
  ErrorDesc = 'error_DESC',
  FeeAsc = 'fee_ASC',
  FeeDesc = 'fee_DESC',
  HashAsc = 'hash_ASC',
  HashDesc = 'hash_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IndexInBlockAsc = 'indexInBlock_ASC',
  IndexInBlockDesc = 'indexInBlock_DESC',
  SignatureTypeAsc = 'signatureType_ASC',
  SignatureTypeDesc = 'signatureType_DESC',
  SignatureAsc = 'signature_ASC',
  SignatureDesc = 'signature_DESC',
  SignerAsc = 'signer_ASC',
  SignerDesc = 'signer_DESC',
  SuccessAsc = 'success_ASC',
  SuccessDesc = 'success_DESC',
  TipAsc = 'tip_ASC',
  TipDesc = 'tip_DESC',
  VersionAsc = 'version_ASC',
  VersionDesc = 'version_DESC'
}

export type ExtrinsicWhereInput = {
  AND?: InputMaybe<Array<ExtrinsicWhereInput>>;
  OR?: InputMaybe<Array<ExtrinsicWhereInput>>;
  block?: InputMaybe<BlockWhereInput>;
  block_isNull?: InputMaybe<Scalars['Boolean']>;
  call?: InputMaybe<CallWhereInput>;
  call_isNull?: InputMaybe<Scalars['Boolean']>;
  error_contains?: InputMaybe<Scalars['String']>;
  error_containsInsensitive?: InputMaybe<Scalars['String']>;
  error_endsWith?: InputMaybe<Scalars['String']>;
  error_eq?: InputMaybe<Scalars['String']>;
  error_gt?: InputMaybe<Scalars['String']>;
  error_gte?: InputMaybe<Scalars['String']>;
  error_in?: InputMaybe<Array<Scalars['String']>>;
  error_isNull?: InputMaybe<Scalars['Boolean']>;
  error_lt?: InputMaybe<Scalars['String']>;
  error_lte?: InputMaybe<Scalars['String']>;
  error_not_contains?: InputMaybe<Scalars['String']>;
  error_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  error_not_endsWith?: InputMaybe<Scalars['String']>;
  error_not_eq?: InputMaybe<Scalars['String']>;
  error_not_in?: InputMaybe<Array<Scalars['String']>>;
  error_not_startsWith?: InputMaybe<Scalars['String']>;
  error_startsWith?: InputMaybe<Scalars['String']>;
  events_every?: InputMaybe<EventWhereInput>;
  events_none?: InputMaybe<EventWhereInput>;
  events_some?: InputMaybe<EventWhereInput>;
  fee_eq?: InputMaybe<Scalars['BigInt']>;
  fee_gt?: InputMaybe<Scalars['BigInt']>;
  fee_gte?: InputMaybe<Scalars['BigInt']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee_isNull?: InputMaybe<Scalars['Boolean']>;
  fee_lt?: InputMaybe<Scalars['BigInt']>;
  fee_lte?: InputMaybe<Scalars['BigInt']>;
  fee_not_eq?: InputMaybe<Scalars['BigInt']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hash_contains?: InputMaybe<Scalars['String']>;
  hash_containsInsensitive?: InputMaybe<Scalars['String']>;
  hash_endsWith?: InputMaybe<Scalars['String']>;
  hash_eq?: InputMaybe<Scalars['String']>;
  hash_gt?: InputMaybe<Scalars['String']>;
  hash_gte?: InputMaybe<Scalars['String']>;
  hash_in?: InputMaybe<Array<Scalars['String']>>;
  hash_isNull?: InputMaybe<Scalars['Boolean']>;
  hash_lt?: InputMaybe<Scalars['String']>;
  hash_lte?: InputMaybe<Scalars['String']>;
  hash_not_contains?: InputMaybe<Scalars['String']>;
  hash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  hash_not_endsWith?: InputMaybe<Scalars['String']>;
  hash_not_eq?: InputMaybe<Scalars['String']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']>>;
  hash_not_startsWith?: InputMaybe<Scalars['String']>;
  hash_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  indexInBlock_eq?: InputMaybe<Scalars['Int']>;
  indexInBlock_gt?: InputMaybe<Scalars['Int']>;
  indexInBlock_gte?: InputMaybe<Scalars['Int']>;
  indexInBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  indexInBlock_isNull?: InputMaybe<Scalars['Boolean']>;
  indexInBlock_lt?: InputMaybe<Scalars['Int']>;
  indexInBlock_lte?: InputMaybe<Scalars['Int']>;
  indexInBlock_not_eq?: InputMaybe<Scalars['Int']>;
  indexInBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  signatureType_contains?: InputMaybe<Scalars['String']>;
  signatureType_containsInsensitive?: InputMaybe<Scalars['String']>;
  signatureType_endsWith?: InputMaybe<Scalars['String']>;
  signatureType_eq?: InputMaybe<Scalars['String']>;
  signatureType_gt?: InputMaybe<Scalars['String']>;
  signatureType_gte?: InputMaybe<Scalars['String']>;
  signatureType_in?: InputMaybe<Array<Scalars['String']>>;
  signatureType_isNull?: InputMaybe<Scalars['Boolean']>;
  signatureType_lt?: InputMaybe<Scalars['String']>;
  signatureType_lte?: InputMaybe<Scalars['String']>;
  signatureType_not_contains?: InputMaybe<Scalars['String']>;
  signatureType_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  signatureType_not_endsWith?: InputMaybe<Scalars['String']>;
  signatureType_not_eq?: InputMaybe<Scalars['String']>;
  signatureType_not_in?: InputMaybe<Array<Scalars['String']>>;
  signatureType_not_startsWith?: InputMaybe<Scalars['String']>;
  signatureType_startsWith?: InputMaybe<Scalars['String']>;
  signature_contains?: InputMaybe<Scalars['String']>;
  signature_containsInsensitive?: InputMaybe<Scalars['String']>;
  signature_endsWith?: InputMaybe<Scalars['String']>;
  signature_eq?: InputMaybe<Scalars['String']>;
  signature_gt?: InputMaybe<Scalars['String']>;
  signature_gte?: InputMaybe<Scalars['String']>;
  signature_in?: InputMaybe<Array<Scalars['String']>>;
  signature_isNull?: InputMaybe<Scalars['Boolean']>;
  signature_lt?: InputMaybe<Scalars['String']>;
  signature_lte?: InputMaybe<Scalars['String']>;
  signature_not_contains?: InputMaybe<Scalars['String']>;
  signature_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  signature_not_endsWith?: InputMaybe<Scalars['String']>;
  signature_not_eq?: InputMaybe<Scalars['String']>;
  signature_not_in?: InputMaybe<Array<Scalars['String']>>;
  signature_not_startsWith?: InputMaybe<Scalars['String']>;
  signature_startsWith?: InputMaybe<Scalars['String']>;
  signer_contains?: InputMaybe<Scalars['String']>;
  signer_containsInsensitive?: InputMaybe<Scalars['String']>;
  signer_endsWith?: InputMaybe<Scalars['String']>;
  signer_eq?: InputMaybe<Scalars['String']>;
  signer_gt?: InputMaybe<Scalars['String']>;
  signer_gte?: InputMaybe<Scalars['String']>;
  signer_in?: InputMaybe<Array<Scalars['String']>>;
  signer_isNull?: InputMaybe<Scalars['Boolean']>;
  signer_lt?: InputMaybe<Scalars['String']>;
  signer_lte?: InputMaybe<Scalars['String']>;
  signer_not_contains?: InputMaybe<Scalars['String']>;
  signer_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  signer_not_endsWith?: InputMaybe<Scalars['String']>;
  signer_not_eq?: InputMaybe<Scalars['String']>;
  signer_not_in?: InputMaybe<Array<Scalars['String']>>;
  signer_not_startsWith?: InputMaybe<Scalars['String']>;
  signer_startsWith?: InputMaybe<Scalars['String']>;
  success_eq?: InputMaybe<Scalars['Boolean']>;
  success_isNull?: InputMaybe<Scalars['Boolean']>;
  success_not_eq?: InputMaybe<Scalars['Boolean']>;
  tip_eq?: InputMaybe<Scalars['BigInt']>;
  tip_gt?: InputMaybe<Scalars['BigInt']>;
  tip_gte?: InputMaybe<Scalars['BigInt']>;
  tip_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tip_isNull?: InputMaybe<Scalars['Boolean']>;
  tip_lt?: InputMaybe<Scalars['BigInt']>;
  tip_lte?: InputMaybe<Scalars['BigInt']>;
  tip_not_eq?: InputMaybe<Scalars['BigInt']>;
  tip_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  version_eq?: InputMaybe<Scalars['Int']>;
  version_gt?: InputMaybe<Scalars['Int']>;
  version_gte?: InputMaybe<Scalars['Int']>;
  version_in?: InputMaybe<Array<Scalars['Int']>>;
  version_isNull?: InputMaybe<Scalars['Boolean']>;
  version_lt?: InputMaybe<Scalars['Int']>;
  version_lte?: InputMaybe<Scalars['Int']>;
  version_not_eq?: InputMaybe<Scalars['Int']>;
  version_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type ExtrinsicsConnection = {
  __typename?: 'ExtrinsicsConnection';
  edges: Array<ExtrinsicEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type IndexedChain = {
  __typename?: 'IndexedChain';
  archive?: Maybe<Scalars['String']>;
  calamarUrl?: Maybe<Scalars['String']>;
  currentBlock?: Maybe<Scalars['Int']>;
  enabled?: Maybe<Scalars['Boolean']>;
  headBlock?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  info?: Maybe<IndexedChainInfo>;
  ss58Format?: Maybe<Scalars['Int']>;
  startBlock?: Maybe<Scalars['Int']>;
  subscanUrl?: Maybe<Scalars['String']>;
};

export type IndexedChainEdge = {
  __typename?: 'IndexedChainEdge';
  cursor: Scalars['String'];
  node: IndexedChain;
};

export type IndexedChainInfo = {
  __typename?: 'IndexedChainInfo';
  description?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  genesisHash?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parachainId?: Maybe<Scalars['String']>;
  relayChain?: Maybe<Scalars['String']>;
  tokens: Array<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type IndexedChainInfoWhereInput = {
  description_contains?: InputMaybe<Scalars['String']>;
  description_containsInsensitive?: InputMaybe<Scalars['String']>;
  description_endsWith?: InputMaybe<Scalars['String']>;
  description_eq?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_isNull?: InputMaybe<Scalars['Boolean']>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  description_not_endsWith?: InputMaybe<Scalars['String']>;
  description_not_eq?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_startsWith?: InputMaybe<Scalars['String']>;
  description_startsWith?: InputMaybe<Scalars['String']>;
  displayName_contains?: InputMaybe<Scalars['String']>;
  displayName_containsInsensitive?: InputMaybe<Scalars['String']>;
  displayName_endsWith?: InputMaybe<Scalars['String']>;
  displayName_eq?: InputMaybe<Scalars['String']>;
  displayName_gt?: InputMaybe<Scalars['String']>;
  displayName_gte?: InputMaybe<Scalars['String']>;
  displayName_in?: InputMaybe<Array<Scalars['String']>>;
  displayName_isNull?: InputMaybe<Scalars['Boolean']>;
  displayName_lt?: InputMaybe<Scalars['String']>;
  displayName_lte?: InputMaybe<Scalars['String']>;
  displayName_not_contains?: InputMaybe<Scalars['String']>;
  displayName_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  displayName_not_endsWith?: InputMaybe<Scalars['String']>;
  displayName_not_eq?: InputMaybe<Scalars['String']>;
  displayName_not_in?: InputMaybe<Array<Scalars['String']>>;
  displayName_not_startsWith?: InputMaybe<Scalars['String']>;
  displayName_startsWith?: InputMaybe<Scalars['String']>;
  genesisHash_contains?: InputMaybe<Scalars['String']>;
  genesisHash_containsInsensitive?: InputMaybe<Scalars['String']>;
  genesisHash_endsWith?: InputMaybe<Scalars['String']>;
  genesisHash_eq?: InputMaybe<Scalars['String']>;
  genesisHash_gt?: InputMaybe<Scalars['String']>;
  genesisHash_gte?: InputMaybe<Scalars['String']>;
  genesisHash_in?: InputMaybe<Array<Scalars['String']>>;
  genesisHash_isNull?: InputMaybe<Scalars['Boolean']>;
  genesisHash_lt?: InputMaybe<Scalars['String']>;
  genesisHash_lte?: InputMaybe<Scalars['String']>;
  genesisHash_not_contains?: InputMaybe<Scalars['String']>;
  genesisHash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  genesisHash_not_endsWith?: InputMaybe<Scalars['String']>;
  genesisHash_not_eq?: InputMaybe<Scalars['String']>;
  genesisHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  genesisHash_not_startsWith?: InputMaybe<Scalars['String']>;
  genesisHash_startsWith?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_endsWith?: InputMaybe<Scalars['String']>;
  name_eq?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_not_endsWith?: InputMaybe<Scalars['String']>;
  name_not_eq?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']>;
  name_startsWith?: InputMaybe<Scalars['String']>;
  parachainId_contains?: InputMaybe<Scalars['String']>;
  parachainId_containsInsensitive?: InputMaybe<Scalars['String']>;
  parachainId_endsWith?: InputMaybe<Scalars['String']>;
  parachainId_eq?: InputMaybe<Scalars['String']>;
  parachainId_gt?: InputMaybe<Scalars['String']>;
  parachainId_gte?: InputMaybe<Scalars['String']>;
  parachainId_in?: InputMaybe<Array<Scalars['String']>>;
  parachainId_isNull?: InputMaybe<Scalars['Boolean']>;
  parachainId_lt?: InputMaybe<Scalars['String']>;
  parachainId_lte?: InputMaybe<Scalars['String']>;
  parachainId_not_contains?: InputMaybe<Scalars['String']>;
  parachainId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  parachainId_not_endsWith?: InputMaybe<Scalars['String']>;
  parachainId_not_eq?: InputMaybe<Scalars['String']>;
  parachainId_not_in?: InputMaybe<Array<Scalars['String']>>;
  parachainId_not_startsWith?: InputMaybe<Scalars['String']>;
  parachainId_startsWith?: InputMaybe<Scalars['String']>;
  relayChain_contains?: InputMaybe<Scalars['String']>;
  relayChain_containsInsensitive?: InputMaybe<Scalars['String']>;
  relayChain_endsWith?: InputMaybe<Scalars['String']>;
  relayChain_eq?: InputMaybe<Scalars['String']>;
  relayChain_gt?: InputMaybe<Scalars['String']>;
  relayChain_gte?: InputMaybe<Scalars['String']>;
  relayChain_in?: InputMaybe<Array<Scalars['String']>>;
  relayChain_isNull?: InputMaybe<Scalars['Boolean']>;
  relayChain_lt?: InputMaybe<Scalars['String']>;
  relayChain_lte?: InputMaybe<Scalars['String']>;
  relayChain_not_contains?: InputMaybe<Scalars['String']>;
  relayChain_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  relayChain_not_endsWith?: InputMaybe<Scalars['String']>;
  relayChain_not_eq?: InputMaybe<Scalars['String']>;
  relayChain_not_in?: InputMaybe<Array<Scalars['String']>>;
  relayChain_not_startsWith?: InputMaybe<Scalars['String']>;
  relayChain_startsWith?: InputMaybe<Scalars['String']>;
  tokens_containsAll?: InputMaybe<Array<Scalars['String']>>;
  tokens_containsAny?: InputMaybe<Array<Scalars['String']>>;
  tokens_containsNone?: InputMaybe<Array<Scalars['String']>>;
  tokens_isNull?: InputMaybe<Scalars['Boolean']>;
  website_contains?: InputMaybe<Scalars['String']>;
  website_containsInsensitive?: InputMaybe<Scalars['String']>;
  website_endsWith?: InputMaybe<Scalars['String']>;
  website_eq?: InputMaybe<Scalars['String']>;
  website_gt?: InputMaybe<Scalars['String']>;
  website_gte?: InputMaybe<Scalars['String']>;
  website_in?: InputMaybe<Array<Scalars['String']>>;
  website_isNull?: InputMaybe<Scalars['Boolean']>;
  website_lt?: InputMaybe<Scalars['String']>;
  website_lte?: InputMaybe<Scalars['String']>;
  website_not_contains?: InputMaybe<Scalars['String']>;
  website_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  website_not_endsWith?: InputMaybe<Scalars['String']>;
  website_not_eq?: InputMaybe<Scalars['String']>;
  website_not_in?: InputMaybe<Array<Scalars['String']>>;
  website_not_startsWith?: InputMaybe<Scalars['String']>;
  website_startsWith?: InputMaybe<Scalars['String']>;
};

export enum IndexedChainOrderByInput {
  ArchiveAsc = 'archive_ASC',
  ArchiveDesc = 'archive_DESC',
  CalamarUrlAsc = 'calamarUrl_ASC',
  CalamarUrlDesc = 'calamarUrl_DESC',
  CurrentBlockAsc = 'currentBlock_ASC',
  CurrentBlockDesc = 'currentBlock_DESC',
  EnabledAsc = 'enabled_ASC',
  EnabledDesc = 'enabled_DESC',
  HeadBlockAsc = 'headBlock_ASC',
  HeadBlockDesc = 'headBlock_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  InfoDescriptionAsc = 'info_description_ASC',
  InfoDescriptionDesc = 'info_description_DESC',
  InfoDisplayNameAsc = 'info_displayName_ASC',
  InfoDisplayNameDesc = 'info_displayName_DESC',
  InfoGenesisHashAsc = 'info_genesisHash_ASC',
  InfoGenesisHashDesc = 'info_genesisHash_DESC',
  InfoNameAsc = 'info_name_ASC',
  InfoNameDesc = 'info_name_DESC',
  InfoParachainIdAsc = 'info_parachainId_ASC',
  InfoParachainIdDesc = 'info_parachainId_DESC',
  InfoRelayChainAsc = 'info_relayChain_ASC',
  InfoRelayChainDesc = 'info_relayChain_DESC',
  InfoWebsiteAsc = 'info_website_ASC',
  InfoWebsiteDesc = 'info_website_DESC',
  Ss58FormatAsc = 'ss58Format_ASC',
  Ss58FormatDesc = 'ss58Format_DESC',
  StartBlockAsc = 'startBlock_ASC',
  StartBlockDesc = 'startBlock_DESC',
  SubscanUrlAsc = 'subscanUrl_ASC',
  SubscanUrlDesc = 'subscanUrl_DESC'
}

export type IndexedChainWhereInput = {
  AND?: InputMaybe<Array<IndexedChainWhereInput>>;
  OR?: InputMaybe<Array<IndexedChainWhereInput>>;
  archive_contains?: InputMaybe<Scalars['String']>;
  archive_containsInsensitive?: InputMaybe<Scalars['String']>;
  archive_endsWith?: InputMaybe<Scalars['String']>;
  archive_eq?: InputMaybe<Scalars['String']>;
  archive_gt?: InputMaybe<Scalars['String']>;
  archive_gte?: InputMaybe<Scalars['String']>;
  archive_in?: InputMaybe<Array<Scalars['String']>>;
  archive_isNull?: InputMaybe<Scalars['Boolean']>;
  archive_lt?: InputMaybe<Scalars['String']>;
  archive_lte?: InputMaybe<Scalars['String']>;
  archive_not_contains?: InputMaybe<Scalars['String']>;
  archive_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  archive_not_endsWith?: InputMaybe<Scalars['String']>;
  archive_not_eq?: InputMaybe<Scalars['String']>;
  archive_not_in?: InputMaybe<Array<Scalars['String']>>;
  archive_not_startsWith?: InputMaybe<Scalars['String']>;
  archive_startsWith?: InputMaybe<Scalars['String']>;
  calamarUrl_contains?: InputMaybe<Scalars['String']>;
  calamarUrl_containsInsensitive?: InputMaybe<Scalars['String']>;
  calamarUrl_endsWith?: InputMaybe<Scalars['String']>;
  calamarUrl_eq?: InputMaybe<Scalars['String']>;
  calamarUrl_gt?: InputMaybe<Scalars['String']>;
  calamarUrl_gte?: InputMaybe<Scalars['String']>;
  calamarUrl_in?: InputMaybe<Array<Scalars['String']>>;
  calamarUrl_isNull?: InputMaybe<Scalars['Boolean']>;
  calamarUrl_lt?: InputMaybe<Scalars['String']>;
  calamarUrl_lte?: InputMaybe<Scalars['String']>;
  calamarUrl_not_contains?: InputMaybe<Scalars['String']>;
  calamarUrl_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  calamarUrl_not_endsWith?: InputMaybe<Scalars['String']>;
  calamarUrl_not_eq?: InputMaybe<Scalars['String']>;
  calamarUrl_not_in?: InputMaybe<Array<Scalars['String']>>;
  calamarUrl_not_startsWith?: InputMaybe<Scalars['String']>;
  calamarUrl_startsWith?: InputMaybe<Scalars['String']>;
  currentBlock_eq?: InputMaybe<Scalars['Int']>;
  currentBlock_gt?: InputMaybe<Scalars['Int']>;
  currentBlock_gte?: InputMaybe<Scalars['Int']>;
  currentBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  currentBlock_isNull?: InputMaybe<Scalars['Boolean']>;
  currentBlock_lt?: InputMaybe<Scalars['Int']>;
  currentBlock_lte?: InputMaybe<Scalars['Int']>;
  currentBlock_not_eq?: InputMaybe<Scalars['Int']>;
  currentBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  enabled_eq?: InputMaybe<Scalars['Boolean']>;
  enabled_isNull?: InputMaybe<Scalars['Boolean']>;
  enabled_not_eq?: InputMaybe<Scalars['Boolean']>;
  headBlock_eq?: InputMaybe<Scalars['Int']>;
  headBlock_gt?: InputMaybe<Scalars['Int']>;
  headBlock_gte?: InputMaybe<Scalars['Int']>;
  headBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  headBlock_isNull?: InputMaybe<Scalars['Boolean']>;
  headBlock_lt?: InputMaybe<Scalars['Int']>;
  headBlock_lte?: InputMaybe<Scalars['Int']>;
  headBlock_not_eq?: InputMaybe<Scalars['Int']>;
  headBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  info?: InputMaybe<IndexedChainInfoWhereInput>;
  info_isNull?: InputMaybe<Scalars['Boolean']>;
  ss58Format_eq?: InputMaybe<Scalars['Int']>;
  ss58Format_gt?: InputMaybe<Scalars['Int']>;
  ss58Format_gte?: InputMaybe<Scalars['Int']>;
  ss58Format_in?: InputMaybe<Array<Scalars['Int']>>;
  ss58Format_isNull?: InputMaybe<Scalars['Boolean']>;
  ss58Format_lt?: InputMaybe<Scalars['Int']>;
  ss58Format_lte?: InputMaybe<Scalars['Int']>;
  ss58Format_not_eq?: InputMaybe<Scalars['Int']>;
  ss58Format_not_in?: InputMaybe<Array<Scalars['Int']>>;
  startBlock_eq?: InputMaybe<Scalars['Int']>;
  startBlock_gt?: InputMaybe<Scalars['Int']>;
  startBlock_gte?: InputMaybe<Scalars['Int']>;
  startBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  startBlock_isNull?: InputMaybe<Scalars['Boolean']>;
  startBlock_lt?: InputMaybe<Scalars['Int']>;
  startBlock_lte?: InputMaybe<Scalars['Int']>;
  startBlock_not_eq?: InputMaybe<Scalars['Int']>;
  startBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  subscanUrl_contains?: InputMaybe<Scalars['String']>;
  subscanUrl_containsInsensitive?: InputMaybe<Scalars['String']>;
  subscanUrl_endsWith?: InputMaybe<Scalars['String']>;
  subscanUrl_eq?: InputMaybe<Scalars['String']>;
  subscanUrl_gt?: InputMaybe<Scalars['String']>;
  subscanUrl_gte?: InputMaybe<Scalars['String']>;
  subscanUrl_in?: InputMaybe<Array<Scalars['String']>>;
  subscanUrl_isNull?: InputMaybe<Scalars['Boolean']>;
  subscanUrl_lt?: InputMaybe<Scalars['String']>;
  subscanUrl_lte?: InputMaybe<Scalars['String']>;
  subscanUrl_not_contains?: InputMaybe<Scalars['String']>;
  subscanUrl_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  subscanUrl_not_endsWith?: InputMaybe<Scalars['String']>;
  subscanUrl_not_eq?: InputMaybe<Scalars['String']>;
  subscanUrl_not_in?: InputMaybe<Array<Scalars['String']>>;
  subscanUrl_not_startsWith?: InputMaybe<Scalars['String']>;
  subscanUrl_startsWith?: InputMaybe<Scalars['String']>;
};

export type IndexedChainsConnection = {
  __typename?: 'IndexedChainsConnection';
  edges: Array<IndexedChainEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  updateChain: MutationResult;
};


export type MutationUpdateChainArgs = {
  apiKey: Scalars['String'];
  calamarUrl?: InputMaybe<Scalars['String']>;
  chainId: Scalars['String'];
  enabled?: InputMaybe<Scalars['Boolean']>;
  ss58Format?: InputMaybe<Scalars['Float']>;
  startBlock?: InputMaybe<Scalars['Float']>;
  subscanUrl?: InputMaybe<Scalars['String']>;
};

export type MutationResult = {
  __typename?: 'MutationResult';
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
};

export type ParsedAddLiquidity = {
  __typename?: 'ParsedAddLiquidity';
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
};

export type ParsedAddProvision = {
  __typename?: 'ParsedAddProvision';
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
};

export type ParsedClearedIdentity = {
  __typename?: 'ParsedClearedIdentity';
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
};

export type ParsedCrowdloanContribute = {
  __typename?: 'ParsedCrowdloanContribute';
  amount: Scalars['String'];
  chainId: Scalars['String'];
  contributor: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  fund: Scalars['Int'];
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
};

export type ParsedEthereumExec = {
  __typename?: 'ParsedEthereumExec';
  amount: Scalars['String'];
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  from: Scalars['String'];
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  to: Scalars['String'];
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
};

export type ParsedPoolMemberRemoved = {
  __typename?: 'ParsedPoolMemberRemoved';
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  member: Scalars['String'];
  poolId: Scalars['Float'];
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
};

export type ParsedPoolPaidOut = {
  __typename?: 'ParsedPoolPaidOut';
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  member: Scalars['String'];
  payout: Scalars['String'];
  poolId: Scalars['Float'];
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
};

export type ParsedPoolStake = {
  __typename?: 'ParsedPoolStake';
  bonded: Scalars['String'];
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  joined: Scalars['String'];
  member: Scalars['String'];
  poolId: Scalars['Float'];
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
};

export type ParsedPoolUnstake = {
  __typename?: 'ParsedPoolUnstake';
  balance: Scalars['String'];
  chainId: Scalars['String'];
  era: Scalars['Float'];
  fee?: Maybe<Scalars['String']>;
  member: Scalars['String'];
  points: Scalars['String'];
  poolId: Scalars['Float'];
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
};

export type ParsedPoolWithdrawn = {
  __typename?: 'ParsedPoolWithdrawn';
  balance: Scalars['String'];
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  member: Scalars['String'];
  points: Scalars['String'];
  poolId: Scalars['Float'];
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
};

export type ParsedRefundProvision = {
  __typename?: 'ParsedRefundProvision';
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
};

export type ParsedRemoveLiquidity = {
  __typename?: 'ParsedRemoveLiquidity';
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
};

export type ParsedSetIdentity = {
  __typename?: 'ParsedSetIdentity';
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  info: Scalars['JSON'];
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
};

export type ParsedStake = {
  __typename?: 'ParsedStake';
  amount: Scalars['String'];
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  staker?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
};

export type ParsedSwap = {
  __typename?: 'ParsedSwap';
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  tokens: Array<ParsedSwapToken>;
  trader: Scalars['String'];
};

export type ParsedSwapToken = {
  __typename?: 'ParsedSwapToken';
  decimals: Scalars['Int'];
  liquidityChange: Scalars['String'];
  logo: Scalars['String'];
  symbol: Scalars['String'];
};

export type ParsedTransaction = ParsedAddLiquidity | ParsedAddProvision | ParsedClearedIdentity | ParsedCrowdloanContribute | ParsedEthereumExec | ParsedPoolMemberRemoved | ParsedPoolPaidOut | ParsedPoolStake | ParsedPoolUnstake | ParsedPoolWithdrawn | ParsedRefundProvision | ParsedRemoveLiquidity | ParsedSetIdentity | ParsedStake | ParsedSwap | ParsedTransfer | ParsedUnstake | ParsedVote;

export type ParsedTransfer = {
  __typename?: 'ParsedTransfer';
  amount: Scalars['String'];
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  from: Scalars['String'];
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  to: Scalars['String'];
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
};

export type ParsedUnstake = {
  __typename?: 'ParsedUnstake';
  amount: Scalars['String'];
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
  unstaker?: Maybe<Scalars['String']>;
};

export type ParsedVote = {
  __typename?: 'ParsedVote';
  amount: Scalars['String'];
  chainId: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  referendumIndex: Scalars['String'];
  referendumUrl?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  tip?: Maybe<Scalars['String']>;
  tokenDecimals: Scalars['Int'];
  tokenLogo: Scalars['String'];
  tokenSymbol: Scalars['String'];
  voteNumber: Scalars['String'];
  voter: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  addressById?: Maybe<Address>;
  /** @deprecated Use addressById */
  addressByUniqueInput?: Maybe<Address>;
  addressEventById?: Maybe<AddressEvent>;
  /** @deprecated Use addressEventById */
  addressEventByUniqueInput?: Maybe<AddressEvent>;
  addressEvents: Array<AddressEvent>;
  addressEventsConnection: AddressEventsConnection;
  addresses: Array<Address>;
  addressesConnection: AddressesConnection;
  blockById?: Maybe<Block>;
  /** @deprecated Use blockById */
  blockByUniqueInput?: Maybe<Block>;
  blocks: Array<Block>;
  blocksConnection: BlocksConnection;
  callById?: Maybe<Call>;
  /** @deprecated Use callById */
  callByUniqueInput?: Maybe<Call>;
  calls: Array<Call>;
  callsConnection: CallsConnection;
  eventById?: Maybe<Event>;
  /** @deprecated Use eventById */
  eventByUniqueInput?: Maybe<Event>;
  events: Array<Event>;
  eventsConnection: EventsConnection;
  extrinsicById?: Maybe<Extrinsic>;
  /** @deprecated Use extrinsicById */
  extrinsicByUniqueInput?: Maybe<Extrinsic>;
  extrinsics: Array<Extrinsic>;
  extrinsicsConnection: ExtrinsicsConnection;
  indexedChainById?: Maybe<IndexedChain>;
  /** @deprecated Use indexedChainById */
  indexedChainByUniqueInput?: Maybe<IndexedChain>;
  indexedChains: Array<IndexedChain>;
  indexedChainsConnection: IndexedChainsConnection;
  squidStatus?: Maybe<SquidStatus>;
  transactionsByAddress: Array<Transaction>;
  verifyApiKey: Scalars['Boolean'];
};


export type QueryAddressByIdArgs = {
  id: Scalars['String'];
};


export type QueryAddressByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryAddressEventByIdArgs = {
  id: Scalars['String'];
};


export type QueryAddressEventByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryAddressEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AddressEventOrderByInput>>;
  where?: InputMaybe<AddressEventWhereInput>;
};


export type QueryAddressEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<AddressEventOrderByInput>;
  where?: InputMaybe<AddressEventWhereInput>;
};


export type QueryAddressesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AddressOrderByInput>>;
  where?: InputMaybe<AddressWhereInput>;
};


export type QueryAddressesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<AddressOrderByInput>;
  where?: InputMaybe<AddressWhereInput>;
};


export type QueryBlockByIdArgs = {
  id: Scalars['String'];
};


export type QueryBlockByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryBlocksArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<BlockOrderByInput>>;
  where?: InputMaybe<BlockWhereInput>;
};


export type QueryBlocksConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<BlockOrderByInput>;
  where?: InputMaybe<BlockWhereInput>;
};


export type QueryCallByIdArgs = {
  id: Scalars['String'];
};


export type QueryCallByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryCallsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CallOrderByInput>>;
  where?: InputMaybe<CallWhereInput>;
};


export type QueryCallsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<CallOrderByInput>;
  where?: InputMaybe<CallWhereInput>;
};


export type QueryEventByIdArgs = {
  id: Scalars['String'];
};


export type QueryEventByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EventOrderByInput>>;
  where?: InputMaybe<EventWhereInput>;
};


export type QueryEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<EventOrderByInput>;
  where?: InputMaybe<EventWhereInput>;
};


export type QueryExtrinsicByIdArgs = {
  id: Scalars['String'];
};


export type QueryExtrinsicByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryExtrinsicsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ExtrinsicOrderByInput>>;
  where?: InputMaybe<ExtrinsicWhereInput>;
};


export type QueryExtrinsicsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<ExtrinsicOrderByInput>;
  where?: InputMaybe<ExtrinsicWhereInput>;
};


export type QueryIndexedChainByIdArgs = {
  id: Scalars['String'];
};


export type QueryIndexedChainByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryIndexedChainsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<IndexedChainOrderByInput>>;
  where?: InputMaybe<IndexedChainWhereInput>;
};


export type QueryIndexedChainsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<IndexedChainOrderByInput>;
  where?: InputMaybe<IndexedChainWhereInput>;
};


export type QueryTransactionsByAddressArgs = {
  addresses?: InputMaybe<Array<Scalars['String']>>;
  chains?: InputMaybe<Array<Scalars['String']>>;
  limit?: InputMaybe<Scalars['Float']>;
  newerThanId?: InputMaybe<Scalars['String']>;
  olderThanId?: InputMaybe<Scalars['String']>;
  query?: InputMaybe<Scalars['String']>;
};


export type QueryVerifyApiKeyArgs = {
  apiKey: Scalars['String'];
};

export type SquidStatus = {
  __typename?: 'SquidStatus';
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  addressById?: Maybe<Address>;
  addressEventById?: Maybe<AddressEvent>;
  addressEvents: Array<AddressEvent>;
  addresses: Array<Address>;
  blockById?: Maybe<Block>;
  blocks: Array<Block>;
  callById?: Maybe<Call>;
  calls: Array<Call>;
  eventById?: Maybe<Event>;
  events: Array<Event>;
  extrinsicById?: Maybe<Extrinsic>;
  extrinsics: Array<Extrinsic>;
  indexedChainById?: Maybe<IndexedChain>;
  indexedChains: Array<IndexedChain>;
};


export type SubscriptionAddressByIdArgs = {
  id: Scalars['String'];
};


export type SubscriptionAddressEventByIdArgs = {
  id: Scalars['String'];
};


export type SubscriptionAddressEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AddressEventOrderByInput>>;
  where?: InputMaybe<AddressEventWhereInput>;
};


export type SubscriptionAddressesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AddressOrderByInput>>;
  where?: InputMaybe<AddressWhereInput>;
};


export type SubscriptionBlockByIdArgs = {
  id: Scalars['String'];
};


export type SubscriptionBlocksArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<BlockOrderByInput>>;
  where?: InputMaybe<BlockWhereInput>;
};


export type SubscriptionCallByIdArgs = {
  id: Scalars['String'];
};


export type SubscriptionCallsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CallOrderByInput>>;
  where?: InputMaybe<CallWhereInput>;
};


export type SubscriptionEventByIdArgs = {
  id: Scalars['String'];
};


export type SubscriptionEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EventOrderByInput>>;
  where?: InputMaybe<EventWhereInput>;
};


export type SubscriptionExtrinsicByIdArgs = {
  id: Scalars['String'];
};


export type SubscriptionExtrinsicsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ExtrinsicOrderByInput>>;
  where?: InputMaybe<ExtrinsicWhereInput>;
};


export type SubscriptionIndexedChainByIdArgs = {
  id: Scalars['String'];
};


export type SubscriptionIndexedChainsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<IndexedChainOrderByInput>>;
  where?: InputMaybe<IndexedChainWhereInput>;
};

export type Transaction = {
  __typename?: 'Transaction';
  _data?: Maybe<Scalars['JSON']>;
  args?: Maybe<Scalars['JSON']>;
  blockHash: Scalars['String'];
  blockNumber: Scalars['Float'];
  chainId: Scalars['String'];
  explorerUrl?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  parsed?: Maybe<ParsedTransaction>;
  relatedAddresses: Array<Scalars['String']>;
  signer?: Maybe<Scalars['String']>;
  ss58Format: Scalars['Float'];
  timestamp: Scalars['DateTime'];
};

export type WhereIdInput = {
  id: Scalars['String'];
};

export type TxQueryQueryVariables = Exact<{
  addresses: Array<Scalars['String']> | Scalars['String'];
  limit?: InputMaybe<Scalars['Float']>;
  olderThanId?: InputMaybe<Scalars['String']>;
  newerThanId?: InputMaybe<Scalars['String']>;
  searchQuery?: InputMaybe<Scalars['String']>;
}>;


export type TxQueryQuery = { __typename?: 'Query', transactionsByAddress: Array<{ __typename?: 'Transaction', id: string, name?: string | null, chainId: string, ss58Format: number, blockNumber: number, blockHash: string, timestamp: any, args?: any | null, signer?: string | null, relatedAddresses: Array<string>, explorerUrl?: string | null, parsed?: { __typename: 'ParsedAddLiquidity', chainId: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedAddProvision', chainId: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedClearedIdentity', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedCrowdloanContribute', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, contributor: string, amount: string, fund: number, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedEthereumExec', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, from: string, to: string, amount: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedPoolMemberRemoved', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, poolId: number, member: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedPoolPaidOut', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, poolId: number, member: string, payout: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedPoolStake', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, poolId: number, member: string, bonded: string, joined: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedPoolUnstake', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, era: number, poolId: number, member: string, points: string, balance: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedPoolWithdrawn', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, poolId: number, member: string, points: string, balance: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedRefundProvision', chainId: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedRemoveLiquidity', chainId: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedSetIdentity', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, info: any, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedStake', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, staker?: string | null, amount: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedSwap', chainId: string, trader: string, fee?: string | null, tip?: string | null, success: boolean, tokens: Array<{ __typename?: 'ParsedSwapToken', logo: string, symbol: string, decimals: number, liquidityChange: string }> } | { __typename: 'ParsedTransfer', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, from: string, to: string, amount: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedUnstake', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, unstaker?: string | null, amount: string, fee?: string | null, tip?: string | null, success: boolean } | { __typename: 'ParsedVote', chainId: string, tokenLogo: string, tokenSymbol: string, tokenDecimals: number, voter: string, referendumIndex: string, referendumUrl?: string | null, voteNumber: string, amount: string, fee?: string | null, tip?: string | null, success: boolean } | null }> };

export type LatestTxQueryQueryVariables = Exact<{
  addresses: Array<Scalars['String']> | Scalars['String'];
  searchQuery?: InputMaybe<Scalars['String']>;
}>;


export type LatestTxQueryQuery = { __typename?: 'Query', transactionsByAddress: Array<{ __typename?: 'Transaction', id: string }> };


export const TxQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"txQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"addresses"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"olderThanId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newerThanId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchQuery"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionsByAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"addresses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"addresses"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"olderThanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"olderThanId"}}},{"kind":"Argument","name":{"kind":"Name","value":"newerThanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newerThanId"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchQuery"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"ss58Format"}},{"kind":"Field","name":{"kind":"Name","value":"blockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"blockHash"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"args"}},{"kind":"Field","name":{"kind":"Name","value":"signer"}},{"kind":"Field","name":{"kind":"Name","value":"relatedAddresses"}},{"kind":"Field","name":{"kind":"Name","value":"explorerUrl"}},{"kind":"Field","name":{"kind":"Name","value":"parsed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedTransfer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedCrowdloanContribute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"contributor"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"fund"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedStake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"staker"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedUnstake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"unstaker"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedAddLiquidity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedRemoveLiquidity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedAddProvision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedRefundProvision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedSwap"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"liquidityChange"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trader"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedSetIdentity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"info"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedClearedIdentity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedPoolStake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"member"}},{"kind":"Field","name":{"kind":"Name","value":"bonded"}},{"kind":"Field","name":{"kind":"Name","value":"joined"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedPoolUnstake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"era"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"member"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedPoolPaidOut"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"member"}},{"kind":"Field","name":{"kind":"Name","value":"payout"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedPoolWithdrawn"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"member"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedPoolMemberRemoved"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"member"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedVote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"voter"}},{"kind":"Field","name":{"kind":"Name","value":"referendumIndex"}},{"kind":"Field","name":{"kind":"Name","value":"referendumUrl"}},{"kind":"Field","name":{"kind":"Name","value":"voteNumber"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ParsedEthereumExec"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenLogo"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"tokenDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TxQueryQuery, TxQueryQueryVariables>;
export const LatestTxQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"latestTxQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"addresses"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchQuery"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionsByAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"addresses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"addresses"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchQuery"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<LatestTxQueryQuery, LatestTxQueryQueryVariables>;