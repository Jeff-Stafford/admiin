import { render } from '@testing-library/react';

import { Fab } from './Fab';

describe('Fab', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Fab />);
    expect(baseElement).toBeTruthy();
  });
});
