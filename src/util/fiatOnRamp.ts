import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'

export function buyNow() {
  new RampInstantSDK({
    hostAppName: process.env.REACT_APP_APPLICATION_NAME || 'Talisman',
    hostLogoUrl: 'https://pbs.twimg.com/profile_images/1433018747762085891/ZATzx-HG_400x400.jpg',
  }).show()
}
