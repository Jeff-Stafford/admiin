import { render } from '@testing-library/react';

import PageSelector from './PageSelector';

describe('PageSelector', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PageSelector current={undefined} children={undefined} />
    );
    expect(baseElement).toBeTruthy();
  });
});
