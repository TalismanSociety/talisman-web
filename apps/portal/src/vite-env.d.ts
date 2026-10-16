/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
	VITE_APPLICATION_NAME: string
	VITE_COIN_GECKO_API: string
	VITE_COIN_GECKO_API_KEY?: string
	VITE_COIN_GECKO_API_TIER?: "pro" | "demo"
	VITE_ONFINALITY_API_KEY?: string
	VITE_POSTHOG_AUTH_TOKEN?: string
	VITE_ANALYTICS_LOCAL?: string
	VITE_APP_COMMIT?: string
	VITE_EX_HISTORY_INDEXER: string
	VITE_DOT_CROWDLOAN_INDEXER: string
	VITE_KSM_CROWDLOAN_INDEXER: string
	VITE_SEEK_STAKE_INDEXER: string
	VITE_BASEROW_EXPLORE_AUTH: string
	VITE_BASEROW_CROWDLOANS_AUTH: string
	VITE_LIDO_REWARDS_ADDRESS: string
	VITE_TAOSTATS_API_KEY: string
	VITE_TAOSTATS_API_URL: string
	VITE_RAMP_API_KEY: string
}

interface Window {
	cookieStore?: { delete(options: { name: string; domain?: string }): Promise<void> }
}

declare namespace JSX {
	interface IntrinsicElements {
		"model-viewer": any
	}
}
