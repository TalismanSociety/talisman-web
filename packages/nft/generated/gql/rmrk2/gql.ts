/* eslint-disable */
import * as types from './graphql.js'
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n        query nftListWithSearch(\n          $first: Int!\n          $offset: Int\n          $orderBy: [NFTEntityOrderByInput!] = [blockNumber_DESC]\n          $search: [NFTEntityWhereInput!]\n        ) {\n          nfts: nftEntities(\n            limit: $first\n            offset: $offset\n            orderBy: $orderBy\n            where: { burned_eq: false, metadata_not_eq: "", AND: $search }\n          ) {\n            id\n            sn\n            currentOwner\n            collection {\n              id\n              name\n              max\n            }\n            meta {\n              name\n              description\n              image\n              attributes {\n                trait\n                value\n              }\n            }\n            resources {\n              thumb\n            }\n          }\n        }\n      ':
    types.NftListWithSearchDocument,
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n        query nftListWithSearch(\n          $first: Int!\n          $offset: Int\n          $orderBy: [NFTEntityOrderByInput!] = [blockNumber_DESC]\n          $search: [NFTEntityWhereInput!]\n        ) {\n          nfts: nftEntities(\n            limit: $first\n            offset: $offset\n            orderBy: $orderBy\n            where: { burned_eq: false, metadata_not_eq: "", AND: $search }\n          ) {\n            id\n            sn\n            currentOwner\n            collection {\n              id\n              name\n              max\n            }\n            meta {\n              name\n              description\n              image\n              attributes {\n                trait\n                value\n              }\n            }\n            resources {\n              thumb\n            }\n          }\n        }\n      '
): (typeof documents)['\n        query nftListWithSearch(\n          $first: Int!\n          $offset: Int\n          $orderBy: [NFTEntityOrderByInput!] = [blockNumber_DESC]\n          $search: [NFTEntityWhereInput!]\n        ) {\n          nfts: nftEntities(\n            limit: $first\n            offset: $offset\n            orderBy: $orderBy\n            where: { burned_eq: false, metadata_not_eq: "", AND: $search }\n          ) {\n            id\n            sn\n            currentOwner\n            collection {\n              id\n              name\n              max\n            }\n            meta {\n              name\n              description\n              image\n              attributes {\n                trait\n                value\n              }\n            }\n            resources {\n              thumb\n            }\n          }\n        }\n      ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never
