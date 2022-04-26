import { render } from '@testing-library/react';

import NftDescription from './NftDescription';

describe('NftDescription', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NftDescription />);
    expect(baseElement).toBeTruthy();
  });
});
