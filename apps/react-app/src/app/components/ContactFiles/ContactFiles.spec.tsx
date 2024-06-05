import React from 'react';

import { ContactFiles } from './ContactFiles';
import { render } from '../../helpers/render';

describe('ContactFiles', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ContactFiles tasks={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
