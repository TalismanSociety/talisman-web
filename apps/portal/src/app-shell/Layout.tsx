import { Outlet, useLocation } from "@tanstack/react-router"
import { Suspense, useEffect } from "react"

import { LookupAddressSync } from "@/app-shell/LookupAddressSync"
import { FullscreenLoader } from "@/components/molecules/FullscreenLoader"
import { SiteFooter } from "@/components/widgets/SiteFooter"
import { SiteNav } from "@/components/widgets/SiteNav"
import DappStakingStakeSideSheet from "@/components/widgets/staking/dappStaking/StakeSideSheet"
import LidoStakeSideSheet from "@/components/widgets/staking/lido/StakeSideSheet"
import SeekStakeSideSheet from "@/components/widgets/staking/providers/seek/SeekStakeSideSheet"
import NominationPoolsStakeSideSheet from "@/components/widgets/staking/substrate/NominationPoolsStakeSideSheet"
import { StakeSideSheet as SubtensorStakeSideSheet } from "@/components/widgets/staking/subtensor/StakeSideSheet"
import { WalletConnectionSideSheet } from "@/components/widgets/WalletConnectionSideSheet"

export const Layout = () => {
	const location = useLocation()
	useEffect(() => {
		if (location.hash !== "") {
			const observer = new MutationObserver(() => {
				const element = document.getElementById(location.hash)

				if (element !== null) {
					element.scrollIntoView({ behavior: "smooth" })
					observer.disconnect()
				}
			})

			observer.observe(document.body, { childList: true, subtree: true })

			return observer.disconnect.bind(observer)
		}

		return undefined
	}, [location])

	return (
		<div className="flex min-h-screen flex-col gap-8">
			<LookupAddressSync />
			<SiteNav contentClassName="mx-auto w-full max-w-screen-xl px-8" />

			<Suspense fallback={<FullscreenLoader />}>
				<main className="mx-auto w-full max-w-screen-xl flex-grow px-8">
					<Outlet />
					<SeekStakeSideSheet />
					<NominationPoolsStakeSideSheet />
					<DappStakingStakeSideSheet />
					<SubtensorStakeSideSheet />
					<LidoStakeSideSheet />
					<WalletConnectionSideSheet />
				</main>

				<SiteFooter className="mx-auto mt-16 w-full max-w-screen-xl px-8" />
			</Suspense>
		</div>
	)
}
