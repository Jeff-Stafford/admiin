import React from 'react';
import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { ContactsListItem } from './ContactsListItem';
describe('ContactsListItem', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<ContactsListItem onClick={vi.fn()} />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
