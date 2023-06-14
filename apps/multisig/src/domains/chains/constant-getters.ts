// Abstracting constant getters into these selectors which will reuse pjs API instances (per network).
// When CAPI is ready, the internals of these hooks can be replaced without needing to make many
// changes in other areas of the codebase.
// TODO: refactor code to remove repititon
// TODO: use pjs types instead of force casting

import { pjsApiSelector } from '@domains/chains/pjs-api'
import { Balance } from '@domains/multisig'
import { ApiPromise } from '@polkadot/api'
import { Balance as PjsBalance } from '@polkadot/types/interfaces'
import { selectorFamily } from 'recoil'

import { supportedChains } from './supported-chains'
import { tokenByIdQuery } from './tokens'

export const existentialDepositSelector = selectorFamily({
  key: 'existentialDepositSelector',
  get:
    (rpc: string) =>
    async ({ get }): Promise<Balance> => {
      const nativeTokenId = supportedChains.find(chain => chain.rpc === rpc)?.nativeToken.id
      if (!nativeTokenId) throw Error('invalid rpc, this should never happen')

      const nativeToken = get(tokenByIdQuery(nativeTokenId))
      const apiLoadable = get(pjsApiSelector(rpc))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      if (!api.consts.balances) {
        throw Error('Balances must exist on api!')
      }
      return {
        token: nativeToken,
        amount: api.consts.balances.existentialDeposit as unknown as PjsBalance,
      }
    },
})

const proxyDepositBaseSelector = selectorFamily({
  key: 'proxyDepositBaseSelector',
  get:
    (rpc: string) =>
    async ({ get }): Promise<Balance> => {
      const nativeTokenId = supportedChains.find(chain => chain.rpc === rpc)?.nativeToken.id
      if (!nativeTokenId) throw Error('invalid rpc, this should never happen')

      const nativeToken = get(tokenByIdQuery(nativeTokenId))
      const apiLoadable = get(pjsApiSelector(rpc))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      if (!api.consts.proxy) {
        throw Error('Proxy module must exist on api!')
      }
      return { token: nativeToken, amount: api.consts.proxy.proxyDepositBase as unknown as PjsBalance }
    },
})

const proxyDepositFactorSelector = selectorFamily({
  key: 'proxyDepositFactorSelector',
  get:
    (rpc: string) =>
    async ({ get }): Promise<Balance> => {
      const nativeTokenId = supportedChains.find(chain => chain.rpc === rpc)?.nativeToken.id
      if (!nativeTokenId) throw Error('invalid rpc, this should never happen')

      const nativeToken = get(tokenByIdQuery(nativeTokenId))
      const apiLoadable = get(pjsApiSelector(rpc))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      if (!api.consts.proxy) {
        throw Error('Proxy module must exist on api!')
      }
      return { token: nativeToken, amount: api.consts.proxy.proxyDepositFactor as unknown as PjsBalance }
    },
})

export const proxyDepositTotalSelector = selectorFamily({
  key: 'proxyDepositTotalSelector',
  get:
    (rpc: string) =>
    async ({ get }): Promise<Balance> => {
      const nativeTokenId = supportedChains.find(chain => chain.rpc === rpc)?.nativeToken.id
      if (!nativeTokenId) throw Error('invalid rpc, this should never happen')

      const nativeToken = get(tokenByIdQuery(nativeTokenId))
      const apiLoadable = get(pjsApiSelector(rpc))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      const proxyDepositBase = get(proxyDepositBaseSelector(rpc))
      const proxyDepositFactor = get(proxyDepositFactorSelector(rpc))
      return {
        token: nativeToken,
        amount: proxyDepositBase.amount.add(proxyDepositFactor.amount),
      }
    },
})
