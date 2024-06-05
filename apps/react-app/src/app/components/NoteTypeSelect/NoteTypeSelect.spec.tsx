import { render } from '@testing-library/react';

import NoteTypeSelect, { NoteType } from './NoteTypeSelect';

describe('NoteTypeSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <NoteTypeSelect value={NoteType.TO_SELF} onChange={vi.fn()} />
    );
    expect(baseElement).toBeTruthy();
  });
});
