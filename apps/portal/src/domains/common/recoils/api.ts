import { ApiPromise, WsProvider } from '@polkadot/api'
import * as AvailJsSdk from 'avail-js-sdk'
import { atom, useAtom } from 'jotai'
import { useEffect, useRef } from 'react'
import { selectorFamily, useRecoilCallback } from 'recoil'

export const substrateApiState = selectorFamily<ApiPromise, string | undefined>({
  key: 'SubstrateApiState',
  // DO NOT USE any atom dependency here, nothing should invalidate an api object once created
  get: endpoint => async () => {
    const isAvail = endpoint && /([/.-]avail-)|([/.-]avail\.)/.test(endpoint)

    if (isAvail)
      return await ApiPromise.create({
        provider: new WsProvider(endpoint),
        types: AvailJsSdk.spec.types,
        rpc: AvailJsSdk.spec.rpc,
        signedExtensions: AvailJsSdk.spec.signedExtensions,
        noInitWarn: true,
      })

    return await ApiPromise.create({ provider: new WsProvider(endpoint), noInitWarn: true })
  },
  dangerouslyAllowMutability: true,
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const substrateApiGetterAtom = atom<{
  getApi: (endpoint: string) => Promise<ApiPromise>
} | null>(null)

export const useSetJotaiSubstrateApiState = () => {
  const initRef = useRef(false)
  const [substrateApiGetter, setSubstrateApiGetter] = useAtom(substrateApiGetterAtom)

  const getSubstrateApi = useRecoilCallback(
    ({ snapshot }) =>
      (rpc: string) =>
        snapshot.getPromise(substrateApiState(rpc))
  )

  useEffect(() => {
    if (substrateApiGetter === null && !initRef.current) {
      // somehow this causes infinite rerender and substrateApiGetter is always null
      setSubstrateApiGetter({ getApi: getSubstrateApi })
      // this is a hack to prevent infinite rerender
      initRef.current = true
    }
  }, [getSubstrateApi, setSubstrateApiGetter, substrateApiGetter])
}
