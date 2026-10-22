import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"

import { ChainContext } from "@/domains/chains/contexts"

import { fetchMinimums } from "../chain"

export const useSubtensorMinimums = () => {
	const { genesisHash } = useContext(ChainContext)
	return useQuery({
		queryKey: ["subtensorMinimums", genesisHash],
		queryFn: () => fetchMinimums(genesisHash),
		staleTime: Number.POSITIVE_INFINITY,
	})
}
