import { bind } from "@react-rxjs/core"
import { encodeAnyAddress } from "@talismn/util"
import request from "graphql-request"
import { useRecoilValue } from "recoil"
import { catchError, defer, map, of } from "rxjs"

import type { Account } from "@/domains/accounts/accounts"
import { useChainState } from "@/domains/chains/hooks"
import { assertChain } from "@/domains/chains/utils"
import { graphql } from "@/generated/gql/nova/gql"
import { Decimal } from "@/util/Decimal"

const fetchTotalValidatorRewards = async (indexerUrl: string | undefined, address: string) => {
	if (!indexerUrl) throw new Error("No indexer for validator staking rewards")
	const response = await request(
		indexerUrl,
		graphql(`
            query ValidatorStakingReward($address: String!) {
              accumulatedReward(id: $address) {
                amount
              }
            }
          `),
		{ address }
	)
	return response.accumulatedReward?.amount ?? 0
}

const [useTotalRewards] = bind(
	(
		indexerUrl: string | undefined,
		decimals: number,
		currency: string | undefined,
		address: string
	) =>
		defer(() => fetchTotalValidatorRewards(indexerUrl, address)).pipe(
			map((amount) => ({
				totalRewards: Decimal.fromPlanck(amount, decimals, { currency }),
				isError: false,
			})),
			catchError((error: unknown) => {
				console.error("Error fetching staking rewards:", error)
				return of({ totalRewards: Decimal.fromPlanck(0, decimals, { currency }), isError: true })
			})
		)
)

export const useTotalValidatorStakingRewards = (account: Account) => {
	const chain = useRecoilValue(useChainState())
	assertChain(chain, { hasNominationPools: true })
	return useTotalRewards(
		chain.novaIndexerUrl,
		chain.nativeToken?.decimals ?? 0,
		chain.nativeToken?.symbol,
		encodeAnyAddress(account.address, chain.prefix)
	)
}
