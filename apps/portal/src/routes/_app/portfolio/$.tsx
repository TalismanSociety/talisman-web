import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/portfolio/$")({
	component: () => <Navigate to="/portfolio" />,
})
