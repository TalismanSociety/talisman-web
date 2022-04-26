import { BaseFetcher } from './BaseFetcher';

export class RMRK2Fetcher extends BaseFetcher {
  baseFetchUrl = `https://singular.app/api/rmrk2/account`;
  baseCollectionUrl = `https://singular.app/api/rmrk2/collection`
  baseCollectibleUrl = `https://singular.app/collectibles`;
}
