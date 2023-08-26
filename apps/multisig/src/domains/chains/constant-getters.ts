// Abstracting constant getters into these selectors which will reuse pjs API instances (per network).
// When CAPI is ready, the internals of these hooks can be replaced without needing to make many
// changes in other areas of the codebase.
// TODO: refactor code to remove repititon
// TODO: use pjs types instead of force casting

import { pjsApiSelector } from '@domains/chains/pjs-api'
import { Balance } from '@domains/multisig'
import { ApiPromise } from '@polkadot/api'
import { Balance as PjsBalance } from '@polkadot/types/interfaces'
import BN from 'bn.js'
import { selectorFamily } from 'recoil'

import { supportedChains } from './supported-chains'
import { tokenByIdQuery } from './tokens'

export const existentialDepositSelector = selectorFamily({
  key: 'existentialDepositSelector',
  get:
    (chain_id: string) =>
    async ({ get }): Promise<Balance> => {
      const chain = supportedChains.find(chain => chain.squidIds.chainData === chain_id)
      if (!chain) throw Error(`couldnt find chain for chain id ${chain_id}, this should never happen`)
      const nativeTokenId = chain.nativeToken.id

      const nativeToken = get(tokenByIdQuery(nativeTokenId))
      const apiLoadable = get(pjsApiSelector(chain.rpcs))
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
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

const proxyDepositBaseSelector = selectorFamily({
  key: 'proxyDepositBaseSelector',
  get:
    (chain_id: string) =>
    async ({ get }): Promise<Balance> => {
      const chain = supportedChains.find(chain => chain.squidIds.chainData === chain_id)
      if (!chain) throw Error(`couldnt find chain for chain id ${chain_id}, this should never happen`)
      const nativeTokenId = chain.nativeToken.id

      const nativeToken = get(tokenByIdQuery(nativeTokenId))
      const apiLoadable = get(pjsApiSelector(chain.rpcs))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      if (!api.consts.proxy) {
        throw Error('Proxy module must exist on api!')
      }
      return { token: nativeToken, amount: api.consts.proxy.proxyDepositBase as unknown as PjsBalance }
    },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

const proxyDepositFactorSelector = selectorFamily({
  key: 'proxyDepositFactorSelector',
  get:
    (chain_id: string) =>
    async ({ get }): Promise<Balance> => {
      const chain = supportedChains.find(chain => chain.squidIds.chainData === chain_id)
      if (!chain) throw Error(`couldnt find chain for chain id ${chain_id}, this should never happen`)
      const nativeTokenId = chain.nativeToken.id

      const nativeToken = get(tokenByIdQuery(nativeTokenId))
      const apiLoadable = get(pjsApiSelector(chain.rpcs))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      if (!api.consts.proxy) {
        throw Error('Proxy module must exist on api!')
      }
      return { token: nativeToken, amount: api.consts.proxy.proxyDepositFactor as unknown as PjsBalance }
    },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

export const proxyDepositTotalSelector = selectorFamily({
  key: 'proxyDepositTotalSelector',
  get:
    (chain_id: string) =>
    async ({ get }): Promise<Balance> => {
      const chain = supportedChains.find(chain => chain.squidIds.chainData === chain_id)
      if (!chain) throw Error(`couldnt find chain for chain id ${chain_id}, this should never happen`)
      const nativeTokenId = chain.nativeToken.id

      const nativeToken = get(tokenByIdQuery(nativeTokenId))
      const apiLoadable = get(pjsApiSelector(chain.rpcs))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      const proxyDepositBase = get(proxyDepositBaseSelector(chain.squidIds.chainData))
      const proxyDepositFactor = get(proxyDepositFactorSelector(chain.squidIds.chainData))
      return {
        token: nativeToken,
        amount: proxyDepositBase.amount.add(proxyDepositFactor.amount),
      }
    },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

const multisigDepositBaseSelector = selectorFamily({
  key: 'multisigDepositBaseSelector',
  get:
    (chain_id: string) =>
    async ({ get }): Promise<Balance> => {
      const chain = supportedChains.find(chain => chain.squidIds.chainData === chain_id)
      if (!chain) throw Error(`couldnt find chain for chain id ${chain_id}, this should never happen`)
      const nativeTokenId = chain.nativeToken.id

      const nativeToken = get(tokenByIdQuery(nativeTokenId))
      const apiLoadable = get(pjsApiSelector(chain.rpcs))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      if (!api.consts.multisig) {
        throw Error('Multisig module must exist on api!')
      }
      return { token: nativeToken, amount: api.consts.multisig.depositBase as unknown as PjsBalance }
    },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

const multisigDepositFactorSelector = selectorFamily({
  key: 'multisigDepositFactorSelector',
  get:
    (chain_id: string) =>
    async ({ get }): Promise<Balance> => {
      const chain = supportedChains.find(chain => chain.squidIds.chainData === chain_id)
      if (!chain) throw Error(`couldnt find chain for chain id ${chain_id}, this should never happen`)
      const nativeTokenId = chain.nativeToken.id

      const nativeToken = get(tokenByIdQuery(nativeTokenId))
      const apiLoadable = get(pjsApiSelector(chain.rpcs))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      if (!api.consts.multisig) {
        throw Error('Multisig module must exist on api!')
      }
      return { token: nativeToken, amount: api.consts.multisig.depositFactor as unknown as PjsBalance }
    },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

export const multisigDepositTotalSelector = selectorFamily({
  key: 'multisigDepositTotalSelector',
  get:
    ({ chain_id, signatories }: { chain_id: string; signatories: number }) =>
    async ({ get }): Promise<Balance> => {
      const chain = supportedChains.find(chain => chain.squidIds.chainData === chain_id)
      if (!chain) throw Error(`couldnt find chain for chain id ${chain_id}, this should never happen`)
      const nativeTokenId = chain.nativeToken.id

      const nativeToken = get(tokenByIdQuery(nativeTokenId))
      const apiLoadable = get(pjsApiSelector(chain.rpcs))
      const api = apiLoadable as unknown as ApiPromise
      await api.isReady
      const depositBase = get(multisigDepositBaseSelector(chain.squidIds.chainData))
      const depositFactor = get(multisigDepositFactorSelector(chain.squidIds.chainData))
      return {
        token: nativeToken,
        amount: depositBase.amount.add(depositFactor.amount.mul(new BN(signatories))),
      }
    },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})
