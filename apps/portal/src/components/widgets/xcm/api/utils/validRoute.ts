import { AssetRoute } from '@galacticcouncil/xcm-core'

export const validRoute = (route: AssetRoute) => route.extrinsic || route.contract
