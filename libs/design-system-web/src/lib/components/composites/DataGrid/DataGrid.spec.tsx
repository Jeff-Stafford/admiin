import { GridColDef } from '@mui/x-data-grid';
import { render } from '@testing-library/react';

import { DataGrid } from './DataGrid';
const columns: GridColDef[] = [];
describe('DataGrid', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DataGrid columns={columns} rows={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
