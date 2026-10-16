import "@polkadot/api-augment/polkadot"
import "@polkadot/api-augment/substrate"
import "@talismn/astar-types/augment-api"
import "@talismn/astar-types/types-lookup"

import { Subscribe } from "@react-rxjs/core"
import { PolkadotApiProvider } from "@talismn/react-polkadot-api"
import { type ReactNode, Suspense } from "react"
import { RecoilRoot } from "recoil"
import ThemeProvider from "@/App.Theme"
import { ConsentBanner } from "@/app-shell/ConsentBanner"
import { FullscreenLoader } from "@/components/molecules/FullscreenLoader"
import { Development } from "@/components/widgets/development/Development"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import { PrivacySettingsDialog } from "@/components/widgets/PrivacySettings/PrivacySettingsDialog"
import { AccountWatcher } from "@/domains/accounts/AccountWatcher"
import { BalancesReporter, BalancesWatcher } from "@/domains/balances/BalancesWatcher"
import {
	chainDeriveState,
	chainQueryMultiState,
	chainQueryState,
} from "@/domains/common/recoils/query"
import { ExtensionWatcher } from "@/domains/extension/main"
import { EvmProvider } from "@/domains/extension/wagmi"
import { Toaster } from "@/ui/molecules/Toaster"
import { JotaiProvider } from "@/util/jotaiStore"

const AppProviders = ({ children }: { children: ReactNode }) => (
	<ThemeProvider>
		<RecoilRoot>
			<ErrorBoundary
				renderFallback={(fallback) => (
					<div className="flex h-[100dvh]">
						<div className="m-auto">{fallback}</div>
					</div>
				)}
			>
				<Suspense fallback={<FullscreenLoader />}>
					<Subscribe>
						<JotaiProvider>
							<EvmProvider>
								<PolkadotApiProvider
									queryState={chainQueryState}
									deriveState={chainDeriveState}
									queryMultiState={chainQueryMultiState}
								>
									<ExtensionWatcher />
									<AccountWatcher />
									<BalancesWatcher />
									<BalancesReporter />
									<Suspense fallback={<FullscreenLoader />}>
										{children}
										<Toaster position="bottom-right" />
									</Suspense>
									<ConsentBanner />
									<PrivacySettingsDialog />
									<Development />
								</PolkadotApiProvider>
							</EvmProvider>
						</JotaiProvider>
					</Subscribe>
				</Suspense>
			</ErrorBoundary>
		</RecoilRoot>
	</ThemeProvider>
)

export default AppProviders
