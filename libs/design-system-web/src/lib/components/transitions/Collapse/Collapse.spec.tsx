import { render } from '@testing-library/react';

import { Collapse } from './Collapse';

describe('Collapse', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Collapse />);
    expect(baseElement).toBeTruthy();
  });
});
