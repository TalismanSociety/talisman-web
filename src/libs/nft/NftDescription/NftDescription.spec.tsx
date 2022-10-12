import { render } from '@testing-library/react'

import nft from '../../../../__fixtures__/nft.json'
import NftDescription from './NftDescription'

describe('NftDescription', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NftDescription nft={nft} />)
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <div
            class="nft-description-root"
          >
            <div
              class="description-title "
            >
              Talisman Spirit Keys
            </div>
            <div
              class=""
            >
              Spirit Key #3283
            </div>
          </div>
        </div>
      </body>
    `)
  })
})
