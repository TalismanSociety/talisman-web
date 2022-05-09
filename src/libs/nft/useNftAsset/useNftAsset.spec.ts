import { act, renderHook } from '@testing-library/react-hooks'

import useNftAsset from './useNftAsset'

describe('useNftAsset', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useNftAsset())

    expect(result.current.count).toBe(0)

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })
})
