import { ApiPromise } from '@polkadot/api'
import { ISubmittableResult } from '@polkadot/types/types'
import { startTransition } from 'react'
import { CallbackInterface } from 'recoil'

import { chainReadIdState } from './recoils'

export type ExtrinsicMiddleware = {
  <
    TModule extends keyof PickKnownKeys<ApiPromise['tx']>,
    TSection extends Extract<keyof ApiPromise['tx'][TModule], string>
  >(
    module: TModule,
    section: TSection,
    result: ISubmittableResult,
    callbackInterface: CallbackInterface
  ): unknown
}

export const extrinsicMiddleWare: ExtrinsicMiddleware = (module, section, result, { set }) => {
  if (result.isFinalized) {
    startTransition(() => set(chainReadIdState, id => id + 1))
  }
}
