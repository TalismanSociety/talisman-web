import type { SubmittableExtrinsic } from '@polkadot/api/types'
import type { GenericCall } from '@polkadot/types'
import type { Vec } from '@polkadot/types-codec'
import type { ISubmittableResult } from '@polkadot/types/types'
import type { CallbackInterface } from 'recoil'
import posthog from 'posthog-js'
import { startTransition } from 'react'

import { chainReadIdState } from '@/domains/common/recoils'

type Tag = 'analytics'

export type ExtrinsicMiddleware = (
  chainId: string,
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult> | SubmittableExtrinsic<'rxjs', ISubmittableResult>,
  result: ISubmittableResult,
  callbackInterface: CallbackInterface,
  options?: {
    blacklist?: Tag[]
  }
) => unknown

const combineMiddleware =
  (...middleware: ExtrinsicMiddleware[]): ExtrinsicMiddleware =>
  (...parameters) =>
    middleware.forEach(middleware => middleware(...parameters))

export const posthogMiddleware: ExtrinsicMiddleware = (chain, extrinsic, result, _, options) => {
  if (options?.blacklist?.includes('analytics')) {
    return
  }

  if (result.status.isInBlock && result.dispatchError === undefined) {
    const rootCall = {
      chain,
      chainProperties: extrinsic.registry.getChainProperties()?.toHuman(),
      module: extrinsic.method.section,
      section: extrinsic.method.method,
      args: Object.fromEntries(
        extrinsic.meta.args.map((x, index) => [x.name.toPrimitive(), extrinsic.args[index]?.toHuman()])
      ),
    }

    posthog.capture('Extrinsic in block', rootCall)

    if (extrinsic.method.section === 'utility' && extrinsic.method.method.includes('batch')) {
      ;(extrinsic.args as Array<Vec<GenericCall>>).forEach(calls =>
        calls.forEach(call =>
          posthog.capture('Extrinsic in block', {
            chain,
            chainProperties: extrinsic.registry.getChainProperties()?.toHuman(),
            module: call.section,
            section: call.method,
            args: Object.fromEntries(
              call.meta.args.map((x, index) => [x.name.toPrimitive(), call.args[index]?.toHuman()])
            ),
            parentCall: {
              module: rootCall.module,
              section: rootCall.section,
            },
          })
        )
      )
    }
  }
}

export const chainIdReadMiddleware: ExtrinsicMiddleware = (_, __, result, { set }) => {
  if (result.isFinalized) {
    startTransition(() => set(chainReadIdState, id => id + 1))
  }
}

export const extrinsicMiddleware = combineMiddleware(chainIdReadMiddleware, posthogMiddleware)
