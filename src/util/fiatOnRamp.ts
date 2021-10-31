import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'

const STAGING_RAMP_API_KEY = 'y3asdf899w5xcnxguzas93uwg86dcxz54xaogyt9'

export function buyNow() {
  const widget = new RampInstantSDK({
    hostAppName: process.env.REACT_APP_APPLICATION_NAME || 'Talisman',
    hostLogoUrl: 'https://pbs.twimg.com/profile_images/1433018747762085891/ZATzx-HG_400x400.jpg',
    hostApiKey: process.env.RAMP_API_KEY || STAGING_RAMP_API_KEY,
    defaultAsset: 'DOT',
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
