import { atom, useAtomValue } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useRecoilValue } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import { useChainState } from '@/domains/chains/hooks'
import { assertChain } from '@/domains/chains/utils'
import { Decimal } from '@/util/Decimal'

// Dummy test commit.
const totalDappStakingRewardsAtomFamily = atomFamily(
  ({ apiUrl, address }: { apiUrl: string; address: string }) =>
    atom(
      async () =>
        await fetch(new URL(`./earned/${address}`, apiUrl.replace('v3', 'v1'))).then(
          async response => (await response.json()) as number
        )
    ),
  (a, b) => a.apiUrl === b.apiUrl && a.address === b.address
)

export const useTotalDappStakingRewards = (account: Account) => {
  const chain = useRecoilValue(useChainState())

  assertChain(chain, { hasDappStaking: true })

  return Decimal.fromUserInput(
    useAtomValue(
      totalDappStakingRewardsAtomFamily({ apiUrl: chain.dappStakingApi, address: account.address })
    ).toString(),
    chain.nativeToken?.decimals ?? 0,
    { currency: chain.nativeToken?.symbol }
  )
}
