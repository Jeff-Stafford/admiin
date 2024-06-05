import { render } from '@testing-library/react';

import EntityAddressForm from './EntityAddressForm';

describe('EntityAddressForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EntityAddressForm />);
    expect(baseElement).toBeTruthy();
  });
});
