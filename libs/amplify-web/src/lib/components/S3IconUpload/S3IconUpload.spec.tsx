import { Image } from '@admiin-com/ds-common';
import { render } from '@testing-library/react';

import { S3IconUpload } from './S3IconUpload';

describe('S3IconUpload', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <S3IconUpload
        icon="Add"
        inputAccept="images/*"
        validFileTypes={['image/jpeg', 'image/png', 'video/webm']}
        onUpload={(image: Image) => console.log('image uploaded: ', image)}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
