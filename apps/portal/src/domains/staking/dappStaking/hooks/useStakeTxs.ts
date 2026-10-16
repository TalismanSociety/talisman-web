import { useContext } from "react"

import { ChainContext } from "@/domains/chains/contexts"
import { useTx } from "@/domains/common/hooks/useTx"

import { claimAllRewardsTx, type RewardClaims, unlockTx, withdrawUnbondedTx } from "../calls"

export const useClaimAllRewardsTx = () =>
	useTx(useContext(ChainContext).genesisHash, ({ api }, claims: RewardClaims) =>
		claimAllRewardsTx(api.tx, claims)
	)

export const useUnlockTx = () =>
	useTx(useContext(ChainContext).genesisHash, ({ api }, amount: bigint) => unlockTx(api.tx, amount))

export const useWithdrawUnbondedTx = () =>
	useTx(useContext(ChainContext).genesisHash, ({ api }) => withdrawUnbondedTx(api.tx))
