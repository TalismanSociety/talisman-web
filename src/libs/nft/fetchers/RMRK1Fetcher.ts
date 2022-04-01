import { BaseFetcher } from './BaseFetcher';

export class RMRK1Fetcher extends BaseFetcher {
  baseFetchUrl = `https://singular.rmrk.app/api/rmrk1/account`;
  baseCollectibleUrl = `https://singular.rmrk.app/collectibles`;
}
