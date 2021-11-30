import { CollabLandConnect } from './CollabLandConnect'

const connectStrategies: Record<string, (props: any) => JSX.Element> = {
  collabland: CollabLandConnect,
}

export function ConnectStrategy(props: any) {
  const urlParams = new URLSearchParams(window.location.search)
  const referrer = window.document.referrer

  const src = urlParams.get('src')
  // TODO: Push back to referrer
  if (!src) {
    return null
  }
  const Component = connectStrategies[src]
  // TODO: Push back to referrer
  if (!Component) {
    return null
  }
  return <Component urlParams={urlParams} referrer={referrer} {...props} />
}
