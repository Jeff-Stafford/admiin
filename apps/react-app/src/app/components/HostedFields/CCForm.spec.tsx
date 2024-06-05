import { render } from '../../helpers/render';
import { CCForm } from './CCForm';
import * as useHostFieldsModule from './useHostedFields';
// Mock the assembly object and its methods
const mockHostedFields = {
  create: vi.fn().mockImplementation((fieldType, options) => ({
    mount: vi.fn(),
    on: vi.fn((event, callback) => {
      console.log();
    }),
  })),
  destroy: vi.fn(),
};
describe('CCForm', () => {
  beforeEach(() => {
    vi.spyOn(useHostFieldsModule, 'useHostedFields').mockImplementation(() => ({
      //@ts-ignore
      fieldStyles: {},
      token: '',
      user_id: '',
      fetchTokenUserId: vi.fn(),
    }));
    // Clear all mocks and set up a fresh mock for assembly on the window object
    vi.clearAllMocks();

    // Assign the mock assembly object to window
    Object.defineProperty(window, 'assembly', {
      value: {
        hostedFields: vi.fn().mockImplementation(() => mockHostedFields),
      },
      writable: true,
    });
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <CCForm
        onSuccess={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
