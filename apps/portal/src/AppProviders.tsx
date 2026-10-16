import "@polkadot/api-augment/polkadot"
import "@polkadot/api-augment/substrate"
import "@talismn/astar-types/augment-api"
import "@talismn/astar-types/types-lookup"

import { Subscribe } from "@react-rxjs/core"
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
import { AccountWatcher } from "@/domains/accounts/AccountWatcher"
import { BalancesReporter, BalancesWatcher } from "@/domains/balances/BalancesWatcher"
import {
	chainDeriveState,
	chainQueryMultiState,
	chainQueryState,
} from "@/domains/common/recoils/query"
import { initSentry } from "@/domains/common/sentry"
import { ExtensionWatcher } from "@/domains/extension/main"
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
					<Subscribe>
						<JotaiProvider>
							<PostHogProvider apiKey={import.meta.env.VITE_POSTHOG_AUTH_TOKEN}>
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
										<FairyBreadBanner />
										<Development />
									</PolkadotApiProvider>
								</EvmProvider>
							</PostHogProvider>
						</JotaiProvider>
					</Subscribe>
				</Suspense>
			</ErrorBoundary>
		</RecoilRoot>
	</ThemeProvider>
)

export default Sentry.withProfiler(AppProviders)
