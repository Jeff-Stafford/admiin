import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import TeamUserCreateUpdate from './TeamUserCreateUpdate';

describe('TeamUserCreateUpdate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <TeamUserCreateUpdate />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
