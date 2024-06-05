import { waitFor } from '@admiin-com/ds-web-testing-utils';
import { BillPreview } from './BillPreview';
import { render } from '../../helpers/render';

describe('BillPreview', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <BillPreview
        document={{
          identityId: undefined,
          key: '',
          src: undefined,
          level: 'public',
          type: 'IMAGE',
        }}
      />
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
