import { Image } from '@admiin-com/ds-common';
import { render } from '@testing-library/react';
import { S3AvatarUpload } from './S3AvatarUpload';

describe('S3AvatarUpload', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <S3AvatarUpload
        onImageUpload={(image: Image) => console.log('image uploaded: ', image)}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
