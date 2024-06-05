import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import UserUpdate from './UserUpdate';

// Mock react-router-dom with partial mocking
vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(() => ({
      userId: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
    })),
  };
});

describe('UserUpdate', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<UserUpdate />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
