import { render } from '../../helpers/render';
import { TotalAmountContext } from '../EntityList/EntityList';
import { EntityCardItem } from './EntityCardItem';

describe('EntityCardItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <TotalAmountContext.Provider value={{ amounts: [], setAmounts: vi.fn() }}>
        <EntityCardItem />
      </TotalAmountContext.Provider>
    );
    expect(baseElement).toBeTruthy();
  });
});
