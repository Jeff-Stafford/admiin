import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { DrawerLayout } from './DrawerLayout';

describe('DrawerLayout', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<DrawerLayout />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
