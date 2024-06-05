import { render } from '@testing-library/react';
import { EntityCardList } from './EntityCardList';
import { TotalAmountContext } from '../EntityList';
describe('EntityCardList', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <TotalAmountContext.Provider value={{ amounts: [], setAmounts: vi.fn() }}>
        <EntityCardList loading={false} entities={[]} />
      </TotalAmountContext.Provider>
    );
    expect(baseElement).toBeTruthy();
  });
});
