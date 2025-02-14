import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { bittensorSlippageAtom } from '../atoms/bittensorSlippage'
import { type RuntimePoolData } from '../types'
import { useGetSubnetMetagraphByNetuid } from './useGetSubnetMetagraphByNetuid'

export const useGetAlphaToTaoSlippage = ({
  alphaInputAmount,
  netuid,
}: {
  alphaInputAmount: bigint
  netuid: number
}) => {
  const { data, isLoading } = useGetSubnetMetagraphByNetuid({ netuid })
  const setBittensorSlippage = useSetAtom(bittensorSlippageAtom)

  // Convert Alpha to RAO
  const raoInputAmount = alphaInputAmount * 10n

  const alphaToTaoSlippage = calculateAlphaSlippage({ pool: data, alphaStaked: raoInputAmount })

  useEffect(() => {
    setBittensorSlippage(alphaToTaoSlippage)
  }, [setBittensorSlippage, alphaToTaoSlippage])

  return { alphaToTaoSlippage, isLoading }
}

/**
 * Calculates slippage when staking Alpha in an Alpha/TAO pool.
 * @param pool - The current pool data (alphaOut and taoIn).
 * @param alphaStaked - The amount of Alpha being staked (in RAO).
 * @returns The slippage percentage with 0.01 precision.
 */
function calculateAlphaSlippage({
  pool,
  alphaStaked,
}: {
  pool: RuntimePoolData | null | undefined
  alphaStaked: bigint
}): number {
  if (!pool || alphaStaked === 0n) return 0

  const { alphaOut: alphaPoolRaw, taoIn: taoPoolRaw } = pool

  const alphaPool = BigInt(Number(alphaPoolRaw.replace(/,/g, '')))
  const taoPool = BigInt(Number(taoPoolRaw.replace(/,/g, '')))

  // Compute k (constant product of the pool)
  const k = alphaPool * taoPool

  // Expected TAO if no slippage (simple ratio)
  const taoExpected = (taoPool * alphaStaked) / alphaPool

  // Actual TAO received from the AMM formula
  const alphaPoolUpdated = alphaPool + alphaStaked
  const taoActual = taoPool - k / alphaPoolUpdated

  // Slippage calculation
  const slippage = ((taoExpected - taoActual) * 10000n) / taoExpected

  return Number(slippage) / 100 // Convert to a number with 0.01 precision
}
