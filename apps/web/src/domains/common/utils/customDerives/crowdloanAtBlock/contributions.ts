/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-dynamic-delete */

// From https://github.com/polkadot-js/api/tree/a22a111f7228e80e03bc75298347dbd184c5630b/packages/api-derive/src/crowdloan
// with changes to support querying old blocks

// Copyright 2017-2023 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveApi, DeriveContributions } from '@polkadot/api-derive/types'
import type { StorageKey } from '@polkadot/types'
import type { BN } from '@polkadot/util'
import type { Observable } from 'rxjs'

import { BehaviorSubject, combineLatest, EMPTY, map, of, startWith, switchMap, tap, toArray } from 'rxjs'

import { arrayFlatten, isFunction, nextTick, u8aToHex } from '@polkadot/util'

import { memo } from '@polkadot/api-derive/util'

const PAGE_SIZE_K = 1000 // limit aligned with the 1k on the node (trie lookups are heavy)

function _eventTriggerAll(
  blockHash: string | Uint8Array,
  api: DeriveApi,
  paraId: string | number | BN
): Observable<string> {
  return api.queryAt(blockHash).pipe(
    switchMap(apiAt =>
      apiAt.system.events().pipe(
        switchMap((events): Observable<string> => {
          const items = events.filter(
            ({
              event: {
                data: [eventParaId],
                method,
                section,
              },
            }) =>
              section === 'crowdloan' &&
              ['AllRefunded', 'Dissolved', 'PartiallyRefunded'].includes(method) &&
              eventParaId!.eq(paraId)
          )

          return items.length ? of(events.createdAtHash?.toHex() || '-') : EMPTY
        }),
        startWith('-')
      )
    )
  )
}

function _getKeysPaged(blockHash: string | Uint8Array, api: DeriveApi, childKey: string): Observable<StorageKey[]> {
  const subject = new BehaviorSubject<string | undefined>(undefined)

  return subject.pipe(
    switchMap(startKey => api.rpc.childstate.getKeysPaged(childKey, '0x', PAGE_SIZE_K, startKey, blockHash)),
    tap((keys): void => {
      nextTick((): void => {
        keys.length === PAGE_SIZE_K ? subject.next(keys[PAGE_SIZE_K - 1]!.toHex()) : subject.complete()
      })
    }),
    toArray(), // toArray since we want to startSubject to be completed
    map((keyArr: StorageKey[][]) => arrayFlatten(keyArr))
  )
}

function _getAll(
  blockHash: string | Uint8Array,
  api: DeriveApi,
  paraId: string | number | BN,
  childKey: string
): Observable<string[]> {
  return _eventTriggerAll(blockHash, api, paraId).pipe(
    switchMap(() =>
      isFunction(api.rpc.childstate.getKeysPaged)
        ? _getKeysPaged(blockHash, api, childKey)
        : api.rpc.childstate.getKeys(childKey, '0x', blockHash)
    ),
    map(keys => keys.map(k => k.toHex()))
  )
}

function _contributions(
  blockHash: string | Uint8Array,
  api: DeriveApi,
  paraId: string | number | BN,
  childKey: string
): Observable<DeriveContributions> {
  return combineLatest([_getAll(blockHash, api, paraId, childKey)]).pipe(
    map(([keys]): DeriveContributions => {
      const contributorsMap: Record<string, boolean> = {}

      keys.forEach((k): void => {
        contributorsMap[k] = true
      })

      return {
        blockHash: typeof blockHash === 'string' ? blockHash : u8aToHex(blockHash),
        contributorsHex: Object.keys(contributorsMap),
      }
    })
  )
}

export function contributions(
  instanceId: string,
  api: DeriveApi
): (blockHash: string | Uint8Array, paraId: string | number | BN) => Observable<DeriveContributions> {
  return memo(
    instanceId,
    (blockHash: string | Uint8Array, paraId: string | number | BN): Observable<DeriveContributions> =>
      api.derive.crowdloanAtBlock
        .childKey(blockHash, paraId)
        .pipe(
          switchMap(childKey =>
            childKey ? _contributions(blockHash, api, paraId, childKey) : of({ blockHash: '-', contributorsHex: [] })
          )
        )
  )
}
