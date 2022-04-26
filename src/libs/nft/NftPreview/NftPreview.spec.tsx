import { render } from '@testing-library/react';

import NftPreview from './NftPreview';

describe('NftPreview', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NftPreview />);
    expect(baseElement).toBeTruthy();
  });
});
