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

const ANALOG_PREFIX = 12850
const analogTotalNompoolRewardsApiUrl = (address: string) =>
	`https://explorer-api.analog.one/api/nominationPayouts/${encodeAnyAddress(address, ANALOG_PREFIX)}`

const fetchAnalogTotalNompoolRewards = async ({
	decimals,
	currency,
	address,
}: RewardsSource): Promise<Decimal | undefined> => {
	const response = await fetch(analogTotalNompoolRewardsApiUrl(address))
	const json = await response.json()
	if (
		json?.status === 404 &&
		json?.message?.startsWith("Payout for this") &&
		json?.message?.endsWith("not found")
	) {
		return Decimal.fromPlanck(0, decimals, { currency })
	}

	if (json?.status !== 200)
		throw new Error(`Analog total rewards request failed ${JSON.stringify(json)}`)

	const amount = json?.data?.totalRewards
	if (typeof amount !== "number")
		throw new Error(
			`Analog total rewards request failed (totalRewards type is not number) ${JSON.stringify(json)}`
		)

	return Decimal.fromUserInputOrUndefined(String(amount), decimals, { currency })
}

const [useTotalRewards] = bindSuspended(
	(
		chainId: string,
		indexerUrl: string | undefined,
		decimals: number,
		currency: string | undefined,
		address: string
	) =>
		defer(() => {
			const source = { chainId, indexerUrl, decimals, currency, address }
			return chainId === "analog-timechain"
				? fetchAnalogTotalNompoolRewards(source)
				: fetchTotalNompoolRewards(source)
		})
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
