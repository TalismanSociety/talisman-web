import type { Chain as ViemChain } from 'viem/chains'
import { useEffect, useMemo, useState } from 'react'
import { createPublicClient, erc20Abi, fallback, http, zeroAddress } from 'viem'

import { allEvmChains } from '@/components/widgets/swap/allEvmChains.ts'
import { Decimal } from '@/util/Decimal'

import type { UseSubstrateBalanceProps } from './useSubstrateBalance'
import { useSubstrateBalance } from './useSubstrateBalance'

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

  const evmBalance = useEvmBalance(props)

  return useMemo(() => {
    if (!props) return undefined
    if (props.type === 'substrate') return { ...props, balance: substrateBalance }
    if (props.type === 'evm')
      return { ...props, balance: evmBalance ? { transferrable: evmBalance, stayAlive: evmBalance } : undefined }
    return undefined
  }, [evmBalance, props, substrateBalance])
}

const useEvmBalance = (props?: UseFastBalanceProps) => {
  const [evmBalance, setEvmBalance] = useState<Decimal | undefined>()

  useEffect(() => {
    const abortController = new AbortController()

    if (props?.type !== 'evm') return setEvmBalance(undefined)

    const chain: ViemChain | undefined = Object.values(allEvmChains).find(chain => chain?.id === props.networkId)
    const rpcUrls = chain?.rpcUrls.default.http
    if (!chain || !rpcUrls?.length) return setEvmBalance(undefined)

    const client = createPublicClient({
      transport: fallback(
        rpcUrls.map(rpc => http(rpc, { retryCount: 0 })),
        { retryCount: 0 }
      ),
      chain,
      batch: { multicall: true },
    })

    let timeoutId: NodeJS.Timeout | null = null
    const timeoutMs = 15_000 // 15 seconds

    const refetch = async () => {
      // native token
      if (!props.tokenAddress || props.tokenAddress === zeroAddress) {
        setEvmBalance(undefined)
        const balance = await client.getBalance({ address: props.address })
        if (abortController.signal.aborted) return

        setEvmBalance(
          Decimal.fromPlanck(balance, chain.nativeCurrency.decimals, { currency: chain.nativeCurrency.symbol })
        )
        return setTimeout(refetch, timeoutMs)
      }

      // erc20 token
      const calls = await client.multicall({
        contracts: [
          {
            abi: erc20Abi,
            functionName: 'balanceOf',
            address: props.tokenAddress!,
            args: [props.address],
          },
          {
            abi: erc20Abi,
            functionName: 'symbol',
            address: props.tokenAddress!,
          },
          {
            abi: erc20Abi,
            functionName: 'decimals',
            address: props.tokenAddress!,
          },
        ],
      })
      if (abortController.signal.aborted) return

      const [balanceCall, symbolCall, decimalsCall] = calls

      const symbol = symbolCall.status === 'success' ? symbolCall.result : 'Unknown'
      const decimals = decimalsCall.status === 'success' ? decimalsCall.result : 18

      if (balanceCall.status === 'failure') return setEvmBalance(undefined)
      setEvmBalance(Decimal.fromPlanck(balanceCall.result as bigint, decimals, { currency: symbol }))
      return setTimeout(refetch, timeoutMs)
    }

    timeoutId = setTimeout(refetch, timeoutMs)
    abortController.signal.addEventListener = () => clearTimeout(timeoutId)

    refetch()

    return () => abortController.abort()
  }, [props])

  return evmBalance
}
