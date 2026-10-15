import { createFileRoute } from "@tanstack/react-router"

import { Layout } from "@/app-shell/Layout"

export const Route = createFileRoute("/_app")({ component: Layout })
