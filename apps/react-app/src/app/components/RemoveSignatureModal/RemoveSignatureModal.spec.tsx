import { render } from '../../helpers/render';
import RemoveSignatureModal from './RemoveSignatureModal';

describe('RemoveSignatureModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <RemoveSignatureModal
        open={false}
        handleClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
