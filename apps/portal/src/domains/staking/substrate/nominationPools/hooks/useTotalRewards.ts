import { encodeAddress } from '@polkadot/util-crypto'
import request from 'graphql-request'
import { atom, useAtomValue } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useRecoilValue } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import { useChainState } from '@/domains/chains/hooks'
import { assertChain } from '@/domains/chains/utils'
import { graphql } from '@/generated/gql/nova/gql'
import { Decimal } from '@/util/Decimal'

const totalNominationPoolRewardsAtomFamily = atomFamily(
  ({ apiUrl, address }: { apiUrl: string; address: string }) =>
    atom(
      async () =>
        await request(
          apiUrl,
          graphql(`
            query PoolRewards($address: String!) {
              accumulatedPoolReward(id: $address) {
                amount
              }
            }
          `),
          { address }
        )
    ),
  (a, b) => a.apiUrl === b.apiUrl && a.address === b.address
)

export const useTotalNominationPoolRewards = (account: Account) => {
  const chain = useRecoilValue(useChainState())

  assertChain(chain, { hasNominationPools: true })
  if (!chain.novaIndexerUrl)
    throw new Error(`Cannot fetch totalNominationPoolRewards for chain ${chain.id}: no indexer`)

  const accountFormat = chain.prefix

  try {
    // eslint-disable-next-line no-var
    var response = useAtomValue(
      totalNominationPoolRewardsAtomFamily({
        apiUrl: chain.novaIndexerUrl,
        address: encodeAddress(account.address, accountFormat),
      })
    )
  } catch (e) {
    return undefined
  }

  const amount = response.accumulatedPoolReward?.amount as string | undefined

  return Decimal.fromPlanck(amount ?? 0, chain.nativeToken?.decimals ?? 0, { currency: chain.nativeToken?.symbol })
}
