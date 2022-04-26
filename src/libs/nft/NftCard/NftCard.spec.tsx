import { render } from '@testing-library/react';

import NftCard from './NftCard';

describe('NftCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NftCard />);
    expect(baseElement).toBeTruthy();
  });
});
