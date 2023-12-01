import { Address } from '@util/addresses'
import { Chain } from '../chains'
import { useApi } from '../chains/pjs-api'
import { useCallback, useEffect, useRef, useState } from 'react'
import { expectedBlockTime } from '../common/substratePolyfills'
import { VoidFn } from '@polkadot/api/types'

type Filter = {
  delegateeAddress?: Address
  type?: string
}

type ProxyDefinition = {
  delegate: Address
  proxyType: string
  delay: number
  duration: number
}

export const useProxies = (proxiedAddress: Address, chain: Chain, filter: Filter = {}) => {
  const { api } = useApi(chain.rpcs)
  const [proxies, setProxies] = useState<ProxyDefinition[] | undefined>()
  const [proxyPalletSupported, setProxyPalletSupported] = useState<boolean | undefined>()
  const [currentAddress, setCurrentAddress] = useState(proxiedAddress.toSs58(chain))
  const [queriedAddress, setQueriedAddress] = useState<string | undefined>()
  const unsub = useRef<VoidFn | null>(null)

  const subscribeProxies = useCallback(async () => {
    if (!api) return

    if (!api.query.proxy || !api.query.proxy.proxies) {
      // proxy pallet not supported
      setProxyPalletSupported(false)
      setProxies([])
      return
    }
    const u = await api.query.proxy.proxies(currentAddress, result => {
      const proxiesList: ProxyDefinition[] = []
      const expectedBlockTimeSec = expectedBlockTime(api).toNumber()
      result[0].forEach(proxy => {
        const delegate = Address.fromSs58(proxy.delegate.toString())
        if (!delegate) return
        const delay = proxy.delay.toNumber()
        proxiesList.push({
          delegate,
          proxyType: proxy.proxyType.toString(),
          delay,
          duration: delay * expectedBlockTimeSec,
        })
      })
      setProxies(proxiesList)
      setProxyPalletSupported(true)
      setQueriedAddress(currentAddress)
    })

    unsub.current = u
  }, [api, currentAddress])

  useEffect(() => {
    if (proxiedAddress.toSs58(chain) === currentAddress) return
    setQueriedAddress(undefined)
    setCurrentAddress(proxiedAddress.toSs58(chain))
  }, [proxiedAddress, chain, currentAddress])

  // trigger reload
  useEffect(() => {
    if (unsub.current) {
      unsub.current()
      unsub.current = null
    }
    setProxies(undefined)
    setProxyPalletSupported(undefined)
    // reload when address or chain is changed
  }, [currentAddress, chain.chainName])

  useEffect(() => {
    if (proxies) return
    subscribeProxies()
  }, [proxies, subscribeProxies])

  const updatedList = proxiedAddress.toSs58(chain) === currentAddress ? proxies : undefined

  return {
    proxies:
      queriedAddress === currentAddress
        ? updatedList?.filter((proxy: ProxyDefinition) => {
            const { delegateeAddress, type } = filter
            let ok = true
            if (delegateeAddress && !delegateeAddress.isEqual(proxy.delegate)) ok = false
            if (type && !type.includes(proxy.proxyType)) ok = false
            return ok
          })
        : undefined,
    proxyPalletSupported,
    loading: !api || proxyPalletSupported === undefined || proxies === undefined,
  }
}
