import { render } from '../../helpers/render';
import { EntityList, EntityListView } from './EntityList';
import { useUserEntities } from '../../hooks/useUserEntities/useUserEntities';
import { Mock } from 'vitest';
vi.mock('../../hooks/useUserEntities/useUserEntities', () => ({
  useUserEntities: vi.fn(),
}));
describe('EntityList', () => {
  it('should render successfully', async () => {
    (useUserEntities as Mock).mockReturnValue({
      userEntities: [{ id: 1, name: 'Entity 1' }],
    });
    const { baseElement } = render(
      <EntityList mode={EntityListView.CARD_VIEW} />
    );
    // await waitFor(() => {
    expect(baseElement).toBeTruthy();
    // });
  });
});
