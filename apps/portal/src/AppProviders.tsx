import { Subscribe } from "@react-rxjs/core"
import { type ReactNode, Suspense, useDeferredValue } from "react"
import { useTimeout } from "react-use"
import ThemeProvider from "@/App.Theme"
import { ConsentBanner } from "@/app-shell/ConsentBanner"
import { FullscreenLoader } from "@/components/molecules/FullscreenLoader"
import { Development } from "@/components/widgets/development/Development"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import { PrivacySettingsDialog } from "@/components/widgets/PrivacySettings/PrivacySettingsDialog"
import { AccountWatcher } from "@/domains/accounts/AccountWatcher"
import { BalancesReporter, BalancesWatcher } from "@/domains/balances/BalancesWatcher"
import { ExtensionWatcher } from "@/domains/extension/main"
import { EvmProvider } from "@/domains/extension/wagmi"
import { Toaster } from "@/ui/molecules/Toaster"

const LOADER_DELAY_MS = 500

const RevealWithDelayedLoader = ({ children }: { children: ReactNode }) => {
	const revealed = useDeferredValue(true, false)
	const [isLoaderDue] = useTimeout(LOADER_DELAY_MS)
	if (revealed) return children
	return isLoaderDue() ? <FullscreenLoader /> : null
}

const AppProviders = ({ children }: { children: ReactNode }) => (
	<ThemeProvider>
		<ErrorBoundary
			renderFallback={(fallback) => (
				<div className="flex h-[100dvh]">
					<div className="m-auto">{fallback}</div>
				</div>
			)}
		>
			<Subscribe>
				<Suspense fallback={<FullscreenLoader />}>
					<RevealWithDelayedLoader>
						<EvmProvider>
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
						</EvmProvider>
					</RevealWithDelayedLoader>
				</Suspense>
			</Subscribe>
		</ErrorBoundary>
	</ThemeProvider>
)

export default AppProviders
