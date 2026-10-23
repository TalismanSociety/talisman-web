import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Suspense } from "react"
import { WalletTotal } from "@/components/legacy/widgets/WalletTotal"
import { PageHeader, PageHeaderItem } from "@/components/molecules/PageHeader"
import { PageTab, PageTabs } from "@/components/molecules/PageTabs"
import { AccountValueInfo } from "@/components/recipes/AccountValueInfo"
import { PortfolioAddressSearch } from "@/components/recipes/PortfolioAddressSearch"
import { AccountConnectionGuard } from "@/components/widgets/AccountConnectionGuard"
import { AccountsManagementMenu } from "@/components/widgets/AccountsManagementMenu"
import { AnimatedFiatNumber } from "@/components/widgets/AnimatedFiatNumber"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import { BannerStakeWithTalismanWallet } from "@/components/widgets/staking/BannerStakeWithTalismanWallet"
import { useSelectedAccounts } from "@/domains/accounts/accounts"
import { useTotalStaked } from "@/domains/staking/hooks"
import { Surface } from "@/ui/atoms/Surface"
import { Text } from "@/ui/atoms/Text"

export const Route = createFileRoute("/_app/staking")({ component: Layout })

const TotalStakedValue = () => <AnimatedFiatNumber end={useTotalStaked()} />

const TotalStaked = () => (
	<ErrorBoundary>
		<Suspense>
			<TotalStakedValue />
		</Suspense>
	</ErrorBoundary>
)

function Layout() {
	const accounts = useSelectedAccounts()

	return (
		<AccountConnectionGuard>
			<div className="flex w-full flex-col gap-8">
				<BannerStakeWithTalismanWallet />
				<PageHeader>
					<PageHeaderItem>
						<AccountsManagementMenu
							button={
								<AccountValueInfo
									account={accounts.length === 1 ? accounts[0] : undefined}
									balance={<WalletTotal />}
								/>
							}
						/>
					</PageHeaderItem>

					<PageHeaderItem>
						<PageTabs>
							<PageTab to="/staking/providers">Stake</PageTab>
							<PageTab to="/staking/positions">Positions</PageTab>
						</PageTabs>
					</PageHeaderItem>

					<PageHeaderItem>
						<PortfolioAddressSearch />
						<div>
							<Text.BodyLarge as="div">Staking balance</Text.BodyLarge>
							<Text.H3 as="div" css={{ marginTop: "0.125em" }}>
								<TotalStaked />
							</Text.H3>
						</div>
					</PageHeaderItem>
				</PageHeader>
				<Surface css={{ borderRadius: "1.6rem", padding: "1.6rem" }}>
					<Outlet />
				</Surface>
			</div>
		</AccountConnectionGuard>
	)
}
