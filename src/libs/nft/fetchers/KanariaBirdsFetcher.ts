import { BaseFetcher } from './BaseFetcher'

export class KanariaBirdsFetcher extends BaseFetcher {
  baseFetchUrl = `https://kanaria.rmrk.app/api/rmrk2/account-birds`
  baseCollectibleUrl = `https://singular.app/collectibles`
}
