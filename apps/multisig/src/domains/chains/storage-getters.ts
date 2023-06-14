// Abstracting constant getters into these selectors which will reuse pjs API instances (per network).
// When CAPI is ready, the internals of these hooks can be replaced without needing to make many
// changes in other areas of the codebase.
// TODO: refactor code to remove repititon
// TODO: use pjs types instead of force casting

import { pjsApiSelector } from '@domains/chains/pjs-api'
import { Balance, ProxyDefinition } from '@polkadot/types/interfaces'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'

import { Chain } from './tokens'

// Example only. replace with a state getter.
export const useExistentialDeposit = (chain: Chain) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpc))
  const [existentialDeposit, setExistentialDeposit] = useState<Balance | undefined>()

  useEffect(() => {
    const getExistentialDeposit = async () => {
      if (apiLoadable.state !== 'hasValue') {
        setExistentialDeposit(undefined)
        return
      }

      const api = apiLoadable.contents
      if (!api.consts.balances) {
        throw Error('Balances must exist on api!')
      }
      setExistentialDeposit(api.consts.balances.existentialDeposit as unknown as Balance)
    }

    getExistentialDeposit()
  }, [apiLoadable.state, apiLoadable])

  return existentialDeposit
}

export const useProxiesProxies = (chain: Chain) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpc))

  const proxyProxies = useCallback(
    async (key: string) => {
      if (apiLoadable.state !== 'hasValue') {
        throw Error('apiLoadable must be ready')
      }

      const api = apiLoadable.contents
      if (!api.query.proxy || !api.query.proxy.proxies) {
        throw Error('proxy.proxies must exist on api')
      }
      return api.query.proxy.proxies(key) as unknown as Promise<ProxyDefinition[][]>
    },
    [apiLoadable]
  )

  return { proxyProxies, ready: apiLoadable.state === 'hasValue' }
}

export const useAddressIsProxyDelegatee = (chain: Chain) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpc))

  const addressIsProxyDelegatee = useCallback(
    async (proxy: string, address: string) => {
      if (apiLoadable.state !== 'hasValue') {
        throw Error('apiLoadable must be ready')
      }

      const api = apiLoadable.contents
      if (!api.query.proxy || !api.query.proxy.proxies) {
        throw Error('proxy.proxies must exist on api')
      }
      const res = (await api.query.proxy.proxies(proxy)) as unknown as ProxyDefinition[][]
      // @ts-ignore
      return res[0].some(d => d.delegate.toString() === address && d.proxyType.toString() === 'Any')
    },
    [apiLoadable]
  )

  return { addressIsProxyDelegatee, ready: apiLoadable.state === 'hasValue' }
}
