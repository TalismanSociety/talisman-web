import { useSubstrateToken } from './useSubstrateToken'
import { substrateApiState } from '@/domains/common'
import { computeSubstrateBalance } from '@/util/balances'
import { useChains } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'

export type UseSubstrateBalanceProps = {
  type: 'substrate'
  chainId: string
  address: string
  assetHubAssetId?: number
}

type SubstrateBalance = {
  transferrable: Decimal
  stayAlive: Decimal
}

export const useSubstrateBalance = (props?: UseSubstrateBalanceProps) => {
  const [balance, setBalance] = useState<SubstrateBalance | undefined>()
  const token = useSubstrateToken(
    useMemo(
      () =>
        props?.chainId
          ? {
              chainId: props?.chainId,
              assethubAssetId: props?.assetHubAssetId,
            }
          : undefined,
      [props?.assetHubAssetId, props?.chainId]
    )
  )
  const unsubRef = useRef<() => void>()
  const chains = useChains()
  const chain = useMemo(() => {
    if (!props) return chains['polkadot']
    return chains[props.chainId]
  }, [chains, props])
  const api = useRecoilValueLoadable(substrateApiState(chain?.rpcs?.[0]?.url))

  const fetchBalance = useCallback(() => {
    if (!props || unsubRef.current) return

    if (api.state === 'hasValue') {
      if (props.assetHubAssetId !== undefined) {
        if (!token) return // waiting for token metadata
        if (api.contents.query.assets) {
          api.contents.query.assets.account(props.assetHubAssetId, props.address, acc => {
            const balanceBN = acc.value?.balance?.toBigInt() ?? 0n
            const balance = Decimal.fromPlanck(balanceBN, token.decimals, { currency: token.symbol })
            setBalance({
              transferrable: balance,
              stayAlive: balance,
            })
          })
        }
      } else {
        api.contents.query.system
          .account(props.address, account => {
            setBalance(computeSubstrateBalance(api.contents, account))
          })
          .then(unsub => {
            unsubRef.current = unsub
          })
      }
    }
  }, [props, api.state, api.contents, token])

  useEffect(() => {
    if (!props && balance !== undefined) setBalance(undefined)
  }, [balance, props])

  useEffect(() => {
    setBalance(undefined)
  }, [props?.address, props?.assetHubAssetId, props?.chainId])

  useEffect(() => {
    fetchBalance()
    return () => {
      if (unsubRef.current) {
        unsubRef.current?.()
        unsubRef.current = undefined
      }
    }
  }, [fetchBalance])

  return balance
}
