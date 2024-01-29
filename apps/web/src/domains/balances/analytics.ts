import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
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
  const balances = useRecoilValue(writeableBalancesState)

  useEffect(() => {
    void (async () => {
      const balanceRecords = await Promise.all(
        balances
          .find(balance => balance.status !== 'stale')
          .each.map(async balance => ({
            addressDigest: await digestMessage(balance.address),
            chainId: balance.chainId,
            evmNetworkId: balance.evmNetworkId,
            tokenId: balance.tokenId,
            symbol: balance.token?.symbol,
            usdValue: balance.total.fiat('usd') ?? 0,
          }))
      )

      postHog.capture('Update portfolio balances', {
        $set: {
          portfolioBalances: balanceRecords
            .sort((a, b) => b.usdValue - a.usdValue)
            .filter(balance => balance.usdValue > 0)
            .filter((balance, index) => balance.usdValue > 1 || index < 10),
        },
      })
    })()
  }, [balances, balances.each, postHog])
}
