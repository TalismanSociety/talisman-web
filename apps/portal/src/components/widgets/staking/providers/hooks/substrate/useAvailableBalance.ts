import type { SS58String } from "polkadot-api"
import { useContext, useMemo } from "react"
import { useRecoilValue } from "recoil"
import { combineLatest, defer, map, of } from "rxjs"

import { selectedSubstrateAccountsState } from "@/domains/accounts/recoils"
import { ChainContext } from "@/domains/chains/contexts"
import { getPapiClient } from "@/domains/chains/papi-client"
import type { PortalRuntime } from "@/domains/chains/portal-runtime"
import { useNativeTokenDecimalState } from "@/domains/chains/recoils"
import { useTokenAmountFromPlanck } from "@/domains/common/hooks/useTokenAmount"
import { bindSuspended } from "@/util/loadable"

const ADDRESS_SEPARATOR = ","

const transferable$ = (genesisHash: string, address: SS58String) =>
	defer(() =>
		getPapiClient(genesisHash)
			.getUnsafeApi<PortalRuntime>()
			.query.System.Account.watchValue(address, { at: "best" })
	).pipe(map(({ value: { data } }) => (data.free > data.frozen ? data.free - data.frozen : 0n)))

const [useTransferable] = bindSuspended((genesisHash: string, addresses: string) => {
	const list = addresses === "" ? [] : addresses.split(ADDRESS_SEPARATOR)
	return list.length === 0
		? of(0n)
		: combineLatest(list.map((address) => transferable$(genesisHash, address))).pipe(
				map((amounts) => amounts.reduce((total, amount) => total + amount, 0n))
			)
})

const useAvailableBalance = () => {
	const { genesisHash } = useContext(ChainContext)
	const accounts = useRecoilValue(selectedSubstrateAccountsState)
	const addresses = useMemo(
		() => accounts.map((x) => x.address).join(ADDRESS_SEPARATOR),
		[accounts]
	)
	const decimal = useRecoilValue(useNativeTokenDecimalState())
	const transferable = useTransferable(genesisHash, addresses)
	const availableBalance = useMemo(() => decimal.fromPlanck(transferable), [decimal, transferable])

	const fiatAmount = useTokenAmountFromPlanck(availableBalance.planck).fiatAmount

	return { availableBalance, fiatAmount }
}

export default useAvailableBalance
