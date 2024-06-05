import { render } from '@testing-library/react';

import { TableContainer } from './TableContainer';

describe('TableContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TableContainer />);
    expect(baseElement).toBeTruthy();
  });
});
