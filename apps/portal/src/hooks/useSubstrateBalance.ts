import { chainsState } from '@/domains/chains'
import { substrateApiState } from '@/domains/common'
import { Decimal } from '@talismn/math'
import { BigMath } from '@talismn/util'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'

export type UseSubstrateBalanceProps = {
  type: 'substrate'
  chainId: string
  address: string
}

export const useSubstrateBalance = (props?: UseSubstrateBalanceProps) => {
  const [balance, setBalance] = useState<Decimal | undefined>()
  const unsubRef = useRef<() => void>()
  const chainsLoadable = useRecoilValueLoadable(chainsState)
  const api = useRecoilValueLoadable(
    substrateApiState(
      chainsLoadable.state === 'hasValue' && props
        ? chainsLoadable.contents.find(c => c.id === props.chainId)?.rpc
        : // default to polkadot
          'wss://polkadot.api.onfinality.io/public'
    )
  )

  const fetchBalance = useCallback(() => {
    if (!props) return

    if (api.state === 'hasValue') {
      api.contents.query.system
        .account(props.address, account => {
          const ed = api.contents.consts.balances.existentialDeposit
          const reserved = account.data.reserved.toBigInt()
          const frozen = account.data.frozen.toBigInt()
          const untouchable = BigMath.max(frozen - reserved, 0n)
          // make sure untouchable is never less than the existentialDeposit
          const untouchableOrEd = BigMath.max(untouchable, ed.toBigInt())
          const free = account.data.free.toBigInt()
          const transferableBN = BigMath.max(free - untouchableOrEd, 0n)

          const decimals = api.contents.registry.chainDecimals[0] ?? 10
          const symbol = api.contents.registry.chainTokens[0] ?? 'DOT'
          setBalance(Decimal.fromPlanck(transferableBN, decimals, { currency: symbol }))
        })
        .then(unsub => {
          unsubRef.current = unsub
        })
    }
  }, [props, api])

  useEffect(() => {
    if (!props && balance !== undefined) setBalance(undefined)
  }, [balance, props])

  useEffect(() => {
    fetchBalance()
    return () => {
      unsubRef.current?.()
    }
  }, [fetchBalance])

  return balance
}
