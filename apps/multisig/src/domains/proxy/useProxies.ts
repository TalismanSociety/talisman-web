import { useRecoilValueLoadable } from 'recoil'
import { Address } from '@util/addresses'
import { Chain } from '../chains'
import { pjsApiSelector } from '../chains/pjs-api'
import { useEffect, useState } from 'react'
import { expectedBlockTime } from '../common/substratePolyfills'

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
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpcs))
  const [proxies, setProxies] = useState<ProxyDefinition[] | undefined>()
  const [proxyPalletSupported, setProxyPalletSupported] = useState<boolean | undefined>()

  const currentAddress = proxiedAddress.toSs58(chain)

  // trigger reload
  useEffect(() => {
    setProxies(undefined)
    setProxyPalletSupported(undefined)
  }, [currentAddress, chain.chainName])

  useEffect(() => {
    if (apiLoadable.state !== 'hasValue' || !apiLoadable.contents) return

    if (!apiLoadable.contents.query.proxy || !apiLoadable.contents.query.proxy.proxies) {
      setProxyPalletSupported(false)
      return
    }

    const unsubscribe = apiLoadable.contents.query.proxy.proxies(currentAddress, result => {
      const proxiesList: ProxyDefinition[] = []
      const expectedBlockTimeSec = expectedBlockTime(apiLoadable.contents).toNumber()
      result[0].forEach(proxy => {
        const delegate = Address.fromSs58(proxy.delegate.toString())
        if (!delegate) return
        proxiesList.push({
          delegate,
          proxyType: proxy.proxyType.toString(),
          delay: proxy.delay.toNumber(),
          duration: proxy.delay.toNumber() * expectedBlockTimeSec,
        })
      })
      setProxies(proxiesList)
      setProxyPalletSupported(true)
    })

    return () => {
      unsubscribe.then((unsub: any) => unsub())
    }
  }, [apiLoadable.contents, apiLoadable.state, currentAddress])

  return {
    proxies: proxies?.filter((proxy: ProxyDefinition) => {
      const { delegateeAddress, type } = filter
      let ok = true
      if (delegateeAddress && !delegateeAddress.isEqual(proxy.delegate)) ok = false
      if (type && !type.includes(proxy.proxyType)) ok = false
      return ok
    }),
    proxyPalletSupported,
    loading: apiLoadable.state !== 'hasValue' || proxyPalletSupported === undefined || proxies === undefined,
  }
}
