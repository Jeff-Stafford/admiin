import { Auth } from '@aws-amplify/auth';
import { vi } from 'vitest';

vi.spyOn(Auth, 'currentAuthenticatedUser').mockImplementation(async () => ({
  attributes: {
    sub: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
  },
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
