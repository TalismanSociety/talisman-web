import { ApiPromise } from '@polkadot/api'
import { AddressOrPair } from '@polkadot/api/types'
import { isKeyringPair } from '@polkadot/api/util'
import { Codec } from '@polkadot/types-codec/types'
import { ISubmittableResult } from '@polkadot/types/types'
import BN from 'bn.js'
import posthog from 'posthog-js'
import { startTransition } from 'react'
import { CallbackInterface } from 'recoil'

import { chainReadIdState } from './recoils'

export type ExtrinsicMiddleware = {
  <
    TModule extends keyof PickKnownKeys<ApiPromise['tx']>,
    TSection extends Extract<keyof ApiPromise['tx'][TModule], string>,
    TParams extends Parameters<ApiPromise['tx'][TModule][TSection]>
  >(
    module: TModule,
    section: TSection,
    account: AddressOrPair,
    params: TParams,
    result: ISubmittableResult,
    callbackInterface: CallbackInterface
  ): unknown
}

const combineMiddleware =
  (...middleware: ExtrinsicMiddleware[]): ExtrinsicMiddleware =>
  (...parameters) =>
    middleware.forEach(middleware => middleware(...parameters))

const toHuman = <T>(object: T): unknown => {
  if (typeof object !== 'object') {
    return object
  }

  if (object === null) {
    return object
  }

  if (object instanceof BN) {
    return object.toNumber()
  }

  if ('toHuman' in object) {
    return (object as any as Codec).toHuman()
  }

  if (Array.isArray(object)) {
    return object.map(value => toHuman(value))
  }

  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, toHuman(value)]))
}

export const posthogMiddleware: ExtrinsicMiddleware = (module, section, account, params, result) => {
  if (result.status.isInBlock && result.dispatchError === undefined) {
    posthog.capture('Extrinsic in block', {
      module,
      section,
      account: isKeyringPair(account) ? account.address : account.toString(),
      params: toHuman(params),
    })
  }
}

export const chainIdReadMiddleware: ExtrinsicMiddleware = (_, __, ___, ____, result, { set }) => {
  if (result.isFinalized) {
    startTransition(() => set(chainReadIdState, id => id + 1))
  }
}

export const extrinsicMiddleware = combineMiddleware(chainIdReadMiddleware, posthogMiddleware)
