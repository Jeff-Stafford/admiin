import { render } from '@testing-library/react';

import InformationIcon from './InformationIcon';

describe('InformationIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InformationIcon />);
    expect(baseElement).toBeTruthy();
  });
});
