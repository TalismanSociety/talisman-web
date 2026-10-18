import request from "graphql-request"
import { defer } from "rxjs"
import type { Account } from "@/domains/accounts/accounts"
import { useChain } from "@/domains/chains/chains"
import { assertChain } from "@/domains/chains/utils"
import { graphql } from "@/generated/gql/nova/gql"
import { encodeAnyAddress } from "@/util/addresses"
import { Decimal } from "@/util/Decimal"
import { bindSuspended } from "@/util/loadable"

type RewardsSource = {
	chainId: string
	indexerUrl: string | undefined
	decimals: number
	currency: string | undefined
	address: string
}

const fetchTotalNompoolRewards = async ({
	chainId,
	indexerUrl,
	decimals,
	currency,
	address,
}: RewardsSource): Promise<Decimal | undefined> => {
	if (!indexerUrl)
		throw new Error(`Cannot fetch totalNominationPoolRewards for chain ${chainId}: no indexer`)

	const response = await request(
		indexerUrl,
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
	if (typeof amount !== "string")
		throw new Error(
			`Total rewards request failed (totalRewards type is not string) ${JSON.stringify(response)}`
		)

	return Decimal.fromPlanck(amount ?? 0, decimals, { currency })
}

const [useTotalRewards] = bindSuspended(
	(
		chainId: string,
		indexerUrl: string | undefined,
		decimals: number,
		currency: string | undefined,
		address: string
	) => defer(() => fetchTotalNompoolRewards({ chainId, indexerUrl, decimals, currency, address }))
)

export const useTotalNominationPoolRewards = (account: Account) => {
	const chain = useChain()
	assertChain(chain, { hasNominationPools: true })
	return useTotalRewards(
		chain.id,
		chain.novaIndexerUrl,
		chain.nativeToken?.decimals ?? 0,
		chain.nativeToken?.symbol,
		encodeAnyAddress(account.address, chain.prefix)
	)
}
