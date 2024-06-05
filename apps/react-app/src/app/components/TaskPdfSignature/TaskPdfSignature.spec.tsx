import { render } from '../../helpers/render';
import TaskPdfSignature from './TaskPdfSignature';
import * as useTaskBoxContextModule from '../../pages/TaskBox/TaskBox';

describe('TaskPdfSignature', () => {
  beforeEach(() => {
    vi.spyOn(useTaskBoxContextModule, 'useTaskBoxContext').mockImplementation(
      () => ({
        selectedTasks: [],
        multiSelect: vi.fn(),
        setMultiShow: vi.fn(),
        selectedTask: null,
        setSelectedTask: vi.fn(),
        getBillPayments: vi.fn(),
        pdfSignatureRef: null,
      })
    );
  });
  it('should render successfully', () => {
    const { baseElement } = render(<TaskPdfSignature task={null} />);
    expect(baseElement).toBeTruthy();
  });
});
