import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { HeaderLayout } from './HeaderLayout';
describe('HeaderLayout', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<HeaderLayout />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
