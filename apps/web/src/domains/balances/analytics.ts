import { useThrottle } from '@talismn/utils/react'
import { usePostHog } from 'posthog-js/react'
import { useUpdateEffect } from 'react-use'
import { useRecoilValue } from 'recoil'
import { writeableBalancesState } from '.'

const digestMessage = async (message: string) => {
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-512', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const useBalancesReportEffect = () => {
  const postHog = usePostHog()
  const balances = useThrottle(useRecoilValue(writeableBalancesState), 5_000)

  // TODO: use normal effect after we redo balances section with proper suspense support
  // right now the first received balance value will be a default empty one
  useUpdateEffect(() => {
    void (async () => {
      const balanceRecords = await Promise.all(
        balances
          .find(balance => balance.status !== 'stale')
          .each.filter(balance => balance.chain === null || !('isCustom' in balance.chain && balance.chain.isCustom))
          .map(async balance => ({
            addressDigest: await digestMessage(balance.address),
            chainId: balance.chainId,
            evmNetworkId: balance.evmNetworkId,
            tokenId: balance.tokenId,
            symbol: balance.token?.symbol,
            usdValue: balance.total.fiat('usd') ?? 0,
          }))
      )

      postHog.capture('Report portfolio balances', {
        $set: {
          portfolioBalances: balanceRecords
            .sort((a, b) => b.usdValue - a.usdValue)
            .filter(balance => balance.usdValue > 0)
            .filter((balance, index) => balance.usdValue > 1 || index < 10),
        },
      })
    })()
  }, [balances, postHog])
}
