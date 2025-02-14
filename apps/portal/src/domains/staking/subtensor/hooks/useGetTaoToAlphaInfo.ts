import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { useTokenAmount } from '@/domains/common/hooks/useTokenAmount'
import { Decimal } from '@/util/Decimal'

import { bittensorSlippageAtom } from '../atoms/bittensorSlippage'
import { type RuntimePoolData } from '../types'
import { useGetSubnetMetagraphByNetuid } from './useGetSubnetMetagraphByNetuid'

type Amount = {
  decimalAmount: Decimal | undefined
  fiatAmount: number | undefined
  localizedFiatAmount: string | undefined
}

export const useGetTaoToAlphaInfo = ({ amount, netuid }: { amount: Amount; netuid: number }) => {
  const { data, isLoading } = useGetSubnetMetagraphByNetuid({ netuid })
  const setBittensorSlippage = useSetAtom(bittensorSlippageAtom)

  const raoInputAmount = amount?.decimalAmount?.planck ?? 0n * 10n

  const taoToAlphaSlippage = calculateSlippage({ pool: data, taoStaked: raoInputAmount })

  const alphaPrice = calculateAlphaPrice({ pool: data })

  const expectedAlpha = calculateExpectedAlpha({
    alphaPrice,
    taoStaked: amount?.decimalAmount?.toNumber() ?? 0,
    taoToAlphaSlippage,
  })

  const expectedAlphaAmount = useTokenAmount(expectedAlpha.toString())

  useEffect(() => {
    setBittensorSlippage(taoToAlphaSlippage)
  }, [setBittensorSlippage, taoToAlphaSlippage])

  return { taoToAlphaSlippage, alphaPrice, expectedAlphaAmount, isLoading }
}

function calculateExpectedAlpha({
  alphaPrice,
  taoStaked,
  taoToAlphaSlippage,
}: {
  alphaPrice: number
  taoStaked: number
  taoToAlphaSlippage: number
}): number {
  if (!taoStaked || !alphaPrice) return 0
  const expectedAlpha = (taoStaked / alphaPrice) * (1 - taoToAlphaSlippage / 100)

  return expectedAlpha
}

// Alpha price is calculated by taoIn / alphaIn
function calculateAlphaPrice({ pool }: { pool: RuntimePoolData | null | undefined }) {
  if (!pool) return 0

  const { alphaIn: alphaInRaw, taoIn: taoInRaw } = pool

  const alphaIn = Number(alphaInRaw.replace(/,/g, ''))
  const taoIn = Number(taoInRaw.replace(/,/g, ''))

  return taoIn / alphaIn
}

/**
 * Calculates slippage when staking TAO in an Alpha/TAO pool.
 * @param pool - The current pool data (alphaOut and taoIn).
 * @param taoStaked - The amount of TAO being staked (in RAO).
 * @returns The slippage percentage with 0.01 precision.
 */
function calculateSlippage({
  pool,
  taoStaked,
}: {
  pool: RuntimePoolData | null | undefined
  taoStaked: bigint
}): number {
  if (!pool || taoStaked === 0n) return 0

  const { alphaOut: alphaOutRaw, taoIn: taoInRaw } = pool

  const alphaOut = BigInt(Number(alphaOutRaw.replace(/,/g, '')))
  const taoIn = BigInt(Number(taoInRaw.replace(/,/g, '')))

  // Compute k (constant product of the pool)
  const k = alphaOut * taoIn

  // Expected Alpha if no slippage (simple ratio)
  const alphaExpected = (alphaOut * taoStaked) / taoIn

  // Actual Alpha received from the AMM formula
  const taoPoolUpdated = taoIn + taoStaked
  const alphaActual = alphaOut - k / taoPoolUpdated

  // Slippage calculation with 0.01 precision
  const slippage = ((alphaExpected - alphaActual) * 10000n) / alphaExpected

  return Number(slippage) / 100 // Convert to a number with 0.01 precision
}
