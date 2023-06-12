// Abstracting constant getters into these selectors which will reuse pjs API instances (per network).
// When CAPI is ready, the internals of these hooks can be replaced without needing to make many
// changes in other areas of the codebase.
// TODO: refactor code to remove repititon
// TODO: use pjs types instead of force casting

import { pjsApiSelector } from '@domains/chains/pjs-api'
import { ApiPromise } from '@polkadot/api'
import { Balance } from '@polkadot/types/interfaces'
import { selectorFamily } from 'recoil'

export const existentialDepositSelector = selectorFamily({
  key: 'existentialDepositSelector',
  get:
    (rpc: string) =>
    async ({ get }) => {
      const apiLoadable = get(pjsApiSelector(rpc))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      if (!api.consts.balances) {
        throw Error('Balances must exist on api!')
      }
      return api.consts.balances.existentialDeposit as unknown as Balance
    },
})

const proxyDepositBaseSelector = selectorFamily({
  key: 'proxyDepositBaseSelector',
  get:
    (rpc: string) =>
    async ({ get }) => {
      const apiLoadable = get(pjsApiSelector(rpc))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      if (!api.consts.proxy) {
        throw Error('Proxy module must exist on api!')
      }
      return api.consts.proxy.proxyDepositBase as unknown as Balance
    },
})

const proxyDepositFactorSelector = selectorFamily({
  key: 'proxyDepositFactorSelector',
  get:
    (rpc: string) =>
    async ({ get }) => {
      const apiLoadable = get(pjsApiSelector(rpc))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      if (!api.consts.proxy) {
        throw Error('Proxy module must exist on api!')
      }
      return api.consts.proxy.proxyDepositFactor as unknown as Balance
    },
})

export const proxyDepositTotalSelector = selectorFamily({
  key: 'proxyDepositTotalSelector',
  get:
    (rpc: string) =>
    async ({ get }) => {
      const apiLoadable = get(pjsApiSelector(rpc))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      const proxyDepositBase = await get(proxyDepositBaseSelector(rpc))
      const proxyDepositFactor = await get(proxyDepositFactorSelector(rpc))
      return proxyDepositBase.add(proxyDepositFactor)
    },
})
