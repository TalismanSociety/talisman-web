import "@polkadot/api-augment/polkadot"
import "@polkadot/api-augment/substrate"
import "@talismn/astar-types/augment-api"
import "@talismn/astar-types/types-lookup"

import * as Sentry from "@sentry/react"
import { PolkadotApiProvider } from "@talismn/react-polkadot-api"
import { PostHogProvider } from "posthog-js/react"
import { type ReactNode, Suspense } from "react"
import { RecoilRoot } from "recoil"
import ThemeProvider from "@/App.Theme"
import { FairyBreadBanner } from "@/components/legacy/widgets/FairyBreadBanner"
import { FullscreenLoader } from "@/components/molecules/FullscreenLoader"
import { Development } from "@/components/widgets/development/Development"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import { AccountWatcher, SignetWatcher } from "@/domains/accounts/recoils"
import { BalancesWatcher } from "@/domains/balances/BalancesWatcher"
import { PortalBalancesProvider } from "@/domains/balances/PortalBalancesProvider"
import {
	chainDeriveState,
	chainQueryMultiState,
	chainQueryState,
} from "@/domains/common/recoils/query"
import { initSentry } from "@/domains/common/sentry"
import { ExtensionWatcher } from "@/domains/extension/main"
import { TalismanExtensionSynchronizer } from "@/domains/extension/TalismanExtensionSynchronizer"
import { EvmProvider } from "@/domains/extension/wagmi"
import { Toaster } from "@/ui/molecules/Toaster"
import { JotaiProvider } from "@/util/jotaiStore"

initSentry()

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
					<JotaiProvider>
						<PostHogProvider apiKey={import.meta.env.VITE_POSTHOG_AUTH_TOKEN}>
							<EvmProvider>
								<PolkadotApiProvider
									queryState={chainQueryState}
									deriveState={chainDeriveState}
									queryMultiState={chainQueryMultiState}
								>
									<PortalBalancesProvider>
										<ExtensionWatcher />
										<AccountWatcher />
										<SignetWatcher />
										<TalismanExtensionSynchronizer />
										<BalancesWatcher />
										<Suspense fallback={<FullscreenLoader />}>
											{children}
											<Toaster position="bottom-right" />
										</Suspense>
										<FairyBreadBanner />
										<Development />
									</PortalBalancesProvider>
								</PolkadotApiProvider>
							</EvmProvider>
						</PostHogProvider>
					</JotaiProvider>
				</Suspense>
			</ErrorBoundary>
		</RecoilRoot>
	</ThemeProvider>
)

export default Sentry.withProfiler(AppProviders)
