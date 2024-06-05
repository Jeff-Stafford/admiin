import { render, waitFor } from '@admiin-com/ds-web-testing-utils';
import User from './User';

describe('User', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<User />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
