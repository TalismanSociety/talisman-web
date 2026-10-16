import { useRecoilValue } from "recoil"

import type { Account } from "@/domains/accounts/accounts"
import { useChainState } from "@/domains/chains/hooks"
import { assertChain } from "@/domains/chains/utils"
import { Decimal } from "@/util/Decimal"

import { useEarnedRewards } from "../dapps"

export const useTotalDappStakingRewards = (account: Account) => {
	const chain = useRecoilValue(useChainState())

	assertChain(chain, { hasDappStaking: true })

	return Decimal.fromUserInput(
		useEarnedRewards(chain.dappStakingApi, account.address).toString(),
		chain.nativeToken?.decimals ?? 0,
		{ currency: chain.nativeToken?.symbol }
	)
}
