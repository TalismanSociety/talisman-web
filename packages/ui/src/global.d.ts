import type { ModelViewerElement } from '@google/model-viewer'

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      ['model-viewer']: Partial<ModelViewerElement>
    }
  }
}
