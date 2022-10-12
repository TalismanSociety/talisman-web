import { encodeAnyAddress, planckToTokens } from '@talismn/util'
import { useLocation } from 'react-router'

import { IndexerTransaction, ParsedTransaction } from './types'

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
        tokenSymbol: tokens[tx.chainId]?.symbol || '???',
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
    if (tx.name === 'Tokens.Transfer') {
      // handle array args
      let args = JSON.parse(tx.args)
      args = Array.isArray(args) ? { from: args[0], to: args[1], amount: args[2], currencyId: args[3] } : args

      return {
        type: 'transfer',
        chainId: tx.chainId,
        tokenSymbol: '???',
        tokenDecimals: 0,
        from: encodeAnyAddress(args?.from, tx.ss58Format),
        to: encodeAnyAddress(args?.to, tx.ss58Format),
        amount: planckToTokens(args?.amount, tokens[tx.chainId]?.decimals || 0),
        fee: planckToTokens(extrinsic?.fee, tokens[tx.chainId]?.decimals || 0),
        tip: planckToTokens(extrinsic?.tip, tokens[tx.chainId]?.decimals || 0),
        success: extrinsic?.success || false,
      }
    }
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
