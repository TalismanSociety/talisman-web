/* eslint-disable */
import * as types from './graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
  '\n        query nfts($addresses: [String!], $limit: Int, $offset: Int) {\n          nfts(limit: $limit, offset: $offset, where: { owner: { _in: $addresses }, burned: { _eq: "" } }) {\n            id\n            symbol\n            metadata\n            metadata_name\n            metadata_description\n            metadata_image\n            children {\n              id\n              metadata_name\n              metadata_image\n              sn\n            }\n            resources {\n              metadata_content_type\n              thumb\n              src\n            }\n            sn\n            metadata_properties\n            collection {\n              id\n              metadata_name\n              max\n            }\n          }\n        }\n      ':
    types.NftsDocument,
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
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
  source: '\n        query nfts($addresses: [String!], $limit: Int, $offset: Int) {\n          nfts(limit: $limit, offset: $offset, where: { owner: { _in: $addresses }, burned: { _eq: "" } }) {\n            id\n            symbol\n            metadata\n            metadata_name\n            metadata_description\n            metadata_image\n            children {\n              id\n              metadata_name\n              metadata_image\n              sn\n            }\n            resources {\n              metadata_content_type\n              thumb\n              src\n            }\n            sn\n            metadata_properties\n            collection {\n              id\n              metadata_name\n              max\n            }\n          }\n        }\n      '
): (typeof documents)['\n        query nfts($addresses: [String!], $limit: Int, $offset: Int) {\n          nfts(limit: $limit, offset: $offset, where: { owner: { _in: $addresses }, burned: { _eq: "" } }) {\n            id\n            symbol\n            metadata\n            metadata_name\n            metadata_description\n            metadata_image\n            children {\n              id\n              metadata_name\n              metadata_image\n              sn\n            }\n            resources {\n              metadata_content_type\n              thumb\n              src\n            }\n            sn\n            metadata_properties\n            collection {\n              id\n              metadata_name\n              max\n            }\n          }\n        }\n      ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never
