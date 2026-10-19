import { AnimatePresence } from "motion/react"
import { useMemo } from "react"
import { lidoSuites } from "@/domains/staking/lido/config"
import { useSearchParams } from "@/hooks/useSearchParams"
import LidoWidgetSideSheet from "./LidoWidgetSideSheet"

const StakeSideSheet = () => {
	const [searchParams, setSearchParams] = useSearchParams()

	const open = useMemo(
		() => searchParams.get("action") === "stake" && searchParams.get("type") === "lido",
		[searchParams]
	)

	const lidoSuite = useMemo(
		() => lidoSuites.find((x) => x.token.address === searchParams.get("token-address")),
		[lidoSuites, searchParams]
	)

	if (open && lidoSuite === undefined) {
		throw new Error(`No lido token with address: ${searchParams.get("token-address") ?? ""}`)
	}

	return (
		<AnimatePresence>
			{open && lidoSuite !== undefined && (
				<LidoWidgetSideSheet
					url={`https://stake.lido.fi/?ref=${import.meta.env.VITE_LIDO_REWARDS_ADDRESS}`}
					lidoSuite={lidoSuite}
					onRequestDismiss={() =>
						setSearchParams((sp) => {
							sp.delete("action")
							sp.delete("type")
							sp.delete("token-address")
							return sp
						})
					}
				/>
			)}
		</AnimatePresence>
	)
}

export default StakeSideSheet
