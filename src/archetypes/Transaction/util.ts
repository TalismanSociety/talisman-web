import { encodeAnyAddress } from '@talismn/util'
import BigNumber from 'bignumber.js'
import { useLocation } from 'react-router'

import { IndexerTransaction, ParsedTransaction } from './types'

//
//
//
// BEGIN: Copy-paste from extension codebase
//
//
//

// @talismn/util/src/planckToTokens.ts

export function planckToTokens(planck: string, tokenDecimals: number): string
export function planckToTokens(planck: string, tokenDecimals?: number): string | undefined
export function planckToTokens(planck?: string, tokenDecimals?: number): string | undefined
export function planckToTokens(planck?: string, tokenDecimals?: number): string | undefined {
  if (typeof planck !== 'string' || typeof tokenDecimals !== 'number') return

  const base = new BigNumber(10)
  const exponent = new BigNumber(tokenDecimals).negated()
  const multiplier = base.pow(exponent)

  return new BigNumber(planck).multipliedBy(multiplier).toString(10)
}

// @talismn/util/src/formatDecimals.ts

/**
 * Custom decimal number formatting for Talisman
 * note that the NumberFormat().format() call is the ressource heavy part, it's not worth trying to optimize other parts
 * @param num input number
 * @param digits number of significant digits to display
 * @param locale locale used to format the number
 * @param options formatting options
 * @returns the formatted value
 */
export const formatDecimals = (
  num?: string | number | null,
  digits = 4,
  options: Partial<Intl.NumberFormatOptions> = {},
  locale = 'en-US'
): string => {
  if (num === null || num === undefined) return ''

  const value = new BigNumber(num)
  // very small numbers should display "< 0.0001"
  const minDisplayVal = 1 / Math.pow(10, digits)

  if (value.gt(0) && value.lt(minDisplayVal)) return `< ${formatDecimals(minDisplayVal)}`

  // count digits
  const flooredValue = value.integerValue()
  const intDigits = flooredValue.isEqualTo(0) ? 0 : flooredValue.toString().length

  // we never want to display a rounded up value
  // to prevent JS default rounding, we will remove/truncate insignificant digits ourselves before formatting
  let truncatedValue = value
  //remove insignificant fraction digits
  const excessFractionDigitsPow10 = new BigNumber(10).pow(digits > intDigits ? digits - intDigits : 0)

  truncatedValue = truncatedValue
    .multipliedBy(excessFractionDigitsPow10)
    .integerValue()
    .dividedBy(excessFractionDigitsPow10)

  //remove insignificant integer digits
  const excessIntegerDigits = new BigNumber(intDigits > digits ? intDigits - digits : 0)
  const excessIntegerDigitsPow10 = new BigNumber(10).pow(excessIntegerDigits)
  if (excessIntegerDigits.gt(0))
    truncatedValue = truncatedValue
      .dividedBy(excessIntegerDigitsPow10)
      .integerValue()
      .multipliedBy(excessIntegerDigitsPow10)

  // format

  return Intl.NumberFormat(locale, {
    //compact notation (K, M, B) if above 9999
    notation: truncatedValue.gt(9999) ? 'compact' : 'standard',
    maximumSignificantDigits: digits + (truncatedValue.lt(1) ? 1 : 0),
    ...options,
  }).format(truncatedValue.toNumber())
}

//
//
//
// END: Copy-paste from extension codebase
//
//
//

export const getBlockExplorerUrl = (tx: IndexerTransaction) => {
  const { chainId, blockNumber } = tx
  const data = JSON.parse(tx._data)

  if (!chainId) return

  const eventIndexInBlock: number | undefined = data?.data?.indexInBlock
  const extrinsicIndexInBlock: number | undefined = data?.extrinsic?.data?.indexInBlock

  if (typeof eventIndexInBlock !== 'number' || typeof extrinsicIndexInBlock !== 'number') return

  return `https://${chainId}.subscan.io/extrinsic/${blockNumber}-${extrinsicIndexInBlock}?event=${blockNumber}-${eventIndexInBlock}`
}

const tokens: Record<string, { symbol: string; decimals: number }> = {
  polkadot: { symbol: 'DOT', decimals: 10 },
  kusama: { symbol: 'KSM', decimals: 12 },
  acala: { symbol: 'ACA', decimals: 12 },
  astar: { symbol: 'ASTR', decimals: 18 },
}

export const parseTransaction = (tx: IndexerTransaction): ParsedTransaction | null => {
  try {
    const { extrinsic } = JSON.parse(tx._data) || {}

    if (tx.name === 'Balances.Transfer') {
      // handle array args
      let args = JSON.parse(tx.args)
      args = Array.isArray(args) ? { from: args[0], to: args[1], amount: args[2] } : args

      return {
        type: 'transfer',
        chainId: tx.chainId,
        tokenSymbol: tokens[tx.chainId]?.symbol || 'UNKNOWN',
        tokenDecimals: tokens[tx.chainId]?.decimals || 0,
        from: encodeAnyAddress(args?.from, tx.ss58Format),
        to: encodeAnyAddress(args?.to, tx.ss58Format),
        amount: planckToTokens(args?.amount, tokens[tx.chainId]?.decimals || 0),
        fee: planckToTokens(extrinsic?.fee, tokens[tx.chainId]?.decimals || 0),
        tip: planckToTokens(extrinsic?.tip, tokens[tx.chainId]?.decimals || 0),
        success: extrinsic?.success || false,
      }
    }
    // TODO: Parse event+extrinsic+call from these transaction types into a ParsedTransfer format
    //   if (tx.name === 'Tokens.Transfer')
    //     return {
    //       type: 'transfer',
    //     }
    //   if (tx.name === 'Currencies.Transfer')
    //     return {
    //       type: 'transfer',
    //     }
    //   if (tx.name === 'Assets.Transferred')
    //     return {
    //       type: 'transfer',
    //     }

    if (tx.name === 'Crowdloan.Contributed') {
      // handle array args
      let args = JSON.parse(tx.args)
      args = Array.isArray(args) ? { who: args[0], fundIndex: args[1], amount: args[2] } : args

      return {
        type: 'contribute',
        chainId: tx.chainId,
        tokenSymbol: tokens[tx.chainId]?.symbol || 'UNKNOWN',
        tokenDecimals: tokens[tx.chainId]?.decimals || 0,
        contributor: encodeAnyAddress(args?.who, tx.ss58Format),
        amount: planckToTokens(args?.amount, tokens[tx.chainId]?.decimals || 0),
        // TODO: look up fund info (e.g. parachain name)
        fund: args?.fundIndex,
        fee: planckToTokens(extrinsic?.fee, tokens[tx.chainId]?.decimals || 0),
        tip: planckToTokens(extrinsic?.tip, tokens[tx.chainId]?.decimals || 0),
        success: extrinsic?.success || false,
      }
    }

    if (tx.name === 'Staking.Bonded') {
      // handle array args
      let args = JSON.parse(tx.args)
      args = Array.isArray(args) ? { staker: args[0], amount: args[1] } : args

      return {
        type: 'stake',
        chainId: tx.chainId,
        tokenSymbol: tokens[tx.chainId]?.symbol || 'UNKNOWN',
        tokenDecimals: tokens[tx.chainId]?.decimals || 0,
        staker: encodeAnyAddress(args?.staker, tx.ss58Format),
        amount: planckToTokens(args?.amount, tokens[tx.chainId]?.decimals || 0),
        fee: planckToTokens(extrinsic?.fee, tokens[tx.chainId]?.decimals || 0),
        tip: planckToTokens(extrinsic?.tip, tokens[tx.chainId]?.decimals || 0),
        success: extrinsic?.success || false,
      }
    }
    // TODO: Parse event+extrinsic+call from this transaction type into a ParsedTransfer format
    //   if (tx.name === 'Staking.Unbonded')
    //     return {
    //       type: 'unstake',
    //     }

    // TODO: Parse event+extrinsic+call from these transaction types into a ParsedTransfer format
    //   if (tx.name === 'Dex.AddLiquidity')
    //     return {
    //       type: 'add liquidity',
    //     }
    //   if (tx.name === 'Dex.RemoveLiquidity')
    //     return {
    //       type: 'remove liquidity',
    //     }

    // TODO: Parse event+extrinsic+call from these transaction types into a ParsedTransfer format
    //   if (tx.name === 'Dex.AddProvision')
    //     return {
    //       type: 'add provision',
    //     }
    //   if (tx.name === 'Dex.RemoveProvision')
    //     return {
    //       type: 'remove provision',
    //     }

    // TODO: Parse event+extrinsic+call from this transaction type into a ParsedTransfer format
    // if (tx.name === 'Dex.Swap')
    //   return {
    //     type: 'swap',
    //     chainId: tx.chainId,
    //     tokenSymbol: tokens[tx.chainId]?.symbol || 'UNKNOWN',
    //     tokenDecimals: tokens[tx.chainId]?.decimals || 0,
    //     fee: planckToTokens(extrinsic?.fee, tokens[tx.chainId]?.decimals || 0),
    //     tip: planckToTokens(extrinsic?.tip, tokens[tx.chainId]?.decimals || 0),
    //     success: extrinsic?.success || false,
    //   }
  } catch (error) {
    console.error('Failed to parse transaction', error)
    return null
  }

  console.warn('Unhandled transaction type', tx.name)
  return null
}

export const parseDataAddress = (dataAddress: any) =>
  ['Id', 'AccountId'].includes(dataAddress?.__kind) ? dataAddress?.value : dataAddress

export function useUrlParams(params: string[]): string[] {
  const paramData: string[] = []

  const { search } = useLocation()
  const urlParams = new URLSearchParams(search)

  params.forEach((param: string) => {
    const res = urlParams.get(param)
    if (res) {
      paramData.push(res)
    }
  })

  return paramData
}
