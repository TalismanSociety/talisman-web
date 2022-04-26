import { render } from '@testing-library/react';

import DualRingLoader from './DualRingLoader';

describe('DualRingLoader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DualRingLoader />);
    expect(baseElement).toBeTruthy();
  });
});
