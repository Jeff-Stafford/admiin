import { waitFor } from '@admiin-com/ds-web-testing-utils';
import { ContactCreateModal } from './ContactCreateModal';
import { render } from '../../helpers/render';

describe('ContactCreateModal', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <ContactCreateModal open={false} handleCloseModal={vi.fn()} />
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
