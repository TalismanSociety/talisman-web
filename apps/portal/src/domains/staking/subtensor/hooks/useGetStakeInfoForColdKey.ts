import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"

import { ChainContext } from "@/domains/chains/contexts"

import { fetchStakeInfos } from "../chain"

const fetchStakeInfo = async (genesisHash: string, address: string) => {
	try {
		const stakes = (await fetchStakeInfos(genesisHash, address))
			.map(({ coldkey, hotkey, netuid, stake }) => ({ coldkey, hotkey, netuid, stake }))
			.filter(({ stake }) => stake !== 0n)

		return stakes.length ? stakes : undefined
	} catch (error) {
		console.error("Failed to fetch stake info:", error)
		return undefined
	}
}

export const useGetStakeInfoForColdKey = (address: string) => {
	const { genesisHash } = useContext(ChainContext)
	return useQuery({
		queryKey: ["stakeInfoForColdKey", address],
		queryFn: () => fetchStakeInfo(genesisHash, address),
		enabled: !!address,
		refetchInterval: 30000,
		staleTime: 30000,
	})
}
