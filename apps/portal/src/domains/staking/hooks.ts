import { useMemo } from "react"

import useGetSeekStaked from "@/components/widgets/staking/providers/hooks/seek/useGetSeekStaked"
import { useSelectedEvmAccounts } from "@/domains/accounts/accounts"
import { useSelectedCurrency } from "@/domains/balances/currency"
import { useSelectedBalances } from "@/domains/balances/hooks"
import { subtensorStakesFiat } from "@/domains/balances/subtensor-stakes"
import { encodeAnyAddress } from "@/util/addresses"

import { useTotalStaked as useDappStakingTotalStaked } from "./dappStaking/hooks/useTotalStaked"
import { lidoSuites } from "./lido/config"
import { useTotalStaked as useSubstrateTotalStaked } from "./substrate/useTotalStaked"

const useSeekStakedFiat = () => {
	const selectedEvmAccounts = useSelectedEvmAccounts()
	const {
		data: { balances },
	} = useGetSeekStaked()

	return useMemo(() => {
		const selectedAddresses = new Set(
			selectedEvmAccounts.map(({ address }) => encodeAnyAddress(address))
		)
		return balances
			.filter(({ address }) => selectedAddresses.has(encodeAnyAddress(address)))
			.reduce((total, { fiatBalance }) => total + fiatBalance, 0)
	}, [balances, selectedEvmAccounts])
}

export const useTotalStaked = () => {
	const currency = useSelectedCurrency()
	const balances = useSelectedBalances()
	const substrateFiatTotal = useSubstrateTotalStaked()
	const dappStakingTotal = useDappStakingTotalStaked()
	const seekFiatTotal = useSeekStakedFiat()

	return useMemo(
		() =>
			balances
				.find(
					(x) =>
						x.token?.symbol !== undefined &&
						[...lidoSuites.map((lido) => lido.token.symbol as string)].includes(x.token?.symbol)
				)
				.sum.fiat(currency).total +
			subtensorStakesFiat(balances, currency) +
			substrateFiatTotal +
			dappStakingTotal +
			seekFiatTotal,
		[balances, currency, dappStakingTotal, seekFiatTotal, substrateFiatTotal]
	)
}
