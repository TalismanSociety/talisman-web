import type { SubmittableExtrinsic } from '@polkadot/api/types'
import { Decimal } from '@talismn/math'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  tx: SubmittableExtrinsic<'promise'>
  fromAddress: string
}

export const useSubstrateEstimateGas = (props?: Props) => {
  const [gas, setGas] = useState<Decimal>()

  const estimateGas = useCallback(async () => {
    if (!props) return
    const paymentInfo = await props.tx.paymentInfo(props.fromAddress)
    const decimals = props.tx.registry.chainDecimals[0] ?? 10 // default to polkadot decimals 10
    const symbol = props.tx.registry.chainTokens[0] ?? 'DOT' // default to polkadot symbol 'DOT'

    if (paymentInfo) setGas(Decimal.fromPlanck(paymentInfo.partialFee.toBigInt(), decimals, { currency: symbol }))
  }, [props])

  // by setting Gas to undefined, the next useEffect will run automatically when props is available
  // hence giving a refetch effect
  const refetch = useCallback(() => {
    setGas(undefined)
  }, [])

  useEffect(() => {
    if (props && gas === undefined) estimateGas()
  }, [estimateGas, gas, props])

  return { gas, refetch }
}
