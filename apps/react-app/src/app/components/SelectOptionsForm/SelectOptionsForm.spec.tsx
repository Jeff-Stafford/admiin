import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { SelectOptionsForm } from './SelectOptionsForm';

describe('SelectOptionsForm', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <SelectOptionsForm
        category="Interests"
        onSubmit={(data: any) => console.log('onSubmit: ', data)}
        selectedOptions={[]}
      />
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
