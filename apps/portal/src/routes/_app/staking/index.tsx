import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/staking/")({
	component: () => <Navigate to="/staking/providers" />,
})
