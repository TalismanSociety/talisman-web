import { act, renderHook } from '@testing-library/react-hooks';
import useNfts from './useNfts';

describe('useNfts', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useNfts());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
