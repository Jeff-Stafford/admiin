import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OptionCreateUpdate from './OptionCreateUpdate';
describe('OptionCreateUpdate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <OptionCreateUpdate />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
