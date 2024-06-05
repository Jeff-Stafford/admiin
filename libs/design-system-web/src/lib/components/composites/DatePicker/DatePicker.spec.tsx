import { render } from '@testing-library/react';
import { DesignSystemProvider } from '../DesignSystemProvider/DesignSystemProvider';

import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DesignSystemProvider>
        <DatePicker />
      </DesignSystemProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
