import { render } from '@testing-library/react';

import { TablePagination } from './TablePagination';

describe('TablePagination', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <TablePagination
        count={10}
        page={1}
        onPageChange={() => console.log('on page change')}
        rowsPerPage={10}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
