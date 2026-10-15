import { createFileRoute } from "@tanstack/react-router"

import { StakeProviders } from "@/components/widgets/staking/providers/StakeProviders"

export const Route = createFileRoute("/_app/staking/providers")({ component: StakeProviders })
