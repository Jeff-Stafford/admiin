import AddUserModal from './AddUserModal';
import { render } from '../../helpers/render';

describe('AddUserModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AddUserModal
        open={false}
        handleClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
