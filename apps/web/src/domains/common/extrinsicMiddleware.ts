import { type SubmittableExtrinsic } from '@polkadot/api/types'
import { isKeyringPair } from '@polkadot/api/util'
import { type ISubmittableResult } from '@polkadot/types/types'
import posthog from 'posthog-js'
import { startTransition } from 'react'
import { type CallbackInterface } from 'recoil'

import { chainReadIdState } from './recoils'

export type ExtrinsicMiddleware = (
  chainId: string,
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult> | SubmittableExtrinsic<'rxjs', ISubmittableResult>,
  result: ISubmittableResult,
  callbackInterface: CallbackInterface
) => unknown

const combineMiddleware =
  (...middleware: ExtrinsicMiddleware[]): ExtrinsicMiddleware =>
  (...parameters) =>
    middleware.forEach(middleware => middleware(...parameters))

export const posthogMiddleware: ExtrinsicMiddleware = (chain, extrinsic, result) => {
  if (result.status.isInBlock && result.dispatchError === undefined) {
    posthog.capture('Extrinsic in block', {
      chain,
      chainProperties: extrinsic.registry.getChainProperties()?.toHuman(),
      module: extrinsic.method.section,
      section: extrinsic.method.method,
      signer: isKeyringPair(extrinsic.signer) ? extrinsic.signer.address : extrinsic.signer.toString(),
      args: Object.fromEntries(
        extrinsic.meta.args.map((x, index) => [x.name.toPrimitive(), extrinsic.args[index]?.toHuman()])
      ),
    })
  }
}

export const chainIdReadMiddleware: ExtrinsicMiddleware = (_, __, result, { set }) => {
  if (result.isFinalized) {
    startTransition(() => set(chainReadIdState, id => id + 1))
  }
}

export const extrinsicMiddleware = combineMiddleware(chainIdReadMiddleware, posthogMiddleware)
