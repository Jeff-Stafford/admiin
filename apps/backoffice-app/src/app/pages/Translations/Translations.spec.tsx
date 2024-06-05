import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Translations from './Translations';

describe('Translations', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <Translations />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
