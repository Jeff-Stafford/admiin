import { render } from '../../helpers/render';
import RemoveEntityUserModal from './RemoveEntityUserModal';

describe('RemoveEntityUserModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <RemoveEntityUserModal
        open={false}
        handleClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
