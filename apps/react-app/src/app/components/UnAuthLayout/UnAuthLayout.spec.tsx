import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { UnAuthLayout } from './UnAuthLayout';

describe('UnAuthLayout', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<UnAuthLayout />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
