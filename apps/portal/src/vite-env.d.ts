/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMetaEnv {
  VITE_APPLICATION_NAME: string
  VITE_COIN_GECKO_API: string
  VITE_COIN_GECKO_API_KEY?: string
  VITE_COIN_GECKO_API_TIER?: 'pro' | 'demo'
  VITE_ONFINALITY_API_KEY?: string
  VITE_SENTRY_DSN: string
  VITE_SENTRY_RELEASE?: string
  VITE_POSTHOG_AUTH_TOKEN: string
  VITE_EX_HISTORY_INDEXER: string
  VITE_DOT_CROWDLOAN_INDEXER: string
  VITE_KSM_CROWDLOAN_INDEXER: string
  VITE_BASEROW_EXPLORE_AUTH: string
  VITE_BASEROW_CROWDLOANS_AUTH: string
  VITE_LIDO_REWARDS_ADDRESS: string
  VITE_QUEST_API?: string
  VITE_SIMPLESWAP_API_KEY: string
  VITE_LIFI_SECRET: string
  VITE_TAOSTATS_API_KEY: string
  VITE_TAOSTATS_API_URL: string
  VITE_TALISMAN_BIFROST_CHANNEL_ID: string
}

declare namespace JSX {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface IntrinsicElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'model-viewer': any
  }
}
