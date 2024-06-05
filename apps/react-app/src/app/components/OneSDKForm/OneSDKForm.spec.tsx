import { render } from '@testing-library/react';

import OneSDKForm from './OneSDKForm';

describe('OneSDKForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OneSDKForm />);
    expect(baseElement).toBeTruthy();
  });
});
