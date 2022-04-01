import { render } from '@testing-library/react';

import NftContentType from './NftContentType';

describe('NftContentType', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NftContentType />);
    expect(baseElement).toBeTruthy();
  });
});
