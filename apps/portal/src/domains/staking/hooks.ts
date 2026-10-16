import { useMemo } from "react"
import { useRecoilValue, waitForAll } from "recoil"

import { selectedCurrencyState } from "@/domains/balances/currency"
import { useSelectedBalances } from "@/domains/balances/hooks"

import { useTotalStaked as useDappStakingTotalStaked } from "./dappStaking/hooks/useTotalStaked"
import { lidoSuitesState } from "./lido/recoils"
import { useTotalStaked as useSubstrateTotalStaked } from "./substrate/useTotalStaked"

export const useTotalStaked = () => {
	const [lidoSuites, currency] = useRecoilValue(
		waitForAll([lidoSuitesState, selectedCurrencyState])
	)
	const balances = useSelectedBalances()
	const { fiatTotal: substrateFiatTotal } = useSubstrateTotalStaked()
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
		[balances, currency, dappStakingTotal, lidoSuites, substrateFiatTotal]
	)
}
