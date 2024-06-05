import { render } from '@testing-library/react';

import { S3ImageCarousel } from './S3ImageCarousel';

describe('S3ImageCarousel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <S3ImageCarousel images={[]} mediaAspectRatio={3 / 4} />
    );
    expect(baseElement).toBeTruthy();
  });
});
