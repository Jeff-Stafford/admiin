import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import Interests from './Interests';

describe('Interests', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<Interests />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
