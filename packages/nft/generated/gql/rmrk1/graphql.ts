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
  bigint: any
  jsonb: any
  timestamptz: any
}

/** expression to compare columns of type Boolean. All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>
  _gt?: InputMaybe<Scalars['Boolean']>
  _gte?: InputMaybe<Scalars['Boolean']>
  _in?: InputMaybe<Array<Scalars['Boolean']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['Boolean']>
  _lte?: InputMaybe<Scalars['Boolean']>
  _neq?: InputMaybe<Scalars['Boolean']>
  _nin?: InputMaybe<Array<Scalars['Boolean']>>
}

/** expression to compare columns of type Int. All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>
  _gt?: InputMaybe<Scalars['Int']>
  _gte?: InputMaybe<Scalars['Int']>
  _in?: InputMaybe<Array<Scalars['Int']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['Int']>
  _lte?: InputMaybe<Scalars['Int']>
  _neq?: InputMaybe<Scalars['Int']>
  _nin?: InputMaybe<Array<Scalars['Int']>>
}

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>
  _gt?: InputMaybe<Scalars['String']>
  _gte?: InputMaybe<Scalars['String']>
  _ilike?: InputMaybe<Scalars['String']>
  _in?: InputMaybe<Array<Scalars['String']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _like?: InputMaybe<Scalars['String']>
  _lt?: InputMaybe<Scalars['String']>
  _lte?: InputMaybe<Scalars['String']>
  _neq?: InputMaybe<Scalars['String']>
  _nilike?: InputMaybe<Scalars['String']>
  _nin?: InputMaybe<Array<Scalars['String']>>
  _nlike?: InputMaybe<Scalars['String']>
  _nsimilar?: InputMaybe<Scalars['String']>
  _similar?: InputMaybe<Scalars['String']>
}

/** columns and relationships of "art_contest_nfts" */
export type Art_Contest_Nfts = {
  __typename?: 'art_contest_nfts'
  /** An array relationship */
  art_contest_submissions: Array<Art_Contest_Submissions>
  /** An aggregated array relationship */
  art_contest_submissions_aggregate: Art_Contest_Submissions_Aggregate
  id: Scalars['Int']
  nft_id: Scalars['String']
}

/** columns and relationships of "art_contest_nfts" */
export type Art_Contest_NftsArt_Contest_SubmissionsArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Submissions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Submissions_Order_By>>
  where?: InputMaybe<Art_Contest_Submissions_Bool_Exp>
}

/** columns and relationships of "art_contest_nfts" */
export type Art_Contest_NftsArt_Contest_Submissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Submissions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Submissions_Order_By>>
  where?: InputMaybe<Art_Contest_Submissions_Bool_Exp>
}

/** aggregated selection of "art_contest_nfts" */
export type Art_Contest_Nfts_Aggregate = {
  __typename?: 'art_contest_nfts_aggregate'
  aggregate?: Maybe<Art_Contest_Nfts_Aggregate_Fields>
  nodes: Array<Art_Contest_Nfts>
}

/** aggregate fields of "art_contest_nfts" */
export type Art_Contest_Nfts_Aggregate_Fields = {
  __typename?: 'art_contest_nfts_aggregate_fields'
  avg?: Maybe<Art_Contest_Nfts_Avg_Fields>
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Art_Contest_Nfts_Max_Fields>
  min?: Maybe<Art_Contest_Nfts_Min_Fields>
  stddev?: Maybe<Art_Contest_Nfts_Stddev_Fields>
  stddev_pop?: Maybe<Art_Contest_Nfts_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Art_Contest_Nfts_Stddev_Samp_Fields>
  sum?: Maybe<Art_Contest_Nfts_Sum_Fields>
  var_pop?: Maybe<Art_Contest_Nfts_Var_Pop_Fields>
  var_samp?: Maybe<Art_Contest_Nfts_Var_Samp_Fields>
  variance?: Maybe<Art_Contest_Nfts_Variance_Fields>
}

/** aggregate fields of "art_contest_nfts" */
export type Art_Contest_Nfts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Art_Contest_Nfts_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "art_contest_nfts" */
export type Art_Contest_Nfts_Aggregate_Order_By = {
  avg?: InputMaybe<Art_Contest_Nfts_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Art_Contest_Nfts_Max_Order_By>
  min?: InputMaybe<Art_Contest_Nfts_Min_Order_By>
  stddev?: InputMaybe<Art_Contest_Nfts_Stddev_Order_By>
  stddev_pop?: InputMaybe<Art_Contest_Nfts_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Art_Contest_Nfts_Stddev_Samp_Order_By>
  sum?: InputMaybe<Art_Contest_Nfts_Sum_Order_By>
  var_pop?: InputMaybe<Art_Contest_Nfts_Var_Pop_Order_By>
  var_samp?: InputMaybe<Art_Contest_Nfts_Var_Samp_Order_By>
  variance?: InputMaybe<Art_Contest_Nfts_Variance_Order_By>
}

/** aggregate avg on columns */
export type Art_Contest_Nfts_Avg_Fields = {
  __typename?: 'art_contest_nfts_avg_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "art_contest_nfts" */
export type Art_Contest_Nfts_Avg_Order_By = {
  id?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "art_contest_nfts". All fields are combined with a logical 'AND'. */
export type Art_Contest_Nfts_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Art_Contest_Nfts_Bool_Exp>>>
  _not?: InputMaybe<Art_Contest_Nfts_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Art_Contest_Nfts_Bool_Exp>>>
  art_contest_submissions?: InputMaybe<Art_Contest_Submissions_Bool_Exp>
  id?: InputMaybe<Int_Comparison_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
}

/** aggregate max on columns */
export type Art_Contest_Nfts_Max_Fields = {
  __typename?: 'art_contest_nfts_max_fields'
  id?: Maybe<Scalars['Int']>
  nft_id?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "art_contest_nfts" */
export type Art_Contest_Nfts_Max_Order_By = {
  id?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Art_Contest_Nfts_Min_Fields = {
  __typename?: 'art_contest_nfts_min_fields'
  id?: Maybe<Scalars['Int']>
  nft_id?: Maybe<Scalars['String']>
}

/** order by min() on columns of table "art_contest_nfts" */
export type Art_Contest_Nfts_Min_Order_By = {
  id?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "art_contest_nfts" */
export type Art_Contest_Nfts_Order_By = {
  art_contest_submissions_aggregate?: InputMaybe<Art_Contest_Submissions_Aggregate_Order_By>
  id?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** primary key columns input for table: "art_contest_nfts" */
export type Art_Contest_Nfts_Pk_Columns_Input = {
  nft_id: Scalars['String']
}

/** select columns of table "art_contest_nfts" */
export enum Art_Contest_Nfts_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  NftId = 'nft_id',
}

/** aggregate stddev on columns */
export type Art_Contest_Nfts_Stddev_Fields = {
  __typename?: 'art_contest_nfts_stddev_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "art_contest_nfts" */
export type Art_Contest_Nfts_Stddev_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Art_Contest_Nfts_Stddev_Pop_Fields = {
  __typename?: 'art_contest_nfts_stddev_pop_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "art_contest_nfts" */
export type Art_Contest_Nfts_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Art_Contest_Nfts_Stddev_Samp_Fields = {
  __typename?: 'art_contest_nfts_stddev_samp_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "art_contest_nfts" */
export type Art_Contest_Nfts_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Art_Contest_Nfts_Sum_Fields = {
  __typename?: 'art_contest_nfts_sum_fields'
  id?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "art_contest_nfts" */
export type Art_Contest_Nfts_Sum_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Art_Contest_Nfts_Var_Pop_Fields = {
  __typename?: 'art_contest_nfts_var_pop_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "art_contest_nfts" */
export type Art_Contest_Nfts_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Art_Contest_Nfts_Var_Samp_Fields = {
  __typename?: 'art_contest_nfts_var_samp_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "art_contest_nfts" */
export type Art_Contest_Nfts_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Art_Contest_Nfts_Variance_Fields = {
  __typename?: 'art_contest_nfts_variance_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "art_contest_nfts" */
export type Art_Contest_Nfts_Variance_Order_By = {
  id?: InputMaybe<Order_By>
}

/** columns and relationships of "art_contest_submissions" */
export type Art_Contest_Submissions = {
  __typename?: 'art_contest_submissions'
  animation_url: Scalars['String']
  /** An object relationship */
  art_contest_nft: Art_Contest_Nfts
  art_id: Scalars['String']
  /** An array relationship */
  art_votes: Array<Art_Contest_Votes>
  /** An aggregated array relationship */
  art_votes_aggregate: Art_Contest_Votes_Aggregate
  artist_address: Scalars['String']
  created_at: Scalars['timestamptz']
  disabled: Scalars['Boolean']
  id: Scalars['Int']
  img_url: Scalars['String']
  nft_id: Scalars['String']
}

/** columns and relationships of "art_contest_submissions" */
export type Art_Contest_SubmissionsArt_VotesArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Votes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Votes_Order_By>>
  where?: InputMaybe<Art_Contest_Votes_Bool_Exp>
}

/** columns and relationships of "art_contest_submissions" */
export type Art_Contest_SubmissionsArt_Votes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Votes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Votes_Order_By>>
  where?: InputMaybe<Art_Contest_Votes_Bool_Exp>
}

/** aggregated selection of "art_contest_submissions" */
export type Art_Contest_Submissions_Aggregate = {
  __typename?: 'art_contest_submissions_aggregate'
  aggregate?: Maybe<Art_Contest_Submissions_Aggregate_Fields>
  nodes: Array<Art_Contest_Submissions>
}

/** aggregate fields of "art_contest_submissions" */
export type Art_Contest_Submissions_Aggregate_Fields = {
  __typename?: 'art_contest_submissions_aggregate_fields'
  avg?: Maybe<Art_Contest_Submissions_Avg_Fields>
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Art_Contest_Submissions_Max_Fields>
  min?: Maybe<Art_Contest_Submissions_Min_Fields>
  stddev?: Maybe<Art_Contest_Submissions_Stddev_Fields>
  stddev_pop?: Maybe<Art_Contest_Submissions_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Art_Contest_Submissions_Stddev_Samp_Fields>
  sum?: Maybe<Art_Contest_Submissions_Sum_Fields>
  var_pop?: Maybe<Art_Contest_Submissions_Var_Pop_Fields>
  var_samp?: Maybe<Art_Contest_Submissions_Var_Samp_Fields>
  variance?: Maybe<Art_Contest_Submissions_Variance_Fields>
}

/** aggregate fields of "art_contest_submissions" */
export type Art_Contest_Submissions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Art_Contest_Submissions_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "art_contest_submissions" */
export type Art_Contest_Submissions_Aggregate_Order_By = {
  avg?: InputMaybe<Art_Contest_Submissions_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Art_Contest_Submissions_Max_Order_By>
  min?: InputMaybe<Art_Contest_Submissions_Min_Order_By>
  stddev?: InputMaybe<Art_Contest_Submissions_Stddev_Order_By>
  stddev_pop?: InputMaybe<Art_Contest_Submissions_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Art_Contest_Submissions_Stddev_Samp_Order_By>
  sum?: InputMaybe<Art_Contest_Submissions_Sum_Order_By>
  var_pop?: InputMaybe<Art_Contest_Submissions_Var_Pop_Order_By>
  var_samp?: InputMaybe<Art_Contest_Submissions_Var_Samp_Order_By>
  variance?: InputMaybe<Art_Contest_Submissions_Variance_Order_By>
}

/** aggregate avg on columns */
export type Art_Contest_Submissions_Avg_Fields = {
  __typename?: 'art_contest_submissions_avg_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "art_contest_submissions" */
export type Art_Contest_Submissions_Avg_Order_By = {
  id?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "art_contest_submissions". All fields are combined with a logical 'AND'. */
export type Art_Contest_Submissions_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Art_Contest_Submissions_Bool_Exp>>>
  _not?: InputMaybe<Art_Contest_Submissions_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Art_Contest_Submissions_Bool_Exp>>>
  animation_url?: InputMaybe<String_Comparison_Exp>
  art_contest_nft?: InputMaybe<Art_Contest_Nfts_Bool_Exp>
  art_id?: InputMaybe<String_Comparison_Exp>
  art_votes?: InputMaybe<Art_Contest_Votes_Bool_Exp>
  artist_address?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  disabled?: InputMaybe<Boolean_Comparison_Exp>
  id?: InputMaybe<Int_Comparison_Exp>
  img_url?: InputMaybe<String_Comparison_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
}

/** aggregate max on columns */
export type Art_Contest_Submissions_Max_Fields = {
  __typename?: 'art_contest_submissions_max_fields'
  animation_url?: Maybe<Scalars['String']>
  art_id?: Maybe<Scalars['String']>
  artist_address?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['Int']>
  img_url?: Maybe<Scalars['String']>
  nft_id?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "art_contest_submissions" */
export type Art_Contest_Submissions_Max_Order_By = {
  animation_url?: InputMaybe<Order_By>
  art_id?: InputMaybe<Order_By>
  artist_address?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  img_url?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Art_Contest_Submissions_Min_Fields = {
  __typename?: 'art_contest_submissions_min_fields'
  animation_url?: Maybe<Scalars['String']>
  art_id?: Maybe<Scalars['String']>
  artist_address?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['Int']>
  img_url?: Maybe<Scalars['String']>
  nft_id?: Maybe<Scalars['String']>
}

/** order by min() on columns of table "art_contest_submissions" */
export type Art_Contest_Submissions_Min_Order_By = {
  animation_url?: InputMaybe<Order_By>
  art_id?: InputMaybe<Order_By>
  artist_address?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  img_url?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "art_contest_submissions" */
export type Art_Contest_Submissions_Order_By = {
  animation_url?: InputMaybe<Order_By>
  art_contest_nft?: InputMaybe<Art_Contest_Nfts_Order_By>
  art_id?: InputMaybe<Order_By>
  art_votes_aggregate?: InputMaybe<Art_Contest_Votes_Aggregate_Order_By>
  artist_address?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  disabled?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  img_url?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** primary key columns input for table: "art_contest_submissions" */
export type Art_Contest_Submissions_Pk_Columns_Input = {
  id: Scalars['Int']
}

/** select columns of table "art_contest_submissions" */
export enum Art_Contest_Submissions_Select_Column {
  /** column name */
  AnimationUrl = 'animation_url',
  /** column name */
  ArtId = 'art_id',
  /** column name */
  ArtistAddress = 'artist_address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Disabled = 'disabled',
  /** column name */
  Id = 'id',
  /** column name */
  ImgUrl = 'img_url',
  /** column name */
  NftId = 'nft_id',
}

/** aggregate stddev on columns */
export type Art_Contest_Submissions_Stddev_Fields = {
  __typename?: 'art_contest_submissions_stddev_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "art_contest_submissions" */
export type Art_Contest_Submissions_Stddev_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Art_Contest_Submissions_Stddev_Pop_Fields = {
  __typename?: 'art_contest_submissions_stddev_pop_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "art_contest_submissions" */
export type Art_Contest_Submissions_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Art_Contest_Submissions_Stddev_Samp_Fields = {
  __typename?: 'art_contest_submissions_stddev_samp_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "art_contest_submissions" */
export type Art_Contest_Submissions_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Art_Contest_Submissions_Sum_Fields = {
  __typename?: 'art_contest_submissions_sum_fields'
  id?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "art_contest_submissions" */
export type Art_Contest_Submissions_Sum_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Art_Contest_Submissions_Var_Pop_Fields = {
  __typename?: 'art_contest_submissions_var_pop_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "art_contest_submissions" */
export type Art_Contest_Submissions_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Art_Contest_Submissions_Var_Samp_Fields = {
  __typename?: 'art_contest_submissions_var_samp_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "art_contest_submissions" */
export type Art_Contest_Submissions_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Art_Contest_Submissions_Variance_Fields = {
  __typename?: 'art_contest_submissions_variance_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "art_contest_submissions" */
export type Art_Contest_Submissions_Variance_Order_By = {
  id?: InputMaybe<Order_By>
}

/** columns and relationships of "art_contest_votes" */
export type Art_Contest_Votes = {
  __typename?: 'art_contest_votes'
  art_id: Scalars['String']
  /** An object relationship */
  art_votes?: Maybe<Art_Contest_Submissions>
  caller: Scalars['String']
  created_at: Scalars['timestamptz']
  id: Scalars['Int']
  nft_id: Scalars['String']
  updated_at: Scalars['timestamptz']
  weight: Scalars['Int']
}

/** aggregated selection of "art_contest_votes" */
export type Art_Contest_Votes_Aggregate = {
  __typename?: 'art_contest_votes_aggregate'
  aggregate?: Maybe<Art_Contest_Votes_Aggregate_Fields>
  nodes: Array<Art_Contest_Votes>
}

/** aggregate fields of "art_contest_votes" */
export type Art_Contest_Votes_Aggregate_Fields = {
  __typename?: 'art_contest_votes_aggregate_fields'
  avg?: Maybe<Art_Contest_Votes_Avg_Fields>
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Art_Contest_Votes_Max_Fields>
  min?: Maybe<Art_Contest_Votes_Min_Fields>
  stddev?: Maybe<Art_Contest_Votes_Stddev_Fields>
  stddev_pop?: Maybe<Art_Contest_Votes_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Art_Contest_Votes_Stddev_Samp_Fields>
  sum?: Maybe<Art_Contest_Votes_Sum_Fields>
  var_pop?: Maybe<Art_Contest_Votes_Var_Pop_Fields>
  var_samp?: Maybe<Art_Contest_Votes_Var_Samp_Fields>
  variance?: Maybe<Art_Contest_Votes_Variance_Fields>
}

/** aggregate fields of "art_contest_votes" */
export type Art_Contest_Votes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Art_Contest_Votes_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "art_contest_votes" */
export type Art_Contest_Votes_Aggregate_Order_By = {
  avg?: InputMaybe<Art_Contest_Votes_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Art_Contest_Votes_Max_Order_By>
  min?: InputMaybe<Art_Contest_Votes_Min_Order_By>
  stddev?: InputMaybe<Art_Contest_Votes_Stddev_Order_By>
  stddev_pop?: InputMaybe<Art_Contest_Votes_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Art_Contest_Votes_Stddev_Samp_Order_By>
  sum?: InputMaybe<Art_Contest_Votes_Sum_Order_By>
  var_pop?: InputMaybe<Art_Contest_Votes_Var_Pop_Order_By>
  var_samp?: InputMaybe<Art_Contest_Votes_Var_Samp_Order_By>
  variance?: InputMaybe<Art_Contest_Votes_Variance_Order_By>
}

/** aggregate avg on columns */
export type Art_Contest_Votes_Avg_Fields = {
  __typename?: 'art_contest_votes_avg_fields'
  id?: Maybe<Scalars['Float']>
  weight?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "art_contest_votes" */
export type Art_Contest_Votes_Avg_Order_By = {
  id?: InputMaybe<Order_By>
  weight?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "art_contest_votes". All fields are combined with a logical 'AND'. */
export type Art_Contest_Votes_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Art_Contest_Votes_Bool_Exp>>>
  _not?: InputMaybe<Art_Contest_Votes_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Art_Contest_Votes_Bool_Exp>>>
  art_id?: InputMaybe<String_Comparison_Exp>
  art_votes?: InputMaybe<Art_Contest_Submissions_Bool_Exp>
  caller?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Int_Comparison_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
  weight?: InputMaybe<Int_Comparison_Exp>
}

/** aggregate max on columns */
export type Art_Contest_Votes_Max_Fields = {
  __typename?: 'art_contest_votes_max_fields'
  art_id?: Maybe<Scalars['String']>
  caller?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['Int']>
  nft_id?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
  weight?: Maybe<Scalars['Int']>
}

/** order by max() on columns of table "art_contest_votes" */
export type Art_Contest_Votes_Max_Order_By = {
  art_id?: InputMaybe<Order_By>
  caller?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
  weight?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Art_Contest_Votes_Min_Fields = {
  __typename?: 'art_contest_votes_min_fields'
  art_id?: Maybe<Scalars['String']>
  caller?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['Int']>
  nft_id?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
  weight?: Maybe<Scalars['Int']>
}

/** order by min() on columns of table "art_contest_votes" */
export type Art_Contest_Votes_Min_Order_By = {
  art_id?: InputMaybe<Order_By>
  caller?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
  weight?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "art_contest_votes" */
export type Art_Contest_Votes_Order_By = {
  art_id?: InputMaybe<Order_By>
  art_votes?: InputMaybe<Art_Contest_Submissions_Order_By>
  caller?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
  weight?: InputMaybe<Order_By>
}

/** primary key columns input for table: "art_contest_votes" */
export type Art_Contest_Votes_Pk_Columns_Input = {
  caller: Scalars['String']
  nft_id: Scalars['String']
}

/** select columns of table "art_contest_votes" */
export enum Art_Contest_Votes_Select_Column {
  /** column name */
  ArtId = 'art_id',
  /** column name */
  Caller = 'caller',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  NftId = 'nft_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Weight = 'weight',
}

/** aggregate stddev on columns */
export type Art_Contest_Votes_Stddev_Fields = {
  __typename?: 'art_contest_votes_stddev_fields'
  id?: Maybe<Scalars['Float']>
  weight?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "art_contest_votes" */
export type Art_Contest_Votes_Stddev_Order_By = {
  id?: InputMaybe<Order_By>
  weight?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Art_Contest_Votes_Stddev_Pop_Fields = {
  __typename?: 'art_contest_votes_stddev_pop_fields'
  id?: Maybe<Scalars['Float']>
  weight?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "art_contest_votes" */
export type Art_Contest_Votes_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>
  weight?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Art_Contest_Votes_Stddev_Samp_Fields = {
  __typename?: 'art_contest_votes_stddev_samp_fields'
  id?: Maybe<Scalars['Float']>
  weight?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "art_contest_votes" */
export type Art_Contest_Votes_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>
  weight?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Art_Contest_Votes_Sum_Fields = {
  __typename?: 'art_contest_votes_sum_fields'
  id?: Maybe<Scalars['Int']>
  weight?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "art_contest_votes" */
export type Art_Contest_Votes_Sum_Order_By = {
  id?: InputMaybe<Order_By>
  weight?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Art_Contest_Votes_Var_Pop_Fields = {
  __typename?: 'art_contest_votes_var_pop_fields'
  id?: Maybe<Scalars['Float']>
  weight?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "art_contest_votes" */
export type Art_Contest_Votes_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>
  weight?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Art_Contest_Votes_Var_Samp_Fields = {
  __typename?: 'art_contest_votes_var_samp_fields'
  id?: Maybe<Scalars['Float']>
  weight?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "art_contest_votes" */
export type Art_Contest_Votes_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>
  weight?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Art_Contest_Votes_Variance_Fields = {
  __typename?: 'art_contest_votes_variance_fields'
  id?: Maybe<Scalars['Float']>
  weight?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "art_contest_votes" */
export type Art_Contest_Votes_Variance_Order_By = {
  id?: InputMaybe<Order_By>
  weight?: InputMaybe<Order_By>
}

/** expression to compare columns of type bigint. All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']>
  _gt?: InputMaybe<Scalars['bigint']>
  _gte?: InputMaybe<Scalars['bigint']>
  _in?: InputMaybe<Array<Scalars['bigint']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['bigint']>
  _lte?: InputMaybe<Scalars['bigint']>
  _neq?: InputMaybe<Scalars['bigint']>
  _nin?: InputMaybe<Array<Scalars['bigint']>>
}

/** columns and relationships of "changes" */
export type Changes = {
  __typename?: 'changes'
  block: Scalars['Int']
  caller: Scalars['String']
  /** An object relationship */
  collection?: Maybe<Collections>
  created_at: Scalars['timestamptz']
  field: Scalars['String']
  id: Scalars['Int']
  new: Scalars['String']
  /** An object relationship */
  nft?: Maybe<Nfts>
  old: Scalars['String']
  opType: Scalars['String']
  ref_id: Scalars['String']
}

/** aggregated selection of "changes" */
export type Changes_Aggregate = {
  __typename?: 'changes_aggregate'
  aggregate?: Maybe<Changes_Aggregate_Fields>
  nodes: Array<Changes>
}

/** aggregate fields of "changes" */
export type Changes_Aggregate_Fields = {
  __typename?: 'changes_aggregate_fields'
  avg?: Maybe<Changes_Avg_Fields>
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Changes_Max_Fields>
  min?: Maybe<Changes_Min_Fields>
  stddev?: Maybe<Changes_Stddev_Fields>
  stddev_pop?: Maybe<Changes_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Changes_Stddev_Samp_Fields>
  sum?: Maybe<Changes_Sum_Fields>
  var_pop?: Maybe<Changes_Var_Pop_Fields>
  var_samp?: Maybe<Changes_Var_Samp_Fields>
  variance?: Maybe<Changes_Variance_Fields>
}

/** aggregate fields of "changes" */
export type Changes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Changes_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "changes" */
export type Changes_Aggregate_Order_By = {
  avg?: InputMaybe<Changes_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Changes_Max_Order_By>
  min?: InputMaybe<Changes_Min_Order_By>
  stddev?: InputMaybe<Changes_Stddev_Order_By>
  stddev_pop?: InputMaybe<Changes_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Changes_Stddev_Samp_Order_By>
  sum?: InputMaybe<Changes_Sum_Order_By>
  var_pop?: InputMaybe<Changes_Var_Pop_Order_By>
  var_samp?: InputMaybe<Changes_Var_Samp_Order_By>
  variance?: InputMaybe<Changes_Variance_Order_By>
}

/** aggregate avg on columns */
export type Changes_Avg_Fields = {
  __typename?: 'changes_avg_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "changes" */
export type Changes_Avg_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "changes". All fields are combined with a logical 'AND'. */
export type Changes_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Changes_Bool_Exp>>>
  _not?: InputMaybe<Changes_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Changes_Bool_Exp>>>
  block?: InputMaybe<Int_Comparison_Exp>
  caller?: InputMaybe<String_Comparison_Exp>
  collection?: InputMaybe<Collections_Bool_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  field?: InputMaybe<String_Comparison_Exp>
  id?: InputMaybe<Int_Comparison_Exp>
  new?: InputMaybe<String_Comparison_Exp>
  nft?: InputMaybe<Nfts_Bool_Exp>
  old?: InputMaybe<String_Comparison_Exp>
  opType?: InputMaybe<String_Comparison_Exp>
  ref_id?: InputMaybe<String_Comparison_Exp>
}

/** columns and relationships of "changes_collection" */
export type Changes_Collection = {
  __typename?: 'changes_collection'
  block: Scalars['Int']
  caller: Scalars['String']
  /** An object relationship */
  collection?: Maybe<Collections>
  created_at: Scalars['timestamptz']
  field: Scalars['String']
  id: Scalars['Int']
  new: Scalars['String']
  old: Scalars['String']
  opType: Scalars['String']
  ref_id: Scalars['String']
}

/** aggregated selection of "changes_collection" */
export type Changes_Collection_Aggregate = {
  __typename?: 'changes_collection_aggregate'
  aggregate?: Maybe<Changes_Collection_Aggregate_Fields>
  nodes: Array<Changes_Collection>
}

/** aggregate fields of "changes_collection" */
export type Changes_Collection_Aggregate_Fields = {
  __typename?: 'changes_collection_aggregate_fields'
  avg?: Maybe<Changes_Collection_Avg_Fields>
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Changes_Collection_Max_Fields>
  min?: Maybe<Changes_Collection_Min_Fields>
  stddev?: Maybe<Changes_Collection_Stddev_Fields>
  stddev_pop?: Maybe<Changes_Collection_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Changes_Collection_Stddev_Samp_Fields>
  sum?: Maybe<Changes_Collection_Sum_Fields>
  var_pop?: Maybe<Changes_Collection_Var_Pop_Fields>
  var_samp?: Maybe<Changes_Collection_Var_Samp_Fields>
  variance?: Maybe<Changes_Collection_Variance_Fields>
}

/** aggregate fields of "changes_collection" */
export type Changes_Collection_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Changes_Collection_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "changes_collection" */
export type Changes_Collection_Aggregate_Order_By = {
  avg?: InputMaybe<Changes_Collection_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Changes_Collection_Max_Order_By>
  min?: InputMaybe<Changes_Collection_Min_Order_By>
  stddev?: InputMaybe<Changes_Collection_Stddev_Order_By>
  stddev_pop?: InputMaybe<Changes_Collection_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Changes_Collection_Stddev_Samp_Order_By>
  sum?: InputMaybe<Changes_Collection_Sum_Order_By>
  var_pop?: InputMaybe<Changes_Collection_Var_Pop_Order_By>
  var_samp?: InputMaybe<Changes_Collection_Var_Samp_Order_By>
  variance?: InputMaybe<Changes_Collection_Variance_Order_By>
}

/** aggregate avg on columns */
export type Changes_Collection_Avg_Fields = {
  __typename?: 'changes_collection_avg_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "changes_collection" */
export type Changes_Collection_Avg_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "changes_collection". All fields are combined with a logical 'AND'. */
export type Changes_Collection_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Changes_Collection_Bool_Exp>>>
  _not?: InputMaybe<Changes_Collection_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Changes_Collection_Bool_Exp>>>
  block?: InputMaybe<Int_Comparison_Exp>
  caller?: InputMaybe<String_Comparison_Exp>
  collection?: InputMaybe<Collections_Bool_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  field?: InputMaybe<String_Comparison_Exp>
  id?: InputMaybe<Int_Comparison_Exp>
  new?: InputMaybe<String_Comparison_Exp>
  old?: InputMaybe<String_Comparison_Exp>
  opType?: InputMaybe<String_Comparison_Exp>
  ref_id?: InputMaybe<String_Comparison_Exp>
}

/** aggregate max on columns */
export type Changes_Collection_Max_Fields = {
  __typename?: 'changes_collection_max_fields'
  block?: Maybe<Scalars['Int']>
  caller?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
  field?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['Int']>
  new?: Maybe<Scalars['String']>
  old?: Maybe<Scalars['String']>
  opType?: Maybe<Scalars['String']>
  ref_id?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "changes_collection" */
export type Changes_Collection_Max_Order_By = {
  block?: InputMaybe<Order_By>
  caller?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  field?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  new?: InputMaybe<Order_By>
  old?: InputMaybe<Order_By>
  opType?: InputMaybe<Order_By>
  ref_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Changes_Collection_Min_Fields = {
  __typename?: 'changes_collection_min_fields'
  block?: Maybe<Scalars['Int']>
  caller?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
  field?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['Int']>
  new?: Maybe<Scalars['String']>
  old?: Maybe<Scalars['String']>
  opType?: Maybe<Scalars['String']>
  ref_id?: Maybe<Scalars['String']>
}

/** order by min() on columns of table "changes_collection" */
export type Changes_Collection_Min_Order_By = {
  block?: InputMaybe<Order_By>
  caller?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  field?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  new?: InputMaybe<Order_By>
  old?: InputMaybe<Order_By>
  opType?: InputMaybe<Order_By>
  ref_id?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "changes_collection" */
export type Changes_Collection_Order_By = {
  block?: InputMaybe<Order_By>
  caller?: InputMaybe<Order_By>
  collection?: InputMaybe<Collections_Order_By>
  created_at?: InputMaybe<Order_By>
  field?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  new?: InputMaybe<Order_By>
  old?: InputMaybe<Order_By>
  opType?: InputMaybe<Order_By>
  ref_id?: InputMaybe<Order_By>
}

/** primary key columns input for table: "changes_collection" */
export type Changes_Collection_Pk_Columns_Input = {
  id: Scalars['Int']
}

/** select columns of table "changes_collection" */
export enum Changes_Collection_Select_Column {
  /** column name */
  Block = 'block',
  /** column name */
  Caller = 'caller',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Field = 'field',
  /** column name */
  Id = 'id',
  /** column name */
  New = 'new',
  /** column name */
  Old = 'old',
  /** column name */
  OpType = 'opType',
  /** column name */
  RefId = 'ref_id',
}

/** aggregate stddev on columns */
export type Changes_Collection_Stddev_Fields = {
  __typename?: 'changes_collection_stddev_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "changes_collection" */
export type Changes_Collection_Stddev_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Changes_Collection_Stddev_Pop_Fields = {
  __typename?: 'changes_collection_stddev_pop_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "changes_collection" */
export type Changes_Collection_Stddev_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Changes_Collection_Stddev_Samp_Fields = {
  __typename?: 'changes_collection_stddev_samp_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "changes_collection" */
export type Changes_Collection_Stddev_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Changes_Collection_Sum_Fields = {
  __typename?: 'changes_collection_sum_fields'
  block?: Maybe<Scalars['Int']>
  id?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "changes_collection" */
export type Changes_Collection_Sum_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Changes_Collection_Var_Pop_Fields = {
  __typename?: 'changes_collection_var_pop_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "changes_collection" */
export type Changes_Collection_Var_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Changes_Collection_Var_Samp_Fields = {
  __typename?: 'changes_collection_var_samp_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "changes_collection" */
export type Changes_Collection_Var_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Changes_Collection_Variance_Fields = {
  __typename?: 'changes_collection_variance_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "changes_collection" */
export type Changes_Collection_Variance_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate max on columns */
export type Changes_Max_Fields = {
  __typename?: 'changes_max_fields'
  block?: Maybe<Scalars['Int']>
  caller?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
  field?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['Int']>
  new?: Maybe<Scalars['String']>
  old?: Maybe<Scalars['String']>
  opType?: Maybe<Scalars['String']>
  ref_id?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "changes" */
export type Changes_Max_Order_By = {
  block?: InputMaybe<Order_By>
  caller?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  field?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  new?: InputMaybe<Order_By>
  old?: InputMaybe<Order_By>
  opType?: InputMaybe<Order_By>
  ref_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Changes_Min_Fields = {
  __typename?: 'changes_min_fields'
  block?: Maybe<Scalars['Int']>
  caller?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
  field?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['Int']>
  new?: Maybe<Scalars['String']>
  old?: Maybe<Scalars['String']>
  opType?: Maybe<Scalars['String']>
  ref_id?: Maybe<Scalars['String']>
}

/** order by min() on columns of table "changes" */
export type Changes_Min_Order_By = {
  block?: InputMaybe<Order_By>
  caller?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  field?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  new?: InputMaybe<Order_By>
  old?: InputMaybe<Order_By>
  opType?: InputMaybe<Order_By>
  ref_id?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "changes" */
export type Changes_Order_By = {
  block?: InputMaybe<Order_By>
  caller?: InputMaybe<Order_By>
  collection?: InputMaybe<Collections_Order_By>
  created_at?: InputMaybe<Order_By>
  field?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  new?: InputMaybe<Order_By>
  nft?: InputMaybe<Nfts_Order_By>
  old?: InputMaybe<Order_By>
  opType?: InputMaybe<Order_By>
  ref_id?: InputMaybe<Order_By>
}

/** primary key columns input for table: "changes" */
export type Changes_Pk_Columns_Input = {
  id: Scalars['Int']
}

/** select columns of table "changes" */
export enum Changes_Select_Column {
  /** column name */
  Block = 'block',
  /** column name */
  Caller = 'caller',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Field = 'field',
  /** column name */
  Id = 'id',
  /** column name */
  New = 'new',
  /** column name */
  Old = 'old',
  /** column name */
  OpType = 'opType',
  /** column name */
  RefId = 'ref_id',
}

/** aggregate stddev on columns */
export type Changes_Stddev_Fields = {
  __typename?: 'changes_stddev_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "changes" */
export type Changes_Stddev_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Changes_Stddev_Pop_Fields = {
  __typename?: 'changes_stddev_pop_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "changes" */
export type Changes_Stddev_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Changes_Stddev_Samp_Fields = {
  __typename?: 'changes_stddev_samp_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "changes" */
export type Changes_Stddev_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Changes_Sum_Fields = {
  __typename?: 'changes_sum_fields'
  block?: Maybe<Scalars['Int']>
  id?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "changes" */
export type Changes_Sum_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Changes_Var_Pop_Fields = {
  __typename?: 'changes_var_pop_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "changes" */
export type Changes_Var_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Changes_Var_Samp_Fields = {
  __typename?: 'changes_var_samp_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "changes" */
export type Changes_Var_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Changes_Variance_Fields = {
  __typename?: 'changes_variance_fields'
  block?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "changes" */
export type Changes_Variance_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** columns and relationships of "collection_banners" */
export type Collection_Banners = {
  __typename?: 'collection_banners'
  /** An object relationship */
  collection?: Maybe<Collections>
  collection_id: Scalars['String']
  created_at: Scalars['timestamptz']
  image: Scalars['String']
}

/** Boolean expression to filter rows from the table "collection_banners". All fields are combined with a logical 'AND'. */
export type Collection_Banners_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Collection_Banners_Bool_Exp>>>
  _not?: InputMaybe<Collection_Banners_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Collection_Banners_Bool_Exp>>>
  collection?: InputMaybe<Collections_Bool_Exp>
  collection_id?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  image?: InputMaybe<String_Comparison_Exp>
}

/** ordering options when selecting data from "collection_banners" */
export type Collection_Banners_Order_By = {
  collection?: InputMaybe<Collections_Order_By>
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  image?: InputMaybe<Order_By>
}

/** primary key columns input for table: "collection_banners" */
export type Collection_Banners_Pk_Columns_Input = {
  collection_id: Scalars['String']
}

/** select columns of table "collection_banners" */
export enum Collection_Banners_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Image = 'image',
}

/** columns and relationships of "collections" */
export type Collections = {
  __typename?: 'collections'
  /** An object relationship */
  banner?: Maybe<Collection_Banners>
  block: Scalars['Int']
  /** An array relationship */
  changes: Array<Changes>
  /** An aggregated array relationship */
  changes_aggregate: Changes_Aggregate
  /** An array relationship */
  changes_collection: Array<Changes_Collection>
  /** An aggregated array relationship */
  changes_collection_aggregate: Changes_Collection_Aggregate
  data?: Maybe<Scalars['jsonb']>
  id: Scalars['String']
  issuer: Scalars['String']
  max: Scalars['Int']
  metadata?: Maybe<Scalars['String']>
  name: Scalars['String']
  /** An array relationship */
  nfts: Array<Nfts>
  /** An aggregated array relationship */
  nfts_aggregate: Nfts_Aggregate
  /** An object relationship */
  nfts_stats?: Maybe<Nfts_Stats>
  /** An array relationship */
  singular_blacklisted_accounts: Array<Singular_Blacklisted_Accounts>
  /** An array relationship */
  singular_blacklisted_collections: Array<Singular_Blacklisted_Collections>
  /** An array relationship */
  singular_curated: Array<Singular_Curated_Collections>
  /** An array relationship */
  singular_hidden_collections: Array<Singular_Hidden_Collections>
  /** An array relationship */
  singular_nsfw_collections: Array<Singular_Nsfw_Collections>
  /** An aggregated array relationship */
  singular_nsfw_collections_aggregate: Singular_Nsfw_Collections_Aggregate
  /** An array relationship */
  singular_verified_collections: Array<Singular_Verified_Collections>
  symbol: Scalars['String']
  updated_at: Scalars['timestamptz']
}

/** columns and relationships of "collections" */
export type CollectionsChangesArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsChanges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsChanges_CollectionArgs = {
  distinct_on?: InputMaybe<Array<Changes_Collection_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Collection_Order_By>>
  where?: InputMaybe<Changes_Collection_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsChanges_Collection_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Changes_Collection_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Collection_Order_By>>
  where?: InputMaybe<Changes_Collection_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsDataArgs = {
  path?: InputMaybe<Scalars['String']>
}

/** columns and relationships of "collections" */
export type CollectionsNftsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsNfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Blacklisted_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Blacklisted_Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Blacklisted_Accounts_Order_By>>
  where?: InputMaybe<Singular_Blacklisted_Accounts_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Blacklisted_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Blacklisted_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Blacklisted_Collections_Order_By>>
  where?: InputMaybe<Singular_Blacklisted_Collections_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_CuratedArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Curated_Collections_Order_By>>
  where?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Hidden_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Hidden_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Hidden_Collections_Order_By>>
  where?: InputMaybe<Singular_Hidden_Collections_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Nsfw_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Collections_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Nsfw_Collections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Collections_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Verified_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Verified_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Verified_Collections_Order_By>>
  where?: InputMaybe<Singular_Verified_Collections_Bool_Exp>
}

/** aggregated selection of "collections" */
export type Collections_Aggregate = {
  __typename?: 'collections_aggregate'
  aggregate?: Maybe<Collections_Aggregate_Fields>
  nodes: Array<Collections>
}

/** aggregate fields of "collections" */
export type Collections_Aggregate_Fields = {
  __typename?: 'collections_aggregate_fields'
  avg?: Maybe<Collections_Avg_Fields>
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Collections_Max_Fields>
  min?: Maybe<Collections_Min_Fields>
  stddev?: Maybe<Collections_Stddev_Fields>
  stddev_pop?: Maybe<Collections_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Collections_Stddev_Samp_Fields>
  sum?: Maybe<Collections_Sum_Fields>
  var_pop?: Maybe<Collections_Var_Pop_Fields>
  var_samp?: Maybe<Collections_Var_Samp_Fields>
  variance?: Maybe<Collections_Variance_Fields>
}

/** aggregate fields of "collections" */
export type Collections_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Collections_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "collections" */
export type Collections_Aggregate_Order_By = {
  avg?: InputMaybe<Collections_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Collections_Max_Order_By>
  min?: InputMaybe<Collections_Min_Order_By>
  stddev?: InputMaybe<Collections_Stddev_Order_By>
  stddev_pop?: InputMaybe<Collections_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Collections_Stddev_Samp_Order_By>
  sum?: InputMaybe<Collections_Sum_Order_By>
  var_pop?: InputMaybe<Collections_Var_Pop_Order_By>
  var_samp?: InputMaybe<Collections_Var_Samp_Order_By>
  variance?: InputMaybe<Collections_Variance_Order_By>
}

/** aggregate avg on columns */
export type Collections_Avg_Fields = {
  __typename?: 'collections_avg_fields'
  block?: Maybe<Scalars['Float']>
  max?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "collections" */
export type Collections_Avg_Order_By = {
  block?: InputMaybe<Order_By>
  max?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "collections". All fields are combined with a logical 'AND'. */
export type Collections_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Collections_Bool_Exp>>>
  _not?: InputMaybe<Collections_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Collections_Bool_Exp>>>
  banner?: InputMaybe<Collection_Banners_Bool_Exp>
  block?: InputMaybe<Int_Comparison_Exp>
  changes?: InputMaybe<Changes_Bool_Exp>
  changes_collection?: InputMaybe<Changes_Collection_Bool_Exp>
  data?: InputMaybe<Jsonb_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  issuer?: InputMaybe<String_Comparison_Exp>
  max?: InputMaybe<Int_Comparison_Exp>
  metadata?: InputMaybe<String_Comparison_Exp>
  name?: InputMaybe<String_Comparison_Exp>
  nfts?: InputMaybe<Nfts_Bool_Exp>
  nfts_stats?: InputMaybe<Nfts_Stats_Bool_Exp>
  singular_blacklisted_accounts?: InputMaybe<Singular_Blacklisted_Accounts_Bool_Exp>
  singular_blacklisted_collections?: InputMaybe<Singular_Blacklisted_Collections_Bool_Exp>
  singular_curated?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
  singular_hidden_collections?: InputMaybe<Singular_Hidden_Collections_Bool_Exp>
  singular_nsfw_collections?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
  singular_verified_collections?: InputMaybe<Singular_Verified_Collections_Bool_Exp>
  symbol?: InputMaybe<String_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** aggregate max on columns */
export type Collections_Max_Fields = {
  __typename?: 'collections_max_fields'
  block?: Maybe<Scalars['Int']>
  id?: Maybe<Scalars['String']>
  issuer?: Maybe<Scalars['String']>
  max?: Maybe<Scalars['Int']>
  metadata?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  symbol?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
}

/** order by max() on columns of table "collections" */
export type Collections_Max_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  issuer?: InputMaybe<Order_By>
  max?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  symbol?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Collections_Min_Fields = {
  __typename?: 'collections_min_fields'
  block?: Maybe<Scalars['Int']>
  id?: Maybe<Scalars['String']>
  issuer?: Maybe<Scalars['String']>
  max?: Maybe<Scalars['Int']>
  metadata?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  symbol?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
}

/** order by min() on columns of table "collections" */
export type Collections_Min_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  issuer?: InputMaybe<Order_By>
  max?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  symbol?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "collections" */
export type Collections_Order_By = {
  banner?: InputMaybe<Collection_Banners_Order_By>
  block?: InputMaybe<Order_By>
  changes_aggregate?: InputMaybe<Changes_Aggregate_Order_By>
  changes_collection_aggregate?: InputMaybe<Changes_Collection_Aggregate_Order_By>
  data?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  issuer?: InputMaybe<Order_By>
  max?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  nfts_aggregate?: InputMaybe<Nfts_Aggregate_Order_By>
  nfts_stats?: InputMaybe<Nfts_Stats_Order_By>
  singular_nsfw_collections_aggregate?: InputMaybe<Singular_Nsfw_Collections_Aggregate_Order_By>
  symbol?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** primary key columns input for table: "collections" */
export type Collections_Pk_Columns_Input = {
  id: Scalars['String']
}

/** select columns of table "collections" */
export enum Collections_Select_Column {
  /** column name */
  Block = 'block',
  /** column name */
  Data = 'data',
  /** column name */
  Id = 'id',
  /** column name */
  Issuer = 'issuer',
  /** column name */
  Max = 'max',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Name = 'name',
  /** column name */
  Symbol = 'symbol',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** aggregate stddev on columns */
export type Collections_Stddev_Fields = {
  __typename?: 'collections_stddev_fields'
  block?: Maybe<Scalars['Float']>
  max?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "collections" */
export type Collections_Stddev_Order_By = {
  block?: InputMaybe<Order_By>
  max?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Collections_Stddev_Pop_Fields = {
  __typename?: 'collections_stddev_pop_fields'
  block?: Maybe<Scalars['Float']>
  max?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "collections" */
export type Collections_Stddev_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  max?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Collections_Stddev_Samp_Fields = {
  __typename?: 'collections_stddev_samp_fields'
  block?: Maybe<Scalars['Float']>
  max?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "collections" */
export type Collections_Stddev_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  max?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Collections_Sum_Fields = {
  __typename?: 'collections_sum_fields'
  block?: Maybe<Scalars['Int']>
  max?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "collections" */
export type Collections_Sum_Order_By = {
  block?: InputMaybe<Order_By>
  max?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Collections_Var_Pop_Fields = {
  __typename?: 'collections_var_pop_fields'
  block?: Maybe<Scalars['Float']>
  max?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "collections" */
export type Collections_Var_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  max?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Collections_Var_Samp_Fields = {
  __typename?: 'collections_var_samp_fields'
  block?: Maybe<Scalars['Float']>
  max?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "collections" */
export type Collections_Var_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  max?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Collections_Variance_Fields = {
  __typename?: 'collections_variance_fields'
  block?: Maybe<Scalars['Float']>
  max?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "collections" */
export type Collections_Variance_Order_By = {
  block?: InputMaybe<Order_By>
  max?: InputMaybe<Order_By>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_Nfts = {
  __typename?: 'distinct_nfts'
  block?: Maybe<Scalars['Int']>
  burned?: Maybe<Scalars['String']>
  /** An object relationship */
  collection?: Maybe<Collections>
  collectionId?: Maybe<Scalars['String']>
  forsale?: Maybe<Scalars['bigint']>
  id?: Maybe<Scalars['String']>
  instance?: Maybe<Scalars['String']>
  metadata?: Maybe<Scalars['String']>
  metadata_animation_url?: Maybe<Scalars['String']>
  metadata_content_type?: Maybe<Scalars['String']>
  metadata_image?: Maybe<Scalars['String']>
  metadata_name?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  /** An array relationship */
  singular_curated: Array<Singular_Curated>
  /** An array relationship */
  singular_nsfw: Array<Singular_Nsfw_Nfts>
  /** An aggregated array relationship */
  singular_nsfw_aggregate: Singular_Nsfw_Nfts_Aggregate
  sn?: Maybe<Scalars['String']>
  transferable?: Maybe<Scalars['bigint']>
  tx_block?: Maybe<Scalars['Int']>
  tx_caller?: Maybe<Scalars['String']>
  tx_pending?: Maybe<Scalars['Boolean']>
  updated_at?: Maybe<Scalars['timestamptz']>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsSingular_CuratedArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Curated_Order_By>>
  where?: InputMaybe<Singular_Curated_Bool_Exp>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsSingular_NsfwArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsSingular_Nsfw_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

/** aggregated selection of "distinct_nfts" */
export type Distinct_Nfts_Aggregate = {
  __typename?: 'distinct_nfts_aggregate'
  aggregate?: Maybe<Distinct_Nfts_Aggregate_Fields>
  nodes: Array<Distinct_Nfts>
}

/** aggregate fields of "distinct_nfts" */
export type Distinct_Nfts_Aggregate_Fields = {
  __typename?: 'distinct_nfts_aggregate_fields'
  avg?: Maybe<Distinct_Nfts_Avg_Fields>
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Distinct_Nfts_Max_Fields>
  min?: Maybe<Distinct_Nfts_Min_Fields>
  stddev?: Maybe<Distinct_Nfts_Stddev_Fields>
  stddev_pop?: Maybe<Distinct_Nfts_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Distinct_Nfts_Stddev_Samp_Fields>
  sum?: Maybe<Distinct_Nfts_Sum_Fields>
  var_pop?: Maybe<Distinct_Nfts_Var_Pop_Fields>
  var_samp?: Maybe<Distinct_Nfts_Var_Samp_Fields>
  variance?: Maybe<Distinct_Nfts_Variance_Fields>
}

/** aggregate fields of "distinct_nfts" */
export type Distinct_Nfts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Distinct_Nfts_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "distinct_nfts" */
export type Distinct_Nfts_Aggregate_Order_By = {
  avg?: InputMaybe<Distinct_Nfts_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Distinct_Nfts_Max_Order_By>
  min?: InputMaybe<Distinct_Nfts_Min_Order_By>
  stddev?: InputMaybe<Distinct_Nfts_Stddev_Order_By>
  stddev_pop?: InputMaybe<Distinct_Nfts_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Distinct_Nfts_Stddev_Samp_Order_By>
  sum?: InputMaybe<Distinct_Nfts_Sum_Order_By>
  var_pop?: InputMaybe<Distinct_Nfts_Var_Pop_Order_By>
  var_samp?: InputMaybe<Distinct_Nfts_Var_Samp_Order_By>
  variance?: InputMaybe<Distinct_Nfts_Variance_Order_By>
}

/** aggregate avg on columns */
export type Distinct_Nfts_Avg_Fields = {
  __typename?: 'distinct_nfts_avg_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  tx_block?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "distinct_nfts" */
export type Distinct_Nfts_Avg_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  tx_block?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "distinct_nfts". All fields are combined with a logical 'AND'. */
export type Distinct_Nfts_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Distinct_Nfts_Bool_Exp>>>
  _not?: InputMaybe<Distinct_Nfts_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Distinct_Nfts_Bool_Exp>>>
  block?: InputMaybe<Int_Comparison_Exp>
  burned?: InputMaybe<String_Comparison_Exp>
  collection?: InputMaybe<Collections_Bool_Exp>
  collectionId?: InputMaybe<String_Comparison_Exp>
  forsale?: InputMaybe<Bigint_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  instance?: InputMaybe<String_Comparison_Exp>
  metadata?: InputMaybe<String_Comparison_Exp>
  metadata_animation_url?: InputMaybe<String_Comparison_Exp>
  metadata_content_type?: InputMaybe<String_Comparison_Exp>
  metadata_image?: InputMaybe<String_Comparison_Exp>
  metadata_name?: InputMaybe<String_Comparison_Exp>
  name?: InputMaybe<String_Comparison_Exp>
  owner?: InputMaybe<String_Comparison_Exp>
  singular_curated?: InputMaybe<Singular_Curated_Bool_Exp>
  singular_nsfw?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
  sn?: InputMaybe<String_Comparison_Exp>
  transferable?: InputMaybe<Bigint_Comparison_Exp>
  tx_block?: InputMaybe<Int_Comparison_Exp>
  tx_caller?: InputMaybe<String_Comparison_Exp>
  tx_pending?: InputMaybe<Boolean_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** aggregate max on columns */
export type Distinct_Nfts_Max_Fields = {
  __typename?: 'distinct_nfts_max_fields'
  block?: Maybe<Scalars['Int']>
  burned?: Maybe<Scalars['String']>
  collectionId?: Maybe<Scalars['String']>
  forsale?: Maybe<Scalars['bigint']>
  id?: Maybe<Scalars['String']>
  instance?: Maybe<Scalars['String']>
  metadata?: Maybe<Scalars['String']>
  metadata_animation_url?: Maybe<Scalars['String']>
  metadata_content_type?: Maybe<Scalars['String']>
  metadata_image?: Maybe<Scalars['String']>
  metadata_name?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  sn?: Maybe<Scalars['String']>
  transferable?: Maybe<Scalars['bigint']>
  tx_block?: Maybe<Scalars['Int']>
  tx_caller?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
}

/** order by max() on columns of table "distinct_nfts" */
export type Distinct_Nfts_Max_Order_By = {
  block?: InputMaybe<Order_By>
  burned?: InputMaybe<Order_By>
  collectionId?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  instance?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_animation_url?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  metadata_image?: InputMaybe<Order_By>
  metadata_name?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  sn?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  tx_block?: InputMaybe<Order_By>
  tx_caller?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Distinct_Nfts_Min_Fields = {
  __typename?: 'distinct_nfts_min_fields'
  block?: Maybe<Scalars['Int']>
  burned?: Maybe<Scalars['String']>
  collectionId?: Maybe<Scalars['String']>
  forsale?: Maybe<Scalars['bigint']>
  id?: Maybe<Scalars['String']>
  instance?: Maybe<Scalars['String']>
  metadata?: Maybe<Scalars['String']>
  metadata_animation_url?: Maybe<Scalars['String']>
  metadata_content_type?: Maybe<Scalars['String']>
  metadata_image?: Maybe<Scalars['String']>
  metadata_name?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  sn?: Maybe<Scalars['String']>
  transferable?: Maybe<Scalars['bigint']>
  tx_block?: Maybe<Scalars['Int']>
  tx_caller?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
}

/** order by min() on columns of table "distinct_nfts" */
export type Distinct_Nfts_Min_Order_By = {
  block?: InputMaybe<Order_By>
  burned?: InputMaybe<Order_By>
  collectionId?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  instance?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_animation_url?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  metadata_image?: InputMaybe<Order_By>
  metadata_name?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  sn?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  tx_block?: InputMaybe<Order_By>
  tx_caller?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "distinct_nfts" */
export type Distinct_Nfts_Order_By = {
  block?: InputMaybe<Order_By>
  burned?: InputMaybe<Order_By>
  collection?: InputMaybe<Collections_Order_By>
  collectionId?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  instance?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_animation_url?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  metadata_image?: InputMaybe<Order_By>
  metadata_name?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  singular_nsfw_aggregate?: InputMaybe<Singular_Nsfw_Nfts_Aggregate_Order_By>
  sn?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  tx_block?: InputMaybe<Order_By>
  tx_caller?: InputMaybe<Order_By>
  tx_pending?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** select columns of table "distinct_nfts" */
export enum Distinct_Nfts_Select_Column {
  /** column name */
  Block = 'block',
  /** column name */
  Burned = 'burned',
  /** column name */
  CollectionId = 'collectionId',
  /** column name */
  Forsale = 'forsale',
  /** column name */
  Id = 'id',
  /** column name */
  Instance = 'instance',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MetadataAnimationUrl = 'metadata_animation_url',
  /** column name */
  MetadataContentType = 'metadata_content_type',
  /** column name */
  MetadataImage = 'metadata_image',
  /** column name */
  MetadataName = 'metadata_name',
  /** column name */
  Name = 'name',
  /** column name */
  Owner = 'owner',
  /** column name */
  Sn = 'sn',
  /** column name */
  Transferable = 'transferable',
  /** column name */
  TxBlock = 'tx_block',
  /** column name */
  TxCaller = 'tx_caller',
  /** column name */
  TxPending = 'tx_pending',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** aggregate stddev on columns */
export type Distinct_Nfts_Stddev_Fields = {
  __typename?: 'distinct_nfts_stddev_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  tx_block?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "distinct_nfts" */
export type Distinct_Nfts_Stddev_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  tx_block?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Distinct_Nfts_Stddev_Pop_Fields = {
  __typename?: 'distinct_nfts_stddev_pop_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  tx_block?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "distinct_nfts" */
export type Distinct_Nfts_Stddev_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  tx_block?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Distinct_Nfts_Stddev_Samp_Fields = {
  __typename?: 'distinct_nfts_stddev_samp_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  tx_block?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "distinct_nfts" */
export type Distinct_Nfts_Stddev_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  tx_block?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Distinct_Nfts_Sum_Fields = {
  __typename?: 'distinct_nfts_sum_fields'
  block?: Maybe<Scalars['Int']>
  forsale?: Maybe<Scalars['bigint']>
  transferable?: Maybe<Scalars['bigint']>
  tx_block?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "distinct_nfts" */
export type Distinct_Nfts_Sum_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  tx_block?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Distinct_Nfts_Var_Pop_Fields = {
  __typename?: 'distinct_nfts_var_pop_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  tx_block?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "distinct_nfts" */
export type Distinct_Nfts_Var_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  tx_block?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Distinct_Nfts_Var_Samp_Fields = {
  __typename?: 'distinct_nfts_var_samp_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  tx_block?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "distinct_nfts" */
export type Distinct_Nfts_Var_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  tx_block?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Distinct_Nfts_Variance_Fields = {
  __typename?: 'distinct_nfts_variance_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  tx_block?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "distinct_nfts" */
export type Distinct_Nfts_Variance_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  tx_block?: InputMaybe<Order_By>
}

export type Get_By_Unicode_Args = {
  nft?: InputMaybe<Scalars['String']>
}

/** expression to compare columns of type jsonb. All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>
  _eq?: InputMaybe<Scalars['jsonb']>
  _gt?: InputMaybe<Scalars['jsonb']>
  _gte?: InputMaybe<Scalars['jsonb']>
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>
  _in?: InputMaybe<Array<Scalars['jsonb']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['jsonb']>
  _lte?: InputMaybe<Scalars['jsonb']>
  _neq?: InputMaybe<Scalars['jsonb']>
  _nin?: InputMaybe<Array<Scalars['jsonb']>>
}

/** columns and relationships of "kanaria_houou" */
export type Kanaria_Houou = {
  __typename?: 'kanaria_houou'
  created_at: Scalars['timestamptz']
  /** An object relationship */
  nft: Nfts
  nft_id: Scalars['String']
}

/** aggregated selection of "kanaria_houou" */
export type Kanaria_Houou_Aggregate = {
  __typename?: 'kanaria_houou_aggregate'
  aggregate?: Maybe<Kanaria_Houou_Aggregate_Fields>
  nodes: Array<Kanaria_Houou>
}

/** aggregate fields of "kanaria_houou" */
export type Kanaria_Houou_Aggregate_Fields = {
  __typename?: 'kanaria_houou_aggregate_fields'
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Kanaria_Houou_Max_Fields>
  min?: Maybe<Kanaria_Houou_Min_Fields>
}

/** aggregate fields of "kanaria_houou" */
export type Kanaria_Houou_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Kanaria_Houou_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "kanaria_houou" */
export type Kanaria_Houou_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Kanaria_Houou_Max_Order_By>
  min?: InputMaybe<Kanaria_Houou_Min_Order_By>
}

/** Boolean expression to filter rows from the table "kanaria_houou". All fields are combined with a logical 'AND'. */
export type Kanaria_Houou_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Kanaria_Houou_Bool_Exp>>>
  _not?: InputMaybe<Kanaria_Houou_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Kanaria_Houou_Bool_Exp>>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  nft?: InputMaybe<Nfts_Bool_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
}

/** aggregate max on columns */
export type Kanaria_Houou_Max_Fields = {
  __typename?: 'kanaria_houou_max_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  nft_id?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "kanaria_houou" */
export type Kanaria_Houou_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Kanaria_Houou_Min_Fields = {
  __typename?: 'kanaria_houou_min_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  nft_id?: Maybe<Scalars['String']>
}

/** order by min() on columns of table "kanaria_houou" */
export type Kanaria_Houou_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "kanaria_houou" */
export type Kanaria_Houou_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft?: InputMaybe<Nfts_Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** primary key columns input for table: "kanaria_houou" */
export type Kanaria_Houou_Pk_Columns_Input = {
  nft_id: Scalars['String']
}

/** select columns of table "kanaria_houou" */
export enum Kanaria_Houou_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  NftId = 'nft_id',
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root'
  /** update data of the table: "system" */
  update_system?: Maybe<System_Mutation_Response>
  /** update single row of the table: "system" */
  update_system_by_pk?: Maybe<System>
}

/** mutation root */
export type Mutation_RootUpdate_SystemArgs = {
  _set?: InputMaybe<System_Set_Input>
  where: System_Bool_Exp
}

/** mutation root */
export type Mutation_RootUpdate_System_By_PkArgs = {
  _set?: InputMaybe<System_Set_Input>
  pk_columns: System_Pk_Columns_Input
}

/** columns and relationships of "nfts" */
export type Nfts = {
  __typename?: 'nfts'
  block: Scalars['Int']
  burned: Scalars['String']
  /** An array relationship */
  changes: Array<Changes>
  /** An aggregated array relationship */
  changes_aggregate: Changes_Aggregate
  /** An object relationship */
  collection: Collections
  collectionId: Scalars['String']
  data?: Maybe<Scalars['String']>
  forsale: Scalars['bigint']
  id: Scalars['String']
  id_md5?: Maybe<Scalars['String']>
  instance: Scalars['String']
  /** An array relationship */
  kanaria_houou: Array<Kanaria_Houou>
  /** An aggregated array relationship */
  kanaria_houou_aggregate: Kanaria_Houou_Aggregate
  metadata?: Maybe<Scalars['String']>
  metadata_animation_url?: Maybe<Scalars['String']>
  metadata_content_type?: Maybe<Scalars['String']>
  metadata_description?: Maybe<Scalars['String']>
  metadata_image?: Maybe<Scalars['String']>
  metadata_name?: Maybe<Scalars['String']>
  name: Scalars['String']
  /** An array relationship */
  nft_reaction_stats: Array<Nfts_Reactions_Stats>
  /** An aggregated array relationship */
  nft_reaction_stats_aggregate: Nfts_Reactions_Stats_Aggregate
  /** An object relationship */
  nfts_stats?: Maybe<Nfts_Stats>
  owner: Scalars['String']
  /** An array relationship */
  reactions: Array<Reactions>
  /** An aggregated array relationship */
  reactions_aggregate: Reactions_Aggregate
  /** An array relationship */
  singular_curated: Array<Singular_Curated>
  /** An array relationship */
  singular_hidden: Array<Singular_Hidden_Nfts>
  /** An array relationship */
  singular_nsfw: Array<Singular_Nsfw_Nfts>
  /** An aggregated array relationship */
  singular_nsfw_aggregate: Singular_Nsfw_Nfts_Aggregate
  sn: Scalars['String']
  transferable: Scalars['bigint']
  txBlock?: Maybe<Scalars['Int']>
  txCaller?: Maybe<Scalars['String']>
  txPending: Scalars['Boolean']
  updatedAtBlock?: Maybe<Scalars['Int']>
  updated_at: Scalars['timestamptz']
}

/** columns and relationships of "nfts" */
export type NftsChangesArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsChanges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsKanaria_HououArgs = {
  distinct_on?: InputMaybe<Array<Kanaria_Houou_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Kanaria_Houou_Order_By>>
  where?: InputMaybe<Kanaria_Houou_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsKanaria_Houou_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Kanaria_Houou_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Kanaria_Houou_Order_By>>
  where?: InputMaybe<Kanaria_Houou_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsNft_Reaction_StatsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Reactions_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Reactions_Stats_Order_By>>
  where?: InputMaybe<Nfts_Reactions_Stats_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsNft_Reaction_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Reactions_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Reactions_Stats_Order_By>>
  where?: InputMaybe<Nfts_Reactions_Stats_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsReactionsArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Order_By>>
  where?: InputMaybe<Reactions_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsReactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Order_By>>
  where?: InputMaybe<Reactions_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsSingular_CuratedArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Curated_Order_By>>
  where?: InputMaybe<Singular_Curated_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsSingular_HiddenArgs = {
  distinct_on?: InputMaybe<Array<Singular_Hidden_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Hidden_Nfts_Order_By>>
  where?: InputMaybe<Singular_Hidden_Nfts_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsSingular_NsfwArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsSingular_Nsfw_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

/** aggregated selection of "nfts" */
export type Nfts_Aggregate = {
  __typename?: 'nfts_aggregate'
  aggregate?: Maybe<Nfts_Aggregate_Fields>
  nodes: Array<Nfts>
}

/** aggregate fields of "nfts" */
export type Nfts_Aggregate_Fields = {
  __typename?: 'nfts_aggregate_fields'
  avg?: Maybe<Nfts_Avg_Fields>
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Nfts_Max_Fields>
  min?: Maybe<Nfts_Min_Fields>
  stddev?: Maybe<Nfts_Stddev_Fields>
  stddev_pop?: Maybe<Nfts_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Nfts_Stddev_Samp_Fields>
  sum?: Maybe<Nfts_Sum_Fields>
  var_pop?: Maybe<Nfts_Var_Pop_Fields>
  var_samp?: Maybe<Nfts_Var_Samp_Fields>
  variance?: Maybe<Nfts_Variance_Fields>
}

/** aggregate fields of "nfts" */
export type Nfts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Nfts_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "nfts" */
export type Nfts_Aggregate_Order_By = {
  avg?: InputMaybe<Nfts_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Nfts_Max_Order_By>
  min?: InputMaybe<Nfts_Min_Order_By>
  stddev?: InputMaybe<Nfts_Stddev_Order_By>
  stddev_pop?: InputMaybe<Nfts_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Nfts_Stddev_Samp_Order_By>
  sum?: InputMaybe<Nfts_Sum_Order_By>
  var_pop?: InputMaybe<Nfts_Var_Pop_Order_By>
  var_samp?: InputMaybe<Nfts_Var_Samp_Order_By>
  variance?: InputMaybe<Nfts_Variance_Order_By>
}

/** aggregate avg on columns */
export type Nfts_Avg_Fields = {
  __typename?: 'nfts_avg_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  txBlock?: Maybe<Scalars['Float']>
  updatedAtBlock?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "nfts" */
export type Nfts_Avg_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  updatedAtBlock?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "nfts". All fields are combined with a logical 'AND'. */
export type Nfts_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Nfts_Bool_Exp>>>
  _not?: InputMaybe<Nfts_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Nfts_Bool_Exp>>>
  block?: InputMaybe<Int_Comparison_Exp>
  burned?: InputMaybe<String_Comparison_Exp>
  changes?: InputMaybe<Changes_Bool_Exp>
  collection?: InputMaybe<Collections_Bool_Exp>
  collectionId?: InputMaybe<String_Comparison_Exp>
  data?: InputMaybe<String_Comparison_Exp>
  forsale?: InputMaybe<Bigint_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  id_md5?: InputMaybe<String_Comparison_Exp>
  instance?: InputMaybe<String_Comparison_Exp>
  kanaria_houou?: InputMaybe<Kanaria_Houou_Bool_Exp>
  metadata?: InputMaybe<String_Comparison_Exp>
  metadata_animation_url?: InputMaybe<String_Comparison_Exp>
  metadata_content_type?: InputMaybe<String_Comparison_Exp>
  metadata_description?: InputMaybe<String_Comparison_Exp>
  metadata_image?: InputMaybe<String_Comparison_Exp>
  metadata_name?: InputMaybe<String_Comparison_Exp>
  name?: InputMaybe<String_Comparison_Exp>
  nft_reaction_stats?: InputMaybe<Nfts_Reactions_Stats_Bool_Exp>
  nfts_stats?: InputMaybe<Nfts_Stats_Bool_Exp>
  owner?: InputMaybe<String_Comparison_Exp>
  reactions?: InputMaybe<Reactions_Bool_Exp>
  singular_curated?: InputMaybe<Singular_Curated_Bool_Exp>
  singular_hidden?: InputMaybe<Singular_Hidden_Nfts_Bool_Exp>
  singular_nsfw?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
  sn?: InputMaybe<String_Comparison_Exp>
  transferable?: InputMaybe<Bigint_Comparison_Exp>
  txBlock?: InputMaybe<Int_Comparison_Exp>
  txCaller?: InputMaybe<String_Comparison_Exp>
  txPending?: InputMaybe<Boolean_Comparison_Exp>
  updatedAtBlock?: InputMaybe<Int_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** aggregate max on columns */
export type Nfts_Max_Fields = {
  __typename?: 'nfts_max_fields'
  block?: Maybe<Scalars['Int']>
  burned?: Maybe<Scalars['String']>
  collectionId?: Maybe<Scalars['String']>
  data?: Maybe<Scalars['String']>
  forsale?: Maybe<Scalars['bigint']>
  id?: Maybe<Scalars['String']>
  id_md5?: Maybe<Scalars['String']>
  instance?: Maybe<Scalars['String']>
  metadata?: Maybe<Scalars['String']>
  metadata_animation_url?: Maybe<Scalars['String']>
  metadata_content_type?: Maybe<Scalars['String']>
  metadata_description?: Maybe<Scalars['String']>
  metadata_image?: Maybe<Scalars['String']>
  metadata_name?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  sn?: Maybe<Scalars['String']>
  transferable?: Maybe<Scalars['bigint']>
  txBlock?: Maybe<Scalars['Int']>
  txCaller?: Maybe<Scalars['String']>
  updatedAtBlock?: Maybe<Scalars['Int']>
  updated_at?: Maybe<Scalars['timestamptz']>
}

/** order by max() on columns of table "nfts" */
export type Nfts_Max_Order_By = {
  block?: InputMaybe<Order_By>
  burned?: InputMaybe<Order_By>
  collectionId?: InputMaybe<Order_By>
  data?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  id_md5?: InputMaybe<Order_By>
  instance?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_animation_url?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  metadata_description?: InputMaybe<Order_By>
  metadata_image?: InputMaybe<Order_By>
  metadata_name?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  sn?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  txCaller?: InputMaybe<Order_By>
  updatedAtBlock?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Nfts_Min_Fields = {
  __typename?: 'nfts_min_fields'
  block?: Maybe<Scalars['Int']>
  burned?: Maybe<Scalars['String']>
  collectionId?: Maybe<Scalars['String']>
  data?: Maybe<Scalars['String']>
  forsale?: Maybe<Scalars['bigint']>
  id?: Maybe<Scalars['String']>
  id_md5?: Maybe<Scalars['String']>
  instance?: Maybe<Scalars['String']>
  metadata?: Maybe<Scalars['String']>
  metadata_animation_url?: Maybe<Scalars['String']>
  metadata_content_type?: Maybe<Scalars['String']>
  metadata_description?: Maybe<Scalars['String']>
  metadata_image?: Maybe<Scalars['String']>
  metadata_name?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  sn?: Maybe<Scalars['String']>
  transferable?: Maybe<Scalars['bigint']>
  txBlock?: Maybe<Scalars['Int']>
  txCaller?: Maybe<Scalars['String']>
  updatedAtBlock?: Maybe<Scalars['Int']>
  updated_at?: Maybe<Scalars['timestamptz']>
}

/** order by min() on columns of table "nfts" */
export type Nfts_Min_Order_By = {
  block?: InputMaybe<Order_By>
  burned?: InputMaybe<Order_By>
  collectionId?: InputMaybe<Order_By>
  data?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  id_md5?: InputMaybe<Order_By>
  instance?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_animation_url?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  metadata_description?: InputMaybe<Order_By>
  metadata_image?: InputMaybe<Order_By>
  metadata_name?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  sn?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  txCaller?: InputMaybe<Order_By>
  updatedAtBlock?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "nfts" */
export type Nfts_Order_By = {
  block?: InputMaybe<Order_By>
  burned?: InputMaybe<Order_By>
  changes_aggregate?: InputMaybe<Changes_Aggregate_Order_By>
  collection?: InputMaybe<Collections_Order_By>
  collectionId?: InputMaybe<Order_By>
  data?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  id_md5?: InputMaybe<Order_By>
  instance?: InputMaybe<Order_By>
  kanaria_houou_aggregate?: InputMaybe<Kanaria_Houou_Aggregate_Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_animation_url?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  metadata_description?: InputMaybe<Order_By>
  metadata_image?: InputMaybe<Order_By>
  metadata_name?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  nft_reaction_stats_aggregate?: InputMaybe<Nfts_Reactions_Stats_Aggregate_Order_By>
  nfts_stats?: InputMaybe<Nfts_Stats_Order_By>
  owner?: InputMaybe<Order_By>
  reactions_aggregate?: InputMaybe<Reactions_Aggregate_Order_By>
  singular_nsfw_aggregate?: InputMaybe<Singular_Nsfw_Nfts_Aggregate_Order_By>
  sn?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  txCaller?: InputMaybe<Order_By>
  txPending?: InputMaybe<Order_By>
  updatedAtBlock?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** primary key columns input for table: "nfts" */
export type Nfts_Pk_Columns_Input = {
  id: Scalars['String']
}

/** columns and relationships of "nfts_reactions_stats" */
export type Nfts_Reactions_Stats = {
  __typename?: 'nfts_reactions_stats'
  count?: Maybe<Scalars['bigint']>
  nft_id?: Maybe<Scalars['String']>
  /** An object relationship */
  nft_reaction_stats?: Maybe<Nfts>
}

/** aggregated selection of "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Aggregate = {
  __typename?: 'nfts_reactions_stats_aggregate'
  aggregate?: Maybe<Nfts_Reactions_Stats_Aggregate_Fields>
  nodes: Array<Nfts_Reactions_Stats>
}

/** aggregate fields of "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Aggregate_Fields = {
  __typename?: 'nfts_reactions_stats_aggregate_fields'
  avg?: Maybe<Nfts_Reactions_Stats_Avg_Fields>
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Nfts_Reactions_Stats_Max_Fields>
  min?: Maybe<Nfts_Reactions_Stats_Min_Fields>
  stddev?: Maybe<Nfts_Reactions_Stats_Stddev_Fields>
  stddev_pop?: Maybe<Nfts_Reactions_Stats_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Nfts_Reactions_Stats_Stddev_Samp_Fields>
  sum?: Maybe<Nfts_Reactions_Stats_Sum_Fields>
  var_pop?: Maybe<Nfts_Reactions_Stats_Var_Pop_Fields>
  var_samp?: Maybe<Nfts_Reactions_Stats_Var_Samp_Fields>
  variance?: Maybe<Nfts_Reactions_Stats_Variance_Fields>
}

/** aggregate fields of "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Nfts_Reactions_Stats_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Aggregate_Order_By = {
  avg?: InputMaybe<Nfts_Reactions_Stats_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Nfts_Reactions_Stats_Max_Order_By>
  min?: InputMaybe<Nfts_Reactions_Stats_Min_Order_By>
  stddev?: InputMaybe<Nfts_Reactions_Stats_Stddev_Order_By>
  stddev_pop?: InputMaybe<Nfts_Reactions_Stats_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Nfts_Reactions_Stats_Stddev_Samp_Order_By>
  sum?: InputMaybe<Nfts_Reactions_Stats_Sum_Order_By>
  var_pop?: InputMaybe<Nfts_Reactions_Stats_Var_Pop_Order_By>
  var_samp?: InputMaybe<Nfts_Reactions_Stats_Var_Samp_Order_By>
  variance?: InputMaybe<Nfts_Reactions_Stats_Variance_Order_By>
}

/** aggregate avg on columns */
export type Nfts_Reactions_Stats_Avg_Fields = {
  __typename?: 'nfts_reactions_stats_avg_fields'
  count?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Avg_Order_By = {
  count?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "nfts_reactions_stats". All fields are combined with a logical 'AND'. */
export type Nfts_Reactions_Stats_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Nfts_Reactions_Stats_Bool_Exp>>>
  _not?: InputMaybe<Nfts_Reactions_Stats_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Nfts_Reactions_Stats_Bool_Exp>>>
  count?: InputMaybe<Bigint_Comparison_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
  nft_reaction_stats?: InputMaybe<Nfts_Bool_Exp>
}

/** aggregate max on columns */
export type Nfts_Reactions_Stats_Max_Fields = {
  __typename?: 'nfts_reactions_stats_max_fields'
  count?: Maybe<Scalars['bigint']>
  nft_id?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Max_Order_By = {
  count?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Nfts_Reactions_Stats_Min_Fields = {
  __typename?: 'nfts_reactions_stats_min_fields'
  count?: Maybe<Scalars['bigint']>
  nft_id?: Maybe<Scalars['String']>
}

/** order by min() on columns of table "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Min_Order_By = {
  count?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Order_By = {
  count?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
  nft_reaction_stats?: InputMaybe<Nfts_Order_By>
}

/** select columns of table "nfts_reactions_stats" */
export enum Nfts_Reactions_Stats_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  NftId = 'nft_id',
}

/** aggregate stddev on columns */
export type Nfts_Reactions_Stats_Stddev_Fields = {
  __typename?: 'nfts_reactions_stats_stddev_fields'
  count?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Stddev_Order_By = {
  count?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Nfts_Reactions_Stats_Stddev_Pop_Fields = {
  __typename?: 'nfts_reactions_stats_stddev_pop_fields'
  count?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Stddev_Pop_Order_By = {
  count?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Nfts_Reactions_Stats_Stddev_Samp_Fields = {
  __typename?: 'nfts_reactions_stats_stddev_samp_fields'
  count?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Stddev_Samp_Order_By = {
  count?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Nfts_Reactions_Stats_Sum_Fields = {
  __typename?: 'nfts_reactions_stats_sum_fields'
  count?: Maybe<Scalars['bigint']>
}

/** order by sum() on columns of table "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Sum_Order_By = {
  count?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Nfts_Reactions_Stats_Var_Pop_Fields = {
  __typename?: 'nfts_reactions_stats_var_pop_fields'
  count?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Var_Pop_Order_By = {
  count?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Nfts_Reactions_Stats_Var_Samp_Fields = {
  __typename?: 'nfts_reactions_stats_var_samp_fields'
  count?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Var_Samp_Order_By = {
  count?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Nfts_Reactions_Stats_Variance_Fields = {
  __typename?: 'nfts_reactions_stats_variance_fields'
  count?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "nfts_reactions_stats" */
export type Nfts_Reactions_Stats_Variance_Order_By = {
  count?: InputMaybe<Order_By>
}

/** select columns of table "nfts" */
export enum Nfts_Select_Column {
  /** column name */
  Block = 'block',
  /** column name */
  Burned = 'burned',
  /** column name */
  CollectionId = 'collectionId',
  /** column name */
  Data = 'data',
  /** column name */
  Forsale = 'forsale',
  /** column name */
  Id = 'id',
  /** column name */
  IdMd5 = 'id_md5',
  /** column name */
  Instance = 'instance',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MetadataAnimationUrl = 'metadata_animation_url',
  /** column name */
  MetadataContentType = 'metadata_content_type',
  /** column name */
  MetadataDescription = 'metadata_description',
  /** column name */
  MetadataImage = 'metadata_image',
  /** column name */
  MetadataName = 'metadata_name',
  /** column name */
  Name = 'name',
  /** column name */
  Owner = 'owner',
  /** column name */
  Sn = 'sn',
  /** column name */
  Transferable = 'transferable',
  /** column name */
  TxBlock = 'txBlock',
  /** column name */
  TxCaller = 'txCaller',
  /** column name */
  TxPending = 'txPending',
  /** column name */
  UpdatedAtBlock = 'updatedAtBlock',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** columns and relationships of "nfts_stats" */
export type Nfts_Stats = {
  __typename?: 'nfts_stats'
  collection_id?: Maybe<Scalars['String']>
  count?: Maybe<Scalars['bigint']>
}

/** Boolean expression to filter rows from the table "nfts_stats". All fields are combined with a logical 'AND'. */
export type Nfts_Stats_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Nfts_Stats_Bool_Exp>>>
  _not?: InputMaybe<Nfts_Stats_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Nfts_Stats_Bool_Exp>>>
  collection_id?: InputMaybe<String_Comparison_Exp>
  count?: InputMaybe<Bigint_Comparison_Exp>
}

/** ordering options when selecting data from "nfts_stats" */
export type Nfts_Stats_Order_By = {
  collection_id?: InputMaybe<Order_By>
  count?: InputMaybe<Order_By>
}

/** select columns of table "nfts_stats" */
export enum Nfts_Stats_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  Count = 'count',
}

/** aggregate stddev on columns */
export type Nfts_Stddev_Fields = {
  __typename?: 'nfts_stddev_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  txBlock?: Maybe<Scalars['Float']>
  updatedAtBlock?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "nfts" */
export type Nfts_Stddev_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  updatedAtBlock?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Nfts_Stddev_Pop_Fields = {
  __typename?: 'nfts_stddev_pop_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  txBlock?: Maybe<Scalars['Float']>
  updatedAtBlock?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "nfts" */
export type Nfts_Stddev_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  updatedAtBlock?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Nfts_Stddev_Samp_Fields = {
  __typename?: 'nfts_stddev_samp_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  txBlock?: Maybe<Scalars['Float']>
  updatedAtBlock?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "nfts" */
export type Nfts_Stddev_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  updatedAtBlock?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Nfts_Sum_Fields = {
  __typename?: 'nfts_sum_fields'
  block?: Maybe<Scalars['Int']>
  forsale?: Maybe<Scalars['bigint']>
  transferable?: Maybe<Scalars['bigint']>
  txBlock?: Maybe<Scalars['Int']>
  updatedAtBlock?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "nfts" */
export type Nfts_Sum_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  updatedAtBlock?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Nfts_Var_Pop_Fields = {
  __typename?: 'nfts_var_pop_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  txBlock?: Maybe<Scalars['Float']>
  updatedAtBlock?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "nfts" */
export type Nfts_Var_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  updatedAtBlock?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Nfts_Var_Samp_Fields = {
  __typename?: 'nfts_var_samp_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  txBlock?: Maybe<Scalars['Float']>
  updatedAtBlock?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "nfts" */
export type Nfts_Var_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  updatedAtBlock?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Nfts_Variance_Fields = {
  __typename?: 'nfts_variance_fields'
  block?: Maybe<Scalars['Float']>
  forsale?: Maybe<Scalars['Float']>
  transferable?: Maybe<Scalars['Float']>
  txBlock?: Maybe<Scalars['Float']>
  updatedAtBlock?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "nfts" */
export type Nfts_Variance_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  updatedAtBlock?: InputMaybe<Order_By>
}

/** column ordering options */
export enum Order_By {
  /** in the ascending order, nulls last */
  Asc = 'asc',
  /** in the ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in the ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in the descending order, nulls first */
  Desc = 'desc',
  /** in the descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in the descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}

/** query root */
export type Query_Root = {
  __typename?: 'query_root'
  /** fetch data from the table: "art_contest_nfts" */
  art_contest_nfts: Array<Art_Contest_Nfts>
  /** fetch aggregated fields from the table: "art_contest_nfts" */
  art_contest_nfts_aggregate: Art_Contest_Nfts_Aggregate
  /** fetch data from the table: "art_contest_nfts" using primary key columns */
  art_contest_nfts_by_pk?: Maybe<Art_Contest_Nfts>
  /** fetch data from the table: "art_contest_submissions" */
  art_contest_submissions: Array<Art_Contest_Submissions>
  /** fetch aggregated fields from the table: "art_contest_submissions" */
  art_contest_submissions_aggregate: Art_Contest_Submissions_Aggregate
  /** fetch data from the table: "art_contest_submissions" using primary key columns */
  art_contest_submissions_by_pk?: Maybe<Art_Contest_Submissions>
  /** fetch data from the table: "art_contest_votes" */
  art_contest_votes: Array<Art_Contest_Votes>
  /** fetch aggregated fields from the table: "art_contest_votes" */
  art_contest_votes_aggregate: Art_Contest_Votes_Aggregate
  /** fetch data from the table: "art_contest_votes" using primary key columns */
  art_contest_votes_by_pk?: Maybe<Art_Contest_Votes>
  /** fetch data from the table: "changes" */
  changes: Array<Changes>
  /** fetch aggregated fields from the table: "changes" */
  changes_aggregate: Changes_Aggregate
  /** fetch data from the table: "changes" using primary key columns */
  changes_by_pk?: Maybe<Changes>
  /** fetch data from the table: "changes_collection" */
  changes_collection: Array<Changes_Collection>
  /** fetch aggregated fields from the table: "changes_collection" */
  changes_collection_aggregate: Changes_Collection_Aggregate
  /** fetch data from the table: "changes_collection" using primary key columns */
  changes_collection_by_pk?: Maybe<Changes_Collection>
  /** fetch data from the table: "collection_banners" */
  collection_banners: Array<Collection_Banners>
  /** fetch data from the table: "collection_banners" using primary key columns */
  collection_banners_by_pk?: Maybe<Collection_Banners>
  /** fetch data from the table: "collections" */
  collections: Array<Collections>
  /** fetch aggregated fields from the table: "collections" */
  collections_aggregate: Collections_Aggregate
  /** fetch data from the table: "collections" using primary key columns */
  collections_by_pk?: Maybe<Collections>
  /** fetch data from the table: "distinct_nfts" */
  distinct_nfts: Array<Distinct_Nfts>
  /** fetch aggregated fields from the table: "distinct_nfts" */
  distinct_nfts_aggregate: Distinct_Nfts_Aggregate
  /** execute function "get_by_unicode" which returns "reactions" */
  get_by_unicode: Array<Reactions>
  /** execute function "get_by_unicode" and query aggregates on result of table type "reactions" */
  get_by_unicode_aggregate: Reactions_Aggregate
  /** execute function "get_newly_listed" which returns "nfts" */
  get_newly_listed: Array<Nfts>
  /** execute function "get_newly_listed" and query aggregates on result of table type "nfts" */
  get_newly_listed_aggregate: Nfts_Aggregate
  /** execute function "get_newly_minted" which returns "nfts" */
  get_newly_minted: Array<Nfts>
  /** execute function "get_newly_minted" and query aggregates on result of table type "nfts" */
  get_newly_minted_aggregate: Nfts_Aggregate
  /** fetch data from the table: "kanaria_houou" */
  kanaria_houou: Array<Kanaria_Houou>
  /** fetch aggregated fields from the table: "kanaria_houou" */
  kanaria_houou_aggregate: Kanaria_Houou_Aggregate
  /** fetch data from the table: "kanaria_houou" using primary key columns */
  kanaria_houou_by_pk?: Maybe<Kanaria_Houou>
  /** fetch data from the table: "nfts" */
  nfts: Array<Nfts>
  /** fetch aggregated fields from the table: "nfts" */
  nfts_aggregate: Nfts_Aggregate
  /** fetch data from the table: "nfts" using primary key columns */
  nfts_by_pk?: Maybe<Nfts>
  /** fetch data from the table: "nfts_reactions_stats" */
  nfts_reactions_stats: Array<Nfts_Reactions_Stats>
  /** fetch aggregated fields from the table: "nfts_reactions_stats" */
  nfts_reactions_stats_aggregate: Nfts_Reactions_Stats_Aggregate
  /** fetch data from the table: "nfts_stats" */
  nfts_stats: Array<Nfts_Stats>
  /** fetch data from the table: "reactions" */
  reactions: Array<Reactions>
  /** fetch aggregated fields from the table: "reactions" */
  reactions_aggregate: Reactions_Aggregate
  /** fetch data from the table: "reactions" using primary key columns */
  reactions_by_pk?: Maybe<Reactions>
  /** fetch data from the table: "reactions_unicode" */
  reactions_unicode: Array<Reactions_Unicode>
  /** fetch aggregated fields from the table: "reactions_unicode" */
  reactions_unicode_aggregate: Reactions_Unicode_Aggregate
  /** fetch data from the table: "reactions_users" */
  reactions_users: Array<Reactions_Users>
  /** fetch aggregated fields from the table: "reactions_users" */
  reactions_users_aggregate: Reactions_Users_Aggregate
  /** fetch data from the table: "singular_blacklisted_accounts" */
  singular_blacklisted_accounts: Array<Singular_Blacklisted_Accounts>
  /** fetch data from the table: "singular_blacklisted_accounts" using primary key columns */
  singular_blacklisted_accounts_by_pk?: Maybe<Singular_Blacklisted_Accounts>
  /** fetch data from the table: "singular_blacklisted_collections" */
  singular_blacklisted_collections: Array<Singular_Blacklisted_Collections>
  /** fetch data from the table: "singular_blacklisted_collections" using primary key columns */
  singular_blacklisted_collections_by_pk?: Maybe<Singular_Blacklisted_Collections>
  /** fetch data from the table: "singular_curated" */
  singular_curated: Array<Singular_Curated>
  /** fetch data from the table: "singular_curated" using primary key columns */
  singular_curated_by_pk?: Maybe<Singular_Curated>
  /** fetch data from the table: "singular_curated_collections" */
  singular_curated_collections: Array<Singular_Curated_Collections>
  /** fetch data from the table: "singular_curated_collections" using primary key columns */
  singular_curated_collections_by_pk?: Maybe<Singular_Curated_Collections>
  /** fetch data from the table: "singular_hidden_collections" */
  singular_hidden_collections: Array<Singular_Hidden_Collections>
  /** fetch data from the table: "singular_hidden_collections" using primary key columns */
  singular_hidden_collections_by_pk?: Maybe<Singular_Hidden_Collections>
  /** fetch data from the table: "singular_hidden_nfts" */
  singular_hidden_nfts: Array<Singular_Hidden_Nfts>
  /** fetch data from the table: "singular_hidden_nfts" using primary key columns */
  singular_hidden_nfts_by_pk?: Maybe<Singular_Hidden_Nfts>
  /** fetch data from the table: "singular_nsfw_collections" */
  singular_nsfw_collections: Array<Singular_Nsfw_Collections>
  /** fetch aggregated fields from the table: "singular_nsfw_collections" */
  singular_nsfw_collections_aggregate: Singular_Nsfw_Collections_Aggregate
  /** fetch data from the table: "singular_nsfw_collections" using primary key columns */
  singular_nsfw_collections_by_pk?: Maybe<Singular_Nsfw_Collections>
  /** fetch data from the table: "singular_nsfw_nfts" */
  singular_nsfw_nfts: Array<Singular_Nsfw_Nfts>
  /** fetch aggregated fields from the table: "singular_nsfw_nfts" */
  singular_nsfw_nfts_aggregate: Singular_Nsfw_Nfts_Aggregate
  /** fetch data from the table: "singular_nsfw_nfts" using primary key columns */
  singular_nsfw_nfts_by_pk?: Maybe<Singular_Nsfw_Nfts>
  /** fetch data from the table: "singular_verified_collections" */
  singular_verified_collections: Array<Singular_Verified_Collections>
  /** fetch data from the table: "singular_verified_collections" using primary key columns */
  singular_verified_collections_by_pk?: Maybe<Singular_Verified_Collections>
  /** fetch data from the table: "system" */
  system: Array<System>
  /** fetch data from the table: "system" using primary key columns */
  system_by_pk?: Maybe<System>
}

/** query root */
export type Query_RootArt_Contest_NftsArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Nfts_Order_By>>
  where?: InputMaybe<Art_Contest_Nfts_Bool_Exp>
}

/** query root */
export type Query_RootArt_Contest_Nfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Nfts_Order_By>>
  where?: InputMaybe<Art_Contest_Nfts_Bool_Exp>
}

/** query root */
export type Query_RootArt_Contest_Nfts_By_PkArgs = {
  nft_id: Scalars['String']
}

/** query root */
export type Query_RootArt_Contest_SubmissionsArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Submissions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Submissions_Order_By>>
  where?: InputMaybe<Art_Contest_Submissions_Bool_Exp>
}

/** query root */
export type Query_RootArt_Contest_Submissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Submissions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Submissions_Order_By>>
  where?: InputMaybe<Art_Contest_Submissions_Bool_Exp>
}

/** query root */
export type Query_RootArt_Contest_Submissions_By_PkArgs = {
  id: Scalars['Int']
}

/** query root */
export type Query_RootArt_Contest_VotesArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Votes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Votes_Order_By>>
  where?: InputMaybe<Art_Contest_Votes_Bool_Exp>
}

/** query root */
export type Query_RootArt_Contest_Votes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Votes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Votes_Order_By>>
  where?: InputMaybe<Art_Contest_Votes_Bool_Exp>
}

/** query root */
export type Query_RootArt_Contest_Votes_By_PkArgs = {
  caller: Scalars['String']
  nft_id: Scalars['String']
}

/** query root */
export type Query_RootChangesArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

/** query root */
export type Query_RootChanges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

/** query root */
export type Query_RootChanges_By_PkArgs = {
  id: Scalars['Int']
}

/** query root */
export type Query_RootChanges_CollectionArgs = {
  distinct_on?: InputMaybe<Array<Changes_Collection_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Collection_Order_By>>
  where?: InputMaybe<Changes_Collection_Bool_Exp>
}

/** query root */
export type Query_RootChanges_Collection_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Changes_Collection_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Collection_Order_By>>
  where?: InputMaybe<Changes_Collection_Bool_Exp>
}

/** query root */
export type Query_RootChanges_Collection_By_PkArgs = {
  id: Scalars['Int']
}

/** query root */
export type Query_RootCollection_BannersArgs = {
  distinct_on?: InputMaybe<Array<Collection_Banners_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Collection_Banners_Order_By>>
  where?: InputMaybe<Collection_Banners_Bool_Exp>
}

/** query root */
export type Query_RootCollection_Banners_By_PkArgs = {
  collection_id: Scalars['String']
}

/** query root */
export type Query_RootCollectionsArgs = {
  distinct_on?: InputMaybe<Array<Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Collections_Order_By>>
  where?: InputMaybe<Collections_Bool_Exp>
}

/** query root */
export type Query_RootCollections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Collections_Order_By>>
  where?: InputMaybe<Collections_Bool_Exp>
}

/** query root */
export type Query_RootCollections_By_PkArgs = {
  id: Scalars['String']
}

/** query root */
export type Query_RootDistinct_NftsArgs = {
  distinct_on?: InputMaybe<Array<Distinct_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Distinct_Nfts_Order_By>>
  where?: InputMaybe<Distinct_Nfts_Bool_Exp>
}

/** query root */
export type Query_RootDistinct_Nfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Distinct_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Distinct_Nfts_Order_By>>
  where?: InputMaybe<Distinct_Nfts_Bool_Exp>
}

/** query root */
export type Query_RootGet_By_UnicodeArgs = {
  args: Get_By_Unicode_Args
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Order_By>>
  where?: InputMaybe<Reactions_Bool_Exp>
}

/** query root */
export type Query_RootGet_By_Unicode_AggregateArgs = {
  args: Get_By_Unicode_Args
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Order_By>>
  where?: InputMaybe<Reactions_Bool_Exp>
}

/** query root */
export type Query_RootGet_Newly_ListedArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** query root */
export type Query_RootGet_Newly_Listed_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** query root */
export type Query_RootGet_Newly_MintedArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** query root */
export type Query_RootGet_Newly_Minted_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** query root */
export type Query_RootKanaria_HououArgs = {
  distinct_on?: InputMaybe<Array<Kanaria_Houou_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Kanaria_Houou_Order_By>>
  where?: InputMaybe<Kanaria_Houou_Bool_Exp>
}

/** query root */
export type Query_RootKanaria_Houou_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Kanaria_Houou_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Kanaria_Houou_Order_By>>
  where?: InputMaybe<Kanaria_Houou_Bool_Exp>
}

/** query root */
export type Query_RootKanaria_Houou_By_PkArgs = {
  nft_id: Scalars['String']
}

/** query root */
export type Query_RootNftsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** query root */
export type Query_RootNfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** query root */
export type Query_RootNfts_By_PkArgs = {
  id: Scalars['String']
}

/** query root */
export type Query_RootNfts_Reactions_StatsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Reactions_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Reactions_Stats_Order_By>>
  where?: InputMaybe<Nfts_Reactions_Stats_Bool_Exp>
}

/** query root */
export type Query_RootNfts_Reactions_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Reactions_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Reactions_Stats_Order_By>>
  where?: InputMaybe<Nfts_Reactions_Stats_Bool_Exp>
}

/** query root */
export type Query_RootNfts_StatsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Stats_Order_By>>
  where?: InputMaybe<Nfts_Stats_Bool_Exp>
}

/** query root */
export type Query_RootReactionsArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Order_By>>
  where?: InputMaybe<Reactions_Bool_Exp>
}

/** query root */
export type Query_RootReactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Order_By>>
  where?: InputMaybe<Reactions_Bool_Exp>
}

/** query root */
export type Query_RootReactions_By_PkArgs = {
  nft_id: Scalars['String']
  owner: Scalars['String']
  unicode: Scalars['String']
}

/** query root */
export type Query_RootReactions_UnicodeArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Unicode_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Unicode_Order_By>>
  where?: InputMaybe<Reactions_Unicode_Bool_Exp>
}

/** query root */
export type Query_RootReactions_Unicode_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Unicode_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Unicode_Order_By>>
  where?: InputMaybe<Reactions_Unicode_Bool_Exp>
}

/** query root */
export type Query_RootReactions_UsersArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Users_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Users_Order_By>>
  where?: InputMaybe<Reactions_Users_Bool_Exp>
}

/** query root */
export type Query_RootReactions_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Users_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Users_Order_By>>
  where?: InputMaybe<Reactions_Users_Bool_Exp>
}

/** query root */
export type Query_RootSingular_Blacklisted_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Blacklisted_Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Blacklisted_Accounts_Order_By>>
  where?: InputMaybe<Singular_Blacklisted_Accounts_Bool_Exp>
}

/** query root */
export type Query_RootSingular_Blacklisted_Accounts_By_PkArgs = {
  account: Scalars['String']
}

/** query root */
export type Query_RootSingular_Blacklisted_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Blacklisted_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Blacklisted_Collections_Order_By>>
  where?: InputMaybe<Singular_Blacklisted_Collections_Bool_Exp>
}

/** query root */
export type Query_RootSingular_Blacklisted_Collections_By_PkArgs = {
  collection_id: Scalars['String']
}

/** query root */
export type Query_RootSingular_CuratedArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Curated_Order_By>>
  where?: InputMaybe<Singular_Curated_Bool_Exp>
}

/** query root */
export type Query_RootSingular_Curated_By_PkArgs = {
  nft_id: Scalars['String']
}

/** query root */
export type Query_RootSingular_Curated_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Curated_Collections_Order_By>>
  where?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
}

/** query root */
export type Query_RootSingular_Curated_Collections_By_PkArgs = {
  collection_id: Scalars['String']
}

/** query root */
export type Query_RootSingular_Hidden_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Hidden_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Hidden_Collections_Order_By>>
  where?: InputMaybe<Singular_Hidden_Collections_Bool_Exp>
}

/** query root */
export type Query_RootSingular_Hidden_Collections_By_PkArgs = {
  collection_id: Scalars['String']
}

/** query root */
export type Query_RootSingular_Hidden_NftsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Hidden_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Hidden_Nfts_Order_By>>
  where?: InputMaybe<Singular_Hidden_Nfts_Bool_Exp>
}

/** query root */
export type Query_RootSingular_Hidden_Nfts_By_PkArgs = {
  nft_id: Scalars['String']
}

/** query root */
export type Query_RootSingular_Nsfw_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Collections_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
}

/** query root */
export type Query_RootSingular_Nsfw_Collections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Collections_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
}

/** query root */
export type Query_RootSingular_Nsfw_Collections_By_PkArgs = {
  collection_id: Scalars['String']
}

/** query root */
export type Query_RootSingular_Nsfw_NftsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

/** query root */
export type Query_RootSingular_Nsfw_Nfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

/** query root */
export type Query_RootSingular_Nsfw_Nfts_By_PkArgs = {
  nft_id: Scalars['String']
}

/** query root */
export type Query_RootSingular_Verified_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Verified_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Verified_Collections_Order_By>>
  where?: InputMaybe<Singular_Verified_Collections_Bool_Exp>
}

/** query root */
export type Query_RootSingular_Verified_Collections_By_PkArgs = {
  collection_id: Scalars['String']
}

/** query root */
export type Query_RootSystemArgs = {
  distinct_on?: InputMaybe<Array<System_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<System_Order_By>>
  where?: InputMaybe<System_Bool_Exp>
}

/** query root */
export type Query_RootSystem_By_PkArgs = {
  purchaseEnabled: Scalars['Boolean']
}

/** columns and relationships of "reactions" */
export type Reactions = {
  __typename?: 'reactions'
  created_at: Scalars['timestamptz']
  id: Scalars['Int']
  /** An object relationship */
  nft: Nfts
  nft_id: Scalars['String']
  owner: Scalars['String']
  /** An array relationship */
  reactions_unicode: Array<Reactions_Unicode>
  /** An aggregated array relationship */
  reactions_unicode_aggregate: Reactions_Unicode_Aggregate
  unicode: Scalars['String']
  /** An array relationship */
  user_reactions: Array<Reactions_Users>
  /** An aggregated array relationship */
  user_reactions_aggregate: Reactions_Users_Aggregate
}

/** columns and relationships of "reactions" */
export type ReactionsReactions_UnicodeArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Unicode_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Unicode_Order_By>>
  where?: InputMaybe<Reactions_Unicode_Bool_Exp>
}

/** columns and relationships of "reactions" */
export type ReactionsReactions_Unicode_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Unicode_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Unicode_Order_By>>
  where?: InputMaybe<Reactions_Unicode_Bool_Exp>
}

/** columns and relationships of "reactions" */
export type ReactionsUser_ReactionsArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Users_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Users_Order_By>>
  where?: InputMaybe<Reactions_Users_Bool_Exp>
}

/** columns and relationships of "reactions" */
export type ReactionsUser_Reactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Users_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Users_Order_By>>
  where?: InputMaybe<Reactions_Users_Bool_Exp>
}

/** aggregated selection of "reactions" */
export type Reactions_Aggregate = {
  __typename?: 'reactions_aggregate'
  aggregate?: Maybe<Reactions_Aggregate_Fields>
  nodes: Array<Reactions>
}

/** aggregate fields of "reactions" */
export type Reactions_Aggregate_Fields = {
  __typename?: 'reactions_aggregate_fields'
  avg?: Maybe<Reactions_Avg_Fields>
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Reactions_Max_Fields>
  min?: Maybe<Reactions_Min_Fields>
  stddev?: Maybe<Reactions_Stddev_Fields>
  stddev_pop?: Maybe<Reactions_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Reactions_Stddev_Samp_Fields>
  sum?: Maybe<Reactions_Sum_Fields>
  var_pop?: Maybe<Reactions_Var_Pop_Fields>
  var_samp?: Maybe<Reactions_Var_Samp_Fields>
  variance?: Maybe<Reactions_Variance_Fields>
}

/** aggregate fields of "reactions" */
export type Reactions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Reactions_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "reactions" */
export type Reactions_Aggregate_Order_By = {
  avg?: InputMaybe<Reactions_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Reactions_Max_Order_By>
  min?: InputMaybe<Reactions_Min_Order_By>
  stddev?: InputMaybe<Reactions_Stddev_Order_By>
  stddev_pop?: InputMaybe<Reactions_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Reactions_Stddev_Samp_Order_By>
  sum?: InputMaybe<Reactions_Sum_Order_By>
  var_pop?: InputMaybe<Reactions_Var_Pop_Order_By>
  var_samp?: InputMaybe<Reactions_Var_Samp_Order_By>
  variance?: InputMaybe<Reactions_Variance_Order_By>
}

/** aggregate avg on columns */
export type Reactions_Avg_Fields = {
  __typename?: 'reactions_avg_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by avg() on columns of table "reactions" */
export type Reactions_Avg_Order_By = {
  id?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "reactions". All fields are combined with a logical 'AND'. */
export type Reactions_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Reactions_Bool_Exp>>>
  _not?: InputMaybe<Reactions_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Reactions_Bool_Exp>>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  id?: InputMaybe<Int_Comparison_Exp>
  nft?: InputMaybe<Nfts_Bool_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
  owner?: InputMaybe<String_Comparison_Exp>
  reactions_unicode?: InputMaybe<Reactions_Unicode_Bool_Exp>
  unicode?: InputMaybe<String_Comparison_Exp>
  user_reactions?: InputMaybe<Reactions_Users_Bool_Exp>
}

/** aggregate max on columns */
export type Reactions_Max_Fields = {
  __typename?: 'reactions_max_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['Int']>
  nft_id?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  unicode?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "reactions" */
export type Reactions_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  unicode?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Reactions_Min_Fields = {
  __typename?: 'reactions_min_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['Int']>
  nft_id?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  unicode?: Maybe<Scalars['String']>
}

/** order by min() on columns of table "reactions" */
export type Reactions_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  unicode?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "reactions" */
export type Reactions_Order_By = {
  created_at?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  nft?: InputMaybe<Nfts_Order_By>
  nft_id?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  reactions_unicode_aggregate?: InputMaybe<Reactions_Unicode_Aggregate_Order_By>
  unicode?: InputMaybe<Order_By>
  user_reactions_aggregate?: InputMaybe<Reactions_Users_Aggregate_Order_By>
}

/** primary key columns input for table: "reactions" */
export type Reactions_Pk_Columns_Input = {
  nft_id: Scalars['String']
  owner: Scalars['String']
  unicode: Scalars['String']
}

/** select columns of table "reactions" */
export enum Reactions_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  NftId = 'nft_id',
  /** column name */
  Owner = 'owner',
  /** column name */
  Unicode = 'unicode',
}

/** aggregate stddev on columns */
export type Reactions_Stddev_Fields = {
  __typename?: 'reactions_stddev_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by stddev() on columns of table "reactions" */
export type Reactions_Stddev_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Reactions_Stddev_Pop_Fields = {
  __typename?: 'reactions_stddev_pop_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by stddev_pop() on columns of table "reactions" */
export type Reactions_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Reactions_Stddev_Samp_Fields = {
  __typename?: 'reactions_stddev_samp_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by stddev_samp() on columns of table "reactions" */
export type Reactions_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Reactions_Sum_Fields = {
  __typename?: 'reactions_sum_fields'
  id?: Maybe<Scalars['Int']>
}

/** order by sum() on columns of table "reactions" */
export type Reactions_Sum_Order_By = {
  id?: InputMaybe<Order_By>
}

/** columns and relationships of "reactions_unicode" */
export type Reactions_Unicode = {
  __typename?: 'reactions_unicode'
  nft_id?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  /** An object relationship */
  reactions_unicode?: Maybe<Reactions>
  unicode?: Maybe<Scalars['String']>
}

/** aggregated selection of "reactions_unicode" */
export type Reactions_Unicode_Aggregate = {
  __typename?: 'reactions_unicode_aggregate'
  aggregate?: Maybe<Reactions_Unicode_Aggregate_Fields>
  nodes: Array<Reactions_Unicode>
}

/** aggregate fields of "reactions_unicode" */
export type Reactions_Unicode_Aggregate_Fields = {
  __typename?: 'reactions_unicode_aggregate_fields'
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Reactions_Unicode_Max_Fields>
  min?: Maybe<Reactions_Unicode_Min_Fields>
}

/** aggregate fields of "reactions_unicode" */
export type Reactions_Unicode_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Reactions_Unicode_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "reactions_unicode" */
export type Reactions_Unicode_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Reactions_Unicode_Max_Order_By>
  min?: InputMaybe<Reactions_Unicode_Min_Order_By>
}

/** Boolean expression to filter rows from the table "reactions_unicode". All fields are combined with a logical 'AND'. */
export type Reactions_Unicode_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Reactions_Unicode_Bool_Exp>>>
  _not?: InputMaybe<Reactions_Unicode_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Reactions_Unicode_Bool_Exp>>>
  nft_id?: InputMaybe<String_Comparison_Exp>
  owner?: InputMaybe<String_Comparison_Exp>
  reactions_unicode?: InputMaybe<Reactions_Bool_Exp>
  unicode?: InputMaybe<String_Comparison_Exp>
}

/** aggregate max on columns */
export type Reactions_Unicode_Max_Fields = {
  __typename?: 'reactions_unicode_max_fields'
  nft_id?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  unicode?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "reactions_unicode" */
export type Reactions_Unicode_Max_Order_By = {
  nft_id?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  unicode?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Reactions_Unicode_Min_Fields = {
  __typename?: 'reactions_unicode_min_fields'
  nft_id?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  unicode?: Maybe<Scalars['String']>
}

/** order by min() on columns of table "reactions_unicode" */
export type Reactions_Unicode_Min_Order_By = {
  nft_id?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  unicode?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "reactions_unicode" */
export type Reactions_Unicode_Order_By = {
  nft_id?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  reactions_unicode?: InputMaybe<Reactions_Order_By>
  unicode?: InputMaybe<Order_By>
}

/** select columns of table "reactions_unicode" */
export enum Reactions_Unicode_Select_Column {
  /** column name */
  NftId = 'nft_id',
  /** column name */
  Owner = 'owner',
  /** column name */
  Unicode = 'unicode',
}

/** columns and relationships of "reactions_users" */
export type Reactions_Users = {
  __typename?: 'reactions_users'
  nft_id?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  unicode?: Maybe<Scalars['String']>
  /** An object relationship */
  user_reactions?: Maybe<Reactions>
}

/** aggregated selection of "reactions_users" */
export type Reactions_Users_Aggregate = {
  __typename?: 'reactions_users_aggregate'
  aggregate?: Maybe<Reactions_Users_Aggregate_Fields>
  nodes: Array<Reactions_Users>
}

/** aggregate fields of "reactions_users" */
export type Reactions_Users_Aggregate_Fields = {
  __typename?: 'reactions_users_aggregate_fields'
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Reactions_Users_Max_Fields>
  min?: Maybe<Reactions_Users_Min_Fields>
}

/** aggregate fields of "reactions_users" */
export type Reactions_Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Reactions_Users_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "reactions_users" */
export type Reactions_Users_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Reactions_Users_Max_Order_By>
  min?: InputMaybe<Reactions_Users_Min_Order_By>
}

/** Boolean expression to filter rows from the table "reactions_users". All fields are combined with a logical 'AND'. */
export type Reactions_Users_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Reactions_Users_Bool_Exp>>>
  _not?: InputMaybe<Reactions_Users_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Reactions_Users_Bool_Exp>>>
  nft_id?: InputMaybe<String_Comparison_Exp>
  owner?: InputMaybe<String_Comparison_Exp>
  unicode?: InputMaybe<String_Comparison_Exp>
  user_reactions?: InputMaybe<Reactions_Bool_Exp>
}

/** aggregate max on columns */
export type Reactions_Users_Max_Fields = {
  __typename?: 'reactions_users_max_fields'
  nft_id?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  unicode?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "reactions_users" */
export type Reactions_Users_Max_Order_By = {
  nft_id?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  unicode?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Reactions_Users_Min_Fields = {
  __typename?: 'reactions_users_min_fields'
  nft_id?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  unicode?: Maybe<Scalars['String']>
}

/** order by min() on columns of table "reactions_users" */
export type Reactions_Users_Min_Order_By = {
  nft_id?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  unicode?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "reactions_users" */
export type Reactions_Users_Order_By = {
  nft_id?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  unicode?: InputMaybe<Order_By>
  user_reactions?: InputMaybe<Reactions_Order_By>
}

/** select columns of table "reactions_users" */
export enum Reactions_Users_Select_Column {
  /** column name */
  NftId = 'nft_id',
  /** column name */
  Owner = 'owner',
  /** column name */
  Unicode = 'unicode',
}

/** aggregate var_pop on columns */
export type Reactions_Var_Pop_Fields = {
  __typename?: 'reactions_var_pop_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by var_pop() on columns of table "reactions" */
export type Reactions_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Reactions_Var_Samp_Fields = {
  __typename?: 'reactions_var_samp_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by var_samp() on columns of table "reactions" */
export type Reactions_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Reactions_Variance_Fields = {
  __typename?: 'reactions_variance_fields'
  id?: Maybe<Scalars['Float']>
}

/** order by variance() on columns of table "reactions" */
export type Reactions_Variance_Order_By = {
  id?: InputMaybe<Order_By>
}

/** columns and relationships of "singular_blacklisted_accounts" */
export type Singular_Blacklisted_Accounts = {
  __typename?: 'singular_blacklisted_accounts'
  account: Scalars['String']
  /** An array relationship */
  accounts: Array<Collections>
  /** An aggregated array relationship */
  accounts_aggregate: Collections_Aggregate
  created_at: Scalars['timestamptz']
}

/** columns and relationships of "singular_blacklisted_accounts" */
export type Singular_Blacklisted_AccountsAccountsArgs = {
  distinct_on?: InputMaybe<Array<Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Collections_Order_By>>
  where?: InputMaybe<Collections_Bool_Exp>
}

/** columns and relationships of "singular_blacklisted_accounts" */
export type Singular_Blacklisted_AccountsAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Collections_Order_By>>
  where?: InputMaybe<Collections_Bool_Exp>
}

/** Boolean expression to filter rows from the table "singular_blacklisted_accounts". All fields are combined with a logical 'AND'. */
export type Singular_Blacklisted_Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Singular_Blacklisted_Accounts_Bool_Exp>>>
  _not?: InputMaybe<Singular_Blacklisted_Accounts_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Singular_Blacklisted_Accounts_Bool_Exp>>>
  account?: InputMaybe<String_Comparison_Exp>
  accounts?: InputMaybe<Collections_Bool_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** ordering options when selecting data from "singular_blacklisted_accounts" */
export type Singular_Blacklisted_Accounts_Order_By = {
  account?: InputMaybe<Order_By>
  accounts_aggregate?: InputMaybe<Collections_Aggregate_Order_By>
  created_at?: InputMaybe<Order_By>
}

/** primary key columns input for table: "singular_blacklisted_accounts" */
export type Singular_Blacklisted_Accounts_Pk_Columns_Input = {
  account: Scalars['String']
}

/** select columns of table "singular_blacklisted_accounts" */
export enum Singular_Blacklisted_Accounts_Select_Column {
  /** column name */
  Account = 'account',
  /** column name */
  CreatedAt = 'created_at',
}

/** columns and relationships of "singular_blacklisted_collections" */
export type Singular_Blacklisted_Collections = {
  __typename?: 'singular_blacklisted_collections'
  /** An object relationship */
  collection?: Maybe<Collections>
  collection_id: Scalars['String']
  created_at: Scalars['timestamptz']
}

/** Boolean expression to filter rows from the table "singular_blacklisted_collections". All fields are combined with a logical 'AND'. */
export type Singular_Blacklisted_Collections_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Singular_Blacklisted_Collections_Bool_Exp>>>
  _not?: InputMaybe<Singular_Blacklisted_Collections_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Singular_Blacklisted_Collections_Bool_Exp>>>
  collection?: InputMaybe<Collections_Bool_Exp>
  collection_id?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** ordering options when selecting data from "singular_blacklisted_collections" */
export type Singular_Blacklisted_Collections_Order_By = {
  collection?: InputMaybe<Collections_Order_By>
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** primary key columns input for table: "singular_blacklisted_collections" */
export type Singular_Blacklisted_Collections_Pk_Columns_Input = {
  collection_id: Scalars['String']
}

/** select columns of table "singular_blacklisted_collections" */
export enum Singular_Blacklisted_Collections_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
}

/** columns and relationships of "singular_curated" */
export type Singular_Curated = {
  __typename?: 'singular_curated'
  created_at: Scalars['timestamptz']
  /** An object relationship */
  nft: Nfts
  nft_id: Scalars['String']
}

/** Boolean expression to filter rows from the table "singular_curated". All fields are combined with a logical 'AND'. */
export type Singular_Curated_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Singular_Curated_Bool_Exp>>>
  _not?: InputMaybe<Singular_Curated_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Singular_Curated_Bool_Exp>>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  nft?: InputMaybe<Nfts_Bool_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
}

/** columns and relationships of "singular_curated_collections" */
export type Singular_Curated_Collections = {
  __typename?: 'singular_curated_collections'
  collection_id: Scalars['String']
  created_at: Scalars['timestamptz']
}

/** Boolean expression to filter rows from the table "singular_curated_collections". All fields are combined with a logical 'AND'. */
export type Singular_Curated_Collections_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Singular_Curated_Collections_Bool_Exp>>>
  _not?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Singular_Curated_Collections_Bool_Exp>>>
  collection_id?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** ordering options when selecting data from "singular_curated_collections" */
export type Singular_Curated_Collections_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** primary key columns input for table: "singular_curated_collections" */
export type Singular_Curated_Collections_Pk_Columns_Input = {
  collection_id: Scalars['String']
}

/** select columns of table "singular_curated_collections" */
export enum Singular_Curated_Collections_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
}

/** ordering options when selecting data from "singular_curated" */
export type Singular_Curated_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft?: InputMaybe<Nfts_Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** primary key columns input for table: "singular_curated" */
export type Singular_Curated_Pk_Columns_Input = {
  nft_id: Scalars['String']
}

/** select columns of table "singular_curated" */
export enum Singular_Curated_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  NftId = 'nft_id',
}

/** columns and relationships of "singular_hidden_collections" */
export type Singular_Hidden_Collections = {
  __typename?: 'singular_hidden_collections'
  collection_id: Scalars['String']
  /** An object relationship */
  collections?: Maybe<Collections>
  created_at: Scalars['timestamptz']
}

/** Boolean expression to filter rows from the table "singular_hidden_collections". All fields are combined with a logical 'AND'. */
export type Singular_Hidden_Collections_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Singular_Hidden_Collections_Bool_Exp>>>
  _not?: InputMaybe<Singular_Hidden_Collections_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Singular_Hidden_Collections_Bool_Exp>>>
  collection_id?: InputMaybe<String_Comparison_Exp>
  collections?: InputMaybe<Collections_Bool_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** ordering options when selecting data from "singular_hidden_collections" */
export type Singular_Hidden_Collections_Order_By = {
  collection_id?: InputMaybe<Order_By>
  collections?: InputMaybe<Collections_Order_By>
  created_at?: InputMaybe<Order_By>
}

/** primary key columns input for table: "singular_hidden_collections" */
export type Singular_Hidden_Collections_Pk_Columns_Input = {
  collection_id: Scalars['String']
}

/** select columns of table "singular_hidden_collections" */
export enum Singular_Hidden_Collections_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
}

/** columns and relationships of "singular_hidden_nfts" */
export type Singular_Hidden_Nfts = {
  __typename?: 'singular_hidden_nfts'
  created_at: Scalars['timestamptz']
  nft_id: Scalars['String']
  /** An object relationship */
  nfts?: Maybe<Nfts>
}

/** Boolean expression to filter rows from the table "singular_hidden_nfts". All fields are combined with a logical 'AND'. */
export type Singular_Hidden_Nfts_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Singular_Hidden_Nfts_Bool_Exp>>>
  _not?: InputMaybe<Singular_Hidden_Nfts_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Singular_Hidden_Nfts_Bool_Exp>>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
  nfts?: InputMaybe<Nfts_Bool_Exp>
}

/** ordering options when selecting data from "singular_hidden_nfts" */
export type Singular_Hidden_Nfts_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
  nfts?: InputMaybe<Nfts_Order_By>
}

/** primary key columns input for table: "singular_hidden_nfts" */
export type Singular_Hidden_Nfts_Pk_Columns_Input = {
  nft_id: Scalars['String']
}

/** select columns of table "singular_hidden_nfts" */
export enum Singular_Hidden_Nfts_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  NftId = 'nft_id',
}

/** columns and relationships of "singular_nsfw_collections" */
export type Singular_Nsfw_Collections = {
  __typename?: 'singular_nsfw_collections'
  /** An object relationship */
  collection?: Maybe<Collections>
  collection_id: Scalars['String']
  created_at: Scalars['timestamptz']
  reason?: Maybe<Scalars['jsonb']>
}

/** columns and relationships of "singular_nsfw_collections" */
export type Singular_Nsfw_CollectionsReasonArgs = {
  path?: InputMaybe<Scalars['String']>
}

/** aggregated selection of "singular_nsfw_collections" */
export type Singular_Nsfw_Collections_Aggregate = {
  __typename?: 'singular_nsfw_collections_aggregate'
  aggregate?: Maybe<Singular_Nsfw_Collections_Aggregate_Fields>
  nodes: Array<Singular_Nsfw_Collections>
}

/** aggregate fields of "singular_nsfw_collections" */
export type Singular_Nsfw_Collections_Aggregate_Fields = {
  __typename?: 'singular_nsfw_collections_aggregate_fields'
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Singular_Nsfw_Collections_Max_Fields>
  min?: Maybe<Singular_Nsfw_Collections_Min_Fields>
}

/** aggregate fields of "singular_nsfw_collections" */
export type Singular_Nsfw_Collections_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "singular_nsfw_collections" */
export type Singular_Nsfw_Collections_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Singular_Nsfw_Collections_Max_Order_By>
  min?: InputMaybe<Singular_Nsfw_Collections_Min_Order_By>
}

/** Boolean expression to filter rows from the table "singular_nsfw_collections". All fields are combined with a logical 'AND'. */
export type Singular_Nsfw_Collections_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Singular_Nsfw_Collections_Bool_Exp>>>
  _not?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Singular_Nsfw_Collections_Bool_Exp>>>
  collection?: InputMaybe<Collections_Bool_Exp>
  collection_id?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  reason?: InputMaybe<Jsonb_Comparison_Exp>
}

/** aggregate max on columns */
export type Singular_Nsfw_Collections_Max_Fields = {
  __typename?: 'singular_nsfw_collections_max_fields'
  collection_id?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
}

/** order by max() on columns of table "singular_nsfw_collections" */
export type Singular_Nsfw_Collections_Max_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Singular_Nsfw_Collections_Min_Fields = {
  __typename?: 'singular_nsfw_collections_min_fields'
  collection_id?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
}

/** order by min() on columns of table "singular_nsfw_collections" */
export type Singular_Nsfw_Collections_Min_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "singular_nsfw_collections" */
export type Singular_Nsfw_Collections_Order_By = {
  collection?: InputMaybe<Collections_Order_By>
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  reason?: InputMaybe<Order_By>
}

/** primary key columns input for table: "singular_nsfw_collections" */
export type Singular_Nsfw_Collections_Pk_Columns_Input = {
  collection_id: Scalars['String']
}

/** select columns of table "singular_nsfw_collections" */
export enum Singular_Nsfw_Collections_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Reason = 'reason',
}

/** columns and relationships of "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts = {
  __typename?: 'singular_nsfw_nfts'
  created_at: Scalars['timestamptz']
  /** An object relationship */
  nft: Nfts
  nft_id: Scalars['String']
  reason?: Maybe<Scalars['jsonb']>
}

/** columns and relationships of "singular_nsfw_nfts" */
export type Singular_Nsfw_NftsReasonArgs = {
  path?: InputMaybe<Scalars['String']>
}

/** aggregated selection of "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts_Aggregate = {
  __typename?: 'singular_nsfw_nfts_aggregate'
  aggregate?: Maybe<Singular_Nsfw_Nfts_Aggregate_Fields>
  nodes: Array<Singular_Nsfw_Nfts>
}

/** aggregate fields of "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts_Aggregate_Fields = {
  __typename?: 'singular_nsfw_nfts_aggregate_fields'
  count?: Maybe<Scalars['Int']>
  max?: Maybe<Singular_Nsfw_Nfts_Max_Fields>
  min?: Maybe<Singular_Nsfw_Nfts_Min_Fields>
}

/** aggregate fields of "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']>
}

/** order by aggregate values of table "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Singular_Nsfw_Nfts_Max_Order_By>
  min?: InputMaybe<Singular_Nsfw_Nfts_Min_Order_By>
}

/** Boolean expression to filter rows from the table "singular_nsfw_nfts". All fields are combined with a logical 'AND'. */
export type Singular_Nsfw_Nfts_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>>>
  _not?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  nft?: InputMaybe<Nfts_Bool_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
  reason?: InputMaybe<Jsonb_Comparison_Exp>
}

/** aggregate max on columns */
export type Singular_Nsfw_Nfts_Max_Fields = {
  __typename?: 'singular_nsfw_nfts_max_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  nft_id?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Singular_Nsfw_Nfts_Min_Fields = {
  __typename?: 'singular_nsfw_nfts_min_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  nft_id?: Maybe<Scalars['String']>
}

/** order by min() on columns of table "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** ordering options when selecting data from "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft?: InputMaybe<Nfts_Order_By>
  nft_id?: InputMaybe<Order_By>
  reason?: InputMaybe<Order_By>
}

/** primary key columns input for table: "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts_Pk_Columns_Input = {
  nft_id: Scalars['String']
}

/** select columns of table "singular_nsfw_nfts" */
export enum Singular_Nsfw_Nfts_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  NftId = 'nft_id',
  /** column name */
  Reason = 'reason',
}

/** columns and relationships of "singular_verified_collections" */
export type Singular_Verified_Collections = {
  __typename?: 'singular_verified_collections'
  collection_id: Scalars['String']
  created_at?: Maybe<Scalars['timestamptz']>
}

/** Boolean expression to filter rows from the table "singular_verified_collections". All fields are combined with a logical 'AND'. */
export type Singular_Verified_Collections_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Singular_Verified_Collections_Bool_Exp>>>
  _not?: InputMaybe<Singular_Verified_Collections_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<Singular_Verified_Collections_Bool_Exp>>>
  collection_id?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** ordering options when selecting data from "singular_verified_collections" */
export type Singular_Verified_Collections_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** primary key columns input for table: "singular_verified_collections" */
export type Singular_Verified_Collections_Pk_Columns_Input = {
  collection_id: Scalars['String']
}

/** select columns of table "singular_verified_collections" */
export enum Singular_Verified_Collections_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
}

/** subscription root */
export type Subscription_Root = {
  __typename?: 'subscription_root'
  /** fetch data from the table: "art_contest_nfts" */
  art_contest_nfts: Array<Art_Contest_Nfts>
  /** fetch aggregated fields from the table: "art_contest_nfts" */
  art_contest_nfts_aggregate: Art_Contest_Nfts_Aggregate
  /** fetch data from the table: "art_contest_nfts" using primary key columns */
  art_contest_nfts_by_pk?: Maybe<Art_Contest_Nfts>
  /** fetch data from the table: "art_contest_submissions" */
  art_contest_submissions: Array<Art_Contest_Submissions>
  /** fetch aggregated fields from the table: "art_contest_submissions" */
  art_contest_submissions_aggregate: Art_Contest_Submissions_Aggregate
  /** fetch data from the table: "art_contest_submissions" using primary key columns */
  art_contest_submissions_by_pk?: Maybe<Art_Contest_Submissions>
  /** fetch data from the table: "art_contest_votes" */
  art_contest_votes: Array<Art_Contest_Votes>
  /** fetch aggregated fields from the table: "art_contest_votes" */
  art_contest_votes_aggregate: Art_Contest_Votes_Aggregate
  /** fetch data from the table: "art_contest_votes" using primary key columns */
  art_contest_votes_by_pk?: Maybe<Art_Contest_Votes>
  /** fetch data from the table: "changes" */
  changes: Array<Changes>
  /** fetch aggregated fields from the table: "changes" */
  changes_aggregate: Changes_Aggregate
  /** fetch data from the table: "changes" using primary key columns */
  changes_by_pk?: Maybe<Changes>
  /** fetch data from the table: "changes_collection" */
  changes_collection: Array<Changes_Collection>
  /** fetch aggregated fields from the table: "changes_collection" */
  changes_collection_aggregate: Changes_Collection_Aggregate
  /** fetch data from the table: "changes_collection" using primary key columns */
  changes_collection_by_pk?: Maybe<Changes_Collection>
  /** fetch data from the table: "collection_banners" */
  collection_banners: Array<Collection_Banners>
  /** fetch data from the table: "collection_banners" using primary key columns */
  collection_banners_by_pk?: Maybe<Collection_Banners>
  /** fetch data from the table: "collections" */
  collections: Array<Collections>
  /** fetch aggregated fields from the table: "collections" */
  collections_aggregate: Collections_Aggregate
  /** fetch data from the table: "collections" using primary key columns */
  collections_by_pk?: Maybe<Collections>
  /** fetch data from the table: "distinct_nfts" */
  distinct_nfts: Array<Distinct_Nfts>
  /** fetch aggregated fields from the table: "distinct_nfts" */
  distinct_nfts_aggregate: Distinct_Nfts_Aggregate
  /** execute function "get_by_unicode" which returns "reactions" */
  get_by_unicode: Array<Reactions>
  /** execute function "get_by_unicode" and query aggregates on result of table type "reactions" */
  get_by_unicode_aggregate: Reactions_Aggregate
  /** execute function "get_newly_listed" which returns "nfts" */
  get_newly_listed: Array<Nfts>
  /** execute function "get_newly_listed" and query aggregates on result of table type "nfts" */
  get_newly_listed_aggregate: Nfts_Aggregate
  /** execute function "get_newly_minted" which returns "nfts" */
  get_newly_minted: Array<Nfts>
  /** execute function "get_newly_minted" and query aggregates on result of table type "nfts" */
  get_newly_minted_aggregate: Nfts_Aggregate
  /** fetch data from the table: "kanaria_houou" */
  kanaria_houou: Array<Kanaria_Houou>
  /** fetch aggregated fields from the table: "kanaria_houou" */
  kanaria_houou_aggregate: Kanaria_Houou_Aggregate
  /** fetch data from the table: "kanaria_houou" using primary key columns */
  kanaria_houou_by_pk?: Maybe<Kanaria_Houou>
  /** fetch data from the table: "nfts" */
  nfts: Array<Nfts>
  /** fetch aggregated fields from the table: "nfts" */
  nfts_aggregate: Nfts_Aggregate
  /** fetch data from the table: "nfts" using primary key columns */
  nfts_by_pk?: Maybe<Nfts>
  /** fetch data from the table: "nfts_reactions_stats" */
  nfts_reactions_stats: Array<Nfts_Reactions_Stats>
  /** fetch aggregated fields from the table: "nfts_reactions_stats" */
  nfts_reactions_stats_aggregate: Nfts_Reactions_Stats_Aggregate
  /** fetch data from the table: "nfts_stats" */
  nfts_stats: Array<Nfts_Stats>
  /** fetch data from the table: "reactions" */
  reactions: Array<Reactions>
  /** fetch aggregated fields from the table: "reactions" */
  reactions_aggregate: Reactions_Aggregate
  /** fetch data from the table: "reactions" using primary key columns */
  reactions_by_pk?: Maybe<Reactions>
  /** fetch data from the table: "reactions_unicode" */
  reactions_unicode: Array<Reactions_Unicode>
  /** fetch aggregated fields from the table: "reactions_unicode" */
  reactions_unicode_aggregate: Reactions_Unicode_Aggregate
  /** fetch data from the table: "reactions_users" */
  reactions_users: Array<Reactions_Users>
  /** fetch aggregated fields from the table: "reactions_users" */
  reactions_users_aggregate: Reactions_Users_Aggregate
  /** fetch data from the table: "singular_blacklisted_accounts" */
  singular_blacklisted_accounts: Array<Singular_Blacklisted_Accounts>
  /** fetch data from the table: "singular_blacklisted_accounts" using primary key columns */
  singular_blacklisted_accounts_by_pk?: Maybe<Singular_Blacklisted_Accounts>
  /** fetch data from the table: "singular_blacklisted_collections" */
  singular_blacklisted_collections: Array<Singular_Blacklisted_Collections>
  /** fetch data from the table: "singular_blacklisted_collections" using primary key columns */
  singular_blacklisted_collections_by_pk?: Maybe<Singular_Blacklisted_Collections>
  /** fetch data from the table: "singular_curated" */
  singular_curated: Array<Singular_Curated>
  /** fetch data from the table: "singular_curated" using primary key columns */
  singular_curated_by_pk?: Maybe<Singular_Curated>
  /** fetch data from the table: "singular_curated_collections" */
  singular_curated_collections: Array<Singular_Curated_Collections>
  /** fetch data from the table: "singular_curated_collections" using primary key columns */
  singular_curated_collections_by_pk?: Maybe<Singular_Curated_Collections>
  /** fetch data from the table: "singular_hidden_collections" */
  singular_hidden_collections: Array<Singular_Hidden_Collections>
  /** fetch data from the table: "singular_hidden_collections" using primary key columns */
  singular_hidden_collections_by_pk?: Maybe<Singular_Hidden_Collections>
  /** fetch data from the table: "singular_hidden_nfts" */
  singular_hidden_nfts: Array<Singular_Hidden_Nfts>
  /** fetch data from the table: "singular_hidden_nfts" using primary key columns */
  singular_hidden_nfts_by_pk?: Maybe<Singular_Hidden_Nfts>
  /** fetch data from the table: "singular_nsfw_collections" */
  singular_nsfw_collections: Array<Singular_Nsfw_Collections>
  /** fetch aggregated fields from the table: "singular_nsfw_collections" */
  singular_nsfw_collections_aggregate: Singular_Nsfw_Collections_Aggregate
  /** fetch data from the table: "singular_nsfw_collections" using primary key columns */
  singular_nsfw_collections_by_pk?: Maybe<Singular_Nsfw_Collections>
  /** fetch data from the table: "singular_nsfw_nfts" */
  singular_nsfw_nfts: Array<Singular_Nsfw_Nfts>
  /** fetch aggregated fields from the table: "singular_nsfw_nfts" */
  singular_nsfw_nfts_aggregate: Singular_Nsfw_Nfts_Aggregate
  /** fetch data from the table: "singular_nsfw_nfts" using primary key columns */
  singular_nsfw_nfts_by_pk?: Maybe<Singular_Nsfw_Nfts>
  /** fetch data from the table: "singular_verified_collections" */
  singular_verified_collections: Array<Singular_Verified_Collections>
  /** fetch data from the table: "singular_verified_collections" using primary key columns */
  singular_verified_collections_by_pk?: Maybe<Singular_Verified_Collections>
  /** fetch data from the table: "system" */
  system: Array<System>
  /** fetch data from the table: "system" using primary key columns */
  system_by_pk?: Maybe<System>
}

/** subscription root */
export type Subscription_RootArt_Contest_NftsArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Nfts_Order_By>>
  where?: InputMaybe<Art_Contest_Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootArt_Contest_Nfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Nfts_Order_By>>
  where?: InputMaybe<Art_Contest_Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootArt_Contest_Nfts_By_PkArgs = {
  nft_id: Scalars['String']
}

/** subscription root */
export type Subscription_RootArt_Contest_SubmissionsArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Submissions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Submissions_Order_By>>
  where?: InputMaybe<Art_Contest_Submissions_Bool_Exp>
}

/** subscription root */
export type Subscription_RootArt_Contest_Submissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Submissions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Submissions_Order_By>>
  where?: InputMaybe<Art_Contest_Submissions_Bool_Exp>
}

/** subscription root */
export type Subscription_RootArt_Contest_Submissions_By_PkArgs = {
  id: Scalars['Int']
}

/** subscription root */
export type Subscription_RootArt_Contest_VotesArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Votes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Votes_Order_By>>
  where?: InputMaybe<Art_Contest_Votes_Bool_Exp>
}

/** subscription root */
export type Subscription_RootArt_Contest_Votes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Art_Contest_Votes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Art_Contest_Votes_Order_By>>
  where?: InputMaybe<Art_Contest_Votes_Bool_Exp>
}

/** subscription root */
export type Subscription_RootArt_Contest_Votes_By_PkArgs = {
  caller: Scalars['String']
  nft_id: Scalars['String']
}

/** subscription root */
export type Subscription_RootChangesArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

/** subscription root */
export type Subscription_RootChanges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

/** subscription root */
export type Subscription_RootChanges_By_PkArgs = {
  id: Scalars['Int']
}

/** subscription root */
export type Subscription_RootChanges_CollectionArgs = {
  distinct_on?: InputMaybe<Array<Changes_Collection_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Collection_Order_By>>
  where?: InputMaybe<Changes_Collection_Bool_Exp>
}

/** subscription root */
export type Subscription_RootChanges_Collection_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Changes_Collection_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Changes_Collection_Order_By>>
  where?: InputMaybe<Changes_Collection_Bool_Exp>
}

/** subscription root */
export type Subscription_RootChanges_Collection_By_PkArgs = {
  id: Scalars['Int']
}

/** subscription root */
export type Subscription_RootCollection_BannersArgs = {
  distinct_on?: InputMaybe<Array<Collection_Banners_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Collection_Banners_Order_By>>
  where?: InputMaybe<Collection_Banners_Bool_Exp>
}

/** subscription root */
export type Subscription_RootCollection_Banners_By_PkArgs = {
  collection_id: Scalars['String']
}

/** subscription root */
export type Subscription_RootCollectionsArgs = {
  distinct_on?: InputMaybe<Array<Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Collections_Order_By>>
  where?: InputMaybe<Collections_Bool_Exp>
}

/** subscription root */
export type Subscription_RootCollections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Collections_Order_By>>
  where?: InputMaybe<Collections_Bool_Exp>
}

/** subscription root */
export type Subscription_RootCollections_By_PkArgs = {
  id: Scalars['String']
}

/** subscription root */
export type Subscription_RootDistinct_NftsArgs = {
  distinct_on?: InputMaybe<Array<Distinct_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Distinct_Nfts_Order_By>>
  where?: InputMaybe<Distinct_Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootDistinct_Nfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Distinct_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Distinct_Nfts_Order_By>>
  where?: InputMaybe<Distinct_Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootGet_By_UnicodeArgs = {
  args: Get_By_Unicode_Args
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Order_By>>
  where?: InputMaybe<Reactions_Bool_Exp>
}

/** subscription root */
export type Subscription_RootGet_By_Unicode_AggregateArgs = {
  args: Get_By_Unicode_Args
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Order_By>>
  where?: InputMaybe<Reactions_Bool_Exp>
}

/** subscription root */
export type Subscription_RootGet_Newly_ListedArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootGet_Newly_Listed_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootGet_Newly_MintedArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootGet_Newly_Minted_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootKanaria_HououArgs = {
  distinct_on?: InputMaybe<Array<Kanaria_Houou_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Kanaria_Houou_Order_By>>
  where?: InputMaybe<Kanaria_Houou_Bool_Exp>
}

/** subscription root */
export type Subscription_RootKanaria_Houou_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Kanaria_Houou_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Kanaria_Houou_Order_By>>
  where?: InputMaybe<Kanaria_Houou_Bool_Exp>
}

/** subscription root */
export type Subscription_RootKanaria_Houou_By_PkArgs = {
  nft_id: Scalars['String']
}

/** subscription root */
export type Subscription_RootNftsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootNfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootNfts_By_PkArgs = {
  id: Scalars['String']
}

/** subscription root */
export type Subscription_RootNfts_Reactions_StatsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Reactions_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Reactions_Stats_Order_By>>
  where?: InputMaybe<Nfts_Reactions_Stats_Bool_Exp>
}

/** subscription root */
export type Subscription_RootNfts_Reactions_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Reactions_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Reactions_Stats_Order_By>>
  where?: InputMaybe<Nfts_Reactions_Stats_Bool_Exp>
}

/** subscription root */
export type Subscription_RootNfts_StatsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Nfts_Stats_Order_By>>
  where?: InputMaybe<Nfts_Stats_Bool_Exp>
}

/** subscription root */
export type Subscription_RootReactionsArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Order_By>>
  where?: InputMaybe<Reactions_Bool_Exp>
}

/** subscription root */
export type Subscription_RootReactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Order_By>>
  where?: InputMaybe<Reactions_Bool_Exp>
}

/** subscription root */
export type Subscription_RootReactions_By_PkArgs = {
  nft_id: Scalars['String']
  owner: Scalars['String']
  unicode: Scalars['String']
}

/** subscription root */
export type Subscription_RootReactions_UnicodeArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Unicode_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Unicode_Order_By>>
  where?: InputMaybe<Reactions_Unicode_Bool_Exp>
}

/** subscription root */
export type Subscription_RootReactions_Unicode_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Unicode_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Unicode_Order_By>>
  where?: InputMaybe<Reactions_Unicode_Bool_Exp>
}

/** subscription root */
export type Subscription_RootReactions_UsersArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Users_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Users_Order_By>>
  where?: InputMaybe<Reactions_Users_Bool_Exp>
}

/** subscription root */
export type Subscription_RootReactions_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reactions_Users_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Reactions_Users_Order_By>>
  where?: InputMaybe<Reactions_Users_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSingular_Blacklisted_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Blacklisted_Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Blacklisted_Accounts_Order_By>>
  where?: InputMaybe<Singular_Blacklisted_Accounts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSingular_Blacklisted_Accounts_By_PkArgs = {
  account: Scalars['String']
}

/** subscription root */
export type Subscription_RootSingular_Blacklisted_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Blacklisted_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Blacklisted_Collections_Order_By>>
  where?: InputMaybe<Singular_Blacklisted_Collections_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSingular_Blacklisted_Collections_By_PkArgs = {
  collection_id: Scalars['String']
}

/** subscription root */
export type Subscription_RootSingular_CuratedArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Curated_Order_By>>
  where?: InputMaybe<Singular_Curated_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSingular_Curated_By_PkArgs = {
  nft_id: Scalars['String']
}

/** subscription root */
export type Subscription_RootSingular_Curated_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Curated_Collections_Order_By>>
  where?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSingular_Curated_Collections_By_PkArgs = {
  collection_id: Scalars['String']
}

/** subscription root */
export type Subscription_RootSingular_Hidden_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Hidden_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Hidden_Collections_Order_By>>
  where?: InputMaybe<Singular_Hidden_Collections_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSingular_Hidden_Collections_By_PkArgs = {
  collection_id: Scalars['String']
}

/** subscription root */
export type Subscription_RootSingular_Hidden_NftsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Hidden_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Hidden_Nfts_Order_By>>
  where?: InputMaybe<Singular_Hidden_Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSingular_Hidden_Nfts_By_PkArgs = {
  nft_id: Scalars['String']
}

/** subscription root */
export type Subscription_RootSingular_Nsfw_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Collections_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSingular_Nsfw_Collections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Collections_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSingular_Nsfw_Collections_By_PkArgs = {
  collection_id: Scalars['String']
}

/** subscription root */
export type Subscription_RootSingular_Nsfw_NftsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSingular_Nsfw_Nfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSingular_Nsfw_Nfts_By_PkArgs = {
  nft_id: Scalars['String']
}

/** subscription root */
export type Subscription_RootSingular_Verified_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Verified_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<Singular_Verified_Collections_Order_By>>
  where?: InputMaybe<Singular_Verified_Collections_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSingular_Verified_Collections_By_PkArgs = {
  collection_id: Scalars['String']
}

/** subscription root */
export type Subscription_RootSystemArgs = {
  distinct_on?: InputMaybe<Array<System_Select_Column>>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  order_by?: InputMaybe<Array<System_Order_By>>
  where?: InputMaybe<System_Bool_Exp>
}

/** subscription root */
export type Subscription_RootSystem_By_PkArgs = {
  purchaseEnabled: Scalars['Boolean']
}

/** columns and relationships of "system" */
export type System = {
  __typename?: 'system'
  purchaseEnabled: Scalars['Boolean']
}

/** Boolean expression to filter rows from the table "system". All fields are combined with a logical 'AND'. */
export type System_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<System_Bool_Exp>>>
  _not?: InputMaybe<System_Bool_Exp>
  _or?: InputMaybe<Array<InputMaybe<System_Bool_Exp>>>
  purchaseEnabled?: InputMaybe<Boolean_Comparison_Exp>
}

/** unique or primary key constraints on table "system" */
export enum System_Constraint {
  /** unique or primary key constraint */
  SystemPkey = 'system_pkey',
}

/** response of any mutation on the table "system" */
export type System_Mutation_Response = {
  __typename?: 'system_mutation_response'
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int']
  /** data of the affected rows by the mutation */
  returning: Array<System>
}

/** on conflict condition type for table "system" */
export type System_On_Conflict = {
  constraint: System_Constraint
  update_columns: Array<System_Update_Column>
  where?: InputMaybe<System_Bool_Exp>
}

/** ordering options when selecting data from "system" */
export type System_Order_By = {
  purchaseEnabled?: InputMaybe<Order_By>
}

/** primary key columns input for table: "system" */
export type System_Pk_Columns_Input = {
  purchaseEnabled: Scalars['Boolean']
}

/** select columns of table "system" */
export enum System_Select_Column {
  /** column name */
  PurchaseEnabled = 'purchaseEnabled',
}

/** input type for updating data in table "system" */
export type System_Set_Input = {
  purchaseEnabled?: InputMaybe<Scalars['Boolean']>
}

/** update columns of table "system" */
export enum System_Update_Column {
  /** column name */
  PurchaseEnabled = 'purchaseEnabled',
}

/** expression to compare columns of type timestamptz. All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>
  _gt?: InputMaybe<Scalars['timestamptz']>
  _gte?: InputMaybe<Scalars['timestamptz']>
  _in?: InputMaybe<Array<Scalars['timestamptz']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['timestamptz']>
  _lte?: InputMaybe<Scalars['timestamptz']>
  _neq?: InputMaybe<Scalars['timestamptz']>
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>
}

export type NftsQueryVariables = Exact<{
  addresses?: InputMaybe<Array<Scalars['String']> | Scalars['String']>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}>

export type NftsQuery = {
  __typename?: 'query_root'
  nfts: Array<{
    __typename?: 'nfts'
    id: string
    metadata_name?: string | null
    metadata_description?: string | null
    metadata_animation_url?: string | null
    metadata_image?: string | null
    sn: string
    collection: { __typename?: 'collections'; id: string; name: string; max: number }
  }>
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
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
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
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'offset' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
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
                            name: { kind: 'Name', value: '_in' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'addresses' } },
                          },
                        ],
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'burned' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: '_eq' },
                            value: { kind: 'StringValue', value: '', block: false },
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
                { kind: 'Field', name: { kind: 'Name', value: 'metadata_name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata_description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata_animation_url' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata_image' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sn' } },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NftsQuery, NftsQueryVariables>
