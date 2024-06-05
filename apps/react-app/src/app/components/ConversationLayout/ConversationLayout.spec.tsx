import { waitFor } from '@testing-library/react';

import { ConversationLayout } from './ConversationLayout';
import { render } from '../../helpers/render';
describe('ConversationLayout', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<ConversationLayout />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
