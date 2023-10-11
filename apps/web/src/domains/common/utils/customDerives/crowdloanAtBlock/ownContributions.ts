// From https://github.com/polkadot-js/api/tree/a22a111f7228e80e03bc75298347dbd184c5630b/packages/api-derive/src/crowdloan
// with changes to support querying old blocks

// Copyright 2017-2023 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveApi, DeriveOwnContributions } from '@polkadot/api-derive/types'
import type { BN } from '@polkadot/util'
import type { Observable } from 'rxjs'

import { combineLatest, map, of, switchMap } from 'rxjs'

import { objectSpread } from '@polkadot/util'

import { memo } from '@polkadot/api-derive/util'

function _getValues(
  blockHash: string | Uint8Array,
  api: DeriveApi,
  childKey: string,
  keys: string[]
): Observable<DeriveOwnContributions> {
  // We actually would love to use multi-keys https://github.com/paritytech/substrate/issues/9203
  return combineLatest(keys.map(k => api.rpc.childstate.getStorage(childKey, k, blockHash))).pipe(
    map(values =>
      values
        .map(v => api.registry.createType('Option<StorageData>', v))
        .map(o => (o.isSome ? api.registry.createType('Balance', o.unwrap()) : api.registry.createType('Balance')))
        .reduce(
          (all: DeriveOwnContributions, b, index): DeriveOwnContributions =>
            objectSpread(all, { [keys[index] as any]: b }),
          {}
        )
    )
  )
}

function _contributions(
  blockHash: string | Uint8Array,
  api: DeriveApi,
  _paraId: string | number | BN,
  childKey: string,
  keys: string[]
): Observable<DeriveOwnContributions> {
  return combineLatest([_getValues(blockHash, api, childKey, keys)]).pipe(map(([all]) => objectSpread({}, all)))
}

export function ownContributions(
  instanceId: string,
  api: DeriveApi
): (
  blockHash: string | Uint8Array,
  paraId: string | number | BN,
  keys: string[]
) => Observable<DeriveOwnContributions> {
  return memo(
    instanceId,
    (
      blockHash: string | Uint8Array,
      paraId: string | number | BN,
      keys: string[]
    ): Observable<DeriveOwnContributions> =>
      api.derive.crowdloanAtBlock
        .childKey(blockHash, paraId)
        .pipe(
          switchMap(childKey =>
            childKey && keys.length ? _contributions(blockHash, api, paraId, childKey, keys) : of({})
          )
        )
  )
}
