import { render } from '@testing-library/react';
import { WBTypography } from '../../index';

import { Fade } from './Fade';

describe('Fade', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Fade>
        <WBTypography>Hi</WBTypography>
      </Fade>
    );
    expect(baseElement).toBeTruthy();
  });
});
