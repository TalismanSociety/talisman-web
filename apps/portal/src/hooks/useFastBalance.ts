import { useSubstrateBalance, type UseSubstrateBalanceProps } from './useSubstrateBalance'
import { Decimal } from '@talismn/math'
import { useMemo } from 'react'
import { zeroAddress } from 'viem'
import { useBalance } from 'wagmi'

type EvmProps = {
  type: 'evm'
  networkId: number
  address: `0x${string}`
  tokenAddress?: `0x${string}`
}

export type UseFastBalanceProps = EvmProps | UseSubstrateBalanceProps

export const useFastBalance = (props?: UseFastBalanceProps) => {
  const substrateBalance = useSubstrateBalance(
    useMemo(() => (props?.type === 'substrate' ? props : undefined), [props])
  )

  const evmBalance = useBalance(
    props?.type === 'evm'
      ? {
          address: props.address,
          chainId: props.networkId,
          token: props.tokenAddress === zeroAddress ? undefined : props.tokenAddress,
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
    const ethBalance = evmBalance.data
      ? Decimal.fromPlanck(evmBalance.data.value, evmBalance.data.decimals, { currency: evmBalance.data.symbol })
      : undefined
    return {
      ...props,
      balance: ethBalance
        ? {
            transferrable: ethBalance,
            stayAlive: ethBalance,
          }
        : undefined,
    }
  }, [evmBalance.data, props, substrateBalance])
}
