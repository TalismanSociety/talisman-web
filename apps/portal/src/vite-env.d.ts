/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
	VITE_APPLICATION_NAME: string
	VITE_POSTHOG_AUTH_TOKEN?: string
	VITE_ANALYTICS_LOCAL?: string
	VITE_APP_COMMIT?: string
	VITE_SEEK_STAKE_INDEXER: string
	VITE_LIDO_REWARDS_ADDRESS: string
}

interface Window {
	cookieStore?: { delete(options: { name: string; domain?: string }): Promise<void> }
}

declare namespace JSX {
	interface IntrinsicElements {
		"model-viewer": any
	}
}
