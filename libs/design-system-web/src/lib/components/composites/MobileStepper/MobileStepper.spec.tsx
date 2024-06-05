import { WBButton } from '../../';
import { render } from '@testing-library/react';
import React from 'react';

import { MobileStepper } from './MobileStepper';

describe('MobileStepper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MobileStepper
        backButton={<WBButton onClick={() => console.log('back')} />}
        nextButton={<WBButton onClick={() => console.log('next')} />}
        steps={5}
        activeStep={1}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
