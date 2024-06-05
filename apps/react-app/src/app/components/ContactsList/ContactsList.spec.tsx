import React from 'react';
import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { ContactsList } from './ContactsList';
import { useContacts } from '../../hooks/useContacts/useContacts';
import { Mock, vi } from 'vitest';
describe('CtontacsList', () => {
  beforeAll(() => {
    vi.mock('../../hooks/useContacts/useContacts', () => ({
      useContacts: vi.fn(),
    }));
  });
  it('should render successfully', async () => {
    (useContacts as Mock).mockReturnValue({
      contacts: [{ id: 1, name: 'Ctontacs 1' }],
    });
    const { baseElement } = render(<ContactsList selected={null} query={''} />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
