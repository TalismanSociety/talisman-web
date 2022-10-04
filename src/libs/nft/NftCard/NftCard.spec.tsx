import { render } from '@testing-library/react'

describe('NftCard', () => {
  // Skip for now as there's some incorrect exports
  // that only work with Webpack tree shake
  // and not Jest transpiler
  it.skip('should render successfully', async () => {
    const { default: NftCard } = await require('./NftCard')
    const { baseElement } = render(<NftCard />)
    expect(baseElement).toBeTruthy()
  })
})
