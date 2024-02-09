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
  '\n          query collectionListWithSearch(\n            $first: Int!\n            $offset: Int\n            $orderBy: [CollectionEntityOrderByInput!] = [blockNumber_DESC]\n            $address: String!\n          ) {\n            collections: collectionEntities(\n              limit: $first\n              offset: $offset\n              orderBy: $orderBy\n              where: { nfts_some: { burned_eq: false, currentOwner_eq: $address } }\n            ) {\n              id\n              name\n              max\n              nfts(where: { burned_eq: false, currentOwner_eq: $address }) {\n                id\n                sn\n                currentOwner\n                meta {\n                  name\n                  description\n                  image\n                  attributes {\n                    trait\n                    value\n                  }\n                }\n              }\n            }\n          }\n        ':
    types.CollectionListWithSearchDocument,
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
  source: '\n          query collectionListWithSearch(\n            $first: Int!\n            $offset: Int\n            $orderBy: [CollectionEntityOrderByInput!] = [blockNumber_DESC]\n            $address: String!\n          ) {\n            collections: collectionEntities(\n              limit: $first\n              offset: $offset\n              orderBy: $orderBy\n              where: { nfts_some: { burned_eq: false, currentOwner_eq: $address } }\n            ) {\n              id\n              name\n              max\n              nfts(where: { burned_eq: false, currentOwner_eq: $address }) {\n                id\n                sn\n                currentOwner\n                meta {\n                  name\n                  description\n                  image\n                  attributes {\n                    trait\n                    value\n                  }\n                }\n              }\n            }\n          }\n        '
): (typeof documents)['\n          query collectionListWithSearch(\n            $first: Int!\n            $offset: Int\n            $orderBy: [CollectionEntityOrderByInput!] = [blockNumber_DESC]\n            $address: String!\n          ) {\n            collections: collectionEntities(\n              limit: $first\n              offset: $offset\n              orderBy: $orderBy\n              where: { nfts_some: { burned_eq: false, currentOwner_eq: $address } }\n            ) {\n              id\n              name\n              max\n              nfts(where: { burned_eq: false, currentOwner_eq: $address }) {\n                id\n                sn\n                currentOwner\n                meta {\n                  name\n                  description\n                  image\n                  attributes {\n                    trait\n                    value\n                  }\n                }\n              }\n            }\n          }\n        ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never
