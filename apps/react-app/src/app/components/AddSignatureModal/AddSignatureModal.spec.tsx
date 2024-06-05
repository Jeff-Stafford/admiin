import { render } from '../../helpers/render';
import AddSignatureModal from './AddSignatureModal';

describe('AddSignatureModal', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <AddSignatureModal
        open={false}
        handleClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
