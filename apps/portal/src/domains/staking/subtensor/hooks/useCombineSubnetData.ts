import { useMemo } from "react"

import subnets from "../subnets.json"
import type { SubnetData } from "../types"
import { useSubnetPools } from "./useTaoData"

export const useCombineSubnetData = () => {
	const { data: pools, isError } = useSubnetPools()

	const subnetData = useMemo((): Record<number, SubnetData> => {
		const poolByNetuid = new Map(pools?.map((pool) => [pool.netuid, pool]))
		return Object.fromEntries(
			subnets.map((subnet) => [subnet.netuid, { ...subnet, ...poolByNetuid.get(subnet.netuid) }])
		)
	}, [pools])

	return { subnetData, isError }
}
