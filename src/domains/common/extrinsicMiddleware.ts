import { nominationPoolsExtrinsicMiddleWare } from '@domains/nominationPools/extrinsicMiddleware'
import { ApiPromise } from '@polkadot/api'
import { ISubmittableResult } from '@polkadot/types/types'
import { RecoilValue } from 'recoil'

type CallbackInterface = {
  refresh: (recoilValue: RecoilValue<any>) => void
}

export type ExtrinsicMiddleware = {
  <TModule extends keyof PickKnownKeys<ApiPromise['tx']>, TSection extends keyof ApiPromise['tx'][TModule]>(
    module: TModule,
    section: TSection,
    result: ISubmittableResult,
    callbackInterface: CallbackInterface
  ): unknown
}

export const extrinsicMiddleWare: ExtrinsicMiddleware = (...args) => {
  nominationPoolsExtrinsicMiddleWare(...args)
}
