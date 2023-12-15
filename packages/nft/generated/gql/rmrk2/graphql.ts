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
  bigint: { input: any; output: any }
  jsonb: { input: any; output: any }
  numeric: { input: any; output: any }
  smallint: { input: any; output: any }
  timestamptz: { input: any; output: any }
}

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>
  _gt?: InputMaybe<Scalars['Boolean']['input']>
  _gte?: InputMaybe<Scalars['Boolean']['input']>
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['Boolean']['input']>
  _lte?: InputMaybe<Scalars['Boolean']['input']>
  _neq?: InputMaybe<Scalars['Boolean']['input']>
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>
}

/** Boolean expression to compare columns of type "Float". All fields are combined with logical 'AND'. */
export type Float_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Float']['input']>
  _gt?: InputMaybe<Scalars['Float']['input']>
  _gte?: InputMaybe<Scalars['Float']['input']>
  _in?: InputMaybe<Array<Scalars['Float']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['Float']['input']>
  _lte?: InputMaybe<Scalars['Float']['input']>
  _neq?: InputMaybe<Scalars['Float']['input']>
  _nin?: InputMaybe<Array<Scalars['Float']['input']>>
}

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>
  _gt?: InputMaybe<Scalars['Int']['input']>
  _gte?: InputMaybe<Scalars['Int']['input']>
  _in?: InputMaybe<Array<Scalars['Int']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['Int']['input']>
  _lte?: InputMaybe<Scalars['Int']['input']>
  _neq?: InputMaybe<Scalars['Int']['input']>
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>
  _gt?: InputMaybe<Scalars['String']['input']>
  _gte?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>
  _in?: InputMaybe<Array<Scalars['String']['input']>>
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>
  _lt?: InputMaybe<Scalars['String']['input']>
  _lte?: InputMaybe<Scalars['String']['input']>
  _neq?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>
  _nin?: InputMaybe<Array<Scalars['String']['input']>>
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "base_themes" */
export type Base_Themes = {
  __typename?: 'base_themes'
  id: Scalars['String']['output']
  /** An array relationship */
  resources_base_themes: Array<Resources_Base_Themes>
  theme_color_1?: Maybe<Scalars['String']['output']>
  theme_color_2?: Maybe<Scalars['String']['output']>
  theme_color_3?: Maybe<Scalars['String']['output']>
  theme_color_4?: Maybe<Scalars['String']['output']>
}

/** columns and relationships of "base_themes" */
export type Base_ThemesResources_Base_ThemesArgs = {
  distinct_on?: InputMaybe<Array<Resources_Base_Themes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Base_Themes_Order_By>>
  where?: InputMaybe<Resources_Base_Themes_Bool_Exp>
}

/** Boolean expression to filter rows from the table "base_themes". All fields are combined with a logical 'AND'. */
export type Base_Themes_Bool_Exp = {
  _and?: InputMaybe<Array<Base_Themes_Bool_Exp>>
  _not?: InputMaybe<Base_Themes_Bool_Exp>
  _or?: InputMaybe<Array<Base_Themes_Bool_Exp>>
  id?: InputMaybe<String_Comparison_Exp>
  resources_base_themes?: InputMaybe<Resources_Base_Themes_Bool_Exp>
  theme_color_1?: InputMaybe<String_Comparison_Exp>
  theme_color_2?: InputMaybe<String_Comparison_Exp>
  theme_color_3?: InputMaybe<String_Comparison_Exp>
  theme_color_4?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "base_themes". */
export type Base_Themes_Order_By = {
  id?: InputMaybe<Order_By>
  resources_base_themes_aggregate?: InputMaybe<Resources_Base_Themes_Aggregate_Order_By>
  theme_color_1?: InputMaybe<Order_By>
  theme_color_2?: InputMaybe<Order_By>
  theme_color_3?: InputMaybe<Order_By>
  theme_color_4?: InputMaybe<Order_By>
}

/** select columns of table "base_themes" */
export enum Base_Themes_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  ThemeColor_1 = 'theme_color_1',
  /** column name */
  ThemeColor_2 = 'theme_color_2',
  /** column name */
  ThemeColor_3 = 'theme_color_3',
  /** column name */
  ThemeColor_4 = 'theme_color_4',
}

/** columns and relationships of "bases" */
export type Bases = {
  __typename?: 'bases'
  block: Scalars['Int']['output']
  /** An array relationship */
  changes: Array<Changes>
  /** An aggregate relationship */
  changes_aggregate: Changes_Aggregate
  id: Scalars['String']['output']
  issuer: Scalars['String']['output']
  metadata?: Maybe<Scalars['String']['output']>
  /** An array relationship */
  parts: Array<Parts>
  /** An aggregate relationship */
  parts_aggregate: Parts_Aggregate
  symbol: Scalars['String']['output']
  type: Scalars['String']['output']
}

/** columns and relationships of "bases" */
export type BasesChangesArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

/** columns and relationships of "bases" */
export type BasesChanges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

/** columns and relationships of "bases" */
export type BasesPartsArgs = {
  distinct_on?: InputMaybe<Array<Parts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Parts_Order_By>>
  where?: InputMaybe<Parts_Bool_Exp>
}

/** columns and relationships of "bases" */
export type BasesParts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Parts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Parts_Order_By>>
  where?: InputMaybe<Parts_Bool_Exp>
}

/** aggregated selection of "bases" */
export type Bases_Aggregate = {
  __typename?: 'bases_aggregate'
  aggregate?: Maybe<Bases_Aggregate_Fields>
  nodes: Array<Bases>
}

/** aggregate fields of "bases" */
export type Bases_Aggregate_Fields = {
  __typename?: 'bases_aggregate_fields'
  avg?: Maybe<Bases_Avg_Fields>
  count: Scalars['Int']['output']
  max?: Maybe<Bases_Max_Fields>
  min?: Maybe<Bases_Min_Fields>
  stddev?: Maybe<Bases_Stddev_Fields>
  stddev_pop?: Maybe<Bases_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Bases_Stddev_Samp_Fields>
  sum?: Maybe<Bases_Sum_Fields>
  var_pop?: Maybe<Bases_Var_Pop_Fields>
  var_samp?: Maybe<Bases_Var_Samp_Fields>
  variance?: Maybe<Bases_Variance_Fields>
}

/** aggregate fields of "bases" */
export type Bases_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bases_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** aggregate avg on columns */
export type Bases_Avg_Fields = {
  __typename?: 'bases_avg_fields'
  block?: Maybe<Scalars['Float']['output']>
}

/** Boolean expression to filter rows from the table "bases". All fields are combined with a logical 'AND'. */
export type Bases_Bool_Exp = {
  _and?: InputMaybe<Array<Bases_Bool_Exp>>
  _not?: InputMaybe<Bases_Bool_Exp>
  _or?: InputMaybe<Array<Bases_Bool_Exp>>
  block?: InputMaybe<Int_Comparison_Exp>
  changes?: InputMaybe<Changes_Bool_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  issuer?: InputMaybe<String_Comparison_Exp>
  metadata?: InputMaybe<String_Comparison_Exp>
  parts?: InputMaybe<Parts_Bool_Exp>
  symbol?: InputMaybe<String_Comparison_Exp>
  type?: InputMaybe<String_Comparison_Exp>
}

/** aggregate max on columns */
export type Bases_Max_Fields = {
  __typename?: 'bases_max_fields'
  block?: Maybe<Scalars['Int']['output']>
  id?: Maybe<Scalars['String']['output']>
  issuer?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
  type?: Maybe<Scalars['String']['output']>
}

/** aggregate min on columns */
export type Bases_Min_Fields = {
  __typename?: 'bases_min_fields'
  block?: Maybe<Scalars['Int']['output']>
  id?: Maybe<Scalars['String']['output']>
  issuer?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
  type?: Maybe<Scalars['String']['output']>
}

/** Ordering options when selecting data from "bases". */
export type Bases_Order_By = {
  block?: InputMaybe<Order_By>
  changes_aggregate?: InputMaybe<Changes_Aggregate_Order_By>
  id?: InputMaybe<Order_By>
  issuer?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  parts_aggregate?: InputMaybe<Parts_Aggregate_Order_By>
  symbol?: InputMaybe<Order_By>
  type?: InputMaybe<Order_By>
}

/** select columns of table "bases" */
export enum Bases_Select_Column {
  /** column name */
  Block = 'block',
  /** column name */
  Id = 'id',
  /** column name */
  Issuer = 'issuer',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Symbol = 'symbol',
  /** column name */
  Type = 'type',
}

/** aggregate stddev on columns */
export type Bases_Stddev_Fields = {
  __typename?: 'bases_stddev_fields'
  block?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_pop on columns */
export type Bases_Stddev_Pop_Fields = {
  __typename?: 'bases_stddev_pop_fields'
  block?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_samp on columns */
export type Bases_Stddev_Samp_Fields = {
  __typename?: 'bases_stddev_samp_fields'
  block?: Maybe<Scalars['Float']['output']>
}

/** aggregate sum on columns */
export type Bases_Sum_Fields = {
  __typename?: 'bases_sum_fields'
  block?: Maybe<Scalars['Int']['output']>
}

/** aggregate var_pop on columns */
export type Bases_Var_Pop_Fields = {
  __typename?: 'bases_var_pop_fields'
  block?: Maybe<Scalars['Float']['output']>
}

/** aggregate var_samp on columns */
export type Bases_Var_Samp_Fields = {
  __typename?: 'bases_var_samp_fields'
  block?: Maybe<Scalars['Float']['output']>
}

/** aggregate variance on columns */
export type Bases_Variance_Fields = {
  __typename?: 'bases_variance_fields'
  block?: Maybe<Scalars['Float']['output']>
}

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>
  _gt?: InputMaybe<Scalars['bigint']['input']>
  _gte?: InputMaybe<Scalars['bigint']['input']>
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['bigint']['input']>
  _lte?: InputMaybe<Scalars['bigint']['input']>
  _neq?: InputMaybe<Scalars['bigint']['input']>
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>
}

/** columns and relationships of "changes" */
export type Changes = {
  __typename?: 'changes'
  block: Scalars['Int']['output']
  caller: Scalars['String']['output']
  created_at: Scalars['timestamptz']['output']
  extraTransfers?: Maybe<Scalars['jsonb']['output']>
  field: Scalars['String']['output']
  id: Scalars['Int']['output']
  new: Scalars['String']['output']
  /** An object relationship */
  nft?: Maybe<Nfts>
  /** An object relationship */
  nftclass?: Maybe<Collections>
  old: Scalars['String']['output']
  opType: Scalars['String']['output']
  ref_id: Scalars['String']['output']
}

/** columns and relationships of "changes" */
export type ChangesExtraTransfersArgs = {
  path?: InputMaybe<Scalars['String']['input']>
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
  count: Scalars['Int']['output']
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
  distinct?: InputMaybe<Scalars['Boolean']['input']>
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
  block?: Maybe<Scalars['Float']['output']>
  id?: Maybe<Scalars['Float']['output']>
}

/** order by avg() on columns of table "changes" */
export type Changes_Avg_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "changes". All fields are combined with a logical 'AND'. */
export type Changes_Bool_Exp = {
  _and?: InputMaybe<Array<Changes_Bool_Exp>>
  _not?: InputMaybe<Changes_Bool_Exp>
  _or?: InputMaybe<Array<Changes_Bool_Exp>>
  block?: InputMaybe<Int_Comparison_Exp>
  caller?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  extraTransfers?: InputMaybe<Jsonb_Comparison_Exp>
  field?: InputMaybe<String_Comparison_Exp>
  id?: InputMaybe<Int_Comparison_Exp>
  new?: InputMaybe<String_Comparison_Exp>
  nft?: InputMaybe<Nfts_Bool_Exp>
  nftclass?: InputMaybe<Collections_Bool_Exp>
  old?: InputMaybe<String_Comparison_Exp>
  opType?: InputMaybe<String_Comparison_Exp>
  ref_id?: InputMaybe<String_Comparison_Exp>
}

/** columns and relationships of "changes_collection" */
export type Changes_Collection = {
  __typename?: 'changes_collection'
  block: Scalars['Int']['output']
  caller: Scalars['String']['output']
  /** An object relationship */
  collection?: Maybe<Collections>
  created_at: Scalars['timestamptz']['output']
  field: Scalars['String']['output']
  id: Scalars['Int']['output']
  new: Scalars['String']['output']
  old: Scalars['String']['output']
  opType: Scalars['String']['output']
  ref_id: Scalars['String']['output']
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

/** order by avg() on columns of table "changes_collection" */
export type Changes_Collection_Avg_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "changes_collection". All fields are combined with a logical 'AND'. */
export type Changes_Collection_Bool_Exp = {
  _and?: InputMaybe<Array<Changes_Collection_Bool_Exp>>
  _not?: InputMaybe<Changes_Collection_Bool_Exp>
  _or?: InputMaybe<Array<Changes_Collection_Bool_Exp>>
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

/** Ordering options when selecting data from "changes_collection". */
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

/** order by stddev() on columns of table "changes_collection" */
export type Changes_Collection_Stddev_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** order by stddev_pop() on columns of table "changes_collection" */
export type Changes_Collection_Stddev_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** order by stddev_samp() on columns of table "changes_collection" */
export type Changes_Collection_Stddev_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** order by sum() on columns of table "changes_collection" */
export type Changes_Collection_Sum_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** order by var_pop() on columns of table "changes_collection" */
export type Changes_Collection_Var_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** order by var_samp() on columns of table "changes_collection" */
export type Changes_Collection_Var_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** order by variance() on columns of table "changes_collection" */
export type Changes_Collection_Variance_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate max on columns */
export type Changes_Max_Fields = {
  __typename?: 'changes_max_fields'
  block?: Maybe<Scalars['Int']['output']>
  caller?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  field?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['Int']['output']>
  new?: Maybe<Scalars['String']['output']>
  old?: Maybe<Scalars['String']['output']>
  opType?: Maybe<Scalars['String']['output']>
  ref_id?: Maybe<Scalars['String']['output']>
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
  block?: Maybe<Scalars['Int']['output']>
  caller?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  field?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['Int']['output']>
  new?: Maybe<Scalars['String']['output']>
  old?: Maybe<Scalars['String']['output']>
  opType?: Maybe<Scalars['String']['output']>
  ref_id?: Maybe<Scalars['String']['output']>
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

/** Ordering options when selecting data from "changes". */
export type Changes_Order_By = {
  block?: InputMaybe<Order_By>
  caller?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  extraTransfers?: InputMaybe<Order_By>
  field?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  new?: InputMaybe<Order_By>
  nft?: InputMaybe<Nfts_Order_By>
  nftclass?: InputMaybe<Collections_Order_By>
  old?: InputMaybe<Order_By>
  opType?: InputMaybe<Order_By>
  ref_id?: InputMaybe<Order_By>
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
  ExtraTransfers = 'extraTransfers',
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
  block?: Maybe<Scalars['Float']['output']>
  id?: Maybe<Scalars['Float']['output']>
}

/** order by stddev() on columns of table "changes" */
export type Changes_Stddev_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Changes_Stddev_Pop_Fields = {
  __typename?: 'changes_stddev_pop_fields'
  block?: Maybe<Scalars['Float']['output']>
  id?: Maybe<Scalars['Float']['output']>
}

/** order by stddev_pop() on columns of table "changes" */
export type Changes_Stddev_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Changes_Stddev_Samp_Fields = {
  __typename?: 'changes_stddev_samp_fields'
  block?: Maybe<Scalars['Float']['output']>
  id?: Maybe<Scalars['Float']['output']>
}

/** order by stddev_samp() on columns of table "changes" */
export type Changes_Stddev_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Changes_Sum_Fields = {
  __typename?: 'changes_sum_fields'
  block?: Maybe<Scalars['Int']['output']>
  id?: Maybe<Scalars['Int']['output']>
}

/** order by sum() on columns of table "changes" */
export type Changes_Sum_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Changes_Var_Pop_Fields = {
  __typename?: 'changes_var_pop_fields'
  block?: Maybe<Scalars['Float']['output']>
  id?: Maybe<Scalars['Float']['output']>
}

/** order by var_pop() on columns of table "changes" */
export type Changes_Var_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Changes_Var_Samp_Fields = {
  __typename?: 'changes_var_samp_fields'
  block?: Maybe<Scalars['Float']['output']>
  id?: Maybe<Scalars['Float']['output']>
}

/** order by var_samp() on columns of table "changes" */
export type Changes_Var_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Changes_Variance_Fields = {
  __typename?: 'changes_variance_fields'
  block?: Maybe<Scalars['Float']['output']>
  id?: Maybe<Scalars['Float']['output']>
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
  collection_id: Scalars['String']['output']
  created_at: Scalars['timestamptz']['output']
  image: Scalars['String']['output']
}

/** Boolean expression to filter rows from the table "collection_banners". All fields are combined with a logical 'AND'. */
export type Collection_Banners_Bool_Exp = {
  _and?: InputMaybe<Array<Collection_Banners_Bool_Exp>>
  _not?: InputMaybe<Collection_Banners_Bool_Exp>
  _or?: InputMaybe<Array<Collection_Banners_Bool_Exp>>
  collection?: InputMaybe<Collections_Bool_Exp>
  collection_id?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  image?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "collection_banners". */
export type Collection_Banners_Order_By = {
  collection?: InputMaybe<Collections_Order_By>
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  image?: InputMaybe<Order_By>
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
  banners?: Maybe<Collection_Banners>
  block: Scalars['Int']['output']
  /** An array relationship */
  changes_collection: Array<Changes_Collection>
  id: Scalars['String']['output']
  issuer: Scalars['String']['output']
  max: Scalars['Int']['output']
  metadata: Scalars['String']['output']
  metadata_content_type?: Maybe<Scalars['String']['output']>
  metadata_description?: Maybe<Scalars['String']['output']>
  metadata_image?: Maybe<Scalars['String']['output']>
  metadata_name?: Maybe<Scalars['String']['output']>
  /** An array relationship */
  nfts: Array<Nfts>
  /** An aggregate relationship */
  nfts_aggregate: Nfts_Aggregate
  /** An object relationship */
  nfts_stats?: Maybe<Nfts_Stats>
  /** An array relationship */
  singular_blacklisted_accounts: Array<Singular_Blacklisted_Accounts>
  /** An array relationship */
  singular_blacklisted_collections: Array<Singular_Blacklisted_Collections>
  /** An array relationship */
  singular_curated: Array<Singular_Curated_Collections>
  /** An aggregate relationship */
  singular_curated_aggregate: Singular_Curated_Collections_Aggregate
  /** An array relationship */
  singular_nsfw_collections: Array<Singular_Nsfw_Collections>
  /** An aggregate relationship */
  singular_nsfw_collections_aggregate: Singular_Nsfw_Collections_Aggregate
  /** An array relationship */
  singular_verified_collections: Array<Singular_Verified_Collections>
  /** An aggregate relationship */
  singular_verified_collections_aggregate: Singular_Verified_Collections_Aggregate
  symbol: Scalars['String']['output']
}

/** columns and relationships of "collections" */
export type CollectionsChanges_CollectionArgs = {
  distinct_on?: InputMaybe<Array<Changes_Collection_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Collection_Order_By>>
  where?: InputMaybe<Changes_Collection_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsNftsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsNfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Blacklisted_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Blacklisted_Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Blacklisted_Accounts_Order_By>>
  where?: InputMaybe<Singular_Blacklisted_Accounts_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Blacklisted_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Blacklisted_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Blacklisted_Collections_Order_By>>
  where?: InputMaybe<Singular_Blacklisted_Collections_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_CuratedArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Collections_Order_By>>
  where?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Curated_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Collections_Order_By>>
  where?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Nsfw_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Collections_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Nsfw_Collections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Collections_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Verified_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Verified_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Verified_Collections_Order_By>>
  where?: InputMaybe<Singular_Verified_Collections_Bool_Exp>
}

/** columns and relationships of "collections" */
export type CollectionsSingular_Verified_Collections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Verified_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
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
  count: Scalars['Int']['output']
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
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** aggregate avg on columns */
export type Collections_Avg_Fields = {
  __typename?: 'collections_avg_fields'
  block?: Maybe<Scalars['Float']['output']>
  max?: Maybe<Scalars['Float']['output']>
}

/** Boolean expression to filter rows from the table "collections". All fields are combined with a logical 'AND'. */
export type Collections_Bool_Exp = {
  _and?: InputMaybe<Array<Collections_Bool_Exp>>
  _not?: InputMaybe<Collections_Bool_Exp>
  _or?: InputMaybe<Array<Collections_Bool_Exp>>
  banners?: InputMaybe<Collection_Banners_Bool_Exp>
  block?: InputMaybe<Int_Comparison_Exp>
  changes_collection?: InputMaybe<Changes_Collection_Bool_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  issuer?: InputMaybe<String_Comparison_Exp>
  max?: InputMaybe<Int_Comparison_Exp>
  metadata?: InputMaybe<String_Comparison_Exp>
  metadata_content_type?: InputMaybe<String_Comparison_Exp>
  metadata_description?: InputMaybe<String_Comparison_Exp>
  metadata_image?: InputMaybe<String_Comparison_Exp>
  metadata_name?: InputMaybe<String_Comparison_Exp>
  nfts?: InputMaybe<Nfts_Bool_Exp>
  nfts_stats?: InputMaybe<Nfts_Stats_Bool_Exp>
  singular_blacklisted_accounts?: InputMaybe<Singular_Blacklisted_Accounts_Bool_Exp>
  singular_blacklisted_collections?: InputMaybe<Singular_Blacklisted_Collections_Bool_Exp>
  singular_curated?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
  singular_nsfw_collections?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
  singular_verified_collections?: InputMaybe<Singular_Verified_Collections_Bool_Exp>
  symbol?: InputMaybe<String_Comparison_Exp>
}

/** aggregate max on columns */
export type Collections_Max_Fields = {
  __typename?: 'collections_max_fields'
  block?: Maybe<Scalars['Int']['output']>
  id?: Maybe<Scalars['String']['output']>
  issuer?: Maybe<Scalars['String']['output']>
  max?: Maybe<Scalars['Int']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_content_type?: Maybe<Scalars['String']['output']>
  metadata_description?: Maybe<Scalars['String']['output']>
  metadata_image?: Maybe<Scalars['String']['output']>
  metadata_name?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
}

/** aggregate min on columns */
export type Collections_Min_Fields = {
  __typename?: 'collections_min_fields'
  block?: Maybe<Scalars['Int']['output']>
  id?: Maybe<Scalars['String']['output']>
  issuer?: Maybe<Scalars['String']['output']>
  max?: Maybe<Scalars['Int']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_content_type?: Maybe<Scalars['String']['output']>
  metadata_description?: Maybe<Scalars['String']['output']>
  metadata_image?: Maybe<Scalars['String']['output']>
  metadata_name?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
}

/** Ordering options when selecting data from "collections". */
export type Collections_Order_By = {
  banners?: InputMaybe<Collection_Banners_Order_By>
  block?: InputMaybe<Order_By>
  changes_collection_aggregate?: InputMaybe<Changes_Collection_Aggregate_Order_By>
  id?: InputMaybe<Order_By>
  issuer?: InputMaybe<Order_By>
  max?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  metadata_description?: InputMaybe<Order_By>
  metadata_image?: InputMaybe<Order_By>
  metadata_name?: InputMaybe<Order_By>
  nfts_aggregate?: InputMaybe<Nfts_Aggregate_Order_By>
  nfts_stats?: InputMaybe<Nfts_Stats_Order_By>
  singular_blacklisted_accounts_aggregate?: InputMaybe<Singular_Blacklisted_Accounts_Aggregate_Order_By>
  singular_blacklisted_collections_aggregate?: InputMaybe<Singular_Blacklisted_Collections_Aggregate_Order_By>
  singular_curated_aggregate?: InputMaybe<Singular_Curated_Collections_Aggregate_Order_By>
  singular_nsfw_collections_aggregate?: InputMaybe<Singular_Nsfw_Collections_Aggregate_Order_By>
  singular_verified_collections_aggregate?: InputMaybe<Singular_Verified_Collections_Aggregate_Order_By>
  symbol?: InputMaybe<Order_By>
}

/** select columns of table "collections" */
export enum Collections_Select_Column {
  /** column name */
  Block = 'block',
  /** column name */
  Id = 'id',
  /** column name */
  Issuer = 'issuer',
  /** column name */
  Max = 'max',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MetadataContentType = 'metadata_content_type',
  /** column name */
  MetadataDescription = 'metadata_description',
  /** column name */
  MetadataImage = 'metadata_image',
  /** column name */
  MetadataName = 'metadata_name',
  /** column name */
  Symbol = 'symbol',
}

/** aggregate stddev on columns */
export type Collections_Stddev_Fields = {
  __typename?: 'collections_stddev_fields'
  block?: Maybe<Scalars['Float']['output']>
  max?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_pop on columns */
export type Collections_Stddev_Pop_Fields = {
  __typename?: 'collections_stddev_pop_fields'
  block?: Maybe<Scalars['Float']['output']>
  max?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_samp on columns */
export type Collections_Stddev_Samp_Fields = {
  __typename?: 'collections_stddev_samp_fields'
  block?: Maybe<Scalars['Float']['output']>
  max?: Maybe<Scalars['Float']['output']>
}

/** aggregate sum on columns */
export type Collections_Sum_Fields = {
  __typename?: 'collections_sum_fields'
  block?: Maybe<Scalars['Int']['output']>
  max?: Maybe<Scalars['Int']['output']>
}

/** aggregate var_pop on columns */
export type Collections_Var_Pop_Fields = {
  __typename?: 'collections_var_pop_fields'
  block?: Maybe<Scalars['Float']['output']>
  max?: Maybe<Scalars['Float']['output']>
}

/** aggregate var_samp on columns */
export type Collections_Var_Samp_Fields = {
  __typename?: 'collections_var_samp_fields'
  block?: Maybe<Scalars['Float']['output']>
  max?: Maybe<Scalars['Float']['output']>
}

/** aggregate variance on columns */
export type Collections_Variance_Fields = {
  __typename?: 'collections_variance_fields'
  block?: Maybe<Scalars['Float']['output']>
  max?: Maybe<Scalars['Float']['output']>
}

/** columns and relationships of "distinct_kanaria_nfts" */
export type Distinct_Kanaria_Nfts = {
  __typename?: 'distinct_kanaria_nfts'
  block?: Maybe<Scalars['Int']['output']>
  burned?: Maybe<Scalars['String']['output']>
  /** An array relationship */
  children: Array<Nfts>
  /** An aggregate relationship */
  children_aggregate: Nfts_Aggregate
  /** An object relationship */
  collection?: Maybe<Collections>
  collectionId?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  equipped_id?: Maybe<Scalars['String']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  id?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_description?: Maybe<Scalars['String']['output']>
  metadata_image?: Maybe<Scalars['String']['output']>
  metadata_name?: Maybe<Scalars['String']['output']>
  metadata_rarity?: Maybe<Scalars['String']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  owner?: Maybe<Scalars['String']['output']>
  pending?: Maybe<Scalars['Boolean']['output']>
  priority?: Maybe<Scalars['jsonb']['output']>
  properties?: Maybe<Scalars['jsonb']['output']>
  /** An array relationship */
  resources: Array<Resources>
  /** An aggregate relationship */
  resources_aggregate: Resources_Aggregate
  rootowner?: Maybe<Scalars['String']['output']>
  sn?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
  transferable?: Maybe<Scalars['Int']['output']>
  tx_block?: Maybe<Scalars['Int']['output']>
  tx_caller?: Maybe<Scalars['String']['output']>
  tx_pending?: Maybe<Scalars['Boolean']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** columns and relationships of "distinct_kanaria_nfts" */
export type Distinct_Kanaria_NftsChildrenArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** columns and relationships of "distinct_kanaria_nfts" */
export type Distinct_Kanaria_NftsChildren_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** columns and relationships of "distinct_kanaria_nfts" */
export type Distinct_Kanaria_NftsPriorityArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "distinct_kanaria_nfts" */
export type Distinct_Kanaria_NftsPropertiesArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "distinct_kanaria_nfts" */
export type Distinct_Kanaria_NftsResourcesArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Order_By>>
  where?: InputMaybe<Resources_Bool_Exp>
}

/** columns and relationships of "distinct_kanaria_nfts" */
export type Distinct_Kanaria_NftsResources_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Order_By>>
  where?: InputMaybe<Resources_Bool_Exp>
}

/** aggregated selection of "distinct_kanaria_nfts" */
export type Distinct_Kanaria_Nfts_Aggregate = {
  __typename?: 'distinct_kanaria_nfts_aggregate'
  aggregate?: Maybe<Distinct_Kanaria_Nfts_Aggregate_Fields>
  nodes: Array<Distinct_Kanaria_Nfts>
}

/** aggregate fields of "distinct_kanaria_nfts" */
export type Distinct_Kanaria_Nfts_Aggregate_Fields = {
  __typename?: 'distinct_kanaria_nfts_aggregate_fields'
  avg?: Maybe<Distinct_Kanaria_Nfts_Avg_Fields>
  count: Scalars['Int']['output']
  max?: Maybe<Distinct_Kanaria_Nfts_Max_Fields>
  min?: Maybe<Distinct_Kanaria_Nfts_Min_Fields>
  stddev?: Maybe<Distinct_Kanaria_Nfts_Stddev_Fields>
  stddev_pop?: Maybe<Distinct_Kanaria_Nfts_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Distinct_Kanaria_Nfts_Stddev_Samp_Fields>
  sum?: Maybe<Distinct_Kanaria_Nfts_Sum_Fields>
  var_pop?: Maybe<Distinct_Kanaria_Nfts_Var_Pop_Fields>
  var_samp?: Maybe<Distinct_Kanaria_Nfts_Var_Samp_Fields>
  variance?: Maybe<Distinct_Kanaria_Nfts_Variance_Fields>
}

/** aggregate fields of "distinct_kanaria_nfts" */
export type Distinct_Kanaria_Nfts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Distinct_Kanaria_Nfts_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** aggregate avg on columns */
export type Distinct_Kanaria_Nfts_Avg_Fields = {
  __typename?: 'distinct_kanaria_nfts_avg_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** Boolean expression to filter rows from the table "distinct_kanaria_nfts". All fields are combined with a logical 'AND'. */
export type Distinct_Kanaria_Nfts_Bool_Exp = {
  _and?: InputMaybe<Array<Distinct_Kanaria_Nfts_Bool_Exp>>
  _not?: InputMaybe<Distinct_Kanaria_Nfts_Bool_Exp>
  _or?: InputMaybe<Array<Distinct_Kanaria_Nfts_Bool_Exp>>
  block?: InputMaybe<Int_Comparison_Exp>
  burned?: InputMaybe<String_Comparison_Exp>
  children?: InputMaybe<Nfts_Bool_Exp>
  collection?: InputMaybe<Collections_Bool_Exp>
  collectionId?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  equipped_id?: InputMaybe<String_Comparison_Exp>
  forsale?: InputMaybe<Bigint_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  metadata?: InputMaybe<String_Comparison_Exp>
  metadata_description?: InputMaybe<String_Comparison_Exp>
  metadata_image?: InputMaybe<String_Comparison_Exp>
  metadata_name?: InputMaybe<String_Comparison_Exp>
  metadata_rarity?: InputMaybe<String_Comparison_Exp>
  metadata_rarity_percentage?: InputMaybe<Float_Comparison_Exp>
  owner?: InputMaybe<String_Comparison_Exp>
  pending?: InputMaybe<Boolean_Comparison_Exp>
  priority?: InputMaybe<Jsonb_Comparison_Exp>
  properties?: InputMaybe<Jsonb_Comparison_Exp>
  resources?: InputMaybe<Resources_Bool_Exp>
  rootowner?: InputMaybe<String_Comparison_Exp>
  sn?: InputMaybe<String_Comparison_Exp>
  symbol?: InputMaybe<String_Comparison_Exp>
  transferable?: InputMaybe<Int_Comparison_Exp>
  tx_block?: InputMaybe<Int_Comparison_Exp>
  tx_caller?: InputMaybe<String_Comparison_Exp>
  tx_pending?: InputMaybe<Boolean_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** aggregate max on columns */
export type Distinct_Kanaria_Nfts_Max_Fields = {
  __typename?: 'distinct_kanaria_nfts_max_fields'
  block?: Maybe<Scalars['Int']['output']>
  burned?: Maybe<Scalars['String']['output']>
  collectionId?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  equipped_id?: Maybe<Scalars['String']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  id?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_description?: Maybe<Scalars['String']['output']>
  metadata_image?: Maybe<Scalars['String']['output']>
  metadata_name?: Maybe<Scalars['String']['output']>
  metadata_rarity?: Maybe<Scalars['String']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  owner?: Maybe<Scalars['String']['output']>
  rootowner?: Maybe<Scalars['String']['output']>
  sn?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
  transferable?: Maybe<Scalars['Int']['output']>
  tx_block?: Maybe<Scalars['Int']['output']>
  tx_caller?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** aggregate min on columns */
export type Distinct_Kanaria_Nfts_Min_Fields = {
  __typename?: 'distinct_kanaria_nfts_min_fields'
  block?: Maybe<Scalars['Int']['output']>
  burned?: Maybe<Scalars['String']['output']>
  collectionId?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  equipped_id?: Maybe<Scalars['String']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  id?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_description?: Maybe<Scalars['String']['output']>
  metadata_image?: Maybe<Scalars['String']['output']>
  metadata_name?: Maybe<Scalars['String']['output']>
  metadata_rarity?: Maybe<Scalars['String']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  owner?: Maybe<Scalars['String']['output']>
  rootowner?: Maybe<Scalars['String']['output']>
  sn?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
  transferable?: Maybe<Scalars['Int']['output']>
  tx_block?: Maybe<Scalars['Int']['output']>
  tx_caller?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** Ordering options when selecting data from "distinct_kanaria_nfts". */
export type Distinct_Kanaria_Nfts_Order_By = {
  block?: InputMaybe<Order_By>
  burned?: InputMaybe<Order_By>
  children_aggregate?: InputMaybe<Nfts_Aggregate_Order_By>
  collection?: InputMaybe<Collections_Order_By>
  collectionId?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  equipped_id?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_description?: InputMaybe<Order_By>
  metadata_image?: InputMaybe<Order_By>
  metadata_name?: InputMaybe<Order_By>
  metadata_rarity?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  pending?: InputMaybe<Order_By>
  priority?: InputMaybe<Order_By>
  properties?: InputMaybe<Order_By>
  resources_aggregate?: InputMaybe<Resources_Aggregate_Order_By>
  rootowner?: InputMaybe<Order_By>
  sn?: InputMaybe<Order_By>
  symbol?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  tx_block?: InputMaybe<Order_By>
  tx_caller?: InputMaybe<Order_By>
  tx_pending?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** select columns of table "distinct_kanaria_nfts" */
export enum Distinct_Kanaria_Nfts_Select_Column {
  /** column name */
  Block = 'block',
  /** column name */
  Burned = 'burned',
  /** column name */
  CollectionId = 'collectionId',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EquippedId = 'equipped_id',
  /** column name */
  Forsale = 'forsale',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MetadataDescription = 'metadata_description',
  /** column name */
  MetadataImage = 'metadata_image',
  /** column name */
  MetadataName = 'metadata_name',
  /** column name */
  MetadataRarity = 'metadata_rarity',
  /** column name */
  MetadataRarityPercentage = 'metadata_rarity_percentage',
  /** column name */
  Owner = 'owner',
  /** column name */
  Pending = 'pending',
  /** column name */
  Priority = 'priority',
  /** column name */
  Properties = 'properties',
  /** column name */
  Rootowner = 'rootowner',
  /** column name */
  Sn = 'sn',
  /** column name */
  Symbol = 'symbol',
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
export type Distinct_Kanaria_Nfts_Stddev_Fields = {
  __typename?: 'distinct_kanaria_nfts_stddev_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_pop on columns */
export type Distinct_Kanaria_Nfts_Stddev_Pop_Fields = {
  __typename?: 'distinct_kanaria_nfts_stddev_pop_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_samp on columns */
export type Distinct_Kanaria_Nfts_Stddev_Samp_Fields = {
  __typename?: 'distinct_kanaria_nfts_stddev_samp_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** aggregate sum on columns */
export type Distinct_Kanaria_Nfts_Sum_Fields = {
  __typename?: 'distinct_kanaria_nfts_sum_fields'
  block?: Maybe<Scalars['Int']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Int']['output']>
  tx_block?: Maybe<Scalars['Int']['output']>
}

/** aggregate var_pop on columns */
export type Distinct_Kanaria_Nfts_Var_Pop_Fields = {
  __typename?: 'distinct_kanaria_nfts_var_pop_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** aggregate var_samp on columns */
export type Distinct_Kanaria_Nfts_Var_Samp_Fields = {
  __typename?: 'distinct_kanaria_nfts_var_samp_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** aggregate variance on columns */
export type Distinct_Kanaria_Nfts_Variance_Fields = {
  __typename?: 'distinct_kanaria_nfts_variance_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_Nfts = {
  __typename?: 'distinct_nfts'
  block?: Maybe<Scalars['Int']['output']>
  burned?: Maybe<Scalars['String']['output']>
  /** An array relationship */
  children: Array<Nfts>
  /** An aggregate relationship */
  children_aggregate: Nfts_Aggregate
  /** An object relationship */
  collection?: Maybe<Collections>
  collectionId?: Maybe<Scalars['String']['output']>
  /** An object relationship */
  dutchie?: Maybe<Dutchie>
  equipped_id?: Maybe<Scalars['String']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  id?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_content_type?: Maybe<Scalars['String']['output']>
  metadata_image?: Maybe<Scalars['String']['output']>
  metadata_name?: Maybe<Scalars['String']['output']>
  metadata_rarity?: Maybe<Scalars['String']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  owner?: Maybe<Scalars['String']['output']>
  pending?: Maybe<Scalars['Boolean']['output']>
  priority?: Maybe<Scalars['jsonb']['output']>
  properties?: Maybe<Scalars['jsonb']['output']>
  /** An array relationship */
  resources: Array<Resources>
  /** An aggregate relationship */
  resources_aggregate: Resources_Aggregate
  rootowner?: Maybe<Scalars['String']['output']>
  /** An array relationship */
  singular_curated: Array<Singular_Curated>
  /** An aggregate relationship */
  singular_curated_aggregate: Singular_Curated_Aggregate
  /** An array relationship */
  singular_nsfw: Array<Singular_Nsfw_Nfts>
  /** An aggregate relationship */
  singular_nsfw_aggregate: Singular_Nsfw_Nfts_Aggregate
  sn?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
  transferable?: Maybe<Scalars['Int']['output']>
  tx_block?: Maybe<Scalars['Int']['output']>
  tx_caller?: Maybe<Scalars['String']['output']>
  tx_pending?: Maybe<Scalars['Boolean']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsChildrenArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsChildren_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsPriorityArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsPropertiesArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsResourcesArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Order_By>>
  where?: InputMaybe<Resources_Bool_Exp>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsResources_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Order_By>>
  where?: InputMaybe<Resources_Bool_Exp>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsSingular_CuratedArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Order_By>>
  where?: InputMaybe<Singular_Curated_Bool_Exp>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsSingular_Curated_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Order_By>>
  where?: InputMaybe<Singular_Curated_Bool_Exp>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsSingular_NsfwArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

/** columns and relationships of "distinct_nfts" */
export type Distinct_NftsSingular_Nsfw_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
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
  count: Scalars['Int']['output']
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
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** aggregate avg on columns */
export type Distinct_Nfts_Avg_Fields = {
  __typename?: 'distinct_nfts_avg_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** Boolean expression to filter rows from the table "distinct_nfts". All fields are combined with a logical 'AND'. */
export type Distinct_Nfts_Bool_Exp = {
  _and?: InputMaybe<Array<Distinct_Nfts_Bool_Exp>>
  _not?: InputMaybe<Distinct_Nfts_Bool_Exp>
  _or?: InputMaybe<Array<Distinct_Nfts_Bool_Exp>>
  block?: InputMaybe<Int_Comparison_Exp>
  burned?: InputMaybe<String_Comparison_Exp>
  children?: InputMaybe<Nfts_Bool_Exp>
  collection?: InputMaybe<Collections_Bool_Exp>
  collectionId?: InputMaybe<String_Comparison_Exp>
  dutchie?: InputMaybe<Dutchie_Bool_Exp>
  equipped_id?: InputMaybe<String_Comparison_Exp>
  forsale?: InputMaybe<Bigint_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  metadata?: InputMaybe<String_Comparison_Exp>
  metadata_content_type?: InputMaybe<String_Comparison_Exp>
  metadata_image?: InputMaybe<String_Comparison_Exp>
  metadata_name?: InputMaybe<String_Comparison_Exp>
  metadata_rarity?: InputMaybe<String_Comparison_Exp>
  metadata_rarity_percentage?: InputMaybe<Float_Comparison_Exp>
  owner?: InputMaybe<String_Comparison_Exp>
  pending?: InputMaybe<Boolean_Comparison_Exp>
  priority?: InputMaybe<Jsonb_Comparison_Exp>
  properties?: InputMaybe<Jsonb_Comparison_Exp>
  resources?: InputMaybe<Resources_Bool_Exp>
  rootowner?: InputMaybe<String_Comparison_Exp>
  singular_curated?: InputMaybe<Singular_Curated_Bool_Exp>
  singular_nsfw?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
  sn?: InputMaybe<String_Comparison_Exp>
  symbol?: InputMaybe<String_Comparison_Exp>
  transferable?: InputMaybe<Int_Comparison_Exp>
  tx_block?: InputMaybe<Int_Comparison_Exp>
  tx_caller?: InputMaybe<String_Comparison_Exp>
  tx_pending?: InputMaybe<Boolean_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** aggregate max on columns */
export type Distinct_Nfts_Max_Fields = {
  __typename?: 'distinct_nfts_max_fields'
  block?: Maybe<Scalars['Int']['output']>
  burned?: Maybe<Scalars['String']['output']>
  collectionId?: Maybe<Scalars['String']['output']>
  equipped_id?: Maybe<Scalars['String']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  id?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_content_type?: Maybe<Scalars['String']['output']>
  metadata_image?: Maybe<Scalars['String']['output']>
  metadata_name?: Maybe<Scalars['String']['output']>
  metadata_rarity?: Maybe<Scalars['String']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  owner?: Maybe<Scalars['String']['output']>
  rootowner?: Maybe<Scalars['String']['output']>
  sn?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
  transferable?: Maybe<Scalars['Int']['output']>
  tx_block?: Maybe<Scalars['Int']['output']>
  tx_caller?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** aggregate min on columns */
export type Distinct_Nfts_Min_Fields = {
  __typename?: 'distinct_nfts_min_fields'
  block?: Maybe<Scalars['Int']['output']>
  burned?: Maybe<Scalars['String']['output']>
  collectionId?: Maybe<Scalars['String']['output']>
  equipped_id?: Maybe<Scalars['String']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  id?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_content_type?: Maybe<Scalars['String']['output']>
  metadata_image?: Maybe<Scalars['String']['output']>
  metadata_name?: Maybe<Scalars['String']['output']>
  metadata_rarity?: Maybe<Scalars['String']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  owner?: Maybe<Scalars['String']['output']>
  rootowner?: Maybe<Scalars['String']['output']>
  sn?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
  transferable?: Maybe<Scalars['Int']['output']>
  tx_block?: Maybe<Scalars['Int']['output']>
  tx_caller?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** Ordering options when selecting data from "distinct_nfts". */
export type Distinct_Nfts_Order_By = {
  block?: InputMaybe<Order_By>
  burned?: InputMaybe<Order_By>
  children_aggregate?: InputMaybe<Nfts_Aggregate_Order_By>
  collection?: InputMaybe<Collections_Order_By>
  collectionId?: InputMaybe<Order_By>
  dutchie?: InputMaybe<Dutchie_Order_By>
  equipped_id?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  metadata_image?: InputMaybe<Order_By>
  metadata_name?: InputMaybe<Order_By>
  metadata_rarity?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  pending?: InputMaybe<Order_By>
  priority?: InputMaybe<Order_By>
  properties?: InputMaybe<Order_By>
  resources_aggregate?: InputMaybe<Resources_Aggregate_Order_By>
  rootowner?: InputMaybe<Order_By>
  singular_curated_aggregate?: InputMaybe<Singular_Curated_Aggregate_Order_By>
  singular_nsfw_aggregate?: InputMaybe<Singular_Nsfw_Nfts_Aggregate_Order_By>
  sn?: InputMaybe<Order_By>
  symbol?: InputMaybe<Order_By>
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
  EquippedId = 'equipped_id',
  /** column name */
  Forsale = 'forsale',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MetadataContentType = 'metadata_content_type',
  /** column name */
  MetadataImage = 'metadata_image',
  /** column name */
  MetadataName = 'metadata_name',
  /** column name */
  MetadataRarity = 'metadata_rarity',
  /** column name */
  MetadataRarityPercentage = 'metadata_rarity_percentage',
  /** column name */
  Owner = 'owner',
  /** column name */
  Pending = 'pending',
  /** column name */
  Priority = 'priority',
  /** column name */
  Properties = 'properties',
  /** column name */
  Rootowner = 'rootowner',
  /** column name */
  Sn = 'sn',
  /** column name */
  Symbol = 'symbol',
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
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_pop on columns */
export type Distinct_Nfts_Stddev_Pop_Fields = {
  __typename?: 'distinct_nfts_stddev_pop_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_samp on columns */
export type Distinct_Nfts_Stddev_Samp_Fields = {
  __typename?: 'distinct_nfts_stddev_samp_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** aggregate sum on columns */
export type Distinct_Nfts_Sum_Fields = {
  __typename?: 'distinct_nfts_sum_fields'
  block?: Maybe<Scalars['Int']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Int']['output']>
  tx_block?: Maybe<Scalars['Int']['output']>
}

/** aggregate var_pop on columns */
export type Distinct_Nfts_Var_Pop_Fields = {
  __typename?: 'distinct_nfts_var_pop_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** aggregate var_samp on columns */
export type Distinct_Nfts_Var_Samp_Fields = {
  __typename?: 'distinct_nfts_var_samp_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/** aggregate variance on columns */
export type Distinct_Nfts_Variance_Fields = {
  __typename?: 'distinct_nfts_variance_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  tx_block?: Maybe<Scalars['Float']['output']>
}

/**
 * nfts dutchi auction table
 *
 *
 * columns and relationships of "dutchie"
 *
 */
export type Dutchie = {
  __typename?: 'dutchie'
  active: Scalars['Boolean']['output']
  current_price: Scalars['bigint']['output']
  id: Scalars['Int']['output']
  initial_price: Scalars['bigint']['output']
  interval?: Maybe<Scalars['smallint']['output']>
  min_price: Scalars['bigint']['output']
  /** An object relationship */
  nft?: Maybe<Nfts>
  nft_id: Scalars['String']['output']
  reduction: Scalars['numeric']['output']
  sold: Scalars['Boolean']['output']
  start_time: Scalars['timestamptz']['output']
  tick: Scalars['Int']['output']
}

/** Boolean expression to filter rows from the table "dutchie". All fields are combined with a logical 'AND'. */
export type Dutchie_Bool_Exp = {
  _and?: InputMaybe<Array<Dutchie_Bool_Exp>>
  _not?: InputMaybe<Dutchie_Bool_Exp>
  _or?: InputMaybe<Array<Dutchie_Bool_Exp>>
  active?: InputMaybe<Boolean_Comparison_Exp>
  current_price?: InputMaybe<Bigint_Comparison_Exp>
  id?: InputMaybe<Int_Comparison_Exp>
  initial_price?: InputMaybe<Bigint_Comparison_Exp>
  interval?: InputMaybe<Smallint_Comparison_Exp>
  min_price?: InputMaybe<Bigint_Comparison_Exp>
  nft?: InputMaybe<Nfts_Bool_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
  reduction?: InputMaybe<Numeric_Comparison_Exp>
  sold?: InputMaybe<Boolean_Comparison_Exp>
  start_time?: InputMaybe<Timestamptz_Comparison_Exp>
  tick?: InputMaybe<Int_Comparison_Exp>
}

/** Ordering options when selecting data from "dutchie". */
export type Dutchie_Order_By = {
  active?: InputMaybe<Order_By>
  current_price?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  initial_price?: InputMaybe<Order_By>
  interval?: InputMaybe<Order_By>
  min_price?: InputMaybe<Order_By>
  nft?: InputMaybe<Nfts_Order_By>
  nft_id?: InputMaybe<Order_By>
  reduction?: InputMaybe<Order_By>
  sold?: InputMaybe<Order_By>
  start_time?: InputMaybe<Order_By>
  tick?: InputMaybe<Order_By>
}

/** select columns of table "dutchie" */
export enum Dutchie_Select_Column {
  /** column name */
  Active = 'active',
  /** column name */
  CurrentPrice = 'current_price',
  /** column name */
  Id = 'id',
  /** column name */
  InitialPrice = 'initial_price',
  /** column name */
  Interval = 'interval',
  /** column name */
  MinPrice = 'min_price',
  /** column name */
  NftId = 'nft_id',
  /** column name */
  Reduction = 'reduction',
  /** column name */
  Sold = 'sold',
  /** column name */
  StartTime = 'start_time',
  /** column name */
  Tick = 'tick',
}

/** columns and relationships of "gems_enabled" */
export type Gems_Enabled = {
  __typename?: 'gems_enabled'
  enabled: Scalars['Boolean']['output']
  id: Scalars['String']['output']
  /** An object relationship */
  nft?: Maybe<Nfts>
}

/** Boolean expression to filter rows from the table "gems_enabled". All fields are combined with a logical 'AND'. */
export type Gems_Enabled_Bool_Exp = {
  _and?: InputMaybe<Array<Gems_Enabled_Bool_Exp>>
  _not?: InputMaybe<Gems_Enabled_Bool_Exp>
  _or?: InputMaybe<Array<Gems_Enabled_Bool_Exp>>
  enabled?: InputMaybe<Boolean_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  nft?: InputMaybe<Nfts_Bool_Exp>
}

/** Ordering options when selecting data from "gems_enabled". */
export type Gems_Enabled_Order_By = {
  enabled?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  nft?: InputMaybe<Nfts_Order_By>
}

/** select columns of table "gems_enabled" */
export enum Gems_Enabled_Select_Column {
  /** column name */
  Enabled = 'enabled',
  /** column name */
  Id = 'id',
}

export type Get_Ordered_Changes_Stats_Args = {
  optype?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "hatched_birds" */
export type Hatched_Birds = {
  __typename?: 'hatched_birds'
  id: Scalars['String']['output']
}

/** Boolean expression to filter rows from the table "hatched_birds". All fields are combined with a logical 'AND'. */
export type Hatched_Birds_Bool_Exp = {
  _and?: InputMaybe<Array<Hatched_Birds_Bool_Exp>>
  _not?: InputMaybe<Hatched_Birds_Bool_Exp>
  _or?: InputMaybe<Array<Hatched_Birds_Bool_Exp>>
  id?: InputMaybe<String_Comparison_Exp>
}

/** input type for inserting data into table "hatched_birds" */
export type Hatched_Birds_Insert_Input = {
  id?: InputMaybe<Scalars['String']['input']>
}

/** response of any mutation on the table "hatched_birds" */
export type Hatched_Birds_Mutation_Response = {
  __typename?: 'hatched_birds_mutation_response'
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output']
  /** data from the rows affected by the mutation */
  returning: Array<Hatched_Birds>
}

/** Ordering options when selecting data from "hatched_birds". */
export type Hatched_Birds_Order_By = {
  id?: InputMaybe<Order_By>
}

/** select columns of table "hatched_birds" */
export enum Hatched_Birds_Select_Column {
  /** column name */
  Id = 'id',
}

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>
  _eq?: InputMaybe<Scalars['jsonb']['input']>
  _gt?: InputMaybe<Scalars['jsonb']['input']>
  _gte?: InputMaybe<Scalars['jsonb']['input']>
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['jsonb']['input']>
  _lte?: InputMaybe<Scalars['jsonb']['input']>
  _neq?: InputMaybe<Scalars['jsonb']['input']>
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root'
  /** insert data into the table: "hatched_birds" */
  insert_hatched_birds?: Maybe<Hatched_Birds_Mutation_Response>
  /** insert a single row into the table: "hatched_birds" */
  insert_hatched_birds_one?: Maybe<Hatched_Birds>
}

/** mutation root */
export type Mutation_RootInsert_Hatched_BirdsArgs = {
  objects: Array<Hatched_Birds_Insert_Input>
}

/** mutation root */
export type Mutation_RootInsert_Hatched_Birds_OneArgs = {
  object: Hatched_Birds_Insert_Input
}

/** columns and relationships of "nfts" */
export type Nfts = {
  __typename?: 'nfts'
  block: Scalars['Int']['output']
  burned: Scalars['String']['output']
  /** An array relationship */
  changes: Array<Changes>
  /** An aggregate relationship */
  changes_aggregate: Changes_Aggregate
  /** An array relationship */
  children: Array<Nfts>
  /** An aggregate relationship */
  children_aggregate: Nfts_Aggregate
  /** An object relationship */
  collection?: Maybe<Collections>
  collectionId: Scalars['String']['output']
  created_at: Scalars['timestamptz']['output']
  /** An object relationship */
  dutchie?: Maybe<Dutchie>
  /** An object relationship */
  equipped?: Maybe<Parts>
  equipped_id?: Maybe<Scalars['String']['output']>
  forsale: Scalars['bigint']['output']
  /** An object relationship */
  gem_enabled?: Maybe<Gems_Enabled>
  id: Scalars['String']['output']
  id_md5?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_content_type?: Maybe<Scalars['String']['output']>
  metadata_description?: Maybe<Scalars['String']['output']>
  metadata_image?: Maybe<Scalars['String']['output']>
  metadata_name?: Maybe<Scalars['String']['output']>
  metadata_properties?: Maybe<Scalars['jsonb']['output']>
  metadata_rarity?: Maybe<Scalars['String']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  owner: Scalars['String']['output']
  /** An object relationship */
  parent?: Maybe<Nfts>
  pending?: Maybe<Scalars['Boolean']['output']>
  priority: Scalars['jsonb']['output']
  properties?: Maybe<Scalars['jsonb']['output']>
  /** An array relationship */
  resources: Array<Resources>
  /** An aggregate relationship */
  resources_aggregate: Resources_Aggregate
  rootowner: Scalars['String']['output']
  /** An array relationship */
  singular_curated: Array<Singular_Curated>
  /** An aggregate relationship */
  singular_curated_aggregate: Singular_Curated_Aggregate
  /** An array relationship */
  singular_nsfw: Array<Singular_Nsfw_Nfts>
  /** An aggregate relationship */
  singular_nsfw_aggregate: Singular_Nsfw_Nfts_Aggregate
  sn: Scalars['String']['output']
  symbol: Scalars['String']['output']
  transferable: Scalars['Int']['output']
  txBlock?: Maybe<Scalars['Int']['output']>
  txCaller?: Maybe<Scalars['String']['output']>
  txPending: Scalars['Boolean']['output']
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** columns and relationships of "nfts" */
export type NftsChangesArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsChanges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsChildrenArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsChildren_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsMetadata_PropertiesArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "nfts" */
export type NftsPriorityArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "nfts" */
export type NftsPropertiesArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "nfts" */
export type NftsResourcesArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Order_By>>
  where?: InputMaybe<Resources_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsResources_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Order_By>>
  where?: InputMaybe<Resources_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsSingular_CuratedArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Order_By>>
  where?: InputMaybe<Singular_Curated_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsSingular_Curated_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Order_By>>
  where?: InputMaybe<Singular_Curated_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsSingular_NsfwArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

/** columns and relationships of "nfts" */
export type NftsSingular_Nsfw_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
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
  count: Scalars['Int']['output']
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
  distinct?: InputMaybe<Scalars['Boolean']['input']>
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
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  txBlock?: Maybe<Scalars['Float']['output']>
}

/** order by avg() on columns of table "nfts" */
export type Nfts_Avg_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "nfts". All fields are combined with a logical 'AND'. */
export type Nfts_Bool_Exp = {
  _and?: InputMaybe<Array<Nfts_Bool_Exp>>
  _not?: InputMaybe<Nfts_Bool_Exp>
  _or?: InputMaybe<Array<Nfts_Bool_Exp>>
  block?: InputMaybe<Int_Comparison_Exp>
  burned?: InputMaybe<String_Comparison_Exp>
  changes?: InputMaybe<Changes_Bool_Exp>
  children?: InputMaybe<Nfts_Bool_Exp>
  collection?: InputMaybe<Collections_Bool_Exp>
  collectionId?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  dutchie?: InputMaybe<Dutchie_Bool_Exp>
  equipped?: InputMaybe<Parts_Bool_Exp>
  equipped_id?: InputMaybe<String_Comparison_Exp>
  forsale?: InputMaybe<Bigint_Comparison_Exp>
  gem_enabled?: InputMaybe<Gems_Enabled_Bool_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  id_md5?: InputMaybe<String_Comparison_Exp>
  metadata?: InputMaybe<String_Comparison_Exp>
  metadata_content_type?: InputMaybe<String_Comparison_Exp>
  metadata_description?: InputMaybe<String_Comparison_Exp>
  metadata_image?: InputMaybe<String_Comparison_Exp>
  metadata_name?: InputMaybe<String_Comparison_Exp>
  metadata_properties?: InputMaybe<Jsonb_Comparison_Exp>
  metadata_rarity?: InputMaybe<String_Comparison_Exp>
  metadata_rarity_percentage?: InputMaybe<Float_Comparison_Exp>
  owner?: InputMaybe<String_Comparison_Exp>
  parent?: InputMaybe<Nfts_Bool_Exp>
  pending?: InputMaybe<Boolean_Comparison_Exp>
  priority?: InputMaybe<Jsonb_Comparison_Exp>
  properties?: InputMaybe<Jsonb_Comparison_Exp>
  resources?: InputMaybe<Resources_Bool_Exp>
  rootowner?: InputMaybe<String_Comparison_Exp>
  singular_curated?: InputMaybe<Singular_Curated_Bool_Exp>
  singular_nsfw?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
  sn?: InputMaybe<String_Comparison_Exp>
  symbol?: InputMaybe<String_Comparison_Exp>
  transferable?: InputMaybe<Int_Comparison_Exp>
  txBlock?: InputMaybe<Int_Comparison_Exp>
  txCaller?: InputMaybe<String_Comparison_Exp>
  txPending?: InputMaybe<Boolean_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** aggregate max on columns */
export type Nfts_Max_Fields = {
  __typename?: 'nfts_max_fields'
  block?: Maybe<Scalars['Int']['output']>
  burned?: Maybe<Scalars['String']['output']>
  collectionId?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  equipped_id?: Maybe<Scalars['String']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  id?: Maybe<Scalars['String']['output']>
  id_md5?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_content_type?: Maybe<Scalars['String']['output']>
  metadata_description?: Maybe<Scalars['String']['output']>
  metadata_image?: Maybe<Scalars['String']['output']>
  metadata_name?: Maybe<Scalars['String']['output']>
  metadata_rarity?: Maybe<Scalars['String']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  owner?: Maybe<Scalars['String']['output']>
  rootowner?: Maybe<Scalars['String']['output']>
  sn?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
  transferable?: Maybe<Scalars['Int']['output']>
  txBlock?: Maybe<Scalars['Int']['output']>
  txCaller?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by max() on columns of table "nfts" */
export type Nfts_Max_Order_By = {
  block?: InputMaybe<Order_By>
  burned?: InputMaybe<Order_By>
  collectionId?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  equipped_id?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  id_md5?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  metadata_description?: InputMaybe<Order_By>
  metadata_image?: InputMaybe<Order_By>
  metadata_name?: InputMaybe<Order_By>
  metadata_rarity?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  rootowner?: InputMaybe<Order_By>
  sn?: InputMaybe<Order_By>
  symbol?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  txCaller?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Nfts_Min_Fields = {
  __typename?: 'nfts_min_fields'
  block?: Maybe<Scalars['Int']['output']>
  burned?: Maybe<Scalars['String']['output']>
  collectionId?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  equipped_id?: Maybe<Scalars['String']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  id?: Maybe<Scalars['String']['output']>
  id_md5?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_content_type?: Maybe<Scalars['String']['output']>
  metadata_description?: Maybe<Scalars['String']['output']>
  metadata_image?: Maybe<Scalars['String']['output']>
  metadata_name?: Maybe<Scalars['String']['output']>
  metadata_rarity?: Maybe<Scalars['String']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  owner?: Maybe<Scalars['String']['output']>
  rootowner?: Maybe<Scalars['String']['output']>
  sn?: Maybe<Scalars['String']['output']>
  symbol?: Maybe<Scalars['String']['output']>
  transferable?: Maybe<Scalars['Int']['output']>
  txBlock?: Maybe<Scalars['Int']['output']>
  txCaller?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by min() on columns of table "nfts" */
export type Nfts_Min_Order_By = {
  block?: InputMaybe<Order_By>
  burned?: InputMaybe<Order_By>
  collectionId?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  equipped_id?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  id_md5?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  metadata_description?: InputMaybe<Order_By>
  metadata_image?: InputMaybe<Order_By>
  metadata_name?: InputMaybe<Order_By>
  metadata_rarity?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  rootowner?: InputMaybe<Order_By>
  sn?: InputMaybe<Order_By>
  symbol?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  txCaller?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "nfts". */
export type Nfts_Order_By = {
  block?: InputMaybe<Order_By>
  burned?: InputMaybe<Order_By>
  changes_aggregate?: InputMaybe<Changes_Aggregate_Order_By>
  children_aggregate?: InputMaybe<Nfts_Aggregate_Order_By>
  collection?: InputMaybe<Collections_Order_By>
  collectionId?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  dutchie?: InputMaybe<Dutchie_Order_By>
  equipped?: InputMaybe<Parts_Order_By>
  equipped_id?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  gem_enabled?: InputMaybe<Gems_Enabled_Order_By>
  id?: InputMaybe<Order_By>
  id_md5?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  metadata_description?: InputMaybe<Order_By>
  metadata_image?: InputMaybe<Order_By>
  metadata_name?: InputMaybe<Order_By>
  metadata_properties?: InputMaybe<Order_By>
  metadata_rarity?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  owner?: InputMaybe<Order_By>
  parent?: InputMaybe<Nfts_Order_By>
  pending?: InputMaybe<Order_By>
  priority?: InputMaybe<Order_By>
  properties?: InputMaybe<Order_By>
  resources_aggregate?: InputMaybe<Resources_Aggregate_Order_By>
  rootowner?: InputMaybe<Order_By>
  singular_curated_aggregate?: InputMaybe<Singular_Curated_Aggregate_Order_By>
  singular_nsfw_aggregate?: InputMaybe<Singular_Nsfw_Nfts_Aggregate_Order_By>
  sn?: InputMaybe<Order_By>
  symbol?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
  txCaller?: InputMaybe<Order_By>
  txPending?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
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
  CreatedAt = 'created_at',
  /** column name */
  EquippedId = 'equipped_id',
  /** column name */
  Forsale = 'forsale',
  /** column name */
  Id = 'id',
  /** column name */
  IdMd5 = 'id_md5',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MetadataContentType = 'metadata_content_type',
  /** column name */
  MetadataDescription = 'metadata_description',
  /** column name */
  MetadataImage = 'metadata_image',
  /** column name */
  MetadataName = 'metadata_name',
  /** column name */
  MetadataProperties = 'metadata_properties',
  /** column name */
  MetadataRarity = 'metadata_rarity',
  /** column name */
  MetadataRarityPercentage = 'metadata_rarity_percentage',
  /** column name */
  Owner = 'owner',
  /** column name */
  Pending = 'pending',
  /** column name */
  Priority = 'priority',
  /** column name */
  Properties = 'properties',
  /** column name */
  Rootowner = 'rootowner',
  /** column name */
  Sn = 'sn',
  /** column name */
  Symbol = 'symbol',
  /** column name */
  Transferable = 'transferable',
  /** column name */
  TxBlock = 'txBlock',
  /** column name */
  TxCaller = 'txCaller',
  /** column name */
  TxPending = 'txPending',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** columns and relationships of "nfts_stats" */
export type Nfts_Stats = {
  __typename?: 'nfts_stats'
  collection_id?: Maybe<Scalars['String']['output']>
  count?: Maybe<Scalars['bigint']['output']>
}

/** aggregated selection of "nfts_stats" */
export type Nfts_Stats_Aggregate = {
  __typename?: 'nfts_stats_aggregate'
  aggregate?: Maybe<Nfts_Stats_Aggregate_Fields>
  nodes: Array<Nfts_Stats>
}

/** aggregate fields of "nfts_stats" */
export type Nfts_Stats_Aggregate_Fields = {
  __typename?: 'nfts_stats_aggregate_fields'
  avg?: Maybe<Nfts_Stats_Avg_Fields>
  count: Scalars['Int']['output']
  max?: Maybe<Nfts_Stats_Max_Fields>
  min?: Maybe<Nfts_Stats_Min_Fields>
  stddev?: Maybe<Nfts_Stats_Stddev_Fields>
  stddev_pop?: Maybe<Nfts_Stats_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Nfts_Stats_Stddev_Samp_Fields>
  sum?: Maybe<Nfts_Stats_Sum_Fields>
  var_pop?: Maybe<Nfts_Stats_Var_Pop_Fields>
  var_samp?: Maybe<Nfts_Stats_Var_Samp_Fields>
  variance?: Maybe<Nfts_Stats_Variance_Fields>
}

/** aggregate fields of "nfts_stats" */
export type Nfts_Stats_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Nfts_Stats_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** aggregate avg on columns */
export type Nfts_Stats_Avg_Fields = {
  __typename?: 'nfts_stats_avg_fields'
  count?: Maybe<Scalars['Float']['output']>
}

/** Boolean expression to filter rows from the table "nfts_stats". All fields are combined with a logical 'AND'. */
export type Nfts_Stats_Bool_Exp = {
  _and?: InputMaybe<Array<Nfts_Stats_Bool_Exp>>
  _not?: InputMaybe<Nfts_Stats_Bool_Exp>
  _or?: InputMaybe<Array<Nfts_Stats_Bool_Exp>>
  collection_id?: InputMaybe<String_Comparison_Exp>
  count?: InputMaybe<Bigint_Comparison_Exp>
}

/** aggregate max on columns */
export type Nfts_Stats_Max_Fields = {
  __typename?: 'nfts_stats_max_fields'
  collection_id?: Maybe<Scalars['String']['output']>
  count?: Maybe<Scalars['bigint']['output']>
}

/** aggregate min on columns */
export type Nfts_Stats_Min_Fields = {
  __typename?: 'nfts_stats_min_fields'
  collection_id?: Maybe<Scalars['String']['output']>
  count?: Maybe<Scalars['bigint']['output']>
}

/** Ordering options when selecting data from "nfts_stats". */
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
export type Nfts_Stats_Stddev_Fields = {
  __typename?: 'nfts_stats_stddev_fields'
  count?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_pop on columns */
export type Nfts_Stats_Stddev_Pop_Fields = {
  __typename?: 'nfts_stats_stddev_pop_fields'
  count?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_samp on columns */
export type Nfts_Stats_Stddev_Samp_Fields = {
  __typename?: 'nfts_stats_stddev_samp_fields'
  count?: Maybe<Scalars['Float']['output']>
}

/** aggregate sum on columns */
export type Nfts_Stats_Sum_Fields = {
  __typename?: 'nfts_stats_sum_fields'
  count?: Maybe<Scalars['bigint']['output']>
}

/** aggregate var_pop on columns */
export type Nfts_Stats_Var_Pop_Fields = {
  __typename?: 'nfts_stats_var_pop_fields'
  count?: Maybe<Scalars['Float']['output']>
}

/** aggregate var_samp on columns */
export type Nfts_Stats_Var_Samp_Fields = {
  __typename?: 'nfts_stats_var_samp_fields'
  count?: Maybe<Scalars['Float']['output']>
}

/** aggregate variance on columns */
export type Nfts_Stats_Variance_Fields = {
  __typename?: 'nfts_stats_variance_fields'
  count?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev on columns */
export type Nfts_Stddev_Fields = {
  __typename?: 'nfts_stddev_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  txBlock?: Maybe<Scalars['Float']['output']>
}

/** order by stddev() on columns of table "nfts" */
export type Nfts_Stddev_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Nfts_Stddev_Pop_Fields = {
  __typename?: 'nfts_stddev_pop_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  txBlock?: Maybe<Scalars['Float']['output']>
}

/** order by stddev_pop() on columns of table "nfts" */
export type Nfts_Stddev_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Nfts_Stddev_Samp_Fields = {
  __typename?: 'nfts_stddev_samp_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  txBlock?: Maybe<Scalars['Float']['output']>
}

/** order by stddev_samp() on columns of table "nfts" */
export type Nfts_Stddev_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Nfts_Sum_Fields = {
  __typename?: 'nfts_sum_fields'
  block?: Maybe<Scalars['Int']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Int']['output']>
  txBlock?: Maybe<Scalars['Int']['output']>
}

/** order by sum() on columns of table "nfts" */
export type Nfts_Sum_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Nfts_Var_Pop_Fields = {
  __typename?: 'nfts_var_pop_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  txBlock?: Maybe<Scalars['Float']['output']>
}

/** order by var_pop() on columns of table "nfts" */
export type Nfts_Var_Pop_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Nfts_Var_Samp_Fields = {
  __typename?: 'nfts_var_samp_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  txBlock?: Maybe<Scalars['Float']['output']>
}

/** order by var_samp() on columns of table "nfts" */
export type Nfts_Var_Samp_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Nfts_Variance_Fields = {
  __typename?: 'nfts_variance_fields'
  block?: Maybe<Scalars['Float']['output']>
  forsale?: Maybe<Scalars['Float']['output']>
  metadata_rarity_percentage?: Maybe<Scalars['Float']['output']>
  transferable?: Maybe<Scalars['Float']['output']>
  txBlock?: Maybe<Scalars['Float']['output']>
}

/** order by variance() on columns of table "nfts" */
export type Nfts_Variance_Order_By = {
  block?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  metadata_rarity_percentage?: InputMaybe<Order_By>
  transferable?: InputMaybe<Order_By>
  txBlock?: InputMaybe<Order_By>
}

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>
  _gt?: InputMaybe<Scalars['numeric']['input']>
  _gte?: InputMaybe<Scalars['numeric']['input']>
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['numeric']['input']>
  _lte?: InputMaybe<Scalars['numeric']['input']>
  _neq?: InputMaybe<Scalars['numeric']['input']>
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>
}

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}

/** columns and relationships of "parts" */
export type Parts = {
  __typename?: 'parts'
  /** An object relationship */
  base: Bases
  base_id: Scalars['String']['output']
  equippable?: Maybe<Scalars['jsonb']['output']>
  id: Scalars['String']['output']
  metadata?: Maybe<Scalars['String']['output']>
  /** An array relationship */
  nfts_equipped: Array<Nfts>
  /** An aggregate relationship */
  nfts_equipped_aggregate: Nfts_Aggregate
  part_id: Scalars['String']['output']
  /** An array relationship */
  resources: Array<Resources>
  /** An aggregate relationship */
  resources_aggregate: Resources_Aggregate
  /** An object relationship */
  resources_part?: Maybe<Resources_Parts>
  src?: Maybe<Scalars['String']['output']>
  type: Scalars['String']['output']
  z: Scalars['Int']['output']
}

/** columns and relationships of "parts" */
export type PartsEquippableArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "parts" */
export type PartsNfts_EquippedArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** columns and relationships of "parts" */
export type PartsNfts_Equipped_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

/** columns and relationships of "parts" */
export type PartsResourcesArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Order_By>>
  where?: InputMaybe<Resources_Bool_Exp>
}

/** columns and relationships of "parts" */
export type PartsResources_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Order_By>>
  where?: InputMaybe<Resources_Bool_Exp>
}

/** aggregated selection of "parts" */
export type Parts_Aggregate = {
  __typename?: 'parts_aggregate'
  aggregate?: Maybe<Parts_Aggregate_Fields>
  nodes: Array<Parts>
}

/** aggregate fields of "parts" */
export type Parts_Aggregate_Fields = {
  __typename?: 'parts_aggregate_fields'
  avg?: Maybe<Parts_Avg_Fields>
  count: Scalars['Int']['output']
  max?: Maybe<Parts_Max_Fields>
  min?: Maybe<Parts_Min_Fields>
  stddev?: Maybe<Parts_Stddev_Fields>
  stddev_pop?: Maybe<Parts_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Parts_Stddev_Samp_Fields>
  sum?: Maybe<Parts_Sum_Fields>
  var_pop?: Maybe<Parts_Var_Pop_Fields>
  var_samp?: Maybe<Parts_Var_Samp_Fields>
  variance?: Maybe<Parts_Variance_Fields>
}

/** aggregate fields of "parts" */
export type Parts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Parts_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** order by aggregate values of table "parts" */
export type Parts_Aggregate_Order_By = {
  avg?: InputMaybe<Parts_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Parts_Max_Order_By>
  min?: InputMaybe<Parts_Min_Order_By>
  stddev?: InputMaybe<Parts_Stddev_Order_By>
  stddev_pop?: InputMaybe<Parts_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Parts_Stddev_Samp_Order_By>
  sum?: InputMaybe<Parts_Sum_Order_By>
  var_pop?: InputMaybe<Parts_Var_Pop_Order_By>
  var_samp?: InputMaybe<Parts_Var_Samp_Order_By>
  variance?: InputMaybe<Parts_Variance_Order_By>
}

/** aggregate avg on columns */
export type Parts_Avg_Fields = {
  __typename?: 'parts_avg_fields'
  z?: Maybe<Scalars['Float']['output']>
}

/** order by avg() on columns of table "parts" */
export type Parts_Avg_Order_By = {
  z?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "parts". All fields are combined with a logical 'AND'. */
export type Parts_Bool_Exp = {
  _and?: InputMaybe<Array<Parts_Bool_Exp>>
  _not?: InputMaybe<Parts_Bool_Exp>
  _or?: InputMaybe<Array<Parts_Bool_Exp>>
  base?: InputMaybe<Bases_Bool_Exp>
  base_id?: InputMaybe<String_Comparison_Exp>
  equippable?: InputMaybe<Jsonb_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  metadata?: InputMaybe<String_Comparison_Exp>
  nfts_equipped?: InputMaybe<Nfts_Bool_Exp>
  part_id?: InputMaybe<String_Comparison_Exp>
  resources?: InputMaybe<Resources_Bool_Exp>
  resources_part?: InputMaybe<Resources_Parts_Bool_Exp>
  src?: InputMaybe<String_Comparison_Exp>
  type?: InputMaybe<String_Comparison_Exp>
  z?: InputMaybe<Int_Comparison_Exp>
}

/** aggregate max on columns */
export type Parts_Max_Fields = {
  __typename?: 'parts_max_fields'
  base_id?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  part_id?: Maybe<Scalars['String']['output']>
  src?: Maybe<Scalars['String']['output']>
  type?: Maybe<Scalars['String']['output']>
  z?: Maybe<Scalars['Int']['output']>
}

/** order by max() on columns of table "parts" */
export type Parts_Max_Order_By = {
  base_id?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  part_id?: InputMaybe<Order_By>
  src?: InputMaybe<Order_By>
  type?: InputMaybe<Order_By>
  z?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Parts_Min_Fields = {
  __typename?: 'parts_min_fields'
  base_id?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  part_id?: Maybe<Scalars['String']['output']>
  src?: Maybe<Scalars['String']['output']>
  type?: Maybe<Scalars['String']['output']>
  z?: Maybe<Scalars['Int']['output']>
}

/** order by min() on columns of table "parts" */
export type Parts_Min_Order_By = {
  base_id?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  part_id?: InputMaybe<Order_By>
  src?: InputMaybe<Order_By>
  type?: InputMaybe<Order_By>
  z?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "parts". */
export type Parts_Order_By = {
  base?: InputMaybe<Bases_Order_By>
  base_id?: InputMaybe<Order_By>
  equippable?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  nfts_equipped_aggregate?: InputMaybe<Nfts_Aggregate_Order_By>
  part_id?: InputMaybe<Order_By>
  resources_aggregate?: InputMaybe<Resources_Aggregate_Order_By>
  resources_part?: InputMaybe<Resources_Parts_Order_By>
  src?: InputMaybe<Order_By>
  type?: InputMaybe<Order_By>
  z?: InputMaybe<Order_By>
}

/** select columns of table "parts" */
export enum Parts_Select_Column {
  /** column name */
  BaseId = 'base_id',
  /** column name */
  Equippable = 'equippable',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  PartId = 'part_id',
  /** column name */
  Src = 'src',
  /** column name */
  Type = 'type',
  /** column name */
  Z = 'z',
}

/** aggregate stddev on columns */
export type Parts_Stddev_Fields = {
  __typename?: 'parts_stddev_fields'
  z?: Maybe<Scalars['Float']['output']>
}

/** order by stddev() on columns of table "parts" */
export type Parts_Stddev_Order_By = {
  z?: InputMaybe<Order_By>
}

/** aggregate stddev_pop on columns */
export type Parts_Stddev_Pop_Fields = {
  __typename?: 'parts_stddev_pop_fields'
  z?: Maybe<Scalars['Float']['output']>
}

/** order by stddev_pop() on columns of table "parts" */
export type Parts_Stddev_Pop_Order_By = {
  z?: InputMaybe<Order_By>
}

/** aggregate stddev_samp on columns */
export type Parts_Stddev_Samp_Fields = {
  __typename?: 'parts_stddev_samp_fields'
  z?: Maybe<Scalars['Float']['output']>
}

/** order by stddev_samp() on columns of table "parts" */
export type Parts_Stddev_Samp_Order_By = {
  z?: InputMaybe<Order_By>
}

/** aggregate sum on columns */
export type Parts_Sum_Fields = {
  __typename?: 'parts_sum_fields'
  z?: Maybe<Scalars['Int']['output']>
}

/** order by sum() on columns of table "parts" */
export type Parts_Sum_Order_By = {
  z?: InputMaybe<Order_By>
}

/** aggregate var_pop on columns */
export type Parts_Var_Pop_Fields = {
  __typename?: 'parts_var_pop_fields'
  z?: Maybe<Scalars['Float']['output']>
}

/** order by var_pop() on columns of table "parts" */
export type Parts_Var_Pop_Order_By = {
  z?: InputMaybe<Order_By>
}

/** aggregate var_samp on columns */
export type Parts_Var_Samp_Fields = {
  __typename?: 'parts_var_samp_fields'
  z?: Maybe<Scalars['Float']['output']>
}

/** order by var_samp() on columns of table "parts" */
export type Parts_Var_Samp_Order_By = {
  z?: InputMaybe<Order_By>
}

/** aggregate variance on columns */
export type Parts_Variance_Fields = {
  __typename?: 'parts_variance_fields'
  z?: Maybe<Scalars['Float']['output']>
}

/** order by variance() on columns of table "parts" */
export type Parts_Variance_Order_By = {
  z?: InputMaybe<Order_By>
}

export type Query_Root = {
  __typename?: 'query_root'
  /** fetch data from the table: "base_themes" */
  base_themes: Array<Base_Themes>
  /** fetch data from the table: "base_themes" using primary key columns */
  base_themes_by_pk?: Maybe<Base_Themes>
  /** fetch data from the table: "bases" */
  bases: Array<Bases>
  /** fetch aggregated fields from the table: "bases" */
  bases_aggregate: Bases_Aggregate
  /** fetch data from the table: "bases" using primary key columns */
  bases_by_pk?: Maybe<Bases>
  /** An array relationship */
  changes: Array<Changes>
  /** An aggregate relationship */
  changes_aggregate: Changes_Aggregate
  /** fetch data from the table: "changes" using primary key columns */
  changes_by_pk?: Maybe<Changes>
  /** An array relationship */
  changes_collection: Array<Changes_Collection>
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
  /** fetch data from the table: "distinct_kanaria_nfts" */
  distinct_kanaria_nfts: Array<Distinct_Kanaria_Nfts>
  /** fetch aggregated fields from the table: "distinct_kanaria_nfts" */
  distinct_kanaria_nfts_aggregate: Distinct_Kanaria_Nfts_Aggregate
  /** fetch data from the table: "distinct_nfts" */
  distinct_nfts: Array<Distinct_Nfts>
  /** fetch aggregated fields from the table: "distinct_nfts" */
  distinct_nfts_aggregate: Distinct_Nfts_Aggregate
  /** fetch data from the table: "dutchie" */
  dutchie: Array<Dutchie>
  /** fetch data from the table: "dutchie" using primary key columns */
  dutchie_by_pk?: Maybe<Dutchie>
  /** fetch data from the table: "gems_enabled" */
  gems_enabled: Array<Gems_Enabled>
  /** fetch data from the table: "gems_enabled" using primary key columns */
  gems_enabled_by_pk?: Maybe<Gems_Enabled>
  /** execute function "get_newly_listed" which returns "nfts" */
  get_newly_listed: Array<Nfts>
  /** execute function "get_newly_listed" and query aggregates on result of table type "nfts" */
  get_newly_listed_aggregate: Nfts_Aggregate
  /** execute function "get_newly_minted" which returns "nfts" */
  get_newly_minted: Array<Nfts>
  /** execute function "get_newly_minted" and query aggregates on result of table type "nfts" */
  get_newly_minted_aggregate: Nfts_Aggregate
  /** execute function "get_ordered_changes_stats" which returns "changes" */
  get_ordered_changes_stats: Array<Changes>
  /** execute function "get_ordered_changes_stats" and query aggregates on result of table type "changes" */
  get_ordered_changes_stats_aggregate: Changes_Aggregate
  /** fetch data from the table: "hatched_birds" */
  hatched_birds: Array<Hatched_Birds>
  /** fetch data from the table: "hatched_birds" using primary key columns */
  hatched_birds_by_pk?: Maybe<Hatched_Birds>
  /** An array relationship */
  nfts: Array<Nfts>
  /** An aggregate relationship */
  nfts_aggregate: Nfts_Aggregate
  /** fetch data from the table: "nfts" using primary key columns */
  nfts_by_pk?: Maybe<Nfts>
  /** fetch data from the table: "nfts_stats" */
  nfts_stats: Array<Nfts_Stats>
  /** fetch aggregated fields from the table: "nfts_stats" */
  nfts_stats_aggregate: Nfts_Stats_Aggregate
  /** An array relationship */
  parts: Array<Parts>
  /** An aggregate relationship */
  parts_aggregate: Parts_Aggregate
  /** fetch data from the table: "parts" using primary key columns */
  parts_by_pk?: Maybe<Parts>
  /** fetch data from the table: "recently_listed" */
  recently_listed: Array<Recently_Listed>
  /** fetch aggregated fields from the table: "recently_listed" */
  recently_listed_aggregate: Recently_Listed_Aggregate
  /** An array relationship */
  resources: Array<Resources>
  /** An aggregate relationship */
  resources_aggregate: Resources_Aggregate
  /** An array relationship */
  resources_base_themes: Array<Resources_Base_Themes>
  /** fetch data from the table: "resources_base_themes" using primary key columns */
  resources_base_themes_by_pk?: Maybe<Resources_Base_Themes>
  /** fetch data from the table: "resources" using primary key columns */
  resources_by_pk?: Maybe<Resources>
  /** An array relationship */
  resources_parts: Array<Resources_Parts>
  /** An aggregate relationship */
  resources_parts_aggregate: Resources_Parts_Aggregate
  /** fetch data from the table: "resources_parts" using primary key columns */
  resources_parts_by_pk?: Maybe<Resources_Parts>
  /** fetch data from the table: "sales" */
  sales: Array<Sales>
  /** An array relationship */
  singular_blacklisted_accounts: Array<Singular_Blacklisted_Accounts>
  /** fetch data from the table: "singular_blacklisted_accounts" using primary key columns */
  singular_blacklisted_accounts_by_pk?: Maybe<Singular_Blacklisted_Accounts>
  /** An array relationship */
  singular_blacklisted_collections: Array<Singular_Blacklisted_Collections>
  /** fetch data from the table: "singular_blacklisted_collections" using primary key columns */
  singular_blacklisted_collections_by_pk?: Maybe<Singular_Blacklisted_Collections>
  /** An array relationship */
  singular_curated: Array<Singular_Curated>
  /** An aggregate relationship */
  singular_curated_aggregate: Singular_Curated_Aggregate
  /** fetch data from the table: "singular_curated" using primary key columns */
  singular_curated_by_pk?: Maybe<Singular_Curated>
  /** fetch data from the table: "singular_curated_collections" */
  singular_curated_collections: Array<Singular_Curated_Collections>
  /** fetch aggregated fields from the table: "singular_curated_collections" */
  singular_curated_collections_aggregate: Singular_Curated_Collections_Aggregate
  /** fetch data from the table: "singular_curated_collections" using primary key columns */
  singular_curated_collections_by_pk?: Maybe<Singular_Curated_Collections>
  /** fetch data from the table: "singular_hidden_collections" */
  singular_hidden_collections: Array<Singular_Hidden_Collections>
  /** fetch data from the table: "singular_hidden_collections" using primary key columns */
  singular_hidden_collections_by_pk?: Maybe<Singular_Hidden_Collections>
  /** An array relationship */
  singular_nsfw_collections: Array<Singular_Nsfw_Collections>
  /** An aggregate relationship */
  singular_nsfw_collections_aggregate: Singular_Nsfw_Collections_Aggregate
  /** fetch data from the table: "singular_nsfw_collections" using primary key columns */
  singular_nsfw_collections_by_pk?: Maybe<Singular_Nsfw_Collections>
  /** fetch data from the table: "singular_nsfw_nfts" */
  singular_nsfw_nfts: Array<Singular_Nsfw_Nfts>
  /** fetch aggregated fields from the table: "singular_nsfw_nfts" */
  singular_nsfw_nfts_aggregate: Singular_Nsfw_Nfts_Aggregate
  /** fetch data from the table: "singular_nsfw_nfts" using primary key columns */
  singular_nsfw_nfts_by_pk?: Maybe<Singular_Nsfw_Nfts>
  /** An array relationship */
  singular_verified_collections: Array<Singular_Verified_Collections>
  /** An aggregate relationship */
  singular_verified_collections_aggregate: Singular_Verified_Collections_Aggregate
  /** fetch data from the table: "singular_verified_collections" using primary key columns */
  singular_verified_collections_by_pk?: Maybe<Singular_Verified_Collections>
  /** fetch data from the table: "system" */
  system: Array<System>
  /** fetch data from the table: "system" using primary key columns */
  system_by_pk?: Maybe<System>
  /** fetch data from the table: "yuletide_item_track" */
  yuletide_item_track: Array<Yuletide_Item_Track>
  /** fetch aggregated fields from the table: "yuletide_item_track" */
  yuletide_item_track_aggregate: Yuletide_Item_Track_Aggregate
  /** fetch data from the table: "yuletide_item_track" using primary key columns */
  yuletide_item_track_by_pk?: Maybe<Yuletide_Item_Track>
}

export type Query_RootBase_ThemesArgs = {
  distinct_on?: InputMaybe<Array<Base_Themes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Base_Themes_Order_By>>
  where?: InputMaybe<Base_Themes_Bool_Exp>
}

export type Query_RootBase_Themes_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootBasesArgs = {
  distinct_on?: InputMaybe<Array<Bases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Bases_Order_By>>
  where?: InputMaybe<Bases_Bool_Exp>
}

export type Query_RootBases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Bases_Order_By>>
  where?: InputMaybe<Bases_Bool_Exp>
}

export type Query_RootBases_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootChangesArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

export type Query_RootChanges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

export type Query_RootChanges_By_PkArgs = {
  id: Scalars['Int']['input']
}

export type Query_RootChanges_CollectionArgs = {
  distinct_on?: InputMaybe<Array<Changes_Collection_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Collection_Order_By>>
  where?: InputMaybe<Changes_Collection_Bool_Exp>
}

export type Query_RootChanges_Collection_By_PkArgs = {
  id: Scalars['Int']['input']
}

export type Query_RootCollection_BannersArgs = {
  distinct_on?: InputMaybe<Array<Collection_Banners_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Collection_Banners_Order_By>>
  where?: InputMaybe<Collection_Banners_Bool_Exp>
}

export type Query_RootCollection_Banners_By_PkArgs = {
  collection_id: Scalars['String']['input']
}

export type Query_RootCollectionsArgs = {
  distinct_on?: InputMaybe<Array<Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Collections_Order_By>>
  where?: InputMaybe<Collections_Bool_Exp>
}

export type Query_RootCollections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Collections_Order_By>>
  where?: InputMaybe<Collections_Bool_Exp>
}

export type Query_RootCollections_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootDistinct_Kanaria_NftsArgs = {
  distinct_on?: InputMaybe<Array<Distinct_Kanaria_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Distinct_Kanaria_Nfts_Order_By>>
  where?: InputMaybe<Distinct_Kanaria_Nfts_Bool_Exp>
}

export type Query_RootDistinct_Kanaria_Nfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Distinct_Kanaria_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Distinct_Kanaria_Nfts_Order_By>>
  where?: InputMaybe<Distinct_Kanaria_Nfts_Bool_Exp>
}

export type Query_RootDistinct_NftsArgs = {
  distinct_on?: InputMaybe<Array<Distinct_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Distinct_Nfts_Order_By>>
  where?: InputMaybe<Distinct_Nfts_Bool_Exp>
}

export type Query_RootDistinct_Nfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Distinct_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Distinct_Nfts_Order_By>>
  where?: InputMaybe<Distinct_Nfts_Bool_Exp>
}

export type Query_RootDutchieArgs = {
  distinct_on?: InputMaybe<Array<Dutchie_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Dutchie_Order_By>>
  where?: InputMaybe<Dutchie_Bool_Exp>
}

export type Query_RootDutchie_By_PkArgs = {
  id: Scalars['Int']['input']
}

export type Query_RootGems_EnabledArgs = {
  distinct_on?: InputMaybe<Array<Gems_Enabled_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gems_Enabled_Order_By>>
  where?: InputMaybe<Gems_Enabled_Bool_Exp>
}

export type Query_RootGems_Enabled_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootGet_Newly_ListedArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

export type Query_RootGet_Newly_Listed_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

export type Query_RootGet_Newly_MintedArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

export type Query_RootGet_Newly_Minted_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

export type Query_RootGet_Ordered_Changes_StatsArgs = {
  args: Get_Ordered_Changes_Stats_Args
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

export type Query_RootGet_Ordered_Changes_Stats_AggregateArgs = {
  args: Get_Ordered_Changes_Stats_Args
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

export type Query_RootHatched_BirdsArgs = {
  distinct_on?: InputMaybe<Array<Hatched_Birds_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Hatched_Birds_Order_By>>
  where?: InputMaybe<Hatched_Birds_Bool_Exp>
}

export type Query_RootHatched_Birds_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootNftsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

export type Query_RootNfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

export type Query_RootNfts_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootNfts_StatsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Stats_Order_By>>
  where?: InputMaybe<Nfts_Stats_Bool_Exp>
}

export type Query_RootNfts_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Stats_Order_By>>
  where?: InputMaybe<Nfts_Stats_Bool_Exp>
}

export type Query_RootPartsArgs = {
  distinct_on?: InputMaybe<Array<Parts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Parts_Order_By>>
  where?: InputMaybe<Parts_Bool_Exp>
}

export type Query_RootParts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Parts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Parts_Order_By>>
  where?: InputMaybe<Parts_Bool_Exp>
}

export type Query_RootParts_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootRecently_ListedArgs = {
  distinct_on?: InputMaybe<Array<Recently_Listed_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Recently_Listed_Order_By>>
  where?: InputMaybe<Recently_Listed_Bool_Exp>
}

export type Query_RootRecently_Listed_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Recently_Listed_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Recently_Listed_Order_By>>
  where?: InputMaybe<Recently_Listed_Bool_Exp>
}

export type Query_RootResourcesArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Order_By>>
  where?: InputMaybe<Resources_Bool_Exp>
}

export type Query_RootResources_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Order_By>>
  where?: InputMaybe<Resources_Bool_Exp>
}

export type Query_RootResources_Base_ThemesArgs = {
  distinct_on?: InputMaybe<Array<Resources_Base_Themes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Base_Themes_Order_By>>
  where?: InputMaybe<Resources_Base_Themes_Bool_Exp>
}

export type Query_RootResources_Base_Themes_By_PkArgs = {
  resource_id: Scalars['String']['input']
  theme_id: Scalars['String']['input']
}

export type Query_RootResources_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootResources_PartsArgs = {
  distinct_on?: InputMaybe<Array<Resources_Parts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Parts_Order_By>>
  where?: InputMaybe<Resources_Parts_Bool_Exp>
}

export type Query_RootResources_Parts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resources_Parts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Parts_Order_By>>
  where?: InputMaybe<Resources_Parts_Bool_Exp>
}

export type Query_RootResources_Parts_By_PkArgs = {
  part_id: Scalars['String']['input']
  resource_id: Scalars['String']['input']
}

export type Query_RootSalesArgs = {
  distinct_on?: InputMaybe<Array<Sales_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Sales_Order_By>>
  where?: InputMaybe<Sales_Bool_Exp>
}

export type Query_RootSingular_Blacklisted_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Blacklisted_Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Blacklisted_Accounts_Order_By>>
  where?: InputMaybe<Singular_Blacklisted_Accounts_Bool_Exp>
}

export type Query_RootSingular_Blacklisted_Accounts_By_PkArgs = {
  account: Scalars['String']['input']
}

export type Query_RootSingular_Blacklisted_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Blacklisted_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Blacklisted_Collections_Order_By>>
  where?: InputMaybe<Singular_Blacklisted_Collections_Bool_Exp>
}

export type Query_RootSingular_Blacklisted_Collections_By_PkArgs = {
  collection_id: Scalars['String']['input']
}

export type Query_RootSingular_CuratedArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Order_By>>
  where?: InputMaybe<Singular_Curated_Bool_Exp>
}

export type Query_RootSingular_Curated_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Order_By>>
  where?: InputMaybe<Singular_Curated_Bool_Exp>
}

export type Query_RootSingular_Curated_By_PkArgs = {
  nft_id: Scalars['String']['input']
}

export type Query_RootSingular_Curated_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Collections_Order_By>>
  where?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
}

export type Query_RootSingular_Curated_Collections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Collections_Order_By>>
  where?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
}

export type Query_RootSingular_Curated_Collections_By_PkArgs = {
  collection_id: Scalars['String']['input']
}

export type Query_RootSingular_Hidden_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Hidden_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Hidden_Collections_Order_By>>
  where?: InputMaybe<Singular_Hidden_Collections_Bool_Exp>
}

export type Query_RootSingular_Hidden_Collections_By_PkArgs = {
  collection_id: Scalars['String']['input']
}

export type Query_RootSingular_Nsfw_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Collections_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
}

export type Query_RootSingular_Nsfw_Collections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Collections_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
}

export type Query_RootSingular_Nsfw_Collections_By_PkArgs = {
  collection_id: Scalars['String']['input']
}

export type Query_RootSingular_Nsfw_NftsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

export type Query_RootSingular_Nsfw_Nfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

export type Query_RootSingular_Nsfw_Nfts_By_PkArgs = {
  nft_id: Scalars['String']['input']
}

export type Query_RootSingular_Verified_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Verified_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Verified_Collections_Order_By>>
  where?: InputMaybe<Singular_Verified_Collections_Bool_Exp>
}

export type Query_RootSingular_Verified_Collections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Verified_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Verified_Collections_Order_By>>
  where?: InputMaybe<Singular_Verified_Collections_Bool_Exp>
}

export type Query_RootSingular_Verified_Collections_By_PkArgs = {
  collection_id: Scalars['String']['input']
}

export type Query_RootSystemArgs = {
  distinct_on?: InputMaybe<Array<System_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<System_Order_By>>
  where?: InputMaybe<System_Bool_Exp>
}

export type Query_RootSystem_By_PkArgs = {
  purchaseEnabled: Scalars['Boolean']['input']
}

export type Query_RootYuletide_Item_TrackArgs = {
  distinct_on?: InputMaybe<Array<Yuletide_Item_Track_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Yuletide_Item_Track_Order_By>>
  where?: InputMaybe<Yuletide_Item_Track_Bool_Exp>
}

export type Query_RootYuletide_Item_Track_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Yuletide_Item_Track_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Yuletide_Item_Track_Order_By>>
  where?: InputMaybe<Yuletide_Item_Track_Bool_Exp>
}

export type Query_RootYuletide_Item_Track_By_PkArgs = {
  id: Scalars['String']['input']
}

/** columns and relationships of "recently_listed" */
export type Recently_Listed = {
  __typename?: 'recently_listed'
  created_at?: Maybe<Scalars['timestamptz']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  id?: Maybe<Scalars['String']['output']>
  /** An object relationship */
  nft?: Maybe<Nfts>
}

/** aggregated selection of "recently_listed" */
export type Recently_Listed_Aggregate = {
  __typename?: 'recently_listed_aggregate'
  aggregate?: Maybe<Recently_Listed_Aggregate_Fields>
  nodes: Array<Recently_Listed>
}

/** aggregate fields of "recently_listed" */
export type Recently_Listed_Aggregate_Fields = {
  __typename?: 'recently_listed_aggregate_fields'
  avg?: Maybe<Recently_Listed_Avg_Fields>
  count: Scalars['Int']['output']
  max?: Maybe<Recently_Listed_Max_Fields>
  min?: Maybe<Recently_Listed_Min_Fields>
  stddev?: Maybe<Recently_Listed_Stddev_Fields>
  stddev_pop?: Maybe<Recently_Listed_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Recently_Listed_Stddev_Samp_Fields>
  sum?: Maybe<Recently_Listed_Sum_Fields>
  var_pop?: Maybe<Recently_Listed_Var_Pop_Fields>
  var_samp?: Maybe<Recently_Listed_Var_Samp_Fields>
  variance?: Maybe<Recently_Listed_Variance_Fields>
}

/** aggregate fields of "recently_listed" */
export type Recently_Listed_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Recently_Listed_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** aggregate avg on columns */
export type Recently_Listed_Avg_Fields = {
  __typename?: 'recently_listed_avg_fields'
  forsale?: Maybe<Scalars['Float']['output']>
}

/** Boolean expression to filter rows from the table "recently_listed". All fields are combined with a logical 'AND'. */
export type Recently_Listed_Bool_Exp = {
  _and?: InputMaybe<Array<Recently_Listed_Bool_Exp>>
  _not?: InputMaybe<Recently_Listed_Bool_Exp>
  _or?: InputMaybe<Array<Recently_Listed_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  forsale?: InputMaybe<Bigint_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  nft?: InputMaybe<Nfts_Bool_Exp>
}

/** aggregate max on columns */
export type Recently_Listed_Max_Fields = {
  __typename?: 'recently_listed_max_fields'
  created_at?: Maybe<Scalars['timestamptz']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  id?: Maybe<Scalars['String']['output']>
}

/** aggregate min on columns */
export type Recently_Listed_Min_Fields = {
  __typename?: 'recently_listed_min_fields'
  created_at?: Maybe<Scalars['timestamptz']['output']>
  forsale?: Maybe<Scalars['bigint']['output']>
  id?: Maybe<Scalars['String']['output']>
}

/** Ordering options when selecting data from "recently_listed". */
export type Recently_Listed_Order_By = {
  created_at?: InputMaybe<Order_By>
  forsale?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  nft?: InputMaybe<Nfts_Order_By>
}

/** select columns of table "recently_listed" */
export enum Recently_Listed_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Forsale = 'forsale',
  /** column name */
  Id = 'id',
}

/** aggregate stddev on columns */
export type Recently_Listed_Stddev_Fields = {
  __typename?: 'recently_listed_stddev_fields'
  forsale?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_pop on columns */
export type Recently_Listed_Stddev_Pop_Fields = {
  __typename?: 'recently_listed_stddev_pop_fields'
  forsale?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_samp on columns */
export type Recently_Listed_Stddev_Samp_Fields = {
  __typename?: 'recently_listed_stddev_samp_fields'
  forsale?: Maybe<Scalars['Float']['output']>
}

/** aggregate sum on columns */
export type Recently_Listed_Sum_Fields = {
  __typename?: 'recently_listed_sum_fields'
  forsale?: Maybe<Scalars['bigint']['output']>
}

/** aggregate var_pop on columns */
export type Recently_Listed_Var_Pop_Fields = {
  __typename?: 'recently_listed_var_pop_fields'
  forsale?: Maybe<Scalars['Float']['output']>
}

/** aggregate var_samp on columns */
export type Recently_Listed_Var_Samp_Fields = {
  __typename?: 'recently_listed_var_samp_fields'
  forsale?: Maybe<Scalars['Float']['output']>
}

/** aggregate variance on columns */
export type Recently_Listed_Variance_Fields = {
  __typename?: 'recently_listed_variance_fields'
  forsale?: Maybe<Scalars['Float']['output']>
}

/** columns and relationships of "resources" */
export type Resources = {
  __typename?: 'resources'
  /** An object relationship */
  base?: Maybe<Bases>
  base_id?: Maybe<Scalars['String']['output']>
  /** An object relationship */
  base_theme?: Maybe<Resources_Base_Themes>
  id: Scalars['String']['output']
  metadata?: Maybe<Scalars['String']['output']>
  metadata_content_type?: Maybe<Scalars['String']['output']>
  nft_id: Scalars['String']['output']
  /** An object relationship */
  nfts: Nfts
  parts?: Maybe<Scalars['jsonb']['output']>
  pending: Scalars['Boolean']['output']
  replace?: Maybe<Scalars['String']['output']>
  /** An object relationship */
  resources_part?: Maybe<Resources_Parts>
  /** An array relationship */
  resources_parts: Array<Resources_Parts>
  /** An aggregate relationship */
  resources_parts_aggregate: Resources_Parts_Aggregate
  /** An object relationship */
  slot?: Maybe<Parts>
  slot_id?: Maybe<Scalars['String']['output']>
  src?: Maybe<Scalars['String']['output']>
  theme?: Maybe<Scalars['jsonb']['output']>
  thumb?: Maybe<Scalars['String']['output']>
}

/** columns and relationships of "resources" */
export type ResourcesPartsArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "resources" */
export type ResourcesResources_PartsArgs = {
  distinct_on?: InputMaybe<Array<Resources_Parts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Parts_Order_By>>
  where?: InputMaybe<Resources_Parts_Bool_Exp>
}

/** columns and relationships of "resources" */
export type ResourcesResources_Parts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resources_Parts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Parts_Order_By>>
  where?: InputMaybe<Resources_Parts_Bool_Exp>
}

/** columns and relationships of "resources" */
export type ResourcesThemeArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** aggregated selection of "resources" */
export type Resources_Aggregate = {
  __typename?: 'resources_aggregate'
  aggregate?: Maybe<Resources_Aggregate_Fields>
  nodes: Array<Resources>
}

/** aggregate fields of "resources" */
export type Resources_Aggregate_Fields = {
  __typename?: 'resources_aggregate_fields'
  count: Scalars['Int']['output']
  max?: Maybe<Resources_Max_Fields>
  min?: Maybe<Resources_Min_Fields>
}

/** aggregate fields of "resources" */
export type Resources_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Resources_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** order by aggregate values of table "resources" */
export type Resources_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Resources_Max_Order_By>
  min?: InputMaybe<Resources_Min_Order_By>
}

/** columns and relationships of "resources_base_themes" */
export type Resources_Base_Themes = {
  __typename?: 'resources_base_themes'
  resource_id: Scalars['String']['output']
  /** An object relationship */
  theme: Base_Themes
  theme_id: Scalars['String']['output']
}

/** order by aggregate values of table "resources_base_themes" */
export type Resources_Base_Themes_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Resources_Base_Themes_Max_Order_By>
  min?: InputMaybe<Resources_Base_Themes_Min_Order_By>
}

/** Boolean expression to filter rows from the table "resources_base_themes". All fields are combined with a logical 'AND'. */
export type Resources_Base_Themes_Bool_Exp = {
  _and?: InputMaybe<Array<Resources_Base_Themes_Bool_Exp>>
  _not?: InputMaybe<Resources_Base_Themes_Bool_Exp>
  _or?: InputMaybe<Array<Resources_Base_Themes_Bool_Exp>>
  resource_id?: InputMaybe<String_Comparison_Exp>
  theme?: InputMaybe<Base_Themes_Bool_Exp>
  theme_id?: InputMaybe<String_Comparison_Exp>
}

/** order by max() on columns of table "resources_base_themes" */
export type Resources_Base_Themes_Max_Order_By = {
  resource_id?: InputMaybe<Order_By>
  theme_id?: InputMaybe<Order_By>
}

/** order by min() on columns of table "resources_base_themes" */
export type Resources_Base_Themes_Min_Order_By = {
  resource_id?: InputMaybe<Order_By>
  theme_id?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "resources_base_themes". */
export type Resources_Base_Themes_Order_By = {
  resource_id?: InputMaybe<Order_By>
  theme?: InputMaybe<Base_Themes_Order_By>
  theme_id?: InputMaybe<Order_By>
}

/** select columns of table "resources_base_themes" */
export enum Resources_Base_Themes_Select_Column {
  /** column name */
  ResourceId = 'resource_id',
  /** column name */
  ThemeId = 'theme_id',
}

/** Boolean expression to filter rows from the table "resources". All fields are combined with a logical 'AND'. */
export type Resources_Bool_Exp = {
  _and?: InputMaybe<Array<Resources_Bool_Exp>>
  _not?: InputMaybe<Resources_Bool_Exp>
  _or?: InputMaybe<Array<Resources_Bool_Exp>>
  base?: InputMaybe<Bases_Bool_Exp>
  base_id?: InputMaybe<String_Comparison_Exp>
  base_theme?: InputMaybe<Resources_Base_Themes_Bool_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  metadata?: InputMaybe<String_Comparison_Exp>
  metadata_content_type?: InputMaybe<String_Comparison_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
  nfts?: InputMaybe<Nfts_Bool_Exp>
  parts?: InputMaybe<Jsonb_Comparison_Exp>
  pending?: InputMaybe<Boolean_Comparison_Exp>
  replace?: InputMaybe<String_Comparison_Exp>
  resources_part?: InputMaybe<Resources_Parts_Bool_Exp>
  resources_parts?: InputMaybe<Resources_Parts_Bool_Exp>
  slot?: InputMaybe<Parts_Bool_Exp>
  slot_id?: InputMaybe<String_Comparison_Exp>
  src?: InputMaybe<String_Comparison_Exp>
  theme?: InputMaybe<Jsonb_Comparison_Exp>
  thumb?: InputMaybe<String_Comparison_Exp>
}

/** aggregate max on columns */
export type Resources_Max_Fields = {
  __typename?: 'resources_max_fields'
  base_id?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_content_type?: Maybe<Scalars['String']['output']>
  nft_id?: Maybe<Scalars['String']['output']>
  replace?: Maybe<Scalars['String']['output']>
  slot_id?: Maybe<Scalars['String']['output']>
  src?: Maybe<Scalars['String']['output']>
  thumb?: Maybe<Scalars['String']['output']>
}

/** order by max() on columns of table "resources" */
export type Resources_Max_Order_By = {
  base_id?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
  replace?: InputMaybe<Order_By>
  slot_id?: InputMaybe<Order_By>
  src?: InputMaybe<Order_By>
  thumb?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Resources_Min_Fields = {
  __typename?: 'resources_min_fields'
  base_id?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['String']['output']>
  metadata_content_type?: Maybe<Scalars['String']['output']>
  nft_id?: Maybe<Scalars['String']['output']>
  replace?: Maybe<Scalars['String']['output']>
  slot_id?: Maybe<Scalars['String']['output']>
  src?: Maybe<Scalars['String']['output']>
  thumb?: Maybe<Scalars['String']['output']>
}

/** order by min() on columns of table "resources" */
export type Resources_Min_Order_By = {
  base_id?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
  replace?: InputMaybe<Order_By>
  slot_id?: InputMaybe<Order_By>
  src?: InputMaybe<Order_By>
  thumb?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "resources". */
export type Resources_Order_By = {
  base?: InputMaybe<Bases_Order_By>
  base_id?: InputMaybe<Order_By>
  base_theme?: InputMaybe<Resources_Base_Themes_Order_By>
  id?: InputMaybe<Order_By>
  metadata?: InputMaybe<Order_By>
  metadata_content_type?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
  nfts?: InputMaybe<Nfts_Order_By>
  parts?: InputMaybe<Order_By>
  pending?: InputMaybe<Order_By>
  replace?: InputMaybe<Order_By>
  resources_part?: InputMaybe<Resources_Parts_Order_By>
  resources_parts_aggregate?: InputMaybe<Resources_Parts_Aggregate_Order_By>
  slot?: InputMaybe<Parts_Order_By>
  slot_id?: InputMaybe<Order_By>
  src?: InputMaybe<Order_By>
  theme?: InputMaybe<Order_By>
  thumb?: InputMaybe<Order_By>
}

/** columns and relationships of "resources_parts" */
export type Resources_Parts = {
  __typename?: 'resources_parts'
  /** An object relationship */
  part: Parts
  part_id: Scalars['String']['output']
  /** An object relationship */
  resource: Resources
  resource_id: Scalars['String']['output']
}

/** aggregated selection of "resources_parts" */
export type Resources_Parts_Aggregate = {
  __typename?: 'resources_parts_aggregate'
  aggregate?: Maybe<Resources_Parts_Aggregate_Fields>
  nodes: Array<Resources_Parts>
}

/** aggregate fields of "resources_parts" */
export type Resources_Parts_Aggregate_Fields = {
  __typename?: 'resources_parts_aggregate_fields'
  count: Scalars['Int']['output']
  max?: Maybe<Resources_Parts_Max_Fields>
  min?: Maybe<Resources_Parts_Min_Fields>
}

/** aggregate fields of "resources_parts" */
export type Resources_Parts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Resources_Parts_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** order by aggregate values of table "resources_parts" */
export type Resources_Parts_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Resources_Parts_Max_Order_By>
  min?: InputMaybe<Resources_Parts_Min_Order_By>
}

/** Boolean expression to filter rows from the table "resources_parts". All fields are combined with a logical 'AND'. */
export type Resources_Parts_Bool_Exp = {
  _and?: InputMaybe<Array<Resources_Parts_Bool_Exp>>
  _not?: InputMaybe<Resources_Parts_Bool_Exp>
  _or?: InputMaybe<Array<Resources_Parts_Bool_Exp>>
  part?: InputMaybe<Parts_Bool_Exp>
  part_id?: InputMaybe<String_Comparison_Exp>
  resource?: InputMaybe<Resources_Bool_Exp>
  resource_id?: InputMaybe<String_Comparison_Exp>
}

/** aggregate max on columns */
export type Resources_Parts_Max_Fields = {
  __typename?: 'resources_parts_max_fields'
  part_id?: Maybe<Scalars['String']['output']>
  resource_id?: Maybe<Scalars['String']['output']>
}

/** order by max() on columns of table "resources_parts" */
export type Resources_Parts_Max_Order_By = {
  part_id?: InputMaybe<Order_By>
  resource_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Resources_Parts_Min_Fields = {
  __typename?: 'resources_parts_min_fields'
  part_id?: Maybe<Scalars['String']['output']>
  resource_id?: Maybe<Scalars['String']['output']>
}

/** order by min() on columns of table "resources_parts" */
export type Resources_Parts_Min_Order_By = {
  part_id?: InputMaybe<Order_By>
  resource_id?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "resources_parts". */
export type Resources_Parts_Order_By = {
  part?: InputMaybe<Parts_Order_By>
  part_id?: InputMaybe<Order_By>
  resource?: InputMaybe<Resources_Order_By>
  resource_id?: InputMaybe<Order_By>
}

/** select columns of table "resources_parts" */
export enum Resources_Parts_Select_Column {
  /** column name */
  PartId = 'part_id',
  /** column name */
  ResourceId = 'resource_id',
}

/** select columns of table "resources" */
export enum Resources_Select_Column {
  /** column name */
  BaseId = 'base_id',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MetadataContentType = 'metadata_content_type',
  /** column name */
  NftId = 'nft_id',
  /** column name */
  Parts = 'parts',
  /** column name */
  Pending = 'pending',
  /** column name */
  Replace = 'replace',
  /** column name */
  SlotId = 'slot_id',
  /** column name */
  Src = 'src',
  /** column name */
  Theme = 'theme',
  /** column name */
  Thumb = 'thumb',
}

/** columns and relationships of "sales" */
export type Sales = {
  __typename?: 'sales'
  day?: Maybe<Scalars['numeric']['output']>
  month?: Maybe<Scalars['numeric']['output']>
  month3?: Maybe<Scalars['numeric']['output']>
  week?: Maybe<Scalars['numeric']['output']>
}

/** Boolean expression to filter rows from the table "sales". All fields are combined with a logical 'AND'. */
export type Sales_Bool_Exp = {
  _and?: InputMaybe<Array<Sales_Bool_Exp>>
  _not?: InputMaybe<Sales_Bool_Exp>
  _or?: InputMaybe<Array<Sales_Bool_Exp>>
  day?: InputMaybe<Numeric_Comparison_Exp>
  month?: InputMaybe<Numeric_Comparison_Exp>
  month3?: InputMaybe<Numeric_Comparison_Exp>
  week?: InputMaybe<Numeric_Comparison_Exp>
}

/** Ordering options when selecting data from "sales". */
export type Sales_Order_By = {
  day?: InputMaybe<Order_By>
  month?: InputMaybe<Order_By>
  month3?: InputMaybe<Order_By>
  week?: InputMaybe<Order_By>
}

/** select columns of table "sales" */
export enum Sales_Select_Column {
  /** column name */
  Day = 'day',
  /** column name */
  Month = 'month',
  /** column name */
  Month3 = 'month3',
  /** column name */
  Week = 'week',
}

/** columns and relationships of "singular_blacklisted_accounts" */
export type Singular_Blacklisted_Accounts = {
  __typename?: 'singular_blacklisted_accounts'
  account: Scalars['String']['output']
  created_at: Scalars['timestamptz']['output']
}

/** order by aggregate values of table "singular_blacklisted_accounts" */
export type Singular_Blacklisted_Accounts_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Singular_Blacklisted_Accounts_Max_Order_By>
  min?: InputMaybe<Singular_Blacklisted_Accounts_Min_Order_By>
}

/** Boolean expression to filter rows from the table "singular_blacklisted_accounts". All fields are combined with a logical 'AND'. */
export type Singular_Blacklisted_Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<Singular_Blacklisted_Accounts_Bool_Exp>>
  _not?: InputMaybe<Singular_Blacklisted_Accounts_Bool_Exp>
  _or?: InputMaybe<Array<Singular_Blacklisted_Accounts_Bool_Exp>>
  account?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** order by max() on columns of table "singular_blacklisted_accounts" */
export type Singular_Blacklisted_Accounts_Max_Order_By = {
  account?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** order by min() on columns of table "singular_blacklisted_accounts" */
export type Singular_Blacklisted_Accounts_Min_Order_By = {
  account?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "singular_blacklisted_accounts". */
export type Singular_Blacklisted_Accounts_Order_By = {
  account?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
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
  collection_id: Scalars['String']['output']
  created_at: Scalars['timestamptz']['output']
}

/** order by aggregate values of table "singular_blacklisted_collections" */
export type Singular_Blacklisted_Collections_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Singular_Blacklisted_Collections_Max_Order_By>
  min?: InputMaybe<Singular_Blacklisted_Collections_Min_Order_By>
}

/** Boolean expression to filter rows from the table "singular_blacklisted_collections". All fields are combined with a logical 'AND'. */
export type Singular_Blacklisted_Collections_Bool_Exp = {
  _and?: InputMaybe<Array<Singular_Blacklisted_Collections_Bool_Exp>>
  _not?: InputMaybe<Singular_Blacklisted_Collections_Bool_Exp>
  _or?: InputMaybe<Array<Singular_Blacklisted_Collections_Bool_Exp>>
  collection?: InputMaybe<Collections_Bool_Exp>
  collection_id?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** order by max() on columns of table "singular_blacklisted_collections" */
export type Singular_Blacklisted_Collections_Max_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** order by min() on columns of table "singular_blacklisted_collections" */
export type Singular_Blacklisted_Collections_Min_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "singular_blacklisted_collections". */
export type Singular_Blacklisted_Collections_Order_By = {
  collection?: InputMaybe<Collections_Order_By>
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
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
  created_at: Scalars['timestamptz']['output']
  nft_id: Scalars['String']['output']
}

/** aggregated selection of "singular_curated" */
export type Singular_Curated_Aggregate = {
  __typename?: 'singular_curated_aggregate'
  aggregate?: Maybe<Singular_Curated_Aggregate_Fields>
  nodes: Array<Singular_Curated>
}

/** aggregate fields of "singular_curated" */
export type Singular_Curated_Aggregate_Fields = {
  __typename?: 'singular_curated_aggregate_fields'
  count: Scalars['Int']['output']
  max?: Maybe<Singular_Curated_Max_Fields>
  min?: Maybe<Singular_Curated_Min_Fields>
}

/** aggregate fields of "singular_curated" */
export type Singular_Curated_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Singular_Curated_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** order by aggregate values of table "singular_curated" */
export type Singular_Curated_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Singular_Curated_Max_Order_By>
  min?: InputMaybe<Singular_Curated_Min_Order_By>
}

/** Boolean expression to filter rows from the table "singular_curated". All fields are combined with a logical 'AND'. */
export type Singular_Curated_Bool_Exp = {
  _and?: InputMaybe<Array<Singular_Curated_Bool_Exp>>
  _not?: InputMaybe<Singular_Curated_Bool_Exp>
  _or?: InputMaybe<Array<Singular_Curated_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
}

/** columns and relationships of "singular_curated_collections" */
export type Singular_Curated_Collections = {
  __typename?: 'singular_curated_collections'
  collection_id: Scalars['String']['output']
  created_at: Scalars['timestamptz']['output']
}

/** aggregated selection of "singular_curated_collections" */
export type Singular_Curated_Collections_Aggregate = {
  __typename?: 'singular_curated_collections_aggregate'
  aggregate?: Maybe<Singular_Curated_Collections_Aggregate_Fields>
  nodes: Array<Singular_Curated_Collections>
}

/** aggregate fields of "singular_curated_collections" */
export type Singular_Curated_Collections_Aggregate_Fields = {
  __typename?: 'singular_curated_collections_aggregate_fields'
  count: Scalars['Int']['output']
  max?: Maybe<Singular_Curated_Collections_Max_Fields>
  min?: Maybe<Singular_Curated_Collections_Min_Fields>
}

/** aggregate fields of "singular_curated_collections" */
export type Singular_Curated_Collections_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Singular_Curated_Collections_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** order by aggregate values of table "singular_curated_collections" */
export type Singular_Curated_Collections_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Singular_Curated_Collections_Max_Order_By>
  min?: InputMaybe<Singular_Curated_Collections_Min_Order_By>
}

/** Boolean expression to filter rows from the table "singular_curated_collections". All fields are combined with a logical 'AND'. */
export type Singular_Curated_Collections_Bool_Exp = {
  _and?: InputMaybe<Array<Singular_Curated_Collections_Bool_Exp>>
  _not?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
  _or?: InputMaybe<Array<Singular_Curated_Collections_Bool_Exp>>
  collection_id?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** aggregate max on columns */
export type Singular_Curated_Collections_Max_Fields = {
  __typename?: 'singular_curated_collections_max_fields'
  collection_id?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by max() on columns of table "singular_curated_collections" */
export type Singular_Curated_Collections_Max_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Singular_Curated_Collections_Min_Fields = {
  __typename?: 'singular_curated_collections_min_fields'
  collection_id?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by min() on columns of table "singular_curated_collections" */
export type Singular_Curated_Collections_Min_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "singular_curated_collections". */
export type Singular_Curated_Collections_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** select columns of table "singular_curated_collections" */
export enum Singular_Curated_Collections_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
}

/** aggregate max on columns */
export type Singular_Curated_Max_Fields = {
  __typename?: 'singular_curated_max_fields'
  created_at?: Maybe<Scalars['timestamptz']['output']>
  nft_id?: Maybe<Scalars['String']['output']>
}

/** order by max() on columns of table "singular_curated" */
export type Singular_Curated_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Singular_Curated_Min_Fields = {
  __typename?: 'singular_curated_min_fields'
  created_at?: Maybe<Scalars['timestamptz']['output']>
  nft_id?: Maybe<Scalars['String']['output']>
}

/** order by min() on columns of table "singular_curated" */
export type Singular_Curated_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "singular_curated". */
export type Singular_Curated_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
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
  collection_id: Scalars['String']['output']
  created_at: Scalars['timestamptz']['output']
}

/** Boolean expression to filter rows from the table "singular_hidden_collections". All fields are combined with a logical 'AND'. */
export type Singular_Hidden_Collections_Bool_Exp = {
  _and?: InputMaybe<Array<Singular_Hidden_Collections_Bool_Exp>>
  _not?: InputMaybe<Singular_Hidden_Collections_Bool_Exp>
  _or?: InputMaybe<Array<Singular_Hidden_Collections_Bool_Exp>>
  collection_id?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** Ordering options when selecting data from "singular_hidden_collections". */
export type Singular_Hidden_Collections_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** select columns of table "singular_hidden_collections" */
export enum Singular_Hidden_Collections_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
}

/** columns and relationships of "singular_nsfw_collections" */
export type Singular_Nsfw_Collections = {
  __typename?: 'singular_nsfw_collections'
  /** An object relationship */
  collection?: Maybe<Collections>
  collection_id: Scalars['String']['output']
  created_at: Scalars['timestamptz']['output']
  reason?: Maybe<Scalars['jsonb']['output']>
}

/** columns and relationships of "singular_nsfw_collections" */
export type Singular_Nsfw_CollectionsReasonArgs = {
  path?: InputMaybe<Scalars['String']['input']>
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
  count: Scalars['Int']['output']
  max?: Maybe<Singular_Nsfw_Collections_Max_Fields>
  min?: Maybe<Singular_Nsfw_Collections_Min_Fields>
}

/** aggregate fields of "singular_nsfw_collections" */
export type Singular_Nsfw_Collections_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** order by aggregate values of table "singular_nsfw_collections" */
export type Singular_Nsfw_Collections_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Singular_Nsfw_Collections_Max_Order_By>
  min?: InputMaybe<Singular_Nsfw_Collections_Min_Order_By>
}

/** Boolean expression to filter rows from the table "singular_nsfw_collections". All fields are combined with a logical 'AND'. */
export type Singular_Nsfw_Collections_Bool_Exp = {
  _and?: InputMaybe<Array<Singular_Nsfw_Collections_Bool_Exp>>
  _not?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
  _or?: InputMaybe<Array<Singular_Nsfw_Collections_Bool_Exp>>
  collection?: InputMaybe<Collections_Bool_Exp>
  collection_id?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  reason?: InputMaybe<Jsonb_Comparison_Exp>
}

/** aggregate max on columns */
export type Singular_Nsfw_Collections_Max_Fields = {
  __typename?: 'singular_nsfw_collections_max_fields'
  collection_id?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by max() on columns of table "singular_nsfw_collections" */
export type Singular_Nsfw_Collections_Max_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Singular_Nsfw_Collections_Min_Fields = {
  __typename?: 'singular_nsfw_collections_min_fields'
  collection_id?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by min() on columns of table "singular_nsfw_collections" */
export type Singular_Nsfw_Collections_Min_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "singular_nsfw_collections". */
export type Singular_Nsfw_Collections_Order_By = {
  collection?: InputMaybe<Collections_Order_By>
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  reason?: InputMaybe<Order_By>
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
  created_at: Scalars['timestamptz']['output']
  /** An object relationship */
  nft: Nfts
  nft_id: Scalars['String']['output']
  reason?: Maybe<Scalars['jsonb']['output']>
}

/** columns and relationships of "singular_nsfw_nfts" */
export type Singular_Nsfw_NftsReasonArgs = {
  path?: InputMaybe<Scalars['String']['input']>
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
  count: Scalars['Int']['output']
  max?: Maybe<Singular_Nsfw_Nfts_Max_Fields>
  min?: Maybe<Singular_Nsfw_Nfts_Min_Fields>
}

/** aggregate fields of "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** order by aggregate values of table "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Singular_Nsfw_Nfts_Max_Order_By>
  min?: InputMaybe<Singular_Nsfw_Nfts_Min_Order_By>
}

/** Boolean expression to filter rows from the table "singular_nsfw_nfts". All fields are combined with a logical 'AND'. */
export type Singular_Nsfw_Nfts_Bool_Exp = {
  _and?: InputMaybe<Array<Singular_Nsfw_Nfts_Bool_Exp>>
  _not?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
  _or?: InputMaybe<Array<Singular_Nsfw_Nfts_Bool_Exp>>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  nft?: InputMaybe<Nfts_Bool_Exp>
  nft_id?: InputMaybe<String_Comparison_Exp>
  reason?: InputMaybe<Jsonb_Comparison_Exp>
}

/** aggregate max on columns */
export type Singular_Nsfw_Nfts_Max_Fields = {
  __typename?: 'singular_nsfw_nfts_max_fields'
  created_at?: Maybe<Scalars['timestamptz']['output']>
  nft_id?: Maybe<Scalars['String']['output']>
}

/** order by max() on columns of table "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts_Max_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Singular_Nsfw_Nfts_Min_Fields = {
  __typename?: 'singular_nsfw_nfts_min_fields'
  created_at?: Maybe<Scalars['timestamptz']['output']>
  nft_id?: Maybe<Scalars['String']['output']>
}

/** order by min() on columns of table "singular_nsfw_nfts" */
export type Singular_Nsfw_Nfts_Min_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft_id?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "singular_nsfw_nfts". */
export type Singular_Nsfw_Nfts_Order_By = {
  created_at?: InputMaybe<Order_By>
  nft?: InputMaybe<Nfts_Order_By>
  nft_id?: InputMaybe<Order_By>
  reason?: InputMaybe<Order_By>
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
  collection_id: Scalars['String']['output']
  created_at: Scalars['timestamptz']['output']
}

/** aggregated selection of "singular_verified_collections" */
export type Singular_Verified_Collections_Aggregate = {
  __typename?: 'singular_verified_collections_aggregate'
  aggregate?: Maybe<Singular_Verified_Collections_Aggregate_Fields>
  nodes: Array<Singular_Verified_Collections>
}

/** aggregate fields of "singular_verified_collections" */
export type Singular_Verified_Collections_Aggregate_Fields = {
  __typename?: 'singular_verified_collections_aggregate_fields'
  count: Scalars['Int']['output']
  max?: Maybe<Singular_Verified_Collections_Max_Fields>
  min?: Maybe<Singular_Verified_Collections_Min_Fields>
}

/** aggregate fields of "singular_verified_collections" */
export type Singular_Verified_Collections_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Singular_Verified_Collections_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** order by aggregate values of table "singular_verified_collections" */
export type Singular_Verified_Collections_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Singular_Verified_Collections_Max_Order_By>
  min?: InputMaybe<Singular_Verified_Collections_Min_Order_By>
}

/** Boolean expression to filter rows from the table "singular_verified_collections". All fields are combined with a logical 'AND'. */
export type Singular_Verified_Collections_Bool_Exp = {
  _and?: InputMaybe<Array<Singular_Verified_Collections_Bool_Exp>>
  _not?: InputMaybe<Singular_Verified_Collections_Bool_Exp>
  _or?: InputMaybe<Array<Singular_Verified_Collections_Bool_Exp>>
  collection_id?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** aggregate max on columns */
export type Singular_Verified_Collections_Max_Fields = {
  __typename?: 'singular_verified_collections_max_fields'
  collection_id?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by max() on columns of table "singular_verified_collections" */
export type Singular_Verified_Collections_Max_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** aggregate min on columns */
export type Singular_Verified_Collections_Min_Fields = {
  __typename?: 'singular_verified_collections_min_fields'
  collection_id?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
}

/** order by min() on columns of table "singular_verified_collections" */
export type Singular_Verified_Collections_Min_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "singular_verified_collections". */
export type Singular_Verified_Collections_Order_By = {
  collection_id?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
}

/** select columns of table "singular_verified_collections" */
export enum Singular_Verified_Collections_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
}

/** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
export type Smallint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['smallint']['input']>
  _gt?: InputMaybe<Scalars['smallint']['input']>
  _gte?: InputMaybe<Scalars['smallint']['input']>
  _in?: InputMaybe<Array<Scalars['smallint']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['smallint']['input']>
  _lte?: InputMaybe<Scalars['smallint']['input']>
  _neq?: InputMaybe<Scalars['smallint']['input']>
  _nin?: InputMaybe<Array<Scalars['smallint']['input']>>
}

export type Subscription_Root = {
  __typename?: 'subscription_root'
  /** fetch data from the table: "base_themes" */
  base_themes: Array<Base_Themes>
  /** fetch data from the table: "base_themes" using primary key columns */
  base_themes_by_pk?: Maybe<Base_Themes>
  /** fetch data from the table: "bases" */
  bases: Array<Bases>
  /** fetch aggregated fields from the table: "bases" */
  bases_aggregate: Bases_Aggregate
  /** fetch data from the table: "bases" using primary key columns */
  bases_by_pk?: Maybe<Bases>
  /** An array relationship */
  changes: Array<Changes>
  /** An aggregate relationship */
  changes_aggregate: Changes_Aggregate
  /** fetch data from the table: "changes" using primary key columns */
  changes_by_pk?: Maybe<Changes>
  /** An array relationship */
  changes_collection: Array<Changes_Collection>
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
  /** fetch data from the table: "distinct_kanaria_nfts" */
  distinct_kanaria_nfts: Array<Distinct_Kanaria_Nfts>
  /** fetch aggregated fields from the table: "distinct_kanaria_nfts" */
  distinct_kanaria_nfts_aggregate: Distinct_Kanaria_Nfts_Aggregate
  /** fetch data from the table: "distinct_nfts" */
  distinct_nfts: Array<Distinct_Nfts>
  /** fetch aggregated fields from the table: "distinct_nfts" */
  distinct_nfts_aggregate: Distinct_Nfts_Aggregate
  /** fetch data from the table: "dutchie" */
  dutchie: Array<Dutchie>
  /** fetch data from the table: "dutchie" using primary key columns */
  dutchie_by_pk?: Maybe<Dutchie>
  /** fetch data from the table: "gems_enabled" */
  gems_enabled: Array<Gems_Enabled>
  /** fetch data from the table: "gems_enabled" using primary key columns */
  gems_enabled_by_pk?: Maybe<Gems_Enabled>
  /** execute function "get_newly_listed" which returns "nfts" */
  get_newly_listed: Array<Nfts>
  /** execute function "get_newly_listed" and query aggregates on result of table type "nfts" */
  get_newly_listed_aggregate: Nfts_Aggregate
  /** execute function "get_newly_minted" which returns "nfts" */
  get_newly_minted: Array<Nfts>
  /** execute function "get_newly_minted" and query aggregates on result of table type "nfts" */
  get_newly_minted_aggregate: Nfts_Aggregate
  /** execute function "get_ordered_changes_stats" which returns "changes" */
  get_ordered_changes_stats: Array<Changes>
  /** execute function "get_ordered_changes_stats" and query aggregates on result of table type "changes" */
  get_ordered_changes_stats_aggregate: Changes_Aggregate
  /** fetch data from the table: "hatched_birds" */
  hatched_birds: Array<Hatched_Birds>
  /** fetch data from the table: "hatched_birds" using primary key columns */
  hatched_birds_by_pk?: Maybe<Hatched_Birds>
  /** An array relationship */
  nfts: Array<Nfts>
  /** An aggregate relationship */
  nfts_aggregate: Nfts_Aggregate
  /** fetch data from the table: "nfts" using primary key columns */
  nfts_by_pk?: Maybe<Nfts>
  /** fetch data from the table: "nfts_stats" */
  nfts_stats: Array<Nfts_Stats>
  /** fetch aggregated fields from the table: "nfts_stats" */
  nfts_stats_aggregate: Nfts_Stats_Aggregate
  /** An array relationship */
  parts: Array<Parts>
  /** An aggregate relationship */
  parts_aggregate: Parts_Aggregate
  /** fetch data from the table: "parts" using primary key columns */
  parts_by_pk?: Maybe<Parts>
  /** fetch data from the table: "recently_listed" */
  recently_listed: Array<Recently_Listed>
  /** fetch aggregated fields from the table: "recently_listed" */
  recently_listed_aggregate: Recently_Listed_Aggregate
  /** An array relationship */
  resources: Array<Resources>
  /** An aggregate relationship */
  resources_aggregate: Resources_Aggregate
  /** An array relationship */
  resources_base_themes: Array<Resources_Base_Themes>
  /** fetch data from the table: "resources_base_themes" using primary key columns */
  resources_base_themes_by_pk?: Maybe<Resources_Base_Themes>
  /** fetch data from the table: "resources" using primary key columns */
  resources_by_pk?: Maybe<Resources>
  /** An array relationship */
  resources_parts: Array<Resources_Parts>
  /** An aggregate relationship */
  resources_parts_aggregate: Resources_Parts_Aggregate
  /** fetch data from the table: "resources_parts" using primary key columns */
  resources_parts_by_pk?: Maybe<Resources_Parts>
  /** fetch data from the table: "sales" */
  sales: Array<Sales>
  /** An array relationship */
  singular_blacklisted_accounts: Array<Singular_Blacklisted_Accounts>
  /** fetch data from the table: "singular_blacklisted_accounts" using primary key columns */
  singular_blacklisted_accounts_by_pk?: Maybe<Singular_Blacklisted_Accounts>
  /** An array relationship */
  singular_blacklisted_collections: Array<Singular_Blacklisted_Collections>
  /** fetch data from the table: "singular_blacklisted_collections" using primary key columns */
  singular_blacklisted_collections_by_pk?: Maybe<Singular_Blacklisted_Collections>
  /** An array relationship */
  singular_curated: Array<Singular_Curated>
  /** An aggregate relationship */
  singular_curated_aggregate: Singular_Curated_Aggregate
  /** fetch data from the table: "singular_curated" using primary key columns */
  singular_curated_by_pk?: Maybe<Singular_Curated>
  /** fetch data from the table: "singular_curated_collections" */
  singular_curated_collections: Array<Singular_Curated_Collections>
  /** fetch aggregated fields from the table: "singular_curated_collections" */
  singular_curated_collections_aggregate: Singular_Curated_Collections_Aggregate
  /** fetch data from the table: "singular_curated_collections" using primary key columns */
  singular_curated_collections_by_pk?: Maybe<Singular_Curated_Collections>
  /** fetch data from the table: "singular_hidden_collections" */
  singular_hidden_collections: Array<Singular_Hidden_Collections>
  /** fetch data from the table: "singular_hidden_collections" using primary key columns */
  singular_hidden_collections_by_pk?: Maybe<Singular_Hidden_Collections>
  /** An array relationship */
  singular_nsfw_collections: Array<Singular_Nsfw_Collections>
  /** An aggregate relationship */
  singular_nsfw_collections_aggregate: Singular_Nsfw_Collections_Aggregate
  /** fetch data from the table: "singular_nsfw_collections" using primary key columns */
  singular_nsfw_collections_by_pk?: Maybe<Singular_Nsfw_Collections>
  /** fetch data from the table: "singular_nsfw_nfts" */
  singular_nsfw_nfts: Array<Singular_Nsfw_Nfts>
  /** fetch aggregated fields from the table: "singular_nsfw_nfts" */
  singular_nsfw_nfts_aggregate: Singular_Nsfw_Nfts_Aggregate
  /** fetch data from the table: "singular_nsfw_nfts" using primary key columns */
  singular_nsfw_nfts_by_pk?: Maybe<Singular_Nsfw_Nfts>
  /** An array relationship */
  singular_verified_collections: Array<Singular_Verified_Collections>
  /** An aggregate relationship */
  singular_verified_collections_aggregate: Singular_Verified_Collections_Aggregate
  /** fetch data from the table: "singular_verified_collections" using primary key columns */
  singular_verified_collections_by_pk?: Maybe<Singular_Verified_Collections>
  /** fetch data from the table: "system" */
  system: Array<System>
  /** fetch data from the table: "system" using primary key columns */
  system_by_pk?: Maybe<System>
  /** fetch data from the table: "yuletide_item_track" */
  yuletide_item_track: Array<Yuletide_Item_Track>
  /** fetch aggregated fields from the table: "yuletide_item_track" */
  yuletide_item_track_aggregate: Yuletide_Item_Track_Aggregate
  /** fetch data from the table: "yuletide_item_track" using primary key columns */
  yuletide_item_track_by_pk?: Maybe<Yuletide_Item_Track>
}

export type Subscription_RootBase_ThemesArgs = {
  distinct_on?: InputMaybe<Array<Base_Themes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Base_Themes_Order_By>>
  where?: InputMaybe<Base_Themes_Bool_Exp>
}

export type Subscription_RootBase_Themes_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootBasesArgs = {
  distinct_on?: InputMaybe<Array<Bases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Bases_Order_By>>
  where?: InputMaybe<Bases_Bool_Exp>
}

export type Subscription_RootBases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bases_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Bases_Order_By>>
  where?: InputMaybe<Bases_Bool_Exp>
}

export type Subscription_RootBases_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootChangesArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

export type Subscription_RootChanges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

export type Subscription_RootChanges_By_PkArgs = {
  id: Scalars['Int']['input']
}

export type Subscription_RootChanges_CollectionArgs = {
  distinct_on?: InputMaybe<Array<Changes_Collection_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Collection_Order_By>>
  where?: InputMaybe<Changes_Collection_Bool_Exp>
}

export type Subscription_RootChanges_Collection_By_PkArgs = {
  id: Scalars['Int']['input']
}

export type Subscription_RootCollection_BannersArgs = {
  distinct_on?: InputMaybe<Array<Collection_Banners_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Collection_Banners_Order_By>>
  where?: InputMaybe<Collection_Banners_Bool_Exp>
}

export type Subscription_RootCollection_Banners_By_PkArgs = {
  collection_id: Scalars['String']['input']
}

export type Subscription_RootCollectionsArgs = {
  distinct_on?: InputMaybe<Array<Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Collections_Order_By>>
  where?: InputMaybe<Collections_Bool_Exp>
}

export type Subscription_RootCollections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Collections_Order_By>>
  where?: InputMaybe<Collections_Bool_Exp>
}

export type Subscription_RootCollections_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootDistinct_Kanaria_NftsArgs = {
  distinct_on?: InputMaybe<Array<Distinct_Kanaria_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Distinct_Kanaria_Nfts_Order_By>>
  where?: InputMaybe<Distinct_Kanaria_Nfts_Bool_Exp>
}

export type Subscription_RootDistinct_Kanaria_Nfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Distinct_Kanaria_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Distinct_Kanaria_Nfts_Order_By>>
  where?: InputMaybe<Distinct_Kanaria_Nfts_Bool_Exp>
}

export type Subscription_RootDistinct_NftsArgs = {
  distinct_on?: InputMaybe<Array<Distinct_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Distinct_Nfts_Order_By>>
  where?: InputMaybe<Distinct_Nfts_Bool_Exp>
}

export type Subscription_RootDistinct_Nfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Distinct_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Distinct_Nfts_Order_By>>
  where?: InputMaybe<Distinct_Nfts_Bool_Exp>
}

export type Subscription_RootDutchieArgs = {
  distinct_on?: InputMaybe<Array<Dutchie_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Dutchie_Order_By>>
  where?: InputMaybe<Dutchie_Bool_Exp>
}

export type Subscription_RootDutchie_By_PkArgs = {
  id: Scalars['Int']['input']
}

export type Subscription_RootGems_EnabledArgs = {
  distinct_on?: InputMaybe<Array<Gems_Enabled_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gems_Enabled_Order_By>>
  where?: InputMaybe<Gems_Enabled_Bool_Exp>
}

export type Subscription_RootGems_Enabled_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootGet_Newly_ListedArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

export type Subscription_RootGet_Newly_Listed_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

export type Subscription_RootGet_Newly_MintedArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

export type Subscription_RootGet_Newly_Minted_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

export type Subscription_RootGet_Ordered_Changes_StatsArgs = {
  args: Get_Ordered_Changes_Stats_Args
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

export type Subscription_RootGet_Ordered_Changes_Stats_AggregateArgs = {
  args: Get_Ordered_Changes_Stats_Args
  distinct_on?: InputMaybe<Array<Changes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Changes_Order_By>>
  where?: InputMaybe<Changes_Bool_Exp>
}

export type Subscription_RootHatched_BirdsArgs = {
  distinct_on?: InputMaybe<Array<Hatched_Birds_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Hatched_Birds_Order_By>>
  where?: InputMaybe<Hatched_Birds_Bool_Exp>
}

export type Subscription_RootHatched_Birds_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootNftsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

export type Subscription_RootNfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Order_By>>
  where?: InputMaybe<Nfts_Bool_Exp>
}

export type Subscription_RootNfts_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootNfts_StatsArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Stats_Order_By>>
  where?: InputMaybe<Nfts_Stats_Bool_Exp>
}

export type Subscription_RootNfts_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nfts_Stats_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Nfts_Stats_Order_By>>
  where?: InputMaybe<Nfts_Stats_Bool_Exp>
}

export type Subscription_RootPartsArgs = {
  distinct_on?: InputMaybe<Array<Parts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Parts_Order_By>>
  where?: InputMaybe<Parts_Bool_Exp>
}

export type Subscription_RootParts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Parts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Parts_Order_By>>
  where?: InputMaybe<Parts_Bool_Exp>
}

export type Subscription_RootParts_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootRecently_ListedArgs = {
  distinct_on?: InputMaybe<Array<Recently_Listed_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Recently_Listed_Order_By>>
  where?: InputMaybe<Recently_Listed_Bool_Exp>
}

export type Subscription_RootRecently_Listed_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Recently_Listed_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Recently_Listed_Order_By>>
  where?: InputMaybe<Recently_Listed_Bool_Exp>
}

export type Subscription_RootResourcesArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Order_By>>
  where?: InputMaybe<Resources_Bool_Exp>
}

export type Subscription_RootResources_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Order_By>>
  where?: InputMaybe<Resources_Bool_Exp>
}

export type Subscription_RootResources_Base_ThemesArgs = {
  distinct_on?: InputMaybe<Array<Resources_Base_Themes_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Base_Themes_Order_By>>
  where?: InputMaybe<Resources_Base_Themes_Bool_Exp>
}

export type Subscription_RootResources_Base_Themes_By_PkArgs = {
  resource_id: Scalars['String']['input']
  theme_id: Scalars['String']['input']
}

export type Subscription_RootResources_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootResources_PartsArgs = {
  distinct_on?: InputMaybe<Array<Resources_Parts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Parts_Order_By>>
  where?: InputMaybe<Resources_Parts_Bool_Exp>
}

export type Subscription_RootResources_Parts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resources_Parts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Resources_Parts_Order_By>>
  where?: InputMaybe<Resources_Parts_Bool_Exp>
}

export type Subscription_RootResources_Parts_By_PkArgs = {
  part_id: Scalars['String']['input']
  resource_id: Scalars['String']['input']
}

export type Subscription_RootSalesArgs = {
  distinct_on?: InputMaybe<Array<Sales_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Sales_Order_By>>
  where?: InputMaybe<Sales_Bool_Exp>
}

export type Subscription_RootSingular_Blacklisted_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Blacklisted_Accounts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Blacklisted_Accounts_Order_By>>
  where?: InputMaybe<Singular_Blacklisted_Accounts_Bool_Exp>
}

export type Subscription_RootSingular_Blacklisted_Accounts_By_PkArgs = {
  account: Scalars['String']['input']
}

export type Subscription_RootSingular_Blacklisted_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Blacklisted_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Blacklisted_Collections_Order_By>>
  where?: InputMaybe<Singular_Blacklisted_Collections_Bool_Exp>
}

export type Subscription_RootSingular_Blacklisted_Collections_By_PkArgs = {
  collection_id: Scalars['String']['input']
}

export type Subscription_RootSingular_CuratedArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Order_By>>
  where?: InputMaybe<Singular_Curated_Bool_Exp>
}

export type Subscription_RootSingular_Curated_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Order_By>>
  where?: InputMaybe<Singular_Curated_Bool_Exp>
}

export type Subscription_RootSingular_Curated_By_PkArgs = {
  nft_id: Scalars['String']['input']
}

export type Subscription_RootSingular_Curated_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Collections_Order_By>>
  where?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
}

export type Subscription_RootSingular_Curated_Collections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Curated_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Curated_Collections_Order_By>>
  where?: InputMaybe<Singular_Curated_Collections_Bool_Exp>
}

export type Subscription_RootSingular_Curated_Collections_By_PkArgs = {
  collection_id: Scalars['String']['input']
}

export type Subscription_RootSingular_Hidden_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Hidden_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Hidden_Collections_Order_By>>
  where?: InputMaybe<Singular_Hidden_Collections_Bool_Exp>
}

export type Subscription_RootSingular_Hidden_Collections_By_PkArgs = {
  collection_id: Scalars['String']['input']
}

export type Subscription_RootSingular_Nsfw_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Collections_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
}

export type Subscription_RootSingular_Nsfw_Collections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Collections_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Collections_Bool_Exp>
}

export type Subscription_RootSingular_Nsfw_Collections_By_PkArgs = {
  collection_id: Scalars['String']['input']
}

export type Subscription_RootSingular_Nsfw_NftsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

export type Subscription_RootSingular_Nsfw_Nfts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Nsfw_Nfts_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Nsfw_Nfts_Order_By>>
  where?: InputMaybe<Singular_Nsfw_Nfts_Bool_Exp>
}

export type Subscription_RootSingular_Nsfw_Nfts_By_PkArgs = {
  nft_id: Scalars['String']['input']
}

export type Subscription_RootSingular_Verified_CollectionsArgs = {
  distinct_on?: InputMaybe<Array<Singular_Verified_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Verified_Collections_Order_By>>
  where?: InputMaybe<Singular_Verified_Collections_Bool_Exp>
}

export type Subscription_RootSingular_Verified_Collections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Singular_Verified_Collections_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Singular_Verified_Collections_Order_By>>
  where?: InputMaybe<Singular_Verified_Collections_Bool_Exp>
}

export type Subscription_RootSingular_Verified_Collections_By_PkArgs = {
  collection_id: Scalars['String']['input']
}

export type Subscription_RootSystemArgs = {
  distinct_on?: InputMaybe<Array<System_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<System_Order_By>>
  where?: InputMaybe<System_Bool_Exp>
}

export type Subscription_RootSystem_By_PkArgs = {
  purchaseEnabled: Scalars['Boolean']['input']
}

export type Subscription_RootYuletide_Item_TrackArgs = {
  distinct_on?: InputMaybe<Array<Yuletide_Item_Track_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Yuletide_Item_Track_Order_By>>
  where?: InputMaybe<Yuletide_Item_Track_Bool_Exp>
}

export type Subscription_RootYuletide_Item_Track_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Yuletide_Item_Track_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Yuletide_Item_Track_Order_By>>
  where?: InputMaybe<Yuletide_Item_Track_Bool_Exp>
}

export type Subscription_RootYuletide_Item_Track_By_PkArgs = {
  id: Scalars['String']['input']
}

/** columns and relationships of "system" */
export type System = {
  __typename?: 'system'
  purchaseEnabled: Scalars['Boolean']['output']
}

/** Boolean expression to filter rows from the table "system". All fields are combined with a logical 'AND'. */
export type System_Bool_Exp = {
  _and?: InputMaybe<Array<System_Bool_Exp>>
  _not?: InputMaybe<System_Bool_Exp>
  _or?: InputMaybe<Array<System_Bool_Exp>>
  purchaseEnabled?: InputMaybe<Boolean_Comparison_Exp>
}

/** Ordering options when selecting data from "system". */
export type System_Order_By = {
  purchaseEnabled?: InputMaybe<Order_By>
}

/** select columns of table "system" */
export enum System_Select_Column {
  /** column name */
  PurchaseEnabled = 'purchaseEnabled',
}

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>
  _gt?: InputMaybe<Scalars['timestamptz']['input']>
  _gte?: InputMaybe<Scalars['timestamptz']['input']>
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['timestamptz']['input']>
  _lte?: InputMaybe<Scalars['timestamptz']['input']>
  _neq?: InputMaybe<Scalars['timestamptz']['input']>
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>
}

/**
 * track how many yuletide items an account owns
 *
 *
 * columns and relationships of "yuletide_item_track"
 *
 */
export type Yuletide_Item_Track = {
  __typename?: 'yuletide_item_track'
  id: Scalars['String']['output']
  item_count: Scalars['Int']['output']
}

/** aggregated selection of "yuletide_item_track" */
export type Yuletide_Item_Track_Aggregate = {
  __typename?: 'yuletide_item_track_aggregate'
  aggregate?: Maybe<Yuletide_Item_Track_Aggregate_Fields>
  nodes: Array<Yuletide_Item_Track>
}

/** aggregate fields of "yuletide_item_track" */
export type Yuletide_Item_Track_Aggregate_Fields = {
  __typename?: 'yuletide_item_track_aggregate_fields'
  avg?: Maybe<Yuletide_Item_Track_Avg_Fields>
  count: Scalars['Int']['output']
  max?: Maybe<Yuletide_Item_Track_Max_Fields>
  min?: Maybe<Yuletide_Item_Track_Min_Fields>
  stddev?: Maybe<Yuletide_Item_Track_Stddev_Fields>
  stddev_pop?: Maybe<Yuletide_Item_Track_Stddev_Pop_Fields>
  stddev_samp?: Maybe<Yuletide_Item_Track_Stddev_Samp_Fields>
  sum?: Maybe<Yuletide_Item_Track_Sum_Fields>
  var_pop?: Maybe<Yuletide_Item_Track_Var_Pop_Fields>
  var_samp?: Maybe<Yuletide_Item_Track_Var_Samp_Fields>
  variance?: Maybe<Yuletide_Item_Track_Variance_Fields>
}

/** aggregate fields of "yuletide_item_track" */
export type Yuletide_Item_Track_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Yuletide_Item_Track_Select_Column>>
  distinct?: InputMaybe<Scalars['Boolean']['input']>
}

/** aggregate avg on columns */
export type Yuletide_Item_Track_Avg_Fields = {
  __typename?: 'yuletide_item_track_avg_fields'
  item_count?: Maybe<Scalars['Float']['output']>
}

/** Boolean expression to filter rows from the table "yuletide_item_track". All fields are combined with a logical 'AND'. */
export type Yuletide_Item_Track_Bool_Exp = {
  _and?: InputMaybe<Array<Yuletide_Item_Track_Bool_Exp>>
  _not?: InputMaybe<Yuletide_Item_Track_Bool_Exp>
  _or?: InputMaybe<Array<Yuletide_Item_Track_Bool_Exp>>
  id?: InputMaybe<String_Comparison_Exp>
  item_count?: InputMaybe<Int_Comparison_Exp>
}

/** aggregate max on columns */
export type Yuletide_Item_Track_Max_Fields = {
  __typename?: 'yuletide_item_track_max_fields'
  id?: Maybe<Scalars['String']['output']>
  item_count?: Maybe<Scalars['Int']['output']>
}

/** aggregate min on columns */
export type Yuletide_Item_Track_Min_Fields = {
  __typename?: 'yuletide_item_track_min_fields'
  id?: Maybe<Scalars['String']['output']>
  item_count?: Maybe<Scalars['Int']['output']>
}

/** Ordering options when selecting data from "yuletide_item_track". */
export type Yuletide_Item_Track_Order_By = {
  id?: InputMaybe<Order_By>
  item_count?: InputMaybe<Order_By>
}

/** select columns of table "yuletide_item_track" */
export enum Yuletide_Item_Track_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  ItemCount = 'item_count',
}

/** aggregate stddev on columns */
export type Yuletide_Item_Track_Stddev_Fields = {
  __typename?: 'yuletide_item_track_stddev_fields'
  item_count?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_pop on columns */
export type Yuletide_Item_Track_Stddev_Pop_Fields = {
  __typename?: 'yuletide_item_track_stddev_pop_fields'
  item_count?: Maybe<Scalars['Float']['output']>
}

/** aggregate stddev_samp on columns */
export type Yuletide_Item_Track_Stddev_Samp_Fields = {
  __typename?: 'yuletide_item_track_stddev_samp_fields'
  item_count?: Maybe<Scalars['Float']['output']>
}

/** aggregate sum on columns */
export type Yuletide_Item_Track_Sum_Fields = {
  __typename?: 'yuletide_item_track_sum_fields'
  item_count?: Maybe<Scalars['Int']['output']>
}

/** aggregate var_pop on columns */
export type Yuletide_Item_Track_Var_Pop_Fields = {
  __typename?: 'yuletide_item_track_var_pop_fields'
  item_count?: Maybe<Scalars['Float']['output']>
}

/** aggregate var_samp on columns */
export type Yuletide_Item_Track_Var_Samp_Fields = {
  __typename?: 'yuletide_item_track_var_samp_fields'
  item_count?: Maybe<Scalars['Float']['output']>
}

/** aggregate variance on columns */
export type Yuletide_Item_Track_Variance_Fields = {
  __typename?: 'yuletide_item_track_variance_fields'
  item_count?: Maybe<Scalars['Float']['output']>
}

export type NftsQueryVariables = Exact<{
  addresses?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
}>

export type NftsQuery = {
  __typename?: 'query_root'
  nfts: Array<{
    __typename?: 'nfts'
    id: string
    symbol: string
    metadata?: string | null
    metadata_name?: string | null
    metadata_description?: string | null
    metadata_image?: string | null
    sn: string
    metadata_properties?: any | null
    children: Array<{
      __typename?: 'nfts'
      id: string
      metadata_name?: string | null
      metadata_image?: string | null
      sn: string
    }>
    resources: Array<{
      __typename?: 'resources'
      metadata_content_type?: string | null
      thumb?: string | null
      src?: string | null
    }>
    collection?: { __typename?: 'collections'; id: string; metadata_name?: string | null; max: number } | null
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
                { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata_name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata_description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata_image' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'children' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'metadata_name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'metadata_image' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sn' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'resources' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'metadata_content_type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'thumb' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'src' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'sn' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadata_properties' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'collection' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'metadata_name' } },
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
