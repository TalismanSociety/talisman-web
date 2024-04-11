/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMetaEnv {
  REACT_APP_APPLICATION_NAME: string
  REACT_APP_COIN_GECKO_API: string
  REACT_APP_COIN_GECKO_API_KEY?: string
  REACT_APP_COIN_GECKO_API_TIER?: 'pro' | 'demo'
  REACT_APP_CHAINDATA: string
  REACT_APP_ONFINALITY_API_KEY?: string
  REACT_APP_SENTRY_DSN: string
  REACT_APP_SENTRY_RELEASE?: string
  REACT_APP_POSTHOG_AUTH_TOKEN: string
  REACT_APP_EX_HISTORY_INDEXER: string
  REACT_APP_DOT_CROWDLOAN_INDEXER: string
  REACT_APP_KSM_CROWDLOAN_INDEXER: string
  REACT_APP_BASEROW_EXPLORE_AUTH: string
  REACT_APP_BASEROW_CROWDLOANS_AUTH: string
  REACT_APP_LIDO_REWARDS_ADDRESS: string
}

declare namespace JSX {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface IntrinsicElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'model-viewer': any
  }
}
