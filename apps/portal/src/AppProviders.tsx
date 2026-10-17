import { Subscribe } from "@react-rxjs/core"
import { type ReactNode, Suspense } from "react"
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
				</Suspense>
			</Subscribe>
		</ErrorBoundary>
	</ThemeProvider>
)

export default AppProviders
