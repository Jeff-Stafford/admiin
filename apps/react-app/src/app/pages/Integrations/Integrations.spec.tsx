import { render } from '@admiin-com/ds-web-testing-utils';

import Integrations from './Integrations';

describe('Integrations', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Integrations />);
    expect(baseElement).toBeTruthy();
  });
});
