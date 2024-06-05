import { render } from '@testing-library/react';
import React from 'react';

import { ImageList } from './ImageList';

describe('ImageList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ImageList>
        <img alt="Sample" />
      </ImageList>
    );
    expect(baseElement).toBeTruthy();
  });
});
