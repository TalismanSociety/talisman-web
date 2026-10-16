import { useQuery } from "@tanstack/react-query"

import { getBittensorValidators, getSubnetPools, getValidatorYields } from "../tda.functions"

const fromServerFunction = async <T>(call: Promise<T>) => {
	const result = await call
	if (result instanceof Response)
		throw new Error(`No server function on this host: ${result.status} ${result.url}`)
	return result
}

export const useBittensorValidators = () =>
	useQuery({
		queryKey: ["bittensorValidators"],
		queryFn: () => fromServerFunction(getBittensorValidators()),
		staleTime: 10 * 60 * 1000,
	})

export const useSubnetPools = () =>
	useQuery({
		queryKey: ["subnetPools"],
		queryFn: () => fromServerFunction(getSubnetPools()),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		refetchOnReconnect: true,
	})

export const useValidatorYields = (netuid: number) =>
	useQuery({
		queryKey: ["validatorYields", netuid],
		queryFn: () => fromServerFunction(getValidatorYields({ data: { netuid } })),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		refetchOnReconnect: true,
	})
