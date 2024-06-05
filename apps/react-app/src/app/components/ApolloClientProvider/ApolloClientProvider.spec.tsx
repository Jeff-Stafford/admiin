import { render } from '@testing-library/react';

import ApolloClientProvider from './ApolloClientProvider';

describe('ApolloClientProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ApolloClientProvider />);
    expect(baseElement).toBeTruthy();
  });
});
