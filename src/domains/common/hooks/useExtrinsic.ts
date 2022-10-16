import { AddressOrPair, AugmentedSubmittables, SignerOptions } from '@polkadot/api/types'
import { useCallback, useState } from 'react'
import { useRecoilCallback } from 'recoil'

import { apiState } from '../../chains/recoils'
import { extensionState } from '../../extension/recoils'

type ReturnTypeWithArgs<T extends (...args: any[]) => any, TParams> = T extends {
  (...args: infer A1): infer R1
  (...args: infer A2): infer R2
  (...args: infer A3): infer R3
}
  ? TParams extends A1
    ? R1
    : TParams extends A2
    ? R2
    : TParams extends A3
    ? R3
    : never
  : T extends { (...args: infer A1): infer R1; (...args: infer A2): infer R2 }
  ? TParams extends A1
    ? R1
    : TParams extends A2
    ? R2
    : never
  : T extends { (...args: infer A1): infer R1 }
  ? TParams extends A1
    ? R1
    : never
  : never

type ExtrinsicModules = {
  [P in keyof AugmentedSubmittables<'promise'>]: PickKnownKeys<AugmentedSubmittables<'promise'>[P]>
}

const useExtrinsic = <
  TModuleName extends keyof ExtrinsicModules,
  TMethodName extends keyof ExtrinsicModules[TModuleName]
>(
  module: TModuleName,
  method: TMethodName
) => {
  type TExtrinsic = ExtrinsicModules[TModuleName][TMethodName]
  type TReturn = ReturnTypeWithArgs<
    ReturnType<TExtrinsic>['signAndSend'],
    [AddressOrPair, Partial<SignerOptions> | undefined]
  >

  const [loadable, setLoadable] = useState<
    | { state: 'idle'; contents: undefined }
    | { state: 'loading'; contents: Promise<any> }
    | { state: 'hasValue'; contents: Awaited<TReturn> }
    | { state: 'hasError'; contents: any }
  >({ state: 'idle', contents: undefined })

  const reset = useCallback(() => setLoadable({ state: 'idle', contents: undefined }), [])

  const signAndSend = useRecoilCallback(
    ({ snapshot }) =>
      async (account: AddressOrPair, ...params: Parameters<TExtrinsic>) => {
        const promiseFunc = async () => {
          const api = await snapshot.getPromise(apiState)
          const extension = await snapshot.getPromise(extensionState)

          const func = api.tx[module][method].bind(api.tx[module])

          return func(...params).signAndSend(account, {
            signer: extension?.signer,
          }) as Promise<TReturn>
        }

        const promise = promiseFunc()

        setLoadable({ state: 'loading', contents: promise })

        try {
          const result = await promise
          setLoadable({ state: 'hasValue', contents: result })
          return result
        } catch (error) {
          setLoadable({ state: 'hasError', contents: error })
        }
      },
    []
  )

  return { ...loadable, signAndSend, reset }
}

export default useExtrinsic
