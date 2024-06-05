import { waitFor } from '@testing-library/react';
import { render } from '../../../helpers/render';
import { EntityTableListItem } from './EntityTableListItem';
import { TotalAmountContext } from '../EntityList';
describe('EntityTableListItem', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <TotalAmountContext.Provider value={{ amounts: [], setAmounts: vi.fn() }}>
        <EntityTableListItem entity={null} />
      </TotalAmountContext.Provider>
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
