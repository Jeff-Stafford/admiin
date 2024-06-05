import { render } from '../../helpers/render';
import { CsvMapFields } from './CsvMapFields';

describe('CsvMapFields', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CsvMapFields fileKey="" />);
    expect(baseElement).toBeTruthy();
  });
});
