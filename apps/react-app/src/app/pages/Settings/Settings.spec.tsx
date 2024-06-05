import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Settings from './Settings';
// import { SidebarContainer } from '../../components/SidebarContainer/SidebarContainer';

describe('Settings', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        {/* <SidebarContainer> */}
        <Settings />
        {/* </SidebarContainer> */}
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
