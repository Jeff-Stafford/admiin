import React from 'react';
import { TaskCreation } from './TaskCreation';
import { render } from '../../helpers/render';
import { vi } from 'vitest';
import { waitFor } from '@testing-library/react';
describe('TaskCreation', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <TaskCreation open={false} handleCloseModal={vi.fn()} />
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
