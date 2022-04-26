import { encodeAddress } from '@polkadot/keyring';

interface FetcherURL {
  address: string;
}

export abstract class BaseFetcher {
  abstract baseFetchUrl: string;
  abstract baseCollectibleUrl: string;
  baseWeb2Url = 'https://talisman.mypinata.cloud/';

  toWeb2Url(metadataUrl: string): string {
    return metadataUrl?.replace('ipfs://', this.baseWeb2Url);
  }

  collectibleUrl(id: string, srcUrl: string): string | undefined {
    if (!srcUrl.startsWith(this?.baseFetchUrl as string)) {
      return undefined;
    }
    return `${this.baseCollectibleUrl}/${id}`;
  }

  fetchUrl({ address }: FetcherURL): string | null {
    const baseFetchUrl = this.baseFetchUrl;
    try {
      const kusamaAddress = encodeAddress(address, 2);
      return `${baseFetchUrl}/${kusamaAddress}`;
    } catch (err) {
      return null;
    }
  }
}
