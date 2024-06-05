import { render } from '@testing-library/react';
import { EntityCardBadge } from './EntityCardBadge';
describe('EntityCardBadge', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <EntityCardBadge amount={0} color="warning" />
    );
    expect(baseElement).toBeTruthy();
  });
});
