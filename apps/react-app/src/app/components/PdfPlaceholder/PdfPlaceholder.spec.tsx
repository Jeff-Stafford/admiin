import { render } from '@testing-library/react';

import PdfPlaceholder from './PdfPlaceholder';

describe('PdfPlaceholder', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PdfPlaceholder customData={{}} />);
    expect(baseElement).toBeTruthy();
  });
});
