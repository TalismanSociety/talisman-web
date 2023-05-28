import { type ApiPromise } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { atom, selectorFamily } from 'recoil'

import { substrateApiState } from '..'

export * from './api'
export * from './query'

export const paymentInfoState = selectorFamily({
  key: 'PaymentInfo',
  get:
    <
      TModule extends keyof PickKnownKeys<ApiPromise['tx']>,
      TSection extends keyof PickKnownKeys<ApiPromise['tx'][TModule]>,
      TParams extends Parameters<ApiPromise['tx'][TModule][TSection]>
    >([endpoint, module, section, account, ...params]: [string, TModule, TSection, string, ...TParams]) =>
    async ({ get }) => {
      const api = get(substrateApiState(endpoint))
      const extension = await web3FromAddress(account)

      return await api.tx[module]?.[section]?.(...params).paymentInfo(account, { signer: extension?.signer })
    },
  // NOTE: polkadot.js returned codec object includes reference to the registry
  // which shouldn't be freezed
  dangerouslyAllowMutability: true,
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
