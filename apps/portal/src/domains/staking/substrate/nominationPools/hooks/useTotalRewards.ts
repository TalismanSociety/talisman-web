import { encodeAnyAddress } from '@talismn/util'
import request from 'graphql-request'
import { atom, useAtomValue } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useRecoilValue } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import { useChainState } from '@/domains/chains/hooks'
import { assertChain } from '@/domains/chains/utils'
import { graphql } from '@/generated/gql/nova/gql'
import { Decimal } from '@/util/Decimal'

export const useTotalNominationPoolRewards = (account: Account) => {
  const chain = useRecoilValue(useChainState())
  assertChain(chain, { hasNominationPools: true })

  return useAtomValue(
    totalNompoolRewardsAtomFamily({
      chain,
      address: encodeAnyAddress(account.address, chain.prefix),
    })
  )
}

type TotalNompoolRewardsProps = {
  chain: {
    id?: string
    novaIndexerUrl: string
    nativeToken:
      | {
          symbol: string
          decimals: number
        }
      | undefined
  }
  address: string
}

const totalNompoolRewardsAtomFamily = atomFamily(
  ({ chain, address }: TotalNompoolRewardsProps) =>
    atom(async () => {
      if (chain.id === 'analog-timechain') return await fetchAnalogTotalNompoolRewards({ chain, address })
      return await fetchTotalNompoolRewards({ chain, address })
    }),
  (a, b) => a.chain.id === b.chain.id && a.address === b.address
)

const fetchTotalNompoolRewards = async ({ chain, address }: TotalNompoolRewardsProps): Promise<Decimal | undefined> => {
  const decimals = chain.nativeToken?.decimals ?? 0
  const currency = chain.nativeToken?.symbol

  if (!chain.novaIndexerUrl)
    throw new Error(`Cannot fetch totalNominationPoolRewards for chain ${chain.id}: no indexer`)

  const response = await request(
    chain.novaIndexerUrl,
    graphql(`
      query PoolRewards($address: String!) {
        accumulatedPoolReward(id: $address) {
          amount
        }
      }
    `),
    { address }
  )

  if (response?.accumulatedPoolReward === null) {
    return Decimal.fromPlanck(0, decimals, { currency })
  }

  const amount = response?.accumulatedPoolReward?.amount
  if (typeof amount !== 'string')
    throw new Error(`Total rewards request failed (totalRewards type is not string) ${JSON.stringify(response)}`)

  return Decimal.fromPlanck(amount ?? 0, decimals, { currency })
}

// Analog's API expects addresses to be formatted with this prefix,
// Even if the chain runtime switches to a unified address prefix, this API might keep using the old prefix for a while!
// Thus, we should hardcode the prefix here instead of using the one from chaindata.
const analogPrefix = 12850
const analogTotalNompoolRewardsApiUrl = (address: string) =>
  `https://explorer-api.analog.one/api/nominationPayouts/${encodeAnyAddress(address, analogPrefix)}`

const fetchAnalogTotalNompoolRewards = async ({
  chain,
  address,
}: TotalNompoolRewardsProps): Promise<Decimal | undefined> => {
  const decimals = chain.nativeToken?.decimals ?? 0
  const currency = chain.nativeToken?.symbol

  const response = await fetch(analogTotalNompoolRewardsApiUrl(address))
  const json = await response.json()
  if (json?.status === 404 && json?.message?.startsWith('Payout for this') && json?.message?.endsWith('not found')) {
    return Decimal.fromPlanck(0, decimals, { currency })
  }

  if (json?.status !== 200) throw new Error(`Analog total rewards request failed ${JSON.stringify(json)}`)

  const amount = json?.data?.totalRewards
  if (typeof amount !== 'number')
    throw new Error(`Analog total rewards request failed (totalRewards type is not number) ${JSON.stringify(json)}`)

  return Decimal.fromUserInputOrUndefined(String(amount), decimals, { currency })
}
