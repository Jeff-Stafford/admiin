import { render } from '@testing-library/react';

import Templates from './Templates';

describe('Templates', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Templates />);
    expect(baseElement).toBeTruthy();
  });
});
