import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import {
  MIN_SUBTENSOR_ALPHA_STAKE,
  ROOT_NETUID,
  TALISMAN_FEE_BITTENSOR,
} from '@/components/widgets/staking/subtensor/constants'
import { useTokenAmount, useTokenAmountFromPlanck } from '@/domains/common/hooks/useTokenAmount'
import { Decimal } from '@/util/Decimal'

import { bittensorSlippageAtom, maxSlippageAtom } from '../atoms/bittensorSlippage'
import { dTaoConversionRateAtom } from '../atoms/dTaoConversionRate'
import { expectedAlphaAmountAtom } from '../atoms/expectedAlphaAmount'
import { netuidAtom } from '../atoms/netuid'
import { talismanTokenFeeAtom } from '../atoms/talismanTokenFee'
import { type RuntimePoolData } from '../types'
import { useGetSubnetMetagraphByNetuid } from './useGetSubnetMetagraphByNetuid'

type Amount = {
  decimalAmount: Decimal | undefined
  fiatAmount: number | undefined
  localizedFiatAmount: string | undefined
}

type Direction = 'taoToAlpha' | 'alphaToTao'

export const useGetDynamicTaoStakeInfo = ({
  amount,
  netuid,
  direction,
  shouldUpdateFeeAndSlippage,
}: {
  amount: Amount
  netuid: number
  direction: Direction
  shouldUpdateFeeAndSlippage: boolean
}) => {
  const { data, isLoading, error } = useGetSubnetMetagraphByNetuid({ netuid })
  const setBittensorSlippage = useSetAtom(bittensorSlippageAtom)
  const setExpectedAlphaAmount = useSetAtom(expectedAlphaAmountAtom)
  const setDTaoConversionRate = useSetAtom(dTaoConversionRateAtom)
  const setNetuid = useSetAtom(netuidAtom)
  const setTalismanTokenFee = useSetAtom(talismanTokenFeeAtom)

  const maxSlippage = useAtomValue(maxSlippageAtom)
  const raoInputAmount = amount?.decimalAmount?.planck ?? 0n * 10n

  const slippage = calculateSlippage({ pool: data, taoStaked: raoInputAmount })

  const alphaPrice = calculateAlphaPrice({ pool: data })

  const expectedAlpha = calculateExpectedAlpha({
    alphaPrice,
    taoStaked: amount?.decimalAmount?.toNumber() ?? 0,
    slippage,
  })

  const minAlphaUnstake = calculateExpectedAlpha({
    alphaPrice,
    taoStaked: MIN_SUBTENSOR_ALPHA_STAKE,
    slippage,
  })

  // calculate the conversion rate of 1 Tao to alpha with zero slippage
  const alphaToTaoConversionRate = calculateExpectedAlpha({
    alphaPrice,
    taoStaked: 1,
    slippage: 0,
  })

  const taoAmountFromAlpha = calculateTaoFromAlpha({ alphaPrice, alphaStaked: amount?.decimalAmount?.toNumber() ?? 0 })

  const calculateExpectedTaoFromAlpha = ({ alphaStaked }: { alphaStaked: number }) => {
    const expectedTao = calculateExpectedTao({
      alphaPrice,
      alphaStaked: alphaStaked,
      slippage,
    })
    return expectedTao
  }

  const expectedAlphaAmount = useTokenAmount(expectedAlpha.toString())
  const taoAmountFromAlphaTokenAmount = useTokenAmount(taoAmountFromAlpha.toString())
  const formattedAlphaToTaoConversionRate = useTokenAmount(alphaToTaoConversionRate.toString())

  const alphaToTaoSlippage = calculateSlippage({
    pool: data,
    taoStaked: taoAmountFromAlphaTokenAmount.decimalAmount?.planck || 0n,
  })

  const expectedTao = calculateExpectedTao({
    alphaPrice,
    alphaStaked: amount?.decimalAmount?.toNumber() ?? 0,
    slippage: alphaToTaoSlippage, // slippage should be alphaToTaoSlippage
  })

  const expectedTaoAmount = useTokenAmount(expectedTao.toString())

  const alphaPriceWithSlippage = alphaPrice * (1 + maxSlippage / 100)
  const alphaPriceWithSlippageFormatted = useTokenAmount(alphaPriceWithSlippage.toString())

  const taoPriceWithSlippage = alphaPrice * (1 - maxSlippage / 100)
  const taoPriceWithSlippageFormatted = useTokenAmount(taoPriceWithSlippage.toString())

  const taoToAlphaTalismanFee = calculateFee(amount.decimalAmount?.planck ?? 0n, TALISMAN_FEE_BITTENSOR)
  const taoToAlphaTalismanFeeFormatted = useTokenAmountFromPlanck(taoToAlphaTalismanFee)

  const alphaToTaoTalismanFee = calculateFee(expectedTaoAmount.decimalAmount?.planck ?? 0n, TALISMAN_FEE_BITTENSOR)
  const alphaToTaoTalismanFeeFormatted = useTokenAmountFromPlanck(alphaToTaoTalismanFee)

  useEffect(() => {
    setNetuid(netuid)
  }, [netuid, setNetuid])

  useEffect(() => {
    if (!shouldUpdateFeeAndSlippage) return
    // Update expected alpha amount and conversion rate
    setExpectedAlphaAmount(expectedAlphaAmount)
    setDTaoConversionRate(formattedAlphaToTaoConversionRate)

    // Update bittensor slippage
    setBittensorSlippage(direction === 'taoToAlpha' ? slippage : alphaToTaoSlippage)

    // Update talisman token fee based on direction and netuid
    // Rootnet txs should use the taoToAlpha fee calculations
    if (direction === 'taoToAlpha' || netuid === ROOT_NETUID) {
      setTalismanTokenFee(taoToAlphaTalismanFeeFormatted)
    } else {
      setTalismanTokenFee(alphaToTaoTalismanFeeFormatted)
    }
  }, [
    alphaToTaoSlippage,
    alphaToTaoTalismanFeeFormatted,
    direction,
    expectedAlphaAmount,
    formattedAlphaToTaoConversionRate,
    netuid,
    setBittensorSlippage,
    setDTaoConversionRate,
    setExpectedAlphaAmount,
    setTalismanTokenFee,
    shouldUpdateFeeAndSlippage,
    slippage,
    taoToAlphaTalismanFeeFormatted,
  ])

  return {
    slippage,
    alphaToTaoSlippage,
    alphaPrice,
    expectedTaoAmount,
    expectedAlphaAmount,
    alphaPriceWithSlippageFormatted,
    taoPriceWithSlippageFormatted,
    taoToAlphaTalismanFee,
    taoToAlphaTalismanFeeFormatted,
    alphaToTaoTalismanFee,
    alphaToTaoTalismanFeeFormatted,
    isLoading,
    error,
    minAlphaUnstake,
    calculateExpectedTaoFromAlpha,
  }
}

function calculateExpectedAlpha({
  alphaPrice,
  taoStaked,
  slippage,
}: {
  alphaPrice: number
  taoStaked: number
  slippage: number
}): number {
  if (!taoStaked || !alphaPrice) return 0
  const expectedAlpha = (taoStaked / alphaPrice) * (1 - slippage / 100)

  return expectedAlpha
}

function calculateTaoFromAlpha({ alphaPrice, alphaStaked }: { alphaPrice: number; alphaStaked: number }): number {
  if (!alphaStaked || !alphaPrice) return 0
  const expectedTao = alphaStaked * alphaPrice

  return expectedTao
}

function calculateExpectedTao({
  alphaPrice,
  alphaStaked,
  slippage,
}: {
  alphaPrice: number
  alphaStaked: number
  slippage: number
}): number {
  if (!alphaStaked || !alphaPrice) return 0
  const expectedTao = alphaStaked * alphaPrice * (1 - slippage / 100)

  return expectedTao
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

function calculateFee(amount: bigint, fee: number): bigint {
  if (fee < 0) {
    throw new Error('Fee percentage cannot be negative')
  }

  return (amount * BigInt(Math.round(fee * 100))) / BigInt(10000)
}
