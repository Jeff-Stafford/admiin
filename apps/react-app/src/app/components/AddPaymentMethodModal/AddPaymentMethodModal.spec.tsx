import { render } from '@testing-library/react';

import AddPaymentMethodModal from './AddPaymentMethodModal';

describe('AddPaymentMethodModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AddPaymentMethodModal
        open={false}
        handleClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
