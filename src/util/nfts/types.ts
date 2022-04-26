import { ReactElement } from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'model-viewer': any;
    }
  }
}

export interface NftData {
  nft: any; // TODO: Get proper type for this.
}

export interface NftElement extends NftData {
  LoaderComponent?: ReactElement;
  FallbackComponent?: ReactElement;
  ErrorComponent?: ReactElement;
}

export type MediaPreviewProps =
  | ImgPreviewProps
  | VideoPreviewProps
  | ModelPreviewProps
  | EmbedPreviewProps
  | GenericPreviewProps;