/* eslint-disable */
import * as types from './graphql'
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
  '\n        query contributions($addresses: [String!]!) {\n          contributions(where: { account: { id_in: $addresses } }, orderBy: id_ASC) {\n            id\n            crowdloan {\n              id\n              fundIndex\n              fundAccount\n              paraId\n\n              depositor\n              end\n              cap\n              firstPeriod\n              lastPeriod\n              lastBlock\n\n              createdBlockNumber\n              createdTimestamp\n\n              dissolved\n              dissolvedBlockNumber\n              dissolvedTimestamp\n            }\n            account {\n              id\n            }\n            amount\n            returned\n            blockNumber\n            timestamp\n          }\n        }\n      ':
    types.ContributionsDocument,
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
  source: '\n        query contributions($addresses: [String!]!) {\n          contributions(where: { account: { id_in: $addresses } }, orderBy: id_ASC) {\n            id\n            crowdloan {\n              id\n              fundIndex\n              fundAccount\n              paraId\n\n              depositor\n              end\n              cap\n              firstPeriod\n              lastPeriod\n              lastBlock\n\n              createdBlockNumber\n              createdTimestamp\n\n              dissolved\n              dissolvedBlockNumber\n              dissolvedTimestamp\n            }\n            account {\n              id\n            }\n            amount\n            returned\n            blockNumber\n            timestamp\n          }\n        }\n      '
): (typeof documents)['\n        query contributions($addresses: [String!]!) {\n          contributions(where: { account: { id_in: $addresses } }, orderBy: id_ASC) {\n            id\n            crowdloan {\n              id\n              fundIndex\n              fundAccount\n              paraId\n\n              depositor\n              end\n              cap\n              firstPeriod\n              lastPeriod\n              lastBlock\n\n              createdBlockNumber\n              createdTimestamp\n\n              dissolved\n              dissolvedBlockNumber\n              dissolvedTimestamp\n            }\n            account {\n              id\n            }\n            amount\n            returned\n            blockNumber\n            timestamp\n          }\n        }\n      ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never
