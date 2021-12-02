import { CollabLandConnect } from './CollabLandConnect'
import { ConnectStrategyProps } from './types'

const connectStrategies: Record<string, (props: ConnectStrategyProps) => JSX.Element> = {
  collabland: CollabLandConnect,
}

export function ConnectStrategy(props: any) {
  const urlParams = new URLSearchParams(window.location.search)
  const referrer = window.document.referrer

  const src = urlParams.get('src')
  // TODO: Push back to referrer
  if (!src) {
    return <>Provide `src` in query parameters</>
  }
  const Component = connectStrategies[src]
  // TODO: Push back to referrer
  if (!Component) {
    return <>{src} is not a supported connect strategy</>
  }
  return <Component urlParams={urlParams} referrer={referrer} {...props} />
}
