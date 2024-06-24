import { graphql } from '../../../../../../generated/gql/nova/gql'
import type { Account } from '../../../../accounts'
import { assertChain, useChainState } from '../../../../chains'
import { encodeAddress } from '@polkadot/util-crypto'
import { Decimal } from '@talismn/math'
import request from 'graphql-request'
import { atom, useAtomValue } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useRecoilValue } from 'recoil'

const totalValidatorStakingRewardsAtomFamily = atomFamily(
  ({ apiUrl, address }: { apiUrl: string; address: string }) =>
    atom(
      async () =>
        await request(
          apiUrl,
          graphql(`
            query ValidatorStakingReward($address: String!) {
              accumulatedReward(id: $address) {
                amount
              }
            }
          `),
          { address }
        )
    ),
  (a, b) => a.apiUrl === b.apiUrl && a.address === b.address
)

export const useTotalValidatorStakingRewards = (account: Account) => {
  const chain = useRecoilValue(useChainState())

  assertChain(chain, { hasNominationPools: true })

  const response = useAtomValue(
    totalValidatorStakingRewardsAtomFamily({
      apiUrl: chain.novaIndexerUrl,
      address: encodeAddress(account.address, chain.prefix),
    })
  )

  const amount = response.accumulatedReward?.amount as string | undefined

  return Decimal.fromPlanck(amount ?? 0, chain.nativeToken?.decimals ?? 0, { currency: chain.nativeToken?.symbol })
}
