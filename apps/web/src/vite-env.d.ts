/// <reference types="vite/client" />

interface ImportMetaEnv {
  REACT_APP_APPLICATION_NAME: string
  REACT_APP_ONFINALITY_API_KEY?: string
  REACT_APP_SENTRY_DSN: string
  REACT_APP_SENTRY_RELEASE?: string
  REACT_APP_POSTHOG_AUTH_TOKEN: string
  REACT_APP_TX_HISTORY_INDEXER: string
  REACT_APP_BASEROW_EXPLORE_AUTH: string
  REACT_APP_BASEROW_CROWDLOANS_AUTH: string
}

declare namespace JSX {
  interface IntrinsicElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'model-viewer': any
  }
}
