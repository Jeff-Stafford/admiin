import { render } from '@testing-library/react';

import { TelInput } from './TelInput';

describe('TelInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TelInput />);
    expect(baseElement).toBeTruthy();
  });
});
