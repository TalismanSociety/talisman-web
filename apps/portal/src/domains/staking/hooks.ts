import { useMemo } from "react"

import { useSelectedCurrency } from "@/domains/balances/currency"
import { useSelectedBalances } from "@/domains/balances/hooks"

import { useTotalStaked as useDappStakingTotalStaked } from "./dappStaking/hooks/useTotalStaked"
import { lidoSuites } from "./lido/config"
import { useTotalStaked as useSubstrateTotalStaked } from "./substrate/useTotalStaked"

export const useTotalStaked = () => {
	const currency = useSelectedCurrency()
	const balances = useSelectedBalances()
	const substrateFiatTotal = useSubstrateTotalStaked()
	const dappStakingTotal = useDappStakingTotalStaked()

	return useMemo(
		() =>
			balances
				.find(
					(x) =>
						x.token?.symbol !== undefined &&
						[...lidoSuites.map((lido) => lido.token.symbol as string)].includes(x.token?.symbol)
				)
				.sum.fiat(currency).total +
			substrateFiatTotal +
			dappStakingTotal,
		[balances, currency, dappStakingTotal, substrateFiatTotal]
	)
}
