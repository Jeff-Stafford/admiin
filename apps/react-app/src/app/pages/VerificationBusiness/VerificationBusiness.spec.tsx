import { render } from '../../helpers/render';
import VerificationBusiness from './VerificationBusiness';

describe('VerificationBusiness', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <VerificationBusiness onSuccess={vi.fn()} />
    );
    expect(baseElement).toBeTruthy();
  });
});
