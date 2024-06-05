import { waitFor } from '@testing-library/react';
import { render } from '../../../helpers/render';
import { EntityTableList } from './EntityTableList';
import { TotalAmountContext } from '../EntityList';
describe('EntityTableList', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <TotalAmountContext.Provider value={{ amounts: [], setAmounts: vi.fn() }}>
        <EntityTableList loading={false} entities={[]} />
      </TotalAmountContext.Provider>
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
