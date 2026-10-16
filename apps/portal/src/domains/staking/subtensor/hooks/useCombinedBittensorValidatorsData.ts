import { useMemo } from "react"
import { useSearchParams } from "@/hooks/useSearchParams"

import type { BondOption } from "../types"
import { useBittensorValidators, useValidatorYields } from "./useTaoData"

export const useCombinedBittensorValidatorsData = (netuid?: number) => {
	const [searchParams] = useSearchParams()
	const netuidParam = netuid ?? Number(searchParams.get("netuid"))

	const { data: validatorsYieldData, isLoading: isValidatorsYieldLoading } =
		useValidatorYields(netuidParam)

	const {
		data: validators,
		isLoading: isValidatorsLoading,
		isError: isValidatorsError,
	} = useBittensorValidators()

	const combinedValidatorsData = useMemo<BondOption[]>(() => {
		const yieldByHotkey = new Map(validatorsYieldData?.map((entry) => [entry.hotkey, entry]))
		return (
			validators?.map((validator) => ({
				poolId: validator.hotkey,
				name: validator.name,
				totalStaked: parseFloat(validator.global_weighted_stake),
				totalStakers: validator.global_nominators,
				hasData: true,
				isError: isValidatorsError,
				validatorYield: yieldByHotkey.get(validator.hotkey),
			})) ?? []
		)
	}, [validators, isValidatorsError, validatorsYieldData])

	return {
		combinedValidatorsData,
		isLoading: isValidatorsLoading,
		isError: isValidatorsError,
		isValidatorsYieldLoading,
	}
}
