import { render } from '@testing-library/react';
import { getTheme } from '../../../utils';
import { DesignSystemContextProvider } from './DesignSystemContextProvider';

describe('DesignSystemContextProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DesignSystemContextProvider theme={getTheme()}>
        Hello World
      </DesignSystemContextProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
