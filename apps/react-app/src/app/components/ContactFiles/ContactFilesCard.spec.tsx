import React from 'react';

import { ContactFileCard } from './ContactFileCard';
import { render } from '../../helpers/render';

describe('ContactFileCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ContactFileCard contactFile={undefined} />);
    expect(baseElement).toBeTruthy();
  });
});
