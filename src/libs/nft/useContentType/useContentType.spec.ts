import { act, renderHook } from '@testing-library/react-hooks';
import useContentType from './useContentType';

describe('useContentType', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useContentType());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
