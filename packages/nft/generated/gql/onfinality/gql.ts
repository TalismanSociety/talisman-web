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
  '\n          query nfts($address: String!, $after: Cursor, $first: Int) {\n            nfts(after: $after, first: $first, filter: { currentOwner: { equalToInsensitive: $address } }) {\n              edges {\n                node {\n                  id\n                  tokenId\n                  collection {\n                    id\n                    name\n                    contractType\n                    contractAddress\n                    networkId\n                    totalSupply\n                  }\n                  metadata {\n                    name\n                    description\n                    imageUri\n                  }\n                }\n              }\n              pageInfo {\n                hasNextPage\n                endCursor\n              }\n            }\n          }\n        ':
    types.NftsDocument,
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
  source: '\n          query nfts($address: String!, $after: Cursor, $first: Int) {\n            nfts(after: $after, first: $first, filter: { currentOwner: { equalToInsensitive: $address } }) {\n              edges {\n                node {\n                  id\n                  tokenId\n                  collection {\n                    id\n                    name\n                    contractType\n                    contractAddress\n                    networkId\n                    totalSupply\n                  }\n                  metadata {\n                    name\n                    description\n                    imageUri\n                  }\n                }\n              }\n              pageInfo {\n                hasNextPage\n                endCursor\n              }\n            }\n          }\n        '
): (typeof documents)['\n          query nfts($address: String!, $after: Cursor, $first: Int) {\n            nfts(after: $after, first: $first, filter: { currentOwner: { equalToInsensitive: $address } }) {\n              edges {\n                node {\n                  id\n                  tokenId\n                  collection {\n                    id\n                    name\n                    contractType\n                    contractAddress\n                    networkId\n                    totalSupply\n                  }\n                  metadata {\n                    name\n                    description\n                    imageUri\n                  }\n                }\n              }\n              pageInfo {\n                hasNextPage\n                endCursor\n              }\n            }\n          }\n        ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never
