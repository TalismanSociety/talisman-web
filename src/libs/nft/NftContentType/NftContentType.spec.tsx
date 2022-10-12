import { render } from '@testing-library/react'

import nft from '../../../../__fixtures__/nft.json'
import NftContentType from './NftContentType'

describe('NftContentType', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NftContentType nft={nft} />)
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div />
      </body>
    `)
  })
})
