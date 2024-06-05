import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { ChangeLanguage } from './ChangeLanguage';

describe('ChangeLanguage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <ChangeLanguage />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
