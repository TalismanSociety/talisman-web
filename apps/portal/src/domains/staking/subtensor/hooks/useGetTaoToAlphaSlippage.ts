import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { bittensorSlippageAtom } from '../atoms/bittensorSlippage'
import { type RuntimePoolData } from '../types'
import { useGetSubnetMetagraphByNetuid } from './useGetSubnetMetagraphByNetuid'

export const useGetTaoToAlphaSlippage = ({ taoInputAmount, netuid }: { taoInputAmount: bigint; netuid: number }) => {
  const { data, isLoading } = useGetSubnetMetagraphByNetuid({ netuid })
  const setBittensorSlippage = useSetAtom(bittensorSlippageAtom)

  const raoInputAmount = taoInputAmount * 10n

  const taoToAlphaSlippage = calculateSlippage({ pool: data, taoStaked: raoInputAmount })

  useEffect(() => {
    setBittensorSlippage(taoToAlphaSlippage)
  }, [setBittensorSlippage, taoToAlphaSlippage])

  return { taoToAlphaSlippage, isLoading }
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
