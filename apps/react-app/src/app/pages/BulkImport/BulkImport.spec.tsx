import { waitFor } from '@admiin-com/ds-web-testing-utils';
import { BulkImport } from './BulkImport';
import { render } from '../../helpers/render';

describe('BulkImport', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <BulkImport open={false} handleCloseModal={vi.fn()} />
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
