import { render } from '@testing-library/react';
import { DarkThemeProvider } from './DarkThemeProvider';

describe('DarkThemeProvider', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <DarkThemeProvider children={undefined}></DarkThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
