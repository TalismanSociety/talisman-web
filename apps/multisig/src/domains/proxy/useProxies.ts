import { useRecoilValueLoadable } from 'recoil'
import { Address } from '@util/addresses'
import { Chain } from '../chains'
import { pjsApiSelector } from '../chains/pjs-api'
import { useEffect, useState } from 'react'
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
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpcs))
  const [proxies, setProxies] = useState<ProxyDefinition[] | undefined>()
  const [proxyPalletSupported, setProxyPalletSupported] = useState<boolean | undefined>()
  const [currentAddress, setCurrentAddress] = useState(proxiedAddress.toSs58(chain))

  // trigger reload
  useEffect(() => {
    if (proxiedAddress.toSs58(chain) === currentAddress) return

    setProxies(undefined)
    setProxyPalletSupported(undefined)
    setCurrentAddress(proxiedAddress.toSs58(chain))
  }, [currentAddress, proxiedAddress, chain])

  useEffect(() => {
    if (apiLoadable.state !== 'hasValue' || !apiLoadable.contents) return

    if (!apiLoadable.contents.query.proxy || !apiLoadable.contents.query.proxy.proxies) {
      setProxyPalletSupported(false)
      return
    }

    let unsubscribe: VoidFn | undefined

    apiLoadable.contents.query.proxy
      .proxies(currentAddress, result => {
        const proxiesList: ProxyDefinition[] = []
        const expectedBlockTimeSec = expectedBlockTime(apiLoadable.contents).toNumber()
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
      })
      .then(unsub => {
        unsubscribe = unsub
      })

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [apiLoadable.contents, apiLoadable.state, currentAddress])

  const updatedList = proxiedAddress.toSs58(chain) === currentAddress ? proxies : undefined

  return {
    proxies: updatedList?.filter((proxy: ProxyDefinition) => {
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
