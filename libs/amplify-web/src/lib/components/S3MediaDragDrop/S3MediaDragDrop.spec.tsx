import { Image } from '@admiin-com/ds-common';
import { render } from '@testing-library/react';

import { S3MediaDragDrop } from './S3MediaDragDrop';

describe('S3MediaDragDrop', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <S3MediaDragDrop
        inputAccept="images/*"
        onImageUpload={(image: Image) => console.log('image uploaded: ', image)}
        uploadBtnText="Upload"
        uploadMessage="Drag n Drop images to upload"
        validFileTypes={['image/jpeg', 'image/png', 'video/webm']}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
