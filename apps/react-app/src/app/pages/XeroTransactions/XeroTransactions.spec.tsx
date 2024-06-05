import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';

import XeroTransactions from './XeroTransactions';
describe('XeroTransactions', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<XeroTransactions />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
