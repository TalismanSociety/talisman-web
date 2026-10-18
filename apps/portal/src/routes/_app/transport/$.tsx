import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/transport/$")({
	component: () => <Navigate to="/transport/swap" />,
})
