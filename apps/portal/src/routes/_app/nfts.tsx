import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/nfts")({
	component: () => <Navigate to="/portfolio/$" params={{ _splat: "collectibles" }} />,
})
