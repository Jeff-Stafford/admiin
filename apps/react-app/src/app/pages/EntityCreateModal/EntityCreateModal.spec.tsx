import { waitFor } from '@admiin-com/ds-web-testing-utils';
import { EntityCreateModal } from './EntityCreateModal';
import { render } from '../../helpers/render';

describe('EntityCreateModal', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <EntityCreateModal open={false} handleCloseModal={vi.fn()} />
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
