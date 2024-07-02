import { useSubstrateBalance, type UseSubstrateBalanceProps } from './useSubstrateBalance'
import { Decimal } from '@talismn/math'
import { useMemo } from 'react'
import { useBalance } from 'wagmi'

type EvmProps = {
  type: 'evm'
  networkId: number
  address: `0x${string}`
  tokenAddress?: `0x${string}`
}

export type UseFastBalanceProps = EvmProps | UseSubstrateBalanceProps

export const useFastBalance = (props?: UseFastBalanceProps) => {
  const substrateBalance = useSubstrateBalance(props?.type === 'substrate' ? props : undefined)
  const evmBalance = useBalance(
    props?.type === 'evm'
      ? {
          address: props.address,
          chainId: props.networkId,
          token: props.tokenAddress,
          query: {
            refetchInterval: 12000,
          },
        }
      : undefined
  )

  return useMemo(() => {
    if (!props) return undefined
    if (props.type === 'substrate') {
      return {
        ...props,
        balance: substrateBalance,
      }
    }
    return {
      ...props,
      balance: evmBalance.data
        ? Decimal.fromPlanck(evmBalance.data.value, evmBalance.data.decimals, { currency: evmBalance.data.symbol })
        : undefined,
    }
  }, [evmBalance.data, props, substrateBalance])
}
