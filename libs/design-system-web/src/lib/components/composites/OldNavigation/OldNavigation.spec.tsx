import { render } from '@testing-library/react';

import { OldNavigation } from './OldNavigation';

describe('OldNavigation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <OldNavigation
        navigation1={[{ label: 'Home' }, { label: 'About' }]}
        navigation2={[
          {
            label: 'Log in',
            ButtonProps: { variant: 'text' },
          },
          {
            label: 'Sign Up',
          },
        ]}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
