import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AvatarMenu } from './AvatarMenu';

describe('AvatarMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <AvatarMenu />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
