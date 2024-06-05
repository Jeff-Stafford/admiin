import { render } from '@testing-library/react';
import { TableContainer } from '../TableContainer/TableContainer';
import { TableHead } from '../TableHead/TableHead';

import { Table } from './Table';

describe('Table', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Table />);
    expect(baseElement).toBeTruthy();
  });
});

describe('TableWithContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <TableContainer>
        <Table />
      </TableContainer>
    );
    expect(baseElement).toBeTruthy();
  });
});

describe('TableBasic', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <TableContainer>
        <Table>
          <TableHead></TableHead>
        </Table>
      </TableContainer>
    );
    expect(baseElement).toBeTruthy();
  });
});
