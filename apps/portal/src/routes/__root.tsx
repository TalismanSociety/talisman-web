import { createRootRoute, HeadContent, Navigate, Outlet, Scripts } from "@tanstack/react-router"
import { lazy, type ReactNode, Suspense } from "react"
import indexCss from "@/index.css?url"
import { validateSearch } from "@/util/search"

const title = "Talisman Portal"
const description = "Unlock the Talisman. Polkadot & Parachain dashboard for the community."
const url = "https://app.talisman.xyz/"
const image = "https://app.talisman.xyz/preview.png?v=2024-10-14"

export const Route = createRootRoute({
	ssr: false,
	validateSearch,
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ title },
			{ name: "title", content: title },
			{ name: "description", content: description },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ name: "theme-color", content: "#000000" },
			{ itemProp: "name", content: title },
			{ itemProp: "description", content: description },
			{ itemProp: "image", content: image },
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: url },
			{ property: "og:title", content: title },
			{ property: "og:description", content: description },
			{ property: "og:image", content: image },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:url", content: url },
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: description },
			{ name: "twitter:image", content: image },
		],
		links: [
			{ rel: "icon", href: "/favicon.ico?v=2024-10-14", sizes: "32x32" },
			{ rel: "icon", href: "/talisman.svg?v=2024-10-14", type: "image/svg+xml" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png?v=2024-10-14" },
			{ rel: "stylesheet", href: indexCss },
		],
	}),
	shellComponent: import.meta.env.SSR ? RootShell : undefined,
	component: RootComponent,
	notFoundComponent: () => <Navigate to="/" />,
})

function RootShell({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root">{children}</div>
				<Scripts />
			</body>
		</html>
	)
}

const AppProviders = lazy(() => import("@/AppProviders"))

function RootComponent() {
	return (
		<Suspense>
			<AppProviders>
				<Outlet />
			</AppProviders>
		</Suspense>
	)
}
