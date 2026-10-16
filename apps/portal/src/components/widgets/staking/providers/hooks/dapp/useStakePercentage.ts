import { bind } from "@react-rxjs/core"
import { useContext } from "react"
import { useRecoilValue } from "recoil"
import { combineLatest, map, of } from "rxjs"

import { selectedSubstrateAccountsState } from "@/domains/accounts/recoils"
import { ChainContext } from "@/domains/chains/contexts"
import { account$, ledgers$, protocolState$ } from "@/domains/staking/dappStaking/chain"
import { stakeInPeriod, stakePercentageOf } from "@/domains/staking/dappStaking/stake"

const ADDRESS_SEPARATOR = ","

const [useStakePercentageOf] = bind((genesisHash: string, addressList: string) => {
	const addresses = addressList === "" ? [] : addressList.split(ADDRESS_SEPARATOR)
	return combineLatest([
		addresses.length === 0
			? of([])
			: combineLatest(addresses.map((address) => account$(genesisHash, address))),
		protocolState$(genesisHash),
		ledgers$(genesisHash, addresses),
	]).pipe(
		map(([accounts, protocol, ledgers]) =>
			stakePercentageOf(
				ledgers.reduce(
					(prev, curr) => prev + (stakeInPeriod(curr, protocol.period_info.number) ?? 0n),
					0n
				),
				accounts.reduce((prev, curr) => prev + curr.data.free, 0n)
			)
		)
	)
})

const useStakePercentage = () =>
	useStakePercentageOf(
		useContext(ChainContext).genesisHash,
		useRecoilValue(selectedSubstrateAccountsState)
			.map((account) => account.address)
			.join(ADDRESS_SEPARATOR)
	)

export default useStakePercentage
