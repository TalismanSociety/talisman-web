import { substrateApiState } from '@/domains/common'
import { useChains } from '@talismn/balances-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'

export type UseSubstrateTokenProps = {
  chainId: string
  assethubAssetId?: number
}

export const useSubstrateToken = (props?: UseSubstrateTokenProps) => {
  const [token, setToken] = useState<{
    symbol: string
    name: string
    decimals: number
  } | null>()
  const chains = useChains()
  const chain = useMemo(() => (props ? chains[props.chainId] : undefined), [chains, props])
  const api = useRecoilValueLoadable(
    // default to polkadot
    substrateApiState(chain?.rpcs?.[0]?.url ?? 'wss://polkadot.api.onfinality.io/public')
  )

  const getTokenDetails = useCallback(async () => {
    if (api.state !== 'hasValue' || token || !props) return

    await api.contents.isReady
    if (props.assethubAssetId !== undefined) {
      if (!api.contents.query.assets) return
      const metadata = await api.contents.query.assets.metadata(props.assethubAssetId)
      setToken({
        symbol: metadata.symbol.toHuman()?.toString() ?? '',
        name: metadata.name.toHuman()?.toString() ?? '',
        decimals: metadata.decimals.toNumber(),
      })
    } else {
      // default to polkadot
      const decimals = api.contents.registry.chainDecimals[0] ?? 10
      const symbol = api.contents.registry.chainTokens[0] ?? 'DOT'
      const name = chain?.name ?? 'Polkadot'
      setToken({ symbol, name, decimals })
    }
  }, [api.contents, api.state, chain?.name, props, token])

  useEffect(() => {
    getTokenDetails()
  }, [getTokenDetails])

  useEffect(() => {
    return () => {
      setToken(null)
    }
  }, [props?.assethubAssetId, props?.chainId])

  return token
}
