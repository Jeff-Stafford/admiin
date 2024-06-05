import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TranslationDetails from './TranslationDetails';

describe('TranslationDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <TranslationDetails />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
