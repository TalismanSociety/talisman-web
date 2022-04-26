import { render } from '@testing-library/react';

import PlaceCenter from './PlaceCenter';

describe('PlaceCenter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PlaceCenter />);
    expect(baseElement).toBeTruthy();
  });
});
