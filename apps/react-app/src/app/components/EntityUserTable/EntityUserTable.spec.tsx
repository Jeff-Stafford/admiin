import { render } from '@testing-library/react';

import EntityUserTable from './EntityUserTable';

describe('EntityUserTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EntityUserTable />);
    expect(baseElement).toBeTruthy();
  });
});
