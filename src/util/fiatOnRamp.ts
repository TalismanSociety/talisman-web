import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'

const REACT_APP_APPLICATION_NAME = process.env.REACT_APP_APPLICATION_NAME
const RAMP_API_KEY = process.env.RAMP_API_KEY
const RAMP_URL = process.env.RAMP_URL

export function buyNow() {
  const widget = new RampInstantSDK({
    hostAppName: REACT_APP_APPLICATION_NAME || 'Talisman Default Name',
    hostLogoUrl: 'https://pbs.twimg.com/profile_images/1433018747762085891/ZATzx-HG_400x400.jpg',
    hostApiKey: RAMP_API_KEY,
    defaultAsset: 'DOT',
    url: RAMP_URL,
  })

  if (widget) {
    widget.show()
    const domNodes = widget.domNodes
    const overlay = domNodes?.overlay
    const style = overlay?.style
    if (style) {
      style.zIndex = '10001'
    }
  }
}
