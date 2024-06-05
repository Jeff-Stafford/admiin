import { render } from '@testing-library/react';
import { DesignSystemProvider } from './DesignSystemProvider';

describe('DesignSystemProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DesignSystemProvider>hello world</DesignSystemProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
