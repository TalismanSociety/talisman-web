import { type ModelViewerElement } from '@google/model-viewer'
import { type TalismanTheme } from './theme'

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      ['model-viewer']: Partial<ModelViewerElement>
    }
  }
}

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface Theme extends TalismanTheme {}
}
