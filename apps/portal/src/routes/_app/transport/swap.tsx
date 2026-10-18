import { createFileRoute } from "@tanstack/react-router"

import { PageHeader, PageHeaderItem } from "@/components/molecules/PageHeader"
import { PageTab, PageTabs } from "@/components/molecules/PageTabs"
import { AccountConnectionGuard } from "@/components/widgets/AccountConnectionGuard"
import { DisabledSwap } from "@/components/widgets/DisabledSwap"

export const Route = createFileRoute("/_app/transport/swap")({ component: SwapPage })

function SwapPage() {
	return (
		<AccountConnectionGuard>
			<div className="flex w-full flex-col gap-8">
				<PageHeader>
					<PageHeaderItem className="justify-center">
						<PageTabs>
							<PageTab to="/transport/swap">Cross Chain Swap</PageTab>
						</PageTabs>
					</PageHeaderItem>
				</PageHeader>
				<div className="mx-auto w-full max-w-[840px]">
					<div className="w-full pb-[40px]">
						<DisabledSwap />
					</div>
				</div>
			</div>
		</AccountConnectionGuard>
	)
}
