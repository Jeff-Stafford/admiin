import { render } from '../../helpers/render';
import { TaskDetailCard } from './TaskDetailCard';

describe('TaskDetailCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TaskDetailCard task={null} />);
    expect(baseElement).toBeTruthy();
  });
});
