import { createFileRoute } from "@tanstack/react-router"

import Stakes from "@/components/widgets/staking/Stakes"

export const Route = createFileRoute("/_app/staking/positions")({
	component: () => <Stakes hideHeader />,
})
