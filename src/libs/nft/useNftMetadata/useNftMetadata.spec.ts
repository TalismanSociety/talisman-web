import { act, renderHook } from '@testing-library/react-hooks';
import useNftMetadata from './useNftMetadata';

describe('useNftMetadata', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useNftMetadata());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
