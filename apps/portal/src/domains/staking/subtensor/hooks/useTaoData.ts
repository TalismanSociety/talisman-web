import { useQuery } from "@tanstack/react-query"

import { getBittensorValidators, getSubnetPools, getValidatorYields } from "../tda.functions"

export const useBittensorValidators = () =>
	useQuery({
		queryKey: ["bittensorValidators"],
		queryFn: () => getBittensorValidators(),
		staleTime: 10 * 60 * 1000,
	})

export const useSubnetPools = () =>
	useQuery({
		queryKey: ["subnetPools"],
		queryFn: () => getSubnetPools(),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		refetchOnReconnect: true,
	})

export const useValidatorYields = (netuid: number) =>
	useQuery({
		queryKey: ["validatorYields", netuid],
		queryFn: () => getValidatorYields({ data: { netuid } }),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		refetchOnReconnect: true,
	})
