import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"

import { ChainContext } from "@/domains/chains/contexts"

import { fetchSubnetPool } from "../chain"

export const useGetSubnetMetagraphByNetuid = ({ netuid }: { netuid: number }) => {
	const { genesisHash } = useContext(ChainContext)

	const fetchSubnetMetagraph = async ({ netuid }: { netuid: number }) => {
		try {
			return await fetchSubnetPool(genesisHash, netuid)
		} catch (error) {
			console.error("useGetSubnetMetagraphByNetuid", error)
			return undefined
		}
	}

	return useQuery({
		queryKey: ["subnetMetagraph", netuid],
		queryFn: () => fetchSubnetMetagraph({ netuid }),
		staleTime: 1000 * 10,
		enabled: netuid !== undefined && netuid !== 0,
		retry: 10,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	})
}
