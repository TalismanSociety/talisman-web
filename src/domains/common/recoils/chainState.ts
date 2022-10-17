import { apiState } from '@domains/chains/recoils'
import { ApiPromise } from '@polkadot/api'
import { AugmentedCall } from '@polkadot/api/types'
import { selectorFamily } from 'recoil'
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

      return api[type][module][section](...params) as Promise<TResult>
    },
})
