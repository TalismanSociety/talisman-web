import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/")({ component: () => <Navigate to="/staking" /> })
