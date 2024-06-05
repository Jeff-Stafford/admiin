import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { CurrencyNumber } from './CurrencyNumber';
describe('CurrencyNumber', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<CurrencyNumber number={3821} />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
