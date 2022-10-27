import { apiState } from '@domains/chains/recoils'
import { extensionState } from '@domains/extension/recoils'
import { ApiPromise } from '@polkadot/api'
import { AugmentedCall } from '@polkadot/api/types'
import { atom, selectorFamily, waitForAll } from 'recoil'
import type { Observable } from 'rxjs'

/**
 * For method where setting up subscription was not possible
 *
 */
export const chainState = selectorFamily({
  key: 'SubstrateApiCall',
  get:
    <
      TType extends keyof Pick<ApiPromise, 'call'>,
      TModule extends keyof PickKnownKeys<ApiPromise['call']>,
      TSection extends keyof PickKnownKeys<ApiPromise['call'][TModule]>,
      TParams extends Parameters<ApiPromise[TType][TModule][TSection]>
    >([type, module, section, ...params]: [TType, TModule, TSection, ...TParams]) =>
    ({ get }) => {
      type TResult = ApiPromise[TType][TModule][TSection] extends AugmentedCall<
        'promise',
        (args: any) => Observable<infer Result>
      >
        ? Result
        : any

      const api = get(apiState)

      return api[type]?.[module]?.[section]?.(...params) as Promise<TResult>
    },
})

export const paymentInfoState = selectorFamily({
  key: 'PaymentInfo',
  get:
    <
      TModule extends keyof PickKnownKeys<ApiPromise['tx']>,
      TSection extends keyof PickKnownKeys<ApiPromise['tx'][TModule]>,
      TParams extends Parameters<ApiPromise['tx'][TModule][TSection]>
    >([module, section, account, ...params]: [TModule, TSection, string, ...TParams]) =>
    ({ get }) => {
      const [api, extension] = get(waitForAll([apiState, extensionState]))

      return api.tx[module]?.[section]?.(...params).paymentInfo(account, { signer: extension?.signer })
    },
})

/**
 * Used to refresh all chain state reads where a subscription cannot be establish
 * TODO: right now this is a dumb counter that refresh all read on every extrinsic
 * we should make this into a atom family keyed by extrinsic type
 */
export const chainReadIdState = atom({
  key: 'ChainReadId',
  default: 0,
})
