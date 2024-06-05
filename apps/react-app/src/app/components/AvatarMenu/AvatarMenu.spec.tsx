import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { AvatarMenu } from './AvatarMenu';

describe('AvatarMenu', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<AvatarMenu />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
