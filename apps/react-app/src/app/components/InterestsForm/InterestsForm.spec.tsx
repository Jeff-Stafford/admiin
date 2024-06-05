import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { InterestsForm } from './InterestsForm';

describe('InterestsForm', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<InterestsForm />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
