import { cleanup } from '@testing-library/react';

import * as ApolloClientContextModule from '../ApolloClientProvider/ApolloClientProvider';
import GuestPayment from './GuestPayment';
import { render } from '../../helpers/render';
const mockHostedFields = {
  create: vi.fn().mockImplementation((fieldType, options) => ({
    mount: vi.fn(),
    on: vi.fn((event, callback) => {
      console.log();
    }),
  })),
  destroy: vi.fn(),
};
describe('GuestPayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(ApolloClientContextModule, 'useClientContext').mockImplementation(
      () => ({
        setClientType: vi.fn(),
        clientType: 'userPool',
      })
    );
    Object.defineProperty(window, 'assembly', {
      value: {
        hostedFields: vi.fn().mockImplementation(() => mockHostedFields),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(<GuestPayment />);
    expect(baseElement).toBeTruthy();
  });
});
