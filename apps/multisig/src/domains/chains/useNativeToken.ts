import { useRecoilValueLoadable } from 'recoil'
import { tokenByIdQuery } from './tokens'

export const useNativeToken = (chainId: string) => {
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(chainId || null))

  if (nativeToken.state === 'loading') return { loading: true }
  if (nativeToken.state === 'hasError') return { error: nativeToken.contents }
  return { nativeToken: nativeToken.contents }
}
