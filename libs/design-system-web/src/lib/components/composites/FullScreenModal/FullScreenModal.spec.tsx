import { render } from '@testing-library/react';

import { FullScreenModal } from './FullScreenModal';

describe('FullScreenModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <FullScreenModal open leftToolbarIcon={undefined} />
    );
    expect(baseElement).toBeTruthy();
  });
});
