// From https://github.com/polkadot-js/api/tree/a22a111f7228e80e03bc75298347dbd184c5630b/packages/api-derive/src/crowdloan
// with changes to support querying old blocks

// Copyright 2017-2023 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface DeriveContributions {
  blockHash: string
  contributorsHex: string[]
}

export type DeriveOwnContributions = Record<string, Balance>
